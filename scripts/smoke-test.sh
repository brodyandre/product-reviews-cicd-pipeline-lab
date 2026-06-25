#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-20}"
SLEEP_SECONDS="${SLEEP_SECONDS:-3}"

if [ -z "${BASE_URL}" ]; then
  echo "Uso: $0 <base-url>" >&2
  exit 1
fi

BASE_URL="${BASE_URL%/}"

fetch_with_retry() {
  local url="$1"
  local attempt response

  for attempt in $(seq 1 "${MAX_ATTEMPTS}"); do
    if response="$(curl --silent --show-error --fail "${url}")"; then
      printf '%s' "${response}"
      return 0
    fi

    sleep "${SLEEP_SECONDS}"
  done

  echo "Falha ao acessar ${url} apos ${MAX_ATTEMPTS} tentativas." >&2
  return 1
}

assert_contains() {
  local value="$1"
  local pattern="$2"

  if ! printf '%s' "${value}" | tr -d '[:space:]' | grep -Fq "${pattern}"; then
    echo "Resposta nao contem o padrao esperado: ${pattern}" >&2
    exit 1
  fi
}

health_response="$(fetch_with_retry "${BASE_URL}/health")"
reviews_response="$(fetch_with_retry "${BASE_URL}/api/reviews")"

assert_contains "${health_response}" '"success":true'
assert_contains "${health_response}" '"status":"ok"'
assert_contains "${reviews_response}" '"success":true'
assert_contains "${reviews_response}" '"data":['

echo "Smoke test concluido com sucesso para ${BASE_URL}"
