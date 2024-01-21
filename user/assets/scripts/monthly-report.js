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
const targetURLs = [
  {
    url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser",
    category: "Unsafe Action",
  },
  {
    url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser",
    category: "Compromised Action",
  },
];

async function fetchDataFromServer() {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      // Handle authentication error if no token is present
      Swal.fire({
        icon: "warning",
        title: "Authentication Error",
        text: "You are not logged in!",
      }).then(() => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return [];
    }

    const fetchDataPromises = targetURLs.map(async (target) => {
      const myHeaders = new Headers();
      myHeaders.append("Login", token);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(target.url, requestOptions);
      const data = await response.json();
      return {
        category: target.category,
        data: data.data || [],
      };
    });

    // Wait for all fetch requests to complete
    const fetchedData = await Promise.all(fetchDataPromises);

    // Merge data from both target URLs
    const allReportData = fetchedData.reduce((accumulator, current) => {
      return accumulator.concat(current.data);
    }, []);

    return allReportData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Fungsi untuk menggambar grafik
const drawChart = async () => {
  const reportData = await fetchDataFromServer();

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

    // Menggambar Type Chart
    const transformedTypeData = transformDataForChart(reportData, "typeChart");
    const typeChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Jenis Pelanggaran",
      transformedTypeData,
      "typeChart"
    );

    typeChartConfig.chart.events = {
      dataPointSelection: function (event, chartContext, config) {
        const selectedTypeName = config.w.config.labels[config.dataPointIndex];
        updateSubtypeChart(reportData, selectedTypeName);
      },
    };

    renderChart("#typeChart", typeChartConfig);

    // Menggambar Subtype Chart awal
    updateSubtypeChart(reportData, transformedTypeData.labels[0]);
  }
};

const updateSubtypeChart = (reportData, selectedTypeName) => {
  // Panggil fungsi dengan menyediakan selectedTypeName
  const transformedSubtypeData = transformDataForChart(
    reportData,
    "subtypeChart",
    selectedTypeName
  );

  const subtypeChartConfig = createChartConfig(
    "Jumlah Laporan Berdasarkan Subjenis Pelanggaran",
    transformedSubtypeData,
    "subtypeChart",
    selectedTypeName
  );

  renderChart("#subtypeChart", subtypeChartConfig);
};

