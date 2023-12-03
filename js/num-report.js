let hasilgenerate = '';

const generateNomorPelaporan = () => {
    const tahunSekarang = new Date().getFullYear();
    const nomorUrut = 1;
    const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
    return nomorPelaporan;
};

const resetNomorPelaporan = () => {
    hasilgenerate = generateNomorPelaporan();
    const nomorPelaporanElement = document.getElementById('nomorPelaporan');

    if (nomorPelaporanElement) {
        nomorPelaporanElement.value = hasilgenerate;
    } else {
        console.error("Element with id 'nomorPelaporan' not found.");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const tombolBuatLaporanBaru = document.getElementById('tombolBuatLaporanBaru');

    if (tombolBuatLaporanBaru) {
        tombolBuatLaporanBaru.addEventListener('click', resetNomorPelaporan);
    } else {
        console.error("Element with id 'tombolBuatLaporanBaru' not found.");
    }
});

export function simpanngenerate() {
    console.log('Hasil Generate:', hasilgenerate);
    return hasilgenerate;
}
