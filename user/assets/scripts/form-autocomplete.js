"use strict";

function autocomplete(e, t) {
  var n;
  function i(e) {
    if (!e) return !1;
    !(function (e) {
      for (var t = 0; t < e.length; t++)
        e[t].classList.remove("autocomplete-active");
    })(e),
      n >= e.length && (n = 0),
      n < 0 && (n = e.length - 1),
      e[n].classList.add("autocomplete-active");
  }
  function a(t) {
    for (
      var n = document.getElementsByClassName("autocomplete-items"), i = 0;
      i < n.length;
      i++
    )
      t != n[i] && t != e && n[i].parentNode.removeChild(n[i]);
  }
  e.addEventListener("input", function (i) {
    var o,
      l,
      s,
      r = this.value;
    if ((a(), !r)) return !1;
    for (
      n = -1,
        (o = document.createElement("DIV")).setAttribute(
          "id",
          this.id + "autocomplete-list"
        ),
        o.setAttribute("class", "autocomplete-items"),
        this.parentNode.appendChild(o),
        s = 0;
      s < t.length;
      s++
    )
      t[s].substr(0, r.length).toUpperCase() == r.toUpperCase() &&
        (((l = document.createElement("DIV")).innerHTML =
          "<strong>" + t[s].substr(0, r.length) + "</strong>"),
        (l.innerHTML += t[s].substr(r.length)),
        (l.innerHTML += "<input type='hidden' value='" + t[s] + "'>"),
        l.addEventListener("click", function (t) {
          (e.value = this.getElementsByTagName("input")[0].value), a();
        }),
        o.appendChild(l));
  }),
    e.addEventListener("keydown", function (e) {
      var t = document.getElementById(this.id + "autocomplete-list");
      t && (t = t.getElementsByTagName("div")),
        40 == e.keyCode
          ? (n++, i(t))
          : 38 == e.keyCode
          ? (n--, i(t))
          : 13 == e.keyCode &&
            (e.preventDefault(), n > -1 && t && t[n].click());
    }),
    document.addEventListener("click", function (e) {
      a(e.target);
    });
}

// ALL LOCATION ARRAY
var locations = [
  "Kantor Pusat SPMT",
  "Branch Dumai",
  "Branch Belawan",
  "Branch Tanjung Intan",
  "Branch Bumiharjo - Bagendang",
  "Branch Tanjung Wangi",
  "Branch Makassar",
  "Branch Balikpapan",
  "Branch Trisakti - Mekar Putih",
  "Branch Jamrud Nilam Mirah",
  "Branch Lembar - Badas",
  "Branch Tanjung Emas",
  "Branch ParePare - Garongkong",
  "Branch Lhokseumawe",
  "Branch Malahayati",
  "Branch Gresik",
];

autocomplete(document.getElementById("autoCompleteLocation"), locations);
