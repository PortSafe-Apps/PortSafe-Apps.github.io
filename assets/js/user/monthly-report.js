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
      // ... (isikan sesuai kebutuhan)
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

// Lengkapi fungsi processDataAndCreateCharts
const processDataAndCreateCharts = async (data) => {
  try {
    if (!Array.isArray(data)) {
      console.error("Invalid data format");
      return;
    }

    allChartData.monthly.chartData.series[0].data = Array.from(new Array(12), (_, i) =>
      getReportsCountByMonth(data, i)
    );

    allChartData.location.chartData.series[0].data = Array.from(
      new Set(data.map((report) => report.location.locationName))
    ).map((location) => getLocationReportsCount(data, location));

    allChartData.location.chartData.xaxis.categories = Array.from(
      new Set(data.map((report) => report.location.locationName))
    );

    createApexChart(
      "monthlyChart",
      allChartData.monthly.chartData,
      allChartData.monthly.updateCallback
    );

  } catch (error) {
    console.error("Error processing data and creating charts:", error);
  }
};

// Lengkapi fungsi getReportsCountByMonth
function getReportsCountByMonth(data, month) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data for getReportsCountByMonth");
      return 0;
    }

    return data.filter((report) => {
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

// Lengkapi fungsi getLocationReportsCount
function getLocationReportsCount(data, location) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data for getLocationReportsCount");
      return 0;
    }

    return data.filter((report) => {
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

// Fungsi untuk memperbarui grafik lokasi
function updateLocationChart(data) {
  try {
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
    console.error("Error updating location chart:", error);
  }
}

// Tambahkan fungsi updateAreaChart
function updateAreaChart(data) {
  try {
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
        allChartData.location.updateCallback
      );
    }
  } catch (error) {
    console.error("Error updating area chart:", error);
  }
}

// Tambahkan fungsi updateTypeChart
function updateTypeChart() {
  try {
    const typeChartData = {
      chartData: getTypeChartOptions(),
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

// Tambahkan fungsi updateSubtypeChart
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
    console.error("Error updating subtype chart:", error);
  }
}

// Lengkapi fungsi getAreaReportsCount
function getAreaReportsCount(data, area) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid or empty data for getAreaReportsCount");
      return 0;
    }

    return data.filter((report) => {
      if (report.area && report.area.areaName) {
        return report.area.areaName === area;
      }
      return false;
    }).length;
  } catch (error) {
    console.error("Error in getAreaReportsCount:", error);
    return 0;
  }
};


// Panggil fungsi-fungsi yang diperlukan
fetchDataFromServer()
  .then((data) => {
    processDataAndCreateCharts(data);
    createApexChart(
      "monthlyChart",
      allChartData.monthly.chartData,
      allChartData.monthly.updateCallback
    );
    updateLocationChart();
    updateAreaChart(data);
    updateTypeChart();
    updateSubtypeChart();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });