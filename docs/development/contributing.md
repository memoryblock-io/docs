---
title: Contributing Code
description: How to add tools, plugins, adapters, and channels to memoryblock.
---

## Coding Standards

- **TypeScript** — Strict mode, ESM only (`"type": "module"`)
- **ESLint** — `typescript-eslint` with `consistent-type-imports`
- **No circular deps** — Core defines interfaces, other packages implement
- **Graceful degradation** — Never crash on individual tool/plugin failures
- **Zero external deps** — Prefer built-in APIs (Node.js http, Bun fetch) over npm packages

## Adding a Tool

1. Create `packages/tools/src/your-tool/index.ts`
2. Implement the `Tool` interface from `memoryblock`
3. Export from `packages/tools/src/index.ts`
4. Register in `createDefaultRegistry()`
5. Add to `_documentation/tools-reference.md`

## Adding a Plugin

```
packages/plugins/your-plugin/
├── package.json           ← name: @memoryblock/plugin-your-plugin
├── tsconfig.json          ← extends: ../../../tsconfig.json
└── src/
    └── index.ts           ← export const tools = [yourTool];
```

1. Create the directory structure above
2. `package.json` should depend on `memoryblock: "workspace:*"`
3. Export a `tools` array of `{ definition, execute }` objects
4. Add to `packages/plugins/installer/registry/plugins.json`
5. Run `pnpm install && pnpm build` to verify

## Adding an Adapter

1. Create `packages/adapters/src/your-adapter/index.ts`
2. Implement the `LLMAdapter` interface from `memoryblock`
3. Export from `packages/adapters/src/index.ts`
4. Register in the adapter factory

## Adding a Channel

1. Create `packages/channels/src/your-channel/index.ts`
2. Implement the `Channel` interface from `memoryblock`
3. Export from `packages/channels/src/index.ts`
4. Register in the channel factory

## Testing Changes

```bash
pnpm dev:build             # Compile all packages
pnpm dev:lint              # Check for lint errors
pnpm dev:verify            # Full failsafe test suite
pnpm mblk:status           # Verify CLI works
pnpm dev:server            # Verify web UI + API works
```