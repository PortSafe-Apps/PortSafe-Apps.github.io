(Chart.defaults.global.defaultFontFamily = "Poppins"),
  "-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
Chart.defaults.global.defaultFontColor = "#858796";

function number_format(number) {
  var n = !isFinite(+number) ? 0 : +number,
    dec = ".",
    sep = " ",
    s = "",
    toFixedFix = function (n) {
      return "" + Math.round(n);
    };

  s = toFixedFix(n).split(".");

  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }

  return s.join(dec);
}

// Function to fetch data from the specified URL
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function updateChartDatasets(chart, url, label, backgroundColor, borderColor) {
    try {
      const data = await fetchData(url);
  
      // Periksa apakah data merupakan array
      if (!Array.isArray(data)) {
        console.error("Data bukanlah sebuah array:", data);
        return;
      }
  
      // Mengasumsikan data yang diambil memiliki struktur yang sama dengan dataset asli
      const newDataset = {
        label: label,
        yAxisID: "y-axis-1",
        lineTension: 0.3,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        pointRadius: 3,
        pointBackgroundColor: borderColor,
        pointBorderColor: borderColor,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: borderColor,
        pointHoverBorderColor: borderColor,
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: data.map(item => item.value) // Sesuaikan baris ini berdasarkan struktur data sebenarnya
      };
  
      // Gantikan dataset yang ada di dalam chart
      const datasets = chart.data.datasets;
      const datasetIndex = datasets.findIndex(dataset => dataset.label === label);
  
      if (datasetIndex !== -1) {
        datasets[datasetIndex] = newDataset;
      } else {
        datasets.push(newDataset);
      }
  
      // Perbarui chart
      chart.update();
    } catch (error) {
      console.error("Error saat mengambil atau memperbarui data:", error);
    }
  }
  

// Multi-axis Line Chart Example (Single Sided)
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
      "Dec"
    ],
    datasets: []
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [
        {
          time: {
            unit: "date"
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }
      ],
      yAxes: [
        {
          id: "y-axis-1",
          position: "left",
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            callback: function(value, index, values) {
              return number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }
      ]
    },
    legend: {
      display: true,
      position: "top"
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
        label: function(tooltipItem, chart) {
          var datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return datasetLabel + ": " + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});

// Usage: Update the datasets with new data from the specified URLs
updateChartDatasets(
  multiAxisLineChart,
  'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised',
  "Compromised", 
  "rgba(0, 97, 242, 0.05)",
  "rgba(0, 97, 242, 1)"
);

updateChartDatasets(
  multiAxisLineChart,
  'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport',
  "Unsafe",  
  "rgba(255, 99, 132, 0.05)",
  "rgba(255, 99, 132, 1)"
);
