#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-product-reviews-api:local}"
CONTAINER_NAME="product-reviews-homolog"
HOST_PORT="${HOMOLOG_PORT:-3001}"
APP_PORT="${APP_PORT:-3000}"

docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --label "local-cd-simulation=homolog" \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e PORT="${APP_PORT}" \
  -p "${HOST_PORT}:${APP_PORT}" \
  "${IMAGE_NAME}" >/dev/null

echo "Homologacao simulada disponivel em http://127.0.0.1:${HOST_PORT}"
