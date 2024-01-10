document.addEventListener('DOMContentLoaded', function () {
    var unsafeRadio = document.getElementById("unsafe");
    var compromisedRadio = document.getElementById("compromised");
  
    if (unsafeRadio) {
      unsafeRadio.addEventListener('change', showForm);
    }
  
    if (compromisedRadio) {
      compromisedRadio.addEventListener('change', showForm);
    }
  });
  
  function showForm() {
    var unsafeForm = document.getElementById("unsafeForm");
    var compromisedForm = document.getElementById("compromisedForm");
    var unsafeRadio = document.getElementById("unsafe");
    var compromisedRadio = document.getElementById("compromised");
  
    if (unsafeRadio.checked) {
      unsafeForm.style.display = "block";
      compromisedForm.style.display = "none";
    } else if (compromisedRadio.checked) {
      unsafeForm.style.display = "none";
      compromisedForm.style.display = "block";
    }
  }
  
  // Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

const showAlert = (message, type = 'success') => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: true,
  });
};

  const insertObservationReport = async (event) => {
    event.preventDefault();
  
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      // Tangani kesalahan autentikasi jika tidak ada token
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Error',
        text: 'Kamu Belum Login!',
      }).then(() => {
        window.location.href = 'https://portsafe-apps.github.io/';
      });
      return;
    }
  
    const observationPhotoUrl = document.getElementById('hasilFotoObservasi').src;
    const improvementPhotoUrl = document.getElementById('hasilFotoPerbaikan').src;
  
    const targetURL = document.getElementById('unsafe').checked
      ? 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1'
      : 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReportCompromised';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    try {
      function getCheckedCheckboxes() {
        var checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
        var checkedValues = [];
      
        checkboxes.forEach(function (checkbox) {
          var typeId = checkbox.id.split('_')[0]; // Ekstrak TypeId dari id checkbox
          var typeName = checkbox.closest('.list-group').querySelector('.font-14').innerText; // Ekstrak TypeName dari ancestor terdekat dengan class 'list-group' dan mencari elemen pertama dengan class 'font-14' di dalamnya
      
          checkedValues.push({
            TypeId: typeId,
            TypeName: typeName,
            SubTypes: [checkbox.value]
          });
        });
      
        return checkedValues;
      }      
  
      const reportData = {
        Reportid: document.getElementById('nomorPelaporan').textContent,
        Date: document.getElementById('tanggalPelaporan').textContent,
        Time: document.getElementById('waktuPelaporan').textContent,
        User: {},
        Location: {
          LocationName: document.getElementById('autoCompleteLocation').value,
        },
        Area: {
            AreaName: document.getElementById('newAreaName').value,
          },
        Description: document.getElementById('deskripsiPengamatan').value,
        ObservationPhoto: observationPhotoUrl,
        TypeDangerousActions: getCheckedCheckboxes(),
        ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
        ImprovementPhoto: improvementPhotoUrl,
      };
  
      if (document.getElementById('unsafe').checked) {
        // Additional properties based on the form type
      } else {
        reportData.Recomendation = document.getElementById('rekomendasiPerbaikan').value;
        reportData.ActionDesc = "";
        reportData.EvidencePhoto = "";
        reportData.Status = "";
      }
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(reportData),
        redirect: 'follow',
      };
  
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === false) {
        showAlert(data.message, 'error');
      } else {
        showAlert("Data Pelaporan Berhasil di Input!", 'success');
        window.location.href = 'https://portsafe-apps.github.io/user/listreport.html';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);
  