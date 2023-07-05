/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

// Describing mongoose schema
const tourSchema = mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: [true, 'A tour must have a name e.g., Hunza Valley']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price tag e.g., 69.9$']
  },
  rating: {
    type: Number,
    default: 6.9
  }
});

//Making a model from mongoose schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//--------TESTING DOCUMENTS FROM MODELS---------
// //Creating an instance of the tour MODEL created above👆 with data
// const testTour = new Tour({
//   name: 'Harvey Specter',
//   price: 129,
//   rating: 7.5
// });

// // Saving the model instance in the database as a DOCUMENT📄
// testTour
//   .save()
//   .then(doc => console.log(doc))
//   .catch(err => console.log('💣💣Error happened💣💣: ', err.message));
