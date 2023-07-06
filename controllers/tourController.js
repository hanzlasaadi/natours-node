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
    console.log(req.query);

    //Query method #1
    // const tours = await Tour.find(req.query);

    //Query method #2
    // const tours = await Tour.find().where('difficulty').equals('easy').where('duration').equals('5');

    // 1A) Making the query[only filtering allowed queries];
    const excludedQueries = ['page', 'sort', 'fields', 'limit'];
    const queryObj = { ...req.query };
    excludedQueries.forEach(el => delete queryObj[el]);

    // 1B) Advanced query filtering
    // const query = Tour.find({ difficulty: 'easy', duration: { $gte: '5' } }); [OLD]
    let advQuery = JSON.stringify(queryObj);
    advQuery = advQuery.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    // console.log(JSON.parse(advQuery));

    let query = Tour.find(JSON.parse(advQuery)); //.find() returns a queryobj to give to DB

    // 2) Sorting
    if (req.query.sort) {
      const manyQueries = req.query.sort.split(',').join(' ');
      query = query.sort(manyQueries);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Limiting Fields in the Results
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This many tours do not exist');
    }

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
