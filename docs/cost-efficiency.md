---
title: Cost Efficiency
description: How memoryblock minimizes token usage and API costs.
---

Memoryblock is designed from the ground up to minimize token usage and API costs — not as an afterthought, but as a core architectural principle. Every component, from the Monitor engine to the tool registry, follows strict cost-efficiency rules.

## The Problem

LLM APIs are **stateless**. Every API call must include the full conversation history — system prompt, all previous messages, tool definitions, and tool results. A casual 10-turn conversation can easily consume 100,000+ input tokens, with costs scaling linearly.

This is true across **all providers**: AWS Bedrock, Anthropic's direct API, OpenAI, Google Gemini. The protocol is the same everywhere. Memoryblock's optimizations work at the message-history level, which means they apply regardless of which provider or model you use.

## How Memoryblock Optimizes

### 1. History Trimming (Zero-Cost)

After every API response, Memoryblock automatically compacts the conversation history that gets sent to the model. This is pure system-level processing — **no extra API calls, zero additional cost.**

| Tool Result | Before Trimming | After Trimming |
|---|---|---|
| `list_tools_available` | Full listing of all tools (~500 tokens) | `"(11 tools discovered)"` (~5 tokens) |
| `read_file` (large file) | Full file content (thousands of tokens) | First 500 chars + note |
| `execute_command` | Full command output | First 1,000 chars + note |
| `write_file` | `"Written: path/to/file"` | Unchanged (already compact) |

**Your logs and displays are never affected.** The full, unmodified content is always:
- Displayed in the terminal (CLI channel)
- Written to conversation logs (`logs/` directory)
- Preserved in the web UI

Only the internal message array sent to the API is trimmed.

### 2. Lazy Tool Discovery

Most AI frameworks send **all tool definitions** with every API call. With 11+ tools, that's ~2,500 tokens of JSON schemas repeated on every single turn.

Memoryblock uses a **lazy discovery pattern**:

1. **First contact:** The model receives only one meta-tool: `list_tools_available`
2. **On demand:** When the model calls it, it receives the full tool listing in the result
3. **After first use:** Tool schemas are sent for exactly one more turn (so the model can use them), then removed from subsequent calls

This saves **~2,500 tokens per turn** after the initial discovery cycle.

### 3. Capped Memory Summarization

When conversation context hits the 80% token threshold, Memoryblock asks the model to summarize key learnings into `memory.md`. This summary is:

- Capped at **1,500 words** (explicit instruction to the model)
- Fed truncated message content (300 chars per message, not full text)
- Focused on decisions, progress, and next steps — not conversational fluff

The session then "rebirths" with a fresh context containing only the system prompt and this summary.

### 4. Session State Persistence

If a session crashes or the user stops and restarts, Memoryblock doesn't start from zero. A trimmed `session.json` file is saved after every response, containing the compact message history. This means:

- **No redundant re-introductions** — the model remembers the conversation
- **No wasted tokens** — the resumed history is already trimmed
- **Full logs preserved** — `logs/` directory has the complete record

### 5. Provider-Agnostic Cost Tracking

Every API call is tracked with per-turn granularity:

```
3,572in/161out = $0.0035
```

This works identically across all adapters (Bedrock, OpenAI, Gemini, Anthropic). The cost display format never changes when you switch providers — only the pricing table updates internally.

## Real-World Impact

In testing, these optimizations reduced the token growth between conversation turns from **4.2× to under 2×**:

| Metric | Before | After |
|---|---|---|
| Turn 1 input tokens | 3,572 | 3,572 |
| Turn 2 input tokens | 15,136 (4.2× growth) | ~6,500 (1.8× growth) |
| Per-turn overhead | ~2,500 tokens (tool schemas) | ~50 tokens (reminder) |
| Tool result retention | Full content forever | Compact summaries |

Over a 20-turn session, this translates to **60-70% fewer input tokens** compared to a naive implementation.

## Configuration

Cost tracking is automatic. No configuration needed. Per-block costs are persisted in `costs.json` within each block directory.

To see current costs:

```bash
mblk status
```
