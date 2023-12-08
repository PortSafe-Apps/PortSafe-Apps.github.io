async function getUserWithToken() {
    const token = getTokenFromCookies('Login'); 
  
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
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';
  
   
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
    const namaPengawasInput = document.getElementById('namaPengawas');
    const jabatanPengawasInput = document.getElementById('jabatanPengawas');
  
    if (userData && userData.length > 0) {
      const user = userData[0];
      namaPengawasInput.value = user.nama;
      jabatanPengawasInput.value = user.jabatan;
    } else {
      namaPengawasInput.value = 'No user data found';
      jabatanPengawasInput.value = '';
    }
  }
  
  getUserWithToken();