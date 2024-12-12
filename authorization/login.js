import { postWithToken } from "https://jscroot.github.io/api/croot.js";
import { PostLogin, ResponseLogin } from "../authorization/config.js";
import { URLLogin } from "../authorization/template.js";
import { token } from '../authorization/template.js';

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    let data = PostLogin();
    postWithToken(URLLogin, 'Authorization', 'Bearer ' + token, data, ResponseLogin);
  });
});