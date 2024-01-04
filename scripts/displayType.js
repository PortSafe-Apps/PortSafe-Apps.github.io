// Function untuk mengekstrak token dari cookies
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

// Function untuk menampilkan pesan kesalahan
function showError(message) {
    console.error('Error:', message);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    });
}

// Function untuk mendapatkan semua laporan pengguna dari API
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
            return data.data; // Mengembalikan data dari API
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
            return []; // Mengembalikan array kosong jika terjadi kesalahan
        }
    } catch (error) {
        console.error('Error:', error);
        return []; // Mengembalikan array kosong jika terjadi kesalahan
    }
};

// Function untuk mendapatkan jumlah setiap jenis tindakan berbahaya
const getDangerousActionsCount = (actions) => {
    const actionCounts = {};

    actions.forEach((action) => {
        if (action.typeDangerousActions && Array.isArray(action.typeDangerousActions)) {
            action.typeDangerousActions.forEach((type) => {
                const typeId = type.typeId;
                if (actionCounts[typeId]) {
                    actionCounts[typeId]++;
                } else {
                    actionCounts[typeId] = 1;
                }
            });
        }
    });

    return actionCounts;
};

// Function untuk mendapatkan 3 tindakan berbahaya teratas
const getTop3DangerousActions = async (token, allUserReports) => {
    // Mengurutkan laporan berdasarkan tanggal (jika diperlukan)
    const sortedReports = allUserReports.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Menggabungkan semua tindakan berbahaya dari laporan pengguna
    const allActions = sortedReports.reduce((actions, report) => {
        if (report.typeDangerousActions && Array.isArray(report.typeDangerousActions)) {
            actions.push(...report.typeDangerousActions);
        }
        return actions;
    }, []);

    // Mendapatkan jumlah setiap jenis tindakan berbahaya
    const actionCounts = getDangerousActionsCount(allActions);

    // Mengurutkan tindakan berbahaya berdasarkan jumlah
    const sortedActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]);

    // Mendapatkan 3 tindakan berbahaya teratas
    const top3Actions = sortedActions.slice(0, 3);

    return top3Actions.map(([typeId, count]) => {
        const actionInfo = allActions.find((action) =>
            action.typeId === typeId
        );

        return {
            typeId,
            typeName: actionInfo?.typeName || 'Unknown',
            subType: actionInfo?.subTypes[0] || 'Unknown',
            count,
        };
    });
};

// Function untuk menampilkan 3 tindakan berbahaya teratas dalam kartu-kartu
const displayTop3DangerousActions = async () => {
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

    try {
        console.log('Mengambil semua laporan pengguna...');
        const allUserReports = await getAllUserReports(token, url1, url2);
        console.log('Semua Laporan Pengguna:', allUserReports);

        // Dapatkan 3 tindakan berbahaya teratas
        const top3DangerousActions = await getTop3DangerousActions(token, allUserReports);

        console.log('Top 3 Tindakan Berbahaya:', top3DangerousActions);

        // Tampilkan hasilnya dalam kartu-kartu
        const cardContainer = document.getElementById('dangerous-actions-container');
        
        if (!cardContainer) {
            showError('Elemen dengan ID "dangerous-actions-container" tidak ditemukan.');
            return;
        }

        top3DangerousActions.forEach((action, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card card-style mb-3 mx-0';
            cardElement.innerHTML = `
                <div class="d-flex pt-3 pb-3">
                    <div class="ps-3 ms-2 align-self-center">
                        <h1 class="center-text mb-0 pt-2">${index + 1}</h1>
                    </div>
                    <div class="align-self-center mt-1 ps-4">
                        <h4 class="color-theme font-600">${action.typeName}</h4>
                        <p class="mt-n2 font-11 color-highlight mb-0">${action.subType}</p>
                    </div>
                    <div class="ms-auto align-self-center me-3">
                        <span class="badge bg-highlight color-white font-12 font-500 py-2 px-2 rounded-s">${action.count} Laporan</span>
                    </div>
                </div>
            `;
            cardContainer.appendChild(cardElement);
        });
    } catch (error) {
        showError('Terjadi kesalahan saat memproses data.');
        console.error('Error:', error);
    }
};

// Panggil fungsi untuk menampilkan 3 tindakan berbahaya teratas
displayTop3DangerousActions();
