#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-product-reviews-api:local}"
CONTAINER_NAME="product-reviews-production"
HOST_PORT="${PRODUCTION_PORT:-3002}"
APP_PORT="${APP_PORT:-3000}"

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --label "local-cd-simulation=production" \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT="${APP_PORT}" \
  -p "${HOST_PORT}:${APP_PORT}" \
  "${IMAGE_NAME}" >/dev/null

echo "Producao simulada disponivel em http://127.0.0.1:${HOST_PORT}"
