---
title: Credentials & Security
description: Native auth provider monitoring and credential management for memoryblock.
---

Memoryblock monitors can manage their own credentials via these security-focused tools. All operations are strictly sandboxed.

## Auth Management

### auth_read
Retrieves the names of currently configured auth providers (e.g. "aws", "openai", "telegram").
- **Parameters**: N/A
- **Approval**: No
- **Note**: **Security feature** — this only returns names of the companies/services, **never the secret keys**.

### auth_write
Centrally updates credentials for an API provider on disk in `auth.json`.
- **Parameters**: `service` (string), `credentials` (JSON-stringified object)
- **Approval**: **Yes** (Human required)
- **Required Scope**: **system** (Superblock)
- **Note**: This allows a monitor to help you rotate keys or add a new provider like Gemini.

### list_auth_providers
Lists the expected JSON schemas for common auth providers.
- **Parameters**: N/A
- **Approval**: No
- **Note**: Shows the fields a monitor needs to successfully write an `auth_write` payload.

## Security Controls
- **Never Readable**: Even with full `system` scope, tools like `read_file` are explicitly blocked (in the Registry-level [Gatekeeper](../architecture#gatekeeper)) from reading `auth.json` or `.env` files.
- **Human Approval**: `auth_write` always requires an explicit human confirm to prevent a rogue monitor from attempting to overwrite your keys with their own.
- **Centralized**: All credentials are saved in the block's `auth.json` (for portability) or the global fallback in `~/.memoryblock/ws/auth.json`.
