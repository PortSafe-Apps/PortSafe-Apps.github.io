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


const token = getTokenFromCookies('Login'); 
const userInfo = getUserInfoFromToken(token);
if (userInfo) {
    document.getElementById('namaPengawas').value = userInfo.Nama; 
    document.getElementById('jabatanPengawas').value = userInfo.Jabatan; 
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
    const selectedTypeDangerousActions = [];
    const reaksiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    reaksiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "REAKSI ORANG"; 
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

     const alatPelindungDiriCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
     alatPelindungDiriCheckboxes.forEach((checkbox) => {
         const typeName = "ALAT PELINDUNG DIRI"; 
         const subTypeName = checkbox.value;
 
         selectedTypeDangerousActions.push({
             TypeName: typeName,
             SubTypes: [{ SubTypeName: subTypeName }],
         });
     });
   
    const posisiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    posisiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "POSISI ORANG"; 
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

    const alatDanPerlengkapanCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    alatDanPerlengkapanCheckboxes.forEach((checkbox) => {
        const typeName = "ALAT DAN PERLENGKAPAN"; 
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

    const prosedurDanCaraKerjaCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    prosedurDanCaraKerjaCheckboxes.forEach((checkbox) => {
        const typeName = "PROSEDUR DAN CARA KERJA"; 
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });
    
  const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
          Reportid: document.getElementById('nomorPelaporan').value,
          Date: document.getElementById('tanggalPelaporan').value,
          User: {
            Nipp: userFromToken.Nipp,
            Nama: userFromToken.Nama,
            Jabatan: userFromToken.Jabatan,
            Divisi: userFromToken.Divisi,
            Bidang: userFromToken.Bidang,
        },
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

  if (data.Status === false) {
      alert(data.Message);
  } else {
      alert("Berhasil memasukkan data laporan!");
  }
} catch (error) {
  console.error('Error:', error);
}
};

document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);

  