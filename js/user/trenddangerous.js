 // Function to extract the token from cookies
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
  

const displayTopDangerousActions = (data, containerId) => {
    const dangerousActionList = document.getElementById(containerId);

    // Hitung jumlah tindakan berbahaya untuk setiap jenis
    const countByType = {};
    data.forEach(report => {
        if (report.typeDangerousActions && report.typeDangerousActions.length > 0) {
            report.typeDangerousActions.forEach(type => {
                const typeName = type.typeName; // Sesuaikan dengan struktur data yang sesuai
                countByType[typeName] = (countByType[typeName] || 0) + 1;
            });
        }
    });

    // Ubah data menjadi bentuk yang dapat diurutkan
    const sortableData = [];
    for (const typeName in countByType) {
        sortableData.push({ typeName, recorded: countByType[typeName] });
    }

    // Urutkan data berdasarkan jumlah yang tercatat
    const sortedData = sortableData.sort((a, b) => b.recorded - a.recorded);

    // Hanya ambil lima data teratas
    const topData = sortedData.slice(0, 3);

    // Tampilkan data dalam elemen HTML
    topData.forEach((item, index) => {
        const dangerousActionItem = document.createElement('div');
        dangerousActionItem.className = 'dangerous-action-item';
        dangerousActionItem.innerHTML = `
            <span class="top-number">${index + 1}.</span>
            <span class="dangerous-action-name">${item.typeName}</span>
            <span class="recorded-label">Yang Tercatat</span>
            <span class="recorded-badge">${item.recorded}</span>
        `;

        dangerousActionList.appendChild(dangerousActionItem);
    });
};

// Fungsi untuk mengambil data dari API dan menampilkan top 5 jenis tindakan berbahaya
const getallUserReportWithToken = async () => {
    const token = getTokenFromCookies('Login');

    if (!token) {
        alert("Token tidak ditemukan");
        return;
    }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

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
            displayTopDangerousActions(data.data, 'dangerous-action-list');
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan top 5 jenis tindakan berbahaya
getallUserReportWithToken();
