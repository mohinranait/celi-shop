FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy config first so Next.js picks up output: standalone
COPY next.config.mjs ./next.config.mjs
COPY .env            ./.env
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Verify standalone was generated (build will fail here if not)
RUN ls .next/standalone/server.js


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

COPY --from=builder /app/.env .env

USER nextjs

EXPOSE 3900
ENV PORT=3900
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]