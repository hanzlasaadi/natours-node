const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandlers');

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

exports.deleteMe = catchAsync(async function(req, res, next) {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  // console.log(req.user._id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

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

exports.getAllUsers = factory.getAll(User);

exports.getOneUser = factory.getOne(User);

exports.addNewUser = factory.createOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Server Down',
    message: 'This route is not defined. Please use signup instead!!!'
  });
};
