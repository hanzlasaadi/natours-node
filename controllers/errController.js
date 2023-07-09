const AppError = require('../utils/appError');

const castErrorHandlerDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const handleInvalidToken = () =>
  new AppError(401, 'Invalid Token. Please login again!');

const handleExpiredToken = () =>
  new AppError(401, 'Expired Token. Please login again!');

const prodErrorHandler = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(err.statusCode).json({
      status: 500,
      message:
        'Something went very verY veRY vERY VERY VERRYY VEERRRYYY VERRRRYY wrong!'
    });
  }
};

const devErrorHandler = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // let error;

    if (err.kind === 'ObjectId') err = castErrorHandlerDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleInvalidToken();
    if (err.name === 'TokenExpiredError') err = handleExpiredToken();

    prodErrorHandler(res, err);
  } else if (process.env.NODE_ENV === 'development') {
    devErrorHandler(res, err);
  }
};
