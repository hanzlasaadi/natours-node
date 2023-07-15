/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require(`${__dirname}/../../models/tourModel`);
const User = require(`${__dirname}/../../models/userModel`);
const Review = require(`${__dirname}/../../models/reviewModel`);

dotenv.config({ path: `${__dirname}/../../config.env` });

const arg = process.argv.find(el => el === '--import' || el === '--delete');
console.log('Fuck yes: ', arg);

const allData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log('DB connection sucessfull!!!');
//   });

const deleteData = async () => {
  try {
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log('DB connection sucessfull!!!');
      });

    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Sucessfully deleted');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const importData = async () => {
  try {
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log('DB connection sucessfull!!!');
      });

    await Tour.create(allData);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Sucessfully imported data');
  } catch (error) {
    console.log(error.message, 'errrrr');
  }
  process.exit();
};

if (arg === '--import') importData();
else if (arg === '--delete') deleteData();
