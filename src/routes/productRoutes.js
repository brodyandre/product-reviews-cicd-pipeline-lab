const express = require('express');

const { asyncHandler } = require('../middlewares/asyncHandler');

function createProductRoutes({ productController }) {
  const router = express.Router();

  router.get(
    '/products/:productId/summary',
    asyncHandler(productController.getProductSummary)
  );

  return router;
}

module.exports = { createProductRoutes };
