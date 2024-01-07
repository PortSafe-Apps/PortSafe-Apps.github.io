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

const displayDetailedReport = (detailedReport, detailContainerId, category) => {
  const detailContainer = document.getElementById(detailContainerId);

  // Clear existing content
  detailContainer.innerHTML = "";

  // Create a new card for detailed view
  const detailCard = document.createElement("div");
  detailCard.className = "card card-style mb-3";

  // Header for detailed view
  const header = document.createElement("div");
  header.className = "content";
  header.innerHTML = `
    <div class="d-flex">
      <div>
        <h4 class="mb-n1">Detail Observasi</h4>
      </div>
      <div class="ms-auto">
        <span class="badge ${
          category === "Unsafe Action" ? "bg-yellow-dark" : "bg-red-dark"
        } color-white font-10 mb-1 d-block rounded-s">
          <i class="${
            category === "Compromised Action"
              ? "fa fa-exclamation-triangle"
              : "fa fa-child"
          }"></i> ${category}
        </span>
        ${
          detailedReport.status
            ? `<span class="badge ${
                detailedReport.status === "Opened"
                  ? "bg-green-dark"
                  : "bg-red-dark"
              } color-white font-10 mb-1 d-block rounded-s">${
                detailedReport.status
              }</span>`
            : ""
        }
      </div>
    </div>
    <div class="divider mt-3 mb-2"></div>
  `;
  detailCard.appendChild(header);

  // Details of the report
  const detailsContent = document.createElement("div");
  detailsContent.className = "content";
  detailsContent.innerHTML = `
    <div class="row mb-0">
      <div class="col-4">
        <p class="color-theme font-700">No. Pelaporan</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.reportid}</p>
      </div>

      <div class="col-4">
        <p class="color-theme font-700">Tanggal</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.date}</p>
      </div>

      <div class="col-4">
        <p class="color-theme font-700">Waktu</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.time}</p>
      </div>

      <div class="col-4">
        <p class="color-theme font-700">Observator</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.user.nama}</p>
      </div>

      <div class="col-4">
        <p class="color-theme font-700">Unit Kerja</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.area.areaName}</p>
      </div>

      <div class="col-4">
        <p class="color-theme font-700">Area</p>
      </div>
      <div class="col-8">
        <p class="font-400">${detailedReport.location.locationName}</p>
      </div>
    </div>
  `;
  detailCard.appendChild(detailsContent);

  // Deskripsi Pengamatan
  const descriptionContent = document.createElement("div");
  descriptionContent.className = "content";
  descriptionContent.innerHTML = `
    <h4 class="mb-n1">Deskripsi Pengamatan</h4>
    <div class="divider mt-3 mb-2"></div>
    <div class="row mb-0">
      <p class="mb-3">${detailedReport.description}</p>
      ${
        detailedReport.observationPhoto
          ? `<img height="175" src="${detailedReport.observationPhoto}" alt="">`
          : ""
      }
    </div>
  `;
  detailCard.appendChild(descriptionContent);

  // Jenis Tindakan Berbahaya
  const dangerousActionContent = document.createElement("div");
  dangerousActionContent.className = "content";
  dangerousActionContent.innerHTML = `
    <h4 class="mb-n1">Jenis Tindakan Berbahaya</h4>
    <div class="divider mt-3 mb-2"></div>
    <div class="content mb-2">
      ${
        detailedReport.typeDangerousActions &&
        detailedReport.typeDangerousActions.length
          ? detailedReport.typeDangerousActions
              .map(
                (action, index) => `
              <h5 href="#type${
                index + 1
              }" data-bs-toggle="collapse" role="button" class="font-600">
                ${action.typeName}
                <i class="fa fa-angle-down float-end me-2 mt-1 opacity-50 font-10"></i>
              </h5>
              <div class="collapse" id="type${index + 1}">
                ${action.subTypes
                  .map(
                    (subType) => `
                  <span class="badge bg-red-dark mt-2 p-2 font-8 rounded-s">${subType}</span>
                `
                  )
                  .join("")}
              </div>
              <div class="divider mt-3 mb-3"></div>
            `
              )
              .join("")
          : "<p>Tidak ada data tindakan berbahaya.</p>"
      }
    </div>
  `;
  detailCard.appendChild(dangerousActionContent);

  // Tindakan Perbaikan Segera
  const immediateActionContent = document.createElement("div");
  immediateActionContent.className = "content";
  immediateActionContent.innerHTML = `
    <h4 class="mb-n1">Tindakan Perbaikan Segera</h4>
    <div class="divider mt-3 mb-2"></div>
    <div class="row mb-0">
      <p class="mb-3">${detailedReport.immediateAction}</p>
      ${
        detailedReport.improvementPhoto
          ? `<img height="175" src="${detailedReport.improvementPhoto}" alt="">`
          : ""
      }
    </div>
  `;
  detailCard.appendChild(immediateActionContent);

  // Tindakan Pencegahan Terulang Kembali
  if (category === "Compromised Action") {
    const preventionContent = document.createElement("div");
    preventionContent.className = "content";
    preventionContent.innerHTML = `
      <h4 class="mb-n1">Tindakan Pencegahan Terulang Kembali</h4>
      <div class="divider mt-3 mb-2"></div>
      <div class="row mb-0">
        <h5 class="mb-n1">1. Rekomendasi</h5>
        <p class="mb-3">${detailedReport.recomendation}</p>
        <h5 class="mb-n1">2. Tindak Lanjut</h5>
        <p class="mb-3">${detailedReport.ActionDesc}</p>
        ${
          detailedReport.EvidencePhoto
            ? `<img height="175" src="${detailedReport.EvidencePhoto}" alt="">`
            : ""
        }
      </div>
    `;
    preventionContent.innerHTML += detailedReport.recomendation
      ? detailedReport.recomendation
          .map(
            (action, index) => `
                <span class="badge bg-green-dark mt-2 p-2 font-8 rounded-s">${action}</span>
              `
          )
          .join("")
      : "<p>Tidak ada data tindakan pencegahan terulang kembali.</p>";
    detailCard.appendChild(preventionContent);
  }

  detailContainer.appendChild(detailCard);
};

