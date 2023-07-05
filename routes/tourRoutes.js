const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

//PARAM Middleware (Don't need anymore bcz of DB validation and its own id)
// router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getATour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
