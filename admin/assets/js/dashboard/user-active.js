// Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName) {
          return value;
      }
  }
  return null;
}

const getActiveUser = async () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  const compromised = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportCompromised';
  const unsafe = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport';

  const myHeaders = new Headers();
  myHeaders.append("Login", token);

  try {
    const [compromisedResponse, unsafeResponse] = await Promise.all([
      fetch(compromised, { method: "POST", headers: myHeaders, redirect: "follow" }),
      fetch(unsafe, { method: "POST", headers: myHeaders, redirect: "follow" })
    ]);

    if (!compromisedResponse.ok || !unsafeResponse.ok) {
      throw new Error("Failed to fetch data.");
    }

    const compromisedResult = await compromisedResponse.json();
    const unsafeResult = await unsafeResponse.json();

    // Check if sortedUsers is defined, otherwise use an empty array
    const sortedUsers = compromisedResult.sortedUsers || unsafeResult.sortedUsers || [];

    // Check if sortedUsers is an array and not empty before proceeding
    if (!Array.isArray(sortedUsers) || sortedUsers.length === 0) {
      console.error("Sorted users data is undefined, not an array, or an empty array.");
      return;
    }

    const mergedData = [...compromisedResult.data, ...unsafeResult.data];

    displayUserReports(mergedData, sortedUsers, "userActive");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getActiveUser();
