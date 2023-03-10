// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {}
    validationErrors
      .array()
      .map((error) => errors[error.param] = error.msg);

    // const err = Error('Bad Request');
    // err.errors = errors;
    // err.status = 400;
    // err.title = 'Bad Request';
    // next(err);
    return res.status(400).json({
      "message": "Validation Error",
      "statusCode": 400,
      errors: errors
    })
  }
  next();
};

module.exports = {
  handleValidationErrors
};
