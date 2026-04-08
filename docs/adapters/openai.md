---
title: OpenAI Adapter
description: Using OpenAI models with memoryblock.
---

# OpenAI Adapter

The OpenAI adapter connects directly to the `api.openai.com/v1` REST API using native `fetch`. It requires zero external dependencies and supports full function calling.

## Configuration

Update your block's `config.json` (`_playground/memoryblock-ws/blocks/<block-name>/config.json`):

```json
{
  "adapter": {
    "provider": "openai",
    "model": "gpt-4o",
    "maxTokens": 4096,
    "cacheControl": false
  }
}
```

## Authentication

Add your OpenAI API key to your workspace `auth.json`:

```json
{
  "openai": {
    "apiKey": "sk-proj-..."
  }
}
```

Alternatively, you can set the `OPENAI_API_KEY` environment variable.

## Supported Models
- `gpt-4o` (Recommended)
- `gpt-4o-mini` (Fastest/Cheapest)
- `o1-preview` (Reasoning - tool support may vary)
