/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateInfo = async (obj, bool) => {
  try {
    const url = bool === 'password' ? 'updatePassword' : 'updateMe';
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:6969/api/v1/users/${url}`,
      data: obj
    });

    if (res.data.status === 'success') {
      showAlert('success', `Successfully Updated ${bool.toUpperCase()}`);
      setTimeout(() => {
        location.assign('/me');
      }, 850);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
