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
  let currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Perbaikan: Tentukan apakah jam harus AM atau PM sebelum mengurangi 12 jam
  const ampm = currentHour >= 12 ? 'PM' : 'AM';

  // Konversi ke format 12 jam jika jam lebih dari 12
  if (currentHour > 12) {
    currentHour -= 12;
  }

  // Tambahkan 0 di depan jika menit kurang dari 10
  const formattedMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;

  // Menerapkan format waktu dan mengembalikannya
  const formattedTime = `${currentHour}:${formattedMinutes} ${ampm}`;

  return formattedTime;
}

document.getElementById("waktuPelaporan").textContent = generateWaktuSaatIni();


