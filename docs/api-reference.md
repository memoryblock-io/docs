# API Reference

Memoryblock's API server provides a REST API and WebSocket interface for managing blocks, archives, and server configuration.

## Authentication

All API routes (except `/api/health` and `/api/auth/status`) require a Bearer token:

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

Sent when any file in the subscribed block's directory changes (debounced at 100ms). The client should re-fetch block details after receiving this event.