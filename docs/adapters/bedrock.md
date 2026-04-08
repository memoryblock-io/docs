---
title: Amazon Bedrock Adapter
description: Using AWS Bedrock models with memoryblock.
---

# Amazon Bedrock Adapter

The Bedrock adapter is the default engine for `memoryblock`. It uses the official `@aws-sdk/client-bedrock-runtime` and supports Claude 3 and 3.5 models.

## Configuration

Update your block's `config.json` (`_playground/memoryblock-ws/blocks/<block-name>/config.json`):

```json
{
  "adapter": {
    "provider": "bedrock",
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "region": "us-east-1",
    "maxTokens": 4096,
    "cacheControl": true
  }
}
```

## Authentication

Add your AWS credentials to your workspace `auth.json`:

```json
{
  "aws": {
    "accessKeyId": "AKIA...",
    "secretAccessKey": "...",
    "region": "us-east-1"
  }
}
```

Or run `mblk init` to set them up interactively.

## Supported Models
- `anthropic.claude-3-5-sonnet-20241022-v2:0` (Recommended)
- `anthropic.claude-3-5-haiku-20241022-v1:0` (Fastest/Cheapest)
- `anthropic.claude-3-opus-20240229-v1:0`
