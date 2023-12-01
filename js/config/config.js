import { setTokenCookie, redirectAfterLogin } from './template.js';
import { decodeToken } from './utils.js';

export function setToken(response) {
  if (response && response.token) {
    setTokenCookie(response.token);
    handleLoginResponse(response.token);
  } else {
    handleLoginError();
  }
}

export function handleLoginResponse(token) {
  const decodedToken = decodeToken(token);

  // Lakukan redirect berdasarkan peran (role)
  redirectBasedOnRole(decodedToken);
}

export function handleLoginError() {
  // Handle login error, show message, etc.
}

// Fungsi untuk melakukan redirect berdasarkan peran (role)
export function redirectBasedOnRole(decodedToken) {
    switch (decodedToken.role) {
      case 'admin':
        window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
        break;
      case 'user':
        window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
        break;
      default:
        console.error('Role tidak valid atau tidak terdefinisi');
    }
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

  return {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    divisi: divisi,
    bidang: bidang,
    password: password,
    role: role,
  };
}

export function AlertPost(value) {
  alert(value.message + "\nRegistrasi Berhasil");
  window.location.href = "https://portsafe-apps.github.io/index.html";
}

export function ResponsePostLogin(response) {
  if (response && response.token) {
    setTokenCookie('Login', response.token, 2);
    handleLoginResponse(response.token);
  } else {
    handleLoginError();
  }
}

export function ResponsePost(result) {
  AlertPost(result);
}

export function ResponseLogin(result) {
  ResponsePostLogin(result);
}