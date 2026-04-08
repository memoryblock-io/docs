---
title: Testing Guide
description: How to test memoryblock TUI and web UI during development.
---

# Testing Guide

Step-by-step testing procedures for TUI and web UI. All commands run from the monorepo root via `pnpm mblk:*` proxies, targeting `_playground/memoryblock-ws/`.

---

## Prerequisites

```bash
pnpm dev:build      # compile all packages
```

---

## Full Reset (Clean Slate)

```bash
pnpm mblk:shutdown              # stop blocks + server
pnpm dev:reset --hard            # wipe workspace data (prompts for confirmation)
pnpm dev:clean                   # remove node_modules + dist
pnpm install                     # reinstall dependencies
pnpm dev:build                   # rebuild everything
```

After this, `_playground/memoryblock-ws/` is empty and ready for `mblk init`.

---

## TUI Testing

### 1. Onboarding (`mblk init`)

```bash
pnpm mblk -- init
```

Walk through the wizard:
- Pick at least one **provider** (e.g., AWS Bedrock, Anthropic)
- Pick at least one **channel** (CLI is default)
- Select **plugins** (agents is pre-selected and can't be deselected)
- Enter **API keys** for selected providers/channels
- Create your **first block** (enter name, description)
- See the **finish summary**

Verify: `ls _playground/memoryblock-ws/` → should have `config.json`, `auth.json`, `blocks/<name>/`.

### 2. Block Lifecycle

```bash
pnpm mblk:status                 # lists blocks and states
pnpm mblk:create test            # create a second block
pnpm mblk:start home             # start monitor (interactive session)
# → type messages, test tool use, try /status
# ctrl+c to exit
pnpm mblk:stop                   # stop all blocks
pnpm mblk:status                 # all blocks should be SLEEPING
```

### 3. Plugins

```bash
pnpm mblk:add                    # list available plugins (table)
pnpm mblk -- add web-search      # install web-search plugin
pnpm mblk -- settings            # list all plugins with settings
pnpm mblk -- settings agents     # edit agents settings interactively
pnpm mblk -- settings web-search # edit web-search settings
pnpm mblk -- remove web-search   # remove plugin
pnpm mblk -- remove agents       # should FAIL (core plugin)
```

### 4. Permissions

```bash
pnpm mblk -- permissions home                    # view current
pnpm mblk -- permissions home -s workspace       # widen scope
pnpm mblk -- permissions home --allow-shell       # enable shell
pnpm mblk -- permissions home --deny-shell        # revoke shell
pnpm mblk -- permissions home -s block            # reset to default
```

### 5. Reset

```bash
pnpm mblk:reset home             # soft: wipes memory, pulse, costs, session
pnpm mblk:reset home -- --hard   # hard: also wipes logs, monitor identity
```

### 6. Server Lifecycle

```bash
pnpm mblk -- server start -d     # start as daemon
pnpm mblk -- server status       # confirm running (PID, port)
pnpm mblk:shutdown               # stop blocks + server
pnpm mblk:restart                # restart everything (shutdown → start daemon)
pnpm mblk -- server status       # confirm running again
pnpm mblk:shutdown               # final cleanup
```

---

## Web UI Testing

### 1. Start Server

```bash
pnpm mblk -- server start        # foreground — shows URL + token
```

Open `http://localhost:8420` in a browser.

### 2. Authentication

- Enter the **auth token** from terminal output into the login field
- Should land on dashboard (or setup wizard if first time)

### 3. Setup Wizard (First Time)

If no blocks exist, the setup wizard appears automatically:

1. **Welcome** — start button
2. **Providers** — select at least one
3. **Channels** — select at least one
4. **Plugins** — toggle switches, agents shows as pre-installed (can't disable)
5. **Credentials** — enter API keys for selected items
6. **Block** — name and description for first block
7. **Finish** — summary of selections

"Skip to Dashboard" should work on every step.

### 4. Dashboard

- **Blocks list** — verify your blocks appear
- **Status indicators** — sleeping/running labels
- Click into a block for detail view

### 5. Settings Tab

- **Theme toggle** — light/dark switch
- **Plugin settings** — expand each plugin, edit values, save
- **Core badge** — agents should show "CORE" badge
- **Disconnect** button works

### 6. Create Block

- Navigate to `#/create`
- Fill in name/description
- Verify block appears in list

### 7. Archive & Restore

- Delete a block from CLI: `pnpm mblk -- delete test`
- Check archive tab in web UI
- Restore: `pnpm mblk -- restore _archive/test_*`

---

## Workspace Detection

The `mblk` binary resolves workspace config using this priority:

| Priority | Path | When |
|----------|------|------|
| 1 | `cwd/_playground/memoryblock-ws/config.json` | Dev testing via `pnpm mblk:*` |
| 2 | `cwd/memoryblock-ws/config.json` | Standalone workspace |
| 3 | `~/.memoryblock/config.json` | End-user global install |

No auto-detection magic — it checks these three locations in order and uses the first one it finds. All `pnpm mblk:*` scripts run from the monorepo root, so they always find `_playground/memoryblock-ws/` first.
