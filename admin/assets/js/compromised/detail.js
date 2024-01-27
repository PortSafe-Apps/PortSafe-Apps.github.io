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

const showAlert = (message, type = "success") => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    window.location.href =
      "https://portsafe-apps.github.io/user/compromisedreport.html";
  });
};

const searchCompromisedByReportid = async (reportid) => {
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
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getOneReportCompromised";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ reportid: reportid }),
    redirect: "follow",
  };
  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      displayDetail(data.data);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayDetail = (data) => {
  const displayValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = value;
    } else {
      console.error(`Element with ID "${id}" not found.`);
    }
  };

  // Adjust badge color based on status
  const statusBadge = document.getElementById("statusBadge");
  if (statusBadge) {
    statusBadge.innerText = data.status;
    if (data.status.toLowerCase() === "closed") {
      statusBadge.classList.remove("bg-danger");
      statusBadge.classList.add("bg-success");
    }
  } else {
    console.error('Element with ID "statusBadge" not found.');
  }

  displayValue("noPelaporan", data.reportid);
  displayValue("tanggal", data.date);
  displayValue("waktu", data.time);
  displayValue("pengawas", `${data.user.nama} - ${data.user.jabatan}`);
  displayValue("jabatan", data.user.jabatan);
  displayValue("unitKerja", data.location.locationName);
  displayValue("area", data.area.areaName);

  const descriptionElement = document.getElementById("deskripsiPengamatan");
  if (descriptionElement) {
    descriptionElement.innerText = data.description;
  } else {
    console.error('Element with ID "deskripsiPengamatan" not found.');
  }

  const imageElement = document.getElementById("observasiPhoto");
  if (imageElement) {
    imageElement.src = data.observationPhoto;
  } else {
    console.error('Element with ID "observasiPhoto" not found.');
  }

  const accordionBody = document.getElementById("accordionBody");

  if (accordionBody) {
    accordionBody.innerHTML = "";

    data.typeDangerousActions.forEach((type, index) => {
      const subTypesHtml = type.subTypes
        .map((subType) => `<span class="badge bg-danger">${subType}</span>`)
        .join("");

      accordionBody.innerHTML += `<div class="accordion-item">
                                  <h2 class="accordion-header" id="flush-heading${index}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
                                      ${type.typeName}
                                    </button>
                                  </h2>
                                  <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">${subTypesHtml}</div>
                                  </div>
                                </div>`;
    });
  } else {
    console.error('Element with ID "accordionBody" not found.');
  }

  const immediateElement = document.getElementById("tindakanPerbaikanSegera");
  if (immediateElement) {
    immediateElement.innerText = data.immediateAction;
  } else {
    console.error('Element with ID "tindakanPerbaikanSegera" not found.');
  }

  const improvementElement = document.getElementById("improvementPhoto");
  if (improvementElement) {
    improvementElement.src = data.improvementPhoto;
  } else {
    console.error('Element with ID "improvementPhoto" not found.');
  }

  const recomendationElement = document.getElementById("rekomendasi");
  if (recomendationElement) {
    recomendationElement.innerText = data.recomendation;
  } else {
    console.error('Element with ID "rekomendasi" not found.');
  }

  const tindakLanjutElement = document.getElementById("TindakLanjut");
  if (tindakLanjutElement) {
    tindakLanjutElement.innerText = data.ActionDesc;
  } else {
    console.error('Element with ID "TindakLanjut" not found.');
  }

  const evidenceElement = document.getElementById("evidencePhoto");
  if (evidenceElement) {
    evidenceElement.src = data.EvidencePhoto;
  } else {
    console.error('Element with ID "evidencePhoto" not found.');
  }
};

// const accordionBody = document.getElementById("accordionBody");
// console.log("Accordion Body:", accordionBody); // Add this line for debugging

// if (!accordionBody) {
//     console.error('Element with ID "accordionBody" not found.');
//     return;
// }

const reportIdFromURL = new URLSearchParams(window.location.search).get(
  "reportid"
);
if (reportIdFromURL) {
  document.getElementById("noPelaporan").innerText = reportIdFromURL;
  searchCompromisedByReportid(reportIdFromURL);
}
