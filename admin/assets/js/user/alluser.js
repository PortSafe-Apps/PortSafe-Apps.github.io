const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim().split("="));
  const cookie = cookies.find(([name]) => name === cookieName);
  return cookie ? cookie[1] : null;
};

const showAlert = (icon, title, text, callback) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  }).then(callback);
};

const handleAuthenticationError = () => {
  showAlert('warning', 'Authentication Error', 'You are not logged in.', () => {
    window.location.href = 'https://portsafe-apps.github.io/';
  });
};

const getAllUser = async () => {
  try {
    const token = getTokenFromCookies('Login');
    if (!token) {
      handleAuthenticationError();
      return;
    }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getAllUser';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      displayUserData(data.data, 'datatablesSimple');
    } else {
      showAlert('error', 'Error', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const deleteUserHandler = async (nipp) => {
  try {
    const token = getTokenFromCookies('Login');
    if (!token) {
      handleAuthenticationError();
      return;
    }

    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/deleteUser';

    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({ nipp: nipp }),
      redirect: 'follow',
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      showAlert('success', 'Success', 'User deleted successfully!', getAllUser);
    } else {
      showAlert('error', 'Error', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const editUser = (nipp) => {
  window.location.href = `https://portsafe-apps.github.io/admin/user-management-edit-user.html?nipp=${nipp}`;
};

const displayUserData = (userData, tableId) => {
  const userDataBody = document.querySelector(`#${tableId} tbody`);
  userDataBody.innerHTML = '';

  if (userData && userData.length > 0) {
    userData.forEach((user) => {
      const newRow = document.createElement('tr');
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
    userDataBody.innerHTML = '<tr><td colspan="7">No user data found.</td></tr>';
  }

  new simpleDatatables.DataTable(`#${tableId}`);
  feather.replace();
};

document.getElementById('datatablesSimple').addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('edit-link')) {
    const nipp = target.getAttribute('data-nipp');
    editUser(nipp);
  } else if (target.classList.contains('delete-link')) {
    const nipp = target.getAttribute('data-nipp');
    deleteUserHandler(nipp);
  }
});

getAllUser();
