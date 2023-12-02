import { deleteCookie } from 'https://jscroot.github.io/cookie/croot.js';

function logout() {
  deleteCookie('Login');
  window.location.href = 'https://portsafe-apps.github.io/';
}

document.getElementById('logoutButton').addEventListener('click', logout);