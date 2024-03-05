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

// Mendeklarasikan variabel secara global
let unsafeDataResponse, compromisedDataResponse, filteredUnsafeData, filteredCompromisedData;
// Deklarasi variabel global untuk grafik
let horizontalBarChart, horizontalBarChartForArea, pieChartForTypeDangerousActions;

// Function utama untuk memulai proses
async function initializeProcess() {
  // Mendapatkan token dari cookie
  const token = getTokenFromCookies("Login");

  // Memeriksa apakah token tersedia
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

  // URL untuk mengambil data tidak aman dan terompah
  const targetURLUnsafe = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe";
  const targetURLCompromised = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised";

  // Mengambil data tidak aman dan terompah dari server
  unsafeDataResponse = await fetchDataFromServer(targetURLUnsafe, "Unsafe Action", token);
  compromisedDataResponse = await fetchDataFromServer(targetURLCompromised, "Compromised Action", token);

  // Function untuk memproses data berdasarkan rentang tanggal yang dipilih
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

    // Menampilkan data setelah proses filter
    console.log("Filtered Unsafe Data:", filteredUnsafeData);
    console.log("Filtered Compromised Data:", filteredCompromisedData);

    // Memanggil fungsi untuk memperbarui chart
    updateCharts();
  }

  // Mendaftarkan elemen Litepicker
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
      plugins: ['ranges'],
      setup: (picker) => {
        picker.on("selected", (date1, date2) => {
          const start = date1 ? date1.format('MM/DD/YYYY') : null;
          const end = date2 ? date2.format('MM/DD/YYYY') : null;

          if (start && end) {
            processDataBasedOnRange(start, end, unsafeDataResponse.data, compromisedDataResponse.data);
          }
        });
      }
    });

    // Memproses data berdasarkan rentang tanggal default saat inisialisasi
    const defaultStartDate = picker.getStartDate(); 
    const defaultEndDate = picker.getEndDate(); 

    // Mengubah format tanggal menjadi 'MM/DD/YYYY'
    const formattedDefaultStartDate = defaultStartDate.format('MM/DD/YYYY');
    const formattedDefaultEndDate = defaultEndDate.format('MM/DD/YYYY');

    processDataBasedOnRange(formattedDefaultStartDate, formattedDefaultEndDate, unsafeDataResponse.data, compromisedDataResponse.data);
  }
}

const locationLabels = [
  "Kantor Pusat SPMT",
  "Branch Dumai",
  "Branch Belawan",
  "Branch Tanjung Intan",
  "Branch Bumiharjo - Bagendang",
  "Branch Tanjung Wangi",
  "Branch Makassar",
  "Branch Balikpapan",
  "Branch Trisakti - Mekar Putih",
  "Branch Jamrud Nilam Mirah",
  "Branch Lembar - Badas",
  "Branch Tanjung Emas",
  "Branch ParePare - Garongkong",
  "Branch Lhokseumawe",
  "Branch Malahayati",
  "Branch Gresik",
];

const areaLabels = [
  "Kantor",
  "Workshop",
  "Gudang",
  "Dermaga",
  "Lapangan Penumpukan",
  "Area kerja lainnya",
];

const typeDangerousActionsLabels = [
  "REAKSI ORANG",
  "ALAT PELINDUNG DIRI",
  "POSISI ORANG",
  "ALAT DAN PERLENGKAPAN",
  "PROSEDUR DAN CARA KERJA",
];

const colors = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(153, 102, 255, 0.8)",
];

let typeDangerousActionsCountsUnsafe = {};
let typeDangerousActionsCountsCompromised = {};

