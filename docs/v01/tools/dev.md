---
title: Development Tools
description: Direct project testing, building, and linting for memoryblock monitors.
---

Memoryblock monitors are built to aid standard development workflows. These "Dev Tools" automatically detect the project's root by looking for its `package.json`.

## Coding Tools

### run_lint
Executes ESLint on the project.
- **Parameters**: `path` (string, optional)
- **Approval**: No
- **Note**: Auto-detects project root; runs `npx eslint` in the background.

### run_build
Triggers the project's build command.
- **Parameters**: N/A
- **Approval**: No
- **Note**: Auto-detects if the project uses `pnpm` (pnpm-workspace.yaml) or `npm`. Runs `pnpm run build` or `npm run build`.

### run_test
Runs the project's test suite.
- **Parameters**: `filter` (string, optional)
- **Approval**: No
- **Note**: Supports optional test filters. Auto-detects `pnpm` or `npm`.

## Auto-Discovery
These tools use a recursive "Search-Up" strategy (up to 10 directory levels) to find the nearest `package.json` relative to the block's current working directory. This ensures the correct context for dependencies and scripts.

## Timeout Management
Complex builds or large test suites can take time. By default, dev tools have a 2-minute (`120_000ms`) timeout. If your tasks require more, they can be configured via the block's `maxTimeout` in `config.json`.

## Best Practice
For custom scripts not covered by built-in tools, monitors can use the [Shell Tool](shell). However, using built-in `run_lint`/`run_build`/`run_test` is preferred for consistency across environments.
