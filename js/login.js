import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { PostLogin, ResponseLogin } from "./config/config.js";
import { URLLogin } from "./template/template.js";
import { token } from './template/template.js';

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");
  const loadingSpinner = document.getElementById("preloader");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    loadingSpinner.classList.add("active"); 
    setTimeout(() => {
        loadingSpinner.classList.remove("active"); 
    }, 2000); 
    let data = PostLogin();
    postWithToken(URLLogin, 'Authorization', 'Bearer ' + token, data, ResponseLogin);
  });
});