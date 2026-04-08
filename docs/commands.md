---
title: Commands
description: How to use Memoryblock from the terminal.
---

# Commands

Everything you can do with Memoryblock from the terminal.

## Getting Started

| Command | Description |
| :--- | :--- |
| `mblk init` | Interactive setup — walks you through providers, channels, plugins, and creating your first block. |
| `mblk init -y` | Non-interactive setup with defaults. |

## Blocks

Blocks are isolated AI workspaces. Each block has its own memory, tools, costs, and configuration.

| Command | Description |
| :--- | :--- |
| `mblk create <name>` | Create a new block. Names: lowercase, numbers, hyphens, max 32 chars. |
| `mblk start <block>` | Start a block's monitor (interactive terminal session). |
| `mblk start <block> -d` | Start in the background (daemon mode). |
| `mblk start <block> --channel telegram` | Start on a specific channel. |
| `mblk stop [block]` | Stop a block (or all blocks). |
| `mblk status` | Show all blocks and their running/sleeping status. |
| `mblk reset <block>` | Reset memory, costs, and session data. Keeps logs and monitor identity. |
| `mblk reset <block> --hard` | Full wipe: also clears logs, monitor identity, and config. |
| `mblk delete <block>` | Archive a block (safe, recoverable). |
| `mblk delete <block> --hard` | Permanently delete. No recovery. |
| `mblk restore <archive>` | Restore a previously archived block. |

## Server & Lifecycle

The server provides the web dashboard and REST API.

| Command | Description |
| :--- | :--- |
| `mblk server start` | Start the web UI + API server (foreground). |
| `mblk server start -d` | Start as a background process. |
| `mblk server start -p 3000` | Start on a custom port (default: 8420). |
| `mblk server stop` | Stop the running server. |
| `mblk server status` | Show if the server is running, its PID and port. |
| `mblk server token` | View the current API token. |
| `mblk server token --new-token` | Generate a new API token instantly (no restart required). |
| `mblk shutdown` | Stop all blocks AND the server in one shot. |
| `mblk restart` | Restart everything (shutdown, then start server as daemon). |
| `mblk update` | Update memoryblock to the latest source and restart services. |
| `mblk web` | Alias for `mblk server start`. |

## Plugins

| Command | Description |
| :--- | :--- |
| `mblk add` | List all available plugins. |
| `mblk add <plugin>` | Install a plugin. |
| `mblk remove <plugin>` | Remove an installed plugin. Core plugins cannot be removed. |
| `mblk settings [plugin]` | View or edit plugin settings (interactive). |

## Security & Permissions

Permissions control what a block can access. They are **CLI-only** — they cannot be changed via chat or the web dashboard. This prevents an AI from escalating its own access.

| Command | Description |
| :--- | :--- |
| `mblk permissions <block>` | View or update block permissions (CLI-only). |
| `mblk permissions <block> -s scope` | Set scope: `block` (default), `workspace`, or `system`. |
| `mblk permissions <block> --allow-shell` | Allow shell command execution. |
| `mblk permissions <block> --deny-shell` | Revoke shell access. |
| `mblk permissions <block> --max-timeout 60`| Set max command timeout (seconds). |
| `mblk superblock <block>` | Grant a block full system access (unrestricted). |
| `mblk superblock <block> --off` | Revoke superblock privileges and restore sandbox. |

### Permission Scopes

| Scope | File Access | Shell Access | Default |
| :--- | :--- | :--- | :--- |
| `block` | Own block directory only | Denied unless `--allow-shell` | ✓ |
| `workspace` | Entire workspace | Denied unless `--allow-shell` | |
| `system` | Unrestricted | Allowed | |

## System Utilities

| Command | Description |
| :--- | :--- |
| `mblk config [target]` | Open config file in your editor (global, auth, or <block-name>). |
| `mblk config --path` | Print the file path instead of opening the editor. |
| `mblk service install` | Register memoryblock to start on OS boot/login. |
| `mblk service uninstall` | Remove memoryblock from system auto-start. |
| `mblk service status` | Check if the auto-start service is installed. |

## In-Chat Slash Commands

When chatting with a block through any channel, messages starting with `/` are handled by the system — not the AI.

| Command | What it does |
| :--- | :--- |
| `/status` | Show all blocks and their state. Zero tokens. |
| `/create-block <name>` | Create a new block from within a conversation. |
| `/switch <name>` | Switch context to another block. |

**Standalone** (`/status`) — system handles it, responds directly, no tokens used.

**With trailing text** (`/create-block notes Set it up for journaling`) — system runs the command, then forwards your message to the AI.

Slash commands cannot delete, archive, or reset blocks. Destructive operations are restricted to the terminal and web dashboard.
