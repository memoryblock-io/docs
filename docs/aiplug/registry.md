---
title: Aiplug provider registry
description: How providers are registered, discovered, and added. The runtime registry of 100+ AI backends.
---

# Provider registry

Every provider in aiplug is registered in `data/registry.json` and resolves to a single `Transport` class. The registry is the source of truth — adding a new provider is a one-file change.

## What's in the registry

`data/registry.json` carries the runtime-only fields:

```json
{
  "anthropic": {
    "module": "anthropic",
    "class": "AnthropicTransport",
    "defaultBaseURL": "https://api.anthropic.com",
    "auth": "x-api-key",
    "authHeader": "x-api-key"
  },
  "openai": {
    "module": "openai",
    "class": "OpenAITransport",
    "defaultBaseURL": "https://api.openai.com/v1",
    "auth": "bearer"
  },
  "ollama": {
    "module": "ollama",
    "class": "OllamaTransport",
    "defaultBaseURL": "http://localhost:11434/v1",
    "auth": "none"
  }
}
```

A separate `data/registry.meta.json` carries cosmetic fields: `displayName`, `notes`, `category`, `popularModels`, `envVar`. The runtime never reads the meta file; it's for the CLI, the TUI picker, and the introspection surface.

## Discovery

`AIPlug` looks up providers via `getEntry(slug)`. The entry returns the transport module path, the class name, the default base URL, and the auth scheme. The client uses this to:

1. Validate the user-supplied config (`defaultBaseURL`, `auth`) before instantiating the transport.
2. Dynamic-import the transport module on first use.
3. Construct the transport with the merged config.

Introspection is sync and safe before any transport is loaded:

```ts
const ai = new AIPlug({ transport: 'anthropic', apiKey: '...', model: '...' });

// Sync — no transport instance needed
const caps = ai.capabilities();              // → { name, version, capabilities, auth, defaultBaseURL, … }
const desc = ai.describeProvider('bedrock');  // → { slug, displayName, defaultBaseURL, auth, popularModels, envVar, … }
const fields = ai.configSchema('bedrock');   // → { fields: [{ key, label, secret, required, default, help, envVar }] }
const list = ai.providers();                  // → ProviderDescriptor[] (every registered provider)
```

These sync APIs are the integration points memoryblock uses to render its provider picker, the auth form, and the model dropdown.

## Adding a new provider

1. Create `src/providers/<slug>/index.ts` and `src/providers/<slug>/capabilities.ts` (if it has its own metadata).
2. Implement the transport by extending `OpenAITransport` (for OpenAI-shaped servers) or `Transport` (for custom wire formats).
3. Add the entry to `data/registry.json` (`module`, `class`, `defaultBaseURL`, `auth`).
4. Add the cosmetic entry to `data/registry.meta.json` (`displayName`, `notes`, `popularModels`, `envVar`).
5. Run `npm run build:registry` to regenerate the thin per-provider files and the auto-generated `OpenAI`-compatible shims.

That's the entire workflow. No core change required.

## The `OpenAICompatible` shortcut

Any server that speaks the OpenAI Chat Completions wire format — Together, Groq, OpenRouter, Fireworks, llama.cpp server, vLLM, LM Studio, and many more — gets aiplug support for free by extending `OpenAICompatibleTransport`. You only need to set `defaultBaseURL` and `auth`. The class inherits all chat / stream / embeddings / images / audio / models logic from the OpenAI transport.

```ts
import { OpenAICompatibleTransport } from '../openai-compatible/index.js';
import { METADATA as OPENAI_METADATA } from '../openai/capabilities.js';

export class MyProviderTransport extends OpenAICompatibleTransport {
  override capabilities() {
    return { ...OPENAI_METADATA, name: 'my-provider', defaultBaseURL: 'https://api.example.com/v1', auth: 'bearer' };
  }
}
```

Add the entry to `data/registry.json`. Done.

## Notable providers shipped today

aiplug ships with first-class support for every major commercial and open-source model API. Highlights:

- **Anthropic** — Claude 3.5/3.7/4 family, including reasoning and prompt caching.
- **OpenAI** — GPT-4o, GPT-4-turbo, o1, o3, with full tool calling and JSON mode.
- **AWS Bedrock** — Claude, Llama, Mistral, Cohere, AI21, Stability, including Converse and ConverseStream wire formats.
- **Google Gemini** — Gemini Pro, Flash, with native multimodal content.
- **MiniMax, DeepSeek, Moonshot, GLM, Zhipu, Yi, Qwen** — Chinese model families with OpenAI-shaped APIs.
- **Ollama, vLLM, llama.cpp, LM Studio** — local model servers, no auth required.
- **OpenRouter, Together, Groq, Fireworks, Anyscale, DeepInfra** — inference aggregators.
- **Plus 100+ more** — every server that speaks OpenAI Chat Completions or a custom Transport.

Each provider carries its own `capabilities()` and `defaultBaseURL`. The full list is in `data/registry.meta.json`.

## What providers can advertise

Each transport's `capabilities()` returns a `TransportMetadata` object:

```ts
{
  name: 'openai',
  version: '0.1.0',
  capabilities: ['chat', 'streaming', 'tools', 'vision', 'embeddings', 'images', 'audio-tts', 'audio-stt', 'json-mode', 'function-calling'],
  defaultBaseURL: 'https://api.openai.com/v1',
  auth: 'bearer',
}
```

The `capabilities` array is what tells the host which methods to expose. A transport advertising only `['chat', 'streaming']` will refuse to handle `embeddings()` or `images()` calls. This is the basis for aiplug's "no implicit fallback" guarantee — calling a method the transport doesn't support throws an explicit `AIPlugError` rather than silently falling through to a different transport.

## Next steps

- [Stream protocol](stream.md) — the chunk shape every transport emits.
- [Embedding guide](embedding.md) — drop aiplug into another project.
- [HTTP server](http-server.md) — when to use the bundled OpenAI-compatible gateway.
