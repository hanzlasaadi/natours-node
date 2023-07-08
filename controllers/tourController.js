const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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
exports.getAllTours = catchAsync(async function(req, res, next) {
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
});

exports.getATour = catchAsync(async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(404, 'No tour could be found with this ID!!!'));
  }

  return res.send({
    status: 'success',
    data: {
      tours: tour
    }
  });
});

exports.addNewTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour();
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    next(new AppError(404, 'The tour could not be found!!!'));
  }

  res.status(204).json({
    status: 'success',
    data: {
      tour: null
    }
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAvg: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numOfTours: { $sum: 1 },
        totalRatingsAverage: { $avg: '$ratingsAvg' },
        numOfRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $addFields: {
        roundedAvgPrice: { $round: ['$avgPrice', 1] },
        totalRatingsAverageRound: { $round: ['$totalRatingsAverage', 1] }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    {
      $project: { avgPrice: 0, totalRatingsAverage: 0 }
    }
    // {
    //   $match: { $difficulty: { $ne: 'easy' } }
    // }
    // {
    //   $project: { roundedValue: { $round: ['$avgPrice', 1] } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year, limit } = req.params;

  const monthlyData = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        monthNumber: '$_id'
      }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTours: -1 }
    },
    {
      $limit: +limit || 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: monthlyData.length,
    data: {
      monthlyData
    }
  });
});
