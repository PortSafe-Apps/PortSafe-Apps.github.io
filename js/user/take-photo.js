const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');
let fotoObservasiDataURL = null; // Variabel untuk menyimpan URL data gambar

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        fotoObservasiDataURL = reader.result;

        // Set the source of the image directly
        imgHasilFotoObservasi.src = fotoObservasiDataURL;

        // You can use fotoObservasiDataURL in other ways (e.g., send to the server)
        console.log(fotoObservasiDataURL);
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}





const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const fotoPerbaikanBase64 = reader.result;

        // Set the source of the image directly
        imgHasilFotoPerbaikan.src = fotoPerbaikanBase64;

        // You can use fotoPerbaikanBase64 in other ways (e.g., send to the server)
        console.log(fotoPerbaikanBase64);
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}

document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);

