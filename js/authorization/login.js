import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { PostLogin, ResponseLogin } from "../config/config.js";
import { URLLogin } from "../template/template.js";
import { token } from '../template/template.js';

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");
  const preloader = document.getElementById("preloader");

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    preloader.style.display = 'block'; // Menampilkan preloader

    let data = PostLogin();
    postWithToken(URLLogin, 'Authorization', 'Bearer ' + token, data, ResponseLogin);

    setTimeout(function () {
        preloader.style.display = 'none'; 
    }, 2000);
  });
});
