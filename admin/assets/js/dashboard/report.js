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
            return { category, data: [] };
        }

        const myHeaders = new Headers();
        myHeaders.append("Login", token);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
        };

        const response = await fetch(url, requestOptions);

        // Add error logging to fetchDataFromServer function
        if (!response.ok) {
            console.error("Server responded with an error:", response.status, response.statusText);
            return { category, data: [] };
        }

        const data = await response.json();
        return { category, data: data.data || [] };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { category, data: [] };
    }
}

// Unsafe Data Fetch
const unsafeDataResponse = await fetchDataFromServer(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport",
    "Unsafe Action"
);

// Compromised Data Fetch
const compromisedDataResponse = await fetchDataFromServer(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised",
    "Compromised Action"
);

// Unsafe Data Processing
const monthCountsUnsafe = Array(12).fill(0);

unsafeDataResponse.data.forEach((report) => {
    const month = new Date(report.date).getMonth();
    monthCountsUnsafe[month] += 1;
});

// Compromised Data Processing
const monthCountsCompromised = Array(12).fill(0);

compromisedDataResponse.data.forEach((report) => {
    const month = new Date(report.date).getMonth();
    monthCountsCompromised[month] += 1;
});

// Multi-axis Line Chart Example
var ctx = document.getElementById("myMultiAxisLineChart");
var multiAxisLineChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "Unsafe",
                yAxisID: "y-axis-1",
                lineTension: 0.3,
                backgroundColor: "rgba(0, 97, 242, 0.05)",
                borderColor: "rgba(0, 97, 242, 1)",
                pointRadius: 6, // Ukuran titik
                pointBackgroundColor: "rgba(0, 97, 242, 1)",
                pointBorderColor: "rgba(0, 97, 242, 1)",
                pointHoverRadius: 8, // Ukuran titik saat dihover
                pointHoverBackgroundColor: "rgba(0, 97, 242, 1)",
                pointHoverBorderColor: "rgba(0, 97, 242, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: monthCountsUnsafe,
            },
            {
                label: "Compromised",
                yAxisID: "y-axis-1",
                lineTension: 0.3,
                backgroundColor: "rgba(255, 99, 132, 0.05)",
                borderColor: "rgba(255, 99, 132, 1)",
                pointRadius: 6, // Ukuran titik
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                pointBorderColor: "rgba(255, 99, 132, 1)",
                pointHoverRadius: 8, // Ukuran titik saat dihover
                pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
                pointHoverBorderColor: "rgba(255, 99, 132, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: monthCountsCompromised,
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
                        maxTicksLimit: 7,
                        fontSize: 14 // Ukuran font label sumbu x
                    }
                }
            ],
            yAxes: [
                {
                    id: "y-axis-1",
                    position: "left",
                    ticks: {
                        beginAtZero: true,
                        stepSize: 3,
                        padding: 10,
                        callback: function (value, index, values) {
                            return number_format(value);
                        },
                        fontSize: 14 // Ukuran font label sumbu y
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
            position: "top",
            labels: {
                fontSize: 14 // Ukuran font label legenda
            }
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: "#6e707e",
            titleFontSize: 14, // Ukuran font title tooltip
            bodyFontSize: 12, // Ukuran font body tooltip
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
                    var datasetLabel =
                        chart.datasets[tooltipItem.datasetIndex].label || "";
                    return datasetLabel + ": " + number_format(tooltipItem.yLabel);
                }
            }
        }
    }
});