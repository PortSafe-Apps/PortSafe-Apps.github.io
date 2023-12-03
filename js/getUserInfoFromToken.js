export const getUserInfoFromApi = async (token) => {
  const apiUrl = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/getUser';

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Login': token, 
      },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
