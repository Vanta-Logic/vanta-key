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

## Workflow

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make changes inside the relevant package (`packages/shared`, `proxy`, `ops`, or `contracts`)
3. Run `pnpm build` and `pnpm test` from the root — Turborepo will only rebuild affected packages
4. Open a pull request against `main`

## Package Responsibilities

| Package | Stack | Purpose |
|---|---|---|
| `shared` | TypeScript | Shared types consumed by all TS packages |
| `proxy` | Fastify + TS | Off-chain API engine |
| `ops` | Next.js 15 | Admin dashboard frontend |
| `contracts` | Rust / Soroban | On-chain Stellar smart contracts |

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

## Code of Conduct

Be respectful. Contributions of all experience levels are welcome.
