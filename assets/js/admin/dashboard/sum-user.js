function getTokenFromCookies(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (decodeURIComponent(name) === cookieName) {
            return value;
        }
    }
    return null;
}

const displaySumUsers = (data, containerId) => {
    const totalUsersElement = document.getElementById(containerId);

    if (!totalUsersElement) {
        console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
        return;
    }

    const filteredData = data.filter(user => user.role !== 'admin');
    const totalUsers = filteredData.length;

    totalUsersElement.innerText = totalUsers;
};

const getAllRegisteredUsers = async () => {
    const token = getTokenFromCookies('Login');

    if (!token) {
        // Tangani kesalahan autentikasi jika tidak ada token
        Swal.fire({
          icon: "warning",
          title: "Authentication Error",
          text: "Kamu Belum Login!",
        }).then(() => {
          window.location.href = "https://portsafe-apps.github.io/";
        });
        return [];
      }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getAllUser';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        console.log('Server Response:', response.status, response.statusText);

        const data = await response.json();
        console.log('Data from Server:', data);

        if (response.ok) {
            if (data.status === 200) {
                displaySumUsers(data.data, 'total-users');
            } else {
                console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
            }
        } else {
            console.error('Server response not ok:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message || error);
    }
};

getAllRegisteredUsers();

