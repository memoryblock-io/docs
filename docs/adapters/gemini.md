---
title: Google Gemini Adapter
description: Using Gemini models with memoryblock.
---

# Google Gemini Adapter

The Gemini adapter connects to Google's official OpenAI-compatible endpoint (`generativelanguage.googleapis.com/v1beta/openai`). This ensures highly reliable function calling and structured outputs.

## Configuration

Update your block's `config.json` (`_playground/memoryblock-ws/blocks/<block-name>/config.json`):

```json
{
  "adapter": {
    "provider": "gemini",
    "model": "gemini-2.5-flash",
    "maxTokens": 8192,
    "cacheControl": false
  }
}
```

## Authentication

Add your Gemini API key (from Google AI Studio) to your workspace `auth.json`:

```json
{
  "gemini": {
    "apiKey": "AIzaSy..."
  }
}
```

Alternatively, you can set the `GEMINI_API_KEY` environment variable.

## Supported Models
- `gemini-2.5-pro` (Recommended for complex reasoning)
- `gemini-2.5-flash` (Fastest/Cheapest)
