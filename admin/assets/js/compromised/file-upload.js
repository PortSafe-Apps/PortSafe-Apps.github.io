// Fungsi untuk menghasilkan angka acak antara 1 dan 1000
function generateRandomID() {
    return Math.floor(Math.random() * 1000) + 1;
  }
  
  // Fungsi untuk menampilkan gambar dari URL
  function tampilkanGambarDariUrl(url, imgElement) {
    imgElement.src = url;
  }
  
  // Fungsi untuk mengekstrak URL gambar dari respons server
  function extractImageUrl(responseText) {
    const urlPattern = /URL publik:(.*)/;
    const match = responseText.match(urlPattern);
  
    if (match && match[1]) {
        const imageUrl = match[1].trim();
        return imageUrl;
    } else {
        return null;
    }
  }
  
  // Fungsi untuk mengambil foto dan mengunggahnya
  function ambilFoto(inputElement, imgElement, resultElement) {
    const fileInput = inputElement.files[0];
  
    if (fileInput) {
        const formData = new FormData();
        const jenisFoto = inputElement.getAttribute("data-jenis");
        const randomID = generateRandomID();
        const uniqueFileName = `${jenisFoto}${randomID}_${fileInput.name}`;
  
        formData.append("image", fileInput, uniqueFileName);
  
        fetch(
            "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/uploadImage",
            {
                method: "POST",
                body: formData,
            }
        )
            .then((response) => response.text())
            .then((data) => {
                const imageUrl = extractImageUrl(data);
  
                if (imageUrl) {
                    tampilkanGambarDariUrl(imageUrl, imgElement);
                    // Tambahan untuk menangani data dari URL publik dan menyimpannya
                    handlePublicUrlData(imageUrl, resultElement);
                } else {
                    console.error(
                        "Tidak dapat menemukan URL gambar dalam respons server."
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
  }
  
  // Fungsi untuk menangani data dari URL publik dan menyimpannya di elemen hasilFotoObservasi atau hasilFotoPerbaikan
  function handlePublicUrlData(url, resultElement) {
    // Menyimpan URL publik di elemen hasilFotoObservasi atau hasilFotoPerbaikan
    resultElement.innerHTML = url;
  }
  
  // Fungsi untuk menyiapkan unggahan foto
  function prepareUpload(event, imgElement, resultElement) {
    const files = event.target.files;
  
    if (files && files[0]) {
        tampilkanGambarDariUrl(URL.createObjectURL(files[0]), imgElement);
        ambilFoto(event.target, imgElement, resultElement);
    }
  
    const fileName = files[0].name;
  

    uploadFileDataElement.classList.remove("disabled");
    document.querySelector(".upload-file-name").innerHTML = fileName;
  }
  

  // Attach event listener for file upload change - Tindak Lanjut
  const fotoTindakLanjutInput = document.getElementById("fotoTindakLanjut");
  fotoTindakLanjutInput.addEventListener("change", function (event) {
    prepareUpload(event, document.getElementById("hasilFotoTindakLanjut"), document.getElementById("hasilFotoTindakLanjut"));
  });
  