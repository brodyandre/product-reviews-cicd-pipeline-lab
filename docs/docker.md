# Docker

## Como construir a imagem

Use o script npm:

```bash
npm run docker:build
```

Ou diretamente com Docker:

```bash
docker build --target runner -t product-reviews-api:local .
```

## Como subir localmente

1. Opcionalmente copie `.env.example` para `.env` e ajuste variaveis, se necessario.
2. Suba a API com Compose:

```bash
docker compose up --build
```

A aplicacao fica disponivel em `http://localhost:3000`.

## Como validar o healthcheck

Verifique o endpoint:

```bash
curl http://localhost:3000/health
```

Verifique o status do container:

```bash
docker compose ps
```

Inspecione o healthcheck em detalhe:

```bash
docker inspect --format='{{json .State.Health}}' product-reviews-api
```

## Problemas comuns

### Porta 3000 em uso

Pare outro processo na porta `3000` antes de subir o Compose.

### Container sobe, mas fica `unhealthy`

- confirme se a API iniciou corretamente com `docker compose logs -f api`
- valide se o endpoint `http://localhost:3000/health` responde `200`

### Mudancas no volume de dados

O Compose usa um volume nomeado chamado `product-reviews-data`. Para reiniciar o estado local:

```bash
docker compose down -v
```

### Variaveis de ambiente nao aplicadas

Se estiver usando `.env`, recrie os containers:

```bash
docker compose up --build --force-recreate
```
