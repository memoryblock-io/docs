---
title: Anthropic Claude Adapter
description: Native integration with Anthropic's Claude messages API.
---

# Anthropic Claude Adapter

The Anthropic adapter provides direct integration with Anthropic's powerful `claude` models via their REST Messages API, natively supporting tools, strict schemas, and dynamic conversational memory.

Unlike AWS Bedrock, this directly connects to `api.anthropic.com` using native API keys.

## Configuration

You can enable Anthropic in your block's `config.json` file:

```json
{
  "adapter": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "maxTokens": 4096
  }
}
```

### Supported Models

Any model compatible with Anthropic's Messages API is supported, for instance:
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`
- `claude-3-opus-20240229`

## Authentication

When configuring the block or running `mblk init`, Memoryblock will securely prompt for your active `ANTHROPIC_API_KEY`. 

It will be saved in your `~/.memoryblock/auth.json` (or your workspace's local `auth.json`):

```json
{
  "anthropic": {
    "apiKey": "sk-ant-api..."
  }
}
```

If you prefer using environmental variables for CI/CD or dockerized deployments, simply inject `ANTHROPIC_API_KEY`.

## Sub-Agent Spawning

Because Memoryblock's orchestration relies on `create_agent`, you can natively spin up Anthropic-backed specialized worker nodes mid-conversation by passing `claude-` prefixes in your tool payload:

```text
User: Spawn a new agent called "data-cleaner" using Claude 3.5.
```

The system will automatically map it to the `anthropic` provider.
