import { deleteCookie } from 'https://jscroot.github.io/cookie/croot.js';

document.addEventListener('DOMContentLoaded', function () {
  // Deklarasi fungsi logout
  function logout() {
    deleteCookie('Login');
    window.location.href = 'https://portsafe-apps.github.io/';
  }

  // Menambahkan event listener pada elemen dengan ID 'logoutButton'
  document.getElementById('logoutButton').addEventListener('click', logout);
});