// main.js

// Function to create a card element for each report
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

    // Continue creating the rest of the HTML structure...

    // Append elements to their respective parent elements
    timelineTextDiv.appendChild(reportIdHeading);
    timelineTextDiv.appendChild(locationSpan);

    // Continue appending other elements...

    headingDiv.appendChild(timelineTextDiv);

    // Continue appending other elements...

    cardBody.appendChild(headingDiv);

    card.appendChild(cardBody);

    return card;
}

// Function to display report data in the specified container
function displayReports(reportsData, containerId) {
    const reportsContainer = document.getElementById(containerId);

    if (reportsData && reportsData.length > 0) {
        reportsData.forEach(report => {
            const reportCard = createReportCard(report);
            reportsContainer.appendChild(reportCard);
        });
    } else {
        // Handle the case where no report data is found
        reportsContainer.innerHTML = '<p>No report data found</p>';
    }
}


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

// Call the API and display data
getUserWithTokenAndDisplay();
