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

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Park Camper Tour'
  });
};
