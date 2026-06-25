const { randomUUID } = require('crypto');

class ReviewService {
  constructor({ reviewRepository }) {
    this.reviewRepository = reviewRepository;
  }

  async getAllReviews() {
    return this.reviewRepository.getAll();
  }

  async getReviewById(id) {
    return this.reviewRepository.getById(id);
  }

  async createReview(payload) {
    const review = {
      id: randomUUID(),
      productId: payload.productId.trim(),
      customerName: payload.customerName.trim(),
      rating: Number(payload.rating),
      comment: payload.comment.trim(),
      source: payload.source.trim(),
      createdAt: new Date().toISOString(),
    };

    return this.reviewRepository.create(review);
  }

  async isReady() {
    return this.reviewRepository.healthCheck();
  }
}

module.exports = { ReviewService };
