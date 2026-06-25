function sendSuccess(response, { statusCode = 200, data, meta } = {}) {
  const payload = {
    success: true,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return response.status(statusCode).json(payload);
}

function sendError(
  response,
  { statusCode = 500, message, details, path } = {}
) {
  const payload = {
    success: false,
    error: {
      message,
    },
  };

  if (details !== undefined) {
    payload.error.details = details;
  }

  if (path !== undefined) {
    payload.error.path = path;
  }

  return response.status(statusCode).json(payload);
}

module.exports = { sendSuccess, sendError };
