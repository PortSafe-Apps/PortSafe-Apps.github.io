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

// Fungsi untuk mendapatkan laporan detail dan navigasi ke halaman baru saat card diklik
const getDetailedReport = async (reportid, detailContainerId) => {
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

  const targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/oneReport-1";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ reportid }), // Pass reportid in the request body
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);

    if (response.ok) {
      const data = await response.json();

      if (data.status === 200) {
        displayDetailedReport(data.data, detailContainerId);
      } else {
        console.error(
          "Server response:",
          data.message || "Data tidak dapat ditemukan"
        );
      }
    } else {
      console.error("HTTP error:", response.status);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};

// Fungsi untuk menampilkan informasi detail laporan ke dalam HTML
const displayDetailedReport = (detailedReport, detailContainerId) => {
  const detailContainer = document.getElementById(detailContainerId);

  if (!detailContainer) {
    console.error(`Error: Element with ID "${detailContainerId}" not found.`);
    return;
  }

  detailContainer.innerHTML = "";

  if (detailedReport) {
    const detailCard = document.createElement("div");
    detailCard.className = "card";
    detailCard.innerHTML = `
    <div class="card-body">
      <h6 class="mb-0">Nomor Pelaporan</h6>
      <p>${detailedReport.reportid}</p>

      <h6 class="mb-0">Tanggal Pelaporan</h6>
      <p>${detailedReport.date}</p>

      <h6 class="mb-0">Informasi Pengawas</h6>
      <p class="mb-0">${detailedReport.user.nama}</p>
      <p>${detailedReport.user.jabatan}</p>

      <h6 class="mb-0">Lokasi Kejadian</h6>
      <p>${detailedReport.location.locationName}</p>

      <h6 class="mb-0">Deskripsi Pengamatan</h6>
      <p>${detailedReport.description}</p>

      <h6>Foto Kejadian</h6>
      <div class="text-center">
        <img class="w-75 mb-4" src="${detailedReport.observationPhoto}" alt="Foto Kejadian">
      </div>

      <h6 class="mb-0">Tindakan Berbahaya yang Dilakukan</h6>
      <ul class="ps-0 fs-6">
        ${detailedReport.typeDangerousActions
          .map(
            (action, index) => {
              const groupedSubTypes = detailedReport.typeDangerousActions
                .filter(item => item.typeName === action.typeName)
                .flatMap(item => item.subTypes)
                .filter((value, index, self) => self.indexOf(value) === index);

              return `
                <li>${getPrefix(detailedReport.typeDangerousActions, action, index)} ${action.typeName}
                  ${groupedSubTypes.length > 1 ? '<ul class="ps-3">' : ''}
                    ${groupedSubTypes
                      .map(
                        (subType) => `
                        <li>${getPrefix(groupedSubTypes, subType)} ${subType}</li>
                      `
                      )
                      .join("")}
                  ${groupedSubTypes.length > 1 ? '</ul>' : ''}
                </li>
              `;
            }
          )
          .join("")}
      </ul>

      <h6 class="mb-0">Area</h6>
      <p>${detailedReport.area.areaName}</p>

      <h6 class="mb-0">Tindakan Perbaikan Segera</h6>
      <p>${detailedReport.immediateAction}</p>

      <h6>Foto Tindakan Perbaikan</h6>
      <div class="text-center">
        <img class="w-75 mb-4" src="${detailedReport.improvementPhoto}" alt="Foto Tindakan Perbaikan">
      </div>

      <h6 class="mb-0">Tindakan Pencegahan Terulang Kembali</h6>
      <p>${detailedReport.correctiveAction}</p>
    </div>
  `;
    detailContainer.appendChild(detailCard);
  } else {
    detailContainer.innerHTML = "<p>Informasi detail tidak ditemukan.</p>";
  }
};

// Fungsi untuk mendapatkan prefix (angka atau dash) berdasarkan elemen sebelumnya
function getPrefix(array, _, currentIndex) {
  if (currentIndex > 0) {
    const previousItem = array[currentIndex - 1];
    if (previousItem.subTypes) {
      return `<span>${currentIndex + 1}.</span>`;
    }
  }
  return "";
}

// Fungsi untuk mendapatkan semua laporan pengguna dengan token
const getAllUserReport = async () => {
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

  const targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);

    if (response.ok) {
      const data = await response.json();

      if (data.status === 200) {
        displayReportData(data.data, "reportContainer");
      } else {
        console.error(
          "Server response:",
          data.message || "Data tidak dapat ditemukan"
        );
      }
    } else {
      console.error("HTTP error:", response.status);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.message || "Terjadi kesalahan yang tidak diketahui"
    );
  }
};

// Fungsi untuk menampilkan semua laporan pengguna dalam bentuk kartu tanpa pengurutan
const displayReportData = (reportData, cardContainerId) => {
  const reportContainer = document.getElementById(cardContainerId);

  if (!reportContainer) {
    console.error(`Error: Element with ID "${cardContainerId}" not found.`);
    return;
  }

  reportContainer.innerHTML = "";

  if (reportData && reportData.length > 0) {
    for (const report of reportData) {
      const newCard = document.createElement("div");
      newCard.className = "card timeline-card bg-dark";
      newCard.innerHTML = `
      <div class="card-body">
      <div class="d-flex justify-content-between">
        <div class="timeline-text mb-2">
          <h6 class="element-heading fw-bolder">${report.reportid}</h6>
          <span>${report.location.locationName}</span>
        </div>
        <div class="timeline-text mb-2">
          <span class="badge mb-2 rounded-pill bg-dark">${report.date}</span>
        </div>
      </div>
      <div class="divider mt-0"></div>
      <div class="text-content mb-2">
        <h6 class="mb-0">Jenis Ketidaksesuaian</h6>
        <div class="timeline-tags">
        ${report.typeDangerousActions
          .reduce((accumulator, action) => {
            const existingBadge = accumulator.find(
              (badge) => badge.typeName === action.typeName
            );
  
            if (!existingBadge) {
              accumulator.push({
                typeName: action.typeName,
              });
            }
  
            return accumulator;
          }, [])
          .map(
            (badge) =>
              `<span class="badge bg-light text-dark">${badge.typeName}</span>`
          )
          .join("")}
        </div>
      </div>
      <div class="text-content mb-0">
        <h6 class="mb-0">Pengawas</h6>
        <span class="fw-normal">${report.user.nama}</span> <br> <span class="fw-normal">${report.user.jabatan}</span>
      </div>
    </div>
  `;
      newCard.addEventListener("click", () => {
        window.location.href = `https://portsafe-apps.github.io/pages/user/detailreport.html?reportid=${report.reportid}`;
      });

      reportContainer.prepend(newCard);
    }
  } else {
    reportContainer.innerHTML = "<p>No report data found.</p>";
  }
};

// Panggil fungsi untuk mendapatkan dan menampilkan laporan pengguna
getAllUserReport();

// ID elemen target di halaman list report
const cardContainerId = "reportContainer";

// ID elemen target di halaman detail report
const detailContainerId = "detailContainer";

// Ambil reportid dari parameter query
const reportid = new URLSearchParams(window.location.search).get("reportid");

// Panggil fungsi getDetailedReport untuk mendapatkan dan menampilkan laporan detail
if (reportid) {
  getDetailedReport(reportid, detailContainerId);
}
