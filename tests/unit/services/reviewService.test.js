const { ReviewService } = require('../../../src/services/reviewService');

describe('ReviewService', () => {
  it('lista reviews a partir do repositorio', async () => {
    const reviewRepository = {
      getAll: jest.fn().mockResolvedValue([{ id: 'rev_001' }]),
    };
    const service = new ReviewService({ reviewRepository });

    const result = await service.getAllReviews();

    expect(reviewRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 'rev_001' }]);
  });

  it('busca uma review pelo identificador no repositorio', async () => {
    const reviewRepository = {
      getById: jest.fn().mockResolvedValue({ id: 'rev_002' }),
    };
    const service = new ReviewService({ reviewRepository });

    const result = await service.getReviewById('rev_002');

    expect(reviewRepository.getById).toHaveBeenCalledWith('rev_002');
    expect(result).toEqual({ id: 'rev_002' });
  });

  it('normaliza e persiste uma nova review', async () => {
    const reviewRepository = {
      create: jest.fn().mockImplementation(async (review) => review),
    };
    const service = new ReviewService({ reviewRepository });

    const result = await service.createReview({
      productId: ' notebook-pro-15 ',
      customerName: ' Marina Costa ',
      rating: 5,
      comment: ' Excelente custo-beneficio. ',
      source: ' website ',
    });

    expect(reviewRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      productId: 'notebook-pro-15',
      customerName: 'Marina Costa',
      rating: 5,
      comment: 'Excelente custo-beneficio.',
      source: 'website',
    });
    expect(result.id).toEqual(expect.any(String));
    expect(result.createdAt).toEqual(expect.any(String));
  });

  it('consulta o readiness no repositorio', async () => {
    const readiness = {
      ready: true,
      dataFile: '/tmp/reviews.json',
    };
    const reviewRepository = {
      healthCheck: jest.fn().mockResolvedValue(readiness),
    };
    const service = new ReviewService({ reviewRepository });

    const result = await service.isReady();

    expect(reviewRepository.healthCheck).toHaveBeenCalledTimes(1);
    expect(result).toEqual(readiness);
  });
});
