document.addEventListener("DOMContentLoaded", function () {
  getUserWithToken();

  const userDataBody = document.querySelector("#datatablesSimple tbody");

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

      if (!token) {
        showAlert("Kamu Belum Login!", "warning", "", () => {
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
                  <button class="btn btn-datatable btn-icon btn-transparent-dark" data-nipp="${user.nipp}" data-action="editUser"><i data-feather="edit"></i></button>
                  <button class="btn btn-datatable btn-icon btn-transparent-dark" data-nipp="${user.nipp}" data-action="deleteUser"><i data-feather="trash-2"></i></button>
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

  // Function to edit a user
  const editUser = (nipp) => {
    window.location.href = `https://portsafe-apps.github.io/admin/user-management-edit-user.html?nipp=${nipp}`;
  };

  // Event delegation to handle clicks on edit and delete links
  document.getElementById("datatablesSimple").addEventListener("click", (event) => {
    const target = event.target;
    const editLink = target.closest(".btn-transparent-dark[data-action='editUser']");
    const deleteLink = target.closest(".btn-transparent-dark[data-action='deleteUser']");

    if (editLink) {
      const nipp = editLink.getAttribute("data-nipp");
      editUser(nipp);
    } else if (deleteLink) {
      const nipp = deleteLink.getAttribute("data-nipp");
      deleteUserHandler(nipp);
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

  // Function to delete a user
  const deleteUser = (nipp) => {
    // Implement the logic to delete the user
    // You might want to make a fetch request or use another suitable method
    console.log(`Delete user with NIPP: ${nipp}`);
  };

  // Initial call to get all users when the page loads
  getUserWithToken();
});
