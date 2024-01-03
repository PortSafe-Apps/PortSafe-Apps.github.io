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

// Function to fetch data from API and display top dangerous actions
const fetchDataAndDisplayTopActions = async () => {
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

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        // Fetch data from the first URL
        const response1 = await fetch(url1, requestOptions);
        const data1 = await response1.json();

        if (data1.status !== 200) {
            console.error('Server response:', data1.message || 'Data tidak dapat ditemukan');
            return;
        }

        // Fetch data from the second URL
        const response2 = await fetch(url2, requestOptions);
        const data2 = await response2.json();

        if (data2.status !== 200) {
            console.error('Server response:', data2.message || 'Data tidak dapat ditemukan');
            return;
        }

        // Combine data from both URLs
        const combinedData = [...data1.data, ...data2.data];

        // Display the top dangerous actions based on the combined data
        const containerId = 'dangerous-action-list';
        const container = document.getElementById(containerId);

        // Clear existing content in the container
        container.innerHTML = '';

        // Create the header for the top dangerous actions
        const header = document.createElement('div');
        header.className = 'card-body pt-4 mt-3';
    
        container.appendChild(header);

        // Hitung jumlah tindakan berbahaya untuk setiap jenis
        const countByType = {};
        combinedData.forEach(report => {
            if (report.TypeDangerousActions && report.TypeDangerousActions.length > 0) {
                report.TypeDangerousActions.forEach(type => {
                    const typeName = type.TypeName;
                    const subTypes = type.SubTypes ? type.SubTypes.join(', ') : '';

                    const key = typeName;

                    countByType[key] = (countByType[key] || { recorded: 0, subTypes: '' });
                    countByType[key].recorded += 1;
                    countByType[key].subTypes = subTypes;
                });
            }
        });

        // Ubah data menjadi bentuk yang dapat diurutkan
        const sortableData = [];
        for (const typeName in countByType) {
            sortableData.push({ typeName, recorded: countByType[typeName].recorded, subTypes: countByType[typeName].subTypes });
        }

        // Urutkan data berdasarkan jumlah yang tercatat
        const sortedData = sortableData.sort((a, b) => b.recorded - a.recorded);

        // Tampilkan data dalam elemen HTML
        sortedData.slice(0, 3).forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card card-style mb-3 mx-0';

            const content = `
                <div class="d-flex pt-3 pb-3">
                    <div class="ps-3 ms-2 align-self-center">
                        <h1 class="center-text mb-0 pt-2">${index + 1 < 10 ? '0' : ''}${index + 1}</h1>
                    </div>
                    <div class="align-self-center mt-1 ps-4">
                        <h4 class="color-theme font-600">${item.typeName}</h4>
                        <p class="mt-n2 font-11 color-highlight mb-0">
                            ${item.subTypes}
                        </p>
                    </div>
                    <div class="ms-auto align-self-center me-3">
                        <span class="badge bg-highlight color-white font-12 font-500 py-2 px-2">${item.recorded} Laporan</span>
                    </div>
                </div>
            `;

            card.innerHTML = content;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

// Call the main function to fetch data from both URLs and display top dangerous actions
fetchDataAndDisplayTopActions();
