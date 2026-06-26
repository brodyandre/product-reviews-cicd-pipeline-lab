#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-product-reviews-lab}"
NAMESPACE="${NAMESPACE:-product-reviews-lab}"

cluster_exists() {
  k3d cluster list 2>/dev/null | awk 'NR>1 { print $1 }' | grep -qx "${CLUSTER_NAME}"
}

if ! cluster_exists; then
  echo "Cluster k3d ${CLUSTER_NAME} nao encontrado. Nada para limpar."
  exit 0
fi

kubectl config use-context "k3d-${CLUSTER_NAME}" >/dev/null
kubectl delete namespace "${NAMESPACE}" --ignore-not-found=true --wait=true

echo "Recursos Kubernetes do namespace ${NAMESPACE} removidos."
