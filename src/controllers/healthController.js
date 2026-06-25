const { createHttpError } = require('../utils/createHttpError');
const { sendSuccess } = require('../utils/httpResponse');

function buildHealthController({ reviewService }) {
  return {
    getHealth(_request, response) {
      return sendSuccess(response, {
        data: {
          status: 'ok',
          service: 'product-reviews-api',
          timestamp: new Date().toISOString(),
        },
      });
    },

    async getReadiness(_request, response) {
      const readiness = await reviewService.isReady();

      if (!readiness.ready) {
        throw createHttpError(
          503,
          readiness.message || 'Aplicação ainda não está pronta.'
        );
      }

      return sendSuccess(response, {
        data: {
          status: 'ready',
          dataFile: readiness.dataFile,
          timestamp: new Date().toISOString(),
        },
      });
    },
  };
}

module.exports = { buildHealthController };
