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

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  "'Poppins', '-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif'";
Chart.defaults.global.defaultFontColor = "#858796";

// Function for number formatting
function number_format(number) {
  const n = isFinite(+number) ? +number : 0;
  const dec = ".";
  const sep = " ";
  const toFixedFix = function (n) {
    return "" + Math.round(n);
  };

  const s = toFixedFix(n).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }

  return s.join(dec);
}

// Function untuk mengambil data dari server
async function fetchDataFromServer(url, category, token) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Login": token
      }
    });

    // Memeriksa apakah respons dari server berhasil
    if (!response.ok) {
      throw new Error(`Server responded with an error: ${response.status} ${response.statusText}`);
    }

    // Mengambil data dari respons
    const data = await response.json();

    // Memeriksa status data
    if (data.status === 200) {
      return { category, data: data.data };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return { category, data: [] };
  }
}

// Deklarasi variabel global untuk data
let unsafeDataResponse, compromisedDataResponse, filteredUnsafeData, filteredCompromisedData;

// Deklarasi variabel global untuk grafik
let horizontalBarChart, horizontalBarChartForArea, pieChartForTypeDangerousActions;

// Inisialisasi proses
async function initializeProcess() {
  // Mendapatkan token dari cookie
  const token = getTokenFromCookies("Login");

  // Memeriksa apakah token tersedia
  if (!token) {
    handleAuthenticationError();
    return;
  }

  // URL untuk mengambil data tidak aman dan terompah
  const targetURLUnsafe = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe";
  const targetURLCompromised = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised";

  // Mengambil data tidak aman dan terompah dari server
  unsafeDataResponse = await fetchDataFromServer(targetURLUnsafe, "Unsafe Action", token);
  compromisedDataResponse = await fetchDataFromServer(targetURLCompromised, "Compromised Action", token);

  // Set filteredUnsafeData and filteredCompromisedData to empty arrays if no data available
  filteredUnsafeData = unsafeDataResponse.data || [];
  filteredCompromisedData = compromisedDataResponse.data || [];

  // Menampilkan data setelah proses filter
  console.log("Filtered Unsafe Data:", filteredUnsafeData);
  console.log("Filtered Compromised Data:", filteredCompromisedData);

  // Memanggil fungsi untuk menginisialisasi grafik
  initializeCharts();
}

// Fungsi untuk menangani kesalahan autentikasi
function handleAuthenticationError() {
  Swal.fire({
    icon: "warning",
    title: "Authentication Error",
    text: "You are not logged in!",
  }).then(() => {
    window.location.href = "https://portsafe-apps.github.io/";
  });
}

// Fungsi untuk memproses data berdasarkan rentang tanggal yang dipilih
function processDataBasedOnRange(startDate, endDate, unsafeData, compromisedData) {
  // Memfilter data berdasarkan rentang tanggal yang dipilih
  filteredUnsafeData = unsafeData.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
  });

  filteredCompromisedData = compromisedData.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
  });

  // Memanggil fungsi untuk memperbarui grafik
  updateCharts();
}

// Mendeklarasikan elemen Litepicker
document.addEventListener('DOMContentLoaded', () => {
  const litepickerRangePlugin = document.getElementById('litepickerRangePlugin');
  if (litepickerRangePlugin) {
    // Inisialisasi Litepicker
    const picker = new Litepicker({
      element: litepickerRangePlugin,
      startDate: new Date(),
      endDate: new Date(),
      singleMode: false,
      numberOfMonths: 2,
      numberOfColumns: 2,
      format: 'MMM DD, YYYY',
      plugins: ['range'],
      onSelect: (startDate, endDate) => {
        processDataBasedOnRange(startDate, endDate, unsafeDataResponse.data, compromisedDataResponse.data);
      },
    });
  }
});

