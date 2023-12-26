// Fungsi untuk menampilkan jumlah total data report per bulan
const displaySumReportsPerMonth = (data, containerId) => {
    const monthlyReportsElement = document.getElementById(containerId);

    if (!monthlyReportsElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Hitung jumlah total data report per bulan
    const today = new Date();
    const thisMonth = today.getMonth();
    const totalReportsPerMonth = data.reduce((acc, report) => {
        const reportDate = new Date(report.date);
        if (reportDate.getMonth() === thisMonth && reportDate.getFullYear() === today.getFullYear()) {
            acc++;
        }
        return acc;
    }, 0);

    // Tampilkan jumlah total data report per bulan
    monthlyReportsElement.innerText = totalReportsPerMonth;
};

// Fungsi untuk mengambil data dari API dan jumlah data laporan yang telah dibuat per bulan
const getallUserReportWithTokenPerMonth = async () => {
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
            // Panggil fungsi untuk menampilkan jumlah total data report per bulan di dalam elemen dengan ID 'monthly-reports'
            displaySumReportsPerMonth(data.data, 'monthly-reports');
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan per bulan
getallUserReportWithTokenPerMonth();
