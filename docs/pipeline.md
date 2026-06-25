# Pipeline de CI/CD

## CI

O workflow de CI executa automaticamente em `push` para `main` e `develop`, alem de `pull_request`.

Etapas principais:

- instalar dependencias com `npm ci`
- validar lint com ESLint
- validar formatacao com Prettier
- executar testes com cobertura
- executar `npm audit --audit-level=high`
- construir a imagem Docker

## CD local simulada

O workflow `.github/workflows/cd.yml` roda apenas por `workflow_dispatch` e existe para fins de portfolio.

Etapas principais:

- construir a imagem Docker da aplicacao
- fazer deploy local de homologacao no runner na porta `3001`
- rodar smoke test em `/health` e `/api/reviews`
- fazer deploy local de producao simulada na porta `3002`
- rodar smoke test final
- publicar um resumo da execucao no GitHub Actions Summary

Esse fluxo nao usa servidor externo, credenciais nem infraestrutura paga. Ele demonstra a esteira de entrega continua de forma totalmente local e segura.
