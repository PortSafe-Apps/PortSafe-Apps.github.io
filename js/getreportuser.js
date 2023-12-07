  // Fungsi untuk mendapatkan token dari cookie
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

const getUserReportWithToken = async () => {
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
        displayNewReport(data.data, 'reportContainer');
      } else {
        console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const displayNewReport = (newReport, cardContainerId) => {
    const reportContainer = document.getElementById(cardContainerId);
  
    const newCard = document.createElement('div');
    newCard.className = 'card timeline-card bg-dark';
    newCard.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div class="timeline-text mb-2">
                    <h6 class="element-heading fw-bolder">${newReport.reportid}</h6>
                    <span>${newReport.location.locationName}</span>
                </div>
                <div class="timeline-text mb-2">
                    <span class="badge mb-2 rounded-pill bg-dark">${newReport.date}</span>
                </div>
            </div>
            <div class="divider mt-0"></div>
            <div class="timeline-text mb-2">
                <h6 class="mb-0">Jenis Ketidaksesuaian</h6>
                <div class="timeline-tags">
                    ${newReport.typeDangerousActions.map(action => `<span class="badge bg-light text-dark">${action.typeName}</span>`).join('')}
                </div>
            </div>
            <div class="timeline-text mb-0">
                <h6 class="mb-0">Pengawas</h6>
                <span class="fw-normal">${newReport.user.nama}</span> <br> <span class="fw-normal">${newReport.user.jabatan}</span>
            </div>
        </div>
    `;
  
    reportContainer.prepend(newCard);
};

getUserReportWithToken();