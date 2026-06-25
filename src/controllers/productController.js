const { sendSuccess } = require('../utils/httpResponse');

function buildProductController({ productService }) {
  return {
    async getProductSummary(request, response) {
      const summary = await productService.getProductSummary(
        request.params.productId
      );

      return sendSuccess(response, { data: summary });
    },
  };
}

module.exports = { buildProductController };
