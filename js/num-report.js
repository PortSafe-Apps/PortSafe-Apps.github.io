// num-report.js

export const generateNomorPelaporan = () => {
  const tahunSekarang = new Date().getFullYear();
  const nomorUrut = 1;
  const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
  return nomorPelaporan;
};

export const resetNomorPelaporan = () => {
  const nomorPelaporanElement = document.getElementById('nomorPelaporan');

  if (nomorPelaporanElement) {
      nomorPelaporanElement.value = generateNomorPelaporan();
      // Periksa apakah ada event listener sebelum menambahkannya
      if (!nomorPelaporanElement.hasAttribute('data-event-listener-added')) {
          // Tambahkan event listener hanya jika belum ditambahkan sebelumnya
          nomorPelaporanElement.addEventListener('change', function () {
              // Callback ketika nilai berubah
              console.log('Nilai nomor pelaporan berubah menjadi: ', nomorPelaporanElement.value);
          });
          // Tandai bahwa event listener sudah ditambahkan
          nomorPelaporanElement.setAttribute('data-event-listener-added', 'true');
      }
  } else {
      console.error("Elemen dengan ID 'nomorPelaporan' tidak ditemukan");
  }
};

document.addEventListener('DOMContentLoaded', function () {
  resetNomorPelaporan(); // Panggil fungsi resetNomorPelaporan saat DOM selesai dimuat
});

document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);
