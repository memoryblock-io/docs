// docs/docmd.config.js

module.exports = defineConfig({
  // --- Core Metadata ---
  siteTitle: 'memoryblock',
  siteUrl: 'https://docs.memoryblock.io',

  // --- Branding ---
  logo: {
    light: 'assets/images/memoryblock-logo.png',
    dark: 'assets/images/memoryblock-logo.png',
    alt: 'memoryblock Logo',
    href: 'https://memoryblock.io',
  },
  favicon: 'assets/favicon.ico',

  // --- Structure ---
  srcDir: 'docs',
  outputDir: 'site',

  // --- Features & UX ---
  minify: true,
  autoTitleFromH1: true,
  copyCode: true,
  pageNavigation: true,

  editLink: {
    enabled: true,
    baseUrl: 'https://github.com/memoryblock-io/memoryblock/edit/main/docs/docs',
    text: 'Edit this page on GitHub'
  },

  // --- Theme ---
  theme: {
    name: 'default',
    appearance: 'dark',
    colors: {
      primary: '#AF52DE',
      secondary: '#7C3AED',
    },
    codeHighlight: true,
  },

  // --- Layout & UI Architecture ---
  layout: {
    spa: true,
    breadcrumbs: true,
    menubar: {
      enabled: false,
      position: 'header',
    },
    header: {
      enabled: true
    },
    sidebar: {
      collapsible: true,
      defaultCollapsed: false,
    },
    optionsMenu: {
      position: 'header',
      components: {
        search: true,
        themeSwitch: true,
      }
    },
    footer: {
      style: 'complete',
      description: 'A lightweight system for running isolated AI workspaces locally, with minimal tokens and overhead.',
      copyright: `© ${new Date().getFullYear()} memoryblock.`,
      columns: [
        {
          title: 'Resources',
          links: [
            { text: 'Getting Started', url: '/' },
            { text: 'Architecture', url: '/architecture' },
            { text: 'CLI Commands', url: '/commands' }
          ]
        },
        {
          title: 'Ecosystem',
          links: [
            { text: 'Adapters', url: '/adapters/openai' },
            { text: 'Plugins', url: '/plugins/web-search' },
            { text: 'Development', url: '/development/development' }
          ]
        },
        {
          title: 'Community',
          links: [
            { text: 'GitHub', url: 'https://github.com/memoryblock-io/memoryblock', external: true },
            { text: 'Discussions', url: 'https://github.com/orgs/memoryblock-io/discussions', external: true },
            { text: 'NPM Registry', url: 'https://www.npmjs.com/package/memoryblock', external: true }
          ]
        }
      ]
    }
  },

  // --- Plugins ---
  plugins: {
    search: {},
    seo: {
      defaultDescription: 'Documentation for Memoryblock, a lightweight system for running isolated AI workspaces locally with persistent memory, multi-agent orchestration, and optimised token usage.',
      openGraph: { defaultImage: 'https://memoryblock.io/src/images/hero-bg.png' },
      twitter: { cardType: 'summary_large_image' }
    },
    analytics: { googleV4: { measurementId: 'G-4Z0KBP513G' } },
    sitemap: { defaultChangefreq: 'weekly', defaultPriority: 0.8 },
    mermaid: {},
    llms: {}
  },

  versions: {
    current: '01',
    position: 'sidebar-top',
    all: [
      { id: '01', dir: 'docs-01', label: 'v0.1.x (Latest)' }
    ]
  },

  // --- Navigation (Categorized) ---
  navigation: [
    { title: 'Home', path: '/', icon: 'home' },
    {
      title: 'Basics',
      icon: 'zap',
      collapsible: false,
      children: [
        { title: 'Architecture', path: '/architecture', icon: 'component' },
        { title: 'Configuration', path: '/configuration', icon: 'settings' },
        { title: 'CLI Commands', path: '/commands', icon: 'terminal' },
        { title: 'Cost Efficiency', path: '/cost-efficiency', icon: 'bar-chart' },
      ]
    },
    {
      title: 'Tools',
      icon: 'wrench',
      collapsible: false,
      children: [
        { title: 'Reference', path: '/tools-reference', icon: 'book' },
        { title: 'Pulse System', path: '/tools/pulse', icon: 'activity' },
        { title: 'File System', path: '/tools/fs', icon: 'file' },
        { title: 'Shell & Commands', path: '/tools/shell', icon: 'terminal' },
        { title: 'Development', path: '/tools/dev', icon: 'code' },
        { title: 'Identity', path: '/tools/identity', icon: 'user' },
        { title: 'System & Metrics', path: '/tools/system', icon: 'bar-chart' },
        { title: 'Auth & Security', path: '/tools/auth', icon: 'shield' },
      ]
    },
    {
      title: 'Adapters',
      icon: 'cpu',
      children: [
        { title: 'OpenAI', path: '/adapters/openai', icon: 'bot' },
        { title: 'Anthropic', path: '/adapters/anthropic', icon: 'bot' },
        { title: 'Gemini', path: '/adapters/gemini', icon: 'bot' },
        { title: 'Bedrock', path: '/adapters/bedrock', icon: 'bot' }
      ]
    },
    {
      title: 'Plugins',
      icon: 'puzzle',
      children: [
        { title: 'Installer', path: '/plugins/installer', icon: 'arrow-down-to-line' },
        { title: 'Web Search', path: '/plugins/web-search', icon: 'search' },
        { title: 'Fetch Webpage', path: '/plugins/fetch-webpage', icon: 'globe' },
        { title: 'Agents Orchestration', path: '/plugins/agents', icon: 'brain-circuit' }
      ]
    },
    {
       title: 'Development',
       icon: 'code',
       children: [
         { title: 'Environment', path: '/development/development', icon: 'container' },
         { title: 'Building Plugins', path: '/development/building-plugins', icon: 'hammer' },
         { title: 'Testing Guide', path: '/development/testing-guide', icon: 'test-tube' },
         { title: 'Contributing', path: '/development/contributing', icon: 'git-pull-request' }
       ]
    },
    {
      title: 'Reference',
      icon: 'book',
      children: [
        { title: 'API Reference', path: '/api-reference', icon: 'braces' },
      ]
    },
    {
      title: 'Community',
      icon: 'users',
      collapsible: false,
      children: [
        { title: 'GitHub', path: 'https://github.com/memoryblock-io/memoryblock', icon: 'github', external: true },
        { title: 'Issues', path: 'https://github.com/memoryblock-io/memoryblock/issues', icon: 'alert-circle', external: true },
        { title: 'Discussions', path: 'https://github.com/orgs/memoryblock-io/discussions', icon: 'message-square', external: true },
      ]
    }
  ],
});