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
    console.log(req.query);

    //Query method #1
    // const tours = await Tour.find(req.query);

    //Query method #2
    // const tours = await Tour.find().where('difficulty').equals('easy').where('duration').equals('5');

    //Making the query[only filtering allowed queries];
    const excludedQueries = ['page', 'sort', 'fields', 'limit'];
    const queryObj = { ...req.query };
    excludedQueries.forEach(el => delete queryObj[el]);

    // Advanced query filtering
    // const query = Tour.find({ difficulty: 'easy', duration: { $gte: '5' } }); [OLD]
    let advQuery = JSON.stringify(queryObj);
    advQuery = advQuery.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    console.log(JSON.parse(advQuery));

    const query = Tour.find(JSON.parse(advQuery)); //.find() returns a queryobj to give to DB

    // Executing Query;
    const tours = await query;

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
