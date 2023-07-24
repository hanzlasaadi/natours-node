/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:6969/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Signed Up');
      setTimeout(() => {
        location.assign('/');
      }, 950);
    }
    console.log('Successfully Signed Up!!!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
