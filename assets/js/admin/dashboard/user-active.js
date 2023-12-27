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
const displayUserReports = (data, containerId) => {
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

  // Mengurutkan user berdasarkan jumlah laporan dari yang terbanyak
  const sortedUsers = Object.keys(userReportsCount).sort(
    (a, b) => userReportsCount[b] - userReportsCount[a]
  );

  // Membuat elemen untuk setiap user dan menambahkannya ke userActiveElement
  sortedUsers.forEach((nipp) => {
    const reportsCount = userReportsCount[nipp];

    // Membuat elemen cardBody
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Mencari data user berdasarkan nipp
    const userData = data.find((report) => report.user.nipp === nipp)?.user;

    // Membuat elemen heading
    const heading = document.createElement("h4");
    heading.classList.add("small", "font-weight-bold");
    heading.innerText = `${nipp} - ${
      userData?.nama || "Nama Tidak Ditemukan"
    }`;

    // Membuat elemen progressBarContainer
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress", "mb-4");

    // Membuat elemen progressBar
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar", "bg-info");
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("style", `width: ${reportsCount}%`);

    // Menambahkan progressBar ke progressBarContainer
    progressBarContainer.appendChild(progressBar);

    // Menambahkan cardBody, heading, dan progressBarContainer ke userActiveElement
    cardBody.appendChild(heading);
    cardBody.appendChild(progressBarContainer);
    userActiveElement.appendChild(cardBody);
  });
};

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
    return [];
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

    // Periksa struktur objek result
    console.log(result);

    displayUserReports(result.data, "userActive");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Panggil fungsi untuk mengambil data dari API dan menampilkan jumlah laporan
getActiveUser();
