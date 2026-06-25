const { ProductService } = require('../../../src/services/productService');

describe('ProductService', () => {
  it('calcula o resumo consolidado por produto', async () => {
    const reviewRepository = {
      getByProductId: jest.fn().mockResolvedValue([
        {
          rating: 5,
          createdAt: '2026-06-01T10:00:00.000Z',
        },
        {
          rating: 3,
          createdAt: '2026-06-03T12:00:00.000Z',
        },
        {
          rating: 4,
          createdAt: '2026-06-02T08:00:00.000Z',
        },
      ]),
    };
    const service = new ProductService({ reviewRepository });

    const result = await service.getProductSummary('produto-123');

    expect(reviewRepository.getByProductId).toHaveBeenCalledWith('produto-123');
    expect(result).toEqual({
      productId: 'produto-123',
      totalReviews: 3,
      averageRating: 4,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 1,
      },
      latestReviewAt: '2026-06-03T12:00:00.000Z',
    });
  });

  it('retorna estrutura vazia quando nao encontra reviews', async () => {
    const reviewRepository = {
      getByProductId: jest.fn().mockResolvedValue([]),
    };
    const service = new ProductService({ reviewRepository });

    const result = await service.getProductSummary('produto-sem-review');

    expect(result).toEqual({
      productId: 'produto-sem-review',
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      latestReviewAt: null,
    });
  });
});
