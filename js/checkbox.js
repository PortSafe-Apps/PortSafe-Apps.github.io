var data = {
    "TypeDangerousActions": [
      {
        "TypeId": "1",
        "TypeName": "REAKSI ORANG",
        "SubTypes": [
          "Merubah Fungsi Alat Pelindung Diri",
          "Merubah Posisi",
          "Merubah Cara Kerja",
          "Menghentikan Pekerjaan",
          "Jatuh ke Lantai",
          "Terkunci"
        ]
      },
      {
        "TypeId": "2",
        "TypeName": "ALAT PELINDUNG DIRI",
        "SubTypes": [
          "Kepala",
          "Mata dan Wajah",
          "Telinga",
          "Sistem Pernafasan",
          "Tangan dan Lengan",
          "Dagu",
          "Kaki dan Betis"
        ]
      },
      {
        "TypeId": "3",
        "TypeName": "Posisi Orang",
        "SubTypes": [
          "Terbentur Pada",
          "Tertabrak oleh",
          "Terjepit didalam, pada atau diantara",
          "Terjatuh",
          "Terkena Temperatur Tinggi",
          "Tersengat Arus Listrik",
          "Terhirup",
          "Terisap, Terserap",
          "Tertelan Benda Berbahaya",
          "Memaksakan Pekerjaan yang Terlalu Berat"
        ]
      },
      {
        "TypeId": "4",
        "TypeName": "ALAT DAN PERLENGKAPAN",
        "SubTypes": [
          "Tidak Sesuai Dengan Jenis Pekerjaan",
          "Digunakan Secara Tidak Benar",
          "Dalam Kondisi yang Tidak Aman"
        ]
      },
      {
        "TypeId": "5",
        "TypeName": "PROSEDUR DAN CARA KERJA",
        "SubTypes": [
          "Tidak Memenuhi",
          "Tidak diketahui/dimengerti",
          "Tidak diikuti"
        ]
      }
    ]
  };

// Function to create checkboxes
function createCheckboxes(data) {
    var container = document.getElementById("checkboxContainer");

    data.TypeDangerousActions.forEach(function (action) {
        var actionDiv = document.createElement("div");
        actionDiv.className = "element-heading form-label";  // Updated class name
        actionDiv.innerHTML = "<h6>" + action.TypeName + "</h6>";

        var subTypesArray = [];  // Array untuk menyimpan subTypes

        action.SubTypes.forEach(function (subType) {
            var checkboxContainer = document.createElement("div");  // Container for checkbox and label
            checkboxContainer.className = "form-check";  // Updated class name

            var checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.name = action.TypeName;
            checkbox.value = subType;
            checkbox.id = action.TypeId 

            var label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = checkbox.id;
            label.appendChild(document.createTextNode(subType));

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            actionDiv.appendChild(checkboxContainer);

            // Menambahkan subType ke dalam array
            subTypesArray.push(subType);
        });

        // Menampilkan typeId, typeName, dan subTypes
        console.log("typeId:", action.TypeId);
        console.log("typeName:", action.TypeName);
        console.log("subTypes:", subTypesArray);

        container.appendChild(actionDiv);
    });
}


// Call the function with your data
createCheckboxes(data);
