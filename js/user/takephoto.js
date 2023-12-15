const inputFotoObservasi = document.getElementById('fotoObservasi');
const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');
const inputFotoPerbaikan = document.getElementById('fotoPerbaikan');
const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');

function ambilFoto(inputElement, imgElement) {
    const fileInput = inputElement.files[0];

    if (fileInput) {
        const formData = new FormData();
        formData.append('image', fileInput);

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

function extractImageUrl(responseText) {
    const urlPattern = /URL publik: (\S+)/;
    const match = responseText.match(urlPattern);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

function tampilkanGambarDariUrl(imageUrl, imgElement) {
    imgElement.src = imageUrl;
}

inputFotoObservasi.addEventListener('change', function() {
    ambilFoto(inputFotoObservasi, imgHasilFotoObservasi);
});

inputFotoPerbaikan.addEventListener('change', function() {
    ambilFoto(inputFotoPerbaikan, imgHasilFotoPerbaikan);
});
