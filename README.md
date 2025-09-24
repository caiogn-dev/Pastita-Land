# Pastita-Land

Landing page moderna para captar **leads** e direcionar acessos para os produtos e canais da **Pastita**. Construída em **Next.js + TypeScript**, estilizada com **Tailwind CSS**, com **Docker/Compose** para desenvolvimento e produção e **scripts auxiliares** (ex.: scraping/transformações) em `scripts/`.

> Observação: o projeto partiu de um starter em Next.js e foi adaptado para a realidade da Pastita.

---

## ✨ Principais recursos

- **UI rápida e responsiva** (App Router).
- **CTAs de conversão** (WhatsApp, pedidos, redes, etc.).
- **Deploy containerizado** (Dockerfile + `docker-compose.dev.yml` e `docker-compose.prod.yml`).
- **Arquitetura tipada** (TypeScript + ESLint).
- **Tailwind** com utilitários e tokens de design.

---

## 🧱 Stack

- **Framework:** Next.js (TypeScript)
- **Estilos:** Tailwind CSS
- **Infra:** Docker/Compose
- **Estrutura:** `src/app` (rotas), `public/` (assets), `scripts/` (utilitários)

---

## 🚀 Começando

### 1) Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** / **pnpm** / **yarn**
- **Docker** e **Docker Compose** (opcional, mas recomendado)

### 2) Variáveis de ambiente

Crie um `.env.local` na raiz (exemplos — ajuste para sua realidade):

```bash
# URL pública
NEXT_PUBLIC_SITE_URL=https://pastita.com.br

# Analytics (opcional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Links de lead/CTA (exemplos)
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/5563999999999
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/pastita


