const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
          return value;
      }
  }
  return null;
};

const showAlert = (message, type = 'success') => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    showAlert("Header Login Not Found", 'error');
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  try {
    function getCheckedCheckboxes() {
      var checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
      var checkedValues = [];
  
      checkboxes.forEach(function (checkbox) {
          var typeId = checkbox.name;
          var typeName = checkbox.dataset.typeName; // Mengambil Type Name dari dataset
  
          checkedValues.push({
              TypeId: typeId,
              TypeName: typeName,
              SubTypes: [checkbox.value]
          });
      });
  
      return checkedValues;
  }  
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
          Reportid: document.getElementById('nomorPelaporan').value,
          Date: document.getElementById('tanggalPelaporan').value,
          User: {},
          Location: {
              LocationName: document.getElementById('autoCompleteLocation').value,
          },
          Description: document.getElementById('deskripsiPengamatan').value,
          ObservationPhoto: document.getElementById('fotoObservasi').value, 
          TypeDangerousActions: getCheckedCheckboxes(),
          Area: {
              AreaName: document.getElementById('newAreaName').value,
          },
          ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
          ImprovementPhoto: document.getElementById('fotoPerbaikan').value,  
          CorrectiveAction: document.getElementById('deskripsiPencegahanTerulangKembali').value,
      }),
      redirect: 'follow',
  };
  
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();
  
    if (data.status === false) {
      showAlert(data.message, 'error');
    } else {
      showAlert("Data Pelaporan Berhasil di Input!", 'success');
      window.location.href = 'https://portsafe-apps.github.io/pages/user/listreport.html';
    }
  } catch (error) {
    console.error('Error:', error);
  
}
  };
  
  document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);


