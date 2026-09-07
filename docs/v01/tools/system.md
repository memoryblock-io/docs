---
title: System & Metrics
description: Native system monitoring, timing, and token metrics for memoryblock.
---

Memoryblock monitors can observe their host's hardware state and their own token consumption via these system tools.

## System Monitoring

### system_info
Retrieves OS, CPU, Memory, Uptime, Node.js version, and IP addresses. Useful for troubleshooting or monitoring background daemons.
- **Parameters**: N/A
- **Approval**: No
- **Note**: Reports memory usage in GB and CPU models.

### get_current_time
Gets the current date, time, and timezone.
- **Parameters**: N/A
- **Approval**: No
- **Note**: Returns UTC, Local, and Unix formats.

## Token Consumption

### get_token_usage
Returns token usage stats for the current block's session and its all-time totals.
- **Parameters**: N/A
- **Approval**: No
- **Note**: Reads from `costs.json` in the block's directory.

## Block Management

### list_blocks
Lists all blocks in the current memoryblock workspace with their [Pulse status](../pulse).
- **Parameters**: N/A
- **Approval**: No
- **Required Scope**: **system** (Superblock)
- **Note**: Shows if a block is active (🟢) or sleeping (💤) and its permission scope.

### update_block_config
Updates the block's `config.json` properties directly on disk.
- **Parameters**: `key` (JSON path, e.g. "memory.maxContextTokens"), `value` (JSON stringified value)
- **Approval**: **Yes** (Human required)
- **Required Scope**: **system** (Superblock)
- **Note**: This is the most direct way to change a block's behavior from a chat interface.

## Use Case
- **Diagnostics**: A monitor can use `system_info` to check if a local build is failing due to low memory.
- **Budgeting**: You can ask "How much have we spent on this block?" to trigger `get_token_usage`.
- **Self-Optimization**: Using `update_block_config`, a monitor can adjust its own `maxTokens` or `cacheControl` settings.
