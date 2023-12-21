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
  const locations = reportData.map(report => report.locationName);
  const uniqueLocations = Array.from(new Set(locations));

  const locationData = Array(uniqueLocations.length).fill(0);

  reportData.forEach((report) => {
    const locationIndex = uniqueLocations.indexOf(report.locationName);
    if (locationIndex !== -1) {
      locationData[locationIndex] += 1;
    }
  });

  return {
    labels: uniqueLocations,
    data: locationData,
  };
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

    // Updated Column Chart Options
    var columnChart2Data = {
      series: [
        {
          name: 'Jumlah Laporan',
          data: transformedData.data,
        },
      ],
    };

    var columnChart2Options = {
      chart: {
        height: 500,
        type: 'bar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
        },
        dropShadow: {
          enabled: true,
          opacity: 0.1,
          blur: 2,
          left: -1,
          top: 5,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      subtitle: {
        text: 'Jumlah Pelanggaran di Unit Kerja',
        align: 'left',
        margin: 0,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '15px',
          color: 'text-dark',
          fontWeight: 'bold',
          marginBottom: '10rem',
          fontFamily: 'Poppins',
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '40%',
          endingShape: 'rounded',
        },
      },
      colors: ['#02172C'],
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: '#dbeaea',
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
      tooltip: {
        theme: 'light',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
      stroke: {
        show: true,
        colors: ['transparent'],
        width: 3,
      },
      labels: transformedData.labels,
      series: columnChart2Data.series,
      xaxis: {
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: 0,
          offsetY: 0,
          style: {
            colors: '#8380ae',
            fontSize: '12px',
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
            colors: '#8380ae',
            fontSize: '12px',
          },
        },
      },
    };

    var columnChart_02 = new ApexCharts(document.querySelector('#columnChart2'), columnChart2Options);
    columnChart_02.render();
  }
};

// Panggil fungsi untuk menggambar grafik
drawChart();
