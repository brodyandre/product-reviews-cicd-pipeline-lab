const { createHttpError } = require('../utils/createHttpError');

function validateRequest(validator) {
  return function validate(request, response, next) {
    const errors = validator(request.body);

    if (errors.length > 0) {
      return next(
        createHttpError(400, 'Payload invalido.', {
          details: errors,
        })
      );
    }

    return next();
  };
}

module.exports = { validateRequest };
