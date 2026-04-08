---
title: Tools Reference
description: Complete reference for all built-in tools available to memoryblock monitors.
---

Monitors interact with their environment through **Tools**. Tools are discovered via the `list_tools_available` meta-tool on first contact — no tool schemas are sent to the LLM until the monitor explicitly requests them.

## Discovery Tool

### list_tools_available
Meta-tool that lists all tools available to the monitor. Called automatically on first contact. It shows your current [Permission Scope](../commands) and which tools are available or restricted.
- **Parameters**: N/A
- **Approval**: No
- **Note**: This is the only tool exposed to the monitor initially to optimize tokens.

## Tool Categories

Explore our categorized tool documentation for detailed parameters, examples, and security behaviors:

- **[File System](tools/fs)** — Read, write, search, and manage files.
- **[Shell & Commands](tools/shell)** — Run terminal commands safely.
- **[Pulse & Automation](tools/pulse)** — Autonomous background tasks.
- **[Development](tools/dev)** — Build, lint, and test your projects.
- **[Identity & Profile](tools/identity)** — Monitor names, emojis, and founder profiles.
- **[System & Metrics](tools/system)** — Monitor hardware and token usage.
- **[Credentials & Security](tools/auth)** — Manage API keys and auth providers.
- **[Plugin Tools](../plugins/installer)** — Web search, page fetching, and agents.

## Security: ToolSandbox
All tool execution passes through the **ToolSandbox** before any operation runs:

1. **Scope enforcement** — file access is strictly restricted to the block's current scope (`block`, `workspace`, or `system`).
2. **Sensitive file protection** — `.env`, `auth.json`, SSH keys, and AWS credentials are **never** accessible regardless of scope.
3. **Shell command validation** — detects path traversal and escape patterns in block-scoped commands.
4. **Path scanning** — every parameter is scanned for file paths and validated against the allowed scope.

Permissions are controlled exclusively via the CLI (`mblk permissions`) — they cannot be changed via chat or the web dashboard, preventing the AI from escalating its own access.