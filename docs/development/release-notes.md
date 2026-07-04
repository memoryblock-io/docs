---
title: Release notes
description: What shipped in each memoryblock and aiplug release. Subscribe to releases on GitHub for new-version notifications.
---

# Release notes

memoryblock follows semantic versioning. Patch releases fix bugs without changing the public surface. Minor releases add features. Major releases may break compatibility, with a migration note in the changelog.

## Subscribing

Watch the [memoryblock repo](https://github.com/memoryblock-io/memoryblock) and the [aiplug repo](https://github.com/mgks/aiplug) on GitHub and tick **Releases only** to get an email per version.

## Where to read the changelog

- [memoryblock CHANGELOG](https://github.com/memoryblock-io/memoryblock/blob/main/CHANGELOG.md) (in the monorepo root)
- [aiplug CHANGELOG](https://github.com/mgks/aiplug/blob/main/CHANGELOG.md)

## Versioning policy

- `memoryblock` versions the whole monorepo, including the embedded `aiplug`.
- `aiplug` versions independently. memoryblock may pin a specific aiplug version via `pnpm.overrides`.
- A new aiplug release does not require a memoryblock release. memoryblock releases pick up aiplug changes as needed.
- A memoryblock release that touches the LLMAdapter surface (`@memoryblock/adapters`) is a minor bump.

## How to update

```bash
mblk update
```

This self-update command picks the right package manager (npm / bun / pnpm / yarn) based on how memoryblock was originally installed, installs the new version globally, then restarts the running services. Run it from a clean terminal with no blocks running.

If you prefer to update by hand:

```bash
npm install -g memoryblock@latest   # or bun / pnpm / yarn
mblk restart                          # restart blocks + server
```

After updating, the running monitors pick up the new code automatically.

## Pre-release channel

Cutting-edge builds land on the `main` branch of each repo. They are not published to npm. To try a pre-release:

```bash
git clone https://github.com/memoryblock-io/memoryblock.git
cd memoryblock
pnpm install
pnpm dev:build
```

Pre-release builds may have unannounced breaking changes. Don't use them in production.
