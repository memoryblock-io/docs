---
title: Developer Commands
description: Monorepo scripts and local testing commands for contributors.
---

# Developer Commands

Two prefixes, two audiences:

- **`pnpm dev:*`** — Tools for building, testing, and maintaining the monorepo.
- **`pnpm mblk:*`** — Proxies for user-facing `mblk` commands, targeting `_playground/` for testing.

End users don't have access to either of these. They install the core package and use `mblk` directly.

---

## Monorepo Tools (`pnpm dev:*`)

| Command | Description |
|---------|-------------|
| `pnpm dev:build` | Build all packages with tsc |
| `pnpm dev:lint` | Run ESLint across all packages |
| `pnpm dev:lint:fix` | Auto-fix lint errors |
| `pnpm dev:verify` | Run full failsafe test suite |
| `pnpm dev:reset` | Stop processes + unlink global + clean artifacts |
| `pnpm dev:reset --hard` | Same + wipe workspace data (with confirmation) |
| `pnpm dev:clean` | Remove node_modules, dist, tsbuildinfo |
| `pnpm dev:bump <version>` | Bump version across all packages |

---

## User Command Proxies (`pnpm mblk:*`)

Run `mblk` from the local build against `_playground/memoryblock-ws/`. No global link needed.

| Command | Description |
|---------|-------------|
| `pnpm mblk -- <any>` | Run any mblk subcommand |
| `pnpm mblk:start` | Start a block monitor |
| `pnpm mblk:stop` | Stop running monitors |
| `pnpm mblk:shutdown` | Stop all blocks AND the server |
| `pnpm mblk:restart` | Restart: shutdown then start server as daemon |
| `pnpm mblk:token` | View or generate the API token |
| `pnpm mblk:status` | Show all blocks and their state |
| `pnpm mblk:create <name>` | Create a new block |
| `pnpm mblk:reset <block>` | Reset a block's state |
| `pnpm mblk:add` | List or install plugins |
| `pnpm mblk:remove <id>` | Remove a plugin |

### Passing extra arguments

```bash
pnpm mblk:start builder                 # start specific block
pnpm mblk -- server start --port 3000   # server on custom port
pnpm mblk:reset builder -- --hard       # hard reset
pnpm mblk -- settings web-search        # edit plugin settings
```

---

## Who Uses What

| Command | Who | Workspace |
|---------|-----|-----------|
| `pnpm dev:*` | Contributors | Monorepo root |
| `pnpm mblk:*` | Contributors testing user flows | `_playground/memoryblock-ws/` |
| `mblk *` | End users | `~/.memoryblock/` |
