const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: "Success",
    text: message,
  });
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  // Define a default endpoint
  let targetURL =
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/register";

  let token = 'token';

  // You can add an input field or configuration logic to set the endpoint dynamically if needed

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form input values inside the submit event listener
    const nipp = document.getElementById("nipp").value;
    const nama = document.getElementById("nama").value;
    const selectedJabatan = document.querySelector(
      'input[name="radioJabatan"]:checked'
    );
    const unitKerja = document.querySelector("#location").value;
    const jabatan = selectedJabatan ? selectedJabatan.value : null;
    const role = document.querySelector("#role").value;
    const password = document.getElementById("password").value;

    // Check for empty values
    if (!nipp || !nama || !jabatan || !unitKerja || !role || !password) {
      showAlert("Please fill in all fields", "error");
      return;
    }

    // Prepare the request body
    const requestBody = {
      nipp,
      nama,
      jabatan,
      Location: {
        LocationName: unitKerja,
      },
      password,
      role,
    };

    // Define your headers
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: "follow",
    };

    try {
      // Make the API request
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();

      // Handle the response
      if (data.status === false) {
        showAlert(data.message, "error");
      } else {
        showAlert("User added successfully!", "success");
        window.location.href = "user-management-list-user.html";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
