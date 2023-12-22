// Objek chart data
const allChartData = {
  monthly: {
    chartData: {
      chart: {
        height: 240,
        type: "area",
      },
      series: [
        {
          name: "Total Reports per Month",
          data: Array.from(new Array(12), () => 0),
        },
      ],
      xaxis: {
        categories: Array.from(new Array(12), (_, i) => monthToLabel(i)),
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000,
      },
      dropShadow: {
        enabled: true,
        opacity: 0.1,
        blur: 1,
        left: -5,
        top: 18,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#02172C"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        inverseColors: true,
        opacityFrom: 0.15,
        opacityTo: 0.02,
        stops: [40, 100],
      },
    },
    grid: {
      borderColor: "#dbeaea",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 4,
      fontSize: "14px",
      markers: {
        width: 9,
        height: 9,
        strokeWidth: 0,
        radius: 20,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0,
      },
    },
  },
  subtitle: {
    text: "Tren Jumlah Pelanggaran Setiap Bulan",
    align: "left",
    margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "15px",
      color: "text-dark",
      fontWeight: "bold",
      marginBottom: "1rem",
      fontFamily: "Poppins",
    },
  },
  tooltip: {
    backgroundColor: "rgb(255,255,255)",
    bodyFontColor: "#858796",
    titleMarginBottom: 10,
    titleFontColor: "#6e707e",
    titleFontSize: 14,
    borderColor: "#dddfeb",
    borderWidth: 1,
    xPadding: 20,
    yPadding: 15,
    displayColors: false,
    intersect: false,
    mode: "index",
    caretPadding: 10,
    custom: function ({ series, dataPointIndex }) {
      const month =
        allChartData.monthly.chartData.xaxis.categories[dataPointIndex] || "";
      const value = series[0]?.[dataPointIndex] || 0;
      return (
        '<div style="width: 135px; height: 45px;">' +
        "<span>" +
        month +
        "</span>" +
        "<br>" +
        "<span>" +
        "Jumlah Laporan : " +
        value +
        "</span>" +
        "</div>"
      );
    },
  },
  stroke: {
    show: true,
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    labels: {
      offsetX: 0,
      offsetY: 0,
      style: {
        colors: "#8480ae",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
  },
  yaxis: {
    labels: {
      offsetX: -10,
      offsetY: 0,
      style: {
        colors: "#8480ae",
        fontSize: "10px",
        fontFamily: "Poppins",
      },
    },
    updateCallback: null,
  },

  location: {
    chartData: {
      chart: {
        height: 240,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      series: [
        {
          name: "Total Reports by Location",
          data: Array.from({ length: locationLabels.length }).fill(0),
          // Ganti dengan locationLabels jika locations belum diisi sebelumnya
        },
      ],
      xaxis: {
        categories: locationLabels,
      },
    },
    updateCallback: updateLocationChart,
  },
  area: {
    chartData: {
      chart: {
        height: 240,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      series: [
        {
          name: "Total Reports by Area",
          data: [], // Placeholder data
        },
      ],
      xaxis: {
        categories: areaLabels,
      },
    },
    updateCallback: updateAreaChart,
  },
  type: {
    chartData: {
      chart: {
        height: 240,
        type: "pie",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 1000,
        },
        toolbar: {
          show: false,
        },
      },
      colors: [
        "rgba(255, 99, 132, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 205, 86, 1)",
      ],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 4,
        fontSize: "14px",
        markers: {
          width: 9,
          height: 9,
          strokeWidth: 0,
          radius: 20,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        style: {
          color: "#343a40",
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    updateCallback: updateTypeChart,
  },
  subtype: {
    chartData: {
      chart: {
        height: 240,
        type: "doughnut",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 1000,
        },
        toolbar: {
          show: false,
        },
      },
      colors: [
        "rgba(255, 99, 132, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 205, 86, 1)",
      ],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 4,
        fontSize: "14px",
        markers: {
          width: 9,
          height: 9,
          strokeWidth: 0,
          radius: 20,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        style: {
          color: "#343a40",
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    updateCallback: updateSubtypeChart,
  },
};

// Data untuk location
const locationData = [
  { locationName: "Kantor Pusat SPMT" },
  { locationName: "Branch Dumai" },
  { locationName: "Branch Belawan" },
  { locationName: "Branch Tanjung Intan" },
  { locationName: "Branch Bumiharjo - Bagendang" },
  { locationName: "Branch Tanjung Wangi" },
  { locationName: "Branch Makassar" },
  { locationName: "Branch Balikpapan" },
  { locationName: "Branch Trisakti - Mekar Putih" },
  { locationName: "Branch Jamrud Nilam Mirah" },
  { locationName: "Branch Lembar - Badas" },
  { locationName: "Branch Tanjung Emas" },
  { locationName: "Branch ParePare - Garongkong" },
  { locationName: "Branch Lhokseumawe" },
  { locationName: "Branch Malahayati" },
  { locationName: "Branch Gresik" },
];

// Data untuk area
const areaData = [
  { areaName: "Kantor" },
  { areaName: "Workshop" },
  { areaName: "Gudang" },
  { areaName: "Dermaga" },
  { areaName: "Lapangan Penumpukan" },
  { areaName: "Area kerja lainnya" },
];

// Mengonversi data location menjadi label
const locationLabels = locationData.map((location) => location.locationName);

// Mengonversi data area menjadi label
const areaLabels = areaData.map((area) => area.areaName);

// Fungsi untuk mengonversi angka bulan menjadi label bulan
function monthToLabel(month) {
   const monthNames = [
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
   ];
   return month >= 0 && month < monthNames.length ? monthNames[month] : null;
}

// Fungsi untuk mendapatkan token dari cookies
function getTokenFromCookies() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
     const [name, value] = cookie.trim().split("=");
     if (name === "Login") {
        return value;
     }
  }
  return null;
}

const fetchDataFromServer = async () => {
  try {
    const token = getTokenFromCookies("Login");

    // Periksa keberadaan token
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Error",
        text: "Kamu Belum Login!",
      }).then(() => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return [];
    }

    const targetURL =
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser";

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
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.",
    });
    return [];
 } 
};

// Monthly Report Chart
allChartData.monthly.chartData = {
  chart: {
    height: 240,
    type: "area",
  },
  series: [
    {
      name: "Total Reports per Month",
      data: Array.from(new Array(12), () => 0),
    },
  ],
  xaxis: {
    categories: Array.from(new Array(12), (_, i) => monthToLabel(i)),
  },
  animations: {
    enabled: true,
    easing: "easeinout",
    speed: 1000,
  },
  dropShadow: {
    enabled: true,
    opacity: 0.1,
    blur: 1,
    left: -5,
    top: 18,
  },
  zoom: {
    enabled: false,
  },
  toolbar: {
    show: false,
  },
  colors: ["#02172C"],
  dataLabels: {
    enabled: false,
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      inverseColors: true,
      opacityFrom: 0.15,
      opacityTo: 0.02,
      stops: [40, 100],
    },
  },
  grid: {
    borderColor: "#dbeaea",
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetY: 4,
    fontSize: "14px",
    markers: {
      width: 9,
      height: 9,
      strokeWidth: 0,
      radius: 20,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 0,
    },
  },
};

