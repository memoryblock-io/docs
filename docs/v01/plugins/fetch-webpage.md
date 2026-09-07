---
title: Fetch Webpage Plugin
description: Extracting clean text from URLs to pass to your monitor.
---

# Fetch Webpage Plugin

The `@memoryblock/plugin-fetch-webpage` package allows the monitor to read the contents of any public URL. It extracts raw HTML, strips away scripts/styles/navigation, and returns human-readable text.

## Installation

```bash
mblk add fetch-webpage
```

## How It Works

This tool is aggressively optimized for **token efficiency**.

Instead of dumping massive raw HTML into the context window (which costs money and causes context exhaustion), the plugin processes the HTML in Node.js first:

1. **Regex Stripping:** `<script>`, `<style>`, `<nav>`, `<header>`, and `<footer>` tags are removed early.
2. **Metadata Extraction:** Extracts the page `<title>` and `<meta name="description">`.
3. **Text Formatting:** Converts paragraphs and lists into clean markdown-style spacing.
4. **Token Capping:** The final extracted text is hard-capped at 8,000 characters by default.

## Usage

When the monitor has this tool, you can simply paste URLs in the chat:

> "Can you summarize the main points in this article? https://example.com/article"

The monitor will use the `fetch_webpage` tool, read the extracted text, and answer your question.

## Dependencies
This plugin uses the native `fetch` API available in Bun and Node 18+. It has **zero external npm dependencies**.
