import { setCookieWithExpireHour } from 'https://jscroot.github.io/cookie/croot.js';

//token
export function getTokenFromAPI() {
  const tokenUrl = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/login";
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

//register
export function GetDataForm(){
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

    return data;
}

//login
export function PostLogin() {
  const nipp = document.getElementById("nipp").value;
  const password = document.getElementById("password").value;

  const data = {
    nipp: nipp,
    password: password,
  };
  return data;
}


export function AlertPost(value){
    // alert(value.message + "\nRegistrasi Berhasil")
    window.location.href= "https://portsafe-apps.github.io/index.html"
}


function ResponsePostLogin(response) {
    if (response && response.token) {
      // console.log('Token User:', response.token);
      setCookieWithExpireHour('Login', response.token, 2);
      
      // Memeriksa role setelah login
      const userRole = response.role;
  
      if (userRole === 'user') {
        // Jika role adalah 'user', arahkan ke halaman user
        window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
      } else if (userRole === 'admin') {
        // Jika role adalah 'admin', arahkan ke halaman admin
        window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
      } else {
        // Role tidak dikenali, mungkin ada logika tambahan di sini
        console.error('Role tidak dikenali:', userRole);
      }
      // alert("Selamat Datang")
    } else {
      // alert('Login gagal. Silakan coba lagi.');
    }
  }
  


export function ResponsePost(result) {
    AlertPost(result);
}
export function ResponseLogin(result) {
  ResponsePostLogin(result)
}