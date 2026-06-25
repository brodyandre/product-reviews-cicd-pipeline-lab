#!/usr/bin/env bash
set -euo pipefail

tracked_sensitive_files="$(
  git ls-files \
    | grep -Ev '(^|/)\.env\.example$' \
    | grep -E '(^|/)\.env($|\.)|(^|/)\.npmrc$|(^|/).*\.pem$|(^|/).*\.key$|(^|/)id_rsa($|\.pub$)' \
    || true
)"

if [ -n "${tracked_sensitive_files}" ]; then
  echo "Arquivos potencialmente sensiveis versionados detectados:" >&2
  printf '%s\n' "${tracked_sensitive_files}" >&2
  exit 1
fi

echo "Nenhum arquivo sensivel versionado foi detectado."
