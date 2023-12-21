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

// Fungsi untuk mendapatkan token dari cookies
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

// Lengkapi fungsi createApexChart
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
      series: chartOptions.series || [],
      xaxis: chartOptions.xaxis || {},
      plotOptions: chartOptions.plotOptions || {},
      colors: chartOptions.colors || [],
      legend: chartOptions.legend || {},
      tooltip: chartOptions.tooltip || {},
      dataLabels: chartOptions.dataLabels || {},
    };

    const chart = new ApexCharts(document.getElementById(chartId), options);
    chart.render();

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
    console.error(`Error creating ApexChart for ${chartId}:`, error);
  }
};

// Fungsi untuk mengolah data dan membuat grafik
async function processDataAndCreateCharts() {
  try {
    const data = await fetchDataFromServer();

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data");
      return;
    }

    allChartData.monthly.chartData.series[0].data = Array.from(
      new Array(12),
      (_, i) => getReportsCountByMonth(data, i)
    );

    // Update location chart data
    const locations = Array.from(
      new Set(data.map((report) => report.location.locationName))
    );
    allChartData.location.chartData.series[0].data = locations.map((location) =>
      getLocationReportsCount(data, location)
    );
    allChartData.location.chartData.xaxis.categories = locations;

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

    function updateLocationChart(data) {
      try {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format for updateLocationChart");
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
              categories: locations,
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

    // Update the function like this:
    function updateAreaChart(data) {
      try {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format for updateAreaChart");
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
              categories: areas,
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

    // Update the functions like this:
    function updateTypeChart() {
      try {
        const typeChartData = {
          chartData: getTypeChartOptions(),
          updateCallback: null,
        };

        createApexChart(
          "typeChart", // Make sure this ID exists in your HTML
          typeChartData.chartData,
          typeChartData.updateCallback
        );
      } catch (error) {
        console.error("Error updating type chart:", error.message);
      }
    }

    function updateSubtypeChart() {
      try {
        const subtypeChartData = {
          chartData: getSubtypeChartOptions(),
          updateCallback: null,
        };

        createApexChart(
          "subtypeChart",
          subtypeChartData.chartData,
          subtypeChartData.updateCallback
        );
      } catch (error) {
        console.error("Error updating subtype chart:", error.message);
      }
    }

    // Render grafik
    createApexChart(
      "monthlyChart", // Make sure this ID exists in your HTML
      allChartData.monthly.chartData,
      allChartData.monthly.updateCallback
    );
    updateLocationChart(data);
    updateAreaChart(data);
    updateTypeChart();
    updateSubtypeChart();
  } catch (error) {
    console.error("Error processing data and creating charts:", error.message);
  }
}

// Objek chart data
const allChartData = {
  monthly: {
    chartData: {
      chart: {
        type: "line",
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
          data: [], // Placeholder data
        },
      ],
      xaxis: {
        categories: [], // Placeholder data
      },
    },
    updateCallback: updateLocationChart,
  },
  area: {
    chartData: {
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
          data: [], // Placeholder data
        },
      ],
      xaxis: {
        categories: [], // Placeholder data
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

// Pemanggilan fungsi utama
processDataAndCreateCharts();
