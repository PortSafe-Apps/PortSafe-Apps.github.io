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

// Function to display an error message
function showError(message) {
    console.error('Error:', message);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    });
}

// Fungsi untuk mendapatkan jumlah total tindakan berbahaya dari setiap jenis
const getDangerousActionsCount = (actions) => {
    const actionCounts = {};

    actions.forEach((action) => {
        action.TypeDangerousActions.forEach((type) => {
            const typeId = type.TypeId;
            if (actionCounts[typeId]) {
                actionCounts[typeId]++;
            } else {
                actionCounts[typeId] = 1;
            }
        });
    });

    return actionCounts;
};

// Fungsi untuk mendapatkan 3 tipe aksi berbahaya terbanyak dari kedua URL
const getTop3DangerousActions = async (token, url1, url2) => {
    const actionsUrl1 = await getAllUserReports(token, url1);
    const actionsUrl2 = await getAllUserReports(token, url2);

    const allActions = [...actionsUrl1, ...actionsUrl2];

    // Hitung jumlah setiap tipe aksi berbahaya
    const actionCounts = getDangerousActionsCount(allActions);

    // Urutkan tipe aksi berbahaya berdasarkan jumlah
    const sortedActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]);

    // Ambil 3 tipe aksi berbahaya terbanyak
    const top3Actions = sortedActions.slice(0, 3);

    return top3Actions.map(([typeId, count]) => {
        const actionInfo = allActions.find((action) =>
            action.TypeDangerousActions.some((type) => type.TypeId === typeId)
        );

        return {
            typeId,
            typeName: actionInfo.TypeDangerousActions.find((type) => type.TypeId === typeId).TypeName,
            subType: actionInfo.TypeDangerousActions.find((type) => type.TypeId === typeId).SubTypes[0],
            count,
        };
    });
};

// Fungsi untuk menampilkan 3 tipe aksi berbahaya terbanyak ke dalam card
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

    // Mendapatkan 3 tipe aksi berbahaya terbanyak
    const top3DangerousActions = await getTop3DangerousActions(token, url1, url2);

    // Menampilkan hasilnya ke dalam card
    const cardContainer = document.getElementById('dangerous-actions-container');

    if (!cardContainer) {
        console.error('Elemen dengan ID "dangerous-actions-container" tidak ditemukan.');
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
};

// Panggil fungsi untuk menampilkan 3 tipe aksi berbahaya terbanyak
displayTop3DangerousActions();
