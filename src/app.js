const express = require('express');
const helmet = require('helmet');
const path = require('path');

const { buildHealthController } = require('./controllers/healthController');
const { buildProductController } = require('./controllers/productController');
const { buildReviewController } = require('./controllers/reviewController');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');
const { createHealthRoutes } = require('./routes/healthRoutes');
const { createProductRoutes } = require('./routes/productRoutes');
const { createReviewRoutes } = require('./routes/reviewRoutes');

function createApp({ reviewService, productService }) {
  const app = express();
  const publicDirectory = path.join(__dirname, '..', 'public');
  const healthController = buildHealthController({ reviewService });
  const reviewController = buildReviewController({ reviewService });
  const productController = buildProductController({ productService });

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    express.static(publicDirectory, {
      extensions: ['html'],
    })
  );

  app.use(createHealthRoutes({ healthController }));
  app.use('/api', createReviewRoutes({ reviewController }));
  app.use('/api', createProductRoutes({ productController }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
