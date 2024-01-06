// Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

// Fungsi untuk menampilkan jumlah total data report
const displaySumReports = (combinedTotalReports, containerId) => {
    const totalReportsElement = document.getElementById(containerId);

    if (!totalReportsElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Tampilkan jumlah total data report
    totalReportsElement.innerText = combinedTotalReports;
};

// Fungsi untuk mengambil data dari API dan jumlah data laporan yang telah dibuat
const getAllUserReports = async (token, targetURL) => {
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === 200) {
            return data.data.length; // Return the number of reports for this URL
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
            return 0; // Return 0 if there is an error
        }
    } catch (error) {
        console.error('Error:', error);
        return 0; // Return 0 if there is an error
    }
};

// Fungsi untuk menghitung total laporan dari kedua URL dan menampilkan hasilnya
const calculateAndDisplayTotalReports = async () => {
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

    const url1 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser';
    const url2 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    // Call the function for the first URL and get the number of reports
    const totalReportsUrl1 = await getAllUserReports(token, url1);

    // Call the function for the second URL and get the number of reports
    const totalReportsUrl2 = await getAllUserReports(token, url2);

    // Calculate the combined total
    const combinedTotalReports = totalReportsUrl1 + totalReportsUrl2;

    // Display the combined total
    displaySumReports(combinedTotalReports, 'combined-total-reports');
};

// Panggil fungsi untuk menghitung total laporan dari kedua URL dan menampilkan hasilnya
calculateAndDisplayTotalReports();