function processDataForLocationBarChartAndSort(filteredUnsafeData, filteredCompromisedData) {
  const locationCountsUnsafe = {};
  const locationCountsCompromised = {};

  filteredUnsafeData.forEach((report) => {
    const locationName = report.location ? report.location.locationName : "Unknown";
    locationCountsUnsafe[locationName] = (locationCountsUnsafe[locationName] || 0) + 1;
  });

  filteredCompromisedData.forEach((report) => {
    const locationName = report.location ? report.location.locationName : "Unknown";
    locationCountsCompromised[locationName] = (locationCountsCompromised[locationName] || 0) + 1;
  });

  const combinedLabels = locationLabels;
  const combinedDataUnsafe = locationLabels.map((location) => locationCountsUnsafe[location] || 0);
  const combinedDataCompromised = locationLabels.map((location) => locationCountsCompromised[location] || 0);

  return {
    labels: combinedLabels,
    dataUnsafe: combinedDataUnsafe,
    dataCompromised: combinedDataCompromised,
  };
}

function processDataForAreaBarChartAndSort(filteredUnsafeData, filteredCompromisedData) {
  const areaCountsUnsafe = {};
  const areaCountsCompromised = {};

  filteredUnsafeData.forEach((report) => {
    const areaName = report.area ? report.area.areaName : "Unknown";
    areaCountsUnsafe[areaName] = (areaCountsUnsafe[areaName] || 0) + 1;
  });

  filteredCompromisedData.forEach((report) => {
    const areaName = report.area ? report.area.areaName : "Unknown";
    areaCountsCompromised[areaName] = (areaCountsCompromised[areaName] || 0) + 1;
  });

  const combinedLabels = [...new Set([...Object.keys(areaCountsUnsafe), ...Object.keys(areaCountsCompromised)])];
  const combinedDataUnsafe = combinedLabels.map((area) => areaCountsUnsafe[area] || 0);
  const combinedDataCompromised = combinedLabels.map((area) => areaCountsCompromised[area] || 0);

  return {
    labels: combinedLabels,
    dataUnsafe: combinedDataUnsafe,
    dataCompromised: combinedDataCompromised,
  };
}

function processDataForTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData) {
  typeDangerousActionsCountsUnsafe = {};
  typeDangerousActionsCountsCompromised = {};

  filteredUnsafeData.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions ? report.typeDangerousActions[0] : { typeName: "Unknown" };
    typeDangerousActionsCountsUnsafe[typeDangerousAction.typeName] = (typeDangerousActionsCountsUnsafe[typeDangerousAction.typeName] || 0) + 1;
  });

  filteredCompromisedData.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions ? report.typeDangerousActions[0] : { typeName: "Unknown" };
    typeDangerousActionsCountsCompromised[typeDangerousAction.typeName] = (typeDangerousActionsCountsCompromised[typeDangerousAction.typeName] || 0) + 1;
  });

  const combinedTypeDangerousActionsLabels = typeDangerousActionsLabels;
  const combinedTypeDangerousActionsData = typeDangerousActionsLabels.map((type) => {
    const unsafeCount = typeDangerousActionsCountsUnsafe[type] || 0;
    const compromisedCount = typeDangerousActionsCountsCompromised[type] || 0;
    return unsafeCount + compromisedCount;
  });

  return {
    labels: combinedTypeDangerousActionsLabels,
    data: combinedTypeDangerousActionsData,
  };
}

function processDataForSubTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData, type) {
  const subtypesCounts = {};

  filteredUnsafeData.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions ? report.typeDangerousActions[0] : { typeName: "Unknown" };
    if (typeDangerousAction.typeName === type && typeDangerousAction.subTypes) {
      typeDangerousAction.subTypes.forEach((subtype) => {
        subtypesCounts[subtype] = subtypesCounts[subtype] || { count: 0, dataResponse: "Unsafe" };
        subtypesCounts[subtype].count++;
      });
    }
  });

  filteredCompromisedData.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions ? report.typeDangerousActions[0] : { typeName: "Unknown" };
    if (typeDangerousAction.typeName === type && typeDangerousAction.subTypes) {
      typeDangerousAction.subTypes.forEach((subtype) => {
        subtypesCounts[subtype] = subtypesCounts[subtype] || { count: 0, dataResponse: "Compromised" };
        subtypesCounts[subtype].count++;
      });
    }
  });

  const subtypesLabels = Object.keys(subtypesCounts);
  const subtypesData = subtypesLabels.map((subtype) => subtypesCounts[subtype].count);

  return {
    labels: subtypesLabels,
    data: subtypesData,
    dataResponse: subtypesCounts,
  };
}

