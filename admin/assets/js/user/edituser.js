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
  

const showAlert = (message, icon = 'success') => {
    Swal.fire({
      icon: icon,
      text: message,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/admin/user-management-list.html';
    });
  };
  
  const searchUserByNipp = async (nipp) => {
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert("Anda Belum Login", 'error');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ nipp: nipp }),
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === 200) {
        populateForm(data.data);
      } else {
        showAlert(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const populateForm = (userData) => {
    const setValue = (id, value) => {
      document.getElementById(id).value = value;
    };
  
    setValue('nipp', userData.nipp);
    setValue('nama', userData.nama);
  
    const jabatanOptions = ['admin utama', 'Senior Vice Precident', 'Vice Precident', 'Project Manager', 'Branch Manager', 'Deputi Branch Manager', 'Supervisi', 'Koordinator'];
    const jabatanIndex = jabatanOptions.indexOf(userData.jabatan.toLowerCase());
    const radioButtons = document.getElementsByName('radioJabatan');
    radioButtons[jabatanIndex].checked = true;
  
    const unitKerjaSelect = document.getElementById('unitKerja');
    for (let i = 0; i < unitKerjaSelect.options.length; i++) {
      if (unitKerjaSelect.options[i].value === userData.location.locationName) {
        unitKerjaSelect.selectedIndex = i;
        break;
      }
    }
  
    const roleSelect = document.getElementById('role');
    for (let i = 0; i < roleSelect.options.length; i++) {
      if (roleSelect.options[i].value === userData.role) {
        roleSelect.selectedIndex = i;
        break;
      }
    }
  
    setValue('password', ''); // Clear the password field
    document.getElementById('editUserForm').style.display = 'block';
  };
  
  const updateUserData = async (event) => {
    event.preventDefault();
  
    const nipp = document.getElementById('nipp').value;
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert("Anda Belum Login", 'error');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/resetPassword';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        nipp: nipp,
        nama: document.getElementById('nama').value,
        jabatan: getSelectedRadioValue('radioJabatan'),
        unitKerja: document.getElementById('unitKerja').value,
        role: document.getElementById('role').value,
        password: document.getElementById('password').value,
        // Add other fields as needed for the update
      }),
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status) {
        showAlert('Berhasil Update Data', 'Data telah berhasil diperbarui.', 'success');
        window.location.href = 'tables_emp.html';
      } else {
        showAlert('Gagal Update Data', data.message || 'Terjadi kesalahan saat mengupdate data. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Function to get the selected radio value
  const getSelectedRadioValue = (radioName) => {
    const radioButtons = document.getElementsByName(radioName);
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        return radioButton.value;
      }
    }
    return null;
  };
  
  const nippFromURL = new URLSearchParams(window.location.search).get('nipp');
  if (nippFromURL) {
    document.getElementById('nipp').value = nippFromURL;
    searchUserByNipp(nippFromURL);
  }
  
  document.getElementById('editUserForm').style.display = 'block';
  document.getElementById('editUserForm').addEventListener('submit', updateUserData);
  