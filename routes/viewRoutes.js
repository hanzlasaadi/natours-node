const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/tour/:slug', authController.verify, viewController.getTour);

module.exports = router;
