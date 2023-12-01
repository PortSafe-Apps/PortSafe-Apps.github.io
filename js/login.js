import { postWithToken } from 'https://jscroot.github.io/api/croot.js';
import { PostLogin, ResponseLogin } from './config.js';
import { URLLogin, token } from './template.js';
import { decodeToken, redirectBasedOnRole } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    let data = PostLogin();

    try {
      // Pastikan token tersedia sebelum mengirimkan permintaan
      console.log('Token:', token);

      const response = await postWithToken(URLLogin, 'Authorization', 'Bearer ' + token, data, ResponseLogin);

      if (response && response.token) {
        const decodedToken = decodeToken(response.token);
        
        // Lakukan redirect berdasarkan peran (role)
        redirectBasedOnRole(decodedToken);
      } else {
        console.error('Token tidak ditemukan dalam respons.');
        // Handle token not found error, show message, etc.
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle other errors, show message, etc.
    }
  });
});
