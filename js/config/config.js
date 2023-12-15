import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

let userToken; // Tambahkan deklarasi variabel userToken

const showAlert = (options) => {
  Swal.fire(options);
};

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
  const password = document.querySelector("#psw-input").value;

  // Set nilai default role langsung di dalam fungsi
  const role = "user";

  const data = {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    password: password,
    role: role,
  };
  return data;
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
  if (response && response.Token) {
    setCookieWithExpireHour('Login', response.Token, 2);

    const userRole = response.Role;

    if (response.Status === true) {
      showAlert({
        icon: 'success',
        text: 'Login berhasil!',
        showConfirmButton: false,
      });

      // Redirect berdasarkan peran pengguna
      if (userRole === 'user') {
        setTimeout(() => {
          window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
        }, 2500);
      } else if (userRole === 'admin') {
        setTimeout(() => {
          window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
        }, 2500);
      } else {
        showAlert({
          icon: 'error',
          text: `Role tidak dikenali: ${userRole}`,
        });
      }
    } else {
      showAlert({
        icon: 'error',
        text: `Login gagal: ${response.Message}`,
      });
    }
  }
}

export function AlertPost(value) {
  showAlert({
    icon: 'success',
    text: `${value.message}\nRegistrasi Berhasil`,
    showConfirmButton: false,
  });
  setTimeout(() => {
    window.location.href = "https://portsafe-apps.github.io/";
  }, 2500); // Delay sebelum redirect (dalam milidetik)
}

export function ResponsePost(result) {
  AlertPost(result);
}

export function ResponseLogin(result) {
  ResponsePostLogin(result);
}
