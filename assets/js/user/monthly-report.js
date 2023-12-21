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
    reports: reportData
      .filter((report) => new Date(report.date).getMonth() === index)
      .map((report) => ({
        location: report.location.locationName,
        area: {
          areaName: report.area.areaName,
        },
        type: report.typeDangerousActions.map((type) => ({
          typeName: type.typeName,
          subTypes: type.subTypes,
        })),
      })),
  }));
};

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

    // Ganti URL ini dengan endpoint API server Anda
    const targetURL = "https://example.com/api/data";

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

// Fungsi untuk menggambar grafik
const drawChart = async () => {
  try {
    // Ambil data dari server
    const reportData = await fetchDataFromServer();

    if (reportData) {
      // Transformasikan data untuk grafik
      const transformedData = transformDataForChart(reportData);

      // Update main chart data
      mainChart.xaxis.categories = transformedData.map((entry) => entry.month);
      mainChart.series[0].data = transformedData.map(({ month, value }) => ({
        x: month,
        y: value,
      }));

      // Tambahkan konfigurasi tampilan
      var mainChartOptions = {
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
          // ... (sesuai dengan konfigurasi tooltip dari mainChart)
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
      };

      mainChart.updateOptions(mainChartOptions);
      mainChart.render();

      // Perbarui data dan opsi grafik breakdown
      breakdownChartOptions.labels = transformedData[0].reports.map(
        (report) => report.location.locationName
      );
      breakdownChartOptions.datasets[0].data = transformedData[0].reports.map(
        (report) => report.value
      );
      var breakdownChartOptions = {
        chart: {
          height: 240,
          type: "horizontalBar",
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
          backgroundColor: "rgb(255,255,255)",
          // ... (sesuai dengan konfigurasi tooltip dari mainChart)
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

      var breakdownChart = new Chart(
        document.querySelector("#breakdownChart"),
        breakdownChart
      );
      breakdownChart.render();
      breakdownChart.updateOptions(breakdownChartOptions);

      // Update area chart data dan konfigurasi tampilan
      areaChart.labels = transformedData.map((entry) => entry.area.areaName);
      areaChart.datasets[0].data = transformedData.map((entry) => entry.value);
      var areaChartOptions = {
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
          backgroundColor: "rgb(255,255,255)",
          // ... (sesuai dengan konfigurasi tooltip dari mainChart)
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

      var areaChart = new Chart(
        document.querySelector("#areaChart"),
        areaChart
      );
      areaChart.render();
      areaChart.updateOptions(areaChartOptions);

      // Update unit chart data dan konfigurasi tampilan
      // Perbarui data dan opsi grafik unit
      unitChart.labels = transformedData.map((entry) => entry.type[0].typeName);
      unitChart.datasets[0].data = transformedData.map((entry) => entry.value);
      var unitChartOptions = {
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
          backgroundColor: "rgb(255,255,255)",
          // ... (sesuai dengan konfigurasi tooltip dari mainChart)
        },
        dataLabels: {
          enabled: false,
        },
      };

      var unitChart = new Chart(
        document.querySelector("#unitChart"),
        unitChart
      );
      unitChart.render();
      unitChart.updateOptions(unitChartOptions);

      // Update sub-unit chart data dan konfigurasi tampilan
      subUnitChart.labels = transformedData.map(
        (entry) => entry.type[0].subTypes[0]
      );
      subUnitChart.datasets[0].data = transformedData.map(
        (entry) => entry.value
      );
      var subUnitChartOptions = {
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
          backgroundColor: "rgb(255,255,255)",
          // ... (sesuai dengan konfigurasi tooltip dari mainChart)
        },
        dataLabels: {
          enabled: false,
        },
      };

      var subUnitChart = new Chart(
        document.querySelector("#subUnitChart"),
        subUnitChart
      );
      subUnitChart.render();
      subUnitChart.updateOptions(subUnitChartOptions);
    }
  } catch (error) {
    console.error("Error drawing chart:", error);
  }
};

// Pemanggilan fungsi drawChart
drawChart();
