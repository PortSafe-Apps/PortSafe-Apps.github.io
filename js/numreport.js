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

document.addEventListener('DOMContentLoaded', () => {
    // Check if the element exists before adding the event listener
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

