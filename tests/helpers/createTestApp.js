const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const { createApp } = require('../../src/app');
const { buildContainer } = require('../../src/config/container');

async function createTestApp(initialData = []) {
  const tempDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), 'product-reviews-api-')
  );
  const dataFile = path.join(tempDirectory, 'reviews.json');

  await fs.writeFile(dataFile, `${JSON.stringify(initialData, null, 2)}\n`);

  const container = buildContainer({ dataFile });
  await container.reviewRepository.initialize();

  return {
    app: createApp(container),
    dataFile,
    cleanup: async () => {
      await fs.rm(tempDirectory, { recursive: true, force: true });
    },
  };
}

module.exports = { createTestApp };
