---
title: Building Plugins
description: How to build, structure, and publish memoryblock plugins.
---

# Building Plugins

A memoryblock plugin is an npm package that extends blocks with additional tools, capabilities, or integrations. This guide covers everything from structure to publishing.

---

## Plugin Structure

```
@memoryblock/plugin-example/
├── src/
│   └── index.ts        ← Entry point, exports tools
├── package.json
└── tsconfig.json
```

### Minimal `package.json`

```json
{
  "name": "@memoryblock/plugin-example",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": {},
  "peerDependencies": {
    "@memoryblock/tools": "^0.3.0"
  }
}
```

### Minimal `index.ts`

```typescript
import type { Tool, ToolContext } from '@memoryblock/tools';

export const tools: Tool[] = [
  {
    name: 'example_tool',
    description: 'A brief description of what this tool does.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The input query.' },
      },
      required: ['query'],
    },
    execute: async (params: { query: string }, context: ToolContext) => {
      // Your tool logic here
      return { result: `Processed: ${params.query}` };
    },
  },
];
```

---

## Registry Entry

Every plugin available through `mblk add` must be registered in `packages/plugins/installer/registry/plugins.json`:

```json
{
  "id": "example",
  "name": "Example Plugin",
  "description": "What it does in one line",
  "package": "@memoryblock/plugin-example",
  "version": "0.1.0",
  "toolNames": ["example_tool"],
  "requiresAuth": [],
  "category": "utility"
}
```

### Registry Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique plugin identifier, used with `mblk add <id>` |
| `name` | string | ✓ | Human-readable name |
| `description` | string | ✓ | One-line description |
| `package` | string | ✓ | npm package name |
| `version` | string | ✓ | Semver version |
| `toolNames` | string[] | ✓ | Tool names exported by the plugin |
| `requiresAuth` | string[] | ✓ | Auth keys needed (e.g., `["brave"]`, `["aws"]`) |
| `category` | string | ✓ | Category: `search`, `web`, `cloud`, `security`, `core`, `utility` |
| `status` | string | | Set to `"upcoming"` if not yet available |
| `core` | boolean | | `true` = can't be uninstalled by users |
| `blockSpecific` | boolean | | `true` = plugin can have per-block settings |
| `settings` | object | | Settings schema (see below) |

---

## Plugin Settings

Plugins can declare configurable settings in their registry entry. These settings are:
- **Stored** at workspace level: `<workspace>/plugin-settings/<pluginId>.json`
- **Editable** via `mblk settings <plugin-id>` (CLI) or the web dashboard settings panel
- **Auto-rendered** — no UI code needed from the plugin developer

### Settings Schema

```json
{
  "settings": {
    "maxResults": {
      "type": "number",
      "label": "Max results per search",
      "default": 5,
      "min": 1,
      "max": 20
    },
    "provider": {
      "type": "select",
      "label": "Search Provider",
      "default": "brave",
      "options": ["brave", "google"]
    },
    "enabled": {
      "type": "toggle",
      "label": "Enable this feature",
      "default": true
    }
  }
}
```

### Field Types

| Type | Rendered As | Extra Properties |
|------|------------|------------------|
| `text` | Text input | `placeholder` |
| `password` | Masked input | `placeholder` |
| `number` | Number input | `min`, `max` |
| `select` | Dropdown | `options` (string array) |
| `toggle` | On/off switch | — |

All field types support `label` (required), `default` (optional).

---

## Core Plugins

Plugins marked with `"core": true` in the registry:
- Are always installed and can't be uninstalled
- Appear in the onboarding wizard as "installed" with a disabled toggle
- Should still declare a settings schema if configurable
- Example: `agents` (multi-agent orchestration)

---

## Block-Specific Plugins

Plugins with `"blockSpecific": true`:
- Can have per-block settings overrides in the block's settings panel
- Users can enable/disable these plugins per block
- Example: `agents` (different max sub-agents per block)

If not `blockSpecific`, the plugin uses workspace-level settings only.

---

## The Tool Interface

Each tool must conform to the `Tool` interface from `@memoryblock/tools`:

```typescript
interface Tool {
  name: string;                          // Unique tool name (snake_case)
  description: string;                   // shown to the LLM
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (params: any, context: ToolContext) => Promise<unknown>;
}
```

### ToolContext

Your `execute` function receives a `ToolContext` with:

| Property | Type | Description |
|----------|------|-------------|
| `blockPath` | string | Absolute path to the block directory |
| `workingDir` | string | Current working directory |
| `sandbox` | boolean | Whether sandboxing is active |
| `permissions` | object | `{ scope, allowShell, allowNetwork, maxTimeout }` |
| `workspacePath` | string | Root workspace path |

---

## Limitations

1. **No direct file system access** outside the block's scope (enforced by `ToolSandbox`)
2. **No shell access** unless `permissions.allowShell` is `true`
3. **Sensitive files are blocked** — `.env`, `auth.json`, SSH keys, etc.
4. **Timeouts** — tool execution is capped by `permissions.maxTimeout`
5. **No DOM access** — plugins run server-side only
6. **One namespace** — tool names must be globally unique across all plugins

---

## Example: Minimal Plugin from Scratch

```typescript
// src/index.ts
import type { Tool, ToolContext } from '@memoryblock/tools';

export const tools: Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for a city.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' },
      },
      required: ['city'],
    },
    execute: async (params: { city: string }, _context: ToolContext) => {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(params.city)}?format=j1`);
      const data = await res.json();
      return { weather: data };
    },
  },
];
```

Registry entry:
```json
{
  "id": "weather",
  "name": "Weather",
  "description": "Get current weather information",
  "package": "@memoryblock/plugin-weather",
  "version": "0.1.0",
  "toolNames": ["get_weather"],
  "requiresAuth": [],
  "category": "utility",
  "settings": {
    "units": { "type": "select", "label": "Temperature Units", "default": "celsius", "options": ["celsius", "fahrenheit"] }
  }
}
```

Install: `mblk add weather`  
Settings: `mblk settings weather`  
Remove: `mblk remove weather`

---

## Publishing

1. Build your plugin: `npm run build`
2. Submit a PR adding your registry entry to `packages/plugins/installer/registry/plugins.json`
3. Publish to npm: `npm publish --access public`
4. Users install via: `mblk add <your-plugin-id>`
