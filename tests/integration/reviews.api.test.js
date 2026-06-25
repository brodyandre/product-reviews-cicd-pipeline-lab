const { createTestApp } = require('../helpers/createTestApp');
const { performRequest } = require('../helpers/httpRequest');

const seedReviews = [
  {
    id: 'rev_test_001',
    productId: 'notebook-pro-15',
    customerName: 'Ana Souza',
    rating: 5,
    comment: 'Desempenho excelente e bateria duradoura.',
    source: 'website',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'rev_test_002',
    productId: 'notebook-pro-15',
    customerName: 'Carlos Lima',
    rating: 4,
    comment: 'Boa construcao, mas poderia ser mais leve.',
    source: 'mobile-app',
    createdAt: '2026-06-02T14:30:00.000Z',
  },
  {
    id: 'rev_test_003',
    productId: 'fone-x200',
    customerName: 'Juliana Rocha',
    rating: 3,
    comment: 'Cancelamento de ruido bom, mas aquece apos muito uso.',
    source: 'marketplace',
    createdAt: '2026-06-03T09:15:00.000Z',
  },
];

describe('Product Reviews API', () => {
  let app;
  let cleanup;

  beforeEach(async () => {
    const testContext = await createTestApp(seedReviews);
    app = testContext.app;
    cleanup = testContext.cleanup;
  });

  afterEach(async () => {
    await cleanup();
  });

  it('entrega a interface web na raiz da aplicacao', async () => {
    const response = await performRequest(app, { path: '/' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('Product Reviews Lab');
    expect(response.text).toContain('Registrar review');
  });

  it('retorna health check com status ok', async () => {
    const response = await performRequest(app, { path: '/health' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });

  it('retorna readiness com status ready', async () => {
    const response = await performRequest(app, { path: '/ready' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ready');
  });

  it('lista reviews ordenadas da mais recente para a mais antiga', async () => {
    const response = await performRequest(app, { path: '/api/reviews' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.meta.count).toBe(3);
    expect(response.body.data[0].id).toBe('rev_test_003');
  });

  it('busca uma review pelo identificador', async () => {
    const response = await performRequest(app, {
      path: '/api/reviews/rev_test_001',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.customerName).toBe('Ana Souza');
  });

  it('retorna 404 quando a review nao existe', async () => {
    const response = await performRequest(app, {
      path: '/api/reviews/review-inexistente',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Review nao encontrada.',
      },
    });
  });

  it('cria uma nova review valida', async () => {
    const payload = {
      productId: 'smartwatch-active',
      customerName: 'Marina Costa',
      rating: 5,
      comment: 'Excelente custo-beneficio para uso profissional.',
      source: 'website',
    };

    const response = await performRequest(app, {
      method: 'POST',
      path: '/api/reviews',
      headers: {
        'content-type': 'application/json',
      },
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toEqual(expect.any(String));
    expect(response.body.data.productId).toBe('smartwatch-active');
    expect(response.body.data.createdAt).toEqual(expect.any(String));
  });

  it('valida o payload no cadastro de review com regras robustas', async () => {
    const response = await performRequest(app, {
      method: 'POST',
      path: '/api/reviews',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        productId: 'x',
        customerName: 'A',
        rating: 7,
        comment: 'curta',
        source: 'market place',
        extraField: true,
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'body' }),
        expect.objectContaining({ field: 'productId' }),
        expect.objectContaining({ field: 'customerName' }),
        expect.objectContaining({ field: 'rating' }),
        expect.objectContaining({ field: 'comment' }),
        expect.objectContaining({ field: 'source' }),
      ])
    );
  });

  it('retorna 400 quando recebe JSON invalido', async () => {
    const response = await performRequest(app, {
      method: 'POST',
      path: '/api/reviews',
      headers: {
        'content-type': 'application/json',
      },
      body: '{"productId":',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'JSON invalido.',
      },
    });
  });

  it('retorna resumo agregado do produto', async () => {
    const response = await performRequest(app, {
      path: '/api/products/notebook-pro-15/summary',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      productId: 'notebook-pro-15',
      totalReviews: 2,
      averageRating: 4.5,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 1,
      },
      latestReviewAt: '2026-06-02T14:30:00.000Z',
    });
  });

  it('retorna resumo vazio quando o produto ainda nao possui reviews', async () => {
    const response = await performRequest(app, {
      path: '/api/products/camera-z/summary',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.totalReviews).toBe(0);
    expect(response.body.data.averageRating).toBe(0);
    expect(response.body.data.latestReviewAt).toBeNull();
  });

  it('retorna 404 padronizado para rotas inexistentes', async () => {
    const response = await performRequest(app, {
      path: '/api/rota-inexistente',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Rota nao encontrada.',
        path: '/api/rota-inexistente',
      },
    });
  });
});
