const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//PARAM Middleware
// exports.checkId = (req, res, next, val) => {
//   console.log('Param middleware is working');
//   if (val > tours.length - 1 || val < 0) {
//     return res.status(404).send({
//       status: 'fail',
//       message: 'Invalid id'
//     });
//   }
//   next();
// };

const filterObject = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (fields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Deny access if user enters password or confirm password
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError(400, "Can't change password!!!"));
  }
  // 2. Filter the req.body object to only contain required fields
  const filteredObj = filterObject(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  // 3. Find user and update & send response
  return res.status(200).json({
    status: 'success',
    updatedUser
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.send({
    status: 'success',
    results: users.length,
    data: {
      users: users
    }
  });
});

exports.addNewUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found'
  });
};
exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'No Data Found'
  });
};
