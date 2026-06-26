#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-product-reviews-lab}"

if k3d cluster list 2>/dev/null | awk 'NR>1 { print $1 }' | grep -qx "${CLUSTER_NAME}"; then
  k3d cluster delete "${CLUSTER_NAME}"
  echo "Cluster k3d ${CLUSTER_NAME} removido."
else
  echo "Cluster k3d ${CLUSTER_NAME} nao encontrado."
fi
