const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const fotoObservasiBase64 = reader.result;
        imgHasilFotoObservasi.src = URL.createObjectURL(fileInput);
        simpanFotoObservasi(fotoObservasiBase64);

        document.getElementById('hasilFotoObservasi').src = fotoObservasiBase64;
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}

document.getElementById('fotoObservasi').addEventListener('change', ambilFotoObservasi);

const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const fotoPerbaikanBase64 = reader.result;
        imgHasilFotoPerbaikan.src = URL.createObjectURL(fileInput);
        // Menyimpan string base64 ke dalam variabel atau objek yang dapat diakses di fungsi insertObservationReport
        simpanFotoPerbaikan(fotoPerbaikanBase64);
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}
document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);

let fotoObservasiBase64 = '';
let fotoPerbaikanBase64 = '';

// Fungsi untuk menyimpan string base64
function simpanFotoObservasi(base64) {
    fotoObservasiBase64 = base64;
}

function simpanFotoPerbaikan(base64) {
    fotoPerbaikanBase64 = base64;
}