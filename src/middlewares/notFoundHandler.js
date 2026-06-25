const { createHttpError } = require('../utils/createHttpError');

function notFoundHandler(request, _response, next) {
  return next(
    createHttpError(404, 'Rota nao encontrada.', {
      path: request.originalUrl,
    })
  );
}

module.exports = { notFoundHandler };
