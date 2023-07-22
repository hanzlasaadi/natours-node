/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//-----GLOBAL MIDDLEWAREs-----
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development Logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Helmet - set security HTTP headers
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Try again after an hour!'
});
app.use('/api', limiter);

//MIDDLEWARE: body parse - get access of request body on the request object - reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization - nosql injections
app.use(mongoSanitize());

// Data sanitization - JS scripts in html
app.use(xss());

// HTTP Parameter Prevention
app.use(
  hpp({
    whitelist: [
      'price',
      'duration',
      'difficulty',
      'ratingsQuantity',
      'ratingsAvg',
      'maxGroupSize'
    ]
  })
);

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(`Added requested time ${req.requestedTime} in the Request Object`);
  console.log('HELLOO......from the middleware');
  next();
});

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Park Camper',
    user: 'Hanzla'
  });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// ERROR Middleware
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find asset on ${req.originalUrl}!!!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  //Will skip any middleware and go straight to ERROR middleware:;
  next(new AppError(404, `Can't find asset on ${req.originalUrl}!!!`));
});

app.use(errorController);

module.exports = app;
