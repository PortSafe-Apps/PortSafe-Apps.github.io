function previewImageObservasi() {
    var inputObservasi = document.getElementById('fotoObservasi');
    var imgObservasi = document.getElementById('hasilFotoObservasi');
    
    if (inputObservasi.files && inputObservasi.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imgObservasi.src = e.target.result;
            console.log('Data URL:', e.target.result);
        }

        reader.readAsDataURL(inputObservasi.files[0]);
    }
}

function previewImagePerbaikan() {
    var inputPerbaikan = document.getElementById('fotoPerbaikan');
    var imgPerbaikan = document.getElementById('hasilFotoPerbaikan');
    
    if (inputPerbaikan.files && inputPerbaikan.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imgPerbaikan.src = e.target.result;
        }

        reader.readAsDataURL(inputPerbaikan.files[0]);
    }
}