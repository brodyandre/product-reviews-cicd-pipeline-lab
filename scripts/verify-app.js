const { createApp } = require('../src/app');
const { buildContainer } = require('../src/config/container');

function verifyApp() {
  const container = buildContainer();
  const app = createApp(container);

  if (!app || typeof app.use !== 'function') {
    throw new Error('Falha ao inicializar a aplicacao Express.');
  }

  console.log('Aplicação verificada com sucesso.');
}

try {
  verifyApp();
} catch (error) {
  console.error('Falha na verificacao da aplicacao.', error);
  process.exit(1);
}
