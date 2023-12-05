async function getUserReportWithToken() {
    const token = getTokenFromCookies('Login');

    if (!token) {
        alert("token tidak ditemukan");
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

        if (data.status === true) {
            displayReportData(data.data);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

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

function displayReportData(reportData) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = '';
    if (reportData && reportData.length > 0) {
        reportData.forEach((report) => {
            const newCard = document.createElement('div');
            newCard.className = 'card timeline-card bg-dark';
            newCard.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div class="timeline-text mb-2">
                            <h6 class="element-heading fw-bolder">${report.reportid}</h6>
                            <span>${report.location.locationName}</span>
                        </div>
                        <div class="timeline-text mb-2">
                            <span class="badge mb-2 rounded-pill bg-dark">${report.date}</span>
                        </div>
                    </div>
                    <div class="divider mt-0"></div>
                    <div class="text-content mb-2">
                        <h6 class="mb-0">Jenis Ketidaksesuaian</h6>
                        <div class="timeline-tags">
                            ${report.typeDangerousActions.map(action => `<span class="badge bg-light text-dark">#${action.typeName}</span>`).join('')}
                        </div>
                    </div>
                    <div class="text-content mb-2">
                        <h6 class="mb-0">Pengawas</h6>
                        <p><span>${report.user.nama}</span> <br> <span>${report.user.jabatan}</span></p>
                    </div>
                    <!-- Tambahan informasi lainnya sesuai kebutuhan -->
                </div>
            `;
            reportContainer.appendChild(newCard);
        });
    } else {
        reportContainer.innerHTML = '<p>No report data found.</p>';
    }
}

getUserReportWithToken();
