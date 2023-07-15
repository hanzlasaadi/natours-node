const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: 'String',
      required: [true, 'A review cannot be empty!!!'],
      maxLength: [1000, 'Review cannot be more than 100 characters!!!']
    },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating!!!'],
      max: 5,
      min: 1
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have a referanced Tour!!!']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have a referanced User!!!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index - Compound and Unique
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middleware .save() & .create()
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name image',
  //   model: 'User'
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  //   model: 'Tour'
  // });

  this.populate({
    path: 'user',
    select: 'name image',
    model: 'User'
  });

  next();
});

reviewSchema.statics.calcAvgRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRatings,
      ratingsAvg: stats[0].avgRatings
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAvg: 4.69
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAvgRatings(this.tour);
});

// THIS points to the query, thats why this.r is used... [saving document to the query obj]
// eslint-disable-next-line consistent-return
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();

  if (!this.r)
    return next(new AppError(404, "Could'nt find a review with this ID"));
  next();
});

// this.r document is being used from the query obj to call func calcAvgRatings
reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAvgRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
