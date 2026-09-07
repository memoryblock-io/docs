---
title: memoryblock — local AI workspaces
description: Isolated, persistent AI workspaces that run on your machine. Open source. No cloud. Single binary.
noStyle: true
titleAppend: false
bodyClass: landing
components:
  meta: true
  favicon: true
  css: false
  theme: false
  highlight: false
  scripts: false
customHead: |
  <link rel="icon" type="image/svg+xml" href="assets/landing/images/logo.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/landing/images/favicons/apple-touch-icon.png">
  <meta name="theme-color" content="#0a0a0b">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/landing/css/style.css">
customScripts: |
  <script src="assets/landing/js/script.js"></script>
---

<!-- Ambient aurora glow (the logo palette) -->
<div class="ambient" aria-hidden="true">
  <div class="glow glow-1"></div>
  <div class="glow glow-2"></div>
</div>

<!-- Subtle grid for the data/AI feel -->
<div class="grid-overlay" aria-hidden="true"></div>

<header class="site-header">
  <a class="brand" href="https://memoryblock.io">
    <img src="assets/landing/images/logo.svg" alt="memoryblock logo" class="brand-mark">
    <span class="brand-name">memoryblock</span>
  </a>
  <nav class="site-nav">
    <a href="/getting-started">Docs</a>
    <a href="https://www.npmjs.com/package/memoryblock" target="_blank" rel="noopener">npm</a>
    <a href="https://github.com/memoryblock-io/memoryblock" target="_blank" rel="noopener" aria-label="GitHub" class="icon-link">
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </nav>
</header>

<main class="site-main">
  <section class="hero">
    <div class="hero-badge">
      <span class="badge-dot" aria-hidden="true"></span>
      <span>v0.1.10 &middot; open source &middot; local-first</span>
    </div>
    <h1 class="hero-title">
      Isolated AI workspaces<br>
      that <span class="grad">run on your machine</span>.
    </h1>
    <p class="hero-sub">
      Spin up a <code>block</code>, give it memory, and let it think — no cloud, no Docker, no Python.
    </p>
    <div class="cta-row">
      <div class="install-row">
        <span class="prompt" aria-hidden="true">$</span>
        <code id="install-cmd">npm install -g memoryblock</code>
        <button class="copy-btn" data-target="install-cmd" aria-label="Copy install command">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
      <a class="docs-cta" href="/getting-started">
        Documentation <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </section>

  <section class="props" aria-label="What memoryblock does">
    <ul class="prop-list">
      <li>
        <strong>Blocks</strong>
        <span>Isolated workspaces with their own memory, identity, and tools.</span>
      </li>
      <li>
        <strong>Local models</strong>
        <span>Ollama, Bedrock, OpenAI, Anthropic, Google Gemini out of the box.</span>
      </li>
      <li>
        <strong>Multi-agent</strong>
        <span>Your block can spawn short-lived sub-agents in parallel.</span>
      </li>
      <li>
        <strong>Channels</strong>
        <span>Chat from the CLI, the local web dashboard, or Telegram.</span>
      </li>
      <li>
        <strong>Stable API</strong>
        <span>A single <code>/v1/chat</code> endpoint for external apps and tools.</span>
      </li>
      <li>
        <strong>No lock-in</strong>
        <span>Your data is plain Markdown + JSON in <code>~/.memoryblock</code>.</span>
      </li>
    </ul>
  </section>
</main>

<footer class="site-footer">
  <span>&copy; 2026 memoryblock.io</span>
  <span class="dot" aria-hidden="true">&middot;</span>
  <a href="/docs" target="_blank" rel="noopener">Documentation</a>
  <span class="dot" aria-hidden="true">&middot;</span>
  <a href="https://www.npmjs.com/package/memoryblock" target="_blank" rel="noopener">npm</a>
  <span class="dot" aria-hidden="true">&middot;</span>
  <a href="https://github.com/memoryblock-io/memoryblock" target="_blank" rel="noopener">GitHub</a>
</footer>
