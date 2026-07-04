# API Reference

Memoryblock's API server provides a REST API and WebSocket interface for managing blocks, archives, and server configuration.

> **Two surfaces, one server.** Legacy `/api/*` routes cover the block + dashboard management that's been there since v0.1. The new `/v1/*` surface is the **public, stable, versioned** API designed for external apps that want to plug memoryblock in as their unified LLM gateway. We recommend new integrations target `/v1/*` exclusively.

## Authentication

All API routes (except `/api/health`, `/api/auth/status`, and `/v1/health`) require a Bearer token:

```
Authorization: Bearer <token>
```

The token is generated during `mblk server start` and is stored in the `.api-token` file in your workspace. You can retrieve it or generate a new one using:

```bash
mblk server token
# Or generate a new one without restarting the server:
mblk server token --new-token
```

## Endpoints

### Health

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Server health check (no auth) |
| `GET` | `/api/auth/status` | Check if a token is valid |

### Blocks

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/blocks` | List all blocks with status, costs, and config summary |
| `POST` | `/api/blocks` | Create a new block |
| `GET` | `/api/blocks/:name` | Get full details for a block (config, memory, costs, pulse) |
| `DELETE` | `/api/blocks/:name` | Archive a block (soft delete) |

#### POST `/api/blocks`

```json
{ "name": "my-block" }
```

Returns `{ "success": true, "name": "my-block" }`

### Block Actions

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/api/blocks/:name/start` | Start the block monitor in daemon mode |
| `POST` | `/api/blocks/:name/stop` | Stop the block monitor |
| `POST` | `/api/blocks/:name/reset` | Reset block state (memory, costs, pulse) |
| `POST` | `/api/blocks/:name/chat` | Send a message to the WebChannel by queuing it in `chat.json` |
| `GET`  | `/api/blocks/:name/chat` | Retrieve the active `chat.json` history for the Web UI |

**Reset** supports a query parameter `?hard=true` to also wipe logs.

### Block Config

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/blocks/:name/config` | Read block configuration |
| `PUT` | `/api/blocks/:name/config` | Update block configuration (shallow merge) |

#### PUT `/api/blocks/:name/config`

Send a JSON object with the fields to update. Existing fields are preserved:

```json
{ "description": "Updated description" }
```

### Block Logs

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/blocks/:name/logs` | Get the 20 most recent log files |

### Archive

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/archive` | List all archived blocks |
| `POST` | `/api/archive/:name/restore` | Restore an archived block |
| `DELETE` | `/api/archive/:name` | Permanently delete an archived block |

## WebSocket

Connect to `/api/ws?token=<token>` for real-time updates.

### Subscribe to a block

```json
{ "type": "subscribe", "block": "my-block" }
```

### Incoming messages

```json
{ "type": "refresh" }
```

---

# `/v1` — Public LLM API (recommended for integrations)

The `/v1` surface is the **stable, versioned** public API. It exposes the five selected adapters (Bedrock, OpenAI, Google, Anthropic, Ollama) through a single, minimal request shape. External apps can use memoryblock as their unified LLM gateway without knowing anything about blocks, channels, or the daemon.

| Method | Path | Auth | Description |
|:---|:---|:---:|:---|
| `GET`  | `/v1/health` | — | Liveness check + registered adapter ids |
| `GET`  | `/v1/adapters` | ✓ | List all registered adapters |
| `GET`  | `/v1/adapters/:provider/models` | ✓ | Available models for a provider (Ollama: live-discovered) |
| `POST` | `/v1/adapters/:provider/verify` | ✓ | Probe credentials / reachability (never makes a real LLM call) |
| `POST` | `/v1/chat` | ✓ | The single inference endpoint — non-streaming or SSE streaming |

## GET `/v1/health`

Public, no auth required. Useful for load balancers and CI smoke tests.

```json
{
  "status": "ok",
  "version": "1.0.0",
  "adapters": ["bedrock", "openai", "google", "anthropic", "ollama"]
}
```

## GET `/v1/adapters`

Returns metadata for all registered adapters:

```json
{
  "adapters": [
    {
      "id": "bedrock",
      "displayName": "AWS Bedrock",
      "authRequired": true,
      "defaultModel": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
      "supportsStreaming": true,
      "envVars": []
    },
    {
      "id": "ollama",
      "displayName": "Ollama (local)",
      "authRequired": false,
      "defaultBaseURL": "http://localhost:11434/v1",
      "defaultModel": "llama3.2",
      "supportsStreaming": true,
      "envVars": ["OLLAMA_BASE_URL"]
    }
  ]
}
```

## GET `/v1/adapters/:provider/models`

For Ollama, the adapter live-discovers installed models from the daemon. For other providers, returns a curated list of well-known models.

```bash
curl -H "Authorization: Bearer $MBLK_TOKEN" \
  http://localhost:8420/v1/adapters/ollama/models
```

```json
{ "provider": "ollama", "models": ["qwen2.5:0.5b", "llama3.2:1b"], "count": 2 }
```

## POST `/v1/adapters/:provider/verify`

Probes credentials and reachability without making a real LLM call. Returns 200 if everything is wired correctly, 503 if the call to the underlying provider failed (with the error message in `detail`).

```json
{ "provider": "ollama" }
```

```json
{ "provider": "ollama", "ok": true, "detail": "Ollama daemon reachable at http://127.0.0.1:11434. 1 model(s) available." }
```

You can also override config per-request:

```json
{
  "provider": "ollama",
  "config": { "baseURL": "http://my-ollama-host:11434/v1" }
}
```

## POST `/v1/chat` — the single inference endpoint

The simplest possible shape: three required fields (`adapter`, `model`, `messages`), everything else optional. Credentials default from the user's `auth.json`; per-request overrides go in `config`.

### Non-streaming

```bash
curl -X POST http://localhost:8420/v1/chat \
  -H "Authorization: Bearer $MBLK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adapter": "bedrock",
    "model": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "messages": [
      { "role": "user", "content": "Reply with the single word: pong" }
    ],
    "config": {
      "maxTokens": 32,
      "temperature": 0.7
    }
  }'