// Fungsi untuk mengubah data laporan menjadi format yang sesuai dengan grafik
const transformDataForChart = (reportData, chartType, selectedTypeName) => {
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

    case "typeChart":
      const typeCounts = {};
      reportData.forEach((report) => {
        report.typeDangerousActions.forEach((action) => {
          const typeName = action.typeName;
          typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
        });
      });

      const sortedLabelsType = Object.keys(typeCounts).sort(
        (a, b) => typeCounts[b] - typeCounts[a]
      );

      const sortedSeriesType = sortedLabelsType.map(
        (label) => typeCounts[label]
      );

      return {
        labels: sortedLabelsType,
        series: [sortedSeriesType],
      };

    case "subtypeChart":
      const subtypeCounts = {};

      reportData.forEach((report) => {
        report.typeDangerousActions.forEach((action) => {
          if (action.typeName === selectedTypeName && action.subTypes) {
            action.subTypes.forEach((subType) => {
              const subtypeLabel = subType;
              subtypeCounts[subtypeLabel] =
                (subtypeCounts[subtypeLabel] || 0) + 1;
            });
          }
        });
      });

      // Modifikasi bagian ini untuk menangani kasus ketika tidak ada subjenis yang ditemukan
      const sortedLabelsSubtype = Object.keys(subtypeCounts).sort(
        (a, b) => subtypeCounts[b] - subtypeCounts[a]
      );

      const sortedSeriesSubtype = sortedLabelsSubtype.map(
        (label) => subtypeCounts[label]
      );

      // Jika tidak ada subjenis ditemukan, kembalikan data default
      if (sortedLabelsSubtype.length === 0) {
        return { labels: [], series: [[]] };
      }

      return {
        labels: sortedLabelsSubtype,
        series: [sortedSeriesSubtype],
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
const createChartConfig = (chartTitle, data, chartType, selectedTypeName) => {
  // Pengecekan keberadaan data.labels dan data.series
  const xCategories = data.labels ? data.labels : [];
  const seriesData = data.series ? data.series : [];

  // Pengecekan keberadaan chartTitle
  const titleText = chartTitle || "";

  // Tambahkan subtitle berdasarkan tipe atau sub-tipe yang terpilih
  const subtitleText = selectedTypeName
    ? `Jenis Pelanggaran: ${selectedTypeName}`
    : "";

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
        title: {
          text: titleText,
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
            data: seriesData[0],
          },
        ],
        chart: {
          type: "bar",
          height: 495,
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
            columnWidth: "60%",
            distributed: true,
            horizontal: true,
          },
        },
        colors: colorPalette,
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          offsetY: 0, // Sesuaikan offset sesuai kebutuhan
          style: {
            colors: ["#02172C"],
            fontSize: "12px",
            fontFamily: "Poppins",
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex];
          },
        },
        xaxis: {
          categories: xCategories,
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function (value) {
              // Menggunakan parseInt untuk menghapus desimal
              return parseInt(value);
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
        title: {
          text: titleText,
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
            show: false,
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
          height: 300,
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
        title: {
          text: titleText,
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
            borderRadius: 4,
            columnWidth: "60%",
            distributed: true,
            horizontal: true,
          },
        },
        colors: colorPalette,
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          offsetY: 0, // Sesuaikan offset sesuai kebutuhan
          style: {
            colors: "#8480ae",
            fontSize: "12px",
            fontFamily: "Poppins",
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex];
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
        xaxis: {
          categories: xCategories,
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
        },
      };
      case "typeChart":
        return {
          series: seriesData[0],
          chart: {
            type: "pie",
            height: 280,
            toolbar: {
              show: false,
            },
          },
          labels: xCategories,
          colors: colorPalette,
          title: {
            text: titleText,
            align: "left",
            margin: 0,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize: "12px",
              color: "text-dark",
              fontWeight: "bold",
              marginBottom: "10rem",
              fontFamily: "Poppins",
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 300,
                },
                legend: {
                  show: true,
                  position: "bottom",
                  horizontalAlign: "center",
                  fontSize: "12px",
                  markers: {
                    width: 9,
                    height: 9,
                    strokeWidth: 0,
                    radius: 20,
                  },
                },
              },
            },
          ],
          tooltip: {
            enabled: true,
            y: {
              formatter: function (val) {
                // Format nilai tooltip di sini jika perlu
                return val;
              },
            },
            style: {
              fontSize: "12px", // Sesuaikan ukuran font sesuai kebutuhan
              fontFamily: "Poppins", // Sesuaikan jenis font sesuai kebutuhan
            },
            marker: {
              show: true,
            },
            item: {
              fontSize: "12px",
            },
            fixed: {
              enabled: true,
              position: "topRight", // Sesuaikan posisi tooltip jika perlu
            },
          },
          
        };
      case "subtypeChart":
        return {
          series: seriesData[0],
          chart: {
            type: "donut",
            height: 300,
            toolbar: {
              show: false,
            },
          },
          labels: xCategories,
          colors: colorPalette,
          title: {
            text: titleText,
            align: "left",
            margin: 0,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize: "12px",
              color: "text-dark",
              fontWeight: "bold",
              marginBottom: "10rem",
              fontFamily: "Poppins",
            },
          },
          subtitle: {
            text: subtitleText || "",
            align: "left",
            margin: 5,
            offsetY: 30,
            style: {
              fontSize: '12px',
              color: "text-dark",
              fontWeight: "bold",
              fontFamily: "Poppins",
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 300,
                },
                legend: {
                  show: true,
                  position: "bottom",
                  horizontalAlign: "center",
                  fontSize: "12px",
                  markers: {
                    width: 9,
                    height: 9,
                    strokeWidth: 0,
                    radius: 20,
                  },
                },
              },
            },
          ],
          tooltip: {
            enabled: true,
            y: {
              formatter: function (val) {
                // Format nilai tooltip di sini jika perlu
                return val;
              },
            },
            style: {
              fontSize: "12px", // Sesuaikan ukuran font sesuai kebutuhan
              fontFamily: "Poppins", // Sesuaikan jenis font sesuai kebutuhan
            },
            marker: {
              show: true,
            },
            item: {
              fontSize: "12px",
            },
            fixed: {
              enabled: true,
              position: "topRight", // Sesuaikan posisi tooltip jika perlu
            },
          },
          
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
