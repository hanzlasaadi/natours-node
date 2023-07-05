const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection sucessfull!!!');
  });

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

//Creating an instance of the tour MODEL created above👆 with data
const testTour = new Tour({
  name: 'Harvey Specter',
  price: 129,
  rating: 7.5
});

// Saving the model instance in the database as a DOCUMENT📄
testTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log('💣💣Error happened💣💣: ', err.message));

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
