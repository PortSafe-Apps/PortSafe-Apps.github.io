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

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  "'Poppins', '-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif'";
Chart.defaults.global.defaultFontColor = "#858796";

// Function for number formatting
function number_format(number) {
  const n = isFinite(+number) ? +number : 0;
  const dec = ".";
  const sep = " ";
  const toFixedFix = function (n) {
    return "" + Math.round(n);
  };

  const s = toFixedFix(n).split(".");
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
    // Fetch unsafe data
    console.log("Fetching unsafe data...");
    const unsafeData = await fetchDataFromServer(
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport",
      "Unsafe Action"
    );
    console.log("Unsafe data:", unsafeData);

    // Fetch compromised data
    console.log("Fetching compromised data...");
    const compromisedData = await fetchDataFromServer(
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised",
      "Compromised Action"
    );
    console.log("Compromised data:", compromisedData);

    // Verify the structure of the combined data
    const combinedData = unsafeData.data.map((value, index) => ({
      unsafe: value,
      compromised: compromisedData.data[index] || 0,
    }));

    // Multi-axis Line Chart Initialization
    const ctx = document.getElementById("myMultiAxisLineChart");
    const multiAxisLineChart = new Chart(ctx, {
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
          "Dec",
        ],
        datasets: [
          {
            label: "Unsafe Action",
            borderColor: "rgba(78, 115, 223, 1)",
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            data: combinedData.map((entry, index) => entry.unsafe),
          },
          {
            label: "Compromised Action",
            borderColor: "rgba(28, 200, 138, 1)",
            backgroundColor: "rgba(28, 200, 138, 0.05)",
            data: combinedData.map((entry, index) => entry.compromised),
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 0,
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
                maxTicksLimit: 12, // Sesuaikan dengan jumlah bulan yang akan ditampilkan
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                callback: function (value) {
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
          position: "top",
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
              const datasetLabel =
                chart.datasets[tooltipItem.datasetIndex].label || "";
              const dataLabel = tooltipItem.xLabel;
              return `${datasetLabel} (${dataLabel}): ${number_format(
                tooltipItem.yLabel
              )}`;
            },
          },
        },
      },
    });
    console.log("Chart initialized successfully!");
  } catch (error) {
    console.error("Error updating line chart:", error);
  }
}

// Call the function to update the line chart
updateLineChart();