// Location Chart
allChartData.location.chartData = {
  chart: {
    height: 240,
    type: "bar",
  },
  series: [
    {
      name: "Total Reports per Location",
      data: [],
    },
  ],
  xaxis: {
    categories: [],
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
};

// Area Chart
allChartData.area.chartData = {
  chart: {
    height: 240,
    type: "line",
  },
  series: [
    {
      name: "Total Reports per Area",
      data: [],
    },
  ],
  xaxis: {
    categories: [],
  },
  plotOptions: {
    line: {
      curve: "smooth",
    },
  },
};

// Type Chart
allChartData.type.chartData = {
  chart: {
    height: 240,
    type: "donut",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 1000,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [
    "rgba(255, 99, 132, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 205, 86, 1)",
  ],
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetY: 4,
    fontSize: "14px",
    markers: {
      width: 9,
      height: 9,
      strokeWidth: 0,
      radius: 20,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 0,
    },
  },
  tooltip: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
    style: {
      color: "#343a40",
    },
  },
  dataLabels: {
    enabled: false,
  },
};

// Subtype Chart
allChartData.subtype.chartData = {
  chart: {
    height: 240,
    type: "pie",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 1000,
    },
    toolbar: {
      show: false,
    },
  },
  colors: [
    "rgba(255, 99, 132, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 205, 86, 1)",
  ],
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    offsetY: 4,
    fontSize: "14px",
    markers: {
      width: 9,
      height: 9,
      strokeWidth: 0,
      radius: 20,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 0,
    },
  },
  tooltip: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
    style: {
      color: "#343a40",
    },
  },
  dataLabels: {
    enabled: false,
  },
};

