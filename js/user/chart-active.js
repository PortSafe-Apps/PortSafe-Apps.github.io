// Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  }
  
  // Fungsi untuk mendapatkan data dari server
  const fetchDataFromServer = async () => {
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Error',
        text: 'Kamu Belum Login!',
      }).then(() => {
        window.location.href = 'https://portsafe-apps.github.io/';
      });
      return null;
    }
  
    const url = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUse';
  
    try {
      const response = await fetch(url, {
        headers: {
          'Login': token,
        },
      });
  
      const data = await response.json();
      return data.data; // Mengembalikan data laporan dari server
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  
  // Fungsi untuk mengubah data laporan menjadi format yang sesuai dengan grafik
  const transformDataForChart = (reportData) => {
    const seriesData = [];
  
    // Logika untuk menghitung jumlah report dan perbanding selama 12 bulan
    const monthlyCounts = Array(12).fill(0);
  
    reportData.forEach((report) => {
      const month = new Date(report.date).getMonth(); // Ambil bulan dari tanggal laporan
      monthlyCounts[month] += 1; // Tambahkan 1 ke jumlah report per bulan
    });
  
    // Ubah objek menjadi array yang sesuai dengan struktur series di grafik
    for (let i = 0; i < 12; i++) {
      seriesData.push({
        name: `Bulan ${i + 1}`,
        data: [monthlyCounts[i] || 0], // Jika tidak ada laporan, set jumlahnya menjadi 0
      });
    }
  
    return seriesData;
  };
  
  // Fungsi untuk menggambar grafik
  const drawChart = async () => {
    const reportData = await fetchDataFromServer();
  
    if (reportData) {
      const transformedData = transformDataForChart(reportData);
  
      var areaChart1 = {
        chart: {
          height: 240,
          type: 'area',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1000
          },
          dropShadow: {
            enabled: true,
            opacity: 0.1,
            blur: 1,
            left: -5,
            top: 18
          },
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
        },
        colors: ['#0134d4', '#ea4c62'],
        dataLabels: {
          enabled: false
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
          }
        },
        grid: {
          borderColor: '#dbeaea',
          strokeDashArray: 4,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: false,
            }
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          offsetY: 4,
          fontSize: '14px',
          markers: {
            width: 9,
            height: 9,
            strokeWidth: 0,
            radius: 20
          },
          itemMargin: {
            horizontal: 5,
            vertical: 0
          }
        },
        title: {
          text: '$5,394',
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 20,
          floating: false,
          style: {
            fontSize: '16px',
            color: '#8480ae'
          },
        },
        tooltip: {
          theme: 'dark',
          marker: {
            show: true,
          },
          x: {
            show: false,
          }
        },
        subtitle: {
          text: 'Jumlah Laporan Bulan Ini',
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '14px',
            color: '#8480ae'
          }
        },
        stroke: {
          show: true,
          curve: 'smooth',
          width: 3
        },
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        series: transformedData, // Menggunakan data yang telah diubah
        xaxis: {
          crosshairs: {
            show: true
          },
          labels: {
            offsetX: 0,
            offsetY: 0,
            style: {
              colors: '#8480ae',
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
              colors: '#8480ae',
              fontSize: '12px',
            },
          }
        },
      };
  
      var areaChart_01 = new ApexCharts(document.querySelector("#areaChart1"), areaChart1);
      areaChart_01.render();
    }
  };
  
  // Panggil fungsi untuk menggambar grafik
  drawChart();
  