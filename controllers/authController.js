// eslint-disable-next-line import/no-extraneous-dependencies
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async function(req, res, next) {
  const { email, password } = req.body;

  // 1. Check if email & password are present
  if (!email || !password)
    return next(new AppError(400, 'Enter an email and password!!!'));

  // 2. Check if email & password are correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'Invalid email or password!!!'));
  }

  // 3. Generate token if true
  const token = signToken(user._id);

  // 4. Send response
  return res.status(200).json({
    status: 'success',
    token
  });
});

exports.verify = catchAsync(async function(req, res, next) {
  let token;
  // 1. Getting token and checking if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError(401, 'Please Login!!!'));

  // 2. Verification of the token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT
  );

  // 3. Checking if user still exists
  const freshUser = await User.findById(decodedData.id);
  // console.log(freshUser);

  // 4. Check if user changed password after the token was issued.
  if (freshUser.checkChangedPassword(decodedData.iat))
    return next(new AppError('User changed password recently, Login again!!!'));

  // Every Test is passed and user is verified
  req.body = freshUser;
  return next();
});
