---
title: Reporting an issue
description: How to file a useful bug report or feature request for memoryblock, aiplug, or these docs.
---

# Reporting an issue

memoryblock, aiplug, and these docs live in three separate repositories. Pick the right one before you file.

## Which repo

| Symptom | File against |
| --- | --- |
| `mblk` CLI crashes, monitor misbehaves, web UI broken, plugin won't install, auth fails | [memoryblock-io/memoryblock](https://github.com/memoryblock-io/memoryblock/issues) |
| `aiplug` transport error, OpenAI-compatible server returns wrong shape, provider X is missing | [mgks/aiplug](https://github.com/mgks/aiplug/issues) |
| Wrong command syntax in a doc page, broken link, missing example | [memoryblock-io/docs](https://github.com/memoryblock-io/docs/issues) |

When in doubt, file against memoryblock. The maintainer routes upstream.

## What to include

A good issue answer three questions: what did you expect, what happened, and how do I reproduce it.

- **Expected behaviour.** One sentence. "I expected `mblk start my-block` to read `auth.providers.bedrock.apiKey` from `auth.json`."
- **Actual behaviour.** The error, the wrong output, or "nothing happened". Paste the full error including the stack trace when relevant.
- **Repro.** The exact commands to reproduce. Include the `mblk` version (`mblk --version` or `cat package.json | grep version`), the operating system, and the Node / Bun version (`bun --version`).
- **Config.** If the bug is about provider / block config, paste the relevant section of `config.json` and `auth.json` with secrets redacted. Use `mblk_•••••••<last 4 chars>` placeholders.

## Reporting a security issue

Use GitHub's [private vulnerability reporting](https://github.com/memoryblock-io/memoryblock/security/advisories/new) on the memoryblock repo. Don't file a public issue. The 90-day coordinated disclosure window applies; you will get an acknowledgement within 72 hours.

## Pull request checklist

If you're sending a fix, the CI must pass before review. Locally:

```bash
pnpm dev:lint                 # 0 errors expected
pnpm dev:verify               # typecheck + build + tests
```

One regression test per fix. The test is the contract: "this bug class cannot return."

## Asking a question

Issues are for actionable work. For usage questions, prefer the [discussions](https://github.com/orgs/memoryblock-io/discussions) tab. The maintainer is more likely to answer quickly there, and other users can chime in.
