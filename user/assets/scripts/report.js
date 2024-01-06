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
  const categoryBadge = `<span class="badge bg-${category.toLowerCase() === 'unsafe' ? 'red' : 'green'}-dark color-white font-10 mb-1 d-block rounded-s">${category}</span>`;

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

// Fungsi untuk membuat kontrol tab dan menampilkan laporan
const createTabControlsAndDisplayReports = async () => {
  const tabContainerId = "tab-container";
  const tabContainer = document.getElementById(tabContainerId);

  // Membuat container untuk kontrol tab
  const tabControlsContainer = document.createElement("div");
  tabControlsContainer.className = "rounded-m overflow-hidden mx-3";

  // Membuat kontrol tab
  const tabControls = document.createElement("div");
  tabControls.className = "tab-controls tabs-large tabs-rounded";
  tabControls.dataset.highlight = "bg-dark-dark";

  // Menambahkan tautan tab berdasarkan kategori
  const categories = ["Unsafe Action", "Compromised Action"];
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const tabLink = document.createElement("a");
    tabLink.href = "#";
    tabLink.dataset.bsToggle = "collapse";
    tabLink.dataset.bsTarget = `#tab-${index + 1}`;
    tabLink.innerHTML = category;
    if (index === 0) {
      tabLink.dataset.active = true; // Menandai tab "Unsafe Action" sebagai aktif secara default
    }
    tabControls.appendChild(tabLink);

    // Membuat container konten tab
    const tabContentContainer = document.createElement("div");

    // Menambahkan konten tab berdasarkan kategori dan URL
    const filteredReports = reportUrls.filter(report => report.category === category);
    for (const [urlIndex, reportUrl] of filteredReports.entries()) {
      const tabContent = document.createElement("div");
      tabContent.className = "collapse";
      tabContent.id = `tab-${index + 1}-url-${urlIndex + 1}`;

      // Mengambil dan membuat kartu untuk setiap laporan
      const data = await fetchReports(reportUrl.url);
      data.forEach(report => {
        const newCard = createReportCard(report, category);
        tabContent.appendChild(newCard);
      });

      tabContentContainer.appendChild(tabContent);
    }

    // Menambahkan container konten tab ke dalam tabContainer
    tabContainer.appendChild(tabContentContainer);
  }

  // Menambahkan kontrol tab ke dalam container
  tabControlsContainer.appendChild(tabControls);
  tabContainer.appendChild(tabControlsContainer);
};

// Fungsi untuk mengambil laporan dari URL tertentu
const fetchReports = async (url) => {
  const token = getTokenFromCookies("Login");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Error Otentikasi",
      text: "Anda belum login!",
    }).then(() => {
      window.location.href = "https://portsafe-apps.github.io/";
    });
    return [];
  }

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.ok) {
      const responseData = await response.json();

      if (responseData.status === 200) {
        return responseData.data;
      } else {
        console.error(`Respon server (${url}):`, responseData.message || "Data tidak ditemukan");
      }
    } else {
      console.error(`Kesalahan HTTP (${url}):`, response.status);
    }
  } catch (error) {
    console.error("Error:", error.message || "Terjadi kesalahan yang tidak diketahui");
  }

  return [];
};

// Report URLs berisi endpoint dan kategori laporan
const reportUrls = [
  { url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser", category: "Unsafe Action" },
  { url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser", category: "Compromised Action" },
  // Tambahkan URL dan kategori sesuai kebutuhan
];

// Memanggil fungsi untuk membuat kontrol tab dan menampilkan laporan
createTabControlsAndDisplayReports();
