# API

[Voltar ao README](../README.md)

## Objetivo

Esta API expõe os endpoints usados pela interface web e pelos testes automatizados do laboratório. O foco é demonstrar contrato HTTP claro, validação de entrada e respostas JSON padronizadas.

## Endpoints

### `GET /health`

Verifica a saúde básica da aplicação.

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "product-reviews-api",
    "timestamp": "2026-06-25T12:00:00.000Z"
  }
}
```

### `GET /ready`

Verifica se a aplicação está pronta e se o arquivo local de dados pode ser usado.

```bash
curl http://localhost:3000/ready
```

### `GET /api/reviews`

Lista as reviews ordenadas da mais recente para a mais antiga.

```bash
curl http://localhost:3000/api/reviews
```

### `GET /api/reviews/:id`

Busca uma review específica pelo identificador.

```bash
curl http://localhost:3000/api/reviews/rev_001
```

Se o recurso não existir, a API retorna `404`.

### `POST /api/reviews`

Cria uma nova review.

Payload:

```json
{
  "productId": "notebook-pro-15",
  "customerName": "Marina Costa",
  "rating": 5,
  "comment": "Excelente custo-benefício para uso profissional.",
  "source": "website"
}
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "notebook-pro-15",
    "customerName": "Marina Costa",
    "rating": 5,
    "comment": "Excelente custo-benefício para uso profissional.",
    "source": "website"
  }'
```

Validações principais:

- `productId`: obrigatório, 3 a 60 caracteres, letras, números e hífens
- `customerName`: obrigatório, 3 a 80 caracteres
- `rating`: obrigatório, inteiro entre 1 e 5
- `comment`: obrigatório, 10 a 500 caracteres
- `source`: obrigatório, 3 a 40 caracteres, letras, números e hífens

Entrada inválida retorna `400`.

### `GET /api/products/:productId/summary`

Retorna um resumo agregado por produto.

```bash
curl http://localhost:3000/api/products/notebook-pro-15/summary
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "productId": "notebook-pro-15",
    "totalReviews": 2,
    "averageRating": 4.5,
    "ratingDistribution": {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 1,
      "5": 1
    },
    "latestReviewAt": "2026-06-02T14:30:00.000Z"
  }
}
```

## Padrão de resposta

### Sucesso

```json
{
  "success": true,
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "message": "Payload inválido.",
    "details": []
  }
}
```

[Voltar ao README](../README.md)
