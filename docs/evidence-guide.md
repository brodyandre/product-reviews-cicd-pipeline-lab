# Guia de Evidências

[Voltar ao README](../README.md)

## Objetivo

Este guia ajuda a coletar prints que reforçam empregabilidade, clareza técnica e maturidade de execução no portfólio.

No `README`, prefira distribuir os prints nas seções correspondentes em vez de concentrar tudo em uma galeria única no final.

## Automação de apoio

Antes dos prints manuais, você pode preparar e regenerar evidências de terminal com:

```bash
npm run evidence:prepare
npm run evidence:local
npm run evidence:docker
npm run evidence:k8s
npm run evidence:cd
```

O roteiro resumido de captura fica em [docs/evidences/capture-checklist.md](evidences/capture-checklist.md).

## Prints recomendados

### 1. Interface da aplicação

Capture:

- tela inicial em `http://localhost:3000`
- painel com métricas, resumo por produto e lista de reviews
- hero em tema escuro com o bloco de contexto vivo
- formulário com contador de caracteres e estados de validação

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

### 7. Kubernetes local

Capture:

```bash
npm run k8s:cluster:create
npm run k8s:deploy
npm run k8s:status
npm run k8s:smoke
```

Também vale registrar:

- saída de `kubectl get pods,svc,ingress -n product-reviews-lab`
- acesso em `http://127.0.0.1:8080`
- resposta de `curl http://127.0.0.1:8080/health`

### 8. CD simulada

Capture:

- execução manual do workflow `cd.yml`
- resumo final no GitHub Actions Summary
- evidência das portas `3001` e `3002` no fluxo de homologação e produção simulada

## Dica de apresentação

Ao usar esses prints no README, LinkedIn ou portfólio:

- prefira imagens limpas e legíveis
- destaque terminal, workflow e interface
- evite capturas com informação irrelevante ou ruído visual

## Convenção sugerida de arquivos

- `docs/evidences/screenshots/01-dashboard-dark-theme.png`
- `docs/evidences/screenshots/02-summary-and-reviews.png`
- `docs/evidences/screenshots/03-form-validation-dark-theme.png`
- `docs/evidences/screenshots/04-docker-compose-health.png`
- `docs/evidences/screenshots/05-ci-success.png`
- `docs/evidences/screenshots/06-kubernetes-local.png`
- `docs/evidences/screenshots/07-cd-simulated-success.png`

[Voltar ao README](../README.md)
