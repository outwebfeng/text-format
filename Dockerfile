FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Pin pnpm to v10 — v11 makes ignored-build-scripts fatal even when
# `pnpm.onlyBuiltDependencies` is set in package.json, breaking CI install.
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml* vite.config.ts ./

RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder

WORKDIR /app

COPY . .
RUN pnpm build

# Production image — run the nitro server output
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/.output ./.output

USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
