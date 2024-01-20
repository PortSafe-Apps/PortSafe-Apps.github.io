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
  
  // Set new default font family and font color
  Chart.defaults.global.defaultFontFamily =
    "Poppins, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
  Chart.defaults.global.defaultFontColor = "#858796";
  
  // Function for number formatting
  function number_format(number) {
    var n = !isFinite(+number) ? 0 : +number,
      dec = ".",
      sep = " ",
      s = "",
      toFixedFix = function (n) {
        return "" + Math.round(n);
      };
  
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = toFixedFix(n).split(".");
  
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
  
    return s.join(dec);
  }
  
  // Function to fetch data from the server (similar to your existing logic)
  async function fetchDataFromServer(url, category) {
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
  
      const myHeaders = new Headers();
      myHeaders.append("Login", token);
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
  
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return {
        category: category,
        data: data.data || [],
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  
// Function to update the area chart
async function updateAreaChart() {
    try {
      console.log("Fetching unsafe data...");
      const unsafeData = await fetchDataFromServer("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport", "Unsafe Action");
      console.log("Unsafe data:", unsafeData);
  
      console.log("Fetching compromised data...");
      const compromisedData = await fetchDataFromServer("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised", "Compromised Action");
      console.log("Compromised data:", compromisedData);
  
      // Additional logging
      console.log("Unsafe data length:", unsafeData.data.length);
      console.log("Compromised data length:", compromisedData.data.length);
  
      const labels = [
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
  
      const datasets = [
        {
          label: "Unsafe Action",
          lineTension: 0.3,
          backgroundColor: "rgba(255, 0, 0, 0.05)",
          borderColor: "rgba(255, 0, 0, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
          pointHoverBorderColor: "rgba(255, 0, 0, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: unsafeData.data,
        },
        {
          label: "Compromised Action",
          lineTension: 0.3,
          backgroundColor: "rgba(0, 97, 242, 0.05)",
          borderColor: "rgba(0, 97, 242, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(0, 97, 242, 1)",
          pointBorderColor: "rgba(0, 97, 242, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(0, 97, 242, 1)",
          pointHoverBorderColor: "rgba(0, 97, 242, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: compromisedData.data,
        },
      ];
  
      const updatedData = {
        labels: labels,
        datasets: datasets,
      };
  
      console.log("Updated data:", updatedData);
  
      const ctx = document.getElementById("myAreaChart").getContext("2d");
  
      // Additional logging
      console.log("Context:", ctx);
  
      const myAreaChart = new Chart(ctx, {
        type: "line",
        data: updatedData,
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0,
            },
          },
          scales: {
            xAxes: [
              {
                time: {
                  unit: "date",
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  maxTicksLimit: 7,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  maxTicksLimit: 5,
                  padding: 10,
                  // Include a dollar sign in the ticks
                  callback: function (value, index, values) {
                    return number_format(value);
                  },
                },
                gridLines: {
                  color: "rgb(234, 236, 244)",
                  zeroLineColor: "rgb(234, 236, 244)",
                  drawBorder: false,
                  borderDash: [2],
                  zeroLineBorderDash: [2],
                },
              },
            ],
          },
          legend: {
            display: true,
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
              label: function (tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                return datasetLabel + number_format(tooltipItem.yLabel);
              },
            },
          },
        },
      });
  
      console.log("Chart initialized successfully!");
    } catch (error) {
      console.error("Error updating area chart:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  }
  
  // Call the updateAreaChart function to initialize the chart
  updateAreaChart();