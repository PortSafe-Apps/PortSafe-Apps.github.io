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

const getAllUser = async () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'You are not logged in.',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
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

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      displayUserData(data.data, 'UserDataBody');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const deleteUserHandler = async (nipp) => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'You are not logged in.',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/admin/user-management-list.html';
    });
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

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User deleted successfully!',
      }).then(() => {
        getAllUser();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message,
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const editUser = (nipp) => {
  window.location.href = `https://portsafe-apps.github.io/admin/user-management-edit-user.html?nipp=${nipp}`;
};

const displayUserData = (userData, tableBodyId) => {
  const userDataBody = document.querySelector(`#${tableBodyId} tbody`);

  userDataBody.innerHTML = '';

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
            <a class="btn btn-datatable btn-icon btn-transparent-dark me-2" href="user-management-edit-user.html?nipp=${user.nipp}"><i data-feather="edit"></i></a>
            <a class="btn btn-datatable btn-icon btn-transparent-dark delete-link" href="#!" data-nipp="${user.nipp}" data-action="deleteUser"><i data-feather="trash-2"></i></a>
        </td>
      `;
      userDataBody.appendChild(newRow);
    });
  } else {
    userDataBody.innerHTML = `<tr><td colspan="7">No user data found.</td></tr>`;
  }

  new simpleDatatables.DataTable(userDataBody.parentElement);
};

document.getElementById('UserDataBody').addEventListener('click', (event) => {
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
