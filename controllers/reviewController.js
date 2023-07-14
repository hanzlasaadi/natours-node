/* eslint-disable consistent-return */
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;

  const reviews = await Review.find(filter);

  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(new AppError(404, 'Please enter an ID to find a review!!!'));

  const review = await Review.findById(id);

  if (!review)
    return next(new AppError(404, 'No review found with this ID!!!'));

  return res.status(200).json({
    status: 'success',
    review
  });
});

exports.newReviewReqBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const reqReview = {
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.user,
    tour: req.body.tour,
    createdAt: req.body.createdAt
  };
  if (!reqReview)
    return next(new AppError(401, 'Please enter data for the review!!!'));

  req.body = reqReview;
  next();
};

exports.addNewReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
