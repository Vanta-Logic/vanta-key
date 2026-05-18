# Vanta-Key

Decentralized access-policy management for the Stellar ecosystem.  
Vanta-Key lets administrators define, submit, and verify on-chain access
policies through a modern full-stack dashboard.

## Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────────┐
│                 │       │                 │       │                      │
│   ops           │──────▶│   proxy         │──────▶│   contracts          │
│   (Next.js 15)  │ HTTP  │   (Fastify)     │  CLI  │   (Soroban / Rust)   │
│   Admin UI      │       │   API Engine    │       │   Stellar Smart      │
│                 │       │                 │       │   Contract           │
└─────────────────┘       └─────────────────┘       └──────────────────────┘
        │                                                        │
        │ workspace:*                                            │ cargo
        ▼                                                        ▼
┌─────────────────┐                                    (standalone deploy)
│   shared        │
│   (TypeScript)  │
│   Types library │
└─────────────────┘
```

| Package     | Stack                 | Purpose                                                            |
| ----------- | --------------------- | ------------------------------------------------------------------ |
| `shared`    | TypeScript            | Shared `SecretPolicy` type consumed by all TS packages             |
| `proxy`     | Fastify + TypeScript  | Off-chain API engine that bridges the dashboard and the blockchain |
| `ops`       | Next.js 15 + Tailwind | Admin dashboard with Freighter wallet integration                  |
| `contracts` | Rust / Soroban        | On-chain Stellar smart contract for policy verification            |

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`corepack enable pnpm`)
- **Rust** with `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- **Stellar CLI** (for contract deployment):
  ```bash
  cargo install --locked stellar-cli
  ```

### Install & Build

```bash
pnpm install
pnpm build
```

### Run Dev Servers

```bash
# Terminal 1 — proxy API (port 3001)
pnpm --filter @vanta-logic/proxy dev

# Terminal 2 — admin dashboard (port 3000)
pnpm --filter @vanta-logic/ops dev
```

The dashboard connects to the proxy via `NEXT_PUBLIC_PROXY_URL`
(defaults to `http://localhost:3001`).

### Wallet Setup

1. Install the [Freighter](https://freighter.app) browser extension.
2. Create or import a Stellar wallet.
3. Open the dashboard and click **Connect Freighter Wallet**.

## Available Scripts

| Command       | Description                        |
| ------------- | ---------------------------------- |
| `pnpm build`  | Build all packages (via Turborepo) |
| `pnpm dev`    | Run all packages in dev mode       |
| `pnpm test`   | Run all tests                      |
| `pnpm lint`   | Lint all TypeScript packages       |
| `pnpm format` | Format code with Prettier          |

## CI/CD

- **GitHub Actions** — On push/PR to `main`: install → build → lint → test
- **Dependabot** — Weekly updates for npm and Cargo dependencies
- **Pre-commit hooks** — Husky + lint-staged runs ESLint and Prettier
  automatically before every commit

## Testnet Deployment

The Vanta-Key contract is deployed on **Stellar Testnet**:

| Network | Contract ID                                               |
| ------- | --------------------------------------------------------- |
| Testnet | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN4` |

Set this as the `CONTRACT_ID` environment variable in the proxy package.

To invoke the contract on Testnet:

```bash
stellar contract invoke \
  --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN4 \
  --network testnet \
  -- verify \
  --policy '{"client_identity":"G...","resource_hash":"...","expiration_ledger":1000}'
```

Full deployment details are in [`packages/contracts/deployments.json`](packages/contracts/deployments.json).

## License

MIT — see LICENSE.
