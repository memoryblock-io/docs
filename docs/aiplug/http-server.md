---
title: Aiplug HTTP server
description: The OpenAI-compatible gateway. Expose aiplug as a single local endpoint.
---

# HTTP server

`aiplug serve` starts a tiny HTTP server that speaks the OpenAI Chat Completions wire format. Point any OpenAI client SDK at it and switch the underlying provider with a single CLI command.

## Run it

```bash
npx aiplug serve --port=3711 --host=127.0.0.1
```

Binds to loopback by default — the server is a local control plane, not a public service. Pass `--host=0.0.0.0` to make it reachable on the LAN (and understand the implications for auth).

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/v1/chat/completions` | OpenAI Chat Completions; SSE when `stream: true` is set in the body |
| `POST` | `/v1/responses` | Alias for `/v1/chat/completions` |
| `POST` | `/v1/embeddings` | OpenAI embeddings |
| `POST` | `/v1/images/generations` | OpenAI images |
| `POST` | `/v1/audio/speech` | OpenAI TTS |
| `POST` | `/v1/audio/transcriptions` | Multipart upload (Whisper-style) |
| `GET` | `/v1/models` | List models from the active provider |
| `GET` | `/healthz` | Health check |

## Use any OpenAI SDK against it

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:3711/v1',
  apiKey: 'whatever',  // aiplug handles the real auth
});

const reply = await client.chat.completions.create({
  model: 'claude-3-5-sonnet-latest',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

The application code is identical regardless of which provider is active behind the server. Switch providers with `aiplug transport use <slug>` and the next request routes to a different backend — no SDK changes, no restarts needed.

Works with every OpenAI client SDK on the planet: Python `openai`, JS `openai`, Go `openai-go`, Java, Rust, and any tool that speaks the wire format.

## When to use it

- You have an existing tool that talks OpenAI's wire format. Drop aiplug's HTTP server in front and you get a swappable provider for free.
- You want a single endpoint for local model + cloud model routing without writing glue.
- You're prototyping and want to test the same prompt across providers without changing your code.

## When not to use it

- You're already in a Node.js / Bun process and can import aiplug directly. The HTTP server adds a network hop and a JSON round-trip per call.
- You need provider-specific features that the OpenAI wire format doesn't carry. Use the programmatic `AIPlug` API for those.

## Ephemeral ports

Pass `--port=0` for an OS-assigned port. Useful in tests and one-off scripts.

```bash
npx aiplug serve --port=0
```

The CLI prints the bound port on startup.

## See also

- [Stream protocol](stream.md) — how chunks map to OpenAI's SSE format.
- [Embedding guide](embedding.md) — programmatic use of aiplug.
