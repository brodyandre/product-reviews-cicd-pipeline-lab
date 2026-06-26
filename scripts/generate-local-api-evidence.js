const fs = require('fs/promises');
const path = require('path');

const { createApp } = require('../src/app');
const { buildContainer } = require('../src/config/container');
const { performRequest } = require('../tests/helpers/httpRequest');

const rootDir = path.resolve(__dirname, '..');
const dataFile = path.join(rootDir, 'data', 'reviews.json');
const seedFile = path.join(rootDir, 'data', 'reviews.seed.json');
const outputDir = path.join(rootDir, 'docs', 'evidences', 'api');

async function writeJson(fileName, payload) {
  const outputFile = path.join(outputDir, fileName);
  const content = `${JSON.stringify(payload, null, 2)}\n`;
  await fs.writeFile(outputFile, content, 'utf8');
}

async function resetDataFile() {
  await fs.copyFile(seedFile, dataFile);
}

async function requestJson(app, options) {
  const response = await performRequest(app, options);

  return response.body;
}

async function generateEvidence() {
  await fs.mkdir(outputDir, { recursive: true });
  await resetDataFile();

  const container = buildContainer({ dataFile });
  await container.reviewRepository.initialize();

  const app = createApp(container);
  const createReviewPayload = {
    productId: 'notebook-pro-15',
    customerName: 'Marina Costa',
    rating: 5,
    comment: 'Excelente custo-beneficio para uso profissional.',
    source: 'website',
  };

  await writeJson(
    '01-healthcheck.json',
    await requestJson(app, { path: '/health' })
  );
  await writeJson(
    '02-readiness.json',
    await requestJson(app, { path: '/ready' })
  );
  await writeJson(
    '03-list-reviews.json',
    await requestJson(app, { path: '/api/reviews' })
  );
  await writeJson(
    '04-product-summary-notebook.json',
    await requestJson(app, { path: '/api/products/notebook-pro-15/summary' })
  );
  await writeJson(
    '05-product-summary-fone.json',
    await requestJson(app, { path: '/api/products/fone-x200/summary' })
  );
  await writeJson(
    '06-product-summary-smartwatch.json',
    await requestJson(app, { path: '/api/products/smartwatch-active/summary' })
  );

  await requestJson(app, {
    method: 'POST',
    path: '/api/reviews',
    headers: {
      'content-type': 'application/json',
    },
    body: createReviewPayload,
  });
  await writeJson(
    '07-product-summary-after-post.json',
    await requestJson(app, { path: '/api/products/notebook-pro-15/summary' })
  );
  await writeJson(
    '08-list-reviews-after-post.json',
    await requestJson(app, { path: '/api/reviews' })
  );

  await resetDataFile();
}

generateEvidence().catch(async (error) => {
  console.error('Falha ao gerar evidencias locais da API.', error);

  try {
    await resetDataFile();
  } catch (resetError) {
    console.error('Falha ao restaurar dados apos erro.', resetError);
  }

  process.exit(1);
});
