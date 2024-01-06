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

// Fungsi untuk membuat kartu laporan
const createReportCard = (report, category) => {
  const newCard = document.createElement("div");
  newCard.className = "card card-style";

  // Menambahkan badge status untuk kategori "Compromised Action"
  const statusBadge =
    category === "Compromised Action"
      ? `<span class="badge bg-green-dark color-white font-10 mb-1 d-block rounded-s">${report.status}</span>`
      : "";

  // Menambahkan badge kategori "Unsafe" atau "Compromised"
  const categoryBadge = `<span class="badge bg-${category.toLowerCase() === 'unsafe' ? 'yellow' : 'red'}-dark color-white font-10 mb-1 d-block rounded-s"><i class="fa ${category.toLowerCase() === 'unsafe' ? 'fa-exclamation-triangle' : 'fa-child'}"></i> ${category}</span>`;

  // Memastikan bahwa properti yang akan diakses tersedia sebelum mengaksesnya
  const locationName = report.location
    ? report.location.locationName
    : "Unknown Location";
  const typeName =
    report.typeDangerousActions &&
    report.typeDangerousActions.length > 0 &&
    report.typeDangerousActions[0].subTypes &&
    report.typeDangerousActions[0].subTypes.length > 0 &&
    report.typeDangerousActions[0].subTypes[0].typeName
      ? report.typeDangerousActions[0].subTypes[0].typeName
      : "Unknown Type";
  const userName = report.user ? report.user.nama : "Unknown User";

  // Sesuaikan struktur kartu dengan data yang Anda miliki
  newCard.innerHTML = `
        <div class="content">
            <div class="d-flex">
                <div>
                    <h4>${report.reportid}</h4>
                    <p class="color-highlight mt-n1 font-12"><i class="fa fa-map-marker-alt"></i> ${locationName}</p>
                </div>
                <div class="ms-auto align-self-center">
                ${categoryBadge}   
                ${statusBadge}      
                </div>
            </div>
            <div class="divider bg-highlight mt-0 mb-2"></div>
            <p class="mb-0 color-highlight">
                Jenis Ketidaksesuaian
            </p>
            <span class="badge bg-highlight color-white font-10 mb-1 rounded-s">${typeName}</span>
            <div class="row mb-n2 color-theme">
                <div class="col-5 font-11">
                    <p class="color-highlight font-11"><i class="fa fa-user"></i> ${userName}</p>
                </div>
                <div class="col-7 font-11">
                    <p class="color-highlight font-11"><i class="far fa-calendar"></i> ${report.date} <i class="ms-4 far fa-clock"></i> ${report.time}</p>
                </div>
            </div>
        </div>
    `;

  return newCard;
};

// Fungsi untuk membuat tab dan menampilkan laporan
const createTabAndDisplayReports = async (data, category, tabIndex) => {
  // Container untuk tab
  const tabContainer = document.getElementById("tab-container");

  // Create tab controls
  const tabControlsContainer = document.createElement("div");
  tabControlsContainer.className = "rounded-m overflow-hidden mx-3";

  const tabControls = document.createElement("div");
  tabControls.className = "tab-controls tabs-large tabs-rounded";
  tabControls.dataset.highlight = "bg-dark-dark";

  // Create tab links
  const tabLink = document.createElement("a");
  tabLink.href = "#";
  tabLink.dataset.bsToggle = "collapse";
  tabLink.dataset.bsTarget = `#tab-${tabIndex}`;
  tabLink.innerHTML = category;
  tabLink.dataset.active = tabIndex === 1; // Tandai sebagai aktif jika ini tab pertama
  tabControls.appendChild(tabLink);

  // Create tab content
  const tabContent = document.createElement("div");
  tabContent.className = `collapse ${tabIndex === 1 ? 'show' : ''}`;
  tabContent.id = `tab-${tabIndex}`;

  // Display reports in card container
  const cardContainer = document.createElement("div");
  cardContainer.className = "mt-3";

  // Loop through data and create report cards
  data.forEach(report => {
    const newCard = createReportCard(report, category);
    cardContainer.appendChild(newCard);
  });

  // Append tab controls and tab content to tab container
  tabControlsContainer.appendChild(tabControls);
  tabContainer.appendChild(tabControlsContainer);

  tabContent.appendChild(cardContainer);
  tabContainer.appendChild(tabContent);
};

// Function to create tab controls
const createTabControls = () => {
  const tabContainerId = "tab-container";
  const tabControlsContainer = document.getElementById(tabContainerId);

  // Remove existing tab controls
  tabControlsContainer.innerHTML = "";
};

// Function to get and display reports
const getUserReportsByCategoryAndGroup = async () => {
  // URL dan kategori laporan
  const reportUrls = [
    { url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser", category: "Unsafe Action" },
    { url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser", category: "Compromised Action" }
    // Add more URLs and categories as needed
  ];

  // Mendapatkan token dari cookie
  const token = getTokenFromCookies("Login");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Authentication Error",
      text: "Kamu Belum Login!",
    }).then(() => {
      window.location.href = "https://portsafe-apps.github.io/";
    });
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    // Iterate over each URL and fetch reports
    for (const [index, reportUrl] of reportUrls.entries()) {
      const response = await fetch(reportUrl.url, requestOptions);

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status === 200) {
          const data = responseData.data;
          // Memproses dan menampilkan data laporan dalam tab
          createTabAndDisplayReports(data, reportUrl.category, index + 1);
        } else {
          console.error(
            `Respon server (${reportUrl.category}):`,
            responseData.message || "Data tidak dapat ditemukan"
          );
        }
      } else {
        console.error(`Kesalahan HTTP (${reportUrl.category}):`, response.status);
      }
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};

// Call the function to create tab controls and display reports
createTabControls();

// Call the function to get and display reports
getUserReportsByCategoryAndGroup();
