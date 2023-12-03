// Function to make the API request with the token
async function getUserWithToken() {
    const token = getTokenFromCookies('Login'); // Get the token dari cookies via parameter
  
    if (!token) {
      alert("token tidak ditemukan");
      return;
    }
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';
  
    // Set up headers with the token
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === true) {
        displayUserData(data.data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Function to extract the token from cookies
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
  
 // Function to display user data in the form
function displayUserData(userData) {
    // Assuming you have input elements with the IDs 'namaPengawas' and 'jabatanPengawas'
    const namaPengawasInput = document.getElementById('namaPengawas');
    const jabatanPengawasInput = document.getElementById('jabatanPengawas');
  
    if (userData && userData.length > 0) {
      const user = userData[0]; // Assuming you only want to display the first user if there are multiple users
      namaPengawasInput.value = user.username;
      jabatanPengawasInput.value = user.password;
    } else {
      // Set default values or handle the case where no user data is found
      namaPengawasInput.value = 'No user data found';
      jabatanPengawasInput.value = '';
    }
  }
  
  getUserWithToken();