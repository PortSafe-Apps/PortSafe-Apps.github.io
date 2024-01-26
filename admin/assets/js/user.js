document.addEventListener("DOMContentLoaded", function () {
  getUserWithToken();

  const urlParams = new URLSearchParams(window.location.search);
  const nippParam = urlParams.get('nipp');
  
  if (nippParam) {
    fetchAndDisplayEditUserData(nippParam);
  }

  document.querySelector('button[type="button"]').addEventListener("click", updateUserData);

  document.body.addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "a" && event.target.dataset.action === "deleteUser") {
      event.preventDefault();
      confirmDeleteUser(event.target.dataset.nipp);
    }
  });
});

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

const getUserWithToken = async () => {
  try {
    const token = getTokenFromCookies("Login");
    const userDataBody = document.querySelector("#datatablesSimple tbody");

    if (!token) {
      showAlert("Kamu Belum Login!", "warning", "Authentication Error", () => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return;
    }

    const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getAllUser";

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
      displayUserData(data.data, userDataBody);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const fetchAndDisplayEditUserData = async (nipp) => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      showAlert("Kamu Belum Login!", "warning", "Authentication Error", () => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return;
    }

    const targetURL = `https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser`;

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
      displayEditUserData(data.data);
    } else {
      showAlert("Error", "error", data.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayEditUserData = (userData) => {
  try {
    const nippInput = document.getElementById("nipp");
    const namaInput = document.getElementById("nama");
    const jabatanRadio = document.querySelector('input[name="radioJabatan"]');
    const unitKerjaInput = document.querySelector("#unitKerja");
    const roleInput = document.querySelector("#role");

    if (!nippInput || !namaInput || !jabatanRadio || !unitKerjaInput || !roleInput) {
      console.error("Error: One or more form elements are null");
      return;
    }

    nippInput.value = userData.nipp || "";
    namaInput.value = userData.nama || "";
    jabatanRadio.value = userData.jabatan || "";
    unitKerjaInput.value = userData.location ? userData.location.locationName || "" : "";
    roleInput.value = userData.role || "";

    const timestampElement = document.getElementById("timestamp");
    if (timestampElement) {
      timestampElement.innerText = userData.timestamp ? new Date(userData.timestamp).toLocaleDateString() : "";
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const updateUserData = async () => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      showAlert("Kamu Belum Login!", "warning", "Authentication Error", () => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return;
    }

    const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/resetPassword";

    const nipp = document.getElementById("nipp").value;
    const nama = document.getElementById("nama").value;
    const jabatan = document.querySelector('input[name="radioJabatan"]:checked').value;
    const locationName = document.querySelector("#unitKerja").value;
    const role = document.querySelector("#role").value;
    const password = document.getElementById("password").value;

    const requestBody = {
      nipp: nipp,
      nama: nama,
      jabatan: jabatan,
      location: {
        locationName: locationName,
      },
      role: role,
      password: password,
    };

    const myHeaders = new Headers();
    myHeaders.append("Login", token);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      showAlert("Success", "success", "User data updated successfully!", () => {
        window.location.href = "https://portsafe-apps.github.io/admin/user-management-list.html";
      });
    } else {
      showAlert("Error", "error", data.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayUserData = (userData, userDataBody) => {
  try {
    if (!userDataBody) {
      console.error("Error: userDataBody is null");
      return;
    }

    userDataBody.innerHTML = "";

    if (userData && userData.length > 0) {
      userData.forEach((user) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${user.nipp}</td>
          <td>${user.nama}</td>
          <td>${user.jabatan}</td>
          <td>${user.location.locationName}</td>
          <td>${user.role}</td>
          <td>${new Date(user.timestamp).toLocaleDateString()}</td>
          <td>
              <a class="btn btn-datatable btn-icon btn-transparent-dark me-2" href="user-management-edit-user.html?nipp=${user.nipp}"><i data-feather="edit"></i></a>
              <a class="btn btn-datatable btn-icon btn-transparent-dark" href="#!" data-nipp="${user.nipp}" data-action="deleteUser"><i data-feather="trash-2"></i></a>
          </td>
        `;
        userDataBody.appendChild(newRow);
      });
    } else {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = '<td colspan="7">No user data found.</td>';
      userDataBody.appendChild(emptyRow);
    }

    feather.replace();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const confirmDeleteUser = (nipp) => {
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
      handleDeleteUser(nipp);
    }
  });
};

const handleDeleteUser = async (nipp) => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      showAlert("Kamu Belum Login!", "warning", "Authentication Error", () => {
        window.location.href = "https://portsafe-apps.github.io/";
      });
      return;
    }

    const targetURL = `https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/deleteUser`;

    const myHeaders = new Headers();
    myHeaders.append("Login", token);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      showAlert("Success", "success", "User deleted successfully!", () => {
        window.location.reload();
      });
    } else {
      showAlert("Error", "error", data.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
