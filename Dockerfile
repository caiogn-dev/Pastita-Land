# Dockerfile (Versão 2 - com node:18-slim)

# 1. Estágio de Dependências (deps)
# Usando a imagem 'slim' que é mais robusta para networking
FROM node:18-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Mantemos a flag do OpenSSL por segurança
RUN NODE_OPTIONS=--openssl-legacy-provider npm install --frozen-lockfile

# 2. Estágio de Build (builder)
FROM node:18-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Estágio Final de Produção (runner)
FROM node:18-slim AS runner
WORKDIR /app

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT="3000"

CMD ["node", "server.js"]