export const generateNomorPelaporan = () => {
  const tahunSekarang = new Date().getFullYear();
  const nomorUrut = 1;
  const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
  return nomorPelaporan;
};

export const resetNomorPelaporan = () => {
  document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
};

document.addEventListener('DOMContentLoaded', function () {
  const nomorPelaporanElement = document.getElementById('nomorPelaporan');

  if (nomorPelaporanElement) {
      nomorPelaporanElement.value = generateNomorPelaporan();
  } else {
      console.error("Elemen dengan ID 'nomorPelaporan' tidak ditemukan");
  }
});

document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);
