// Function untuk extract token dari cookies
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

// Function untuk mengambil nama dan jabatan pengawas dari server
async function getPengawas() {
  const token = getTokenFromCookies("Login");

  if (!token) {
    showAlert("Authentication Error", "Kamu Belum Login!");
    window.location.href = "https://portsafe-apps.github.io/";
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
      return {
        nama: data.data[0].nama,
        jabatan: data.data[0].jabatan,
        location: data.data[0].location,
      };
    } else {
      showAlert("Error", data.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error in getPengawas:", error);
    showAlert("Error", "Error fetching user data");
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

// Function untuk generate tanggal saat ini
function generateTanggalSaatIni() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString("id-ID", options);
}

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

async function displayReportData() {
  try {
    const nomorPelaporanElement = document.querySelector(
      "#nomorPelaporanElement"
    );
    const tanggalPelaporanElement = document.querySelector(
      "#tanggalPelaporanElement"
    );
    const waktuPelaporanElement = document.querySelector(
      "#waktuPelaporanElement"
    );
    const namaPengawasElement = document.querySelector(
      "#namaPengawasElement"
    );
    const jabatanPengawasElement = document.querySelector(
      "#jabatanPengawasElement"
    );
    const autoCompleteLocationElement = document.querySelector(
      "#autoCompleteLocation"
    );

    if (
      !nomorPelaporanElement ||
      !tanggalPelaporanElement ||
      !waktuPelaporanElement ||
      !namaPengawasElement ||
      !jabatanPengawasElement ||
      !autoCompleteLocationElement
    ) {
      throw new Error("One or more elements not found");
    }

    const pengawasData = await getPengawas();
    const { nama, jabatan, location } = pengawasData || {};

    const nomorPelaporan = generateNomorPelaporan();
    const tanggalPelaporan = generateTanggalSaatIni();
    const waktuPelaporan = generateWaktuSaatIni();

    nomorPelaporanElement.innerText = nomorPelaporan;
    tanggalPelaporanElement.innerText = tanggalPelaporan;
    waktuPelaporanElement.innerText = waktuPelaporan;
    namaPengawasElement.innerText = nama;
    jabatanPengawasElement.innerText = jabatan;

    if (
      location &&
      location.locationName &&
      location.locationName.toLowerCase().includes("branch")
    ) {
      autoCompleteLocationElement.value = location.locationName;
      autoCompleteLocationElement.disabled = true;
    } else {
      autoCompleteLocationElement.value = location && location.locationName ? location.locationName : "";
      autoCompleteLocationElement.disabled = false;
    }
  } catch (error) {
    console.error("Error in displayReportData:", error);
  }
}

// Call the display function
displayReportData();