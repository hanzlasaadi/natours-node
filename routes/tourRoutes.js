const tourController = require('./../controllers/tourController');
const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
