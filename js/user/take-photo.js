const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];

    // Set the source of the image using URL.createObjectURL
    imgHasilFotoObservasi.src = URL.createObjectURL(fileInput);

    // You can use fileInput in other ways (e.g., send to the server)
    console.log(fileInput);
}

document.getElementById('fotoObservasi').addEventListener('change', ambilFotoObservasi);


const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];

    // Set the source of the image using URL.createObjectURL
    imgHasilFotoPerbaikan.src = URL.createObjectURL(fileInput);

    // You can use fileInput in other ways (e.g., send to the server)
    console.log(fileInput);
}

document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);

