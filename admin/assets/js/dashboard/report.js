// Mendapatkan referensi ke elemen canvas
const ctx = document.getElementById("myLineChart").getContext("2d");

// Membuat objek grafik menggunakan Chart.js
const myLineChart = new Chart(ctx, {
  type: 'line',
  data: {}, // Anda bisa membiarkannya kosong karena akan diperbarui segera
  options: {} // Juga bisa kosong atau sesuai kebutuhan Anda
});

// Fungsi untuk mendapatkan token dari cookie
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

// Fungsi untuk mengambil data dari server
async function fetchDataFromServer(url, category) {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      // Tangani kesalahan autentikasi jika tidak ada token
      Swal.fire({
        icon: "warning",
        title: "Authentication Error",
        text: "Kamu Belum Login!",
      }).then(() => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return [];
    }

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return {
      category: category,
      data: data.data || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Fungsi untuk memperbarui grafik dengan data yang diambil
async function updateChart() {
  const unsafeData = await fetchDataFromServer(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser",
    "Unsafe Action"
  );

  const compromisedData = await fetchDataFromServer(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser",
    "Compromised Action"
  );

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const datasets = [
    {
      label: unsafeData.category,
      lineTension: 0.3,
      backgroundColor: "rgba(255, 0, 0, 0.1)", // Warna area untuk Unsafe Action
      borderColor: "rgba(255, 0, 0, 1)",
      pointRadius: 3,
      pointHoverRadius: 3,
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: unsafeData.data,
    },
    {
      label: compromisedData.category,
      lineTension: 0.3,
      backgroundColor: "rgba(0, 97, 242, 0.1)", // Warna area untuk Compromised Action
      borderColor: "rgba(0, 97, 242, 1)",
      pointRadius: 3,
      pointHoverRadius: 3,
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: compromisedData.data,
    },
  ];

  const updatedData = {
    labels: labels,
    datasets: datasets,
  };

  // Mengasumsikan myLineChart adalah referensi ke grafik yang sudah ada
  myLineChart.data = updatedData;
  myLineChart.update();
}

// Panggil fungsi updateChart untuk mengisi awal grafik
updateChart();

// Anda juga dapat menyiapkan timer atau listener acara untuk secara berkala memperbarui grafik
// Misalnya, perbarui grafik setiap 5 menit
// setInterval(updateChart, 5 * 60 * 1000);
