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

const searchCompromisedById = async (reportid) => {
  const token = getTokenFromCookies("Login");

  if (!token) {
    showAlert("Anda Belum Login", "error");
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
    document.getElementById(id).innerText = value;
  };

  setValue("noPelaporan", data.reportid);
  setValue("tanggal", data.date);
  setValue("waktu", data.time);
  setValue("pengawas", `${data.user.nama} - ${data.user.jabatan}`);
  setValue("jabatan", data.user.jabatan);
  setValue("unitKerja", data.location.locationName);
  setValue("area", data.area.areaName);

  const descriptionElement = document.getElementById("deskripsiPengamatan");
  descriptionElement.innerText = data.description;

  const imageElement = document.getElementById("observasiPhoto");
  imageElement.src = data.observationPhoto;

  const accordionBody = document.getElementById("accordionBody");
accordionBody.innerHTML = "";
data.typeDangerousActions.forEach((type, index) => {
    const subType = type.subTypes[0];
    accordionBody.innerHTML += `<div class="accordion-item">
                                      <h2 class="accordion-header" id="flush-heading${index}">
                                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapse${index}">
                                              ${type.typeName}
                                          </button>
                                      </h2>
                                      <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-heading${index}" data-bs-parent="#accordionFlushExample">
                                          <div class="accordion-body"><span class="badge bg-danger">${subType}</span></div>
                                      </div>
                                  </div>`;
});

  setValue("tindakanPerbaikanSegera", data.immediateAction);

  const improvementPhotoElement = document.getElementById("improvementPhoto");
  improvementPhotoElement.src = data.improvementPhoto;

  const recomendationElement = document.getElementById("rekomendasi");
  recomendationElement.innerText = data.recomendation;

  const tindakLanjutTextarea = document.getElementById(
    "exampleFormControlTextarea1"
  );

  if (tindakLanjutTextarea) {
    tindakLanjutTextarea.value = data.ActionDesc || "";
  } else {
    console.error('Element with ID "exampleFormControlTextarea1" not found.');
  }
};

const updateCompromised = async (event, reportid) => {
  event.preventDefault();

  const token = getTokenFromCookies("Login");

  if (!token) {
    showAlert("Anda Belum Login", "error");
    return;
  }

  const targetURL =
    "https://asia-southeast2-gis-project-401902.cloudfunctions.net/updatedatacompromised";

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
      ActionDesc: document.getElementById("exampleFormControlTextarea1").value,
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

const reportIdFromURL = new URLSearchParams(window.location.search).get(
  "reportid"
);
if (reportIdFromURL) {
  document.getElementById("reportIdInput").value = reportIdFromURL;
  searchCompromisedById(reportIdFromURL);
}

document
  .getElementById("updateButton")
  .addEventListener("click", (event) =>
    updateCompromised(event, compromisedIdFromURL)
  );
