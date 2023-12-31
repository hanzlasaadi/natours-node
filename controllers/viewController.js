const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  // if (!alert) next();
  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful. Check your email for confirmation!! Thanks for giving us money!!!';
  }
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // 1. get tours data from database
  const tours = await Tour.find();

  // 2. build the template - ✅ at 'overview.pug'

  // 3. render the final template with the data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'All the tours',
      tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. get data for the requested tour - including guides & reviews
  const tourName = req.params.slug.replaceAll('-', ' ');
  const tour = await Tour.findOne({ name: tourName }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour)
    return next(new AppError(404, 'Could not find the requested tour!!!'));
  // console.log(tour);
  // 2. build the template - tour.pug
  // 3. render the pug file with data from (1)
  return res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com https://0.0.0.0:*;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: tour.name,
      tour
    });
});

exports.login = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('login', {
      title: 'Login to your account'
    });
});

exports.signup = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('signup', {
      title: 'Create new account'
    });
});

exports.getDashboard = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('dashboard', {
      title: 'My Account'
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('dashboard', {
      title: 'My Account',
      user: updatedUser
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find all Bookings of the current user
  const myBookings = await Booking.find({ user: req.user.id });

  // 2. Extract tourId's from all the bookings
  const tourIds = myBookings.map(val => val.tour);

  // 3. Find all tours based on the tourId's array
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://0.0.0.0:* ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' unsafe-eval 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('overview', {
      title: 'My Tours',
      tours
    });
});
