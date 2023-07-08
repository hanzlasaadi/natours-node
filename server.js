/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception 💥💣🧨 Shutting Down📉📉📉');
  console.log(err.code, err.message);
  process.exit(1);
});

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

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection 💥💣🧨 Shutting Down📉📉📉');
  console.log(err.code, err.message);
  server.close(() => {
    process.exit(1);
  });
});
