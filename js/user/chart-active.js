// Fungsi untuk mengubah data laporan menjadi format yang sesuai dengan grafik
const transformDataForChart = (reportData) => {
    const monthlyCounts = Array(12).fill(0);

    reportData.forEach((report) => {
        const month = new Date(report.date).getMonth();
        monthlyCounts[month] += 1;
    });

    return monthlyCounts;
};

// Fungsi untuk menggambar grafik
const drawChart = async () => {
    // Fungsi untuk mengambil data dari server
    const fetchDataFromServer = async () => {
        try {
            const response = await fetch('https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser');
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const reportData = await fetchDataFromServer();

    if (reportData) {
        const transformedData = transformDataForChart(reportData);

        // Hitung total laporan bulan ini
        const totalLaporanBulanIni = transformedData.reduce((total, count) => total + count, 0);

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
            colors: ['#0134d4'],
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
                text: totalLaporanBulanIni.toString(), // Ubah teks title sesuai dengan total laporan bulan ini
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
            xaxis: {
                categories: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
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
            series: [{
                name: 'Jumlah Laporan',
                data: transformedData, // Menggunakan data yang telah diubah
            }],
        };

        var areaChart_01 = new ApexCharts(document.querySelector("#areaChart1"), areaChart1);
        areaChart_01.render();
    }
};

// Panggil fungsi untuk menggambar grafik
drawChart();