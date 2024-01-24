document.addEventListener('DOMContentLoaded', function () {
  // Wrap the code inside a DOMContentLoaded event listener
  getUserWithToken();
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
      Swal.fire({
          icon: 'warning',
          title: 'Authentication Error',
          text: 'Kamu Belum Login!',
      }).then(() => {
          window.location.href = 'https://portsafe-apps.github.io/';
      });
      return;
    }
    
    const targetURL =
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getAllUser";

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

const deleteUser = async (nipp) => {
  try {
    const token = getTokenFromCookies("Login");

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

    const targetURL =
      "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteUser";

    const myHeaders = new Headers();
    myHeaders.append("Login", token);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify({ nipp: nipp }),
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      showAlert("Success", "success", "User deleted successfully!", () => {
        getUserWithToken();
      });
    } else {
      showAlert("Error", "error", data.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const handleDeleteUser = (nipp) => {
  deleteUser(nipp);
};

const displayUserData = (userData, userDataBody) => {
  try {
    // Clear existing rows
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
              <a class="btn btn-datatable btn-icon btn-transparent-dark" href="#!" onclick="confirmDeleteUser('${user.nipp}')"><i data-feather="trash-2"></i></a>
          </td>
        `;
        userDataBody.appendChild(newRow);
      });
    } else {
      // Display a message if no user data found
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = '<td colspan="7">No user data found.</td>';
      userDataBody.appendChild(emptyRow);
    }

    // Initialize Feather Icons after adding icons to the DOM
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

// Call Feather Icons initialization when the script is loaded
feather.replace();
