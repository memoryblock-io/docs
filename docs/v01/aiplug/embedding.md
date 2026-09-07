---
title: Embedding aiplug in another project
description: Drop aiplug into any TypeScript project. Includes the memoryblock LLMAdapter pattern.
---

# Embedding aiplug in another project

Aiplug is designed to be embedded. The package has zero third-party runtime dependencies, ships as ESM, and exposes its full shape via named imports.

## The minimum surface

```ts
import { AIPlug, loadConfig } from 'aiplug';
```

That's it. `AIPlug` is the client class; `loadConfig` reads a profile from `aiplug.config.json` (CLI > env > file > defaults). Every other piece — `Transport`, `ChatMessage`, `ToolCall`, `StreamChunk` — is exported alongside.

## Pattern 1 — explicit config

```ts
import { AIPlug } from 'aiplug';

const ai = new AIPlug({
  transport: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-latest',
});

const reply = await ai.chat({
  model: 'claude-3-5-sonnet-latest',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## Pattern 2 — profile from config

```ts
import { AIPlug, loadConfig } from 'aiplug';

const { config } = loadConfig({}, 'work');   // profile name = 'work'
const ai = new AIPlug(config);
```

`loadConfig` reads `~/.config/aiplug/aiplug.config.json`, walks the CLI > env > file > defaults chain, and returns the resolved `AiplugConfig`.

## Pattern 3 — the `LLMAdapter` façade

If your project already speaks the canonical `LLMMessage` / `LLMResponse` shape (memoryblock does, in `@memoryblock/types`), use `createLLMAdapter` to wrap aiplug without rewriting your host:

```ts
import { createLLMAdapter, type LLMMessage } from 'aiplug';

const adapter = createLLMAdapter({
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',  // optional
});

const reply = await adapter.converse([
  { role: 'user', content: 'hi' } satisfies LLMMessage,
]);

console.log(reply.message.content, reply.stopReason, reply.usage);
```

`converse` and `converseStream` are the canonical memoryblock contract. `createLLMAdapter` is the bridge — it translates `LLMMessage[]` into aiplug's `ChatMessage[]`, calls `ai.chat` or `ai.stream`, and translates the response back.

The re-exported types `LLMMessage`, `LLMResponse`, `LLMAdapterToolDefinition`, `TokenUsage`, `StopReason` are pure aliases of the same names. User code that already targets these types compiles unchanged.

## Memoryblock's pattern

Memoryblock's `@memoryblock/adapters` package is a one-method file:

```ts
// memoryblock/packages/adapters/src/index.ts
import { createLLMAdapter, type AiplugConfig } from 'aiplug';

export function createMemoryAdapter(config: MemoryAdapterConfig): LLMAdapter {
  return createLLMAdapter({
    provider: config.provider,
    model: config.model,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    options: { providerOptions: config.providerOptions },
  });
}
```

That's the entire integration. The monitor, the CLI, the web dashboard, and the `/v1/chat` endpoint all consume this single `LLMAdapter` instance. The provider comes from aiplug's registry, not from any per-provider code path in memoryblock.

## What to import

| Need | Import |
| --- | --- |
| Client class | `AIPlug` |
| Sync introspection | `AIPlug.providers()`, `AIPlug.describeProvider(slug)`, `AIPlug.configSchema(slug)`, `AIPlug.providers()`, `AIPlug.providers({...})` |
| LLMAdapter shape | `createLLMAdapter` |
| Canonical types | `LLMMessage`, `LLMResponse`, `LLMAdapterToolDefinition`, `TokenUsage`, `StopReason`, `MessageRole` |
| Stream chunks | `StreamChunk` (and its variants) |
| Errors | `AIPlugError`, `asSnapshot(err)` |
| Config loading | `loadConfig({}, profileName)` |
| Provider descriptors | `ProviderDescriptor`, `ProviderConfigSchema`, `ConfigField` |

## Things to know

- Aiplug is ESM-only. If your project is CommonJS, use dynamic `import('aiplug')` from a `.cjs` file or convert the project to ESM.
- The transport class is loaded via dynamic import on first use. There is no eager side-effect from constructing `AIPlug` — only the registry lookup is sync.
- `aiplug.AIPlug.capabilities()` is sync and safe to call before `ready()`. It reads the registry entry without instantiating the transport.
- The full HTTP server (`aiplug serve`) is optional. Most embedding projects use aiplug as a library and never start the server.

## Next steps

- [Provider registry](registry.md) — how providers are discovered, added, and introspected.
- [Stream protocol](stream.md) — the `StreamChunk` variants and how to consume them.
- [HTTP server](http-server.md) — when to spin up `aiplug serve` vs embed directly.
