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

// Function to fetch data from the server with a date range
async function fetchDataFromServerWithDateRange(url, category, startDate, endDate) {
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
      body: JSON.stringify({ startDate, endDate }),
      redirect: "follow",
    };

    const response = await fetch(url, requestOptions);

    // Add error logging to fetchDataFromServer function
    if (!response.ok) {
      console.error(
        "Server responded with an error:",
        response.status,
        response.statusText
      );
      return { category, data: [] };
    }

    const data = await response.json();
    return { category, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { category, data: [] };
  }
}

// Function to update charts based on date range
async function updateCharts(startDate, endDate) {
  // Update Unsafe Data
  const unsafeDataResponse = await fetchDataFromServerWithDateRange(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe",
    "Unsafe Action",
    startDate,
    endDate
  );

  // Update Compromised Data
  const compromisedDataResponse = await fetchDataFromServerWithDateRange(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised",
    "Compromised Action",
    startDate,
    endDate
  );

  // Process Unsafe Data
  const monthCountsUnsafe = Array(12).fill(0);

  unsafeDataResponse.data.forEach((report) => {
    const month = new Date(report.date).getMonth();
    monthCountsUnsafe[month] += 1;
  });

  // Process Compromised Data
  const monthCountsCompromised = Array(12).fill(0);

  compromisedDataResponse.data.forEach((report) => {
    const month = new Date(report.date).getMonth();
    monthCountsCompromised[month] += 1;
  });

  // Update Multi-axis Line Chart
  multiAxisLineChart.data.datasets[0].data = monthCountsUnsafe;
  multiAxisLineChart.data.datasets[1].data = monthCountsCompromised;
  multiAxisLineChart.update();

  // Process Location Data
  const locationBarChartData = processDataForLocationBarChartAndSort(
    unsafeDataResponse,
    compromisedDataResponse
  );

  // Update Location Bar Chart
  locationBarChart.data.datasets[0].data = locationBarChartData.dataUnsafe;
  locationBarChart.data.datasets[1].data = locationBarChartData.dataCompromised;
  locationBarChart.update();

  // Process Area Data
  const areaBarChartData = processDataForAreaBarChartAndSort(
    unsafeDataResponse,
    compromisedDataResponse
  );

  // Update Area Bar Chart
  areaBarChart.data.datasets[0].data = areaBarChartData.dataUnsafe;
  areaBarChart.data.datasets[1].data = areaBarChartData.dataCompromised;
  areaBarChart.update();

  // Process Type Dangerous Actions Data
  const typeDangerousActionsPieChartData = processDataForTypeDangerousActionsPieChart(
    unsafeDataResponse,
    compromisedDataResponse
  );

  // Update Type Dangerous Actions Pie Chart
  typeDangerousActionsPieChart.data.datasets[0].data = typeDangerousActionsPieChartData.data;
  typeDangerousActionsPieChart.update();
}

// Function to create charts initially
function createInitialCharts() {
  // Initial Unsafe Data Fetch
  fetchDataFromServerWithDateRange(
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe",
    "Unsafe Action",
    new Date(),
    new Date()
  ).then((unsafeDataResponse) => {
    // Process Unsafe Data
    const monthCountsUnsafe = Array(12).fill(0);

    unsafeDataResponse.data.forEach((report) => {
      const month = new Date(report.date).getMonth();
      monthCountsUnsafe[month] += 1;
    });

    // Create Multi-axis Line Chart
    const multiAxisLineChartData = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Unsafe Actions",
          borderColor: "#4e73df",
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          data: monthCountsUnsafe,
        },
        // Add an empty dataset for Compromised Actions
        {
          label: "Compromised Actions",
          borderColor: "#f6c23e",
          backgroundColor: "rgba(246, 194, 62, 0.05)",
          data: Array(12).fill(0),
        },
      ],
    };

    const multiAxisLineChartOptions = {
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Month",
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Number of Actions",
          },
        },
      },
    };

    const multiAxisLineChart = new Chart(document.getElementById("multiAxisLineChart"), {
      type: "line",
      data: multiAxisLineChartData,
      options: multiAxisLineChartOptions,
    });

    // Initial Compromised Data Fetch
    fetchDataFromServerWithDateRange(
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised",
      "Compromised Action",
      new Date(),
      new Date()
    ).then((compromisedDataResponse) => {
      // Process Compromised Data
      const monthCountsCompromised = Array(12).fill(0);

      compromisedDataResponse.data.forEach((report) => {
        const month = new Date(report.date).getMonth();
        monthCountsCompromised[month] += 1;
      });

      // Update Multi-axis Line Chart
      multiAxisLineChart.data.datasets[1].data = monthCountsCompromised;
      multiAxisLineChart.update();

      // Create Location Bar Chart
      const locationBarChartData = processDataForLocationBarChartAndSort(
        unsafeDataResponse,
        compromisedDataResponse
      );

      const locationBarChartOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: Math.max(...locationBarChartData.dataUnsafe, ...locationBarChartData.dataCompromised) + 1,
          },
        },
      };

      const locationBarChart = new Chart(document.getElementById("locationBarChart"), {
        type: "horizontalBar",
        data: {
          labels: locationBarChartData.labels,
          datasets: [
            {
              label: "Unsafe Actions",
              backgroundColor: "#4e73df",
              data: locationBarChartData.dataUnsafe,
            },
            {
              label: "Compromised Actions",
              backgroundColor: "#f6c23e",
              data: locationBarChartData.dataCompromised,
            },
          ],
        },
        options: locationBarChartOptions,
      });

      // Create Area Bar Chart
      const areaBarChartData = processDataForAreaBarChartAndSort(
        unsafeDataResponse,
        compromisedDataResponse
      );

      const areaBarChartOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: Math.max(...areaBarChartData.dataUnsafe, ...areaBarChartData.dataCompromised) + 1,
          },
        },
      };

      const areaBarChart = new Chart(document.getElementById("areaBarChart"), {
        type: "horizontalBar",
        data: {
          labels: areaBarChartData.labels,
          datasets: [
            {
              label: "Unsafe Actions",
              backgroundColor: "#4e73df",
              data: areaBarChartData.dataUnsafe,
            },
            {
              label: "Compromised Actions",
              backgroundColor: "#f6c23e",
              data: areaBarChartData.dataCompromised,
            },
          ],
        },
        options: areaBarChartOptions,
      });

      // Create Type Dangerous Actions Pie Chart
      const typeDangerousActionsPieChartData = processDataForTypeDangerousActionsPieChart(
        unsafeDataResponse,
        compromisedDataResponse
      );

      const typeDangerousActionsPieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      };

      const typeDangerousActionsPieChart = new Chart(
        document.getElementById("typeDangerousActionsPieChart"),
        {
          type: "doughnut",
          data: {
            labels: typeDangerousActionsPieChartData.labels,
            datasets: [
              {
                data: typeDangerousActionsPieChartData.data,
                backgroundColor: ["#4e73df", "#f6c23e"],
              },
            ],
          },
          options: typeDangerousActionsPieChartOptions,
        }
      );

      // Add Litepicker date range plugin
      const picker = new Litepicker({
        element: document.getElementById("dateRangePicker"),
        singleMode: false,
        autoApply: true,
        format: "YYYY-MM-DD",
        onSelect: function (date1, date2) {
          updateCharts(date1, date2);
        },
      });
    });
  });
}

// Run the function to create initial charts
createInitialCharts();
