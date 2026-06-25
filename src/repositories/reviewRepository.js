const fs = require('fs/promises');
const path = require('path');

class ReviewRepository {
  constructor({ dataFile }) {
    this.dataFile = dataFile;
  }

  async initialize() {
    await fs.mkdir(path.dirname(this.dataFile), { recursive: true });

    try {
      await fs.access(this.dataFile);
    } catch {
      await fs.writeFile(this.dataFile, '[]\n', 'utf-8');
    }

    await this.readAll();
  }

  async healthCheck() {
    try {
      await this.initialize();

      return {
        ready: true,
        dataFile: this.dataFile,
      };
    } catch (error) {
      return {
        ready: false,
        dataFile: this.dataFile,
        message: error.message,
      };
    }
  }

  async readAll() {
    const rawData = await fs.readFile(this.dataFile, 'utf-8');

    if (!rawData.trim()) {
      return [];
    }

    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      throw new Error('O arquivo de reviews deve conter uma lista JSON.');
    }

    return parsedData;
  }

  async writeAll(reviews) {
    await fs.writeFile(
      this.dataFile,
      `${JSON.stringify(reviews, null, 2)}\n`,
      'utf-8'
    );
  }

  async getAll() {
    const reviews = await this.readAll();

    return [...reviews].sort((left, right) => {
      return new Date(right.createdAt) - new Date(left.createdAt);
    });
  }

  async getById(id) {
    const reviews = await this.readAll();

    return reviews.find((review) => review.id === id) || null;
  }

  async getByProductId(productId) {
    const reviews = await this.readAll();

    return reviews.filter((review) => review.productId === productId);
  }

  async create(review) {
    const reviews = await this.readAll();

    reviews.push(review);
    await this.writeAll(reviews);

    return review;
  }
}

module.exports = { ReviewRepository };
