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

// Fungsi untuk mendapatkan laporan berdasarkan kategori dan kelompokkan berdasarkan URL
const getUserReportsByCategoryAndGroup = async () => {
  // URL untuk "Unsafe Action"
  const urlUnsafe = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser";
  
  // URL untuk "Compromised Action"
  const urlCompromised = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser";

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
    // Mendapatkan laporan untuk "Unsafe Action"
    const responseUnsafe = await fetch(urlUnsafe, requestOptions);
    if (responseUnsafe.ok) {
      const responseDataUnsafe = await responseUnsafe.json();

      if (responseDataUnsafe.status === 200) {
        const dataUnsafe = responseDataUnsafe.data;
        // Memproses dan menampilkan data laporan "Unsafe Action" dalam tab
        processReportData(dataUnsafe, "Unsafe Action");
      } else {
        console.error(
          "Respon server (Unsafe Action):",
          responseDataUnsafe.message || "Data tidak dapat ditemukan"
        );
      }
    } else {
      console.error("Kesalahan HTTP (Unsafe Action):", responseUnsafe.status);
    }

    // Mendapatkan laporan untuk "Compromised Action"
    const responseCompromised = await fetch(urlCompromised, requestOptions);
    if (responseCompromised.ok) {
      const responseDataCompromised = await responseCompromised.json();

      if (responseDataCompromised.status === 200) {
        const dataCompromised = responseDataCompromised.data;
        // Memproses dan menampilkan data laporan "Compromised Action" dalam tab
        processReportData(dataCompromised, "Compromised Action");
      } else {
        console.error(
          "Respon server (Compromised Action):",
          responseDataCompromised.message || "Data tidak dapat ditemukan"
        );
      }
    } else {
      console.error("Kesalahan HTTP (Compromised Action):", responseCompromised.status);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};

// Fungsi untuk memproses dan menampilkan data laporan dalam tab
const processReportData = (data, category) => {
  // Menyesuaikan struktur HTML sesuai dengan kebutuhan
  const tabContainerId = "tab-group-1";

  // Membuat tab baru dan menampilkan laporan
  createTabAndDisplayReports(data, category, tabContainerId);
};

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
const createTabAndDisplayReports = async (data, category, tabContainerId) => {
  const tabContainer = document.getElementById(tabContainerId);

  // Create tab controls
  const tabControlsContainer = document.createElement("div");
  tabControlsContainer.className = "rounded-m overflow-hidden mx-3";

  const tabControls = document.createElement("div");
  tabControls.className = "tab-controls tabs-large tabs-rounded";
  tabControls.dataset.highlight = "bg-dark-dark";

  // Add tab controls based on categories
  const tabLinks = [];
  const tabContents = [];
  data.forEach((report, index) => {
    const tabLinkId = `tab-${index + 1}`;
    const tabContentId = `tab-${index + 1}`;

    // Create tab link
    const tabLink = document.createElement("a");
    tabLink.href = "#";
    tabLink.dataset.bsToggle = "collapse";
    tabLink.dataset.bsTarget = `#${tabContentId}`;
    tabLink.innerHTML = category;
    tabLink.id = tabLinkId; // Menggunakan tabLinkId sebagai ID
    if (index === 0) {
      tabLink.dataset.active = true;
    }
    tabControls.appendChild(tabLink);
    tabLinks.push(tabLink);

    // Create tab content
    const tabContent = document.createElement("div");
    tabContent.className = "collapse show";
    tabContent.id = tabContentId;

    const cardContainer = document.createElement("div");
    cardContainer.className = "mt-3";

    // Display reports in card container
    const newCard = createReportCard(report, category);
    cardContainer.appendChild(newCard);
    tabContent.appendChild(cardContainer);
    tabContents.push(tabContent);
  });

  tabControlsContainer.appendChild(tabControls);
  tabContainer.appendChild(tabControlsContainer);

  // Add tab contents to tabContainer
  tabContents.forEach((tabContent) => {
    tabContainer.appendChild(tabContent);
  });
};

// Call the function to create tab controls and display reports
getUserReportsByCategoryAndGroup();
