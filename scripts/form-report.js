// Function to extract the token from cookies
function getTokenFromCookies(cookieName) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

async function getUserWithToken() {
  const token = getTokenFromCookies("Login");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Authentication Error",
      text: "Kamu Belum Login!",
    }).then(() => {
      window.location.href = "https://portsafe-apps.github.io/";
    });
    return;
  }

  const targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      displayUserData(data.data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function untuk generate nomor pelaporan
const generateNomorPelaporan = () => {
  const tahunSekarang = new Date().getFullYear();
  const nomorUrut = Math.floor(Math.random() * 1000);
  const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut
    .toString()
    .padStart(3, "0")}`;
  return nomorPelaporan;
};

document.getElementById('nomorPelaporan').value = generateNomorPelaporan();

const resetNomorPelaporan = () => {
  document.getElementById('nomorPelaporan').value = generateNomorPelaporan();
};

// Function untuk generate tanggal saat ini
function generateTanggalSaatIni() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString("id-ID", options);
}
document.getElementById('tanggalPelaporan').value = generateTanggalSaatIni();

const resetTanggalPelaporan = () => {
  document.getElementById('tanggalPelaporan').value = generateTanggalSaatIni();
};

// Function untuk generate waktu saat ini dengan zona waktu Indonesia
function generateWaktuSaatIni() {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Jakarta",
  };
  return new Date().toLocaleTimeString("id-ID", options);
}

document.getElementById('waktuPelaporan').value = generateWaktuSaatIni();

const resetWaktuPelaporan = () => {
  document.getElementById('waktuPelaporan').value = generateWaktuSaatIni();
};


// Function to display user data in the wizard
function displayUserData(userData) {
  const namaPengawasElement = document.getElementById("namaPengawas");
  const jabatanPengawasElement = document.getElementById("jabatanPengawas");
  const autoCompleteLocationElement = document.getElementById("autoCompleteLocation");

  // Display user data
  if (userData) {
    namaPengawasElement.textContent = userData.nama;
    jabatanPengawasElement.textContent = userData.jabatan;
  } else {
    namaPengawasElement.textContent = "No user data found";
    jabatanPengawasElement.textContent = "";
  }

  // Display location data
  if (
    userData &&
    userData.location &&
    userData.location.locationName &&
    userData.location.locationName.toLowerCase().includes("branch")
  ) {
    autoCompleteLocationElement.value = userData.location.locationName;
    autoCompleteLocationElement.disabled = true;
  } else {
    autoCompleteLocationElement.value = userData && userData.location ? userData.location.locationName : "";
    autoCompleteLocationElement.disabled = false;
  }

}

// Call the function to get user data and display it
getUserWithToken();

