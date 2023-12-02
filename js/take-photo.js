const inputFotoObservasi = document.getElementById('fotoObservasi');
    const videoObservasi = document.getElementById('videoObservasi');
    const canvasObservasi = document.getElementById('canvasObservasi');
    const imgHasilFotoObservasi = document.getElementById('hasilFotoObservasi');
    let fotoObservasiBase64 = ''; // Variabel untuk menyimpan data foto dalam bentuk string base64

    inputFotoObservasi.addEventListener('change', () => {
        openCameraObservasi();
    });

    function openCameraObservasi() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoObservasi.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing camera:', error);
            });
    }

    videoObservasi.addEventListener('loadedmetadata', () => {
        videoObservasi.play();
    });

    inputFotoObservasi.addEventListener('change', async () => {
        const stream = videoObservasi.srcObject;
        const track = stream.getTracks()[0];

        const imageCapture = new ImageCapture(track);

        const photoBlob = await imageCapture.takePhoto();
        const photoUrl = URL.createObjectURL(photoBlob);

        canvasObservasi.width = videoObservasi.videoWidth;
        canvasObservasi.height = videoObservasi.videoHeight;
        const context = canvasObservasi.getContext('2d');

        context.drawImage(videoObservasi, 0, 0, canvasObservasi.width, canvasObservasi.height);

        fotoObservasiBase64 = canvasObservasi.toDataURL('image/png').split(',')[1];
        imgHasilFotoObservasi.src = `data:image/png;base64,${fotoObservasiBase64}`;

        track.stop();
    });



const inputFoto = document.getElementById('fotoPerbaikan');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const imgHasilFotoPerbaikan = document.getElementById('hasilFotoPerbaikan');
    let fotoPerbaikanBase64 = ''; // Variabel untuk menyimpan data foto dalam bentuk string base64

    inputFoto.addEventListener('change', () => {
        openCamera();
    });

    function openCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing camera:', error);
            });
    }

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    inputFoto.addEventListener('change', async () => {
        const stream = video.srcObject;
        const track = stream.getTracks()[0];

        const imageCapture = new ImageCapture(track);

        const photoBlob = await imageCapture.takePhoto();
        const photoUrl = URL.createObjectURL(photoBlob);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        fotoPerbaikanBase64 = canvas.toDataURL('image/png').split(',')[1];
        imgHasilFotoPerbaikan.src = `data:image/png;base64,${fotoPerbaikanBase64}`;

        track.stop();
    });