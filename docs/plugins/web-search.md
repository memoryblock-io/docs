---
title: Web Search Plugin
description: Using the Brave Search plugin to equip your monitors with live web access.
---

# Web Search Plugin

The `@memoryblock/plugin-web-search` package equips your block monitors with live internet access. It uses the Brave Search API to fetch high-quality, real-time results.

## Installation

This plugin can be installed via the CLI:

```bash
mblk add web-search
```

## Configuration

When installed, the specific tool `search_web` is added to your block's `config.json`. 

You must provide a Brave Search API key in your workspace's `auth.json`:

```json
{
  "brave": {
    "apiKey": "BSAx..."
  }
}
```

> **Tip:** You can get a free Brave Search API key (2k requests/month) at [brave.com/search/api](https://brave.com/search/api/).

## Usage

Once configured, the monitor will automatically use the `search_web` tool when you ask it about current events, documentation, or facts outside its training data.

> "Can you search the web for the latest updates on Bun v1.1 release notes?"

The monitor will formulate a query, call the tool, and synthesize the result blocks from Brave into its response.
