---
title: Architecture
description: How blocks, monitors, tools, channels, and the engine work together.
---

## High-level overview

```
User ──→ Channel ──→ Monitor ──→ LLMAdapter ──→ AIPlug Transport ──→ Cloud / Local LLM
                        ↕                              ↑
                    Gatekeeper                  aiplug registry
                        ↕                       (100+ providers)
                    Human OK
                        ↕
                  Tool Registry ──→ ToolSandbox ──→ FS / Shell / Plugins
```

## Core concepts

### Blocks
Isolated AI workspaces. Each block has its own:
- **Config** — adapter, channel, memory, goals, permissions
- **Pulse** — current state (SLEEPING, ACTIVE, BUSY, ERROR)
- **Memory** — persistent context that survives sessions
- **Costs** — per-block input / output token tracking, persisted to `costs.json`

A block is just a folder under `~/.memoryblock/ws/blocks/<name>/`. Move the folder, move the monitor.

### Monitors
The resident intelligence of each block. A monitor:
1. Receives messages from one or more channels (CLI, Telegram, web dashboard).
2. Builds a conversation loop with the LLM via an `LLMAdapter`.
3. Uses the `list_tools_available` discovery pattern for token optimisation.
4. Dispatches tool calls through the registry (validated by the Sandbox).
5. Routes dangerous actions through the Gatekeeper for human approval.
6. Manages memory with the 80% threshold rule.

### The LLMAdapter
The canonical adapter shape. memoryblock no longer ships per-provider adapter code. Instead, `@memoryblock/adapters` calls `createLLMAdapter()` from the bundled `aiplug` runtime, and every provider in the world comes from aiplug's registry.

```ts
import { createLLMAdapter } from 'aiplug';

export function createMemoryAdapter(config: MemoryAdapterConfig): LLMAdapter {
  return createLLMAdapter({
    provider: config.provider,         // 'openai', 'anthropic', 'bedrock', 'ollama', 'minimax', 'deepseek', …
    model: config.model,
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    options: { providerOptions: config.providerOptions },
  });
}
```

See the [Aiplug embedding guide](/aiplug/embedding) for the full pattern and the [provider registry](/aiplug/registry) for the catalogue.

### Tools
Actions the AI can take. All tool execution flows through the **ToolSandbox** for permission enforcement before any operation runs.

**Built-in tools** (in `@memoryblock/tools`):

| Category | Tools |
| --- | --- |
| File System | `read_file`, `write_file`, `list_directory`, `create_directory`, `search_files`, `replace_in_file`, `file_info`, `find_files` |
| File System (extras) | `delete_file`, `move_file`, `copy_file`, `append_to_file` |
| Shell | `execute_command` (auto-approved for safe prefixes; human approval otherwise) |
| Dev | `run_lint`, `run_build`, `run_test` |
| Identity | `update_monitor_identity`, `update_founder_info`, `send_channel_message` |
| Config | `auth_read`, `auth_write`, `list_auth_providers`, `update_block_config` |
| System | `system_info`, `get_current_time`, `list_blocks`, `get_token_usage` |
| Scheduling | `schedule_pulse_instruction`, `list_pulse_instructions`, `remove_pulse_instruction` |

**Plugin tools:** `web_search` (Brave), `fetch_webpage`, `create_agent`, `query_agent`, `message_agent`, `list_agents`, `terminate_agent` (agent orchestration).

### Channels
Communication pathways between the user and the monitor:
- **CLI** — interactive terminal with streaming output, raw-mode approval prompts, and a live cost badge.
- **Telegram** — bot-based with inline keyboard approvals.
- **Web** — integrated browser dashboard chat UI. The web channel uses a file-backed queue (`chat.json` + `.stream`) that allows seamless asynchronous two-way communication with background block daemons without complex websockets or IPC.

