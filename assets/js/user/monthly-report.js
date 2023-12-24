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

    // Menggambar Type Chart
    const transformedTypeData = transformDataForChart(
      reportData,
      "typeChartCategory"
    );
    const typeChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Jenis Pelanggaran",
      transformedTypeData,
      "typeChartCategory"
    );
    renderChart("#typeChart", typeChartConfig);

    // Menggambar Subtype Chart
    const transformedSubtypeData = transformDataForChart(
      reportData,
      "subtypeChartCategory"
    );
    const subtypeChartConfig = createChartConfig(
      "Jumlah Laporan Berdasarkan Sub Jenis Pelanggaran",
      transformedSubtypeData,
      "subtypeChartCategory"
    );
    renderChart("#subtypeChart", subtypeChartConfig);
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
      
        reportData.forEach((report) => {
          const locationName = report.location.locationName || "Unknown Location";
          locationCounts[locationName] = (locationCounts[locationName] || 0) + 1;
        });
      
        // Konversi nilai-nilai di dalam series menjadi bilangan bulat
        const seriesData = Object.values(locationCounts).map((value) => parseInt(value));
      
        return {
          labels: locationLabels,
          series: seriesData,
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
      reportData.forEach((report) => {
        const areaName = report.area.areaName || "Unknown Area";
        areaCounts[areaName] = (areaCounts[areaName] || 0) + 1;
      });
      return {
        labels: areaLabels,
        series: Object.values(areaCounts),
      };

    case "typeChartCategory":
      const typeCounts = {};
      const typeLabels = [
        "REAKSI ORANG",
        "ALAT PELINDUNG DIRI",
        "POSISI ORANG",
        "ALAT DAN PERLENGKAPAN",
        "PROSEDUR DAN CARA KERJA",
      ];

      reportData.forEach((report) => {
        const typeName =
          report.typeDangerousActions.length > 0
            ? report.typeDangerousActions[0].typeName
            : "Unknown Type";
        typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
      });

      return {
        labels: typeLabels,
        series: Object.values(typeCounts),
      };

    case "subtypeChartCategory":
      const subtypeCounts = {};
      const subtypeLabels = [
        "Merubah Fungsi Alat Pelindung Diri",
        "Merubah Posisi",
        "Merubah Cara Kerja",
        "Menghentikan Pekerjaan",
        "Jatuh ke Lantai",
        "Terkunci",
        "Kepala",
        "Mata dan Wajah",
        "Telinga",
        "Sistem Pernafasan",
        "Tangan dan Lengan",
        "Dagu",
        "Badan",
        "Kaki dan Betis",
        "Terbentur Pada",
        "Tertabrak oleh",
        "Terjepit didalam, pada atau diantara",
        "Terjatuh",
        "Terkena Temperatur Tinggi",
        "Tersengat Arus Listrik",
        "Terhirup",
        "Terisap, Terserap",
        "Tertelan Benda Berbahaya",
        "Memaksakan Pekerjaan yang Terlalu Berat",
        "Tidak Sesuai Dengan Jenis Pekerjaan",
        "Digunakan Secara Tidak Benar",
        "Dalam Kondisi yang Tidak Aman",
        "Tidak Memenuhi",
        "Tidak diketahui/dimengerti",
        "Tidak diikuti",
      ];

      reportData.forEach((report) => {
        const subTypes =
          report.typeDangerousActions.length > 0
            ? report.typeDangerousActions[0].subTypes
            : [];
        const subTypeName =
          subTypes.length > 0 ? subTypes[0] : "Unknown Subtype";
        subtypeCounts[subTypeName] = (subtypeCounts[subTypeName] || 0) + 1;
      });

      return {
        labels: subtypeLabels,
        series: Object.values(subtypeCounts),
      };

    default:
      return {};
  }
};

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
          chart: {
            height: 380,
            type: "bar",
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
    case "areaChart":
      return {
        chart: {
          height: 240,
          type: "bar",
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
    case "typeChartCategory":
      return {
        chart: {
          height: 240,
          type: "pie",
          toolbar: {
            show: false,
          },
        },
        colors: ["#02172C"],
        dataLabels: {
          enabled: false,
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
        series: seriesData,
        labels: xCategories,
      };

    case "subtypeChartCategory":
      return {
        chart: {
          height: 240,
          type: "donut",
          toolbar: {
            show: false,
          },
        },
        colors: ["#02172C"],
        dataLabels: {
          enabled: false,
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
        series: seriesData,
        labels: xCategories,
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