// Fungsi untuk menginisialisasi grafik
function initializeCharts() {
  // Initialize combinedLocationData and combinedAreaData variables
  const combinedLocationData = processDataForLocationBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedAreaData = processDataForAreaBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedTypeDangerousActionsData = processDataForTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData);

  // Inisialisasi grafik Horizontal Bar untuk Lokasi
  const ctxLocation = document.getElementById("myHorizontalBarChartForLocation");
  horizontalBarChart = new Chart(ctxLocation, {
    type: "horizontalBar",
    data: {
      labels: combinedLocationData.labels,
      datasets: [{
        label: "Unsafe Actions",
        backgroundColor: "#f8d7da",
        borderColor: "#f5c6cb",
        data: combinedLocationData.dataUnsafe,
      }, {
        label: "Compromised Actions",
        backgroundColor: "#cce5ff",
        borderColor: "#b8daff",
        data: combinedLocationData.dataCompromised,
      },],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        display: true,
        position: "bottom",
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: true,
            color: "rgba(0,0,0,.125)",
          },
        },],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: true,
            color: "rgba(0,0,0,.125)",
          },
        },],
      },
    },
  });

  // Inisialisasi grafik Horizontal Bar untuk Area
  const ctxArea = document.getElementById("myHorizontalBarChartForArea");
  horizontalBarChartForArea = new Chart(ctxArea, {
    type: "horizontalBar",
    data: {
      labels: combinedAreaData.labels,
      datasets: [{
        label: "Unsafe Actions",
        backgroundColor: "#f8d7da",
        borderColor: "#f5c6cb",
        data: combinedAreaData.dataUnsafe,
      }, {
        label: "Compromised Actions",
        backgroundColor: "#cce5ff",
        borderColor: "#b8daff",
        data: combinedAreaData.dataCompromised,
      },],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        display: true,
        position: "bottom",
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: true,
            color: "rgba(0,0,0,.125)",
          },
        },],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: true,
            color: "rgba(0,0,0,.125)",
          },
        },],
      },
    },
  });

  // Inisialisasi grafik Pie untuk Jenis Tindakan Berbahaya
  const ctxPie = document.getElementById("myPieChartForTypeDangerousActions");
  pieChartForTypeDangerousActions = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: combinedTypeDangerousActionsData.labels,
      datasets: [{
        data: combinedTypeDangerousActionsData.data,
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#d63031'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      },],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: true,
        position: "bottom",
      },
      cutoutPercentage: 80,
    },
  });

  // Menampilkan grafik setelah diinisialisasi
  document.getElementById('myHorizontalBarChartForLocation').style.display = 'block';
  document.getElementById('myHorizontalBarChartForArea').style.display = 'block';
  document.getElementById('myPieChartForTypeDangerousActions').style.display = 'block';
}

// Fungsi untuk memperbarui grafik
function updateCharts() {
  // Check if filteredUnsafeData or filteredCompromisedData is empty or undefined
  if (!filteredUnsafeData || !filteredCompromisedData || filteredUnsafeData.length === 0 || filteredCompromisedData.length === 0) {
    // Handle the case where there's no data available
    console.log("No data available to update charts.");

    filteredUnsafeData = [];
    filteredCompromisedData = [];

    return;
  }

  // Update Location Bar Chart
  horizontalBarChart.data.labels = combinedLocationData.labels;
  horizontalBarChart.data.datasets[0].data = combinedLocationData.dataUnsafe;
  horizontalBarChart.data.datasets[1].data = combinedLocationData.dataCompromised;

  // Update Area Bar Chart
  horizontalBarChartForArea.data.labels = combinedAreaData.labels;
  horizontalBarChartForArea.data.datasets[0].data = combinedAreaData.dataUnsafe;
  horizontalBarChartForArea.data.datasets[1].data = combinedAreaData.dataCompromised;

  // Update Type Dangerous Actions Pie Chart
  pieChartForTypeDangerousActions.data.labels = combinedTypeDangerousActionsData.labels;
  pieChartForTypeDangerousActions.data.datasets[0].data = combinedTypeDangerousActionsData.data;

  // Update all charts
  horizontalBarChart.update();
  horizontalBarChartForArea.update();
  pieChartForTypeDangerousActions.update();
}

// Memanggil fungsi untuk menginisialisasi proses
initializeProcess();
