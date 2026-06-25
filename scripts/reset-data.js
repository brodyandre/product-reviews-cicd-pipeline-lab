const fs = require('fs/promises');
const path = require('path');

async function resetData() {
  const rootDir = path.resolve(__dirname, '..');
  const sourceFile = path.join(rootDir, 'data', 'reviews.seed.json');
  const targetFile = path.join(rootDir, 'data', 'reviews.json');

  await fs.copyFile(sourceFile, targetFile);
  console.log('Arquivo data/reviews.json restaurado com sucesso.');
}

resetData().catch((error) => {
  console.error('Falha ao restaurar o arquivo de dados.', error);
  process.exit(1);
});
