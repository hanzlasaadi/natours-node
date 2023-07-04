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

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found',
  });
};
exports.addNewUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found',
  });
};
exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found',
  });
};
