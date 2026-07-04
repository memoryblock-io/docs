---
title: Aiplug stream protocol
description: The StreamChunk variants emitted by every transport. Wire-format-independent, host-friendly.
---

# Stream protocol

`AIPlug.stream()` yields a discriminated union of `StreamChunk` variants. Adapters downstream — memoryblock, custom agents, scripts — consume this shape regardless of the underlying provider. The wire format is provider-specific; the chunk shape is uniform.

## Chunk variants

| Variant | When it fires | Provider examples |
| --- | --- | --- |
| `text-delta` | Plain response text streams | All |
| `reasoning-delta` | Model emits thinking that should not be shown to the user verbatim | Anthropic Claude, DeepSeek-V4 (reasoning mode) |
| `tool-call-delta` | Tool-call arguments stream in incrementally (partial JSON) | OpenAI, Bedrock ConverseStream, Anthropic |
| `tool-call` | The final assembled tool call, ready for execution | All |
| `cache-read` | The provider reports cached prompt tokens were hit | Anthropic, Bedrock |
| `cache-write` | The provider reports new prompt tokens were cached | Anthropic, Bedrock |
| `usage` | Token accounting chunk (prompt, completion, total, cache deltas) | All |
| `finish` | Stream completed; carries the stop reason | All |
| `error` | Mid-stream failure that the transport decided to surface as a chunk | All |

The shape:

```ts
type StreamChunk =
  | { type: 'text-delta'; delta: string }
  | { type: 'reasoning-delta'; delta: string; accumulated: string }
  | { type: 'tool-call-delta'; toolCallId: string; argumentsDelta: string }
  | { type: 'tool-call'; toolCall: { id: string; name: string; arguments: Record<string, unknown>; rawArguments: string } }
  | { type: 'cache-read'; cacheReadTokens: number; accumulated: number }
  | { type: 'cache-write'; cacheWriteTokens: number }
  | { type: 'usage'; usage: { promptTokens?: number; completionTokens?: number; totalTokens?: number; cacheReadTokens?: number; cacheWriteTokens?: number; reasoningTokens?: number } }
  | { type: 'finish'; reason: 'stop' | 'tool_calls' | 'length' | 'content_filter' | 'error' | string }
  | { type: 'error'; error: { code: string; message: string; status?: number; details?: unknown } }
```

The host code is always a `for await` loop with a `switch (chunk.type)`:

```ts
let text = '';
for await (const chunk of ai.stream({ model, messages })) {
  switch (chunk.type) {
    case 'text-delta': text += chunk.delta; break;
    case 'tool-call':   pending.push(chunk.toolCall); break;
    case 'usage':       updateCostBadge(chunk.usage); break;
    case 'finish':      onComplete(text, chunk.reason); break;
    case 'error':       onError(chunk.error); return;
  }
}
```

## Usage chunk

The `usage` chunk carries token counts. The shape is provider-shaped via the index signature, so any provider-specific fields (Anthropic's `cache_creation_input_tokens`, OpenAI's `prompt_tokens_details.cached_tokens`, etc.) flow through without losing the rest of the payload.

```ts
const u = chunk.usage;
// {
//   promptTokens: 100,
//   completionTokens: 50,
//   totalTokens: 150,
//   cacheReadTokens: 80,    // optional
//   cacheWriteTokens: 20,   // optional
//   reasoningTokens: 10,   // optional
// }
```

OpenAI-compatible streams (the majority of aiplug's transports) require an explicit `stream_options: { include_usage: true }` flag in the request body to surface the `usage` chunk. The base `OpenAITransport` sets this by default; per-provider overrides are explicit.

## Tool-call streaming

Tool calls assemble incrementally. The host should buffer `tool-call-delta` chunks keyed by `toolCallId`, then dispatch the final `tool-call` chunk when the stream finishes.

```ts
const toolCalls = new Map<string, { id: string; name: string; args: string }>();

for await (const chunk of ai.stream({ model, messages, tools })) {
  switch (chunk.type) {
    case 'tool-call-delta': {
      const existing = toolCalls.get(chunk.toolCallId) ?? { id: chunk.toolCallId, name: '', args: '' };
      existing.args += chunk.argumentsDelta;
      toolCalls.set(chunk.toolCallId, existing);
      break;
    }
    case 'tool-call':
      // Final assembled tool call. `arguments` is the parsed JSON object;
      // `rawArguments` is the original string for hosts that need to
      // stream-parse it themselves.
      dispatchToolCall(chunk.toolCall);
      break;
  }
}
```

## Error handling

Errors fall into two categories:

1. **Pre-stream errors** (auth failure, bad config, network down at request start) — thrown by the transport as `AIPlugError`. The host's outer `try/catch` handles them.
2. **Mid-stream errors** — surfaced as `{ type: 'error', error: { code, message, … } }` chunks. The stream ends after the error chunk.

Aiplug's `asSnapshot(err)` helper extracts a `{ code, message }` shape from any thrown value, including third-party errors.

## See also

- [Embedding guide](embedding.md) — consume streams in another project.
- [Provider registry](registry.md) — how transports emit these chunks.
