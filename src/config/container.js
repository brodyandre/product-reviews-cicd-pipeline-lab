const { ReviewRepository } = require('../repositories/reviewRepository');
const { ProductService } = require('../services/productService');
const { ReviewService } = require('../services/reviewService');
const { getConfig } = require('./env');

function buildContainer(overrides = {}) {
  const config = { ...getConfig(), ...overrides };
  const reviewRepository =
    overrides.reviewRepository ||
    new ReviewRepository({ dataFile: config.dataFile });
  const reviewService =
    overrides.reviewService || new ReviewService({ reviewRepository });
  const productService =
    overrides.productService || new ProductService({ reviewRepository });

  return {
    config,
    reviewRepository,
    reviewService,
    productService,
  };
}

module.exports = { buildContainer };
