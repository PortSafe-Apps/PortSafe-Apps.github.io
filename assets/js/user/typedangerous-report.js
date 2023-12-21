var donutChart = {
    chart: {
        height: 240,
        type: 'donut',
        sparkline: {
            enabled: true
        },
        dropShadow: {
            enabled: false,
        },
    },
    subtitle: {
        text: "Jumlah Laporan Berdasarkan Jenis Pelanggaran",
        align: "left",
        margin: 0,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "15px",
          color: "text-dark",
          fontWeight: "bold",
          marginBottom: "10rem",
          fontFamily: "Poppins",
        },
    },
    colors: ['#0134d4', '#2ecc4a', '#ea4c62', '#1787b8'],
    series: [100, 55, 63, 77],
    labels: ['Business', 'Marketing', 'Admin', 'Ecommerce'],
};

var donut_Chart = new ApexCharts(document.querySelector("#donutChart"), donutChart);
donut_Chart.render();