const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const fotoObservasiBase64 = reader.result;

        // Set the source of the image directly
        imgHasilFotoObservasi.src = fotoObservasiBase64;

        // Create a link from the base64-encoded image data
        const linkElement = document.createElement('a');
        linkElement.href = fotoObservasiBase64;
        linkElement.download = 'image.png'; // You can set the download attribute if you want to make it downloadable
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        // You can use fotoObservasiBase64 in other ways (e.g., send to the server)
        console.log(fotoObservasiBase64);
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

