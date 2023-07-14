/* eslint-disable consistent-return */
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('./factoryHandlers');

exports.filterReviews = (req, res, next) => {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

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
