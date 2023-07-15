const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.verify); //everybody needs to be logged in to access reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.checkAdmin('user'),
    reviewController.newReviewReqBody,
    reviewController.addNewReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.checkAdmin('admin', 'user'),
    reviewController.deleteReview
  )
  .patch(
    authController.checkAdmin('admin', 'user'),
    reviewController.updateReview
  );

module.exports = router;
