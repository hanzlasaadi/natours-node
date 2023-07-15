const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//PARAM Middleware
// router.param('id', userController.checkId);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/updateMe').patch(authController.verify, userController.updateMe);

router
  .route('/deleteMe')
  .delete(authController.verify, userController.deleteMe);

router
  .route('/updatePassword')
  .patch(authController.verify, authController.updatePassword);

router.get(
  '/me',
  authController.verify,
  userController.getMe,
  userController.getOneUser
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
