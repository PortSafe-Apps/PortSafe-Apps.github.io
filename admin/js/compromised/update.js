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
  
  const showAlert = (message) => {
    Swal.fire({
      icon: 'success',
      text: message,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/user/compromisedreport.html';
    });
  };
  
  
  const searchEmployeeById = async (employeeId) => {
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert("Anda Belum Login", 'error');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getOneReportCompromised';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ reportid: reportId }),
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
  
  const populateForm = (reportData) => {
    const setValue = (id, value) => {
      document.getElementById(id).value = value;
    };
  
    setValue('employeeIdInput', reportData.employeeid);
    setValue('nameInput', reportData.name);
    setValue('emailInput', reportData.email);
    setValue('phoneInput', reportData.phone);
    setValue('divisionInput', reportData.division.divName);
    setValue('usernameInput', reportData.account.username);
    setValue('passwordInput', reportData.account.password);
    setValue('basicSalaryInput', reportData.salary['basic-salary']);
    setValue('honorDivisionInput', reportData.salary['honor-division']);
  
    document.getElementById('employeeForm').style.display = 'block';
  };
  
  const updateEmployee = async (event) => {
    event.preventDefault();
  
    const employeeId = document.getElementById('employeeIdInput').value;
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      showAlert("Anda Belum Login", 'error');
      return;
    }
  
    const targetURL = 'https://asia-southeast2-gis-project-401902.cloudfunctions.net/updatedataemployee';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    const basicSalaryInput = document.getElementById('basicSalaryInput').value;
    const honorDivisionInput = document.getElementById('honorDivisionInput').value;
  
    if (isNaN(basicSalaryInput) || isNaN(honorDivisionInput)) {
      showAlert('Please enter valid numeric values for salary.', 'error');
      return;
    }
  
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        employeeid: employeeId,
        name: document.getElementById('nameInput').value,
        email: document.getElementById('emailInput').value,
        phone: document.getElementById('phoneInput').value,
        division: { divName: document.getElementById('divisionInput').value },
        account: {
          username: document.getElementById('usernameInput').value,
          password: document.getElementById('passwordInput').value,
        },
        salary: {
          'basic-salary': parseInt(basicSalaryInput),
          'honor-division': parseInt(honorDivisionInput),
        },
      }),
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === 200) {
        showAlert('Berhasil Update Data', 'success');
        window.location.href = 'tables_emp.html';
      } else {
        showAlert(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const employeeIdFromURL = new URLSearchParams(window.location.search).get('employeeid');
  if (employeeIdFromURL) {
    document.getElementById('employeeIdInput').value = employeeIdFromURL;
    searchEmployeeById(employeeIdFromURL);
  }
  
  document.getElementById('employeeForm').style.display = 'block';
  
  document.getElementById('employeeForm').addEventListener('submit', updateEmployee);