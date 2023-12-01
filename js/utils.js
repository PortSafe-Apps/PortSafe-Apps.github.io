export function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  
    return JSON.parse(jsonPayload);
  }

  export function redirectBasedOnRole(decodedToken) {
    switch (decodedToken.role) {
      case 'admin':
        window.location.href = 'https://portsafe-apps.github.io/pages/admin/dashboard.html';
        break;
      case 'user':
        window.location.href = 'https://portsafe-apps.github.io/pages/user/beranda.html';
        break;
      default:
        console.error('Role tidak valid atau tidak terdefinisi');
    }
  }