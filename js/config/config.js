import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

//token
export function getTokenFromAPI() {
  const tokenUrl = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/login-1";
  fetch(tokenUrl)
    .then(response => response.json())
    .then(tokenData => {
      if (tokenData.token) {
        userToken = tokenData.token;
        console.log('Token dari API:', userToken);
      }
    })
    .catch(error => console.error('Gagal mengambil token:', error));
}
export function GetDataForm() {
  const nipp = document.querySelector("#nipp").value;
  const nama = document.querySelector("#nama").value;
  const jabatan = document.querySelector("#jabatan").value;
  const divisi = document.querySelector("#divisi").value;
  const bidang = document.querySelector("#bidang").value;
  const password = document.querySelector("#psw-input").value;

  // Set nilai default role langsung di dalam fungsi
  const role = "user";

  const data = {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    divisi: divisi,
    bidang: bidang,
    password: password,
    role: role,
  };
  return data

}

//login
export function PostLogin() {
  const nipp = document.getElementById("nipp").value;
  const password = document.getElementById("psw-input").value;

  const data = {
    nipp: nipp,
    password: password,
  };
  return data;
}


function ResponsePostLogin(response) {
  if (response && response.status) {
    setCookieWithExpireHour('Login', response.token, 2);

    const userRole = response.role; 

    if (loginSuccess) {
      if (userRole === 'user') {
        Swal.fire({
          icon: 'success',
          text: 'Login berhasil!',
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html'; 
        }, 2500); 
      } else if (userRole === 'admin') {
        Swal.fire({
          icon: 'success',
          text: 'Login berhasil!',
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
        }, 2500); 
      } else {
        Swal.fire({
          icon: 'error',
          text: `Role tidak dikenali: ${userRole}`,
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Login gagal. Silakan coba lagi.',
      });
    }
  }
}

const showAlert = (message, type = 'success') => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: false,
  });
};

export function AlertPost(value) {
  showAlert(`${value.message}\nRegistrasi Berhasil`, 'success');
  setTimeout(() => {
    window.location.href = "https://portsafe-apps.github.io/";
  }, 2500); // Delay sebelum redirect (dalam milidetik)
}

export function ResponsePost(result) {
  AlertPost(result);
}

export function ResponseLogin(result) {
  ResponsePostLogin(result)
}