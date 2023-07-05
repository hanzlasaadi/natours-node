const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

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

// console.log(process.env);

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
