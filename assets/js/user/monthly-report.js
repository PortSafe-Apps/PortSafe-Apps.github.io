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

function monthToLabel(month) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[month];
}

function getReportsCountByMonth(data, month) {
  return data.filter((report) => new Date(report.date).getMonth() === month).length;
}

function getLocationReportsCount(data, location) {
  return data.filter((report) => report.location.locationName === location).length;
}

function getAreaReportsCount(data, area) {
  return data.filter((report) => report.area.areaName === area).length;
}

function getTypeReportsCount(data, type) {
  return data.filter((report) =>
    report.typeDangerousActions.some((t) => t.typeName === type)
  ).length;
}

function getSubtypeReportsCount(data, subtype) {
  return data.filter((report) =>
    report.typeDangerousActions.some((t) => t.subTypes.includes(subtype))
  ).length;
}

function createApexChart(chartId, chartOptions, clickCallback) {
  try {
    const options = {
      chart: {
        type: chartOptions.chart.type,
        height: chartOptions.chart.height,
        plotOptions: chartOptions.plotOptions,
      },
      colors: chartOptions.colors,
      legend: chartOptions.legend,
      tooltip: chartOptions.tooltip,
      dataLabels: chartOptions.dataLabels,
      xaxis: chartOptions.xaxis,
      yaxis: chartOptions.yaxis,
    };

    const chart = new ApexCharts(document.getElementById(chartId), options);
    chart.render();

    document.getElementById(chartId).addEventListener("click", function () {
      try {
        if (chart && chart.w && chart.w.globals && chart.w.globals.selectedDataPoints) {
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
  } catch (error) {
    console.error("Error creating ApexChart:", error);
  }
}

const processDataAndCreateCharts = (data) => {
  const allChartData = {
    monthly: {
      chartData: {
        chart: {
          type: "line",
        },
        series: [
          {
            name: "Total Reports per Month",
            data: Array.from(new Array(12), (_, i) => getReportsCountByMonth(data, i)),
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
            data: Array.from(new Set(data.map((report) => report.location.locationName)))
              .map((location) => getLocationReportsCount(data, location)),
          },
        ],
        xaxis: {
          categories: Array.from(new Set(data.map((report) => report.location.locationName))),
        },
      },
      updateCallback: updateLocationChart,
    },
    // Add other chart data as needed
  };

  createApexChart("monthlyChart", allChartData.monthly.chartData, allChartData.monthly.updateCallback);

  function updateLocationChart(locationIndex) {
    const selectedLocation = allChartData.location.chartData.xaxis.categories[locationIndex];
    const locationData = data.filter((report) => report.location.locationName === selectedLocation);

    updateAreaChart(locationData);
  }

  function updateAreaChart(data) {
    const areas = Array.from(new Set(data.map((report) => report.area.areaName)));

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

    createApexChart("areaChart", areaChartData, allChartData.area.updateCallback);
  }

  // Continue updating other charts as needed

};

fetchDataFromServer()
  .then((data) => {
    processDataAndCreateCharts(data);
  })
  .catch((error) => console.error("Error fetching data:", error));
