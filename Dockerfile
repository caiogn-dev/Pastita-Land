# =========================
# 1) DEPENDÊNCIAS
# =========================
FROM node:18-slim AS deps
WORKDIR /app

# 🔧 OpenSSL para Prisma
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

# =========================
# 2) BUILD
# =========================
FROM node:18-slim AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
# Se usar Prisma, copie o schema antes do build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# (Opcional, mas recomendado se usar Prisma)
# Gera o client antes do build pra evitar erros de import durante o build
RUN npx prisma generate || true

# Se você usa output standalone, basta:
# - Em Next 13/14, o standalone é gerado automaticamente com "output: 'standalone'"
#   no next.config.js. Ex.:
#   module.exports = { output: 'standalone' }
RUN npm run build

# =========================
# 3) RUNTIME
# =========================
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Usuário sem privilégios
RUN addgroup --system --gid 1001 nextjs \
 && adduser  --system --uid 1001 nextjs
USER nextjs

# Public e estáticos
COPY --from=builder /app/public ./public

# O standalone já contém node_modules e server.js
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# (Opcional) manter package.json por conveniência
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "server.js"]
