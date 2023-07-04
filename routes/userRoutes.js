const userController = require('./../controllers/userController');
const express = require('express');

const router = express.Router();

//PARAM Middleware
router.param('id', userController.checkId);

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
