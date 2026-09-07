---
title: Plugin Installer
description: The built-in package manager for memoryblock plugins.
---

# Plugin Installer

The `@memoryblock/plugin-installer` is a core utility included by default in the `mblk` CLI. It facilitates discovering, installing, and registering new capabilities for your blocks via npm.

## Usage

```bash
# General syntax
mblk add <plugin-name>
```

When you run `mblk add`, the installer:
1. Validates the plugin name.
2. Formats it to the official `@memoryblock/plugin-*` namespace if it's an official package.
3. Installs the dependency via `pnpm add` into the workspace.
4. Updates the block's `config.json` enabling the newly installed tool so it is instantaneously usable.

## Examples

To give your monitor web search capabilities:

```bash
mblk add web-search
```

To give your monitor the ability to read public URL contents:

```bash
mblk add fetch-webpage
```

To give your monitor multi-agent orchestration tools:

```bash
mblk add agents
```

## Creating Custom Plugins

Memoryblock plugins are standard Node/Bun modules that export a `tools` array of `Tool` definitions. If you write your own plugin and install it via `pnpm add`, you can simply add its package name to your `config.json`'s `tools.enabled` array to side-load it into your block's registry!
