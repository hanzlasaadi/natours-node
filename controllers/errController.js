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

const prodErrorHandler = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    return res.status(err.statusCode).json({
      status: 500,
      message:
        'Something went very verY veRY vERY VERY VERRYY VEERRRYYY VERRRRYY wrong!'
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!!!',
      msg: err.message
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!!!',
    msg: 'Something went very verry wrong!!!⚠⚠💣💣'
  });
};

const devErrorHandler = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B) RENDERED PAGE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
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

    prodErrorHandler(err, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    devErrorHandler(err, req, res);
  }
};
