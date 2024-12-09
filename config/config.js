// Fungsi untuk menyimpan cookie
function setCookieWithExpireHour(cookieName, cookieValue, expireHours) {
  const date = new Date();
  date.setTime(date.getTime() + expireHours * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Fungsi untuk menangani keberhasilan login
function handleLoginSuccess(token, userRole) {
  setCookieWithExpireHour("Login", token, 2);

  Swal.fire({
    icon: "success",
    title: "Login Successful",
    text: "You have successfully logged in!",
  }).then(() => {
    const redirectURL = getRedirectURL(userRole);
    window.location.href = redirectURL;
  });
}

// Fungsi untuk mendapatkan URL pengalihan berdasarkan peran
function getRedirectURL(userRole) {
  switch (userRole) {
    case "user":
      return "https://portsafe-apps.github.io/user/beranda.html";
    case "admin":
      return "https://portsafe-apps.github.io/admin/dashboard.html";
    default:
      return "https://portsafe-apps.github.io/"; // Default jika peran tidak diketahui
  }
}

// Event listener untuk menangani form login
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Mencegah refresh halaman

  const nipp = document.getElementById("nipp").value;
  const password = document.getElementById("password").value;

  try {
    // Panggilan ke API login
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nipp, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login Response:", data); // Debug log

      // Pastikan API mengembalikan token dan userRole
      if (data.token && data.userRole) {
        handleLoginSuccess(data.token, data.userRole);
      } else {
        throw new Error("Invalid response structure");
      }
    } else {
      Swal.fire("Login Failed", "Invalid NIPP or Password", "error");
    }
  } catch (error) {
    console.error("Login Error:", error);
    Swal.fire("Error", "Something went wrong. Please try again later.", "error");
  }
});
