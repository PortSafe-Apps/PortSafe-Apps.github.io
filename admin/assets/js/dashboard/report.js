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

// Mendeklarasikan variabel secara global
let unsafeDataResponse, compromisedDataResponse;

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

// Function untuk memproses data berdasarkan rentang tanggal yang dipilih
function processDataBasedOnRange(startDate, endDate, unsafeData, compromisedData) {
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  // Memfilter data berdasarkan rentang tanggal yang dipilih
  const filteredUnsafeData = unsafeData.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate >= startDate && reportDate <= endDate;
  });

  const filteredCompromisedData = compromisedData.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate >= startDate && reportDate <= endDate;
  });

  // Menampilkan data yang telah difilter
  console.log("Filtered Unsafe Data:", filteredUnsafeData);
  console.log("Filtered Compromised Data:", filteredCompromisedData);
}

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

  // Mendaftarkan elemen Litepicker
  const litepickerRangePlugin = document.getElementById('litepickerRangePlugin');
  if (litepickerRangePlugin) {
    // Inisialisasi Litepicker
    new Litepicker({
      element: litepickerRangePlugin,
      startDate: new Date(),
      endDate: new Date(),
      singleMode: false,
      numberOfMonths: 2,
      numberOfColumns: 2,
      format: 'MMM DD, YYYY',
      plugins: ['ranges'],
      // Ketika rentang tanggal dipilih
      onSelect: function(start, end) {
        // Memproses data berdasarkan rentang tanggal yang dipilih
        processDataBasedOnRange(start, end, unsafeDataResponse.data, compromisedDataResponse.data);
      }
    });
  }
}

// Memulai proses
initializeProcess();


// Inisialisasi Chart
var ctx = document.getElementById("myMultiAxisLineChart");
var multiAxisLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Unsafe",
        yAxisID: "y-axis-1",
        lineTension: 0.3,
        backgroundColor: "rgba(255, 0, 0, 0.05)",
        borderColor: "rgba(255, 0, 0, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        pointBorderColor: "rgba(255, 0, 0, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
        pointHoverBorderColor: "rgba(255, 0, 0, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [],
      },
      {
        label: "Compromised",
        yAxisID: "y-axis-1",
        lineTension: 0.3,
        backgroundColor: "rgba(0, 0, 255, 0.05)",
        borderColor: "rgba(0, 0, 255, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(0, 0, 255, 1)",
        pointBorderColor: "rgba(0, 0, 255, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(0, 0, 255, 1)",
        pointHoverBorderColor: "rgba(0, 0, 255, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            label += ": ";
          }
          label += number_format(tooltipItem.yLabel);
          return label;
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Date",
          },
          gridLines: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 10,
          },
        },
      ],
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          scaleLabel: {
            display: true,
            labelString: "Number of Reports",
          },
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              return number_format(value);
            },
          },
        },
      ],
    },
  },
});


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

// Process Data for Location Bar Chart and Sort
function processDataForLocationBarChartAndSort(
  unsafeDataResponse,
  compromisedDataResponse
) {
  const locationCountsUnsafe = {};
  const locationCountsCompromised = {};

  // Process Unsafe Data
  unsafeDataResponse.data.forEach((report) => {
    const locationName = report.location
      ? report.location.locationName
      : "Unknown";
    if (!locationCountsUnsafe[locationName]) {
      locationCountsUnsafe[locationName] = 1;
    } else {
      locationCountsUnsafe[locationName]++;
    }
  });

  // Process Compromised Data
  compromisedDataResponse.data.forEach((report) => {
    const locationName = report.location
      ? report.location.locationName
      : "Unknown";
    if (!locationCountsCompromised[locationName]) {
      locationCountsCompromised[locationName] = 1;
    } else {
      locationCountsCompromised[locationName]++;
    }
  });

  // Combine labels and counts
  const combinedLabels = locationLabels;
  const combinedDataUnsafe = locationLabels.map(
    (location) => locationCountsUnsafe[location] || 0
  );
  const combinedDataCompromised = locationLabels.map(
    (location) => locationCountsCompromised[location] || 0
  );

  return {
    labels: combinedLabels,
    dataUnsafe: combinedDataUnsafe,
    dataCompromised: combinedDataCompromised,
  };
}

const combinedData = processDataForLocationBarChartAndSort(
  unsafeDataResponse,
  compromisedDataResponse
);

