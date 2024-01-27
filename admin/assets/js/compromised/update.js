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
      populateForm(data.data);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const populateForm = (data) => {
  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = value;
    } else {
      console.error(`Element with ID "${id}" not found.`);
    }
  };

  setValue("noPelaporan", data.reportid);
  setValue("tanggal", data.date);
  setValue("waktu", data.time);
  setValue("pengawas", `${data.user.nama}`);
  setValue("jabatan", data.user.jabatan);
  setValue("unitKerja", data.location.locationName);
  setValue("area", data.area.areaName);

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
      const subTypesHtml = type.subTypes.map((subType) => `<span class="badge bg-danger">${subType}</span>`).join("");

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
    console.error('Element with ID "Tindakan Pencegahan Segera" not found.');
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

  const tindakLanjutTextarea = document.getElementById("TindakLanjut");
  if (tindakLanjutTextarea) {
    tindakLanjutTextarea.value = data.ActionDesc || "";
  } else {
    console.error('Element with ID "TindakLanjut" not found.');
  }
  const hasilTindakLanjut = document.getElementById("hasilFotoTindakLanjut");
  if (hasilTindakLanjut) {
    hasilTindakLanjut.value = data.EvidencePhoto || "";
  } else {
    console.error('Element with ID "hasilTindakLanjut" not found.');
  }
};

const updateCompromised = async (event, reportid) => {
  event.preventDefault();

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

  const EvidencePhotoUrl = document.getElementById("hasilFotoTindakLanjut").src;

  const targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/UpdateReportCompromised";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      reportid: reportid,
      date: document.getElementById("tanggal").innerText,
      time: document.getElementById("waktu").innerText,
      user: {
        nipp: document.getElementById("nipp").innerText,
        nama: document.getElementById("pengawas").innerText,
        jabatan: document.getElementById("jabatan").innerText,
        location: {
          locationName: document.getElementById("unitKerja").innerText,
        },
      },
      location: {
        locationName: document.getElementById("unitKerja").innerText,
      },
      area: {
        areaName: document.getElementById("area").innerText,
      },
      description: document.getElementById("deskripsiPengamatan").innerText,
      observationPhoto: document.getElementById("observasiPhoto").src,
      typeDangerousActions: [],
      immediateAction: document.getElementById("tindakanPerbaikanSegera")
        .innerText,
      improvementPhoto: document.getElementById("improvementPhoto").src,
      recomendation: document.getElementById("rekomendasiText").innerText,
      ActionDesc: document.getElementById("TindakLanjut").value,
      EvidencePhoto: EvidencePhotoUrl,
    }),
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      showAlert("Berhasil Update Data Report", "success");
      window.location.href =
        "https://portsafe-apps.github.io/admin/compromisedreport.html";
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

document.getElementById("compromisedForm").style.display = "block";
// const accordionBody = document.getElementById("accordionBody");
// console.log("Accordion Body:", accordionBody); // Add this line for debugging

// if (!accordionBody) {
//   console.error('Element with ID "accordionBody" not found.');
//   return;
// }

const reportIdFromURL = new URLSearchParams(window.location.search).get(
  "reportid"
);
if (reportIdFromURL) {
  document.getElementById("noPelaporan").value = reportIdFromURL;
  searchCompromisedByReportid(reportIdFromURL);
}

document
  .getElementById("updateButton")
  .addEventListener("click", (event) =>
    updateCompromised(event, reportIdFromURL)
  );
