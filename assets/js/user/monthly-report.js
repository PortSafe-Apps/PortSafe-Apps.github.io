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

const mainChartOptions = {
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
  tooltip: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    fontSize: "14px",
    style: {
      color: "#343a40",
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
  stroke: {
    show: true,
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: Array.from(new Array(12), (_, i) => monthToLabel(i)),
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
};

const locationChartOptions = {
  chart: {
    height: 240,
    type: "bar",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 1000,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["rgba(255, 99, 132, 1)"],
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
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    labels: {
      style: {
        colors: "#8480ae",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#8480ae",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
  },
};

const areaChartOptions = {
  chart: {
    height: 240,
    type: "bar",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 1000,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["rgba(54, 162, 235, 1)"],
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
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    labels: {
      style: {
        colors: "#8480ae",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#8480ae",
        fontSize: "12px",
        fontFamily: "Poppins",
      },
    },
  },
};

// Fungsi untuk mendapatkan opsi chart jenis
function getTypeChartOptions() {
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
}

// Fungsi untuk mendapatkan opsi chart subtipe
function getSubtypeChartOptions() {
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
}

// Fungsi untuk menangani permintaan data dari server
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
    return [];
  }
};

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
  return monthNames[month];
}

const createApexChart = (chartId, chartOptions, clickCallback) => {
  try {
    const options = {
      chart: {
        height: chartOptions.chart.height || 240,
        type: chartOptions.chart.type || "line",
        animations: chartOptions.chart.animations || {
          enabled: true,
          easing: "easeinout",
          speed: 1000,
        },
        dropShadow: chartOptions.chart.dropShadow || {
          enabled: true,
          opacity: 0.1,
          blur: 1,
          left: -5,
          top: 18,
        },
        zoom: chartOptions.chart.zoom || {
          enabled: false,
        },
        toolbar: chartOptions.chart.toolbar || {
          show: false,
        },
      },
      colors: chartOptions.colors || ["#02172C"],
      dataLabels: chartOptions.dataLabels || {
        enabled: false,
      },
      fill: chartOptions.fill || {
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
      grid: chartOptions.grid || {
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
      legend: chartOptions.legend || {
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
      tooltip: chartOptions.tooltip || {
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        fontSize: "14px",
        style: {
          color: "#343a40",
        },
      },
      subtitle: chartOptions.subtitle || {
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
      stroke: chartOptions.stroke || {
        show: true,
        curve: "smooth",
        width: 3,
      },
      xaxis: chartOptions.xaxis || {
        categories: Array.from(new Array(12), (_, i) => monthToLabel(i)),
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
      yaxis: chartOptions.yaxis || {
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
    };

    const chart = new ApexCharts(document.getElementById(chartId), options);
    chart.render();

    // Tambahkan pengecekan apakah ada data sebelum menambahkan event listener
    if (options.xaxis && options.xaxis.categories) {
      document.getElementById(chartId).addEventListener("click", function () {
        try {
          if (
            chart &&
            chart.w &&
            chart.w.globals &&
            chart.w.globals.selectedDataPoints
          ) {
            const selectedDataPoints = chart.w.globals.selectedDataPoints;

            if (selectedDataPoints && selectedDataPoints.length > 0) {
              const clickedIndex = selectedDataPoints[0].dataPointIndex;

              if (clickCallback) {
                clickCallback(clickedIndex);
              }
            }
          }
        } catch (error) {
          console.error("Error handling click event:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error creating ApexChart:", error);
  }
};

// Fungsi untuk memproses data dan membuat grafik
const processDataAndCreateCharts = (data) => {
  try {
    // Pastikan data yang diterima dari server sesuai dengan yang diharapkan
    if (!Array.isArray(data)) {
      console.error("Invalid data format");
      return;
    }

    const allChartData = {
      monthly: {
        chartData: {
          chart: {
            type: "line",
          },
          series: [
            {
              name: "Total Reports per Month",
              data: Array.from(new Array(12), (_, i) =>
                getReportsCountByMonth(data, i)
              ),
            },
          ],
          xaxis: {
            categories: Array.from(new Array(12), (_, i) => monthToLabel(i)),
          },
        },
        updateCallback: null,
      },
      location: {
        chartData: {
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
              data: Array.from(
                new Set(data.map((report) => report.location.locationName))
              ).map((location) => getLocationReportsCount(data, location)),
            },
          ],
          xaxis: {
            categories: Array.from(
              new Set(data.map((report) => report.location.locationName))
            ),
          },
        },
        updateCallback: updateLocationChart,
      },
      // Tambahkan data grafik lain jika diperlukan
    };

    console.log("Trying to create monthlyChart");
    createApexChart("monthlyChart", allChartData.monthly.chartData, allChartData.monthly.updateCallback);
    

    // Fungsi untuk mengupdate grafik lokasi
    function updateLocationChart(locationIndex) {
      try {
        const xaxisCategories =
          allChartData.location.chartData.xaxis.categories;

        // Periksa apakah indeks lokasi valid
        if (xaxisCategories && xaxisCategories.length > locationIndex) {
          const selectedLocation = xaxisCategories[locationIndex];
          const locationData = data.filter(
            (report) => report.location.locationName === selectedLocation
          );

          // Memperbarui grafik area
          updateAreaChart(locationData);
        }
      } catch (error) {
        console.error("Error updating location chart:", error);
      }
    }

    // Fungsi untuk mengupdate grafik area
    function updateAreaChart(data) {
      try {
        const areas = Array.from(
          new Set(data.map((report) => report.area.areaName))
        );

        // Periksa apakah ada area yang valid
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
              categories: areas,
            },
          };

          // Membuat atau memperbarui grafik area
          createApexChart(
            "areaChart",
            areaChartData,
            allChartData.location.updateCallback
          );
        }
      } catch (error) {
        console.error("Error updating area chart:", error);
      }
    }

    // Fungsi untuk menghitung jumlah laporan per bulan
    function getReportsCountByMonth(data, month) {
      try {
        // Pastikan data tidak kosong
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Invalid or empty data for getReportsCountByMonth");
          return 0;
        }

        return data.filter((report) => {
          // Pastikan 'date' ada dan sesuai dengan format yang diharapkan
          if (report.date && typeof report.date === "string") {
            const reportMonth = new Date(report.date).getMonth();
            return reportMonth === month;
          }
          return false;
        }).length;
      } catch (error) {
        console.error("Error in getReportsCountByMonth:", error);
        return 0;
      }
    }

    // Fungsi untuk menghitung jumlah laporan per lokasi
    function getLocationReportsCount(data, location) {
      try {
        // Pastikan data tidak kosong
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Invalid or empty data for getLocationReportsCount");
          return 0;
        }

        return data.filter((report) => {
          // Pastikan 'location' ada dan sesuai dengan format yang diharapkan
          if (report.location && report.location.locationName) {
            return report.location.locationName === location;
          }
          return false;
        }).length;
      } catch (error) {
        console.error("Error in getLocationReportsCount:", error);
        return 0;
      }
    }

    // Fungsi untuk menghitung jumlah laporan per area
    function getAreaReportsCount(data, area) {
      try {
        // Pastikan data tidak kosong
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Invalid or empty data for getAreaReportsCount");
          return 0;
        }

        return data.filter((report) => {
          // Pastikan 'area' ada dan sesuai dengan format yang diharapkan
          if (report.area && report.area.areaName) {
            return report.area.areaName === area;
          }
          return false;
        }).length;
      } catch (error) {
        console.error("Error in getAreaReportsCount:", error);
        return 0;
      }
    }

    // Fungsi untuk mengupdate grafik jenis
    function updateTypeChart(data) {
      try {
        const typeChartData = {
          chartData: getTypeChartOptions(data),
          updateCallback: null,
        };

        createApexChart(
          "typeChart",
          typeChartData.chartData,
          typeChartData.updateCallback
        );
      } catch (error) {
        console.error("Error updating type chart:", error);
      }
    }

    // Fungsi untuk mengupdate grafik subtipe
    function updateSubtypeChart(data) {
      try {
        const subtypeChartData = {
          chartData: getSubtypeChartOptions(data),
          updateCallback: null,
        };

        createApexChart(
          "subtypeChart",
          subtypeChartData.chartData,
          subtypeChartData.updateCallback
        );
      } catch (error) {
        console.error("Error updating subtype chart:", error);
      }
    }
 
    // Membaca data dari server dan memprosesnya
    fetchDataFromServer()
      .then((data) => {
        processDataAndCreateCharts(data);
        updateTypeChart(data); // Perbarui grafik jenis
        updateSubtypeChart(data); // Perbarui grafik subtipe
      })
      console.error("Error fetching data:", error.message);
  } catch (error) {
    console.error("Error in processDataAndCreateCharts:", error);
  }
};

