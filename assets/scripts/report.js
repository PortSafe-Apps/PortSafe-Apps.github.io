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
    const tabContainer = document.getElementById("tab-container");
    const tabControlsContainer = document.getElementById("tab-controls");

    // Membuat card container
    const cardCollapse = document.createElement("div");
    cardCollapse.className = "collapse";
    cardCollapse.id = `tab-${category.toLowerCase().replace(" ", "-")}`;

    // Menampilkan laporan dalam card container
    data.forEach(report => {
        const newCard = createReportCard(report, category);
        cardCollapse.appendChild(newCard);
    });

    // Menambahkan card container ke tab content
    tabContainer.appendChild(cardCollapse);

    // Membuat tab link
    const tabLink = document.createElement("a");
    tabLink.href = "#";
    tabLink.dataset.bsToggle = "collapse";
    tabLink.dataset.bsTarget = `#tab-${category.toLowerCase().replace(" ", "-")}`;
    tabLink.innerHTML = category;

    // Menambahkan tab link ke tab controls
    tabControlsContainer.appendChild(tabLink);
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
    const typeName =
    report.typeDangerousActions &&
    report.typeDangerousActions.length > 0 &&
    report.typeDangerousActions[0].subTypes &&
    report.typeDangerousActions[0].subTypes.length > 0
        ? report.typeDangerousActions[0].subTypes.map((subType) => subType.typeName).join(", ")
        : "Unknown Type";
    const userName = report.user ? report.user.nama : "Unknown User";
    const time = report.time ? report.time : "Unknown Time";

    // Sesuaikan struktur kartu dengan data yang Anda miliki
    newCard.innerHTML = `
        <div class="content">
            <div class="d-flex">
                <div>
                    <h4>${report.reportid}</h4>
                    <p class="color-highlight mt-n1 font-12"><i class="fa fa-map-marker-alt"></i> ${locationName}</p>
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
                    <p class="color-highlight font-11"><i class="far fa-calendar"></i> ${report.date} <i class="ms-4 far fa-clock"></i> ${time}</p>
                </div>
            </div>
        </div>
    `;

    return newCard;
};

// Fungsi untuk membuat tab controls
const createTabControls = () => {
    const tabControlsContainer = document.getElementById("tab-controls");

    // Tambahkan tab controls sesuai dengan kategori
    const categories = ["Unsafe Action", "Compromised Action"];
    categories.forEach((category, index) => {
        const tabLink = document.createElement("a");
        tabLink.href = "#";
        tabLink.dataset.bsToggle = "collapse";
        tabLink.dataset.bsTarget = `#tab-${category.toLowerCase().replace(" ", "-")}`;
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
