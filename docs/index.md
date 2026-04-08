---
title: Getting Started
description: Install memoryblock, set up credentials, and start your first AI monitor.
---

## Installation

```bash
# Install globally
npm install -g memoryblock

# Or use with bun
bun add -g memoryblock
```

## Quick Start

### 1. Initialize (Interactive Setup)

```bash
mblk init
```

This launches the interactive setup wizard that guides you through:
- **LLM Credentials** — Bedrock (AWS), OpenAI, Gemini, or Anthropic
- **Telegram bot** — verified via Telegram API
- **Brave Search** — optional web search capability
- **First block creation** — creates your initial AI workspace

All credentials are stored in `auth.json` — workspace-level for portability, with a fallback to `~/.memoryblock/ws/auth.json`.

### 2. Start Your Monitor

```bash
# CLI mode (interactive terminal)
mblk start home

# Telegram mode
mblk start home --channel telegram

# Web Dashboard (background daemon)
mblk start home --channel web -d
```

### 3. Check Status

```bash
mblk status
```

### 4. Stop

```bash
mblk stop home    # Stop a specific block
mblk stop         # Stop all blocks
```

## Directory Structure

After setup, your filesystem looks like this:

```
~/.memoryblock/ws/           ← Your workspace (portable)
├── config.json              ← Workspace default config
├── auth.json                ← Credentials (API keys)
├── founder.md               ← Your profile (optional)
└── blocks/
    ├── home/
    │   ├── config.json      ← Block-specific settings
    │   ├── pulse.json       ← Autonomic pulse state
    │   ├── memory.md        ← Persistent context
    │   └── logs/            ← Conversation history
    └── work/
        └── ...
```

## Additional Commands

```bash
mblk server start          # Start web UI + API (http://localhost:8420)
mblk server token          # View your API token to log into the web UI
mblk add                   # List available plugins with install status
mblk settings              # Configure plugin parameters
mblk update                # Update memoryblock to latest version
```

## Next Steps

- **[Architecture](architecture.md)** — Understand how blocks, monitors, and the engine work together.
- **[Tools Reference](tools-reference.md)** — Explored the full list of built-in and plugin capabilities.
- **[Configuration](configuration.md)** — Master the memoryblock filesystem and settings.
- **[CLI Commands](commands.md)** — A complete list of all `mblk` terminal commands.
