---
title: Adapters — the LLM bridge
description: How memoryblock talks to every AI provider. The adapter layer is a thin pass-through to aiplug's runtime registry.
---

# Adapters

memoryblock does not ship per-provider adapter code. The whole adapter layer is a single, ~50-line file in `@memoryblock/adapters` that wraps the `createLLMAdapter` factory from the bundled `aiplug` runtime. The provider list, the wire format, the model catalogue, and the auth surface all come from aiplug's registry.

This page covers two things: how memoryblock's adapter layer is wired, and what to configure on the memoryblock side. The provider list itself (Bedrock, OpenAI, Anthropic, Gemini, Ollama, MiniMax, DeepSeek, Moonshot, GLM, Zhipu, Together, Groq, vLLM, llama.cpp server, plus 100+ more) lives in the [Aiplug provider registry](/aiplug/registry).

## The adapter layer

[memoryblock/packages/adapters/src/index.ts](https://github.com/memoryblock-io/memoryblock) is the whole story:

```typescript
import { createLLMAdapter, type AiplugConfig } from 'aiplug';

export function createMemoryAdapter(config: MemoryAdapterConfig): LLMAdapter {
  return createLLMAdapter({
    provider: config.provider,        // any aiplug-registered slug
    model: config.model,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    options: { providerOptions: config.providerOptions },
  });
}
```

Every chat call, every stream, every token count in the monitor goes through this single function. The `LLMAdapter` shape it returns is identical to what the monitor consumes in `@memoryblock/types`, so the rest of memoryblock stays provider-agnostic.

## Configuring a block

Two fields on the block's `config.json` matter:

```json
{
  "adapter": {
    "provider": "minimax",          // any aiplug-registered slug
    "model": "MiniMax-M3",          // model id for that provider
    "region": "us-east-1",          // optional, for Bedrock family
    "baseURL": null,                // optional, for self-hosted endpoints
    "maxTokens": 4096,              // sampling hint, forwarded to aiplug
    "cacheControl": false           // Anthropic / Bedrock prompt caching
  }
}
```

The monitor also resolves credentials for the block at startup, in this order:

1. `auth.providers?.[provider]?.[field]` — the generic auth shape in `auth.json`.
2. `auth?.[provider]?.[field]` — the legacy per-provider field, kept for backward compat.
3. `auth?.[legacyAlias]?.[field]` — for the original five providers (e.g. `aws` -> `bedrock` / `bedrock-aws`).
4. `<SLUG>_<FIELD>` env var (e.g. `MINIMAX_API_KEY`).
5. `<FIELD>` env var (e.g. `API_KEY`, `AWS_REGION`).

Adding a new provider requires no memoryblock change. The provider ships in aiplug, and memoryblock picks it up automatically.

## Adding a provider (advanced)

The full workflow is in the [Aiplug embedding guide](/aiplug/embedding) and [provider registry](/aiplug/registry). Short version: a new provider means

1. A new entry in `aiplug/data/registry.json`.
2. A new transport class in `aiplug/src/providers/<slug>/`.
3. A `pnpm build:registry` to regenerate the thin per-provider shims.

After that, the provider appears in `mblk init`, in the web UI's provider dropdown, and in `/api/providers`. memoryblock picks it up without any code change.

## What's not an adapter

The following live in the rest of the monorepo, not in `@memoryblock/adapters`:

- The monitor loop (`@memoryblock/core`).
- The tool registry and sandbox (`@memoryblock/tools`).
- The cost tracker, gatekeeper, memory manager (`@memoryblock/core`).
- The channel layer (`@memoryblock/channels`).
- The HTTP / WebSocket API (`@memoryblock/api`).
- The CLI (`memoryblock`).

The adapter is just the one bridge between the monitor loop and the LLM. Everything else is host logic.
