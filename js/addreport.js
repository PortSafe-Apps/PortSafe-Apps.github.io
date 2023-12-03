import { simpanFotoObservasi, simpanFotoPerbaikan } from '../js/take-photo.js';

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

const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    alert("Header Login Not Found");
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  try {
    const selectedTypeDangerousActions = [];
    const processCheckboxGroup = (groupName) => {
        const checkboxes = document.querySelectorAll(`.${groupName} input:checked`);
        checkboxes.forEach((checkbox) => {
            const typeName = groupName;
            const subTypeName = checkbox.value;

            selectedTypeDangerousActions.push({
                TypeName: typeName,
                SubTypes: [subTypeName],
            });
        });
    };

    // Proses setiap grup checkbox
    const checkboxGroups = ['reaksiOrang', 'alatPelindungDiri', 'posisiOrang', 'alatDanPerlengkapan', 'prosedurDanCaraKerja'];
    checkboxGroups.forEach((groupName) => processCheckboxGroup(groupName));

    console.log(selectedTypeDangerousActions);


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
          ObservationPhoto: simpanFotoObservasi, 
          TypeDangerousActions: selectedTypeDangerousActions,
          Area: {
              AreaName: document.getElementById('newAreaName').value,
          },
          ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
          ImprovementPhoto: simpanFotoPerbaikan,
          CorrectiveAction: document.getElementById('deskripsiPencegahanTerulangKembali').value,
      }),
      redirect: 'follow',
  };
  
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();
  
    if (data.status === false) {
      alert(data.message);
    } else {
      alert("Reporting data inserted successfully!");
    }
  } catch (error) {
    console.error('Error:', error);
  
}
  };
  
  document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);


