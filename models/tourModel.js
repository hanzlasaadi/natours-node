/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

// Describing mongoose schema
const tourSchema = mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, 'A tour must have a name e.g., Hunza Valley'],
      trim: true,
      maxLength: [35, 'A name must be shorter than this.'],
      minLength: [4, 'A name must be shorter than this.']
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
      ],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must only contain easy, medium or difficult'
      }
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount ({VALUE}) must be lower than the price.'
      }
    },
    ratingsAvg: {
      type: Number,
      default: 4.5,
      max: [5, 'A rating max value can only be 5'],
      min: [1, 'A rating min value can only be 1'],
      set: val => Math.round(val * 10) / 10 // 4.666, 46.666, 47, 4.7
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
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAvg: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Virtual Properties
tourSchema.virtual('durationinWeeks').get(function() {
  return (this.duration / 7).toPrecision(3);
});

// Adding virtual property: 'reviews' to tourSchema
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Mongoose Middleware - Document Middleware - runs before .save() & .create()
//PRE-SAVE HOOK
tourSchema.pre('save', function(next) {
  // this.slug = this.name.toLowerCase().split(' ').join('-');
  this.slug = slugify(this.name);
  console.log(this.slug);
  next();
});

// Query PRE HOOK - to query user documents in the guides array
// tourSchema.pre('save', async function(next) {
//   const userPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(userPromises);
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

// Populate tour guides before send tour responses
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeTimestamp',
    model: 'User'
  });
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
