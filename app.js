const express = require('express');
const fs = require('fs');
const app = express();
const port = 6969;

// app.get('/', (req, res) => {
//   console.log(req.url);
//   res
//     .status(200)
//     .send({ message: 'HELLOOO, its me...', name: 'Natours by Hanzla' });
// });

// app.post('/', (req, res) => {
//   console.log(req.url);
//   res.status(200).send('You just posted on the mfucking SERVER.');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  console.log(req.url);
  res.send({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
