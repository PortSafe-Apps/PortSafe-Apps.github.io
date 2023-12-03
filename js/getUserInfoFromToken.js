const getUserInfoFromToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(atob(base64));
  
    const userInfo = {
      Nipp: decodedData.nipp,
      Nama: decodedData.nama,
      Jabatan: decodedData.jabatan,
      Divisi: decodedData.divisi,
      Bidang: decodedData.bidang,
    };
  
    return userInfo;
  };
  