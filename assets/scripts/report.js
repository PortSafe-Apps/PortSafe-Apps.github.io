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
    const tabContainerId = "tab-container";

    // Membuat tab baru dan menampilkan laporan
    createTabAndDisplayReports(data, category, tabContainerId);
};

// Fungsi untuk membuat kartu laporan
const createReportCard = (report, category) => {
    const newCard = document.createElement("div");
    newCard.className = "card card-style";

    // Menambahkan badge status untuk kategori "Compromised Action"
    const statusBadge = category === "Compromised Action" ?
        `<span class="badge bg-green-dark color-white font-10 mb-1 d-block rounded-s">${report.status}</span>` : "";

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
const createTabAndDisplayReports = async (data, category, tabContainerId) => {
    const tabContainer = document.getElementById(tabContainerId);

    // Membuat tab controls
    const tabControlsContainer = document.createElement("div");
    tabControlsContainer.className = "rounded-m overflow-hidden mx-3";

    const tabControls = document.createElement("div");
    tabControls.className = "tab-controls tabs-large tabs-rounded";
    tabControls.dataset.highlight = "bg-dark-dark";

    // Menambahkan tab controls sesuai dengan kategori
    const tabLinks = [];
    const tabContents = [];
    data.forEach((report, index) => {
        const tabContentId = `tab-${index + 1}`;

        // Membuat tab link
        const tabLink = document.createElement("a");
        tabLink.href = "#";
        tabLink.dataset.bsToggle = "collapse";
        tabLink.dataset.bsTarget = `#${tabContentId}`;
        tabLink.innerHTML = category; // Menggunakan category dari data
        if (index === 0) {
            tabLink.dataset.active = true;
        }
        tabControls.appendChild(tabLink);
        tabLinks.push(tabLink);

        // Membuat tab content
        const tabContent = document.createElement("div");
        tabContent.className = "collapse";
        tabContent.id = tabContentId;

        const cardContainer = document.createElement("div");
        cardContainer.className = "mt-3";

        // Menampilkan laporan dalam card container
        const newCard = createReportCard(report, category);
        cardContainer.appendChild(newCard);
        tabContent.appendChild(cardContainer);
        tabContents.push(tabContent);
    });

    tabControlsContainer.appendChild(tabControls);
    tabContainer.appendChild(tabControlsContainer);

    // Menambahkan tab contents ke tabContainer
    tabContents.forEach(tabContent => {
        tabContainer.appendChild(tabContent);
    });
};

// Fungsi untuk membuat tab controls
const createTabControls = () => {
    const tabContainerId = "tab-container";
    const tabControlsContainer = document.getElementById(tabContainerId);

    // Tambahkan tab controls sesuai dengan kategori
    const categories = ["Unsafe Action", "Compromised Action"];
    categories.forEach((category, index) => {
        const tabLink = document.createElement("a");
        tabLink.href = "#";
        tabLink.dataset.bsToggle = "collapse";
        tabLink.dataset.bsTarget = `#tab-${index + 1}`;
        tabLink.innerHTML = category;
        if (index === 0) {
            tabLink.dataset.active = true;
        }
        tabControlsContainer.appendChild(tabLink);
    });
};

// Memanggil fungsi untuk membuat tab controls
createTabControls();

// Memanggil fungsi untuk mendapatkan laporan berdasarkan kategori "Unsafe Action"
getUserReportsByCategory("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser", "Unsafe Action");

// Memanggil fungsi untuk mendapatkan laporan berdasarkan kategori "Compromised Action"
getUserReportsByCategory("https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser", "Compromised Action");