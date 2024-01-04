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

// Function to display user data in the wizard
function displayUserData(userData) {
  const namaPengawasElement = document.getElementById("namaPengawas");
  const jabatanPengawasElement = document.getElementById("jabatanPengawas");
  const autoCompleteLocationElement = document.getElementById("autoCompleteLocation");

  // Display user data
  if (userData) {
    namaPengawasElement.innerText = userData.nama;
    jabatanPengawasElement.innerText = userData.jabatan;
  } else {
    namaPengawasElement.innerText = "No user data found";
    jabatanPengawasElement.innerText = "";
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

  // Generate and display report information
  const nomorPelaporanElement = document.getElementById("nomorPelaporan");
  const tanggalPelaporanElement = document.getElementById("tanggalPelaporan");
  const waktuPelaporanElement = document.getElementById("waktuPelaporan");

  nomorPelaporanElement.innerText = generateNomorPelaporan();
  tanggalPelaporanElement.innerText = generateTanggalSaatIni();
  waktuPelaporanElement.innerText = generateWaktuSaatIni();
}

// Call the function to get user data and display it
getUserWithToken();

