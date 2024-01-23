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
  document.addEventListener('DOMContentLoaded', async function () {
      const token = getTokenFromCookies('Login');

      if (!token) {
          showAlert("Token tidak ditemukan", 'error');
          return;
      }

      const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getAllUser';

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
  });
};

const deleteUser = async (nipp) => {
  const token = getTokenFromCookies('Login');

  if (!token) {
      showAlert('Authentication Error', 'error', 'You are not logged in.');
      return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteUser';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({ nipp: nipp }),
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

const handleDeleteUser = (nipp) => {
  deleteUser(nipp);
};

const displayUserData = (userData, tableBodyId) => {
  const userDataBody = document.getElementById(tableBodyId);

  // Clear existing rows
  userDataBody.innerHTML = '';

  if (userData && userData.length > 0) {
    userData.forEach(user => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${user.nipp}</td>
        <td>${user.nama}</td>
        <td>${user.jabatan}</td>
        <td>${user.location ? user.location.locationName : ''}</td>
        <td>${user.role}</td>
        <td>${user.timestamp ? new Date(user.timestamp).toLocaleDateString() : ''}</td>
        <td>
          <a class="btn btn-datatable btn-icon btn-transparent-dark me-2" href="user-management-edit-user.html"><i data-feather="edit"></i></a>
          <a class="btn btn-datatable btn-icon btn-transparent-dark" href="#!" onclick="confirmDeleteUser('${user.nipp}')"><i data-feather="trash-2"></i></a>
        </td>
      `;
      userDataBody.appendChild(newRow);
    });
  } else {
    const noDataRow = document.createElement('tr');
    noDataRow.innerHTML = '<td colspan="7">No user data found.</td>';
    userDataBody.appendChild(noDataRow);
  }
};

const confirmDeleteUser = (nipp) => {
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
          handleDeleteUser(nipp);
      }
  });
};

getUserWithToken();
