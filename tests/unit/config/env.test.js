const path = require('path');

const { getConfig } = require('../../../src/config/env');

describe('getConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.PORT;
    delete process.env.HOST;
    delete process.env.NODE_ENV;
    delete process.env.REVIEWS_DATA_FILE;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('retorna a configuracao padrao quando nenhuma variavel e informada', () => {
    const config = getConfig();

    expect(config.env).toBe('development');
    expect(config.host).toBe('0.0.0.0');
    expect(config.port).toBe(3000);
    expect(config.dataFile).toBe(
      path.join(process.cwd(), 'data', 'reviews.json')
    );
  });

  it('usa fallback de porta e resolve caminho customizado para o arquivo de dados', () => {
    process.env.PORT = 'porta-invalida';
    process.env.REVIEWS_DATA_FILE = 'tmp/custom-reviews.json';
    process.env.HOST = '127.0.0.1';
    process.env.NODE_ENV = 'test';

    const config = getConfig();

    expect(config.env).toBe('test');
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe(3000);
    expect(config.dataFile).toBe(
      path.resolve(process.cwd(), 'tmp/custom-reviews.json')
    );
  });
});
