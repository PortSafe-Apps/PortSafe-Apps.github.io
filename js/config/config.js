import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

let userToken; // Tambahkan deklarasi variabel userToken


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
  if (response && response.token) {
    setCookieWithExpireHour('Login', response.token, 2);

    const userRole = response.Role;

    // Redirect berdasarkan peran pengguna
    if (userRole === 'user') {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in!',
      }).then(() => {
        window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
      });
    } else if (userRole === 'admin') {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in!',
      }).then(() => {
        window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username, password, or role. Please try again.',
      });
    }
  }
}

export function AlertPost(value) {
  Swal.fire({
    icon: 'success',
    title: 'Registration Successful',
    text: 'You have successfully registered!',
  }).then(() => {
    window.location.href = "https://portsafe-apps.github.io/";
  });
}

export function ResponsePost(result) {
  AlertPost(result);
}

export function ResponseLogin(result) {
  ResponsePostLogin(result);
}
