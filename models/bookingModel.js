const mongoose = require('mongoose');

const bookingsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking must have a referanced Tour!!!']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A booking must have a referanced User!!!']
  },
  price: {
    type: Number,
    required: [true, 'A booking must have a price!!!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

// Query Middleware .save() & .create()
bookingsSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name price',
    model: 'Tour'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingsSchema);

module.exports = Booking;