function updateCharts() {
  const combinedLocationData = processDataForLocationBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedAreaData = processDataForAreaBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedTypeDangerousActionsData = processDataForTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData);

  // Update Location Bar Chart
  if (filteredUnsafeData.length === 0 && filteredCompromisedData.length === 0) {
    // Nonaktifkan tampilan chart jika data kosong
    document.getElementById('myHorizontalBarChartForLocation').style.display = 'none';
  } else {
    document.getElementById('myHorizontalBarChartForLocation').style.display = 'block';
    horizontalBarChart.data.labels = combinedLocationData.labels;
    horizontalBarChart.data.datasets[0].data = combinedLocationData.dataUnsafe;
    horizontalBarChart.data.datasets[1].data = combinedLocationData.dataCompromised;
  }

  // Update Area Bar Chart
  if (filteredUnsafeData.length === 0 && filteredCompromisedData.length === 0) {
    // Nonaktifkan tampilan chart jika data kosong
    document.getElementById('myHorizontalBarChartForArea').style.display = 'none';
  } else {
    document.getElementById('myHorizontalBarChartForArea').style.display = 'block';
    horizontalBarChartForArea.data.labels = combinedAreaData.labels;
    horizontalBarChartForArea.data.datasets[0].data = combinedAreaData.dataUnsafe;
    horizontalBarChartForArea.data.datasets[1].data = combinedAreaData.dataCompromised;
  }

  // Update Type Dangerous Actions Pie Chart
  if (filteredUnsafeData.length === 0 && filteredCompromisedData.length === 0) {
    // Nonaktifkan tampilan chart jika data kosong
    document.getElementById('myPieChartForTypeDangerousActions').style.display = 'none';
  } else {
    document.getElementById('myPieChartForTypeDangerousActions').style.display = 'block';
    pieChartForTypeDangerousActions.data.labels = combinedTypeDangerousActionsData.labels;
    pieChartForTypeDangerousActions.data.datasets[0].data = combinedTypeDangerousActionsData.data;
  }

  // Check if data from server is empty and update chart accordingly
  if (filteredUnsafeData.length === 0 || filteredCompromisedData.length === 0) {
    // Set default data for charts when server data is empty
    horizontalBarChart.data.labels = [];
    horizontalBarChart.data.datasets[0].data = [];
    horizontalBarChart.data.datasets[1].data = [];

    horizontalBarChartForArea.data.labels = [];
    horizontalBarChartForArea.data.datasets[0].data = [];
    horizontalBarChartForArea.data.datasets[1].data = [];

    pieChartForTypeDangerousActions.data.labels = [];
    pieChartForTypeDangerousActions.data.datasets[0].data = [];
  }

  // Update all charts
  horizontalBarChart.update();
  horizontalBarChartForArea.update();
  pieChartForTypeDangerousActions.update();
}


// Function untuk membuat dan menampilkan pie chart
function createAndDisplayPieChart(elementId, labels, data) {
  var ctx = document.getElementById(elementId);
  const pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
      // konfigurasi tooltips dan plugins lainnya
    },
  });
}

// Function untuk memperbarui dan menampilkan pie chart
function updateAndDisplayPieChart(elementId, labels, data) {
  const chartInstance = Chart.getChart(elementId);
  chartInstance.data.labels = labels;
  chartInstance.data.datasets[0].data = data;
  chartInstance.update();
}

// Menampilkan default pie chart subtype saat halaman dimuat
function showDefaultSubtypePieChart() {
  const maxIndex = combinedTypeDangerousActionsData.data.indexOf(Math.max(...combinedTypeDangerousActionsData.data));
  const maxType = combinedTypeDangerousActionsData.labels[maxIndex];
  const subtypesData = processDataForSubTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData, maxType);
  createAndDisplayPieChart("myPieChartForSubtypes", subtypesData.labels, subtypesData.data);
}


