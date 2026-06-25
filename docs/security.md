# Segurança

[Voltar ao README](../README.md)

## Objetivo

Este laboratório trata segurança como parte do fluxo técnico, mesmo sendo um projeto local e de portfólio.

## Secrets

O projeto usa secrets apenas quando o push opcional de imagem para Docker Hub está habilitado no GitHub Actions.

Secrets esperados:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Boas práticas aplicadas:

- secrets não ficam versionados no repositório
- o push é ignorado com segurança quando os secrets não existem
- `.env` real não deve ser commitado
- `.env.example` serve apenas como referência de configuração

## Trivy

O workflow de CI executa o Trivy após o build da imagem Docker.

Objetivo:

- identificar vulnerabilidades `HIGH` e `CRITICAL`
- impedir que uma imagem claramente insegura siga no fluxo

Referência local:

```bash
npm run docker:build
```

No pipeline, o scan ocorre automaticamente após o build.

## Permissões mínimas

Os workflows usam permissões mínimas para reduzir superfície de risco.

Prática adotada:

- `contents: read` para leitura do repositório
- uso de login no Docker Hub apenas quando realmente necessário

## Boas práticas aplicadas

- validação robusta no `POST /api/reviews`
- respostas padronizadas para facilitar observabilidade
- healthcheck de container para monitoramento básico
- execução do container com usuário não root quando possível
- `.dockerignore` para evitar envio de arquivos desnecessários para a imagem
- `.gitignore` para bloquear `.env` reais
- verificação local para identificar arquivos sensíveis versionados por engano

## Verificação preventiva local

Comando:

```bash
npm run security:check
```

O script falha se encontrar no Git:

- `.env` ou `.env.*` reais
- `.npmrc`
- arquivos `.pem`
- arquivos `.key`
- arquivos `id_rsa`

## Como validar rapidamente

```bash
npm run lint
npm run coverage
npm run security:check
npm run docker:build
docker compose up --build
curl http://localhost:3000/health
```

[Voltar ao README](../README.md)
