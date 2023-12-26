// Fungsi untuk menampilkan jumlah total data report dengan progress bar
const displayUserReports = (data, containerId) => {
    const userActiveElement = document.getElementById(containerId);

    if (!userActiveElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Hapus semua elemen anak dari userActiveElement
    userActiveElement.innerHTML = '';

    // Membuat objek untuk menyimpan jumlah laporan setiap user
    const userReportsCount = {};

    // Menghitung jumlah laporan setiap user
    data.forEach((report) => {
        const userId = report.user.nipp;

        if (!userReportsCount[userId]) {
            userReportsCount[userId] = 1;
        } else {
            userReportsCount[userId]++;
        }
    });

    // Mengurutkan user berdasarkan jumlah laporan dari yang terbanyak
    const sortedUsers = Object.keys(userReportsCount).sort((a, b) => userReportsCount[b] - userReportsCount[a]);

    // Membuat elemen untuk setiap user dan menambahkannya ke userActiveElement
    sortedUsers.forEach((userId) => {
        const reportsCount = userReportsCount[userId];

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const heading = document.createElement('h4');
        heading.classList.add('small', 'font-weight-bold');
        heading.innerText = `User ID: ${userId} - Nama: ${data.find(report => report.user.nipp === userId)?.user.nama || 'Nama Tidak Ditemukan'}`;

        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress', 'mb-4');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar', 'bg-info');
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('style', `width: ${reportsCount}%`);

        // Tambahkan progressBar ke progressBarContainer
        progressBarContainer.appendChild(progressBar);

        // Tambahkan cardBody, heading, dan progressBarContainer ke userActiveElement
        cardBody.appendChild(heading);
        cardBody.appendChild(progressBarContainer);
        userActiveElement.appendChild(cardBody);
    });
};

// Fungsi untuk mengambil data dari API dan jumlah data laporan yang telah dibuat
const getallUserReportWithToken = async () => {
    const token = getTokenFromCookies('Login');

    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Authentication Error',
            text: 'Kamu Belum Login!',
        }).then(() => {
            window.location.href = 'https://portsafe-apps.github.io/';
        });
        return;
    }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const result = await response.json();
        displayUserReports(result, 'userActive');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan
getallUserReportWithToken();
