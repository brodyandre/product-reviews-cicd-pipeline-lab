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

describe('errorHandler', () => {
  it('retorna 400 quando recebe um JSON invalido', () => {
    const error = new SyntaxError('Unexpected token');
    error.status = 400;
    error.body = '{';
    const response = createMockResponse();

    errorHandler(error, {}, response, () => {});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'JSON invalido.',
      },
    });
  });

  it('retorna 500 com mensagem padrao para erros sem metadata', () => {
    const response = createMockResponse();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    errorHandler({}, {}, response, () => {});

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Erro interno do servidor.',
      },
    });

    consoleErrorSpy.mockRestore();
  });
});
