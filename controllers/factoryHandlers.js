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
