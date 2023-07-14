const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.verify, reviewController.addNewReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.verify,
    authController.checkAdmin('admin', 'tour-guide'),
    reviewController.deleteReview
  );

module.exports = router;
