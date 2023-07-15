const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//PARAM Middleware (Don't need anymore bcz of DB validation and its own id)
// router.param('id', tourController.checkId);

// mounted review router to tour router whenever '/:tourId/reviews' is requested
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopFive, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/report/:year/:limit?')
  .get(
    authController.verify,
    authController.checkAdmin('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-distance/:distance/latlng/:latlng/unit/:unit')
  .get(tourController.toursNear);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.verify,
    authController.checkAdmin('admin', 'lead-guide'),
    tourController.addNewTour
  );

router
  .route('/:id')
  .get(tourController.getATour)
  .patch(
    authController.verify,
    authController.checkAdmin('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.verify,
    authController.checkAdmin('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
