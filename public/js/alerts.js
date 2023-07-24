/* eslint-disable */
export const hideAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) alert.parentElement.removeChild(alert);
};

export const showAlert = (status, msg) => {
  hideAlert();
  document
    .querySelector('body')
    .insertAdjacentHTML(
      'afterbegin',
      `<div class='alert alert--${status}'>${msg}</div>`
    );
  window.setTimeout(hideAlert, 4000);
};
