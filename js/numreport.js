const generateNomorPelaporan = () => {
    const tahunSekarang = new Date().getFullYear();
    const nomorUrut = 1;
    const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
    return nomorPelaporan;
  };
  document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
  
  const resetNomorPelaporan = () => {
    document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
  };
  document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);