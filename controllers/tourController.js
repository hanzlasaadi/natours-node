const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const factory = require('./factoryHandlers');
// const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/appError');

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
exports.getAllTours = factory.getAll(Tour);

exports.getATour = factory.getOne(Tour, { path: 'reviews' });

exports.addNewTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

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

exports.toursNear = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');
  // console.log(distance, latlng, unit);

  // const meters = unit === 'mi' ? distance * 1609.34 : distance * 1000;
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  // console.log(meters);

  if (!lat || !lng)
    return next(
      new AppError(
        400,
        'Provide latitude and longitude in the form: lat,lng!!!'
      )
    );

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  // const tours = await Tour.find({
  //   startLocation: {
  //     $near: {
  //       $geometry: {
  //         type: 'Point',
  //         coordinates: [lng, lat]
  //       },
  //       $maxDistance: meters,
  //       $minDistance: 50
  //     }
  //   }
  // });
  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours
  });
});
