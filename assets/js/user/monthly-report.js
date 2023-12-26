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
async function fetchDataFromServer() {
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

    const targetURL = `https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser`;

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
}

// Fungsi untuk menggambar grafik
const drawChart = async () => {
  const reportData = await fetchDataFromServer();

  // Log reportData untuk memeriksa strukturnya
  console.log(reportData);

  if (reportData) {
    // Menggambar Monthly Chart
    const transformedMonthlyData = transformDataForChart(
      reportData,
      "monthChart"
    );
    const monthlyChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Bulan",
      transformedMonthlyData,
      "monthChart"
    );
    renderChart("#monthlyChart", monthlyChartConfig);

    // Menggambar Location Chart
    const transformedLocationData = transformDataForChart(
      reportData,
      "locationChart"
    );
    const locationChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Lokasi",
      transformedLocationData,
      "locationChart"
    );
    renderChart("#locationChart", locationChartConfig);

    // Menggambar Area Chart
    const transformedAreaData = transformDataForChart(reportData, "areaChart");
    const areaChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Area",
      transformedAreaData,
      "areaChart"
    );
    renderChart("#areaChart", areaChartConfig);

    // Menggambar Combined Chart
    const transformedCombinedData = transformDataForChart(
      reportData,
      "combinedChart"
    );
    const combinedChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan jenis dan subjenis pelanggaran",
      transformedCombinedData,
      "combinedChart"
    );
    renderChart("#combinedChart", combinedChartConfig);
  }
};

// Fungsi untuk mengubah data laporan menjadi format yang sesuai dengan grafik
const transformDataForChart = (reportData, chartType) => {
  if (!reportData || reportData.length === 0) {
    return { labels: [], series: [] };
  }

  switch (chartType) {
    case "monthChart":
      const monthCounts = Array(12).fill(0);

      reportData.forEach((report) => {
        const month = new Date(report.date).getMonth();
        monthCounts[month] += 1;
      });

      return {
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
        series: monthCounts,
      };
    case "locationChart":
      const locationCounts = {};
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

      // Inisialisasi counts dengan 0
      locationLabels.forEach((label) => {
        locationCounts[label] = 0;
      });

      // Hitung jumlah laporan untuk setiap lokasi
      reportData.forEach((report) => {
        const locationName = report.location.locationName || "Unknown Location";
        locationCounts[locationName]++;
      });

      // Mendapatkan labels dan series sesuai urutan dari yang paling banyak
      const sortedLabels = locationLabels.sort(
        (a, b) => locationCounts[b] - locationCounts[a]
      );
      const sortedSeries = sortedLabels.map((label) => locationCounts[label]);

      return {
        labels: sortedLabels,
        series: [sortedSeries], // Tetap dalam bentuk array
      };

    case "areaChart":
      const areaCounts = {};
      const areaLabels = [
        "Kantor",
        "Workshop",
        "Gudang",
        "Dermaga",
        "Lapangan Penumpukan",
        "Area kerja lainnya",
      ];

      // Inisialisasi counts dengan 0
      areaLabels.forEach((label) => {
        areaCounts[label] = 0;
      });

      // Hitung jumlah laporan untuk setiap area
      reportData.forEach((report) => {
        const areaName = report.area.areaName || "Unknown Area";
        areaCounts[areaName]++;
      });

      // Mendapatkan labels dan series sesuai urutan dari yang paling banyak
      const sortedLabelsArea = areaLabels.sort(
        (a, b) => areaCounts[b] - areaCounts[a]
      );
      const sortedSeriesArea = sortedLabelsArea.map(
        (label) => areaCounts[label]
      );

      return {
        labels: sortedLabelsArea,
        series: [sortedSeriesArea], // Tetap dalam bentuk array
      };

    case "combinedChart":
      const combinedCounts = {};

      reportData.forEach((report) => {
        report.typeDangerousActions.forEach((action) => {
          const typeName = action.typeName;
          action.subTypes.forEach((subType) => {
            const combinedLabel = `${typeName} - ${subType}`;
            combinedCounts[combinedLabel] =
              (combinedCounts[combinedLabel] || 0) + 1;
          });
        });
      });

      // Mengurutkan labels berdasarkan jumlah laporan
      const sortedLabelsCombined = Object.keys(combinedCounts).sort(
        (a, b) => combinedCounts[b] - combinedCounts[a]
      );

      // Menampilkan hasilnya dengan console.log
      console.log("Sorted Labels:", sortedLabelsCombined);

      return {
        labels: sortedLabelsCombined,
        series: [sortedLabelsCombined.map((label) => combinedCounts[label])], // Tetap dalam bentuk array
      };

    default:
      return {};
  }
};