let chart;

const createApexChart = (chartId, chartType, clickCallback) => {
  console.log("Creating chart:", chartId);

  try {
    const chartData = allChartData[chartType]?.chartData || {};

    if (!chartData.type) {
      // Set default chart type if none is provided
      chartData.type = "line";
    }

    if (chart) {
      chart.destroy();
    }

    chart = new ApexCharts(document.getElementById(chartId), chartData);
    chart.render();

    if (clickCallback && chartData.xaxis && chartData.xaxis.categories) {
      document.getElementById(chartId).addEventListener("click", function () {
        try {
          const selectedDataPoints = chart?.w?.globals?.selectedDataPoints;

          if (selectedDataPoints && selectedDataPoints.length > 0) {
            const clickedIndex = selectedDataPoints[0].dataPointIndex;

            if (clickCallback) {
              clickCallback(clickedIndex);
            }
          }
        } catch (error) {
          console.error("Error handling click event:", error);
        }
      });
    }
  } catch (error) {
    console.error(`Error creating ApexChart for ${chartId}:`, error);
  }
};

// Fungsi untuk mendapatkan jumlah laporan per bulan
function getReportsCountByMonth(data, month) {
  // Menggunakan reduce untuk menghitung jumlah laporan pada bulan tertentu
  const count = data.reduce((total, report) => {
    const reportDate = new Date(report.date); // Ganti "date" dengan properti tanggal pada objek laporan
    if (reportDate.getMonth() === month) {
      return total + 1;
    }
    return total;
  }, 0);

  return count;
}

// Fungsi untuk mendapatkan jumlah laporan berdasarkan lokasi
function getLocationReportsCount(data, location) {
  // Menggunakan reduce untuk menghitung jumlah laporan pada lokasi tertentu
  const count = data.reduce((total, report) => {
    if (report.location.locationName === location) {
      return total + 1;
    }
    return total;
  }, 0);

  return count;
}

// Fungsi untuk mendapatkan jumlah laporan berdasarkan area
function getAreaReportsCount(data, area) {
  // Menggunakan reduce untuk menghitung jumlah laporan pada area tertentu
  const count = data.reduce((total, report) => {
    if (report.area.areaName === area) {
      return total + 1;
    }
    return total;
  }, 0);

  return count;
}

// Fungsi untuk mendapatkan opsi chart jenis
function getTypeChartOptions(data) {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format for getTypeChartOptions");
    }

    const types = Array.from(
      new Set(
        data.flatMap((report) =>
          report.typeDangerousActions.map((type) => type.typeName)
        )
      )
    );

    const colors = generateColors(types.length);

    return {
      chart: {
        height: 240,
        type: "pie",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 1000,
        },
        toolbar: {
          show: false,
        },
      },
      colors: colors,
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 4,
        fontSize: "14px",
        markers: {
          width: 9,
          height: 9,
          strokeWidth: 0,
          radius: 20,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        style: {
          color: "#343a40",
        },
      },
      dataLabels: {
        enabled: false,
      },
    };
  } catch (error) {
    console.error("Error getting type chart options:", error.message);
    return null;
  }
}

