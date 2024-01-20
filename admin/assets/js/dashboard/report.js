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
  
  // Function to update the line chart
  async function updateLineChart() {
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
  
      const config = {
        type: 'line',
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
            "Dec",
          ],
          datasets: [
            {
              label: 'Unsafe Action',
              data: unsafeData.data,
              borderColor: 'rgba(255, 0, 0, 1)',
              backgroundColor: 'rgba(255, 0, 0, 0.05)',
              yAxisID: 'y',
              lineTension: 0.3,
            },
            {
              label: 'Compromised Action',
              data: compromisedData.data,
              borderColor: 'rgba(0, 97, 242, 1)',
              backgroundColor: 'rgba(0, 97, 242, 0.05)',
              yAxisID: 'y1',
              lineTension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                beginAtZero: true,
              },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              ticks: {
                beginAtZero: true,
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      };
  
      const ctx = document.getElementById("myLineChart").getContext("2d");
  
      const myLineChart = new Chart(ctx, config);
  
      console.log("Chart initialized successfully!");
    } catch (error) {
      console.error("Error updating line chart:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  }
  
  // Call the updateLineChart function to initialize the chart
  updateLineChart();
  