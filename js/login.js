loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  fetch("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/PortLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data dari server:", data);
      if (data.status === true) {
        const token = data.token;
        
        console.log("Username : ", data.data.Username);

        // Ganti dengan perbandingan langsung terhadap data.data.Username
        if (data.data.Username === "admin") {
          setCookieWithExpireHour("token", token, 2);
          window.location.href = "/pages/admin/dashboard.html";
        } else {
          setCookieWithExpireHour("token", token, 2);
          window.location.href = "/pages/user/beranda.html";
        }
      } else {
        errorMessage.textContent = "Pengguna tidak ditemukan";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