const colorPalette = [
  "#4CAF50",
  "#FFC107",
  "#2196F3",
  "#FF5722",
  "#9C27B0",
  "#00BCD4",
  "#795548",
  "#8BC34A",
  "#607D8B",
  "#FFEB3B",
  "#673AB7",
  "#FF9800",
  "#03A9F4",
  "#E91E63",
  "#CDDC39",
  "#9E9E9E",
  "#F44336",
  "#795548",
  "#009688",
  "#FF5722",
];

// Fungsi untuk membuat konfigurasi grafik
const createChartConfig = (chartTitle, data, chartType) => {
  // Pengecekan keberadaan data.labels dan data.series
  const xCategories = data.labels ? data.labels : [];
  const seriesData = data.series ? data.series : [];

  // Pengecekan keberadaan chartTitle
  const subtitleText = chartTitle || "";

  switch (chartType) {
    case "monthChart":
      return {
        chart: {
          height: 240,
          type: "area",
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
            top: 5,
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
            opacityTo: 0.05,
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
          position: "top",
          horizontalAlign: "right",
          offsetY: -60,
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
          theme: "dark",
          marker: {
            show: true,
          },
          x: {
            show: false,
          },
        },
        subtitle: {
          text: subtitleText,
          align: "left",
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "text-dark",
            fontWeight: "bold",
            marginBottom: "10rem",
            fontFamily: "Poppins",
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          width: 3,
        },
        xaxis: {
          categories: xCategories,
          crosshairs: {
            show: true,
          },
          labels: {
            offsetX: 0,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            offsetX: -10,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
        },
        series: [
          {
            name: "jumlah laporan",
            data: seriesData,
          },
        ],
      };

    case "locationChart":
      return {
        series: [
          {
            name: "jumlah laporan",
            data: seriesData[0], // Menggunakan data.series langsung
          },
        ],
        chart: {
          type: "bar",
          height: 480,
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1000,
          },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            columnWidth: "60%",
          },
        },
        colors: ["#02172C"],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: xCategories,
          labels: {
            offsetX: 0,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            offsetX: -10,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
        },
        grid: {
          borderColor: "#dbeaea",
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
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
        subtitle: {
          text: subtitleText,
          align: "left",
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "text-dark",
            fontWeight: "bold",
            marginBottom: "10rem",
            fontFamily: "Poppins",
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
          y: {
            formatter: function (value) {
              return parseInt(value);
            },
          },
        },
      };

    case "areaChart":
      return {
        series: [
          {
            name: "jumlah laporan",
            data: seriesData[0],
          },
        ],
        chart: {
          height: 240,
          type: "bar",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1000,
          },
          dropShadow: {
            enabled: true,
            opacity: 0.1,
            blur: 2,
            left: -1,
            top: 5,
          },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        subtitle: {
          text: subtitleText,
          align: "left",
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "text-dark",
            fontWeight: "bold",
            marginBottom: "10rem",
            fontFamily: "Poppins",
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "40%",
            borderRadius: 4,
          },
        },
        colors: ["#02172C"],
        dataLabels: {
          enabled: false,
        },
        grid: {
          borderColor: "#dbeaea",
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
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
        tooltip: {
          theme: "light",
          marker: {
            show: true,
          },
          x: {
            show: false,
          },
        },
        xaxis: {
          categories: xCategories,
          labels: {
            offsetX: 0,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            offsetX: -10,
            offsetY: 0,
            style: {
              colors: "#8480ae",
              fontSize: "12px",
              fontFamily: "Poppins",
            },
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
        },
      };

    case "combinedChart":
      return {
        series: [
          {
            name: "jumlah laporan",
            data: seriesData[0], // Menggunakan data.series langsung
          },
        ],
        chart: {
          type: "sunburst",
          height: 350,
        },
        tooltip: {
          enabled: true,
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              total: {
                show: true,
                label: "Total",
                formatter: function (w) {
                  // Menampilkan total jumlah laporan untuk setiap typeName
                  const typeName = xCategories[w.config.seriesIndex];
                  return combinedCounts[typeName] || 0;
                },
              },
            },
          },
        },
        labels: xCategories,
        colors: colorPalette,
      };

    default:
      return {};
  }
};

// Fungsi untuk merender grafik
const renderChart = (chartId, chartConfig) => {
  const chart = new ApexCharts(document.querySelector(chartId), chartConfig);
  chart.render();
};

// Panggil fungsi untuk menggambar grafik
drawChart();
