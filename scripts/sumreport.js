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

// Fungsi untuk mengambil data dari API dan jumlah data laporan yang telah dibuat
const getAllUserReports = async (token, targetURL, containerId) => {
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
            // Panggil fungsi untuk menampilkan jumlah total data report di dalam elemen dengan ID containerId
            displaySumReports(data.data, containerId);
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
        }

        return data.data.length; // Return the number of reports for this URL
    } catch (error) {
        console.error('Error:', error);
        return 0; // Return 0 if there is an error
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan
const token = getTokenFromCookies('Login');
if (!token) {
    Swal.fire({
        icon: 'warning',
        title: 'Authentication Error',
        text: 'Kamu Belum Login!',
    }).then(() => {
        window.location.href = 'https://portsafe-apps.github.io/';
    });
} else {
    const url1 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser';
    const url2 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    // Call the function for the first URL and get the number of reports
    const totalReportsUrl1 = await getAllUserReports(token, url1, 'total-reports-url1');

    // Call the function for the second URL and get the number of reports
    const totalReportsUrl2 = await getAllUserReports(token, url2, 'total-reports-url2');

    // Calculate the combined total and display it
    const combinedTotalReports = totalReportsUrl1 + totalReportsUrl2;
    displaySumReports(combinedTotalReports, 'combined-total-reports');
}
