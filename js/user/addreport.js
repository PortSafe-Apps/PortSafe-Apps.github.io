const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    showAlert("Header Login Not Found", 'error');
    return;
  }

  try {
    function getCheckedCheckboxes() {
      var checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
      var checkedValues = [];

      checkboxes.forEach(function (checkbox) {
        var typeId = checkbox.name;
        var typeName = checkbox.dataset.typeName;

        checkedValues.push({
          TypeId: typeId,
          TypeName: typeName,
          SubTypes: [checkbox.value]
        });
      });

      return checkedValues;
    }

    // Mengambil URL gambar dari elemen imgHasilFotoObservasi
    const observationPhotoUrl = document.getElementById('hasilFotoObservasi').src;

    // Mengambil URL gambar dari elemen imgHasilFotoPerbaikan
    const improvementPhotoUrl = document.getElementById('hasilFotoPerbaikan').src;

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');

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
        ObservationPhoto: observationPhotoUrl,
        TypeDangerousActions: getCheckedCheckboxes(),
        Area: {
          AreaName: document.getElementById('newAreaName').value,
        },
        ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
        ImprovementPhoto: improvementPhotoUrl,
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
