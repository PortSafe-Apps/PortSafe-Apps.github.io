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

// Fungsi untuk menampilkan jumlah total data report unsafe
const displaySumReportsUnsafe = (unsafeTotalReports, containerId) => {
    const unsafeTotalReportsElement = document.getElementById(containerId);

    if (!unsafeTotalReportsElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Tampilkan jumlah total data report unsafe
    unsafeTotalReportsElement.innerText = unsafeTotalReports;
};

// Fungsi untuk menampilkan jumlah total data report compromised
const displaySumReportsCompromised = (compromisedTotalReports, containerId) => {
    const compromisedTotalReportsElement = document.getElementById(containerId);

    if (!compromisedTotalReportsElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Tampilkan jumlah total data report compromised
    compromisedTotalReportsElement.innerText = compromisedTotalReports;
};

// Fungsi untuk mengambil data laporan dari API dan jumlah data laporan yang telah dibuat untuk tahun tertentu
const getAllUserReportsForYear = async (token, targetURL, year) => {
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({ year: year }), // Add the year parameter to the request body
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

// Fungsi untuk mengambil data laporan unsafe dari API untuk tahun tertentu
const getUnsafeReportsForYear = async (token, targetURL, year) => {
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({ year: year }), // Add the year parameter to the request body
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

// Fungsi untuk mengambil data laporan compromised dari API untuk tahun tertentu
const getCompromisedReportsForYear = async (token, targetURL, year) => {
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({ year: year }), // Add the year parameter to the request body
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

// Fungsi untuk menghitung total laporan unsafe dan compromised dan menampilkan hasilnya untuk tahun berjalan
const calculateAndDisplayTotalUnsafeCompromisedReportsForYear = async (year) => {
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

    const compromised = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser';
    const unsafe = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    // Call the function for the first URL and get the number of compromised reports for the specified year
    const totalReportsCompromised = await getCompromisedReportsForYear(token, compromised, year);

    // Call the function for the second URL and get the number of unsafe reports for the specified year
    const totalReportsUnsafe = await getUnsafeReportsForYear(token, unsafe, year);

    // Calculate the combined total
    const combinedTotalReports = totalReportsCompromised + totalReportsUnsafe;

    // Display the combined total
    displaySumReports(combinedTotalReports, 'combined-total-reports');
    displaySumReportsCompromised(totalReportsCompromised, 'compromised-total-reports');
    displaySumReportsUnsafe(totalReportsUnsafe, 'unsafe-total-reports');
};

// Panggil fungsi untuk menghitung total laporan unsafe dan compromised dan menampilkan hasilnya untuk tahun berjalan
const currentYear = new Date().getFullYear(); // Mendapatkan tahun berjalan
calculateAndDisplayTotalUnsafeCompromisedReportsForYear(currentYear);
