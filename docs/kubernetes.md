# Kubernetes Local com k3d

[Voltar ao README](../README.md)

## Objetivo

Adicionar uma trilha opcional de execução em Kubernetes local, sem substituir Docker Compose e sem depender de cloud pública.

Neste projeto, o cluster local usa `k3d`, com `Ingress`, `Service`, `Deployment`, `ConfigMap` e dados locais inicializados a partir do seed JSON da própria imagem.

## Requisitos

- Docker ativo
- `kubectl`
- `k3d`

## Estrutura criada

- `k8s/namespace.yaml`
- `k8s/configmap.yaml`
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/ingress.yaml`
- `k8s/kustomization.yaml`

## Fluxo recomendado

### 1. Gerar a imagem local

```bash
npm run k8s:build
```

### 2. Criar o cluster local

```bash
npm run k8s:cluster:create
```

O cluster criado se chama `product-reviews-lab` e publica o Ingress local em `http://127.0.0.1:8080`.

### 3. Fazer o deploy da aplicação

```bash
npm run k8s:deploy
```

### 4. Validar a aplicação

```bash
npm run k8s:status
npm run k8s:smoke
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/api/reviews
```

### 5. Limpar recursos do namespace

```bash
npm run k8s:cleanup
```

### 6. Remover o cluster

```bash
npm run k8s:cluster:delete
```

## O que esse setup demonstra

- empacotamento da API em imagem reaproveitável
- uso de cluster Kubernetes local leve para portfólio
- deploy com `kubectl apply -k`
- publicação da aplicação via Ingress local
- probes de `readiness` e `liveness`
- isolamento simples de configuração com `ConfigMap`

## Observações importantes

- O Kubernetes aqui é opcional e local.
- O projeto continua funcionando normalmente com `npm run dev` e `docker compose up --build`.
- A persistência em Kubernetes continua simples e alinhada ao laboratório: os dados são inicializados do seed JSON e mantidos no ciclo de vida do pod.
- O objetivo é demonstrar domínio de deploy local em cluster, não um ambiente distribuído de produção real.

[Voltar ao README](../README.md)
