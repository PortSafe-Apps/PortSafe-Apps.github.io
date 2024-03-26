const compromisedDataBody = document.querySelector("#datatablesSimple tbody");

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

const getCompromisedReports = async () => {
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

    const targetURL =
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised";

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      displayCompromisedData(data.data, compromisedDataBody);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayCompromisedData = (data, compromisedDataBody) => {
  try {
    if (compromisedDataBody) {
      compromisedDataBody.innerHTML = "";

      if (data && data.length > 0) {
        data.forEach((compromised) => {
          if (compromised.location && compromised.location.locationName === "Branch Bumiharjo - Bagendang") {

            const newRow = document.createElement("tr");

            // Set badge background color based on status
            const badgeBgColor =
              compromised.status === "opened" ? "bg-warning" : "bg-success";

            newRow.innerHTML = `
            <td>${compromised.reportid}</td>
            <td>${compromised.date}</td>
            <td>${compromised.time}</td>
            <td>${compromised.location.locationName}</td>
            <td>${compromised.area.areaName}</td>
            <td><div class="badge ${badgeBgColor} text-white rounded-pill">${compromised.status}</div></td>
            <td>
                <button class="btn btn-datatable btn-icon btn-transparent-dark detail-link" data-reportid="${compromised.reportid}" data-action="detailCompromised"><i data-feather="eye"></i></button>
                <button class="btn btn-datatable btn-icon btn-transparent-dark edit-link" data-reportid="${compromised.reportid}" data-action="editCompromised"><i data-feather="edit"></i></button>
                <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-reportid="${compromised.reportid}" data-action="deleteCompromised"><i data-feather="trash-2"></i></button>
            </td>
          `;

            compromisedDataBody.appendChild(newRow);
          }
        });
      } else {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = '<td colspan="7">No report data found.</td>';
        compromisedDataBody.appendChild(emptyRow);
      }

      feather.replace();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const deleteCompromised = async (reportid) => {
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

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteReportCompromised';

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
        getCompromisedReports();
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

const detailCompromised = (reportid) => {
  window.location.href = `https://portsafe-apps.github.io/admin/detailcompromised.html?reportid=${reportid}`;
};

const editCompromised = (reportid) => {
  window.location.href = `https://portsafe-apps.github.io/admin/updatecompromised.html?reportid=${reportid}`;
};

const deleteCompromisedHandler = (reportid) => {
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
      deleteCompromised(reportid);
    }
  });
};

document
  .getElementById("datatablesSimple")
  .addEventListener("click", (event) => {
    const target = event.target;
    const detailButton = target.closest("[data-action='detailCompromised']");
    const editButton = target.closest("[data-action='editCompromised']");
    const deleteButton = target.closest("[data-action='deleteCompromised']");

    if (detailButton) {
      const reportid = detailButton.getAttribute("data-reportid");
      detailCompromised(reportid);
    } else if (editButton) {
      const reportid = editButton.getAttribute("data-reportid");
      editCompromised(reportid);
    } else if (deleteButton) {
      const reportid = deleteButton.getAttribute("data-reportid");
      deleteCompromisedHandler(reportid);
    }
  });

// Initial call to get all report when the page loads
getCompromisedReports();
