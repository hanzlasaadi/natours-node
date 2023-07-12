/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// eslint-disable-next-line import/no-dynamic-require
const Tour = require(`${__dirname}/../../models/tourModel`);

dotenv.config({ path: `${__dirname}/../../config.env` });

const arg = process.argv.find(el => el === '--import' || el === '--delete');
console.log('Fuck yes: ', arg);

const allData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

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

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Sucessfully deleted');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Tour.create(allData);
    console.log('Sucessfully imported data');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (arg === '--import') importData();
else if (arg === '--delete') deleteData();
