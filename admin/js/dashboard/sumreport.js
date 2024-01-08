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
const displaySumReports = (data, containerId) => {
    const totalReportsElement = document.getElementById(containerId);

    if (!totalReportsElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    const totalReports = data.length;

    // Tampilkan jumlah total data report
    totalReportsElement.innerText = totalReports;
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
        const data = await response.json();

        if (data.status === 200) {
            // Panggil fungsi untuk menampilkan jumlah total data report di dalam elemen dengan ID 'total-reports'
            displaySumReports(data.data, 'total-reports');
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan
getallUserReportWithToken();
