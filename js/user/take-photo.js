const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const fotoObservasiBase64 = reader.result;

        // Create an image element to manipulate the image
        const img = new Image();
        img.src = fotoObservasiBase64;

        img.onload = function () {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set the canvas dimensions to resize the image
            canvas.width = 400; // Set the desired width
            canvas.height = (400 * img.height) / img.width; // Maintain the aspect ratio

            // Draw the image on the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get the data URL with lower quality
            const dataURL = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.0 to 1.0)

            // Set the source of the image directly
            imgHasilFotoObservasi.src = dataURL;

            // You can use dataURL in other ways (e.g., send to the server)
            console.log(dataURL);
        };
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

