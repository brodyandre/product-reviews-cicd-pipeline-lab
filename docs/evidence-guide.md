# Guia de Evidências

[Voltar ao README](../README.md)

## Objetivo

Este guia ajuda a coletar prints que reforçam empregabilidade, clareza técnica e maturidade de execução no portfólio.

## Prints recomendados

### 1. Interface da aplicação

Capture:

- tela inicial em `http://localhost:3000`
- painel com métricas, resumo por produto e lista de reviews

### 2. Endpoints da API

Capture o terminal executando:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/reviews
```

### 3. Testes e cobertura

Capture:

```bash
npm test
npm run coverage
```

### 4. Qualidade de código

Capture:

```bash
npm run lint
npm run format:check
```

### 5. Docker

Capture:

```bash
docker compose up --build
docker compose ps
docker inspect --format='{{json .State.Health}}' product-reviews-api
```

### 6. CI no GitHub Actions

Capture:

- workflow de CI passando
- etapa de Hadolint
- etapa de Trivy
- etapa de Docker build

### 7. CD simulada

Capture:

- execução manual do workflow `cd.yml`
- resumo final no GitHub Actions Summary
- evidência das portas `3001` e `3002` no fluxo de homologação e produção simulada

## Dica de apresentação

Ao usar esses prints no README, LinkedIn ou portfólio:

- prefira imagens limpas e legíveis
- destaque terminal, workflow e interface
- evite capturas com informação irrelevante ou ruído visual

[Voltar ao README](../README.md)
