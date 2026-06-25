const {
  buildHealthController,
} = require('../../../src/controllers/healthController');
const { errorHandler } = require('../../../src/middlewares/errorHandler');

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('healthController', () => {
  it('retorna health check padronizado', () => {
    const healthController = buildHealthController({
      reviewService: {
        isReady: jest.fn(),
      },
    });
    const response = createMockResponse();

    healthController.getHealth({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });

  it('retorna 503 quando a aplicacao nao esta pronta', async () => {
    const healthController = buildHealthController({
      reviewService: {
        isReady: jest.fn().mockResolvedValue({
          ready: false,
          message: 'Falha ao acessar o arquivo de dados.',
        }),
      },
    });
    const response = createMockResponse();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    let thrownError;

    try {
      await healthController.getReadiness({}, response);
    } catch (error) {
      thrownError = error;
      errorHandler(error, {}, response, () => {});
    }

    expect(thrownError).toMatchObject({
      statusCode: 503,
      message: 'Falha ao acessar o arquivo de dados.',
    });
    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Falha ao acessar o arquivo de dados.',
      },
    });

    consoleErrorSpy.mockRestore();
  });
});
