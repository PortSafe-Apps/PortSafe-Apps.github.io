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
        .then(response => response.text())  // Mengambil teks dari respons
        .then(data => {
            // Menampilkan respons di console (opsional)
            console.log("Server Response:", data);

            // Menampilkan respons ke pengguna (misalnya, sebagai pemberitahuan di halaman web)
            alert(data);

            // Jika respons berisi URL gambar, Anda dapat mengekstraknya dan menetapkan sebagai sumber gambar
            const imageUrl = extractImageUrlFromResponse(data);
            if (imageUrl) {
                imgHasilFotoObservasi.src = imageUrl;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Fungsi untuk mengekstrak URL gambar dari respons teks
function extractImageUrlFromResponse(responseText) {
    const urlMatch = responseText.match(/URL publik: (\S+)/);
    return urlMatch ? urlMatch[1] : null;
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
        .then(response => response.text())  // Mengambil teks dari respons
        .then(data => {
            // Menampilkan respons di console (opsional)
            console.log("Server Response:", data);

            // Menampilkan respons ke pengguna (misalnya, sebagai pemberitahuan di halaman web)
            alert(data);

            // Jika respons berisi URL gambar, Anda dapat mengekstraknya dan menetapkan sebagai sumber gambar
            const imageUrl = extractImageUrlFromResponse(data);
            if (imageUrl) {
                imgHasilFotoPerbaikan.src = imageUrl;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Fungsi untuk mengekstrak URL gambar dari respons teks
function extractImageUrlFromResponse(responseText) {
    const urlMatch = responseText.match(/URL publik: (\S+)/);
    return urlMatch ? urlMatch[1] : null;
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoPerbaikan saat ada perubahan pada input file
inputFotoPerbaikan.addEventListener('change', ambilFotoPerbaikan);