// Fungsi untuk mendapatkan opsi chart subtipe
function getSubtypeChartOptions(data) {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format for getSubtypeChartOptions");
    }

    const subtypes = Array.from(
      new Set(
        data.flatMap((report) =>
          report.typeDangerousActions.flatMap((type) => type.subTypes)
        )
      )
    );

    const colors = generateColors(subtypes.length);

    return {
      chart: {
        height: 240,
        type: "doughnut",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 1000,
        },
        toolbar: {
          show: false,
        },
      },
      colors: colors,
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 4,
        fontSize: "14px",
        markers: {
          width: 9,
          height: 9,
          strokeWidth: 0,
          radius: 20,
        },
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        style: {
          color: "#343a40",
        },
      },
      dataLabels: {
        enabled: false,
      },
    };
  } catch (error) {
    console.error("Error getting subtype chart options:", error.message);
    return null;
  }
}

// Fungsi untuk menghasilkan warna secara dinamis berdasarkan jumlah
function generateColors(count) {
  return Array.from({ length: count }, (_, index) => {
    const hue = (index * (360 / count)) % 360;
    return `hsla(${hue}, 70%, 50%, 1)`;
  });
}

const updateLocationChart = () => {
  try {
    console.log("Updating location chart...");
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data");
      return;
  }

    const locations = Array.from(
      new Set(data.map((report) => report.location.locationName))
    );

    if (locations && locations.length > 0) {
      const locationChartData = {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        series: [
          {
            name: "Total Reports by Location",
            data: locations.map((location) =>
              getLocationReportsCount(data, location)
            ),
          },
        ],
        xaxis: {
          categories: locationLabels,
        },
        subtitle: {
          text: "Jumlah Laporan Berdasarkan Unit Kerja",
          align: "left",
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "text-dark",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "Poppins",
          },
        },
      };

      createApexChart(
        "locationChart",
        locationChartData,
        allChartData.location.updateCallback
      );
    }
  } catch (error) {
    console.error("Error updating location chart:", error.message);
  }
}

const updateAreaChart = () => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data");
      return;
  }

    const areas = Array.from(
      new Set(data.map((report) => report.area.areaName))
    );

    if (areas && areas.length > 0) {
      const areaChartData = {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        series: [
          {
            name: "Total Reports by Area",
            data: areas.map((area) => getAreaReportsCount(data, area)),
          },
        ],
        xaxis: {
          categories: areaLabels,
        },
        subtitle: {
          text: "Jumlah Laporan Berdasarkan Area",
          align: "left",
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "text-dark",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "Poppins",
          },
        },
      };

      createApexChart(
        "areaChart",
        areaChartData,
        allChartData.area.updateCallback
      );
    }
  } catch (error) {
    console.error("Error updating area chart:", error.message);
  }
}

const updateTypeChart = () => {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format for updateTypeChart");
    }

    const typeChartData = {
      chartData: getTypeChartOptions(data),
      updateCallback: null,
    };

    createApexChart(
      "typeChart",
      typeChartData,
      allChartData.type.updateCallback
    );
  } catch (error) {
    console.error("Error updating type chart:", error.message);
  }
}

const updateSubtypeChart = () => {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format for updateSubtypeChart");
    }

    const subtypeChartData = {
      chartData: getSubtypeChartOptions(data),
      updateCallback: null,
    };

    createApexChart(
      "subtypeChart",
      subtypeChartData.chartData,
      allChartData.subtype.updateCallback
    );
  } catch (error) {
    console.error("Error updating subtype chart:", error.message);
  }
}


const processDataAndCreateCharts = async () => {
  try {
    console.log("Data processed successfully.");
    const data = await fetchDataFromServer();

    console.log("Data received:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data");
      return;
    }

    allChartData.monthly.chartData.series[0].data = Array.from(
      new Array(12),
      (_, i) => getReportsCountByMonth(data, i)
    );

    allChartData.monthly.chartData.xaxis.categories = Array.from(
      new Array(12),
      (_, i) => monthToLabel(i)
    );

    const locations = Array.from(
      new Set(data.map((report) => report.location.locationName))
    );

    allChartData.location.chartData.series[0].data = locations.map((location) =>
      getLocationReportsCount(data, location)
    );
    allChartData.location.chartData.xaxis.categories = locations;

    createApexChart("monthlyChart", "monthly");
    updateLocationChart();
    updateAreaChart();
    updateTypeChart();
    updateSubtypeChart();
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

// Call the function initially when the page is loaded
processDataAndCreateCharts();






