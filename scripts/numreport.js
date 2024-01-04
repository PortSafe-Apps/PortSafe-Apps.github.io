const generateNomorPelaporan = () => {
  const tahunSekarang = new Date().getFullYear();
  const nomorUrut = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
  const nomorPelaporan = `${tahunSekarang}-K3-${nomorUrut
    .toString()
    .padStart(3, "0")}`;
  return nomorPelaporan;
};

document.getElementById("nomorPelaporan").textContent =
  generateNomorPelaporan();

// Function untuk generate tanggal saat ini
function generateTanggalSaatIni() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString("id-ID", options);
}

document.getElementById("tanggalPelaporan").textContent =
  generateTanggalSaatIni();

// Function untuk generate waktu saat ini dengan zona waktu Indonesia
function generateWaktuSaatIni() {
  const currentTime = new Date();
  const options = {
    hour: "2-digit",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Jakarta",
  };

  return currentTime.toLocaleTimeString("id-ID", options);
}

document.getElementById("waktuPelaporan").textContent = generateWaktuSaatIni();
