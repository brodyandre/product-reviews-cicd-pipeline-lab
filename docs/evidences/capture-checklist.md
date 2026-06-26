# Checklist de Captura

[Voltar ao README](../../README.md)

## Como usar

1. Rode `npm run evidence:prepare`.
2. Gere as evidências de terminal com os scripts `evidence:*`.
3. Capture manualmente apenas o que depende de navegador ou interface do GitHub.
4. Insira cada print no contexto correto do `README`.

## Comandos automatizados

```bash
npm run evidence:prepare
npm run evidence:local
npm run evidence:docker
npm run evidence:k8s
npm run evidence:cd
```

## Sequência recomendada

| Ordem | Comando ou ação                                                          | Evidência principal                                          | Arquivo sugerido                                               | Inserir no README                                    |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------- |
| 1     | `npm run evidence:prepare`                                               | estrutura de pastas pronta                                   | n/a                                                            | não precisa                                          |
| 2     | `npm run evidence:local`                                                 | arquivos JSON e saídas locais gerados em `docs/evidences/`   | n/a                                                            | apoio para `Endpoints da API` e `Testes e qualidade` |
| 3     | abrir `http://localhost:3000` após subir a app com `npm start`           | dashboard em tema escuro                                     | `docs/evidences/screenshots/01-dashboard-dark-theme.png`       | `Visão geral` ou `Experiência visual`                |
| 4     | na mesma tela                                                            | resumo por produto e lista de reviews                        | `docs/evidences/screenshots/02-summary-and-reviews.png`        | `Experiência visual`                                 |
| 5     | na mesma tela, com erros propositais no formulário                       | validação visível                                            | `docs/evidences/screenshots/03-form-validation-dark-theme.png` | `Experiência visual` ou `Endpoints da API`           |
| 6     | `npm run evidence:docker`                                                | arquivos Docker gerados e ambiente ativo em `localhost:3000` | `docs/evidences/screenshots/04-docker-compose-health.png`      | `Docker`                                             |
| 7     | `npm run evidence:k8s`                                                   | arquivos Kubernetes gerados e app ativa em `127.0.0.1:8080`  | `docs/evidences/screenshots/06-kubernetes-local.png`           | `Kubernetes local com k3d`                           |
| 8     | `npm run evidence:cd`                                                    | arquivos de homologação e produção simulada gerados          | `docs/evidences/screenshots/07-cd-simulated-success.png`       | `Pipeline de CD simulada`                            |
| 9     | `gh run list --workflow ci.yml --limit 5` e `gh run view <RUN_ID> --web` | pipeline de CI com etapas verdes                             | `docs/evidences/screenshots/05-ci-success.png`                 | `Pipeline de CI`                                     |
| 10    | `gh workflow run cd.yml --ref main` e `gh run view <RUN_ID> --web`       | Summary do workflow de CD                                    | opcional                                                       | `Pipeline de CD simulada`                            |

## Arquivos gerados automaticamente

- `docs/evidences/api/`
- `docs/evidences/local/`
- `docs/evidences/docker/`
- `docs/evidences/k8s/`
- `docs/evidences/cd/`

## Capturas manuais que ainda valem a pena

- interface da aplicação em `localhost:3000`
- tela da aplicação exposta por `Ingress` em `127.0.0.1:8080`
- execução visual do workflow `CI`
- Summary final do workflow `CD Local Simulada`

[Voltar ao README](../../README.md)
