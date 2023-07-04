const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

//PARAM Middleware
exports.checkId = (req, res, next, val) => {
  console.log('Param middleware is working');
  if (val > tours.length - 1 || val < 0) {
    return res.status(404).send({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  next();
};

//------ROUTE HANDLERS/CONTROLLERS------
exports.getAllTours = (req, res) => {
  // console.log(req.url);
  res.send({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getATour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((val) => val.id === id);

  res.status(200).send({
    status: 'success',
    requestedTime: req.requestedTime,
    data: {
      tour: tour,
    },
  });
};

exports.addNewTour = (req, res) => {
  // console.log(req.url);
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

exports.updateTour = (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      tour: 'Updated tour...',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
