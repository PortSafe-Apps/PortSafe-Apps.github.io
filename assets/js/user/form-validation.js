document.addEventListener("DOMContentLoaded", function () {
    // Temukan formulir dan tombol submit
    var form = document.getElementById('newReportForm');
    var submitButton = form.querySelector('button[type="submit"]');
    var tanggalPelaporan = document.getElementById('tanggalPelaporan');
  
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
  
      // Cek apakah semua checkbox pada bagian tindakan pencegahan tercentang
      var areAllCheckboxesChecked = areAllCheckboxesSelected();
  
      // Aktifkan atau nonaktifkan tombol submit berdasarkan kevalidan input dan checkbox
      submitButton.disabled = !(allInputsValid && areAllCheckboxesChecked);
  
      // Ubah warna tombol sesuai dengan keadaan formulir
      if (allInputsValid && areAllCheckboxesChecked) {
        submitButton.classList.remove('btn-secondary');
        submitButton.classList.add('btn-primary');
      } else {
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-secondary');
      }
    });
  
    // Mendapatkan tanggal saat ini
    var tanggalSekarang = new Date();
  
    // Membuat fungsi untuk memformat tanggal ke format dd/mm/yyyy
    function formatDate(date) {
      var day = date.getDate().toString().padStart(2, '0');
      var month = (date.getMonth() + 1).toString().padStart(2, '0');
      var year = date.getFullYear();
  
      return year + '-' + month + '-' + day;
    }
  
    // Mengatur nilai input tanggal menjadi tanggal saat ini dengan format yang diinginkan
    tanggalPelaporan.value = formatDate(tanggalSekarang);
  
    // Panggil event input untuk memastikan validasi dijalankan saat halaman dimuat
    form.dispatchEvent(new Event('input'));
  });
  
  // Fungsi untuk memeriksa apakah semua checkbox pada bagian tindakan pencegahan tercentang
  function areAllCheckboxesSelected() {
    var checkboxes = document.querySelectorAll('.form-group[for="checkedCheckbox"] .form-check-input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].hasAttribute('required') && !checkboxes[i].checked) {
        return false;
      }
    }
    return true;
  }
  