/* eslint-disable */
import '@babel/polyfill';
import { login } from './loginForm';
import { signup } from './signupForm';
import { logout } from './logout';
import { displayMap } from './mapbox';

const form = document.querySelector('.form--login');
const mapBox = document.getElementById('map');
const logoutBtn = document.querySelector('.logout__btn');

if (mapBox) displayMap(JSON.parse(mapBox.dataset.locations));

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //only if the crr form is a signup form...
    if (e.target.classList.contains('form--signup')) {
      const name = document.getElementById('name').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
      return signup(name, email, password, passwordConfirm);
    }
    return login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);
