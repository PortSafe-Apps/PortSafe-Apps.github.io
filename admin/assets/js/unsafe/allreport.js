const reportDataBody = document.querySelector("#datatablesSimple tbody");

const showAlert = (message, type) => {
    Swal.fire({
        icon: type,
        title: "Gagal",
        text: message,
    });
};

const getTokenFromCookies = (cookieName) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === cookieName) {
            return value;
        }
    }
    return null;
};

const getUnsafeReports = async (locationName) => {
    try {
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

        const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportUnsafe";

        const myHeaders = new Headers();
        myHeaders.append("Login", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            body: JSON.stringify({ locationName: locationName }) // Add locationName filter to the request body
        };

        const response = await fetch(targetURL, requestOptions);
        const data = await response.json();

        if (data.status === 200) {
            displayReportData(data.data, reportDataBody);
        } else {
            showAlert(data.message, "error");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const displayReportData = (data, reportDataBody) => {
    try {
        if (reportDataBody) {
            reportDataBody.innerHTML = "";

            if (data && data.length > 0) {
                data.forEach((report) => {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${report.reportid}</td>
                        <td>${report.date}</td>
                        <td>${report.time}</td>
                        <td>${report.location.locationName}</td>
                        <td>${report.area.areaName}</td>
                        <td>
                            <button class="btn btn-datatable btn-icon btn-transparent-dark detail-link" data-reportid="${report.reportid}" data-action="detailReport"><i data-feather="eye"></i></button>
                            <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-reportid="${report.reportid}" data-action="deleteReport"><i data-feather="trash-2"></i></button>
                        </td>
                    `;
                    reportDataBody.appendChild(newRow);
                });
            } else {
                const emptyRow = document.createElement("tr");
                emptyRow.innerHTML = '<td colspan="6">No report data found.</td>';
                reportDataBody.appendChild(emptyRow);
            }

            feather.replace();
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("pusatLink").addEventListener("click", function() {
    filterReportsByLocation("Kantor Pusat SPMT");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("dumaiLink").addEventListener("click", function() {
    filterReportsByLocation("Branch Dumai");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("belawanLink").addEventListener("click", function() {
    filterReportsByLocation("Branch Belawan");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("tjintanLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Tanjung Intan");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("bumiharjoLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Bumiharjo - Bagendang");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("tjwangiLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Tanjung Wangi");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("makassarLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Makassar");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("balikpapanLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Balikpapan");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("trisaktiLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Trisakti - Mekar Putih");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("jamirahLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Jamrud Nilam Mirah");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("lembarbdsLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Lembar - Badas");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("tjemasLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Tanjung Emas");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("parongLink").addEventListener("click", function() {
  filterReportsByLocation("Branch ParePare - Garongkong");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("lhokseumaweLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Lhokseumawe");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("malahayatiLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Malahayati");
});

// Tambahkan event listener untuk setiap tautan branch
document.getElementById("gresikLink").addEventListener("click", function() {
  filterReportsByLocation("Branch Gresik");
});

function filterReportsByLocation(locationName) {
  getUnsafeReports(locationName);
}

  const deleteUnsafe = async (reportid) => {
    const token = getTokenFromCookies('Login');
  
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
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteReportUnsafe';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({ reportid: reportid }),
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Report deleted successfully!',
        }).then(() => {
          getUnsafeReports();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
const detailUnsafe = (reportid) => {
  window.location.href = `https://portsafe-apps.github.io/admin/detailunsafe.html?reportid=${reportid}`;
};

const deleteUnsafeHandler = (reportid) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUnsafe(reportid);
    }
  });
};

document.getElementById("datatablesSimple").addEventListener("click", (event) => {
    const target = event.target;
    const detailButton = target.closest("[data-action='detailReport']");
    const deleteButton = target.closest("[data-action='deleteReport']");

    if (detailButton) {
      const reportid = detailButton.getAttribute("data-reportid");
      detailUnsafe(reportid);
    } else if (deleteButton) {
      const reportid = deleteButton.getAttribute("data-reportid");
      deleteUnsafeHandler(reportid);
    }
  });

// Initial call to get all reports when the page loads
getUnsafeReports();
