// Function to extract the token from cookies
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

async function getUserWithToken() {
  const token = getTokenFromCookies("Login");

  if (!token) {
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
    "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser";

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();
    console.log("API Response:", data);
  
    if (data.status === true) {
      displayUserData(data.data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to display user data in the wizard
function displayUserData(userData) {
  const namaPengawasElement = document.getElementById("namaPengawas");
  const jabatanPengawasElement = document.getElementById("jabatanPengawas");
  const autoCompleteLocationElement = document.getElementById("autoCompleteLocation");

  // Check if userData is an array and has at least one element
  if (userData && Array.isArray(userData) && userData.length > 0) {
    const user = userData[0]; // Assuming you want the first user in the array

    // Display user data
    namaPengawasElement.textContent = user.nama;
    jabatanPengawasElement.textContent = user.jabatan;

    // Display location data
    if (
      user.location &&
      user.location.locationName &&
      user.location.locationName.toLowerCase().includes("branch")
    ) {
      autoCompleteLocationElement.value = user.location.locationName;
      autoCompleteLocationElement.disabled = true;
    } else {
      autoCompleteLocationElement.value = user.location ? user.location.locationName : "";
      autoCompleteLocationElement.disabled = false;
    }
  } else {
    // If userData is not an array or has no elements
    namaPengawasElement.textContent = "No user data found";
    jabatanPengawasElement.textContent = "No user data found";
  }
}

// Call the function to get user data and display it
getUserWithToken();
