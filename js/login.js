import { setCookieWithExpireHour } from "https://jscroot.github.io/cookie/croot.js";

// Mengambil nilai dari elemen input pada html
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("psw-input");
const submitButton = document.getElementById("submit");
const errorMessage = document.getElementById("error-message");

// Fungsi untuk mengecek apakah form telah diisi dengan benar
const validation = () => {
  const username = usernameInput.value;
  const pass = passwordInput.value;
  if (username !== "" && pass !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

// Panggil fungsi validation saat input berubah
usernameInput.addEventListener("input", validation);
passwordInput.addEventListener("input", validation);

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/PortPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === true) {
        const token = data.token;
        const userRole = data.role; // Ubah ini sesuai dengan respons dari server
      
        // Check role before redirecting
        if (userRole === "admin") {
          setCookieWithExpireHour("token", token, 2);
          window.location.href = "/pages/admin/dashboard.html";
        } else if (userRole === "user") {
          setCookieWithExpireHour("token", token, 2);
          window.location.href = "/pages/user/beranda.html";
        } else {
          errorMessage.textContent = userRole
          errorMessage.textContent = "Role tidak dikenal";
        }
      } else {
        errorMessage.textContent = "Pengguna tidak ditemukan";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
