import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

let userToken;

export function getTokenFromAPI() {
  const tokenUrl = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/login-1";
  return fetch(tokenUrl)
    .then(response => response.json())
    .then(tokenData => {
      if (tokenData.token) {
        userToken = tokenData.token;
        console.log('Token from API:', userToken);
        return userToken;
      }
      throw new Error('Token not found in API response');
    })
    .catch(error => {
      console.error('Failed to fetch token:', error);
      throw error;
    });
}

export function GetDataForm() {
  const nipp = document.querySelector("#nipp").value;
  const nama = document.querySelector("#nama").value;
  const jabatan = document.querySelector("#jabatan").value;
  const password = document.querySelector("#psw-input").value;

  const role = "user"; // Set default role

  const data = {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    password: password,
    role: role,
  };
  return data;
}

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
  console.log('API Response:', response);

  if (response && response.token) {
    const userRole = response.Role.toLowerCase();

    if (userRole === 'user') {
      handleLoginSuccess('user');
    } else if (userRole === 'admin') {
      handleLoginSuccess('admin');
    } else {
      console.error('Unknown role:', userRole);
      handleLoginError('Role not recognized');
    }
  } else {
    console.error('Token not found in API response');
    handleLoginError('Token not found in API response');
  }
}

function handleLoginSuccess(userRole) {
  setCookieWithExpireHour('Login', userToken, 2);

  Swal.fire({
    icon: 'success',
    title: 'Login Successful',
    text: 'You have successfully logged in!',
  }).then(() => {
    const redirectURL = getRedirectURL(userRole);
    window.location.href = redirectURL;
  });
}

function getRedirectURL(userRole) {
  if (userRole === 'user') {
    return 'https://portsafe-apps.github.io/pages/user/beranda.html';
  } else if (userRole === 'admin') {
    return 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
  } else {
    return 'https://portsafe-apps.github.io/'; // Default redirect if role is unknown
  }
}

function handleLoginError(errorMessage) {
  Swal.fire({
    icon: 'error',
    title: 'Login Failed',
    text: errorMessage,
  });
}

export function AlertPost() {
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
