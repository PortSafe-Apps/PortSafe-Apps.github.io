const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];

    // Set the source of the image using URL.createObjectURL
    const imageUrl = URL.createObjectURL(fileInput);
    imgHasilFotoObservasi.src = imageUrl;

    // Cetak URL ke konsol
    console.log(imageUrl);
}

document.getElementById('fotoObservasi').addEventListener('change', ambilFotoObservasi);


const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];

    // Set the source of the image using URL.createObjectURL
    const imageUrl = URL.createObjectURL(fileInput);
    imgHasilFotoPerbaikan.src = imageUrl;

    // Cetak URL ke konsol
    console.log(imageUrl);
}

document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);
