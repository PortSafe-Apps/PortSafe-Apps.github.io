 //File Upload
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
      function ambilFoto(inputElement, imgElement) {
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
                handlePublicUrlData(
                  imageUrl,
                  document.getElementById("hasilFotoObservasi")
                );
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
  
      // Fungsi untuk menangani data dari URL publik dan menyimpannya di elemen hasilFotoObservasi
      function handlePublicUrlData(url, resultElement) {
        // Menyimpan URL publik di elemen hasilFotoObservasi
        resultElement.innerHTML = url;
      }
  
      function prepareUpload(event, imgElement) {
          const files = event.target.files;
        
          if (files && files[0]) {
            tampilkanGambarDariUrl(URL.createObjectURL(files[0]), imgElement);
            ambilFoto(event.target, imgElement);
          }
        
          const fileName = files[0].name;
          document.getElementsByClassName("file-data")[0].classList.add("disabled");
          document
            .getElementsByClassName("upload-file-data")[0]
            .classList.remove("disabled");
          document.getElementsByClassName("upload-file-name")[0].innerHTML = fileName;
          document.getElementsByClassName("upload-file-modified")[0].innerHTML = files[0].lastModifiedDate;
          document.getElementsByClassName("upload-file-size")[0].innerHTML = (files[0].size / 1000).toFixed(2) + " KB";
          document.getElementsByClassName("upload-file-type")[0].innerHTML = files[0].type;
        }
      
      // Attach event listener for file upload change
      const fotoObservasiInput = document.getElementById("fotoObservasi");
      fotoObservasiInput.addEventListener("change", function (event) {
        prepareUpload(event, document.getElementById("hasilFotoObservasi"));
      });
  
      const fotoPerbaikanInput = document.getElementById("fotoPerbaikan");
      fotoPerbaikanInput.addEventListener("change", function (event) {
        prepareUpload(event, document.getElementById("hasilFotoPerbaikan"));
      });