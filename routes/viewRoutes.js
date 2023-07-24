const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
