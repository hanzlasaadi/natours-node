const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.verify,
    authController.checkAdmin('user'),
    reviewController.addNewReview
  )
  .get(reviewController.getAllReviews);

// router
//   .route('/')
//   .get(reviewController.getAllReviews)
//   .post(authController.verify, reviewController.addNewReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.verify,
    authController.checkAdmin('admin', 'tour-guide'),
    reviewController.deleteReview
  );

module.exports = router;
