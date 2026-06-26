#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-product-reviews-lab}"
API_PORT="${API_PORT:-8080}"
SERVERS="${SERVERS:-1}"
AGENTS="${AGENTS:-1}"

cluster_exists() {
  k3d cluster list 2>/dev/null | awk 'NR>1 { print $1 }' | grep -qx "${CLUSTER_NAME}"
}

if cluster_exists; then
  echo "Cluster k3d ${CLUSTER_NAME} ja existe."
else
  k3d cluster create "${CLUSTER_NAME}" \
    --servers "${SERVERS}" \
    --agents "${AGENTS}" \
    --port "${API_PORT}:80@loadbalancer" \
    --wait
fi

kubectl config use-context "k3d-${CLUSTER_NAME}" >/dev/null
kubectl wait --for=condition=Ready node --all --timeout=180s

if kubectl -n kube-system get deployment traefik >/dev/null 2>&1; then
  kubectl -n kube-system rollout status deployment/traefik --timeout=180s
else
  echo "Traefik ainda nao apareceu como deployment. O Ingress sera validado durante o deploy."
fi

echo "Cluster pronto. A aplicacao Kubernetes ficara acessivel em http://127.0.0.1:${API_PORT} apos o deploy."
