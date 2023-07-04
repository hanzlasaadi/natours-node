const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); //MIDDLEWARE: stores data between request & response

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

//REsponding to URL parameters---------
app.get('/api/v1/tours/:id/:x?/:y?', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((val) => val.id === id);

  if (id > tours.length - 1 || id < 0) {
    // if (!tour) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).send({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});
//REsponding to URL parameters---------

app.post('/api/v1/tours', (req, res) => {
  console.log(req.url);
  console.log(req.body);

  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id: newID }); //MErge new ID & requested tour objects

  tours.push(newTour); //add newly requested tour to main Tour Object

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        results: tours.length,
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('POSTed on the server');
});

//UPDATE
app.patch('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id;

  if (id > tours.length - 1 || id < 0) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(200).send({
    status: 'success',
    data: {
      tour: 'Updated tour...',
    },
  });
});

//DELETE
app.delete('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id;

  if (id > tours.length - 1 || id < 0) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  res.status(204).send({
    status: 'success',
    data: {
      tour: null,
    },
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