All channels are equal citizens. The **MultiChannelManager** binds multiple channels simultaneously and routes messages to and from the correct channel seamlessly. The CLI attacher can tail a running daemon's `.stream` file, so you can `mblk start my-block -d` and then `mblk start my-block` in a separate terminal to attach interactively.

### Memory management (80% rule)
When accumulated tokens hit 80% of the context window:
1. The LLM summarises current learnings.
2. Summary is written to `memory.md`.
3. The session is "reborn" with fresh context + the memory.
4. Token counter resets.

### Gatekeeper
Sovereign human approval system. When a tool has `requiresApproval: true`:
- Execution pauses.
- User sees the action description on their active channel.
- Must explicitly approve (press `A` / `Enter` in CLI, click Approve in web, tap the inline button in Telegram) or deny.
- Denial returns an error result to the LLM.

### ToolSandbox
Central enforcement layer that validates every tool call before execution:
- **Path scanning** — blocks access outside permitted scope.
- **Sensitive file protection** — `.env`, `auth.json`, SSH keys are never accessible.
- **Shell command validation** — detects escape patterns in block-scoped commands.
- **Scope-based enforcement** — `block`, `workspace`, or `system` permission levels.

## Package structure

The monorepo splits responsibilities into 12 packages, each with a tight dependency boundary:

| Package | Role |
| --- | --- |
| `memoryblock` | CLI entry, command implementations, setup wizards |
| `@memoryblock/core` | Engine: `Monitor`, `MemoryManager`, `Gatekeeper`, `PulseEngine`, `ConversationLogger`, `CostTracker` |
| `@memoryblock/tools` | ToolRegistry, ToolSandbox, built-in FS/Shell/Dev/Identity/Channel/Config/System tools |
| `@memoryblock/adapters` | LLMAdapter façade — proxies every provider through aiplug |
| `@memoryblock/channels` | CLI, Telegram, Shared channels + MultiChannelManager |
| `@memoryblock/api` | HTTP REST API + WebSocket server (binds 127.0.0.1 by default) |
| `@memoryblock/web` | Local web dashboard (static HTML/CSS/JS) |
| `@memoryblock/daemon` | Background process management |
| `@memoryblock/locale` | i18n (currently `en.ts`) |
| `@memoryblock/types` | Shared TypeScript interfaces (`BlockConfig`, `LLMMessage`, `ToolDefinition`, `Channel`, …) |
| `packages/plugins/{agents,aws,fetch-webpage,installer,web-search}` | Optional skill packages |

## Engine — `Monitor.runConversationLoop`

The per-turn brain, simplified:

```ts
while (this.running) {
  const tools = this.getToolDefinitions();              // discovery-tool pattern
  this.channel.prepareStream?.(displayName, blockName);
  const response = await this.adapter.converseStream(  // ← aiplug underneath
    this.messages, tools,
    (chunk) => this.channel.streamChunk?.(chunk),
  );

  this.memory.trackUsage(response.usage);
  this.costTracker.track(response.usage);
  this.messages.push(response.message);

  if (response.stopReason === 'tool_use') {
    await this.dispatchToolCalls(response.message.toolCalls);
    continue;                                          // loop back
  }

  await this.sendToChannel(
    response.message.content, sourceChannel,
    this.costTracker.getPerTurnReport(),
    this.costTracker.getSessionReport(),
    this.costTracker.getTotalReport(),
  );
  break;
}
```

`getToolDefinitions()` returns the discovery tool on first contact, the full tool catalogue for one cycle after the LLM calls `list_tools_available`, then the discovery tool alone with a "N tools available" reminder. Saves roughly 2,500 tokens per turn after the first cycle.

## See also

- [CLI commands](commands.md) — every `mblk` command.
- [Configuration](configuration.md) — the workspace and block schema.
- [Cost efficiency](cost-efficiency.md) — how token tracking works and how to keep it low.
- [Aiplug embedding guide](/aiplug/embedding) — the transport layer memoryblock is built on.
