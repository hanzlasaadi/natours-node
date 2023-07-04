const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); //MIDDLEWARE: stores data between request & response - get access of request body on the request object

app.use((req, res, next) => {
  console.log('HELLOO......from the middleware');
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  console.log(req.url);
  res.send({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getATour = (req, res) => {
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
    requestedTime: req.requestedTime,
    data: {
      tour: tour,
    },
  });
};

const addNewTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};

// //Get All Tours
// app.get('/api/v1/tours', getAllTours);
// //Add Tour
// app.post('/api/v1/tours', addNewTour);
// //Responding to URL parameters---------
// app.get('/api/v1/tours/:id/:x?/:y?', getATour);
// //UPDATE
// app.patch('/api/v1/tours/:id', updateTour);
// //DELETE
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(addNewTour);

//This won't work on the ☝ route because ORDER matters in Express.js
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(`Added requested time ${req.requestedTime} in the Request Object`);
  next();
});
app
  .route('/api/v1/tours/:id')
  .get(getATour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 6969;
app.listen(port, () => {
  console.log(`Listening on port ${port} and being HORNY...`);
});