// Fungsi untuk mendapatkan laporan detail berdasarkan reportid
const getDetailedReport = async (reportid, detailContainerId, category) => {
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

  // Tentukan URL endpoint berdasarkan kategori
  const targetURL =
    category === "Unsafe Action"
      ? "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/oneReport-1"
      : category === "Compromised Action"
      ? "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getOneReportCompromised"
      : "";

  if (!targetURL) {
    console.error("Invalid category:", category);
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ reportid }),
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);

    if (response.ok) {
      const data = await response.json();

      if (data.status === 200) {
        displayDetailedReport(data.data, detailContainerId, category);
      } else {
        console.error(
          `Server response (${category}):`,
          data.message || "Data tidak dapat ditemukan"
        );
      }
    } else {
      console.error(`HTTP error (${category}):`, response.status);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};


const createReportCard = (report, category, index) => {
  const newCard = document.createElement("div");
  newCard.className = "card card-style mb-3";
  newCard.id = `card-${category.toLowerCase()}-${index + 1}`;

  // Menambahkan badge kategori "Unsafe" atau "Compromised"
  const categoryBadge = `<span class="badge bg-${
    category.toLowerCase() === "unsafe" ? "danger" : "success"
  } text-white font-10 mb-1 d-block rounded-s">${category}</span>`;

  // Menambahkan badge status untuk kategori "Compromised Action"
  const statusBadge =
    category === "Compromised Action"
      ? `<span class="badge bg-success text-white font-10 mb-1 d-block rounded-s">${report.status}</span>`
      : "";

  // Memastikan bahwa properti yang akan diakses tersedia sebelum mengaksesnya
  const locationName = report.location
    ? report.location.locationName
    : "Lokasi Tidak Diketahui";

  // Menangani properti yang mungkin undefined
  const typeName =
    (report.typeDangerousActions &&
      report.typeDangerousActions.length > 0 &&
      report.typeDangerousActions[0].typeName) ||
    "Jenis Tidak Diketahui";

  const userName =
    (report.user && report.user.nama) || "Pengguna Tidak Diketahui";

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
        <span class="badge bg-highlight text-white font-10 mb-1 rounded-s">${typeName}</span>
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
  // Tambahkan event listener untuk menangani klik pada card
  newCard.addEventListener("click", () => {
    // Redirect ke halaman detail dengan menyertakan reportid sebagai parameter query
    window.location.href = `https://portsafe-apps.github.io/user/detailreport.html?reportid=${report.reportid}`;
  });

  return newCard;
};

