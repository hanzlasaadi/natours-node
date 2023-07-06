/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

// Describing mongoose schema
const tourSchema = mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, 'A tour must have a name e.g., Hunza Valley'],
      trim: true
    },
    slug: String,
    secretTour: Boolean,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration! (a number)']
    },
    difficulty: {
      type: String,
      required: [
        true,
        'A tour must have a difficulty level! (easy, medium, hard)'
      ]
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Must define a good enough group size!']
    },
    summary: {
      type: String,
      required: [true, 'You must provide a summary of the tour!'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    priceDiscount: Number,
    ratingsAvg: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    imageCover: {
      type: String,
      required: [true, 'must have a cover image']
    },
    images: [String],
    price: {
      type: Number,
      required: [true, 'A tour must have a price tag e.g., 69.9$']
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Properties
tourSchema.virtual('durationinWeeks').get(function() {
  return (this.duration / 7).toPrecision(3);
});

// Mongoose Middleware - Document Middleware
//PRE-SAVE HOOK
// tourSchema.pre('save', function(next) {
//   this.slug = this.name
//     .toLowerCase()
//     .split(' ')
//     .join('-');
//   console.log(this.slug);
//   next();
// });

//POST-SAVE HOOK
// tourSchema.post('save', function(doc, next) {
//   console.log(doc.slug);
//   next();
// });

// Mongoose Middleware - Query
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post('find', function(query, next) {
  // console.log(query);
  next();
});

// Mongoose Middleware - Aggregation
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
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
