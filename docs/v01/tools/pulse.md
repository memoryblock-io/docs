---
title: Autonomic Pulse System
description: Background automation and recurring tasks that run without LLM tokens.
---

The **Pulse System** is a brain-inspired, autonomic engine that allows memoryblock monitors to perform recurring tasks independently of the main conversation loop. Unlike standard tools, Pulses can run in the background (as daemons) and only alert the monitor when necessary, significantly reducing token consumption.

## Core Concepts

### What is a Pulse?
A Pulse is a stored instruction that the `PulseEngine` executes at a defined interval or schedule. It allows a block to:
- **Monitor its environment** (e.g., watch a file, check an API).
* **Execute background scripts** (e.g., run a build every hour).
- **Self-alert** (wake the monitor only if a specific condition is met).
- **Log data** (periodic snapshots of system state).

### Silent vs. Alerting Pulses
- **Silent Pulses** (`alertMonitor: false`): Run completely in the background. The monitor is never woken up, and no tokens are used. Results are saved to `pulse.json`.
- **Alerting Pulses** (`alertMonitor: true`): When the task completes, the results are injected into the monitor's next turn. This "wakes" the monitor to handle the event.

## Pulse Types

| Type | Instruction | Purpose |
| :--- | :--- | :--- |
| `script` | Shell command | Continuous integration, background cleanup, data fetching. |
| `alert` | Message + Condition | Watchdog tasks (e.g., "Alert me if memory > 90%"). |
| `cron` | Prompt/Instruction | Scheduled reasoning tasks (e.g., "Every Friday at 5pm, summarize the week's logs"). |
| `log` | File path/Message | Periodically record system metrics or state to a file. |
| `webhook` | URL | Outbound pings or status updates to external services. |

## Pulse Management Tools

Monitors manage their autonomic tasks using these core tools.

### set_pulse
The primary tool for creating or updating a Pulse instruction.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required.** Unique identifier for this pulse. |
| `type` | `string` | **Required.** One of: `script`, `alert`, `cron`, `log`, `webhook`. |
| `instruction` | `string` | **Required.** The core task (e.g., shell command, log message, or URL). |
| `interval` | `number` | Seconds between executions. Required for all types except `cron`. |
| `cron_expression` | `string` | Standard cron string (e.g., `0 * * * *`). Required for `cron` type. |
| `alert_monitor` | `boolean` | If `true`, the monitor is woken with the result (uses tokens). |
| `condition` | `string` | Optional condition for `alert` type (e.g., `cpu > 90`). |
| `expires_in` | `number` | Optional auto-expiry in seconds. |

**Example (Silent Background Script):**
```json
{
  "id": "hourly-cleanup",
  "type": "script",
  "instruction": "rm -rf ./tmp/*",
  "interval": 3600,
  "alert_monitor": false
}
```

### list_pulses
Lists all active pulse instructions for the current block.
- **Parameters**: None
- **Approval**: No

### remove_pulse
Deletes a specific pulse instruction by its ID.
- **Parameters**: `id` (string)
- **Approval**: No

## Legacy Cron System

For backward compatibility, memoryblock still supports the standard cron tools. These are now high-level wrappers that internally use the Pulse system with `type: "cron"` and `alertMonitor: true`.

| Legacy Tool | Pulse Equivalent |
| :--- | :--- |
| `schedule_cron_job` | `set_pulse` (type: cron, alert_monitor: true) |
| `list_cron_jobs` | `list_pulses` (filtered for cron type) |
| `remove_cron_job` | `remove_pulse` |

## Pulse State Persistence

All pulses and their latest execution data are stored in `pulse.json` within the block directory. This file follows the `PulseStateSchema`:

```json
{
  "instructions": [
    {
      "id": "my-task",
      "type": "script",
      "instruction": "...",
      "interval": 60,
      "alertMonitor": false,
      "lastExecuted": "2026-04-08T06:00:00Z",
      "createdAt": "2026-04-08T00:00:00Z"
    }
  ]
}
```

## Why use Pulses?
Traditional AI agents are reactive — they only act when you speak to them. **Autonomic Pulses** make memoryblock proactive. A monitor can set a pulse to "watch its own back," ensuring that critical conditions are met even when you aren't actively chatting.