#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/docs/evidences/docker"
BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
AUTO_CLEANUP="${AUTO_CLEANUP:-false}"

mkdir -p "${DOCKER_DIR}"

require_command() {
  local command_name="$1"

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Comando obrigatorio nao encontrado: ${command_name}" >&2
    exit 1
  fi
}

save_json() {
  local output_file="$1"
  local command_output="$2"

  printf '%s' "${command_output}" \
    | node -e "let data='';process.stdin.on('data',c=>data+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(JSON.parse(data),null,2)+'\n'));process.stdin.resume();" \
    > "${output_file}"
}

cleanup() {
  if [ "${AUTO_CLEANUP}" = "true" ]; then
    docker compose down >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

require_command docker
require_command curl
require_command node

cd "${ROOT_DIR}"
docker compose up --build -d >/dev/null
bash "${ROOT_DIR}/scripts/smoke-test.sh" "${BASE_URL}" >/dev/null

docker compose ps > "${DOCKER_DIR}/01-docker-compose-ps.txt"
save_json \
  "${DOCKER_DIR}/02-docker-healthcheck.json" \
  "$(docker inspect --format='{{json .State.Health}}' product-reviews-api)"
curl --silent --show-error --fail "${BASE_URL}/api/reviews" \
  | node -e "let data='';process.stdin.on('data',c=>data+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(JSON.parse(data),null,2)+'\n'));process.stdin.resume();" \
  > "${DOCKER_DIR}/03-docker-list-reviews.json"

if [ "${AUTO_CLEANUP}" = "true" ]; then
  echo "Evidencias Docker atualizadas e ambiente encerrado."
else
  echo "Evidencias Docker atualizadas. O ambiente continua ativo em http://localhost:3000."
  echo "Use npm run docker:down quando terminar os prints."
fi
