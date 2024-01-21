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

// Fungsi untuk menampilkan jumlah total data report dengan progress bar
const displayUserReports = (data, sortedUsers, containerId) => {
  const userActiveElement = document.getElementById(containerId);

  if (!userActiveElement) {
    console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
    return;
  }

  userActiveElement.innerHTML = "";

  const userReportsCount = {};

  // Menggabungkan laporan dari hasil 'compromised' dan 'unsafe'
  const mergedData = [...compromisedResult.data, ...unsafeResult.data];

  // Menghitung jumlah laporan untuk setiap 'nipp'
  mergedData.forEach((report) => {
    const nipp = report.user.nipp;

    if (!userReportsCount[nipp]) {
      userReportsCount[nipp] = 1;
    } else {
      userReportsCount[nipp]++;
    }
  });

  if (!sortedUsers || !Array.isArray(sortedUsers) || sortedUsers.length === 0) {
    console.error("Sorted users data is undefined, not an array, or an empty array.");
    return;
  }

  sortedUsers.forEach((nipp) => {
    const reportsCount = userReportsCount[nipp];
    const userData = mergedData.find((report) => report.user.nipp === nipp)?.user;

    const userInfoContainer = document.createElement("div");
    userInfoContainer.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-between",
      "small",
      "mb-1"
    );

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("fw-bold");
    titleDiv.innerText = `${nipp} - ${userData?.nama || "Nama Tidak Ditemukan"}`;

    const percentageDiv = document.createElement("div");
    percentageDiv.classList.add("small");
    percentageDiv.innerText = `${reportsCount}%`;

    userInfoContainer.appendChild(titleDiv);
    userInfoContainer.appendChild(percentageDiv);

    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress", "mb-0");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar", "bg-dark");
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("style", `width: ${reportsCount}%`);
    progressBar.setAttribute("aria-valuenow", reportsCount);
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");

    progressBarContainer.appendChild(progressBar);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    cardBody.appendChild(userInfoContainer);
    cardBody.appendChild(progressBarContainer);
    userActiveElement.appendChild(cardBody);
  });
};

const getActiveUser = async () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  const compromised = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised';
  const unsafe = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport';

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  try {
    const [compromisedResponse, unsafeResponse] = await Promise.all([
      fetch(compromised, { method: "POST", headers: myHeaders, redirect: "follow" }),
      fetch(unsafe, { method: "POST", headers: myHeaders, redirect: "follow" })
    ]);

    if (!compromisedResponse.ok || !unsafeResponse.ok) {
      throw new Error("Failed to fetch data.");
    }

    const compromisedResult = await compromisedResponse.json();
    const unsafeResult = await unsafeResponse.json();

    console.log("Compromised Result:", compromisedResult);
    console.log("Unsafe Result:", unsafeResult);

    // Combine sortedUsers from both compromisedResult and unsafeResult
    const sortedUsers = [...(compromisedResult.sortedUsers || []), ...(unsafeResult.sortedUsers || [])];
    
    console.log("Sorted Users:", sortedUsers);
    
    // Check if sortedUsers is an array and not empty before proceeding
    if (!Array.isArray(sortedUsers) || sortedUsers.length === 0) {
      console.error("Sorted users data is undefined, not an array, or an empty array.");
      return;
    }
    
    displayUserReports(mergedData, sortedUsers, "userActive");
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getActiveUser();
