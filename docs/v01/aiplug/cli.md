---
title: Aiplug CLI reference
description: Every aiplug command, with options and examples.
---

# CLI reference

The `aiplug` CLI configures providers, runs the chat REPL, and exposes the OpenAI-compatible HTTP server. Run any command with `--help` for the full option list.

| Command | What it does |
| --- | --- |
| `aiplug init` | Create `~/.config/aiplug/` and seed empty config |
| `aiplug transport add <slug>` | Interactively add a provider. `--api-key`, `--base-url`, `--model`, `--force`, `--yes` available |
| `aiplug transport remove <slug>` | Remove a configured provider (`--force`) |
| `aiplug transport list` | Show configured providers + which is active |
| `aiplug transport test <slug>` | Live health-check against the provider's endpoint |
| `aiplug transport use <slug>` | Mark which provider serves the HTTP server |
| `aiplug models` | List models from the active provider's `/models` endpoint |
| `aiplug config` | Print the resolved effective config (CLI > env > file > defaults) |
| `aiplug status [--live]` | Table of providers, optionally with live health probes |
| `aiplug serve [--port=3711] [--host=127.0.0.1]` | Start the OpenAI-compatible HTTP server |
| `aiplug health` | Health-check the active provider |
| `aiplug chat [model]` | Minimal streaming REPL against the active transport |
| `aiplug --json` | Machine-readable output (works on every command) |
| `aiplug --help` | Built-in help |

## Common flags

| Flag | Effect |
| --- | --- |
| `--api-key <key>` | Set the bearer key (or pass `apiKey: 'env:VAR_NAME'` to read from environment) |
| `--base-url <url>` | Override the default base URL for the provider |
| `--model <id>` | Set the default model for the active provider |
| `--force` | Overwrite an existing entry when adding a transport |
| `--yes` | Skip interactive prompts (use with `--force` for non-interactive setup) |
| `--json` | Output machine-readable JSON for any command |
| `--port <port>` | Port to listen on (default 3711) |
| `--host <host>` | Bind interface (default 127.0.0.1) |
| `--live` | Status command polls every provider with a health probe |

## Config file

All configuration lives at `~/.config/aiplug/aiplug.config.json`. The file is JSON. The CLI walks CLI > env > file > defaults when resolving any field.

```json
{
  "active": "anthropic",
  "transports": {
    "anthropic": {
      "apiKey": "env:ANTHROPIC_API_KEY",
      "model": "claude-3-5-sonnet-latest"
    },
    "ollama": {
      "baseURL": "http://localhost:11434/v1",
      "model": "llama3.2"
    }
  }
}
```

`apiKey: "env:VAR_NAME"` is the recommended way to store keys — the file itself never holds a real key, only the env-var name. The CLI prompts for the key on `transport add` and writes this form automatically.

## Chat REPL commands

| Command | Effect |
| --- | --- |
| `/help` | Show available commands |
| `/model <name>` | Switch model mid-session |
| `/provider` | Show active transport + model |
| `/clear` | Clear conversation history |
| `/exit`, `/quit`, `/q` | End the session |

Signals:

| Key | Effect |
| --- | --- |
| `Ctrl+C` during a stream | Aborts the current request, stays in REPL |
| `Ctrl+C` idle | Exits |
| `Ctrl+D` | Exits |

## See also

- [Quick start](quick-start.md) — first five minutes with aiplug.
- [HTTP server](http-server.md) — the OpenAI-compatible gateway.
