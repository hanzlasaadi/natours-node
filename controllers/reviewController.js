const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

exports.addNewReview = catchAsync(async (req, res, next) => {
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
    return next(new AppError(401, 'Please enter data for reviews!!!'));

  const review = await Review.create(reqReview);

  if (!review)
    return next(new AppError(401, 'Please provide a valid id for a Review!!!'));

  return res.status(201).json({
    status: 'success',
    review
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(new AppError(404, 'Please enter an ID to delete a review!!!'));

  const review = await Review.findByIdAndDelete(id);

  if (!review)
    return next(new AppError(404, 'No review found with this ID!!!'));

  return res.status(204).json({
    status: 'success',
    review
  });
});
