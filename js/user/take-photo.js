const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const fileInput = inputFotoObservasi.files[0];

    if (fileInput) {
        const reader = new FileReader();

        reader.onloadend = function () {
            const imageData = reader.result;
            const blob = dataURLtoBlob(imageData);

            // Menetapkan blob sebagai sumber gambar
            tampilkanGambarDariBlob(blob);
        };

        reader.readAsDataURL(fileInput);
    }
}

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

function tampilkanGambarDariBlob(blob) {
    const blobUrl = URL.createObjectURL(blob);

    // Menetapkan URL sebagai sumber gambar
    imgHasilFotoObservasi.src = blobUrl;

    // Pastikan untuk membebaskan sumber daya
    URL.revokeObjectURL(blobUrl);
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoObservasi saat ada perubahan pada input file
inputFotoObservasi.addEventListener('change', ambilFotoObservasi);



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

        // Call the convertToUrlPerbaikan function to perform additional actions
        convertToUrlPerbaikan();
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    }
}

// Menambahkan event listener untuk memanggil fungsi ambilFotoPerbaikan saat ada perubahan pada input file
document.getElementById('fotoPerbaikan').addEventListener('change', ambilFotoPerbaikan);

// Fungsi untuk mengonversi gambar menjadi URL
function convertToUrlPerbaikan() {
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
