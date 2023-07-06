const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

//CheckBody Middleware
// eslint-disable-next-line consistent-return
exports.checkBody = (req, res, next) => {
  console.log('Checkbody middleware is working');
  if (!req.body)
    return res.status(400).send({
      status: 'fail',
      message: 'Request not found'
    });
  if (!req.body.name || !req.body.price) {
    return res.status(400).send({
      status: 'fail',
      message: 'Request does not contain required properties'
    });
  }
  next();
};

// --------Alias Top 5 Cheapest Tours-------
exports.aliasTopFive = function(req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAvg,price';
  req.query.fields = 'name,ratingsAvg,duration,difficulty,summary,price';

  next();
};

//------ROUTE HANDLERS/CONTROLLERS------
exports.getAllTours = async function(req, res) {
  try {
    // Making "API Features" Instance
    const features = new APIFeatures(Tour.find(), req.query);

    // Running all class methods;
    features
      .filter()
      .limitFields()
      .sort()
      .paginate();

    // Executing Query;
    const tours = await features.query;

    res.send({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getATour = async function(req, res) {
  try {
    const tour = await Tour.findById(req.params.id);
    res.send({
      status: 'success',
      data: {
        tours: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.addNewTour = async (req, res) => {
  try {
    // const newTour = new Tour();
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: {
        tour: null
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
