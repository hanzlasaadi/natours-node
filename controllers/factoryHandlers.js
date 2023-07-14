const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model => {
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      next(new AppError(404, 'The document could not be found!!!'));
    }

    res.status(204).json({
      status: 'success',
      data: {
        document: null
      }
    });
  });
};

exports.updateOne = Model => {
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument
      }
    });
  });
};

exports.createOne = Model => {
  catchAsync(async (req, res, next) => {
    const newTour = await Model.create(req.body);

    if (!newTour)
      return next(new AppError(401, 'New Document could not be created!!!'));

    return res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};
