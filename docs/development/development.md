---
title: Development Setup
description: Getting started as a memoryblock contributor.
---

## Prerequisites

- **Bun** ≥ 1.0 (`curl -fsSL https://bun.sh/install | bash`)
- **pnpm** ≥ 10 (`npm i -g pnpm`)

> **Note:** Node.js is **not required**. TypeScript compilation (`tsc`) runs via Bun's Node compatibility layer. Bun is the sole runtime.

## Onboarding

```bash
git clone https://github.com/memoryblock-io/memoryblock.git
cd memoryblock

pnpm dev:onboard              # install + build
pnpm dev:onboard -gl          # install + build + link mblk globally
```

After onboarding, all `pnpm dev:*` and `pnpm mblk:*` commands are available from the monorepo root.

## Project Structure

```
memoryblock/
├── packages/
│   ├── core/              ← CLI, engine, types, schemas
│   ├── tools/             ← Tool registry + built-in tools
│   ├── adapters/          ← LLM adapters (Bedrock)
│   ├── channels/          ← Communication (CLI, Telegram)
│   ├── api/               ← HTTP REST API server
│   ├── web/               ← Web UI (static HTML/CSS/JS)
│   ├── daemon/            ← Background process management
│   └── plugins/
│       ├── installer/     ← Plugin registry + installer
│       ├── aws/           ← AWS SDK client factory
│       ├── web-search/    ← Brave Search tool
│       └── fetch-webpage/ ← Webpage content extraction
├── _documentation/        ← User-facing docs
│   └── development/       ← Developer docs (you are here)
├── _playground/           ← Dev workspace environment
├── scripts/               ← Dev scripts (onboard, reset, etc.)
└── .github/workflows/     ← CI/CD
```

## Runtime Architecture

Memoryblock runs **entirely on Bun**. No Node.js process is started at any point:

| Step | Tool | Uses Node.js? |
|------|------|---------------|
| Install deps | `pnpm install` | No — pnpm is standalone |
| Compile TS | `tsc` | No — Bun runs tsc via compat |
| Run CLI | `bun mblk.js` | No — native Bun runtime |
| Run API | `bun mblk.js server start` | No — Bun's built-in HTTP |

The `typescript` npm package is a **dev dependency** used only for type-checking and `.ts` → `.js` compilation. Bun executes it transparently.
