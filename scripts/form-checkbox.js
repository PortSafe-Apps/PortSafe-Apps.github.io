var data = {
  TypeDangerousActions: [
    {
      TypeId: "1",
      TypeName: "REAKSI ORANG",
      SubTypes: [
        "Merubah Fungsi Alat Pelindung Diri",
        "Merubah Posisi",
        "Merubah Cara Kerja",
        "Menghentikan Pekerjaan",
        "Jatuh ke Lantai",
        "Terkunci",
      ],
    },
    {
      TypeId: "2",
      TypeName: "ALAT PELINDUNG DIRI",
      SubTypes: [
        "Kepala",
        "Mata dan Wajah",
        "Telinga",
        "Sistem Pernafasan",
        "Tangan dan Lengan",
        "Dagu",
        "Badan",
        "Kaki dan Betis",
      ],
    },
    {
      TypeId: "3",
      TypeName: "POSISI ORANG",
      SubTypes: [
        "Terbentur Pada",
        "Tertabrak oleh",
        "Terjepit didalam, pada atau diantara",
        "Terjatuh",
        "Terkena Temperatur Tinggi",
        "Tersengat Arus Listrik",
        "Terhirup",
        "Terisap, Terserap",
        "Tertelan Benda Berbahaya",
        "Memaksakan Pekerjaan yang Terlalu Berat",
      ],
    },
    {
      TypeId: "4",
      TypeName: "ALAT DAN PERLENGKAPAN",
      SubTypes: [
        "Tidak Sesuai Dengan Jenis Pekerjaan",
        "Digunakan Secara Tidak Benar",
        "Dalam Kondisi yang Tidak Aman",
      ],
    },
    {
      TypeId: "5",
      TypeName: "PROSEDUR DAN CARA KERJA",
      SubTypes: [
        "Tidak Memenuhi",
        "Tidak diketahui/dimengerti",
        "Tidak diikuti",
      ],
    },
  ],
};

// Function to create checkboxes
function createCheckboxes(data) {
  var container = document.getElementById("checkboxContainer");

  data.TypeDangerousActions.forEach(function (action) {
    var actionDiv = document.createElement("div");
    actionDiv.className = "list-group list-custom-small list-icon-0";

    var collapseLink = document.createElement("a");
    collapseLink.setAttribute("data-bs-toggle", "collapse");
    collapseLink.className = "no-effect";
    collapseLink.href = "#collapse-" + action.TypeId;

    var span = document.createElement("span");
    span.className = "font-14";
    span.innerText = action.TypeName;

    var angleDownIcon = document.createElement("i");
    angleDownIcon.className = "fa fa-angle-down";

    collapseLink.appendChild(span);
    collapseLink.appendChild(angleDownIcon);

    actionDiv.appendChild(collapseLink);

    var collapseDiv = document.createElement("div");
    collapseDiv.className = "collapse";
    collapseDiv.id = "collapse-" + action.TypeId;

    action.SubTypes.forEach(function (subType) {
      var checkboxContainer = document.createElement("div");
      checkboxContainer.className = "form-check icon-check mb-0"; // Tambahkan utility class Bootstrap mb-2

      var checkbox = document.createElement("input");
      checkbox.className = "form-check-input";
      checkbox.type = "checkbox";
      checkbox.value = subType;
      checkbox.id = action.TypeId + "_" + subType.replace(/\s+/g, "_");

      var label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = checkbox.id;
      label.appendChild(document.createTextNode(subType));

      var iconCheck1 = document.createElement("i");
      iconCheck1.className =
        "icon-check-1 fa fa-square color-gray-dark font-16";

      var iconCheck2 = document.createElement("i");
      iconCheck2.className =
        "icon-check-2 fa fa-check-square font-16 color-highlight";

      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
      checkboxContainer.appendChild(iconCheck1);
      checkboxContainer.appendChild(iconCheck2);

      collapseDiv.appendChild(checkboxContainer);
    });
    actionDiv.appendChild(collapseDiv);
    container.appendChild(actionDiv);
  });
}

// Panggil fungsi dengan data Anda
createCheckboxes(data);