// Function untuk menginisialisasi chart
function initializeCharts() {
  const combinedLocationData = processDataForLocationBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedAreaData = processDataForAreaBarChartAndSort(filteredUnsafeData, filteredCompromisedData);
  const combinedTypeDangerousActionsData = processDataForTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData);

  // Location Bar Chart
  const ctxLocation = document.getElementById("myHorizontalBarChartForLocation");
  horizontalBarChart = new Chart(ctxLocation, {
    type: "horizontalBar",
    data: {
      labels: combinedLocationData.labels,
      datasets: [
        {
          label: "Unsafe",
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
          data: combinedLocationData.dataUnsafe,
        },
        {
          label: "Compromised",
          backgroundColor: "rgba(255, 165, 0, 0.8)",
          borderColor: "rgba(255, 165, 0, 1)",
          borderWidth: 1,
          data: combinedLocationData.dataCompromised,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              fontSize: 14,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: locationLabels.length, // Menampilkan semua label
              fontSize: 14,
            },
          },
        ],
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + tooltipItem.xLabel;
          },
        },
      },
    },
  });

  // Area Bar Chart
  const ctxArea = document.getElementById("myHorizontalBarChartForArea");
  horizontalBarChartForArea = new Chart(ctxArea, {
    type: "horizontalBar",
    data: {
      labels: combinedAreaData.labels,
      datasets: [
        {
          label: "Unsafe",
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
          data: combinedAreaData.dataUnsafe,
        },
        {
          label: "Compromised",
          backgroundColor: "rgba(255, 165, 0, 0.8)",
          borderColor: "rgba(255, 165, 0, 1)",
          borderWidth: 1,
          data: combinedAreaData.dataCompromised,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              fontSize: 14,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: areaLabels.length, // Menampilkan semua label
              fontSize: 14,
            },
          },
        ],
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + ": " + tooltipItem.xLabel;
          },
        },
      },
    },
  });

  // Type Dangerous Actions Pie Chart
  const ctxPie = document.getElementById("myPieChartForTypeDangerousActions");
  pieChartForTypeDangerousActions = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: combinedTypeDangerousActionsData.labels,
      datasets: [
        {
          data: combinedTypeDangerousActionsData.data,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleFontColor: "#6e707e",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        callbacks: {
          label: function (tooltipItem, data) {
            const datasetLabel = data.datasets[0].label || "";
            return `${datasetLabel}: ${data.labels[tooltipItem.index]} - ${data.datasets[0].data[tooltipItem.index]}`;
          },
          title: function (tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          },
        },
      },
      plugins: {
        datalabels: {
          formatter: (value) => {
            return `Total: ${value}`;
          },
          color: "#fff",
          anchor: "end",
          align: "start",
        },
      },
    },
  });

  // Menampilkan default pie chart subtype saat halaman dimuat
  showDefaultSubtypePieChart();

  // Menambahkan event listener untuk pie chart tipe tindakan berbahaya
  pieChartForTypeDangerousActions.canvas.addEventListener('click', function (event) {
    const activeElements = pieChartForTypeDangerousActions.getElementsAtEvent(event);
    if (activeElements.length > 0) {
      const clickedIndex = activeElements[0]._index;
      const clickedType = combinedTypeDangerousActionsData.labels[clickedIndex];

      // Mendapatkan data subtype untuk tipe yang diklik
      const subtypesData = processDataForSubTypeDangerousActionsPieChart(filteredUnsafeData, filteredCompromisedData, clickedType);

      // Memperbarui dan menampilkan pie chart subtype
      updateAndDisplayPieChart("myPieChartForSubtypes", subtypesData.labels, subtypesData.data);
    }
  });
}

// Membuat dan menampilkan chart setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Memulai proses
  initializeProcess();

  // Membuat dan menampilkan chart
  initializeCharts();
});
