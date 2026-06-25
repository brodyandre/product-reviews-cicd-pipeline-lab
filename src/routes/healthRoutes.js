const express = require('express');

function createHealthRoutes({ healthController }) {
  const router = express.Router();

  router.get('/health', healthController.getHealth);
  router.get('/ready', healthController.getReadiness);

  return router;
}

module.exports = { createHealthRoutes };
