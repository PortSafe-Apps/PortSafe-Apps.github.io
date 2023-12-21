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

// Fungsi untuk mengubah data laporan menjadi format yang sesuai dengan grafik
const transformDataForChart = (reportData) => {
  const monthlyCounts = Array(12).fill(0);

  reportData.forEach((report) => {
    const month = new Date(report.date).getMonth();
    monthlyCounts[month] += 1;
  });

  return monthlyCounts.map((value, index) => ({
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ][index],
    value: value,
  }));
};

// Fungsi untuk menggambar grafik
const drawChart = async () => {
  // Fungsi untuk mengambil data dari server
  const fetchDataFromServer = async () => {
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
  };

  const reportData = await fetchDataFromServer();

  if (reportData) {
    const transformedData = transformDataForChart(reportData);

    var areaChart1 = {
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
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 20, 
        yPadding: 15, 
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const month = transformedData[dataPointIndex].month;
          const value = series[0][dataPointIndex]; 
          return (
            '<div style="width: 135px; height: 45px;">' +
            '<span>' +
            month +
            '</span>' +
            '<br>' +
            '<span>' +
            "Jumlah Laporan : " + value +
            "</span>" +
            "</div>"
          );
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
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Dec",
        ],
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
          name: "Jumlah Laporan",
          data: transformedData.map(({ month, value }) => ({
            x: month,
            y: value,
          })),
        },
      ],
    };

    var areaChart_01 = new ApexCharts(
      document.querySelector("#areaChart1"),
      areaChart1
    );
    areaChart_01.render();
  }
};

// Panggil fungsi untuk menggambar grafik
drawChart();
