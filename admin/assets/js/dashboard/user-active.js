// Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

// Fungsi untuk menampilkan jumlah total data report dengan progress bar
const displayUserReports = (data, sortedUsers, containerId) => {
  // Mendapatkan elemen dengan ID containerId
  const userActiveElement = document.getElementById(containerId);

  // Memeriksa apakah elemen ditemukan
  if (!userActiveElement) {
    console.error(`Elemen dengan ID "${containerId}" tidak ditemukan.`);
    return;
  }

  // Mengosongkan semua elemen anak dari userActiveElement
  userActiveElement.innerHTML = "";

  // Membuat objek untuk menyimpan jumlah laporan setiap user
  const userReportsCount = {};

  // Pastikan data selalu dalam bentuk array
  const dataArray = Array.isArray(data) ? data : [data];

  // Menghitung jumlah laporan setiap user
  dataArray.forEach((report) => {
    const nipp = report.user.nipp;

    if (!userReportsCount[nipp]) {
      userReportsCount[nipp] = 1;
    } else {
      userReportsCount[nipp]++;
    }
  });

  // Check if sortedUsers is defined and is an array
  if (!sortedUsers || !Array.isArray(sortedUsers)) {
    console.error("Sorted users data is undefined or not an array.");
    return;
  }

  // Use sortedUsers for iteration
  sortedUsers.forEach((nipp) => {
    const reportsCount = userReportsCount[nipp];
  
    // Mencari data user berdasarkan nipp
    const userData = data.find((report) => report.user.nipp === nipp)?.user;
  
    // Membuat elemen div dengan class "d-flex align-items-center justify-content-between small mb-1"
    const userInfoContainer = document.createElement("div");
    userInfoContainer.classList.add("d-flex", "align-items-center", "justify-content-between", "small", "mb-1");
  
    // Membuat elemen div untuk judul dengan class "fw-bold"
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("fw-bold");
    titleDiv.innerText = `${nipp} - ${userData?.nama || "Nama Tidak Ditemukan"}`;
  
    // Membuat elemen div untuk persentase dengan class "small"
    const percentageDiv = document.createElement("div");
    percentageDiv.classList.add("small");
    percentageDiv.innerText = `${reportsCount}%`;
  
    // Menambahkan titleDiv dan percentageDiv ke userInfoContainer
    userInfoContainer.appendChild(titleDiv);
    userInfoContainer.appendChild(percentageDiv);
  
    // Membuat elemen progressBarContainer
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress", "mb-0");
  
    // Membuat elemen progressBar
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar", "bg-dark");
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("style", `width: ${reportsCount}%`);
    progressBar.setAttribute("aria-valuenow", reportsCount);
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
  
    // Menambahkan progressBar ke progressBarContainer
    progressBarContainer.appendChild(progressBar);
  
    // Membuat elemen cardBody
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
  
    // Menambahkan userInfoContainer, progressBarContainer, dan cardBody ke userActiveElement
    cardBody.appendChild(userInfoContainer);
    cardBody.appendChild(progressBarContainer);
    userActiveElement.appendChild(cardBody);
  });
}; // Closing bracket for displayUserReports function

// Fungsi untuk mengambil data dari API dan jumlah data laporan yang telah dibuat
const getActiveUser = async () => {
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

  const targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const result = await response.json();

    // Check if sortedUsers is defined and is an array
    const sortedUsers = result.sortedUsers;

    if (!Array.isArray(sortedUsers)) {
      console.error("Sorted users data is undefined or not an array.");
      return;
    }

    // Pass sortedUsers along with other data to displayUserReports
    displayUserReports(result.data, sortedUsers, "userActive");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan
getActiveUser();