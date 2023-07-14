const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: 'String',
      required: [true, 'A review cannot be empty!!!'],
      maxLength: [100, 'Review cannot be more than 100 characters!!!']
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
