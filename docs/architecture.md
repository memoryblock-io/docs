---
title: Architecture
description: How blocks, monitors, tools, channels, and the engine work together.
---

## High-Level Overview

```
User ──→ Channel ──→ Monitor ──→ LLM Adapter ──→ Cloud LLM
                        ↕              ↕
                    Gatekeeper    Tool Registry
                        ↕         ↙    ↓    ↘
                    Human OK    FS   Shell  Plugins
```

## Core Concepts

### Blocks
Isolated AI workspaces. Each block has its own:
- **Config** — adapter, channel, memory, goals, permissions
- **Pulse** — current state (SLEEPING, ACTIVE, BUSY, ERROR)
- **Memory** — persistent context that survives sessions
- **Costs** — per-block token and cost tracking

### Monitors
The resident intelligence of each block. A monitor:
1. Receives messages from one or more channels (CLI, Telegram, etc.)
2. Builds a conversation loop with the LLM via an adapter
3. Uses the **LIST_TOOLS_AVAILABLE** discovery pattern for token optimization
4. Dispatches tool calls through the registry (validated by the Sandbox)
5. Routes dangerous actions through the Gatekeeper for human approval
6. Manages memory with the 80% threshold rule

### Tools
Actions the AI can take. All tool execution flows through the **ToolSandbox** for permission enforcement before any operation runs.

**Built-in tools:**

| Category | Tools |
|:---------|:------|
| File System | `read_file`, `write_file`, `list_directory`, `create_directory`, `search_files`, `replace_in_file`, `file_info` |
| Shell | `execute_command` (requires approval for unsafe commands) |
| Dev | `run_lint`, `run_build`, `run_test` |
| Identity | `update_monitor_identity`, `update_founder_info` |
| Channels | `send_channel_message` |

**Plugin tools:** `web_search`, `fetch_webpage`, `create_agent`, `query_agent`

### Channels
Communication pathways between the user and the monitor:
- **CLI** — Interactive terminal with streaming output and markdown formatting
- **Telegram** — Bot-based with inline keyboard approvals
- **Web** — Integrated browser dashboard chat UI. Powered by a file-backed queue (`chat.json`) that allows seamless, asynchronous two-way communication with background block daemons without complex websockets or IPC.

All channels are equal citizens. The **MultiChannelManager** binds multiple channels simultaneously and routes messages to and from the correct channel seamlessly.

### Memory Management (80% Rule)
When accumulated tokens hit 80% of the context window:
1. The LLM summarizes current learnings
2. Summary is written to `memory.md`
3. Session is "reborn" with fresh context + memory
4. Token counter resets

### Gatekeeper
Sovereign human approval system. When a tool has `requiresApproval: true`:
- Execution pauses
- User sees the action description on their active channel
- Must explicitly approve or deny
- Denial returns an error result to the LLM

### ToolSandbox
Central enforcement layer that validates every tool call before execution:
- **Path scanning** — blocks access outside permitted scope
- **Sensitive file protection** — `.env`, `auth.json`, SSH keys are never accessible
- **Shell command validation** — detects escape patterns in block-scoped commands
- **Scope-based enforcement** — `block`, `workspace`, or `system` permission levels

## Package Structure

| Package | Role |
|---------|------|
| `memoryblock` (core) | Types, schemas, CLI, engine (Monitor, Gatekeeper, CostTracker, Memory) |
| `@memoryblock/tools` | ToolRegistry, ToolSandbox, built-in FS/Shell/Dev/Identity/Channel tools |
| `@memoryblock/adapters` | LLM adapter interface + Bedrock, OpenAI, Gemini, Anthropic adapters |
| `@memoryblock/channels` | CLI, Telegram channels + MultiChannelManager |
| `@memoryblock/api` | HTTP REST API + WebSocket server |
| `@memoryblock/web` | Web dashboard (static HTML/CSS/JS) |
| `@memoryblock/daemon` | Background process management |
| `@memoryblock/plugin-installer` | Plugin registry + install/remove |
| `@memoryblock/plugin-aws` | AWS SDK client factory |
| `@memoryblock/plugin-web-search` | Brave Search tool |
| `@memoryblock/plugin-fetch-webpage` | Webpage content extraction tool |
| `@memoryblock/plugin-agents` | Multi-agent orchestration (sub-agents) |
