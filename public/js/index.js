/* eslint-disable */
import '@babel/polyfill';
import { login } from './loginForm';
import { signup } from './signupForm';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { updateInfo } from './updateInfo';
import { bookTour } from './stripe';

const form = document.querySelector('.form--login');
const mapBox = document.getElementById('map');
const logoutBtn = document.querySelector('.logout__btn');
const formDataUpdate = document.querySelector('.form-user-data');
const formPassUpdate = document.querySelector('.form-user-settings');
const checkoutBtn = document.getElementById('book-tour');

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

if (formDataUpdate) {
  formDataUpdate.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    return updateInfo(form, 'data');
  });
}

if (formPassUpdate) {
  formPassUpdate.addEventListener('submit', async e => {
    e.preventDefault();
    const updateBtn = document.querySelector('.update--loader');
    updateBtn.textContent = 'Updating Password...';

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmNewPassword = document.getElementById('password-confirm')
      .value;

    await updateInfo(
      { currentPassword, newPassword, confirmNewPassword },
      'password'
    );

    // currentPassword = newPassword = confirmNewPassword = '';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    updateBtn.textContent = 'Save password';
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing....';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);
