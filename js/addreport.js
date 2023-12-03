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

const getSelectedTypeDangerousActions = () => {
  try {
    const typeDangerousActions = [];

    const typeCheckboxes = document.querySelectorAll('.checkbox-group');
    typeCheckboxes.forEach((typeCheckbox) => {
      const typeName = typeCheckbox.querySelector('.element-heading h6').innerText;
      const subTypeCheckboxes = typeCheckbox.querySelectorAll('.form-check-input:checked');
      const subTypes = Array.from(subTypeCheckboxes).map((checkbox) => checkbox.value);

      if (subTypes.length > 0) {
        typeDangerousActions.push({
          TypeName: typeName,
          SubTypes: subTypes,
        });
      }
    });

    return typeDangerousActions;
  } catch (error) {
    console.error('Error in getSelectedTypeDangerousActions:', error);
    return null;
  }
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
          ObservationPhoto: fotoObservasiBase64, 
          TypeDangerousActions: selectedTypeDangerousActions,
          Area: {
              AreaName: document.getElementById('newAreaName').value,
          },
          ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
          ImprovementPhoto: fotoPerbaikanBase64, 
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


