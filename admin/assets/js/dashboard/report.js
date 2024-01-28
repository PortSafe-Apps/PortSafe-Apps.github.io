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

// Function to fetch data from the server (similar to your existing logic)
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
      return { category, data: [] };
    }

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(url, requestOptions);

    // Add error logging to fetchDataFromServer function
    if (!response.ok) {
      console.error(
        "Server responded with an error:",
        response.status,
        response.statusText
      );
      return { category, data: [] };
    }

    const data = await response.json();
    return { category, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { category, data: [] };
  }
}

// Unsafe Data Fetch
const unsafeDataResponse = await fetchDataFromServer(
  "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe",
  "Unsafe Action"
);

// Compromised Data Fetch
const compromisedDataResponse = await fetchDataFromServer(
  "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised",
  "Compromised Action"
);

// Unsafe Data Processing
const monthCountsUnsafe = Array(12).fill(0);

unsafeDataResponse.data.forEach((report) => {
  const month = new Date(report.date).getMonth();
  monthCountsUnsafe[month] += 1;
});

// Compromised Data Processing
const monthCountsCompromised = Array(12).fill(0);

compromisedDataResponse.data.forEach((report) => {
  const month = new Date(report.date).getMonth();
  monthCountsCompromised[month] += 1;
});

// Multi-axis Line Chart Example
var ctx = document.getElementById("myMultiAxisLineChart");
var multiAxisLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Unsafe",
        yAxisID: "y-axis-1",
        lineTension: 0.3,
        backgroundColor: "rgba(0, 97, 242, 0.05)",
        borderColor: "rgba(0, 97, 242, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(0, 97, 242, 1)",
        pointBorderColor: "rgba(0, 97, 242, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(0, 97, 242, 1)",
        pointHoverBorderColor: "rgba(0, 97, 242, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: monthCountsUnsafe,
      },
      {
        label: "Compromised",
        yAxisID: "y-axis-1",
        lineTension: 0.3,
        backgroundColor: "rgba(255, 99, 132, 0.05)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "rgba(255, 99, 132, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: monthCountsCompromised,
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
          time: {
            unit: "date",
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 7,
            fontSize: 14, // Tambahkan ini untuk mengatur ukuran font
          },
        },
      ],
      yAxes: [
        {
          id: "y-axis-1",
          position: "left",
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            callback: function (value, index, values) {
              return number_format(value);
            },
            fontSize: 14, // Tambahkan ini untuk mengatur ukuran font
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2],
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
          return datasetLabel + ": " + number_format(tooltipItem.yLabel);
        },
      },
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
        label: "Tidak Aman",
        backgroundColor: "rgba(0, 97, 242, 0.8)",
        borderColor: "rgba(0, 97, 242, 1)",
        borderWidth: 1,
        data: combinedData.dataUnsafe,
      },
      {
        label: "Terompah",
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
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
    // Tampilkan semua label pada sumbu y
    plugins: {
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        color: 'black',
        font: {
          size: 14,
        },
        formatter: function (value, context) {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
  },
});
