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

  return newCard;
};

const createTabAndDisplayReports = async (
  data,
  category,
  tabContainerId,
  activeTab
) => {

  // Get the containers for Unsafe Action and Compromised Action
  const unsafeContainer = document.getElementById(`tab-unsafe`);
  const compromisedContainer = document.getElementById(`tab-compromised`);

  // Check if the category is "Unsafe Action" and populate the corresponding container
  if (category === "Unsafe Action") {
    // Iterate over each report
    data.forEach((report, index) => {
      // Create card for each report
      const newCard = createReportCard(report, category, index);
      unsafeContainer.appendChild(newCard);
    });
  } else if (category === "Compromised Action") {
    // Iterate over each report
    data.forEach((report, index) => {
      // Create card for each report
      const newCard = createReportCard(report, category, index);
      compromisedContainer.appendChild(newCard);
    });
  }

  // Initialize tabs (simple toggle logic)
  const tabs = document.querySelectorAll(`#${tabContainerId} .tab-controls a`);
  let hasActiveTab = false;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTabId = tab.getAttribute("data-bs-target");
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabContents = document.querySelectorAll(`#${tabContainerId} .collapse`);
      tabContents.forEach((tc) => tc.classList.remove("show"));

      const targetTab = document.querySelector(targetTabId);
      if (targetTab) {
        targetTab.classList.add("show");
      }
    });

    // Check if the tab is already active
    if (tab.classList.contains("active")) {
      hasActiveTab = true;
    }
  });

  // Activate the initial tab only if no tab is already active and the activeTab is not "tab-compromised"
  if (!hasActiveTab && activeTab !== "tab-compromised") {
    const initialTab = document.querySelector(
      `#${tabContainerId} .tab-controls a[data-bs-target="#${activeTab}"]`
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