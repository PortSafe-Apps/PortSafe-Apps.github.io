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

export function AlertPost(value){
    alert(value.message + "\nRegistrasi Berhasil")
    window.location.href= "https://portsafe-apps.github.io/index.html"
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
  
      // Mengasumsikan peran merupakan bagian dari token
      const userRole = response.token;
  
      if (userRole === 'user') {
        window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
      } else if (userRole === 'admin') {
        window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
      } else {
        console.error('Role tidak dikenali:', userRole);
        // Tangani peran yang tidak dikenali, jika diperlukan
      }
    } else {
      console.error('Gagal login:', response.Message);
      // Tangani kegagalan login, jika diperlukan
    }
  }
  
export function ResponsePost(result) {
    AlertPost(result);
}
export function ResponseLogin(result) {
  ResponsePostLogin(result)
}