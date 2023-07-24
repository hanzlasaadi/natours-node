/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:6969/api/v1/users/logout'
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out, please try again');
    console.log(err.response.data.message);
  }
};
