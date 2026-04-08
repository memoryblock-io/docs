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
        "cacheControl": false
    }
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `provider` | `"bedrock"` | LLM provider: `bedrock`, `openai`, `anthropic`, `gemini`, or `ollama`. |
| `model` | Sonnet 3.5 | Model ID. Varies by provider. |
| `region` | `"us-east-1"` | AWS region for Bedrock. |
| `maxTokens` | `4096` | Maximum output tokens per response. |
| `cacheControl` | `false` | Anthropic prompt caching. |

### Supported Providers

- **AWS Bedrock**: Claude 3.5 Sonnet, Claude 3 Haiku, Llama 3.
- **OpenAI**: GPT-4o, GPT-4o-mini, o1.
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus.
- **Google Gemini**: Gemini 1.5 Pro/Flash, Gemini 2.0.
- **Ollama**: Run any model locally (Llama 3, Mistral, Qwen, etc). No API key required.


| Model | ID | Input/Output (per 1M tokens) |
|-------|----|------|
| Claude Opus 4.6 | `us.anthropic.claude-opus-4-6-v1` | $15/$75 |
| Claude Sonnet 4.5 | `us.anthropic.claude-sonnet-4-5-20250929-v1:0` | $3/$15 |
| Claude Sonnet 4 | `us.anthropic.claude-sonnet-4-20250514-v1:0` | $3/$15 |
| Claude Haiku 3.5 | `us.anthropic.claude-3-5-haiku-20241022-v1:0` | $0.80/$4 |

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
