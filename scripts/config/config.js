import { setCookieWithExpireHour } from "https://jscroot.github.io/cookie/croot.js";

export function getTokenFromAPI() {
  const tokenUrl =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/login-1";
  return fetch(tokenUrl)
    .then((response) => response.json())
    .then((tokenData) => {
      if (tokenData.token) {
        console.log("Token from API:", tokenData.token);
        return tokenData.token;
      } else {
        throw new Error("Token not found in API response");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch token:", error);
      throw error;
    });
}

export function GetDataForm() {
  const nipp = document.querySelector("#nipp").value;
  const nama = document.querySelector("#nama").value;
  const jabatan = document.querySelector("#jabatan").value;
  const locationName = document.getElementById('autoCompleteLocation').value; // Menggunakan variable yang benar
  const password = document.querySelector("#password").value;

  const role = "user"; // Set default role

  const data = {
    nipp: nipp,
    nama: nama,
    jabatan: jabatan,
    location: {
      LocationName: locationName, // Menggunakan variable yang benar
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
    handleLoginError("Invalid username, password, or role. Please try again.");
  }
}

function handleLoginSuccess(token, userRole) {
  setCookieWithExpireHour("Login", token, 2);

  const modalContent = `
    <div class="menu menu-box-modal rounded-m menu-success-1 menu-active" data-menu-height="300" data-menu-width="310">
      <h1 class="text-center mt-3 pt-1"><i class="fa fa-3x fa-check-circle color-green-dark shadow-xl rounded-circle"></i></h1>
      <h1 class="text-center mt-3 font-700">Success</h1>
      <p class="boxed-text-l">
        Anda berhasil login!.
      </p>
      <a href="#" class="close-menu btn btn-m btn-center-m button-s shadow-l rounded-s text-uppercase font-900 bg-green-light">Ok!</a>
    </div>
  `;

  // Sisipkan modal ke dalam body
  document.body.insertAdjacentHTML("beforeend", modalContent);

  // Opsional, Anda bisa menambahkan event listener untuk tombol
  const modal = document.querySelector(".menu-success-1");
  modal.querySelector(".btn").addEventListener("click", function () {
    const redirectURL = getRedirectURL(userRole);
    window.location.href = redirectURL;
  });
}

function getRedirectURL(userRole) {
  switch (userRole) {
    case "user":
      return "https://portsafe-apps.github.io/beranda.html";
    case "admin":
      return "https://portsafe-apps.github.io/admin/dashboard.html";
    default:
      return "https://portsafe-apps.github.io/login.html"; // Default redirect if role is unknown
  }
}

function handleLoginError(errorMessage) {
  // Ganti SweetAlert dengan menampilkan modal HTML
  const modal = document.querySelector(".menu-box-modal");
  const modalContent = modal.querySelector(".boxed-text-l");
  
  // Ganti konten modal dengan pesan kesalahan
  modalContent.innerHTML = `
    <p class="boxed-text-l">
      <strong>Login Failed!</strong><br>
      ${errorMessage}
    </p>
  `;

  // Tampilkan modal
  modal.style.display = "block";

  // Tambahkan event listener untuk menutup modal saat tombol "Go Back" diklik
  const goBackBtn = modal.querySelector(".close-menu");
  goBackBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}


export function AlertPost() {
  const modalContent = `
      <div class="menu menu-box-modal rounded-m menu-success-2 menu-active" data-menu-height="300" data-menu-width="310">
        <h1 class="text-center mt-3 pt-1"><i class="fa fa-3x fa-check-circle color-green-dark shadow-xl rounded-circle"></i></h1>
        <h1 class="text-center mt-3 font-700">Registrasi Berhasil</h1>
        <p class="boxed-text-l">
          Anda telah berhasil terdaftar!<br> Mudah untuk melampirkannya ke panggilan sukses.
        </p>
        <a href="https://portsafe-apps.github.io/login.html" class="close-menu btn btn-m btn-center-m button-s shadow-l rounded-s text-uppercase font-900 bg-green-light">Luar Biasa</a>
      </div>
    `;

  // Sisipkan modal ke dalam body
  document.body.insertAdjacentHTML("beforeend", modalContent);

  // Tambahkan event listener untuk tombol 'Great'
  const modal = document.querySelector(".menu-success-2");
  modal.querySelector(".btn").addEventListener("click", function () {
    window.location.href = "https://portsafe-apps.github.io/login.html";
  });
}

export function ResponsePost(result) {
  AlertPost(result);
}

export function ResponseLogin(result) {
  ResponsePostLogin(result);
}
