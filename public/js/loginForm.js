/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Logged In');
      setTimeout(() => {
        location.assign('/');
      }, 850);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
