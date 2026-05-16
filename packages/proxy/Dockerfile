FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/proxy/package.json ./packages/proxy/
RUN pnpm install --frozen-lockfile
COPY packages/shared/ ./packages/shared/
COPY packages/proxy/ ./packages/proxy/
RUN pnpm --filter @vanta-logic/shared build && pnpm --filter @vanta-logic/proxy build
EXPOSE 3001
CMD ["pnpm", "--filter", "@vanta-logic/proxy", "dev"]
