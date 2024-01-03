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

// Function to get all user reports from the API
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
            return data.data; // Return the data from the API
        } else {
            console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
            return []; // Return an empty array if there is an error
        }
    } catch (error) {
        console.error('Error:', error);
        return []; // Return an empty array if there is an error
    }
};

// Function to get the count of each type of dangerous action
const getDangerousActionsCount = (actions) => {
    const actionCounts = {};

    actions.forEach((action) => {
        if (action.TypeDangerousActions) {
            action.TypeDangerousActions.forEach((type) => {
                const typeId = type.TypeId;
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

// Function to get the top 3 dangerous actions
const getTop3DangerousActions = async (token, url1, url2) => {
    const actionsUrl1 = await getAllUserReports(token, url1);
    const actionsUrl2 = await getAllUserReports(token, url2);

    const allActions = [...actionsUrl1, ...actionsUrl2];

    // Get the count of each type of dangerous action
    const actionCounts = getDangerousActionsCount(allActions);

    // Sort dangerous actions based on count
    const sortedActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]);

    // Get the top 3 dangerous actions
    const top3Actions = sortedActions.slice(0, 3);

    return top3Actions.map(([typeId, count]) => {
        const actionInfo = allActions.find((action) =>
            action.TypeDangerousActions && action.TypeDangerousActions.some((type) => type.TypeId === typeId)
        );

        return {
            typeId,
            typeName: actionInfo?.TypeDangerousActions.find((type) => type.TypeId === typeId)?.TypeName || 'Unknown',
            subType: actionInfo?.TypeDangerousActions.find((type) => type.TypeId === typeId)?.SubTypes[0] || 'Unknown',
            count,
        };
    });
};

// Function to display the top 3 dangerous actions in cards
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
        // Get the top 3 dangerous actions
        const top3DangerousActions = await getTop3DangerousActions(token, url1, url2);

        // Display the results in cards
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

// Call the function to display the top 3 dangerous actions
displayTop3DangerousActions();
