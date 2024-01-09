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

// Fungsi untuk menampilkan laporan pengguna terbaru dalam bentuk kartu tanpa pengurutan
const latestDisplayReportData = (reportData, cardContainerId, category) => {
    const latestCardContainer = document.getElementById(cardContainerId);

    if (!latestCardContainer) {
        console.error(`Error: Element with ID "${cardContainerId}" not found.`);
        return;
    }

    latestCardContainer.innerHTML = "";

    if (reportData && reportData.length > 0) {
        const latestReport = reportData[reportData.length - 1];

        // Memastikan bahwa latestReport dan latestReport.category terdefinisi sebelum mengakses propertinya
        const badgeCategory =
            category === "Unsafe Action"
                ? "danger"
                : category === "Compromised Action"
                    ? "warning"
                    : "";

        const badgeIcon =
            category === "Unsafe Action"
                ? "fa-exclamation-triangle"
                : category === "Compromised Action"
                    ? "fa-child"
                    : "";

        const categoryBadge = `<span class="badge bg-${badgeCategory} text-white font-10 mb-1 d-block rounded-s">
            <i class="fa ${badgeIcon}"></i> ${category}
        </span>`;

        const statusBadge = `<span class="badge ${
            latestReport.status === "Opened"
                ? "bg-green-dark"
                : category === "Compromised Action"
                    ? "bg-red-dark"
                    : ""
        } text-white font-10 mb-1 d-block rounded-s">${latestReport.status}</span>`;

        // Memastikan bahwa properti yang akan diakses tersedia sebelum mengaksesnya
        const locationName =
            latestReport && latestReport.location
                ? latestReport.location.locationName
                : "Lokasi Tidak Diketahui";

        // Menangani properti yang mungkin undefined
        const typeName =
            (latestReport &&
                latestReport.typeDangerousActions &&
                latestReport.typeDangerousActions.length > 0 &&
                latestReport.typeDangerousActions[0].typeName) ||
            "Jenis Tidak Diketahui";

        const userName =
            (latestReport && latestReport.user && latestReport.user.nama) ||
            "Pengguna Tidak Diketahui";

        // Sesuaikan struktur kartu dengan data yang Anda miliki
        const newCard = document.createElement("div");
        newCard.className = "card card-style mb-3";
        newCard.id = `card-${category.toLowerCase()}-${latestReport.index + 1}`;

        newCard.innerHTML = `
            <div class="content">
                <div class="d-flex">
                    <div>
                        <h4>${latestReport.reportid}</h4>
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
                        <p class="color-highlight font-11"><i class="far fa-calendar"></i> ${latestReport.date} <i class="ms-4 far fa-clock"></i> ${latestReport.time}</p>
                    </div>
                </div>
            </div>
          `;

        // Tambahkan kartu terbaru ke awal kontainer laporan
        latestCardContainer.prepend(newCard);
    } else {
        latestCardContainer.innerHTML = "<p>No latestReport data found.</p>";
    }
};

const getLatestReport = async () => {
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
        return;
    }

    const reportUrls = [
        {
            url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser",
            category: "Unsafe Action",
        },
        {
            url: "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromisedbyUser",
            category: "Compromised Action",
        },
    ];

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    try {
        const responses = await Promise.all(
            reportUrls.map(async ({ url, category }) => {
                const response = await fetch(url, requestOptions);
                return { category, data: await response.json() };
            })
        );

        // Menggabungkan data dari kedua kategori
        const allData = responses.reduce((acc, { category, data }) => {
            if (Array.isArray(data)) {
                acc.push(...data.map(report => ({ category, report })));
            } else {
                console.error(`Error: Invalid data structure for category ${category}`);
            }
            return acc;
        }, []);

        // Mengurutkan data berdasarkan waktu pembuatan (gunakan properti yang sesuai)
        allData.sort((a, b) => {
            const timeA = new Date(`${a.report.date} ${a.report.time}`);
            const timeB = new Date(`${b.report.date} ${b.report.time}`);
            return timeB - timeA; // Urutkan dari yang terbaru
        });

        // Menampilkan informasi detail laporan terakhir dari kategori yang sesuai
        const latestData = allData.reduce((acc, { category, report }) => {
            if (!acc[category]) {
                acc[category] = report;
            }
            return acc;
        }, {});

        // Tampilkan informasi detail laporan
        Object.keys(latestData).forEach(category => {
            latestDisplayReportData([latestData[category]], "latestCardContainer", category);
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

// Panggil fungsi untuk mendapatkan dan menampilkan laporan terbaru
getLatestReport();
