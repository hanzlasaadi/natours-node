const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.use(authController.isLoggedIn);

router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/tour/:slug', viewController.getTour);

// router.use(authController.verify);

router.get('/my-tours', authController.verify, viewController.getMyTours);
router.get('/me', authController.verify, viewController.getDashboard);
router.post(
  '/update-user-data',
  authController.verify,
  viewController.updateUserData
);

module.exports = router;
