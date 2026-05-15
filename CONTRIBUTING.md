# Contributing to Vanta-Key

## Prerequisites

- Node.js ≥ 20, pnpm ≥ 9
- Rust + `wasm32-unknown-unknown` target (`rustup target add wasm32-unknown-unknown`)
- Stellar CLI (`cargo install --locked stellar-cli`)

## Setup

```bash
pnpm install
pnpm build
```

## Remote Caching (Turborepo)

This project uses Turborepo with remote caching enabled. To link your local
environment to a remote cache:

1. **Vercel Remote Cache** (default):

   ```bash
   npx turbo login
   npx turbo link
   ```

2. **Self-hosted remote cache** — set the following environment variables:
   - `TURBO_API` — URL of your remote cache server
   - `TURBO_TOKEN` — auth token for the cache server
   - `TURBO_TEAM` — team identifier

Remote caching is configured in `turbo.json` under the `remoteCache` key.

## Workflow

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make changes inside the relevant package (`packages/shared`, `proxy`, `ops`, or `contracts`)
3. Run `pnpm lint` to check code quality, then `pnpm build` and `pnpm test` from the root
4. Open a pull request against `main`

## Pre-commit Hooks

A Husky pre-commit hook runs `lint-staged` automatically on staged files.
To skip hooks for a commit (emergencies only): `git commit --no-verify`

## Package Responsibilities

| Package     | Stack          | Purpose                                  |
| ----------- | -------------- | ---------------------------------------- |
| `shared`    | TypeScript     | Shared types consumed by all TS packages |
| `proxy`     | Fastify + TS   | Off-chain API engine                     |
| `ops`       | Next.js 15     | Admin dashboard frontend                 |
| `contracts` | Rust / Soroban | On-chain Stellar smart contracts         |

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

## Code of Conduct

Be respectful. Contributions of all experience levels are welcome.
