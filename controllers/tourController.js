const Tour = require('./../models/tourModel');

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

//------ROUTE HANDLERS/CONTROLLERS------
exports.getAllTours = async function(req, res) {
  try {
    const tours = await Tour.find();
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

// exports.addNewTour = (req, res) => async {
exports.addNewTour = async function(req, res) {
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

exports.updateTour = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      tour: 'Updated tour...'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send({
    status: 'success',
    data: {
      tour: null
    }
  });
};
