const Tour = require('./../models/tourModel');

//CheckBody Middleware
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
exports.getAllTours = (req, res) => {
  // console.log(req.url);
  res.send({
    status: 'success'
    // results: tours.length,
    // data: {
    //   tours: tours
    // }
  });
};

exports.getATour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(val => val.id === id);

  res.status(200).send({
    status: 'success',
    requestedTime: req.requestedTime
    // data: {
    //   tour: tour
    // }
  });
};

exports.addNewTour = (req, res) => {
  res.status(201).json({
    status: 'success'
    // results: tours.length,
    // data: {
    //   tour: newTour
    // }
  });
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
