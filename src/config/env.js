const path = require('path');

const DEFAULT_PORT = 3000;

function normalizePort(value) {
  const parsedValue = Number.parseInt(value ?? DEFAULT_PORT, 10);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return DEFAULT_PORT;
}

function getConfig() {
  const rootDir = path.resolve(__dirname, '../..');
  const defaultDataFile = path.join(rootDir, 'data', 'reviews.json');

  return {
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || '0.0.0.0',
    port: normalizePort(process.env.PORT),
    dataFile: process.env.REVIEWS_DATA_FILE
      ? path.resolve(process.cwd(), process.env.REVIEWS_DATA_FILE)
      : defaultDataFile,
  };
}

module.exports = { getConfig };
