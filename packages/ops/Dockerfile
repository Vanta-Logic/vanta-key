FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ops/package.json ./packages/ops/
RUN pnpm install --frozen-lockfile
COPY packages/shared/ ./packages/shared/
COPY packages/ops/ ./packages/ops/
RUN pnpm --filter @vanta-logic/shared build && pnpm --filter @vanta-logic/ops build
EXPOSE 3000
CMD ["pnpm", "--filter", "@vanta-logic/ops", "dev"]
