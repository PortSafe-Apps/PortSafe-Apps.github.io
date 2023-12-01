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
        const userRole = data.data.role; // Asumsikan respons memiliki properti 'role'
        console.log('Role Pengguna:', userRole);
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
  
  // Function to display user data in the table
//   function displayUserData(userData) {
//     const userDataBody = document.getElementById('userDataBody');
  
//     if (userData && userData.length > 0) {
//       userData.forEach(user => {
//         const newRow = document.createElement('tr');
//         newRow.innerHTML = `
//           <td class="px-4 py-3">
//             <div class="flex items-center text-sm">
//               <div>
//                 <p class="font-semibold">${user.username}</p>
//               </div>
//             </div>
//           </td>
//           <td class="px-4 py-3 text-sm">
//             <p class="font-semibold">${user.password}</p>
//           </td>
//           <td class="px-4 py-3">
//             <a href="#" class="delete-link" data-employeeid="${user.username}">Delete</a>
//           </td>
//         `;
//         userDataBody.appendChild(newRow);
  
        // Add event listener for delete link
//         const deleteLink = newRow.querySelector('.delete-link');
//         deleteLink.addEventListener('click', (event) => {
//           event.preventDefault();
//           const usernameToDelete = event.target.getAttribute('data-employeeid');
//           deleteUser(usernameToDelete);
//         });
//       });
//     } else {
//       userDataBody.innerHTML = '<tr><td colspan="3">No user data found.</td></tr>';
//     }
//   }