import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

export function getTokenFromAPI() {
  const tokenUrl = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/login-1";
  return fetch(tokenUrl)
    .then(response => response.json())
    .then(tokenData => {
      if (tokenData.token) {
        console.log('Token from API:', tokenData.token);
        return tokenData.token;
      } else {
        throw new Error('Token not found in API response');
      }
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
  const location = document.querySelector("#autoCompleteLocation").value;
  const password = document.querySelector("#password").value;

  const role = "user"; // Set default role

  const data = {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    Location: {
      LocationName: location,
    },
    password: password,
    role: role,
  };
  return data;
}

export function PostLogin() {
  const nipp = document.getElementById("nipp").value;
  const password = document.getElementById("password").value;

  const data = {
    nipp: nipp,
    password: password,
  };
  return data;
}

function ResponsePostLogin(response) {
  if (response && response.token) {
    handleLoginSuccess(response.token, response.role);
  } else {
    handleLoginError('Invalid username, password, or role. Please try again.');
  }
}

function handleLoginSuccess(token, userRole) {
  setCookieWithExpireHour('Login', token, 2);

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
  switch (userRole) {
    case 'user':
      return 'https://portsafe-apps.github.io/beranda.html';
    case 'admin':
      return 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
    default:
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
