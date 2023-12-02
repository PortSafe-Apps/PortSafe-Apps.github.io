
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
  
  
  const InsertReport = async (event) => {
    event.preventDefault();
  
    const token = getTokenFromCookies('Login');
  
    if (!token) {
      alert("Header Login Not Found");
      return;
    }
  
    const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';
  
    const myHeaders = new Headers();
    myHeaders.append('Login', token);
    myHeaders.append('Content-Type', 'application/json');
  
    const basicSalaryInput = document.getElementById('newBasicSalaryInput').value;
    const honorDivisionInput = document.getElementById('newHonorDivisionInput').value;
  
    if (isNaN(basicSalaryInput) || isNaN(honorDivisionInput)) {
      alert('Please enter valid numeric values for salary.');
      return;
    }
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        employeeid: document.getElementById('newEmployeeIdInput').value,
        name: document.getElementById('newNameInput').value,
        email: document.getElementById('newEmailInput').value,
        phone: document.getElementById('newPhoneInput').value,
        division: {
          DivId: 0,
          DivName: document.getElementById('newDivisionInput').value,
        },
        account: {
          Username: document.getElementById('newUsernameInput').value,
          Password: document.getElementById('newPasswordInput').value,
          Role: document.getElementById('newRoleInput').value,
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
  
      if (data.status === false) {
        alert(data.message);
      } else {
        alert("Employee data inserted successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  document.getElementById('newEmployeeForm').addEventListener('submit', insertEmployee);
  