#!/usr/bin/env bash
set -euo pipefail

for container_name in product-reviews-homolog product-reviews-production; do
  docker rm -f "${container_name}" >/dev/null 2>&1 || true
done

echo "Containers locais de CD simulada removidos."
