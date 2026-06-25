const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { validateRequest } = require('../middlewares/validateRequest');
const {
  validateCreateReviewPayload,
} = require('../validators/reviewValidator');

function createReviewRoutes({ reviewController }) {
  const router = express.Router();

  router.get('/reviews', asyncHandler(reviewController.listReviews));
  router.get('/reviews/:id', asyncHandler(reviewController.getReviewById));
  router.post(
    '/reviews',
    validateRequest(validateCreateReviewPayload),
    asyncHandler(reviewController.createReview)
  );

  return router;
}

module.exports = { createReviewRoutes };
