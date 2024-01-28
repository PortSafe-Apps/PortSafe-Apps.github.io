const showAlert = (message, type) => {
    Swal.fire({
      icon: type,
      title: 'Success',
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

const addUser = async (event) => {
    event.preventDefault();
  
    // Get the token from cookies
    const token = getTokenFromCookies('Login');
  
    // Check if the user is logged in
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
  
  
    // Set the target URL for the API endpoint
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/register';
  
    // Set headers for the API request
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    // Get form input values
    const nipp = document.getElementById('nipp').value;
    const nama = document.getElementById('nama').value;
    const selectedJabatan = document.querySelector('input[name="radioJabatan"]:checked');
    const jabatan = selectedJabatan ? selectedJabatan.value : null;
    const unitKerja = document.querySelector('select[name="unitKerja"]').value;
    const role = document.querySelector('select[name="role"]').value;
    const password = document.getElementById('password').value;
  
    // Check for empty values
    if (!nipp || !nama || !jabatan || !unitKerja || !role || !password) {
      showAlert('Please fill in all fields', 'error');
      return;
    }
  
    // Prepare the request body
    const requestBody = {
      nipp,
      nama,
      jabatan,
      unitKerja,
      role,
      password,
    };
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: 'follow',
    };
  
    try {
      // Make the API request
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      // Handle the response
      if (data.status === false) {
        showAlert(data.message, 'error');
      } else {
        showAlert("User added successfully!", 'success');
        window.location.href = 'user-management-list.html';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Add an event listener to the form
  document.querySelector('form').addEventListener('submit', addUser);
  