const unsafeDataBody = document.querySelector("#datatablesSimple tbody");

const showAlert = (message, type, additionalInfo = "", callback) => {
  console.log(message, type, additionalInfo);
  if (typeof callback === "function") {
    callback();
  }
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

const getUnsafeWithToken = async () => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      showAlert("Kamu Belum Login!", "warning", "", () => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return;
    }

    const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport";

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      displayUnsafeData(data.data, unsafeDataBody);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayUnsafeData = (unsafeData, unsafeDataBody) => {
  try {
    if (unsafeDataBody) {
      unsafeDataBody.innerHTML = "";

      if (unsafeData && unsafeData.length > 0) {
        unsafeData.forEach((unsafe) => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${unsafe.reportid}</td>
            <td>${unsafe.date}</td>
            <td>${unsafe.time}</td>
            <td>${unsafe.location.locationName}</td>
            <td>${unsafe.area.areaName}</td>
            <td>
                <button class="btn btn-datatable btn-icon btn-transparent-dark detail-link" data-reportid="${unsafe.reportid}" data-action="detailUnsafe"><i data-feather="external-link"></i></button>
                <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-reportid="${unsafe.reportid}" data-action="deleteUnsafe"><i data-feather="trash-2"></i></button>
            </td>
          `;
          compromisedDataBody.appendChild(newRow);
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

const deleteUnsafe = async (nipp) => {
  const token = getTokenFromCookies("Login");

  if (!token) {
    showAlert("Authentication Error", "warning", "You are not logged in.", () => {
      window.location.href = "https://portsafe-apps.github.io/admin/unsafereport.html";
    });
    return;
  }

  const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteReportUnsafe";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: JSON.stringify({ nipp: nipp }),
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      showAlert("Success", "success", "Report deleted successfully!", () => {
        getAllUnsafe(); // 
      });
    } else {
      showAlert("Error", "error", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const detailUnsafe = (reportid) => {
  window.location.href = `https://portsafe-apps.github.io/admin/detailreport.html?reportid=${reportid}`;
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
  const detailButton = target.closest("[data-action='detailUnsafe']");
  const deleteButton = target.closest("[data-action='deleteUnsafe']");

  if (detailButton) {
    const reportid = detailButton.getAttribute("data-reportid");
    detailUnsafe(reportid);
  } else if (deleteButton) {
    const reportid = deleteButton.getAttribute("data-reportid");
    deleteUnsafeHandler(reportid);
  }
});

// Initial call to get all report when the page loads
getUnsafeWithToken();
