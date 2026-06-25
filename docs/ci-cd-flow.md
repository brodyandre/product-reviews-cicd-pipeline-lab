# Fluxo de CI/CD

[Voltar ao README](../README.md)

## Objetivo

Este documento resume, de forma prática, como o laboratório demonstra desenvolvimento, integração contínua e entrega contínua simulada.

## 1. Desenvolvimento

Fluxo básico:

- o desenvolvedor implementa mudanças localmente
- registra as alterações em commit
- envia o código para o GitHub

Comando típico:

```bash
git add .
git commit -m "feat: melhora pipeline de CI"
git push origin main
```

## 2. Integração Contínua

O workflow de CI roda em `push` para `main` e em `pull_request`.

Etapas principais:

- checkout do repositório
- setup do Node.js
- `npm ci`
- verificação da aplicação
- testes unitários
- testes de integração
- lint com ESLint
- coverage com Jest
- lint do Dockerfile com Hadolint
- build da imagem Docker
- scan da imagem com Trivy
- push opcional para Docker Hub quando permitido

Comandos equivalentes locais:

```bash
npm ci
npm run verify:app
npm run test:unit
npm run test:integration
npm run lint
npm run coverage
npm run docker:build
```

## 3. Entrega Contínua simulada

O workflow de CD é manual e controlado. Ele **não faz deploy real em cloud**.

Fluxo:

- build da imagem Docker
- deploy de homologação local na porta `3001`
- smoke test em `/health` e `/api/reviews`
- deploy de produção simulada na porta `3002`
- smoke test final
- resumo da execução no GitHub Actions Summary

Comandos equivalentes locais:

```bash
npm run cd:cleanup
npm run cd:homolog
npm run smoke:homolog
npm run cd:production
npm run smoke:production
npm run cd:cleanup
```

## Valor para portfólio

Este fluxo ajuda a demonstrar:

- disciplina de validação antes de empacotar a aplicação
- uso de containers como artefato de entrega
- promoção do mesmo artefato entre ambientes simulados
- preocupação com segurança e qualidade no pipeline

[Voltar ao README](../README.md)
