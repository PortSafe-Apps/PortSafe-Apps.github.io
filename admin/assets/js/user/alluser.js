const userDataBody = document.querySelector("#datatablesSimple tbody");

const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: 'Alert',
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

const getUserWithToken = async () => {
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

const displayUserData = (userData, userDataBody) => {
  try {
    if (userDataBody) {
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
                <button class="btn btn-datatable btn-icon btn-transparent-dark edit-link" data-nipp="${user.nipp}" data-action="editUser"><i data-feather="edit"></i></button>
                <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-nipp="${user.nipp}" data-action="deleteUser"><i data-feather="trash-2"></i></button>
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
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const deleteUser = async (nipp) => {
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

  const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteAcc";

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

    if (data.status === true) {
      Swal.fire({
        title: "Success",
        text: "User deleted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Assuming getAllUser is defined somewhere
        getAllUser();
      });
    } else {
      Swal.fire({
        title: "Error",
        text: data.message, // Display the error message from the server
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const editUser = (nipp) => {
  window.location.href = `https://portsafe-apps.github.io/admin/user-management-edit-user.html?nipp=${nipp}`;
};

const deleteUserHandler = (nipp) => {
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
      deleteUser(nipp);
    }
  });
};

document
  .getElementById("datatablesSimple")
  .addEventListener("click", (event) => {
    const target = event.target;
    const editButton = target.closest("[data-action='editUser']");
    const deleteButton = target.closest("[data-action='deleteUser']");

    if (editButton) {
      const nipp = editButton.getAttribute("data-nipp");
      editUser(nipp);
    } else if (deleteButton) {
      const nipp = deleteButton.getAttribute("data-nipp");
      deleteUserHandler(nipp);
    }
  });

// Initial call to get all users when the page loads
getUserWithToken();
