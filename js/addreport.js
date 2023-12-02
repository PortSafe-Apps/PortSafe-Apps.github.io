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

const generateNomorPelaporan = () => {
  const tahunSekarang = new Date().getFullYear();
  const nomorUrut = 1;
  const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut.toString().padStart(3, '0')}`;
  return nomorPelaporan;
};
document.getElementById('nomorPelaporan').value = generateNomorPelaporan();

const resetNomorPelaporan = () => {
  document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
};
document.getElementById('tombolBuatLaporanBaru').addEventListener('click', resetNomorPelaporan);


const getUserInfoFromToken = (token) => {
  try {
      const userInfo = JSON.parse(atob(token.split('.')[1]));
      return userInfo;
  } catch (error) {
      console.error('Error parsing user info from token:', error);
      return null;
  }
};

const fillSupervisorData = () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
      console.warn('Token not found');
      return;
  }

  const userInfo = getUserInfoFromToken(token);

  if (!userInfo) {
      console.warn('Unable to get user info from token');
      return;
  }

  document.getElementById('namaPengawas').value = userInfo.Nama || '';
  document.getElementById('jabatanPengawas').value = userInfo.Jabatan || '';
};

// Panggil fungsi untuk mengisi data pengawas saat halaman dimuat
document.addEventListener('DOMContentLoaded', fillSupervisorData);

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

    // Mendapatkan elemen-elemen checkbox dari setiap kategori
    const reaksiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');

    // Menambahkan pilihan yang dipilih dari setiap kategori
    reaksiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "REAKSI ORANG"; // Sesuaikan dengan kategori yang sesuai
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

     // Mendapatkan elemen-elemen checkbox dari setiap kategori
     const alatPelindungDiriCheckboxes = document.querySelectorAll('.checkbox-group input:checked');

     // Menambahkan pilihan yang dipilih dari setiap kategori
     alatPelindungDiriCheckboxes.forEach((checkbox) => {
         const typeName = "ALAT PELINDUNG DIRI"; // Sesuaikan dengan kategori yang sesuai
         const subTypeName = checkbox.value;
 
         selectedTypeDangerousActions.push({
             TypeName: typeName,
             SubTypes: [{ SubTypeName: subTypeName }],
         });
     });
   
    
    // Mendapatkan elemen-elemen checkbox dari setiap kategori
    const posisiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');

    // Menambahkan pilihan yang dipilih dari setiap kategori
    posisiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "POSISI ORANG"; // Sesuaikan dengan kategori yang sesuai
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

    // Mendapatkan elemen-elemen checkbox dari setiap kategori
    const alatDanPerlengkapanCheckboxes = document.querySelectorAll('.checkbox-group input:checked');

    // Menambahkan pilihan yang dipilih dari setiap kategori
    alatDanPerlengkapanCheckboxes.forEach((checkbox) => {
        const typeName = "ALAT DAN PERLENGKAPAN"; // Sesuaikan dengan kategori yang sesuai
        const subTypeName = checkbox.value;

        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });

    // Mendapatkan elemen-elemen checkbox dari setiap kategori
    const prosedurDanCaraKerjaCheckboxes = document.querySelectorAll('.checkbox-group input:checked');

    // Menambahkan pilihan yang dipilih dari setiap kategori
    prosedurDanCaraKerjaCheckboxes.forEach((checkbox) => {
        const typeName = "PROSEDUR DAN CARA KERJA"; // Sesuaikan dengan kategori yang sesuai
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
              LocationName: document.getElementById('newLocationNameInput').value,
          },
          Description: document.getElementById('newDescriptionInput').value,
          ObservationPhoto: document.getElementById('newObservationPhotoInput').value,
          TypeDangerousActions: selectedTypeDangerousActions,
          Area: {
              AreaName: document.getElementById('newAreaNameInput').value,
          },
          ImmediateAction: document.getElementById('newImmediateActionInput').value,
          ImprovementPhoto: document.getElementById('newImprovementPhotoInput').value,
          CorrectiveAction: document.getElementById('newCorrectiveActionInput').value,
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

document.getElementById('newObservationReportForm').addEventListener('submit', insertObservationReport);

  