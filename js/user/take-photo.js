const i = document.getElementById('fotoObservasi');
const m = document.getElementById('hasilFotoObservasi');

function ambilFotoObservasi() {
    const e = i.files[0];
    if (e) {
        const t = new FileReader();
        t.onloadend = function () {
            const fotoObservasiBase64 = t.result.split(',')[1];
            const compressedURL = compressToURL(fotoObservasiBase64);
            m.src = compressedURL;
            console.log(compressedURL);
        };
        t.readAsDataURL(e);
    }
}

function compressToURL(data) {
    // Menggunakan Base64URL (mengganti karakter '+' dan '/' dengan '-' dan '_')
    return `data:image/png;base64,${data.replace(/\+/g, '-').replace(/\//g, '_')}`;
}

i.addEventListener('change', ambilFotoObservasi);



const o = document.getElementById('fotoPerbaikan');
const n = document.getElementById('hasilFotoPerbaikan');

function ambilFotoPerbaikan() {
    const e = o.files[0];
    if (e) {
        const t = new FileReader();
        t.onloadend = function () {
            const fotoPerbaikanBase64 = t.result.split(',')[1];
            const compressedURL = compressToURL(fotoPerbaikanBase64);
            n.src = compressedURL;
            console.log(compressedURL);
        };
        t.readAsDataURL(e);
    }
}

function compressToURL(data) {
    // Menggunakan Base64URL (mengganti karakter '+' dan '/' dengan '-' dan '_')
    return `data:image/png;base64,${data.replace(/\+/g, '-').replace(/\//g, '_')}`;
}

o.addEventListener('change', ambilFotoPerbaikan);




