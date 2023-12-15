const fotoObservasiInput = document.getElementById('fotoObservasi');
const hasilFotoObservasi = document.getElementById('hasilFotoObservasi');
const fotoPerbaikanInput = document.getElementById('fotoPerbaikan');
const hasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

// Fungsi untuk mengambil foto dari file
const ambilFotoDariFile = (inputElement, imageViewElement) => {
  inputElement.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageViewElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
};

// Fungsi untuk mengambil foto dari kamera
const ambilFotoDariKamera = (inputElement, imageViewElement) => {
  inputElement.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/uploadImage', {
        method: 'PUT',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          // Dapatkan URL dari respons server dan tetapkan ke elemen gambar
          imageViewElement.src = data.url;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
};

// Panggil fungsi untuk kedua input foto
ambilFotoDariFile(fotoObservasiInput, hasilFotoObservasi);
ambilFotoDariKamera(fotoObservasiInput, hasilFotoObservasi);
ambilFotoDariFile(fotoPerbaikanInput, hasilFotoPerbaikan);
ambilFotoDariKamera(fotoPerbaikanInput, hasilFotoPerbaikan);