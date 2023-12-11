const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};

const showAlert = (message, type = 'success') => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

// Fungsi untuk mengonversi blob URL menjadi base64 dan kompres dengan Brotli
async function convertBlobUrlToBase64AndCompress(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]; // Ambil bagian base64 saja
      const compressedBase64 = compressBase64WithBrotli(base64);
      resolve(compressedBase64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Fungsi untuk melakukan kompresi Brotli pada data base64
function compressBase64WithBrotli(base64String) {
  // Lakukan kompresi dengan Brotli
  const compressedData = new TextEncoder().encode(base64String);
  const compressedBase64 = String.fromCharCode.apply(null, Brotli.compress(compressedData));
  return compressedBase64;
}

// Fungsi untuk mendapatkan blob URL dari elemen gambar
function getBlobUrlFromImageElement(elementId) {
  const imgElement = document.getElementById(elementId);
  if (imgElement.src.startsWith('blob:')) {
    return imgElement.src;
  }
}


const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    showAlert("Header Login Not Found", 'error');
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  try {
    function getCheckedCheckboxes() {
      var checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
      var checkedValues = [];

      checkboxes.forEach(function (checkbox) {
        var typeId = checkbox.name;
        var typeName = checkbox.dataset.typeName; // Mengambil Type Name dari dataset

        checkedValues.push({
          TypeId: typeId,
          TypeName: typeName,
          SubTypes: [checkbox.value]
        });
      });

      return checkedValues;
    }

    // Menggunakan fungsi untuk mendapatkan blob URL, mengonversinya ke base64, dan mengompresi dengan Brotli
    const fotoObservasiBlobUrl = getBlobUrlFromImageElement('hasilFotoObservasi');
    const compressedFotoObservasiBase64 = await convertBlobUrlToBase64AndCompress(fotoObservasiBlobUrl);
 
    // Mengonversi blob URL gambar perbaikan menjadi base64
    const fotoPerbaikanBlobUrl = getBlobUrlFromImageElement('hasilFotoPerbaikan');
    const compressedFotoPerbaikanBase64 = await convertBlobUrlToBase64AndCompress(fotoPerbaikanBlobUrl);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        Reportid: document.getElementById('nomorPelaporan').value,
        Date: document.getElementById('tanggalPelaporan').value,
        User: {},
        Location: {
          LocationName: document.getElementById('autoCompleteLocation').value,
        },
        Description: document.getElementById('deskripsiPengamatan').value,
        ObservationPhoto: compressedFotoObservasiBase64,
        TypeDangerousActions: getCheckedCheckboxes(),
        Area: {
          AreaName: document.getElementById('newAreaName').value,
        },
        ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
        ImprovementPhoto: compressedFotoPerbaikanBase64,
        CorrectiveAction: document.getElementById('deskripsiPencegahanTerulangKembali').value,
      }),
      redirect: 'follow',
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === false) {
      showAlert(data.message, 'error');
    } else {
      showAlert("Data Pelaporan Berhasil di Input!", 'success');
      window.location.href = 'https://portsafe-apps.github.io/pages/user/listreport.html';
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);
