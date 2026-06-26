#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S_DIR="${ROOT_DIR}/docs/evidences/k8s"
BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"
AUTO_CLEANUP="${AUTO_CLEANUP:-false}"
IMAGE_NAME="${IMAGE_NAME:-product-reviews-api:k8s-local}"

mkdir -p "${K8S_DIR}"

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
    bash "${ROOT_DIR}/scripts/delete-k8s.sh" >/dev/null 2>&1 || true
    bash "${ROOT_DIR}/scripts/delete-k3d-cluster.sh" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

require_command docker
require_command kubectl
require_command k3d
require_command curl
require_command node

cd "${ROOT_DIR}"
docker build --target runner -t "${IMAGE_NAME}" . >/dev/null
bash "${ROOT_DIR}/scripts/setup-k3d-cluster.sh" >/dev/null
bash "${ROOT_DIR}/scripts/deploy-k8s.sh" "${IMAGE_NAME}" >/dev/null
bash "${ROOT_DIR}/scripts/smoke-test.sh" "${BASE_URL}" > "${K8S_DIR}/02-k8s-smoke-test.txt"

kubectl -n product-reviews-lab get pods,svc,ingress \
  > "${K8S_DIR}/01-k8s-status.txt"
pretty_json_to_file \
  "${K8S_DIR}/03-k8s-health.json" \
  "$(curl --silent --show-error --fail "${BASE_URL}/health")"
pretty_json_to_file \
  "${K8S_DIR}/04-k8s-reviews.json" \
  "$(curl --silent --show-error --fail "${BASE_URL}/api/reviews")"

if [ "${AUTO_CLEANUP}" = "true" ]; then
  echo "Evidencias Kubernetes atualizadas e cluster removido."
else
  echo "Evidencias Kubernetes atualizadas. O cluster continua ativo em http://127.0.0.1:8080."
  echo "Use npm run k8s:cleanup e npm run k8s:cluster:delete quando terminar os prints."
fi
