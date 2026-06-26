#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EVIDENCE_DIR="${ROOT_DIR}/docs/evidences"

mkdir -p \
  "${EVIDENCE_DIR}/api" \
  "${EVIDENCE_DIR}/local" \
  "${EVIDENCE_DIR}/docker" \
  "${EVIDENCE_DIR}/k8s" \
  "${EVIDENCE_DIR}/cd" \
  "${EVIDENCE_DIR}/github" \
  "${EVIDENCE_DIR}/screenshots"

touch \
  "${EVIDENCE_DIR}/screenshots/.gitkeep" \
  "${EVIDENCE_DIR}/k8s/.gitkeep" \
  "${EVIDENCE_DIR}/cd/.gitkeep" \
  "${EVIDENCE_DIR}/github/.gitkeep"

print_tool_status() {
  local tool_name="$1"

  if command -v "${tool_name}" >/dev/null 2>&1; then
    printf '[ok] %s\n' "${tool_name}"
  else
    printf '[--] %s nao encontrado\n' "${tool_name}"
  fi
}

echo "Workspace de evidencias preparado em docs/evidences."
echo
echo "Ferramentas detectadas:"
print_tool_status node
print_tool_status npm
print_tool_status curl
print_tool_status docker
print_tool_status kubectl
print_tool_status k3d
print_tool_status gh
echo
echo "Proximos comandos recomendados:"
echo "1. npm run evidence:local"
echo "2. npm run evidence:docker"
echo "3. npm run evidence:k8s"
echo "4. npm run evidence:cd"
echo "5. consultar docs/evidences/capture-checklist.md para os prints manuais"
