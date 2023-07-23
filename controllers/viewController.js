const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1. get tours data from database
  const tours = await Tour.find();

  // 2. build the template - ✅ at 'overview.pug'

  // 3. render the final template with the data
  res.status(200).render('overview', {
    title: 'All the tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1. get data for the requested tour - including guides & reviews
  const tourName = req.params.slug.replaceAll('-', ' ');
  const tour = await Tour.findOne({ name: tourName }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  console.log(tour);
  // 2. build the template - tour.pug
  // 3. render the pug file with data from (1)
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});
