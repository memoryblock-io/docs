---
title: Aiplug — the transport layer underneath memoryblock
description: A zero-dependency TypeScript runtime that gives every AI backend one identical face.
---

# Aiplug

Aiplug is the transport layer that powers every AI call in memoryblock. It is a small, dependency-free TypeScript runtime that gives every AI backend — online API or local server — one identical interface.

## What it is

- A single `AIPlug` class that loads any registered transport lazily.
- A typed `ChatMessage` / `ToolCall` / `StreamChunk` shape that is the same regardless of provider.
- An `LLMAdapter` façade that matches the canonical `LLMMessage` / `LLMResponse` shape from `@memoryblock/types`.
- A CLI that turns a single binary into an OpenAI-compatible HTTP gateway (`aiplug serve`).
- A per-provider `Transport` class that implements the wire format for one provider.

Aiplug has zero third-party runtime dependencies.

## Where it fits in memoryblock

Memoryblock no longer ships per-provider adapter code. Every provider is sourced from aiplug's registry.

```typescript
import { createLLMAdapter } from 'aiplug';

export function createMemoryAdapter(config: MemoryAdapterConfig): LLMAdapter {
  return createLLMAdapter({
    provider: config.provider,        // 'openai', 'anthropic', 'bedrock', 'ollama', …
    model: config.model,
    apiKey: resolveAuthKey(config),
    baseURL: config.baseURL,
  });
}
```

This is the only place memoryblock touches aiplug.

## When to use aiplug outside memoryblock

Aiplug is a standalone package. It has no opinion on whether you are running an agent loop, a chat product, a server, or a one-off script.

- Talk to multiple AI providers from one codebase without a per-provider code path.
- OpenAI-compatible HTTP server you can point any SDK at, with the underlying provider switchable on the fly.
- Tiny runtime that adds no latency on the hot path.

## What it is not

Aiplug is not an agent framework. It does not own the conversation loop, the system prompt, the tool registry, the memory, or the cost tracking. Those are the host's responsibility.

## Next steps

- [Quick start](quick-start.md) — install, configure, run your first chat.
- [Embedding guide](embedding.md) — drop aiplug into another project.
- [Provider registry](registry.md) — how the registry works.
- [CLI reference](cli.md) — every `aiplug` command.
- [Stream protocol](stream.md) — the `StreamChunk` variants.
- [HTTP server](http-server.md) — the OpenAI-compatible gateway.
