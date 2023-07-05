const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env);

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
