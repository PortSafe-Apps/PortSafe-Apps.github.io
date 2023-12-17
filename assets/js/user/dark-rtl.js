"use strict";

var darkSwitch = document.getElementById("darkSwitch");
var moonIcon = document.getElementById("moonIcon");

var currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    if (darkSwitch) {
      darkSwitch.checked = true;
      updateIcon("sun");
    }
  }
}

function switchTheme(e) {
  console.log("Switch Theme Event Fired");
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    updateModeText("Switching to Dark mode");
    updateIcon("sun");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    updateModeText("Switching to Light mode");
    updateIcon("moon");
  }
}

function updateModeText(text) {
  // Tambahkan implementasi sesuai kebutuhan
  console.log(text);
}

if (moonIcon) {
  moonIcon.addEventListener("click", function () {
    darkSwitch.checked = !darkSwitch.checked;
    switchTheme({ target: { checked: darkSwitch.checked } });
  });
}

function updateIcon(icon) {
  if (moonIcon) {
    moonIcon.className = "bi " + (icon === "sun" ? "bi-sun" : "bi-moon");
  }
}