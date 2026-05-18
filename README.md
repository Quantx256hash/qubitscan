# QubitScan

Live explorer for the **Qubitor testnet** — a post-quantum EVM L1. Reads the
chain directly from the public gateway RPC in the browser (CORS-open, no
indexer, no backend): blocks, `QubitorPQTxV1` transactions, ML-DSA accounts,
and reconstructed post-quantum proof bundles.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:3040  (→ /explorer)
pnpm typecheck
pnpm build
pnpm start        # honors $PORT, defaults to 3040
```

## Data source

All data is fetched client-side from the Qubitor gateway:

```
NEXT_PUBLIC_QUBITOR_RPC   default https://testrpc.qubitor.org/rpc
```

Override in the environment to point at a different gateway. The gateway sends
`access-control-allow-origin: *`, so the browser calls it directly.

## Routes

- `/` → redirects to `/explorer`
- `/explorer` — live overview: head, mining, system contracts, native bridge,
  the verbatim coverage claim, latest blocks, PQ event feed
- `/explorer/blocks`, `/explorer/block/[id]`
- `/explorer/tx/[hash]` — special `QubitorPQTxV1` (type `0x04`) panel
- `/explorer/address/[address]` — balance, security mode, ML-DSA commitment
- `/explorer/proofs`, `/explorer/proofs/[subject]` — reconstructed
  `qbt-testnet-proof-v1` bundles, downloadable

## Stack

- Next.js 15 (app router) · React 19 · TypeScript
- Tailwind CSS v4 (`@theme` tokens; shared Qubitor `qb-*` / explorer `qbx-*`)
- React Three Fiber + Three.js — chain-reactive lattice background that
  ripples on every new block (`frameloop="demand"`, sleeps when hidden)
- viem — JSON-RPC decoding (hex/bignum, ABI events, log decode)
- Lenis smooth scroll + a HUD cursor with magnetic hover

## Deploy

Railway/Vercel autodetect Next.js. `PORT` is honored by `pnpm start`. No env
vars are required for the default testnet; set `NEXT_PUBLIC_QUBITOR_RPC` to
target another gateway.

## Notes

Read-only. No wallet, no writes. Extracted from the Qubitor monorepo
`apps/web` explorer; the marketing site lives separately.
