let hasilgenerate = '';

const generateNomorPelaporan = () => {
    const tahunSekarang = new Date().getFullYear();
    const nomorUrut = 1; // You may want to dynamically generate this value
    const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
    return nomorPelaporan;
};

const resetNomorPelaporan = () => {
    hasilgenerate = generateNomorPelaporan();
    document.getElementById('nomorPelaporan').value = hasilgenerate;
};

document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);


export function simpanngenerate() {
    console.log('Hasil Generate:', hasilgenerate);
    return hasilgenerate;
}
