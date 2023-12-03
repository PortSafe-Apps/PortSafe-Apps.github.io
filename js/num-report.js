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
  } else {
      console.error("Elemen dengan ID 'nomorPelaporan' tidak ditemukan");
  }
};

document.addEventListener('DOMContentLoaded', function () {
  resetNomorPelaporan(); // Panggil fungsi resetNomorPelaporan saat DOM selesai dimuat
});

document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);
