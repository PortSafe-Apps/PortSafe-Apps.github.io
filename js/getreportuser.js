// Function to make the API request with the token
async function getUserWithTokenAndDisplay() {
    const token = getTokenFromCookies('Login');

    if (!token) {
        alert("Token not found");
        return;
    }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === true) {
            displayReports(data.data, 'reportsContainer');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

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

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'card timeline-card bg-dark';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const headingDiv = document.createElement('div');
    headingDiv.className = 'd-flex justify-content-between';

    const timelineTextDiv = document.createElement('div');
    timelineTextDiv.className = 'timeline-text mb-2';

    const reportIdHeading = document.createElement('h6');
    reportIdHeading.className = 'element-heading fw-bolder';
    reportIdHeading.textContent = report.Reportid;

    const locationSpan = document.createElement('span');
    locationSpan.textContent = report.Location.LocationName;

    const dateBadge = document.createElement('span');
    dateBadge.className = 'badge mb-2 rounded-pill bg-dark';
    dateBadge.textContent = report.Date;

    const typeDangerousActionsDiv = document.createElement('div');
    typeDangerousActionsDiv.className = 'timeline-tags';

    report.TypeDangerousActions.forEach(type => {
        type.SubTypes.forEach(subtype => {
            const subtypeBadge = document.createElement('span');
            subtypeBadge.className = 'badge bg-light text-dark';
            subtypeBadge.textContent = `#${subtype}`;
            typeDangerousActionsDiv.appendChild(subtypeBadge);
        });
    });

    timelineTextDiv.appendChild(reportIdHeading);
    timelineTextDiv.appendChild(locationSpan);
    timelineTextDiv.appendChild(dateBadge);
    timelineTextDiv.appendChild(typeDangerousActionsDiv);

    headingDiv.appendChild(timelineTextDiv);

    const userDiv = document.createElement('div');
    userDiv.className = 'text-content mb-2';
    const userHeading = document.createElement('h6');
    userHeading.className = 'mb-0';
    userHeading.textContent = 'Pengawas';

    const userData = document.createElement('p');
    userData.textContent = `${report.User.nama}, ${report.User.jabatan}`;

    userDiv.appendChild(userHeading);
    userDiv.appendChild(userData);

    cardBody.appendChild(headingDiv);
    cardBody.appendChild(userDiv);

    card.appendChild(cardBody);

    return card;
}

function displayReports(reportsData, containerId) {
    const reportsContainer = document.getElementById(containerId);

    if (reportsData && reportsData.length > 0) {
        reportsContainer.innerHTML = ''; // Clear existing content
        reportsData.forEach(report => {
            const reportCard = createReportCard(report);
            reportsContainer.appendChild(reportCard);
        });
    } else {
        reportsContainer.innerHTML = '<p>No report data found</p>';
    }
}

// Call the API and display data
getUserWithTokenAndDisplay();
