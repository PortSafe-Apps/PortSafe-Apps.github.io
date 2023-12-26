// Fungsi untuk menampilkan jumlah total user (mengabaikan role admin)
const displaySumUsers = (data, containerId) => {
    const totalUsersElement = document.getElementById(containerId);

    if (!totalUsersElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    // Filter data untuk mengabaikan role admin
    const filteredData = data.filter(user => user.role !== 'admin');

    const totalUsers = filteredData.length;

    // Tampilkan jumlah total user
    totalUsersElement.innerText = totalUsers;
};

// Fungsi untuk mengambil data dari API dan jumlah data user yang telah mendaftar (mengabaikan role admin)
const getAllRegisteredUsers = async () => {
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

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === 200) {
            // Panggil fungsi untuk menampilkan jumlah total user (mengabaikan role admin) di dalam elemen dengan ID 'total-users'
            displaySumUsers(data.data, 'total-users');
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah user yang telah mendaftar (mengabaikan role admin)
getAllRegisteredUsers();
