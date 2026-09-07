---
title: memoryblock — local AI workspaces
description: Isolated, persistent AI workspaces that run on your machine. Open source. No cloud. Single binary.
---

## Installation

```bash
# Install globally with npm
npm install -g memoryblock

# Or use with bun
bun install -g memoryblock
```

Run on a $5 VPS as comfortably as a MacBook Pro. Single binary, no Docker, no Python runtime, no cloud account.

## What memoryblock gives you

- **Blocks** — isolated workspaces with their own memory, identity, and tools.
- **Any model** — Ollama, AWS Bedrock, OpenAI, Anthropic, Google Gemini, plus 100+ providers via the bundled `aiplug` runtime. No per-provider code to maintain.
- **Multi-agent** — your block can spawn short-lived sub-agents in parallel for fan-out work.
- **Channels** — chat from the CLI, the local web dashboard, or Telegram.
- **Stable API** — a single `POST /v1/chat` endpoint for external apps and tools.
- **No lock-in** — your data is plain Markdown + JSON in `~/.memoryblock`. Copy a folder, move a monitor to another machine.

## Quick start

### 1. Initialise

```bash
mblk init
```

The interactive setup wizard walks you through:

- **LLM provider** — pick from any registered aiplug provider (Bedrock, OpenAI, Anthropic, Gemini, Ollama, plus 100+ more).
- **Channel** — CLI, local web dashboard, or Telegram.
- **First block** — creates your initial AI workspace with sensible defaults.

All credentials are stored in `auth.json` at the workspace level. Move the folder, your auth travels with it.

### 2. Start your monitor

```bash
# CLI mode (interactive terminal)
mblk start home

# Telegram mode
mblk start home --channel telegram

# Web dashboard as a background daemon
mblk start home --channel web -d
```

The web dashboard binds to `127.0.0.1` by default — it's a local control panel, not a public service. The server prints its bearer token on first start; copy it into the dashboard to log in.

### 3. Check status and stop

```bash
mblk status                # list blocks + their state
mblk stop home             # stop a specific block
mblk stop                  # stop all blocks
```

## Directory structure

```
~/.memoryblock/ws/           ← your workspace (portable, plain text)
├── config.json              ← workspace defaults
├── auth.json                ← credentials (API keys) — gitignored
├── founder.md               ← your profile (shared across blocks)
└── blocks/
    ├── home/
    │   ├── config.json      ← block settings, adapter, permissions
    │   ├── monitor.md       ← monitor identity and personality
    │   ├── memory.md        ← persistent context
    │   ├── session.json     ← crash-recovery state
    │   ├── pulse.json       ← autonomic background tasks
    │   ├── agents/          ← ephemeral sub-agent workspaces
    │   └── logs/            ← conversation history
    └── work/
        └── ...
```

## Next steps

- **[Architecture](architecture.md)** — blocks, monitors, the engine, and the conversation loop.
- **[Tools reference](tools-reference.md)** — the full list of built-in and plugin capabilities.
- **[CLI commands](commands.md)** — every `mblk` command with options.
- **[Configuration](configuration.md)** — the memoryblock filesystem and settings, end to end.
- **[Aiplug](aiplug/index.md)** — the transport layer underneath memoryblock. Read this if you want to embed `aiplug` in another project, or add your own provider.
