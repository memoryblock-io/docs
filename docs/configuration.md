---
title: Configuration
description: Complete reference for workspace, block, and auth configuration in memoryblock.
---

Memoryblock uses a clean, hierarchical configuration system. Higher-level settings cascade down to blocks, with blocks able to override any inherited value.

## Config Hierarchy

```
~/.memoryblock/              ← Global defaults (machine-wide)
├── config.json              ← Global config
└── auth.json                ← Global credentials (fallback)

~/.memoryblock/ws/           ← Your workspace (portable)
├── config.json              ← Workspace config (overrides global)
├── auth.json                ← Workspace credentials (priority)
├── founder.md               ← Founder profile
└── blocks/
    └── <block-name>/
        ├── config.json      ← Block config (overrides workspace defaults)
        ├── monitor.md       ← Monitor identity
        ├── memory.md        ← Persistent context
        ├── session.json     ← Active session state (auto-managed)
        ├── pulse.json       ← Autonomic pulse instructions & status
        ├── costs.json       ← Token/cost tracking
        └── logs/            ← Full conversation logs
```

**Config priority:** Block → Workspace defaults → Global `~/.memoryblock/`

**Auth priority:** Workspace `auth.json` → Global `~/.memoryblock/auth.json`

> Workspace credentials are portable — move the folder anywhere and everything follows.

Every block has a `config.json` that controls its behavior. Here's a complete reference.

## Adapter Settings

```json
{
    "adapter": {
        "provider": "bedrock",
        "model": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
        "region": "us-east-1",
        "maxTokens": 4096,
        "cacheControl": false,
        "baseURL": null
    }
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `provider` | `"bedrock"` | aiplug provider slug. See the [provider registry](/aiplug/registry) for the full list (100+ providers). |
| `model` | Sonnet 4.5 | Model ID. Varies by provider. |
| `region` | `"us-east-1"` | AWS region for Bedrock-family providers. |
| `maxTokens` | `4096` | Maximum output tokens per response. |
| `cacheControl` | `false` | Anthropic / Bedrock prompt caching. |
| `baseURL` | `null` | Optional API endpoint override. Used by Ollama (`http://localhost:11434/v1`) and any OpenAI-compatible endpoint swap. |

### Where the provider list comes from

memoryblock no longer ships per-provider adapter code. The provider list comes from the bundled [aiplug](/aiplug) runtime — every provider in the world (OpenAI, Anthropic, Bedrock, Gemini, Ollama, MiniMax, DeepSeek, Moonshot, GLM, Zhipu, Together, Groq, vLLM, llama.cpp server, …) is sourced from aiplug's registry. Adding a new provider is an aiplug change, not a memoryblock change.

The [provider registry](/aiplug/registry) page has the full list and the discovery workflow.


| Model | ID | Input/Output (per 1M tokens) |
|-------|----|------|
| Claude Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` | $15/$75 |
| Claude Sonnet 4.5 | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` | $3/$15 |
| Claude Sonnet 4 | `us.anthropic.claude-sonnet-4-20250514-v1:0` | $3/$15 |
| Claude Haiku 3.5 | `us.anthropic.claude-3-5-haiku-20241022-v1:0` | $0.80/$4 |

## `auth.json` — Provider Credentials

The `auth.json` file in your workspace holds credentials keyed by provider. Each provider section is optional — only the ones you use need to be filled in.

```json
{
  "providers": {
    "bedrock":   { "apiKey": "AKIA:secret", "region": "us-east-1" },
    "openai":    { "apiKey": "sk-proj-..." },
    "anthropic": { "apiKey": "sk-ant-..." },
    "minimax":   { "apiKey": "..." }
  },
  "telegram":  { "botToken": "8445465...", "chatId": "5315436002" },
  "brave":     { "apiKey": "BSA..." }
}
```

The new `providers` object is the canonical place. Each key is an aiplug provider slug; each value is whatever credentials that provider needs (the schema is discovered from `AIPlug.configSchema(slug)` at runtime). The legacy flat fields — `aws`, `openai`, `google`, `anthropic`, `gemini`, `ollama` — are still honoured and merged into the new shape by `loadAuth()`, so existing auth.json files keep working without migration.

| Field | Auth fields | Environment variable fallback |
|:---|:---|:---|
| `providers.<slug>` | per-provider (auto-discovered) | `<SLUG>_<FIELD>` env (e.g. `MINIMAX_API_KEY`) |
| `aws` *(legacy)* | `accessKeyId`, `secretAccessKey`, `region` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| `openai` *(legacy)* | `apiKey` | `OPENAI_API_KEY` |
| `google` *(legacy)* | `apiKey` | `GOOGLE_API_KEY` (preferred), `GEMINI_API_KEY` (legacy) |
| `anthropic` *(legacy)* | `apiKey` | `ANTHROPIC_API_KEY` |
| `telegram` | `botToken`, `chatId` | — |
| `brave` | `apiKey` | — |
| `brave` | `apiKey` | — |

