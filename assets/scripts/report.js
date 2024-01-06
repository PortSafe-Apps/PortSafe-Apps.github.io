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

// Fungsi untuk mendapatkan laporan berdasarkan kategori
const getUserReportsByCategory = async (url, category) => {
    const token = getTokenFromCookies("Login");

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Error Autentikasi",
            text: "Anda belum login!",
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
        const response = await fetch(url, requestOptions);

        if (response.ok) {
            const responseData = await response.json();

            if (responseData.status === 200) {
                // Menggunakan responseData.data sebagai data laporan
                const data = responseData.data;
                // Memproses dan menampilkan data laporan dalam tab
                processReportData(data, category);
            } else {
                console.error("Respon server:", responseData.message || "Data tidak dapat ditemukan");
            }
        } else {
            console.error("Kesalahan HTTP:", response.status);
        }
    } catch (error) {
        console.error("Error:", error.message || "Terjadi kesalahan yang tidak diketahui");
    }
};

// Fungsi untuk memproses dan menampilkan data laporan dalam tab
const processReportData = (data, category) => {
    // Menyesuaikan struktur HTML sesuai dengan kebutuhan
    const tabContainerId = "tab-controls";
    const cardContainerId = "cardContainer";

    // Memeriksa apakah tab untuk kategori sudah ada
    const existingTab = document.querySelector(`#${tabContainerId} a[data-category="${category}"]`);
    if (!existingTab) {
        // Jika tab belum ada, membuat tab baru dan menampilkan laporan
        createTabAndDisplayReports(category, tabContainerId, cardContainerId);
    } else {
        // Jika tab sudah ada, mengambil data baru dan memperbarui tab yang ada
        fetchDataAndCreateCards(data, category);
    }
};

// Fungsi untuk membuat kartu laporan
const createReportCard = (report, category) => {
    const newCard = document.createElement("div");
    newCard.className = "card card-style";

    // Menambahkan badge status untuk kategori "Compromised Action"
    const statusBadge = category === "Compromised Action" ? `<span class="badge bg-green-dark color-white font-10 mb-1 d-block rounded-s">${report.status}</span>` : "";

    // Memastikan bahwa properti yang akan diakses tersedia sebelum mengaksesnya
    const locationName = report.location ? report.location.locationName : "Unknown Location";
    const typeName = report.typeDangerousActions && report.typeDangerousActions.length > 0 &&
        report.typeDangerousActions[0].subTypes && report.typeDangerousActions[0].subTypes.length > 0 &&
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
                  <p class="color-highlight mt-n1 font-12"><i class="fa fa-map-marker-alt"></i>${locationName}</p>
              </div>
              <div class="ms-auto align-self-center">
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
const createTabAndDisplayReports = async (category, tabContainerId, cardContainerId) => {
    let targetURL;
    if (category === "Unsafe Action") {
        targetURL =
            "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser";
    } else if (category === "Compromised Action") {
        targetURL =
            "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser";
    } else {
        console.error("Kategori tidak valid:", category);
        return;
    }

    try {
        const response = await fetch(targetURL);
        const data = await response.json();

        const tabContainer = document.getElementById(tabContainerId);
        const cardContainer = document.getElementById(cardContainerId);

        // Membuat tab
        const tabLink = document.createElement("a");
        tabLink.href = "#";
        tabLink.dataset.bsToggle = "collapse";
        tabLink.dataset.bsTarget = `#tab-${category.replace(/\s+/g, '-').toLowerCase()}`; // Menyesuaikan id tab
        tabLink.innerHTML = category;
        tabLink.classList.add("nav-link"); // Menambahkan kelas nav-link untuk tautan tab
        tabLink.dataset.category = category; // Menambahkan dataset untuk kategori
        tabContainer.appendChild(tabLink);

        // Membuat card container
        const cardCollapse = document.createElement("div");
        cardCollapse.className = "collapse";
        cardCollapse.id = `tab-${category.replace(/\s+/g, '-').toLowerCase()}`; // Menyesuaikan id tab
        cardContainer.appendChild(cardCollapse);

        // Menambahkan kelas "show" ke tab pertama untuk menampilkannya secara otomatis
        if (tabContainer.children.length === 1) {
            tabLink.classList.add("show");
            cardCollapse.classList.add("show");
        }

        // Menampilkan laporan dalam card container
        if (Array.isArray(data)) {
            data.forEach(report => {
                const newCard = createReportCard(report, category);
                cardCollapse.appendChild(newCard);
            });
        } else if (data && typeof data === "object") {
            // Jika data adalah objek, membuat satu card
            const newCard = createReportCard(data, category);
            cardCollapse.appendChild(newCard);
        } else {
            console.error("Format data tidak didukung:", data);
        }
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
};

// Fungsi untuk memanggil fungsi createTabAndDisplayReports sesuai dengan kategori
const fetchDataAndCreateCards = async (data, category) => {
    const tabContainerId = "tab-controls";
    const cardContainerId = "cardContainer";
    createTabAndDisplayReports(category, tabContainerId, cardContainerId);
};

// Fungsi untuk memulai aplikasi
const startApp = async () => {
    // Mengganti kategori yang diinginkan (Unsafe Action atau Compromised Action)
    const category = "Unsafe Action";
    // URL yang sesuai dengan kategori yang dipilih
    const url =
        category === "Unsafe Action"
            ? "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser"
            : "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser";

    // Memanggil fungsi untuk mendapatkan dan menampilkan laporan
    getUserReportsByCategory(url, category);
};

// Memanggil fungsi untuk memulai aplikasi
startApp();
