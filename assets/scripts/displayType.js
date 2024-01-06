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

    // Check if the container element exists
    if (!dangerousActionList) {
        console.error(`Container element with ID '${containerId}' not found.`);
        return;
    }

    // Hitung jumlah tindakan berbahaya untuk setiap jenis
    const countByType = {};
    data.forEach(report => {
        if (report.typeDangerousActions && report.typeDangerousActions.length > 0) {
            report.typeDangerousActions.forEach(type => {
                const typeName = type.typeName;
                countByType[typeName] = countByType[typeName] || { count: 0, subTypes: new Set() };
                countByType[typeName].count += 1;
            });
        }
    });

    // Ubah data menjadi bentuk yang dapat diurutkan
    const sortableData = [];
    for (const typeName in countByType) {
        sortableData.push({
            typeName,
            count: countByType[typeName].count,
        });
    }

    // Urutkan data berdasarkan jumlah yang tercatat
    const sortedData = sortableData.sort((a, b) => b.count - a.count);

    // Hanya ambil lima data teratas
    const topData = sortedData.slice(0, 3);

    // Tampilkan data dalam elemen HTML
    topData.forEach((item, index) => {
        const dangerousActionItem = document.createElement('div');
        dangerousActionItem.className = 'card card-style mb-3 mx-0';
        dangerousActionItem.innerHTML = `
            <div class="d-flex pt-3 pb-3">
                <div class="ps-3 ms-2 align-self-center">
                    <h1 class="center-text mb-0 pt-2">${index + 1}</h1>
                </div>
                <div class="align-self-center mt-1 ps-4">
                    <h4 class="color-theme font-600">${item.typeName}</h4>
                </div>
                <div class="ms-auto align-self-center me-3">
                    <span class="badge bg-highlight color-white font-12 font-500 py-2 px-2 rounded-s">${item.count} Laporan</span>
                </div>
            </div>
        `;

        dangerousActionList.appendChild(dangerousActionItem);
    });
};

// Function to fetch data from the API endpoints
const fetchData = async (url, token) => {
    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data.data || [];
};

// Function to get data from both endpoints and display results
const getallUserReportsWithToken = async () => {
    const token = getTokenFromCookies('Login');

    if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Error",
          text: "Kamu Belum Login!",
        }).then(() => {
          window.location.href = "https://portsafe-apps.github.io/";
        });
        return;
      }

    const url1 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser';
    const url2 = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    try {
        const [data1, data2] = await Promise.all([fetchData(url1, token), fetchData(url2, token)]);

        // Combine data from both URLs
        const combinedData = [...data1, ...data2];

        displayTopDangerousActions(combinedData, 'dangerous-action-list');
    } catch (error) {
        console.error('Error fetching or displaying data:', error);
    }
};

// Call the function to get data from both endpoints and display results
getallUserReportsWithToken();
