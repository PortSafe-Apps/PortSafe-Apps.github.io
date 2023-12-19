document.addEventListener("DOMContentLoaded", function() {
  // Temukan formulir dan tombol submit
  var form = document.getElementById('newReportForm');
  var submitButton = form.querySelector('button[type="submit"]');

  // Tambahkan event listener pada setiap elemen input untuk memeriksa validasi saat nilai berubah
  form.addEventListener('input', function () {
    // Cek setiap elemen input yang diperlukan
    var allInputsValid = true;
    var requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    for (var i = 0; i < requiredInputs.length; i++) {
      if (!requiredInputs[i].value) {
        // Jika ada elemen yang belum terisi, setel allInputsValid menjadi false dan hentikan loop
        allInputsValid = false;
        break;
      }
    }

    // Aktifkan atau nonaktifkan tombol submit berdasarkan kevalidan input
    submitButton.disabled = !allInputsValid;

    // Ubah warna tombol sesuai dengan keadaan formulir
    if (allInputsValid) {
      submitButton.classList.remove('btn-secondary');
      submitButton.classList.add('btn-primary');
    } else {
      submitButton.classList.remove('btn-primary');
      submitButton.classList.add('btn-secondary');
    }
  });

  // Mendapatkan elemen input tanggal
  var inputTanggal = document.getElementById("tanggalPelaporan");

  // Mendapatkan tanggal saat ini
  var tanggalSekarang = new Date();

  // Membuat fungsi untuk memformat tanggal ke format dd-mm-yyyy
  function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Perlu ditambah 1 karena bulan dimulai dari 0
    var year = date.getFullYear();

    // Menambahkan leading zero jika diperlukan
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '-' + month + '-' + year;
  }

  // Mengatur nilai input tanggal menjadi tanggal saat ini dengan format yang diinginkan
  inputTanggal.value = formatDate(tanggalSekarang);
});

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
  });
};

const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    // Tangani kesalahan autentikasi jika tidak ada token
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  // Mengambil URL gambar dari elemen imgHasilFotoObservasi
  const observationPhotoUrl = document.getElementById('hasilFotoObservasi').src;
  // Mengambil URL gambar dari elemen imgHasilFotoPerbaikan
  const improvementPhotoUrl = document.getElementById('hasilFotoPerbaikan').src;

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

    // Kemudian, saat Anda mengirimkan permintaan POST
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
