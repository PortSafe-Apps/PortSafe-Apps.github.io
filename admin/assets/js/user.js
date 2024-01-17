const showAlert = (message, type, additionalInfo = '', callback) => {
    console.log(message, type, additionalInfo);
    if (typeof callback === 'function') {
      callback();
    }
  };
  
  const getTokenFromCookies = (cookieName) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };
  
  const getUserWithToken = async () => {
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert("Token tidak ditemukan", 'error');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-gis-project-401902.cloudfunctions.net/GetUserWithToken';
  
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
        showAlert(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const deleteUser = async (username) => {
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert('Authentication Error', 'error', 'You are not logged in.');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-gis-project-401902.cloudfunctions.net/delete-user';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({ username: username }),
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === true) {
        showAlert('Success', 'success', 'User deleted successfully!', () => {
          getUserWithToken();
        });
      } else {
        showAlert('Error', 'error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDeleteUser = (username) => {
    deleteUser(username);
  };
  
  const displayUserData = (userData) => {
    const userDataBody = document.getElementById('userDataBody');
  
    if (userData && userData.length > 0) {
      userData.forEach(user => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td class="px-4 py-3">
            <div class="flex items-center text-sm">
              <div>
                <p class="font-semibold">${user.username}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-sm">
            <p class="font-semibold">${user.password}</p>
          </td>
          <td class="px-4 py-3">
            <a href="#" class="delete-link" data-employeeid="${user.username}">Delete</a>
          </td>
        `;
        userDataBody.appendChild(newRow);
  
        const deleteLink = newRow.querySelector('.delete-link');
        deleteLink.addEventListener('click', (event) => {
          event.preventDefault();
          const username = event.target.getAttribute('data-employeeid');
          confirmDeleteUser(username);
        });
      });
    } else {
      userDataBody.innerHTML = '<tr><td colspan="3">No user data found.</td></tr>';
    }
  };
  
  const confirmDeleteUser = (username) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(username);
      }
    });
  };
  
  getUserWithToken();