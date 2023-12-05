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
            console.error("Status bukan true");
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

    // Menghapus semua elemen anak di dalam reportContainer
    reportContainer.innerHTML = '';

    if (reportData && reportData.length > 0) {
        reportData.forEach((report) => {
            const newCard = document.createElement('div');
            newCard.className = 'card timeline-card bg-dark';
            newCard.innerHTML = `
                <div class="card-body">
                    <h6 class="element-heading fw-bolder">${report.reportid}</h6>
                    <p>Lokasi: ${report.location.locationName}</p>
                    <p>Tanggal: ${report.date}</p>
                    <p>Jenis Ketidaksesuaian: ${report.typeDangerousActions.map(action => `#${action.typeName}`).join(', ')}</p>
                    <p>Identitas Pengawas: ${report.user.nama} - ${report.user.jabatan}</p>
                </div>
            `;

           
            reportContainer.appendChild(newCard);
        });
    } else {
        reportContainer.innerHTML = '<p>No report data found.</p>';
    }
  }
  
  getUserReportWithToken();
  