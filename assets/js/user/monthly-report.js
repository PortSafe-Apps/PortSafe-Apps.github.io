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
const fetchDataFromServer = async () => {
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

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Fungsi untuk Memproses Data dan Membuat Grafik menggunakan ApexCharts
function processDataAndCreateCharts(data) {
  const months = Array.from(new Set(data.map(report => new Date(report.date).getMonth())));
  const monthLabels = months.map(month => monthToLabel(month));

  const monthlyChartData = {
    chart: {
      type: 'line'
    },
    series: [{
      name: 'Total Reports per Month',
      data: months.map(month => getReportsCountByMonth(data, month))
    }],
    xaxis: {
      categories: monthLabels
    }
  };

  // Panggil fungsi untuk membuat grafik dengan ApexCharts
  createApexChart("monthlyChart", monthlyChartData, function (monthIndex) {
    const selectedMonth = months[monthIndex];
    const monthlyData = data.filter(report => new Date(report.date).getMonth() === selectedMonth);

    const locations = Array.from(new Set(monthlyData.map(report => report.location.locationName)));
    const areas = Array.from(new Set(monthlyData.map(report => report.area.areaName)));
    const types = Array.from(new Set(monthlyData.flatMap(report => report.typeDangerousActions.map(type => type.typeName))));
    const subtypes = Array.from(new Set(monthlyData.flatMap(report => report.typeDangerousActions.flatMap(type => type.subTypes))));

    const locationChartData = {
      chart: {
        type: 'bar'
      },
      series: [{
        name: 'Total Reports by Location',
        data: locations.map(location => getLocationReportsCount(monthlyData, location))
      }],
      xaxis: {
        categories: locations
      }
    };

    const areaChartData = {
      chart: {
        type: 'bar'
      },
      series: [{
        name: 'Total Reports by Area',
        data: areas.map(area => getAreaReportsCount(monthlyData, area))
      }],
      xaxis: {
        categories: areas
      }
    };

    const typeChartData = {
      chart: {
        type: 'pie'
      },
      series: types.map(type => getTypeReportsCount(monthlyData, type)),
      labels: types
    };

    const subtypeChartData = {
      chart: {
        type: 'donut'
      },
      series: subtypes.map(subtype => getSubtypeReportsCount(monthlyData, subtype)),
      labels: subtypes
    };

    // Create Location Chart
    createApexChart('locationChart', locationChartData, function (locationIndex) {
    });

    // Create Area Chart
    createApexChart('areaChart', areaChartData, function (areaIndex) {
    });

    // Create Type Chart
    createApexChart('typeChart', typeChartData, function (typeIndex) {
    });

    // Create Subtype Chart
    createApexChart('subtypeChart', subtypeChartData, function (subtypeIndex) {
    });
  });
}

// Fungsi bantu untuk mengonversi bulan menjadi label
function monthToLabel(month) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[month];
}

// Fungsi bantu untuk mendapatkan jumlah pelaporan per bulan
function getReportsCountByMonth(data, month) {
  return data.filter(report => new Date(report.date).getMonth() === month).length;
}

// Fungsi bantu untuk mendapatkan jumlah pelaporan per lokasi
function getLocationReportsCount(data, location) {
  return data.filter(report => report.location.locationName === location).length;
}

// Fungsi bantu untuk mendapatkan jumlah pelaporan per area
function getAreaReportsCount(data, area) {
  return data.filter(report => report.area.areaName === area).length;
}

// Fungsi bantu untuk mendapatkan jumlah pelaporan per jenis
function getTypeReportsCount(data, type) {
  return data.filter(report => report.typeDangerousActions.some(t => t.typeName === type)).length;
}

// Fungsi bantu untuk mendapatkan jumlah pelaporan per subjenis
function getSubtypeReportsCount(data, subtype) {
  return data.filter(report => report.typeDangerousActions.some(t => t.subTypes.includes(subtype))).length;
}

// Fungsi bantu untuk Membuat Grafik dengan ApexCharts
function createApexChart(chartId, chartOptions, clickCallback) {
  const options = {
    chart: {
      type: chartOptions.chart.type,
    },
    series: chartOptions.series,
    xaxis: chartOptions.xaxis,
  };

  const chart = new ApexCharts(document.getElementById(chartId), options);
  chart.render();

  // Tambahkan event listener untuk meng-handle klik pada grafik (jika diperlukan)
  document.getElementById(chartId).addEventListener("click", function (event) {
    const clickedIndex = chart.w.globals.selectedDataPoints[0].dataPointIndex;
    if (clickCallback) {
      clickCallback(clickedIndex);
    }
  });
}

// Ambil Data dari Server dan Jalankan Proses Pembuatan Grafik
fetchDataFromServer()
  .then((data) => {
    // Proses data dan panggil fungsi untuk membuat grafik
    processDataAndCreateCharts(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

