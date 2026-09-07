---
title: Aiplug quick start
description: Install aiplug, configure a provider, run your first chat in under a minute.
---

# Quick start

## Install

```bash
npm install aiplug
```

## Configure a provider

The CLI is the fastest path:

```bash
# Interactive — walks you through apiKey, baseURL, model selection
npx aiplug transport add openai

# Or non-interactive
npx aiplug transport add anthropic --api-key=$ANTHROPIC_API_KEY --model=claude-3-5-sonnet-latest --force --yes
npx aiplug transport add ollama    --base-url=http://localhost:11434 --model=llama3.2 --force --yes
```

Aiplug stores config in `~/.config/aiplug/`. The active provider is one CLI command away:

```bash
npx aiplug transport use anthropic
npx aiplug status
```

## Run the HTTP server

```bash
npx aiplug serve --port=3711
```

This exposes an OpenAI-compatible API at `http://127.0.0.1:3711`. Point any OpenAI SDK at it:

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

The application code never knows which provider is active. Switch providers with `aiplug transport use <slug>` and the same SDK calls route to a different backend.

## Try the chat REPL

```bash
npx aiplug chat claude-3-5-sonnet-latest
```

Minimal streaming REPL. No banner, no onboarding, no colour noise. Direct prompt → streamed reply → next prompt. Slash commands: `/help`, `/model <name>`, `/provider`, `/clear`, `/exit`. `Ctrl+C` aborts the current stream; idle `Ctrl+C` or `Ctrl+D` exits.

## Use it programmatically

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

console.log(reply.message.content);
```

For streaming, iterate the async iterable:

```ts
for await (const chunk of ai.stream({
  model: 'claude-3-5-sonnet-latest',
  messages: [{ role: 'user', content: 'Tell me a story.' }],
})) {
  if (chunk.type === 'text-delta') process.stdout.write(chunk.delta);
  if (chunk.type === 'finish') console.log('\n[done]', chunk.reason);
}
```

## What just happened

1. Aiplug looked up the registry entry for `anthropic` in `data/registry.json`.
2. It dynamic-imported the transport module at `dist/providers/anthropic/index.js`.
3. The transport's `chat()` made one `fetch()` call to the Anthropic API.
4. Aiplug normalised the response into the canonical `ChatMessage` / `ChatResponse` shape.

No hidden retries. No routing layer. No token accounting unless you ask for it.

## Next steps

- [Embedding guide](embedding.md) — drop aiplug into another project.
- [Provider registry](registry.md) — how providers get registered.
- [CLI reference](cli.md) — every `aiplug` command.
