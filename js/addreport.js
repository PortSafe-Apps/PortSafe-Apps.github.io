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

// Fungsi untuk mendapatkan data yang dipilih dari checkbox
function getSelectedTypeDangerousActions() {
  const categories = [
      "REAKSI ORANG",
      "ALAT PELINDUNG DIRI",
      "POSISI ORANG",
      "ALAT DAN PERLENGKAPAN",
      "PROSEDUR DAN CARA KERJA"
  ];

  const selectedTypeDangerousActions = [];

  // Loop melalui setiap kategori
  categories.forEach(category => {
      const checkboxes = document.querySelectorAll(`#${category.toLowerCase().replace(/\s/g, "")}CheckboxGroup input[type="checkbox"]:checked`);
      
      // Loop melalui setiap checkbox yang terpilih
      checkboxes.forEach(checkbox => {
          const value = checkbox.value;
          const typeName = category;

          // Tambahkan data ke dalam array
          selectedTypeDangerousActions.push({
              TypeName: typeName,
              SubTypes: [value]
          });
      });
  });

  return selectedTypeDangerousActions;
}


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
    
     // Get the photo data using the respective functions
    const observationPhoto = await simpanFotoObservasi();
    const improvementPhoto = await simpanFotoPerbaikan();
 
     // Get the selectedTypeDangerousActions variable
    const selectedTypeDangerousActions = getSelectedTypeDangerousActions();


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
          ObservationPhoto: observationPhoto, 
          TypeDangerousActions: selectedTypeDangerousActions,
          Area: {
              AreaName: document.getElementById('newAreaName').value,
          },
          ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
          ImprovementPhoto: improvementPhoto,
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


