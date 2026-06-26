#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_DIR="${ROOT_DIR}/docs/evidences/local"

mkdir -p "${LOCAL_DIR}"

require_command() {
  local command_name="$1"

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Comando obrigatorio nao encontrado: ${command_name}" >&2
    exit 1
  fi
}

require_command node
require_command npm

node "${ROOT_DIR}/scripts/reset-data.js" >/dev/null
node "${ROOT_DIR}/scripts/generate-local-api-evidence.js"

npm run lint > "${LOCAL_DIR}/01-lint.txt" 2>&1
npm test -- --forceExit > "${LOCAL_DIR}/02-tests.txt" 2>&1
npm run coverage -- --forceExit > "${LOCAL_DIR}/03-coverage.txt" 2>&1
npm run verify:app > "${LOCAL_DIR}/04-verify-app.txt" 2>&1
npm run format:check > "${LOCAL_DIR}/05-format-check.txt" 2>&1
npm run security:check > "${LOCAL_DIR}/06-security-check.txt" 2>&1

node "${ROOT_DIR}/scripts/reset-data.js" >/dev/null

echo "Evidencias locais atualizadas em docs/evidences/api e docs/evidences/local."