// Inisialisasi tab
const tabsContainerId = "tab-group-1";
const tabs = document.querySelectorAll(`#${tabsContainerId} .tab-controls a`);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetTabId = tab.getAttribute("data-bs-target");
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const tabContents = document.querySelectorAll(`#${tabsContainerId} .collapse`);
    tabContents.forEach((tc) => tc.classList.remove("show"));

    const targetTab = document.querySelector(targetTabId);
    if (targetTab) {
      targetTab.classList.add("show");
    }
  });
});

// Periksa apakah kontainer ada sebelum menambahkan kartu-kartu
const containerIdUnsafe = "tab-unsafe";
const containerIdCompromised = "tab-compromised";

const containerUnsafe = document.getElementById(containerIdUnsafe);
const containerCompromised = document.getElementById(containerIdCompromised);

const createTabAndDisplayReports = async (data, category, activeTab) => {
  // Periksa kategori dan tentukan kontainer yang sesuai
  let container;
  if (category === "Unsafe Action") {
    container = containerUnsafe;
  } else if (category === "Compromised Action") {
    container = containerCompromised;
  }

  if (container) {
    // Iterasi setiap laporan dan buat kartu-kartu
    data.forEach((report, index) => {
      const newCard = createReportCard(report, category, index);
      container.appendChild(newCard);
    });
  }

  // Inisialisasi tab (logika toggle sederhana)
  const tabs = document.querySelectorAll(`#${tabsContainerId} .tab-controls a`);
  let hasActiveTab = false;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTabId = tab.getAttribute("data-bs-target");
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabContents = document.querySelectorAll(`#${tabsContainerId} .collapse`);
      tabContents.forEach((tc) => tc.classList.remove("show"));

      const targetTab = document.querySelector(targetTabId);
      if (targetTab) {
        targetTab.classList.add("show");
      }
    });

    // Periksa apakah tab sudah aktif
    if (tab.classList.contains("active")) {
      hasActiveTab = true;
    }
  });

  // Aktifkan tab awal hanya jika tidak ada tab yang sudah aktif dan activeTab bukan "tab-compromised"
  if (!hasActiveTab && activeTab !== containerIdCompromised) {
    const initialTab = document.querySelector(
      `#${tabsContainerId} .tab-controls a[data-bs-target="#${activeTab}"]`
    );
    if (initialTab) {
      initialTab.click();
    }
  }
};


const getUserReportsByCategoryAndGroup = async () => {
  // URL dan kategori laporan
  const reportUrls = [
    {
      url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser",
      category: "Unsafe Action",
      tabId: "tab-unsafe",
    },
    {
      url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser",
      category: "Compromised Action",
      tabId: "tab-compromised",
    },
    // Tambahkan URL dan kategori lain jika diperlukan
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
    // Iterasi ke setiap URL dan ambil laporan
    for (const reportUrl of reportUrls) {
      const response = await fetch(reportUrl.url, requestOptions);

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status === 200) {
          const data = responseData.data;
          createTabAndDisplayReports(
            data,
            reportUrl.category,
            "tab-group-1",
            reportUrl.tabId
          );

        } else {
          console.error(
            `Respon server (${reportUrl.category}):`,
            responseData.message || "Data tidak dapat ditemukan"
          );
        }
      } else {
        console.error(
          `Kesalahan HTTP (${reportUrl.category}):`,
          response.status
        );
      }
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};

// Panggil fungsi untuk mendapatkan dan menampilkan laporan
getUserReportsByCategoryAndGroup();

// ID elemen target di halaman detail report
const detailContainerId = "detailContainer";

// Ambil reportid dari parameter query
const reportid = new URLSearchParams(window.location.search).get("reportid");

// Panggil fungsi getDetailedReport untuk mendapatkan dan menampilkan laporan detail
if (reportid) {
  getDetailedReport(reportid, detailContainerId);
}