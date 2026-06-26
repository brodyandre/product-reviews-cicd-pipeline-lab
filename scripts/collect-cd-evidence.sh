#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CD_DIR="${ROOT_DIR}/docs/evidences/cd"
AUTO_CLEANUP="${AUTO_CLEANUP:-false}"
IMAGE_NAME="${IMAGE_NAME:-product-reviews-api:local}"

mkdir -p "${CD_DIR}"

require_command() {
  local command_name="$1"

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Comando obrigatorio nao encontrado: ${command_name}" >&2
    exit 1
  fi
}

pretty_json_to_file() {
  local output_file="$1"
  local content="$2"

  printf '%s' "${content}" \
    | node -e "let data='';process.stdin.on('data',c=>data+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(JSON.parse(data),null,2)+'\n'));process.stdin.resume();" \
    > "${output_file}"
}

cleanup() {
  if [ "${AUTO_CLEANUP}" = "true" ]; then
    bash "${ROOT_DIR}/scripts/cleanup-local-deploy.sh" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

require_command docker
require_command curl
require_command node

cd "${ROOT_DIR}"
docker build --target runner -t "${IMAGE_NAME}" . >/dev/null
bash "${ROOT_DIR}/scripts/deploy-homolog.sh" "${IMAGE_NAME}" >/dev/null
bash "${ROOT_DIR}/scripts/smoke-test.sh" http://127.0.0.1:3001 \
  > "${CD_DIR}/01-homolog-smoke-test.txt"
bash "${ROOT_DIR}/scripts/deploy-production.sh" "${IMAGE_NAME}" >/dev/null
bash "${ROOT_DIR}/scripts/smoke-test.sh" http://127.0.0.1:3002 \
  > "${CD_DIR}/02-production-smoke-test.txt"

docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' \
  > "${CD_DIR}/03-docker-ps.txt"
pretty_json_to_file \
  "${CD_DIR}/04-homolog-health.json" \
  "$(curl --silent --show-error --fail http://127.0.0.1:3001/health)"
pretty_json_to_file \
  "${CD_DIR}/05-production-health.json" \
  "$(curl --silent --show-error --fail http://127.0.0.1:3002/health)"

if [ "${AUTO_CLEANUP}" = "true" ]; then
  echo "Evidencias de CD simulada atualizadas e containers removidos."
else
  echo "Evidencias de CD simulada atualizadas. Os containers continuam ativos nas portas 3001 e 3002."
  echo "Use npm run cd:cleanup quando terminar os prints."
fi
