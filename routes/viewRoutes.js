const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.use(authController.isLoggedIn);

router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/tour/:slug', viewController.getTour);

router.use(authController.verify);

router.get('/my-tours', viewController.getMyTours);
router.get('/me', viewController.getDashboard);
router.post('/update-user-data', viewController.updateUserData);

module.exports = router;
