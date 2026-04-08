---
title: Shell & Commands
description: Running shell commands safely with sandbox-enforced security.
---

Monitors interact with your system via `execute_command`. This tool is the bridge between the AI's logic and your terminal environment.

## execute_command
Executes a terminal command within the block's current working directory.

- **Parameters**: `command` (string), `timeout` (number, default: 120s)
- **Approval**: Dynamic (Safe commands auto-execute; others require human approval)
- **Timeout**: 120 seconds default; configurable per-block in `config.json`

## Safety first
The memoryblock shell is sandboxed by default. Commands are categorized as **Safe** or **Potentially Dangerous**.

### 🟢 Safe Commands (Zero Approval)
The system knows these commands are read-only or harmless. They always execute instantly:
- **Listing**: `ls`, `find`, `which`, `pwd`, `echo`
- **Reading**: `cat`, `head`, `tail`, `wc`, `grep`
- **Environment**: `node --version`, `bun --version`, `pnpm --version`
- **Git (Read)**: `git status`, `git log`, `git diff`, `git branch`
- **Dev-Run**: `tsc --noEmit`, `npx eslint`, `pnpm lint`, `pnpm build`, `pnpm test`

### 🟡 Approval Required
Any command not on the `SAFE_PREFIXES` list will trigger an **approval request**. The monitor will pause, and you must explicitly allow or deny the action on your active channel.

Examples of commands requiring approval:
- `rm -rf`
- `git push`
- `npm install`
- `curl` / `wget`

## Permission Scopes
The scope (`block`, `workspace`, or `system`) restricts where a command can explore your files. By default, the `block` scope is isolated to its own directory. 

To elevate a block's permissions, use the CLI:
```bash
mblk permissions my-block --allow-shell --scope workspace
```

## Tips for Token Efficiency
Avoid running commands that produce massive output. The system caps shell output at 50,000 characters. For large outputs, use `grep` or `tail` to filter the data before it reaches the monitor.
