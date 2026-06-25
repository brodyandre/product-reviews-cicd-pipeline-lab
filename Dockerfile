FROM node:20-alpine AS base

# Aplica correcoes de seguranca do Alpine antes de montar as demais etapas.
RUN apk upgrade --no-cache libcrypto3 libssl3

WORKDIR /usr/src/app

FROM base AS production-deps

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV REVIEWS_DATA_FILE=/usr/src/app/data/reviews.json

COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY --chown=node:node data ./data

# Remove ferramentas de build do runtime para reduzir superficie de ataque.
RUN rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
