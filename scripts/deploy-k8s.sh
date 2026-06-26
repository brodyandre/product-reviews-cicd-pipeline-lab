#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-product-reviews-lab}"
NAMESPACE="${NAMESPACE:-product-reviews-lab}"
KUSTOMIZE_DIR="${KUSTOMIZE_DIR:-k8s}"
API_PORT="${API_PORT:-8080}"
IMAGE_NAME="${1:-product-reviews-api:k8s-local}"
DEFAULT_IMAGE="product-reviews-api:k8s-local"

cluster_exists() {
  k3d cluster list 2>/dev/null | awk 'NR>1 { print $1 }' | grep -qx "${CLUSTER_NAME}"
}

if ! cluster_exists; then
  echo "Cluster k3d ${CLUSTER_NAME} nao encontrado. Execute scripts/setup-k3d-cluster.sh primeiro." >&2
  exit 1
fi

kubectl config use-context "k3d-${CLUSTER_NAME}" >/dev/null
k3d image import "${IMAGE_NAME}" -c "${CLUSTER_NAME}"

kubectl apply -k "${KUSTOMIZE_DIR}"

if [ "${IMAGE_NAME}" != "${DEFAULT_IMAGE}" ]; then
  kubectl -n "${NAMESPACE}" set image deployment/product-reviews-api \
    product-reviews-api="${IMAGE_NAME}"
fi

kubectl -n "${NAMESPACE}" rollout status deployment/product-reviews-api --timeout=180s
kubectl -n "${NAMESPACE}" get pods,svc,ingress

echo "Aplicacao em Kubernetes disponivel em http://127.0.0.1:${API_PORT}"
