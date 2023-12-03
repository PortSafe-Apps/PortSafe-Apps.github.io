import { simpanFotoObservasi, simpanFotoPerbaikan } from '../js/take-photo.js';
import { resetNomorPelaporan  } from '../js/num-report.js';

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

const getUserInfoFromApi = async () => {
  const apiUrl = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';

  try {
    // Get the token from cookies
    const token = getTokenFromCookies('Login');
    console.log('Token:', token);

    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Login': token,
      },
    });
    console.log('Response:', response);

    const data = await response.json();

    if (response.ok) {
      console.log('Data:', data);
      return data;
    } else {
      console.error('Error:', data.message);
      throw new Error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


const insertObservationReport = async (event) => {
  event.preventDefault();
  
  try {
    // Panggil fungsi untuk mengambil data pengguna
    const userData = await getUserInfoFromApi();

    // Perbarui bidang masukan dengan informasi pengguna
    document.getElementById('namaPengawas').value = userData.Nama;
    document.getElementById('jabatanPengawas').value = userData.Jabatan;
  const token = getTokenFromCookies('Login');

  if (!token) {
    alert("Header Login Not Found");
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  
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

    document.addEventListener('DOMContentLoaded', function () {
      resetNomorPelaporan(); // Pastikan nilai nomorPelaporan sudah ada di elemen dengan ID 'nomorPelaporan'
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
          Reportid: document.getElementById('nomorPelaporan').value,
          Date: document.getElementById('tanggalPelaporan').value,
          User: {
            Nipp: userData.Nipp,
            Nama: userData.Nama,
            Jabatan: userData.Jabatan,
            Divisi: userData.Divisi,
            Bidang: userData.Bidang,
        },
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


