/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateInfo = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:6969/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully Updated Info');
      setTimeout(() => {
        location.assign('/me');
      }, 1250);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
