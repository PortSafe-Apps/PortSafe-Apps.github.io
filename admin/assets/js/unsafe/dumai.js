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

const getUnsafeReports = async () => {
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
                    console.log(report); // Tambahkan log ini untuk memeriksa struktur objek report
                    if (report.location && report.location.locationName === "Branch Dumai") {
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                            <td>${report.reportid}</td>
                            <td>${report.date}</td>
                            <td>${report.time}</td>
                            <td>${report.area.areaName}</td>
                            <td>${report.location.locationName}</td>
                            <td>
                                <button class="btn btn-datatable btn-icon btn-transparent-dark detail-link" data-reportid="${report.reportid}" data-action="detailReport"><i data-feather="eye"></i></button>
                                <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-reportid="${report.reportid}" data-action="deleteReport"><i data-feather="trash-2"></i></button>
                            </td>
                        `;
                        reportDataBody.appendChild(newRow);
                    }
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
