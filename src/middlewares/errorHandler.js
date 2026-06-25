const { sendError } = require('../utils/httpResponse');

function errorHandler(error, _request, response, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return sendError(response, {
      statusCode: 400,
      message: 'JSON invalido.',
    });
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  return sendError(response, {
    statusCode,
    message: error.message || 'Erro interno do servidor.',
    details: error.details,
    path: error.path,
  });
}

module.exports = { errorHandler };
