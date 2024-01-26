// Function to get the token from cookies
const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim().split("="));
  const cookie = cookies.find(([name]) => name === cookieName);
  return cookie ? cookie[1] : null;
};

// Function to display user data in the table
const displayUserData = (userData, tableBodyId) => {
  const userDataBody = document.getElementById(tableBodyId);

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
            <a class="btn btn-datatable btn-icon btn-transparent-dark me-2 edit-link" href="#!" data-nipp="${user.nipp}"><i data-feather="edit"></i></a>
            <a class="btn btn-datatable btn-icon btn-transparent-dark delete-link" href="#!" data-nipp="${user.nipp}" data-action="deleteUser"><i data-feather="trash-2"></i></a>
        </td>
      `;

      userDataBody.appendChild(newRow);
    });
  } else {
    userDataBody.innerHTML = `<tr><td colspan="7">No user data found.</td></tr>`;
  }

  feather.replace(); // Refresh Feather icons after adding new elements
};

const getAllUser = async () => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Error",
        text: "You are not logged in.",
      }).then(() => {
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

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 200) {
      console.log("Data received from the server:", data.data);
      
      // Display user data
      displayUserData(data.data, "datatablesSimple");

      // Initialize DataTables here or at the end of your script
      new simpleDatatables.DataTable("#datatablesSimple");
    } else {
      console.error("Server returned an error:", data.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message,
      });
    }
  } catch (error) {
    console.error("Error during data retrieval:", error);

    // Handle the error gracefully, e.g., show a message to the user
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while fetching data.",
    });
  }
};

// Function to delete a user
const deleteUser = async (nipp) => {
  const token = getTokenFromCookies("Login");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Authentication Error",
      text: "You are not logged in.",
    }).then(() => {
      window.location.href = "https://portsafe-apps.github.io/admin/user-management-list.html";
    });
    return;
  }

  const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/deleteUser";

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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User deleted successfully!",
      }).then(() => {
        getAllUser(); // Refresh user data after deletion
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to edit a user
const editUser = (nipp) => {
  window.location.href = `https://portsafe-apps.github.io/admin/user-management-edit-user.html?nipp=${nipp}`;
};

// Event delegation to handle clicks on edit and delete links
document.getElementById("datatablesSimple").addEventListener("click", (event) => {
  const target = event.target;
  const editLink = target.closest(".edit-link");
  const deleteLink = target.closest(".delete-link");

  if (editLink) {
    const nipp = editLink.getAttribute("data-nipp");
    editUser(nipp);
  } else if (deleteLink) {
    const nipp = deleteLink.getAttribute("data-nipp");
    deleteUser(nipp);
  }
});

// Function to handle delete confirmation with SweetAlert
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

// Initial call to get all users when the page loads
getAllUser();
