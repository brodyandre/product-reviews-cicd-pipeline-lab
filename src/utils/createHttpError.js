function createHttpError(statusCode, message, options = {}) {
  const error = new Error(message);

  error.statusCode = statusCode;

  if (options.details) {
    error.details = options.details;
  }

  if (options.path) {
    error.path = options.path;
  }

  return error;
}

module.exports = { createHttpError };
