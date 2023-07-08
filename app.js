const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const errorController = require('./controllers/errController');

const app = express();

//-----MIDDLEWAREs-----
//This will only work if before route handler because ORDER matters in Express.js
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(`Added requested time ${req.requestedTime} in the Request Object`);
  next();
});

//MIDDLEWARE: data between request & response - get access of request body on the request object
app.use(express.json());

app.use((req, res, next) => {
  console.log('HELLOO......from the middleware');
  next();
});

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find asset on ${req.originalUrl}!!!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  //Will skip any middleware and go straight to ERROR middleware:;
  next(new AppError(404, `Can't find asset on ${req.originalUrl}!!!`));
});

app.use(errorController);

module.exports = app;