var ctxLocation = document.getElementById("myHorizontalBarChart");
var horizontalBarChart = new Chart(ctxLocation, {
  type: "horizontalBar",
  data: {
    labels: combinedData.labels,
    datasets: [
      {
        label: "Unsafe",
        backgroundColor: "rgba(255, 0, 0, 0.8)", // Merah
        borderColor: "rgba(255, 0, 0, 1)", // Merah
        borderWidth: 1,
        data: combinedData.dataUnsafe,
      },
      {
        label: "Compromised",
        backgroundColor: "rgba(255, 165, 0, 0.8)", // Oranye dengan transparansi 0.8
        borderColor: "rgba(255, 165, 0, 1)", // Oranye
        borderWidth: 1,
        data: combinedData.dataCompromised,
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

const areaLabels = [
  "Kantor",
  "Workshop",
  "Gudang",
  "Dermaga",
  "Lapangan Penumpukan",
  "Area kerja lainnya",
];

// Process Data for Area Bar Chart and Sort
function processDataForAreaBarChartAndSort(
  unsafeDataResponse,
  compromisedDataResponse
) {
  const areaCountsUnsafe = {};
  const areaCountsCompromised = {};

  // Process Unsafe Data
  unsafeDataResponse.data.forEach((report) => {
    const areaName = report.area ? report.area.areaName : "Unknown";
    if (!areaCountsUnsafe[areaName]) {
      areaCountsUnsafe[areaName] = 1;
    } else {
      areaCountsUnsafe[areaName]++;
    }
  });

  // Process Compromised Data
  compromisedDataResponse.data.forEach((report) => {
    const areaName = report.area ? report.area.areaName : "Unknown";
    if (!areaCountsCompromised[areaName]) {
      areaCountsCompromised[areaName] = 1;
    } else {
      areaCountsCompromised[areaName]++;
    }
  });

  // Combine labels and counts
  const combinedAreaLabels = areaLabels;
  const combinedAreaDataUnsafe = areaLabels.map(
    (area) => areaCountsUnsafe[area] || 0
  );
  const combinedAreaDataCompromised = areaLabels.map(
    (area) => areaCountsCompromised[area] || 0
  );

  return {
    labels: combinedAreaLabels,
    dataUnsafe: combinedAreaDataUnsafe,
    dataCompromised: combinedAreaDataCompromised,
  };
}

const combinedAreaData = processDataForAreaBarChartAndSort(
  unsafeDataResponse,
  compromisedDataResponse
);

var ctxArea = document.getElementById("myHorizontalBarChartForArea");
var horizontalBarChartForArea = new Chart(ctxArea, {
  type: "horizontalBar",
  data: {
    labels: combinedAreaData.labels,
    datasets: [
      {
        label: "Unsafe",
        backgroundColor: "rgba(255, 0, 0, 0.8)", // Merah
        borderColor: "rgba(255, 0, 0, 1)", // Merah
        borderWidth: 1,
        data: combinedData.dataUnsafe,
      },
      {
        label: "Compromised",
        backgroundColor: "rgba(255, 165, 0, 0.8)", // Oranye dengan transparansi 0.8
        borderColor: "rgba(255, 165, 0, 1)", // Oranye
        borderWidth: 1,
        data: combinedData.dataCompromised,
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
            maxTicksLimit: areaLabels.length, // Display all labels
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

const typeDangerousActionsLabels = [
  "REAKSI ORANG",
  "ALAT PELINDUNG DIRI",
  "POSISI ORANG",
  "ALAT DAN PERLENGKAPAN",
  "PROSEDUR DAN CARA KERJA",
];

// Define colors for both series
const colors = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(153, 102, 255, 0.8)",
];

// Declare variables here in the appropriate scope
const typeDangerousActionsCountsUnsafe = {};
const typeDangerousActionsCountsCompromised = {};

// Process Data for Type Dangerous Actions Pie Chart
function processDataForTypeDangerousActionsPieChart(
  unsafeDataResponse,
  compromisedDataResponse
) {
  // Process Unsafe Data
  unsafeDataResponse.data.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions
      ? report.typeDangerousActions[0]
      : { typeName: "Unknown" };

    const typeName = typeDangerousAction.typeName;
    if (!typeDangerousActionsCountsUnsafe[typeName]) {
      typeDangerousActionsCountsUnsafe[typeName] = 1;
    } else {
      typeDangerousActionsCountsUnsafe[typeName]++;
    }
  });

  // Process Compromised Data
  compromisedDataResponse.data.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions
      ? report.typeDangerousActions[0]
      : { typeName: "Unknown" };

    const typeName = typeDangerousAction.typeName;
    if (!typeDangerousActionsCountsCompromised[typeName]) {
      typeDangerousActionsCountsCompromised[typeName] = 1;
    } else {
      typeDangerousActionsCountsCompromised[typeName]++;
    }
  });

  // Combine labels and counts
  const combinedTypeDangerousActionsLabels = typeDangerousActionsLabels;
  const combinedTypeDangerousActionsData = typeDangerousActionsLabels.map(
    (type) => {
      const unsafeCount = typeDangerousActionsCountsUnsafe[type] || 0;
      const compromisedCount = typeDangerousActionsCountsCompromised[type] || 0;
      return unsafeCount + compromisedCount;
    }
  );

  return {
    labels: combinedTypeDangerousActionsLabels,
    data: combinedTypeDangerousActionsData,
  };
}

const combinedTypeDangerousActionsData =
  processDataForTypeDangerousActionsPieChart(
    unsafeDataResponse,
    compromisedDataResponse
  );

// Function to find the maximum type from combined data
function findMaxType(data) {
  let maxType = '';
  let maxCount = 0;

  for (const type in data) {
    if (data[type] > maxCount) {
      maxCount = data[type];
      maxType = type;
    }
  }

  return maxType;
}
var ctxTypeDangerousActions = document.getElementById(
  "myPieChartForTypeDangerousActions"
);
const pieChartForTypeDangerousActions = new Chart(ctxTypeDangerousActions, {
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
          const unsafeValue =
            typeDangerousActionsCountsUnsafe[data.labels[tooltipItem.index]] ||
            0;
          const compromisedValue =
            typeDangerousActionsCountsCompromised[
              data.labels[tooltipItem.index]
            ] || 0;
          return `${datasetLabel}: Unsafe ${unsafeValue}, Compromised ${compromisedValue}`;
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

// Process Data for SubType Dangerous Actions Pie Chart
function getSubtypesData(type) {
  const subtypesCounts = {};

  unsafeDataResponse.data.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions
      ? report.typeDangerousActions[0]
      : { typeName: "Unknown" };

    const typeName = typeDangerousAction.typeName;
    if (typeName === type && typeDangerousAction.subTypes) {
      typeDangerousAction.subTypes.forEach((subtype) => {
        if (!subtypesCounts[subtype]) {
          subtypesCounts[subtype] = {
            count: 1,
            dataResponse: "Unsafe"
          };
        } else {
          subtypesCounts[subtype].count++;
        }
      });
    }
  });

  compromisedDataResponse.data.forEach((report) => {
    const typeDangerousAction = report.typeDangerousActions
      ? report.typeDangerousActions[0]
      : { typeName: "Unknown" };

    const typeName = typeDangerousAction.typeName;
    if (typeName === type && typeDangerousAction.subTypes) {
      typeDangerousAction.subTypes.forEach((subtype) => {
        if (!subtypesCounts[subtype]) {
          subtypesCounts[subtype] = {
            count: 1,
            dataResponse: "Compromised"
          };
        } else {
          subtypesCounts[subtype].count++;
        }
      });
    }
  });

  const subtypesLabels = Object.keys(subtypesCounts);
  const subtypesData = subtypesLabels.map((subtype) => subtypesCounts[subtype].count);

  return {
    labels: subtypesLabels,
    data: subtypesData,
    dataResponse: subtypesCounts
  };
}

// Function to create and display a pie chart for subtypes
function createSubtypesPieChart(subtypesData) {
  var ctxSubtypes = document.getElementById("myPieChartForSubtypes");
  const pieChartForSubtypes = new Chart(ctxSubtypes, {
    type: "pie",
    data: {
      labels: subtypesData.labels,
      datasets: [
        {
          data: subtypesData.data,
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
            return `${datasetLabel}: ${data.labels[tooltipItem.index]} - ${
              data.datasets[0].data[tooltipItem.index]
            }`;
          },
          title: function (tooltipItem, data) {
            const subtypeLabel = data.labels[tooltipItem[0].index];
            const dataResponse = subtypesData.dataResponse[subtypeLabel].dataResponse;
            return `${dataResponse}`;
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
}

// Function to show default subtype pie chart with the highest type
function showDefaultSubtypePieChart() {
  const maxIndex = combinedTypeDangerousActionsData.data.indexOf(Math.max(...combinedTypeDangerousActionsData.data));
  const maxType = combinedTypeDangerousActionsData.labels[maxIndex];
  const subtypesData = getSubtypesData(maxType);
  createSubtypesPieChart(subtypesData);
}


// Show default subtype pie chart on page load
showDefaultSubtypePieChart();

// Event listener for dangerous actions pie chart
pieChartForTypeDangerousActions.canvas.addEventListener('click', function (event) {
  const activeElements = pieChartForTypeDangerousActions.getElementsAtEvent(event);
  if (activeElements.length > 0) {
    const clickedIndex = activeElements[0]._index;
    const clickedType = combinedTypeDangerousActionsData.labels[clickedIndex];

    // Get subtypes data for the clicked type
    const subtypesData = getSubtypesData(clickedType);

    // Create and display subtypes pie chart
    createSubtypesPieChart(subtypesData);
  }
});