// eslint-disable-next-line import/no-extraneous-dependencies
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
