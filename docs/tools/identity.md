---
title: Identity & Profile
description: Native monitor identity and founder profile tools.
---

Monitors in memoryblock are independent agents. They can evolve their own identity and maintain a global context about the "Founder" (you).

## Personal Identity

### update_monitor_identity
Allows a monitor to change its own name and emoji.
- **Parameters**: `name` (string), `emoji` (string)
- **Approval**: **Yes** (Human required)
- **Note**: Persists to the block's `config.json` and its `monitor.md` profile.

*Example*:
```json
{
  "name": "Kira",
  "emoji": "🦊"
}
```

## Global Founder Profile

### update_founder_info
Update the global `founder.md` profile shared across all blocks in the current workspace. Use this when you share personal facts (name, work, interests) with any monitor.
- **Parameters**: `info` (string), `mode` ("append" | "rewrite")
- **Approval**: No
- **Note**: The monitor can choose to append facts intelligently with timestamps or rewrite the entire profile.

## Why this exists?
- **Identity**: Since you can run many blocks simultaneously, unique names and emojis help you distinguish which agent is talking to you on the Web Dashboard or Telegram.
- **Founder Profile**: This centralizes context. When you tell a "Research" block that you work in TypeScript, an "Automation" block in the same workspace can eventually know this too, reducing redundant explanations.
- **MD Persistence**: Both tools read/write standard Markdown files, making it easy for you to edit them manually if needed.
