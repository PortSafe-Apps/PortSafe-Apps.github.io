const generateNomorPelaporan = (() => {
  let nomorUrut = 1;

  return () => {
      const tahunSekarang = new Date().getFullYear();
      const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
      nomorUrut++;
      return nomorPelaporan;
  };
})();

document.getElementById('nomorPelaporan').value = generateNomorPelaporan();

const resetNomorPelaporan = () => {
  document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
};

document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);