> **Legacy `gemini` key.** Blocks written before the rename to `google` will still find their API key under the old `gemini` key — it's auto-mirrored at load time. New code should use `google`.

## Ollama Setup State

When you pick Ollama during `mblk init`, memoryblock records install + model state at `~/.memoryblock/ws/ollama.json`:

```json
{
  "installed": true,
  "daemonManaged": true,
  "defaultModel": "qwen2.5:0.5b",
  "installedAt": "2026-06-12T19:50:00.000Z",
  "lastChecked": "2026-06-12T20:05:23.142Z"
}
```

Re-running `mblk init` is silent once this file is present. Delete it to re-trigger the install/serve/pull prompts.

## Tools Configuration

```json
{
    "tools": {
        "enabled": [
            "read_file", "write_file", "list_directory", "create_directory",
            "execute_command", "web_search",
            "search_files", "replace_in_file", "file_info",
            "run_lint", "run_build", "run_test"
        ],
        "searchProvider": "brave",
        "sandbox": true,
        "workingDir": "/path/to/project"
    }
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `sandbox` | `true` | When `true`, file tools are restricted to the block directory. Set to `false` for developer blocks that need full filesystem access. |
| `workingDir` | block path | Working directory for file operations and shell commands. Set this to point at your project. |
| `searchProvider` | `"brave"` | Web search provider. |

### Available Tools

| Tool | Description | Approval |
|------|-------------|----------|
| `read_file` | Read file contents (auto-truncates >100K chars) | No |
| `write_file` | Write/create files | No |
| `list_directory` | List directory contents | No |
| `create_directory` | Create directories | No |
| `search_files` | Grep-based text search across files | No |
| `replace_in_file` | Find-and-replace in files (token-efficient) | No |
| `file_info` | Get file metadata (size, dates) | No |
| `execute_command` | Shell command execution | Auto for safe commands, approval for others |
| `run_lint` | Run ESLint on project | No |
| `run_build` | Run project build (pnpm/npm) | No |
| `run_test` | Run project tests | No |
| `web_search` | Brave web search | No |

**Safe commands** that auto-execute without approval: `ls`, `cat`, `grep`, `find`, `git status/log/diff`, `pnpm lint`, `pnpm build`, `pnpm test`, etc.

## Memory Settings

```json
{
    "memory": {
        "maxContextTokens": 100000,
        "thresholdPercent": 80
    }
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `maxContextTokens` | `100000` | Context window size to use. Opus 4.6 supports up to 200K. |
| `thresholdPercent` | `80` | When context reaches this %, summarize and reset. |

## Execution Permissions

Blocks are structurally restricted across `bash` commands and network fetch tooling using explicit security parameters visible directly within the Dashboard layout:

```json
{
    "permissions": {
        "scope": "block",
        "allowShell": false,
        "allowNetwork": true,
        "maxTimeout": 120000
    }
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `scope` | `"block"` | File system barrier limit. Can be `"block"` (locked), `"workspace"`, or `"system"` (unrestricted). |
| `allowShell` | `false` | When true, grants access to standard `execute_command` terminals. |
| `allowNetwork` | `true` | Allows native REST/HTTP fetch requests from tools like Web Search. |
| `maxTimeout` | `120000` | Process execution abort timeout (in milliseconds). |

## Monitor Identity

The monitor sets these during its first onboarding conversation:

```json
{
    "monitorName": "Sam",
    "monitorEmoji": "🌟"
}
```

These persist across sessions and appear in message headers: `:: home / 🌟 Sam`

## Block Files

Every block contains:

```
blocks/my-block/
├── config.json     # Block configuration
├── pulse.json      # Autonomic instructions & status
├── monitor.md      # Monitor identity, personality, notes
├── memory.md       # Smart context log (auto-managed)
├── session.json    # Active session state (for resumption)
├── chat.json       # WebChannel interactive queue payload
├── costs.json      # Token usage and cost tracking
├── logs/           # Conversation logs (timestamped .txt)
└── agents/         # Agent definitions (if using agent plugin)
```

## Cost Tracking

Costs are tracked **system-level** (zero model tokens wasted). After each response, the session cost is displayed. Cumulative costs persist in `costs.json`.

| Data | Description |
|------|-------------|
| `sessionInput` / `sessionOutput` | Token counts for current session |
| `totalInput` / `totalOutput` | Cumulative across all sessions |
| `sessionCost` / `totalCost` | USD amounts |

## Example: Developer Block (Opus 4.6)

```json
{
    "name": "builder",
    "description": "Self-development block with full capabilities",
    "adapter": {
        "provider": "bedrock",
        "model": "us.anthropic.claude-opus-4-6-v1",
        "maxTokens": 8192,
        "cacheControl": false
    },
    "tools": {
        "sandbox": false,
        "workingDir": "/path/to/project"
    },
    "memory": {
        "maxContextTokens": 200000,
        "thresholdPercent": 80
    }
}
```

Start with: `mblk start builder` (CLI) or `mblk start builder --channel telegram`
