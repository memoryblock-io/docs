---
title: File System Tools
description: Direct file and directory interactions for memoryblock monitors.
---

Monitors have powerful, sandboxed access to your local filesystem. All operations are restricted by the block's current [Permission Scope](../commands#permission-scopes).

## Core File Tools

### read_file
Read contents of a single file. Large files (>100K chars) are automatically truncated to save tokens.
- **Parameters**: `path` (string)
- **Approval**: No
- **Note**: Blocks access to sensitive files like `.env` or `auth.json`.

### write_file
Write content to a file. Overwrites existing content.
- **Parameters**: `path` (string), `content` (string)
- **Approval**: No
- **Note**: Automatically creates parent directories if they don't exist.

### append_to_file
Append content to the end of a file.
- **Parameters**: `path` (string), `content` (string)
- **Approval**: No

### replace_in_file
Find and replace specific text in a file. This is the **most token-efficient way** to make small edits.
- **Parameters**: `path` (string), `find` (string), `replace` (string), `all` ("true"|"false")
- **Approval**: No

## Directory Tools

### list_directory
List files and directories within a path.
- **Parameters**: `path` (string, optional)
- **Approval**: No

### create_directory
Recursively create a directory path.
- **Parameters**: `path` (string)
- **Approval**: No

## Metadata & Search

### file_info
Get metadata (size, mod-date, type) without reading the file.
- **Parameters**: `path` (string)
- **Approval**: No

### search_files
Grep-based text search within a directory.
- **Parameters**: `query` (string), `path` (string, optional), `include` (glob, optional)
- **Approval**: No

### find_files
Search for files by name pattern (glob-like).
- **Parameters**: `pattern` (string), `path` (string, optional), `maxDepth` (string, optional)
- **Approval**: No

## Destructive Operations

### delete_file
Delete a file or an empty directory.
- **Parameters**: `path` (string)
- **Approval**: **Yes** (Human required)

### move_file
Move or rename a file.
- **Parameters**: `source` (string), `destination` (string)
- **Approval**: **Yes** (Human required)

### copy_file
Copy a file to a new location.
- **Parameters**: `source` (string), `destination` (string)
- **Approval**: No (Safe operation)
