# Troubleshooting

[Voltar ao README](../README.md)

## npm

### Erro ao instalar dependências

```bash
npm ci
```

Se falhar:

- confirme a versão do Node.js `20+`
- remova `node_modules` e tente novamente
- valide se o `package-lock.json` está sincronizado

### Testes falhando

```bash
npm test
npm run coverage
```

Se falhar:

- execute `npm run test:unit` e `npm run test:integration` separadamente
- valide se nenhum arquivo foi alterado sem atualização dos testes

## Docker

### Build falhando

```bash
npm run docker:build
```

Se falhar:

- confira o `Dockerfile`
- valide se o Docker está iniciado
- revise mensagens de permissão ou cache corrompido

### Container sobe, mas fica unhealthy

```bash
docker compose logs -f api
curl http://localhost:3000/health
```

Verifique:

- se a API iniciou corretamente
- se a porta `3000` está livre
- se o endpoint `/health` responde `200`

## Porta ocupada

Se a porta `3000`, `3001` ou `3002` já estiver em uso:

```bash
docker ps
npm run cd:cleanup
docker compose down
```

Depois, suba novamente o ambiente desejado.

## Workflow GitHub Actions

### CI não executa como esperado

Confira:

- se o evento foi `push` para `main`
- se o evento foi `pull_request` para `main`
- se os scripts chamados pelo workflow existem no `package.json`

### CD simulada não sobe homologação ou produção

Confira:

```bash
bash scripts/cleanup-local-deploy.sh
bash scripts/deploy-homolog.sh product-reviews-api:local
bash scripts/smoke-test.sh http://127.0.0.1:3001
```

## Docker Hub

### Push não ocorre no CI

Isso é esperado quando:

- o evento não é `push` na `main`
- `DOCKERHUB_USERNAME` não existe
- `DOCKERHUB_TOKEN` não existe

O fluxo foi projetado para ignorar esse passo com segurança.

[Voltar ao README](../README.md)
