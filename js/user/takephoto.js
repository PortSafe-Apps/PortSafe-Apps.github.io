// Fungsi untuk menghasilkan angka acak antara 1 dan 1000
function generateRandomID() {
    return Math.floor(Math.random() * 1000) + 1;
}

// Fungsi untuk mengambil foto dan mengunggahnya
function ambilFoto(inputElement, imgElement) {
    const fileInput = inputElement.files[0];

    if (fileInput) {
        const formData = new FormData();

        // Mendapatkan jenis foto dari atribut data-jenis pada elemen input
        const jenisFoto = inputElement.getAttribute('data-jenis');

        // Generate ID acak berdasarkan jenis foto
        const randomID = generateRandomID();

        // Generate nama file yang unik dengan awalan sesuai jenis foto
        const uniqueFileName = `${jenisFoto}${randomID}_${fileInput.name}`;

        formData.append('image', fileInput, uniqueFileName);

        fetch('https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/uploadImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            const imageUrl = extractImageUrl(data);

            if (imageUrl) {
                tampilkanGambarDariUrl(imageUrl, imgElement);
            } else {
                console.error('Tidak dapat menemukan URL gambar dalam respons server.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Fungsi untuk mengekstrak URL gambar dari respons server
function extractImageUrl(responseText) {
    const urlPattern = /URL publik:(.*)/; // Ekspresi regex untuk menangkap setiap karakter setelah "URL publik:"
    const match = responseText.match(urlPattern);

    if (match && match[1]) {
        const imageUrl = match[1].trim();
        return imageUrl;
    } else {
        return null;
    }
}

// Fungsi untuk menampilkan gambar dari URL
function tampilkanGambarDariUrl(imageUrl, imgElement) {
    imgElement.src = imageUrl;
}

// Gunakan fungsi tersebut saat memanggil ambilFotoObservasi untuk foto observasi
inputFotoObservasi.addEventListener('change', function() {
    ambilFoto(inputFotoObservasi, imgHasilFotoObservasi);
});

// Gunakan fungsi tersebut saat memanggil ambilFotoPerbaikan untuk foto perbaikan
inputFotoPerbaikan.addEventListener('change', function() {
    ambilFoto(inputFotoPerbaikan, imgHasilFotoPerbaikan);
});
