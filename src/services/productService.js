function buildEmptyDistribution() {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
}

class ProductService {
  constructor({ reviewRepository }) {
    this.reviewRepository = reviewRepository;
  }

  async getProductSummary(productId) {
    const normalizedProductId = String(productId).trim();
    const reviews =
      await this.reviewRepository.getByProductId(normalizedProductId);
    const ratingDistribution = buildEmptyDistribution();

    if (reviews.length === 0) {
      return {
        productId: normalizedProductId,
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution,
        latestReviewAt: null,
      };
    }

    const totalRating = reviews.reduce((sum, review) => {
      ratingDistribution[review.rating] += 1;
      return sum + review.rating;
    }, 0);

    const latestReviewAt = reviews.reduce((latest, review) => {
      if (!latest) {
        return review.createdAt;
      }

      return new Date(review.createdAt) > new Date(latest)
        ? review.createdAt
        : latest;
    }, null);

    return {
      productId: normalizedProductId,
      totalReviews: reviews.length,
      averageRating: Number((totalRating / reviews.length).toFixed(2)),
      ratingDistribution,
      latestReviewAt,
    };
  }
}

module.exports = { ProductService };
