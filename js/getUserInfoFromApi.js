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

export const getUserInfoFromApi = async () => {
  const apiUrl = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';

  try {
    // Get the token from cookies
    const token = getTokenFromCookies('Login');
    console.log('Token:', token);

    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Login': token,
      },
    });
    console.log('Response:', response);

    const data = await response.json();

    if (response.ok) {
      console.log('Data:', data);
      return data;
    } else {
      console.error('Error:', data.message);
      throw new Error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};