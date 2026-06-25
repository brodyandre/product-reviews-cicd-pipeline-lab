const { notFoundHandler } = require('../../../src/middlewares/notFoundHandler');

describe('notFoundHandler', () => {
  it('encaminha erro 404 com o caminho solicitado', () => {
    const next = jest.fn();

    notFoundHandler({ originalUrl: '/rota-inexistente' }, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Rota nao encontrada.',
        path: '/rota-inexistente',
      })
    );
  });
});
