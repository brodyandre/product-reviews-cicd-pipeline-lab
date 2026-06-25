const { createApp } = require('./app');
const { buildContainer } = require('./config/container');

async function start() {
  const container = buildContainer();
  const { config, reviewRepository } = container;

  await reviewRepository.initialize();

  const app = createApp(container);
  const server = app.listen(config.port, config.host, () => {
    const displayHost = config.host === '0.0.0.0' ? 'localhost' : config.host;
    console.log(
      `API product-reviews em execucao: http://${displayHost}:${config.port}`
    );
  });

  const shutdown = (signal) => {
    console.log(`Sinal ${signal} recebido. Encerrando aplicacao...`);

    server.close((error) => {
      if (error) {
        console.error('Falha ao encerrar o servidor.', error);
        process.exit(1);
      }

      process.exit(0);
    });

    setTimeout(() => {
      console.error('Encerramento forcado apos timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
  });

  return server;
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Falha ao iniciar a aplicacao.', error);
    process.exit(1);
  });
}

module.exports = { start };
