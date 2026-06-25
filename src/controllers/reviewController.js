const { createHttpError } = require('../utils/createHttpError');
const { sendSuccess } = require('../utils/httpResponse');

function buildReviewController({ reviewService }) {
  return {
    async listReviews(_request, response) {
      const reviews = await reviewService.getAllReviews();

      return sendSuccess(response, {
        data: reviews,
        meta: {
          count: reviews.length,
        },
      });
    },

    async getReviewById(request, response) {
      const review = await reviewService.getReviewById(request.params.id);

      if (!review) {
        throw createHttpError(404, 'Review nao encontrada.');
      }

      return sendSuccess(response, { data: review });
    },

    async createReview(request, response) {
      const review = await reviewService.createReview(request.body);

      return sendSuccess(response, {
        statusCode: 201,
        data: review,
      });
    },
  };
}

module.exports = { buildReviewController };
