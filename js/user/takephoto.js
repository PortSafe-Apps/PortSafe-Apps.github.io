const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];

    if (fileInput) {
        const formData = new FormData();
        formData.append('image', fileInput);

        fetch('https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/uploadImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Server akan mengembalikan objek JSON yang mungkin berisi URL gambar
            const imageUrl = data.url;

            // Menetapkan URL sebagai sumber gambar
            tampilkanGambarDariUrl(imageUrl, imgHasilFotoObservasi);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function tampilkanGambarDariUrl(imageUrl, imgElement) {
    // Menetapkan URL sebagai sumber gambar
    imgElement.src = imageUrl;
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoObservasi saat ada perubahan pada input file
inputFotoObservasi.addEventListener('change', ambilFotoObservasi);


const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];

    if (fileInput) {
        const formData = new FormData();
        formData.append('image', fileInput);

        fetch('https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/uploadImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Server akan mengembalikan objek JSON yang mungkin berisi URL gambar
            const imageUrl = data.url;

            // Menetapkan URL sebagai sumber gambar
            tampilkanGambarDariUrl(imageUrl, imgHasilFotoPerbaikan);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoPerbaikan saat ada perubahan pada input file
inputFotoPerbaikan.addEventListener('change', ambilFotoPerbaikan);
