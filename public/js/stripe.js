/* eslint-disable */
// const stripe = Stripe(
//   'pk_test_51NZk3CKw6SLopStGEoA0L5Qe9q26jL2WqJaZbLrdNk8iJCB4Sc3U3EdPICbtc8A5qrbCIGUmZYWYyLcbsv8vpcur00h4iWADCp'
// );
import axios from 'axios';

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `http://127.0.0.1:6969/api/v1/bookings/checkout-session/${tourId}`
    );
    if (session.data.status === 'success')
      window.location.assign(`${session.data.session.url}`);
  } catch (err) {
    console.log(err.message);
    showAlert('error', err.message);
  }
};