```

```json
{
  "provider": "bedrock",
  "model": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
  "message": { "role": "assistant", "content": "pong" },
  "usage": { "inputTokens": 22, "outputTokens": 4, "totalTokens": 26 },
  "stopReason": "end_turn"
}
```

### Streaming (SSE)

Set `"stream": true` and the response is `text/event-stream`:

```bash
curl -N -X POST http://localhost:8420/v1/chat \
  -H "Authorization: Bearer $MBLK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adapter": "ollama",
    "model": "qwen2.5:0.5b",
    "stream": true,
    "messages": [{ "role": "user", "content": "Tell me a haiku" }]
  }'
```

Frames:

```
event: start
data: {"provider":"ollama","model":"qwen2.5:0.5b"}

event: content
data: {"text":"Silently"}

event: content
data: {"text":" the"}

event: content
data: {"text":" pond sleeps"}

event: done
data: {"usage":{"inputTokens":18,"outputTokens":12,"totalTokens":30},"stopReason":"end_turn"}
```

Errors are reported as a single `event: error` frame followed by the stream closing.

### The `config` object (optional, all fields optional)

| Field | Type | Used by | Description |
|:---|:---|:---|:---|
| `maxTokens` | `number` | all | Maximum output tokens (default 4096) |
| `temperature` | `number` | all | Sampling temperature (0.0 – 1.0) |
| `cacheControl` | `boolean` | Anthropic / Bedrock | Enable prompt caching |
| `region` | `string` | bedrock | AWS region override |
| `baseURL` | `string` | openai / google / anthropic / ollama | API endpoint override |
| `apiKey` | `string` | openai / google / anthropic | Per-request API key override (use sparingly) |
| `accessKeyId` | `string` | bedrock | AWS access key override |
| `secretAccessKey` | `string` | bedrock | AWS secret key override |

If omitted, the adapter falls back to `auth.json` → env vars → hard-coded defaults.

### Tools / function calling

Pass the OpenAI-shape `tools` array. Tool use is fully supported on Bedrock, OpenAI, Google, and Ollama (for Ollama: only with models that support tool use, e.g. `llama3.1:8b`+).

```json
{
  "adapter": "bedrock",
  "model": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
  "messages": [{ "role": "user", "content": "What's the weather in Paris?" }],
  "tools": [{
    "name": "get_weather",
    "description": "Get the current weather for a city",
    "parameters": {
      "type": "object",
      "properties": { "city": { "type": "string" } },
      "required": ["city"]
    }
  }]
}
```

The response `message.toolCalls` will contain the model's request to call the tool. Pass results back in a follow-up request with `role: "tool"` and `toolResults`.

### Error responses

All errors return JSON of the form:

```json
{ "error": "Human-readable message", "status": 400, "code": "INVALID_REQUEST" }
```

| Status | When |
|:---:|:---|
| `400` | Malformed body, unknown adapter, missing required field |
| `401` | Missing or invalid bearer token |
| `404` | Unknown adapter in URL |
| `500` | Internal server error |
| `502` | The adapter failed to make the upstream call |
| `503` | Adapter not configured (missing credentials) |

## Code samples

### Node.js (fetch)

```js
const token = process.env.MBLK_TOKEN;

const res = await fetch('http://localhost:8420/v1/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    adapter: 'ollama',
    model: 'qwen2.5:0.5b',
    messages: [{ role: 'user', content: 'hi' }],
  }),
});
const json = await res.json();
console.log(json.message.content);
```

### Python (requests + SSE)

```python
import os, requests, sseclient, json

token = os.environ['MBLK_TOKEN']
res = requests.post(
  'http://localhost:8420/v1/chat',
  headers={'Authorization': f'Bearer {token}'},
  json={
    'adapter': 'ollama',
    'model': 'qwen2.5:0.5b',
    'stream': True,
    'messages': [{'role': 'user', 'content': 'Tell me a joke'}],
  },
  stream=True,
)
for line in res.iter_lines():
    if not line: continue
    if line.startswith(b'data:'):
        payload = json.loads(line[5:].strip())
        if 'text' in payload: print(payload['text'], end='', flush=True)
```

### cURL

```bash
MBLK_TOKEN=$(mblk server token)
curl -sX POST http://localhost:8420/v1/chat \
  -H "Authorization: Bearer $MBLK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adapter":"ollama","model":"qwen2.5:0.5b","messages":[{"role":"user","content":"hi"}]}' \
  | jq '.message.content'
```

## Pluggable routers

External apps can register their own route groups on the running ApiServer via the `registerRouter(prefix, router)` method exposed by `@memoryblock/api`:

```ts
import { ApiServer, Router } from '@memoryblock/api';

const server = new ApiServer({ port: 8420, authToken, workspacePath: '/path/to/ws' });

const myRouter = new Router();
myRouter.get('/hello', () => new Response('hi'));
myRouter.post('/echo', async (req) => new Response(await req.text()));

server.registerRouter('/myapp', myRouter);
server.allowPublic('/myapp/hello');

await server.start();
```

Sent when any file in the subscribed block's directory changes (debounced at 100ms). The client should re-fetch block details after receiving this event.