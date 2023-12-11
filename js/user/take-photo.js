const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        // Set the source of the image directly
        imgHasilFotoObservasi.src = reader.result;

        // You can use reader.result in other ways (e.g., send to the server)
        console.log(reader.result);
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}

function convertToUrl() {
    // Mendapatkan elemen input file
    var input = document.getElementById('fotoObservasi');

    // Mengecek apakah file telah dipilih
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        // Menggunakan FileReader untuk membaca konten file sebagai URL data
        reader.onload = function (e) {
            // Menetapkan URL data sebagai sumber gambar
            document.getElementById('hasilFotoObservasi').src = e.target.result;

            // Di sini, Anda dapat melakukan apa pun dengan URL gambar, misalnya mengirimkannya ke server
            // atau menyimpannya di basis data.

            // Contoh: Menampilkan URL di console
            console.log("Image URL:", e.target.result);
        };

        // Membaca konten file sebagai URL data
        reader.readAsDataURL(input.files[0]);
    }
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoObservasi saat ada perubahan pada input file
document.getElementById('fotoObservasi').addEventListener('change', ambilFotoObservasi);



const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const fileInput = inputFotoPerbaikan.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        // Set the source of the image directly
        imgHasilFotoPerbaikan.src = reader.result;

        // You can use reader.result in other ways (e.g., send to the server)
        console.log(reader.result);

        // Call the convertToUrl function to perform additional actions
        convertToUrl();
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoPerbaikan saat ada perubahan pada input file
document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);

// Fungsi untuk mengonversi gambar menjadi URL
function convertToUrl() {
    // Mendapatkan elemen input file
    const input = document.getElementById('fotoPerbaikan');

    // Mengecek apakah file telah dipilih
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        // Menggunakan FileReader untuk membaca konten file sebagai URL data
        reader.onload = function (e) {
            const imageUrl = e.target.result;

            // Menetapkan URL data sebagai sumber gambar
            document.getElementById('hasilFotoPerbaikan').src = imageUrl;

            // Di sini, Anda dapat melakukan apa pun dengan URL gambar, misalnya mengirimkannya ke server
            // atau menyimpannya di basis data.

            // Contoh: Menampilkan URL di console
            console.log("Image URL:", imageUrl);
        };

        // Membaca konten file sebagai URL data
        reader.readAsDataURL(input.files[0]);
    }
}


