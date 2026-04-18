# Domain 2: Tool Design & MCP Integration -- Official Documentation Research

> CCA Certification Exam -- 18% of exam weight
> Sources: Anthropic API docs, MCP specification (2025-06-18), Claude Code docs

---

## 1. Tool Interface Design (Anthropic API)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools

### Tool Definition Parameters

Each tool in the `tools` top-level array requires:

| Parameter | Description |
|-----------|-------------|
| `name` | Must match regex `^[a-zA-Z0-9_-]{1,64}$` |
| `description` | Detailed plaintext description of what the tool does, when to use it, how it behaves |
| `input_schema` | JSON Schema object defining expected parameters |
| `input_examples` | (Optional) Array of example input objects, must validate against `input_schema` |

Additional optional properties on tool definitions: `cache_control`, `strict`, `defer_loading`, `allowed_callers`.

### Tool Name Rules

- Alphanumeric characters, underscores, and hyphens only
- 1 to 64 characters long
- Regex: `^[a-zA-Z0-9_-]{1,64}$`

### Description Best Practices

- **Provide extremely detailed descriptions** -- this is the single most important factor in tool performance
- Explain: what the tool does, when it should be used (and when not), what each parameter means, caveats/limitations
- Aim for at least 3-4 sentences per tool description, more for complex tools
- Use meaningful **namespacing** in tool names (e.g., `github_list_prs`, `slack_send_message`)
- **Consolidate related operations** into fewer tools with an `action` parameter rather than many small tools
- **Design tool responses** to return only high-signal information; use stable identifiers (slugs/UUIDs)

### input_schema Requirements

- Must be a valid JSON Schema object
- Root `type` must be `"object"`
- Define `properties` with types and descriptions
- Specify `required` array for mandatory parameters
- For strict mode: must include `"additionalProperties": false`

### input_examples

- Optional array of example input objects
- Each example must validate against the tool's `input_schema`; invalid examples return HTTP 400
- Not supported for server-side tools (web_search, code_execution, etc.)
- Token cost: ~20-50 tokens for simple examples, ~100-200 for complex nested objects
- Examples appear in the prompt alongside the schema

```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature"
      }
    },
    "required": ["location"]
  },
  "input_examples": [
    {"location": "San Francisco, CA", "unit": "fahrenheit"},
    {"location": "Tokyo, Japan", "unit": "celsius"},
    {"location": "New York, NY"}
  ]
}
```

---

## 2. tool_choice Options

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools — "Tool choice"

Four possible values for the `tool_choice` parameter:

| Option | JSON Syntax | Behavior |
|--------|------------|----------|
| `auto` | `{"type": "auto"}` | Claude decides whether to call any tools. **Default when `tools` provided.** |
| `any` | `{"type": "any"}` | Claude MUST use one of the provided tools, but can choose which one |
| `tool` | `{"type": "tool", "name": "get_weather"}` | Forces Claude to always use the specific named tool |
| `none` | `{"type": "none"}` | Prevents Claude from using any tools. **Default when no `tools` provided.** |

### Key Behaviors

- When `tool_choice` is `any` or `tool`, the API **prefills the assistant message** to force tool use. This means Claude will NOT emit natural language before `tool_use` blocks, even if asked.
- For natural language + forced tool: use `auto` and add explicit instructions in the `user` message.
- Extended thinking only supports `auto` and `none`. Using `any` or `tool` with extended thinking returns an error.

### Token Overhead from Tool Use System Prompt

| Model Family | `auto`/`none` | `any`/`tool` |
|-------------|---------------|--------------|
| Claude Opus 4.x / Sonnet 4.x | 346 tokens | 313 tokens |
| Claude Haiku 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 3.5 | 264 tokens | 340 tokens |

If no `tools` are provided and tool_choice is `none`, 0 additional system prompt tokens.

---

## 3. Tool Use Message Flow (Anthropic API)

### Client Tool Flow

1. **User sends request** with `tools` array and `messages`
2. **Claude responds** with `stop_reason: "tool_use"` and `tool_use` content blocks
3. **Your code executes** the tool
4. **You send `tool_result`** back to Claude
5. **Claude generates** final response

### tool_use Block (from Claude)

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "San Francisco, CA", "unit": "celsius"}
}
```

Fields: `id` (unique identifier), `name`, `input` (conforms to `input_schema`).

### tool_result Block (from your code)

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 degrees"
    }
  ]
}
```

- `tool_use_id`: must match the `id` from the `tool_use` block
- `content`: string, array of content blocks (text/image/document), or omitted (empty result)
- `is_error`: optional boolean, set `true` for error results

### Formatting Requirements

- Tool result blocks must **immediately follow** their corresponding tool use blocks in message history
- In the user message containing tool results, `tool_result` blocks must come **FIRST** in the content array; any text must come AFTER all tool results
- Violating this causes HTTP 400 error

### Error Handling with is_error

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "ConnectionError: the weather service API is not available (HTTP 500)",
  "is_error": true
}
```

- Write instructive error messages (what went wrong + what to try next)
- If Claude gets invalid tool use errors, it retries 2-3 times with corrections before apologizing
- Server tool errors are handled transparently by Claude

### Server Tools vs Client Tools

| Aspect | Client Tools | Server Tools |
|--------|-------------|-------------|
| Execution | Your application | Anthropic's infrastructure |
| Response | `stop_reason: "tool_use"` + you send `tool_result` | Results appear directly in response |
| Types | User-defined tools, Anthropic-schema (bash, text_editor) | web_search, code_execution, web_fetch, tool_search |

---

## 4. Strict Tool Use

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use

### Enabling Strict Mode

Add `strict: true` as a top-level property in the tool definition:

```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {"type": "string"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
    },
    "required": ["location"],
    "additionalProperties": false
  }
}
```

### Requirements

- `strict: true` must be set as top-level property alongside `name`, `description`, `input_schema`
- `"additionalProperties": false` must be set in the `input_schema`
- Schema must conform to the supported JSON Schema subset (same as structured outputs)

### How It Works

- Uses **grammar-constrained sampling** to guarantee Claude's tool inputs match the JSON Schema exactly
- Tool `input` strictly follows the `input_schema`
- Tool `name` is always valid (from provided tools or server tools)
- No need to validate and retry tool calls

### Schema Caching

- Tool `input_schema` definitions are compiled into grammars using the same pipeline as structured outputs
- Schemas are **temporarily cached for up to 24 hours** since last use
- Prompts and responses are NOT retained beyond the API response

### PHI/HIPAA Restrictions

- Strict tool use IS HIPAA eligible
- **PHI must NOT be included in tool schema definitions**
- Cached schemas do NOT receive the same PHI protections as prompts/responses
- Do NOT include PHI in: `input_schema` property names, `enum` values, `const` values, `pattern` regular expressions
- PHI should ONLY appear in message content (prompts and responses)

### Use Cases

- Validate tool parameters (type-safe function calls)
- Build agentic workflows
- Combine `tool_choice: {"type": "any"}` + `strict: true` to guarantee both tool call AND schema conformance

---

## 5. MCP Three Primitives

### Overview

| Primitive | Control Model | Description |
|-----------|--------------|-------------|
| **Tools** | Model-controlled | LLM discovers and invokes automatically based on context |
| **Resources** | Application-driven | Host app determines how to incorporate context |
| **Prompts** | User-controlled | User explicitly selects (e.g., slash commands) |

### 5.1 MCP Tools

> **Source:** https://modelcontextprotocol.io/docs/concepts/tools

**Control model**: Model-controlled -- the LLM can discover and invoke tools automatically.

**Capability declaration**:
```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}
```

**Tool definition fields**:
- `name`: Unique identifier
- `title`: Optional human-readable display name
- `description`: Human-readable description
- `inputSchema`: JSON Schema for expected parameters
- `outputSchema`: Optional JSON Schema for expected output structure
- `annotations`: Optional properties describing tool behavior

**Protocol methods**:
- `tools/list` -- discover available tools (supports pagination with `cursor`)
- `tools/call` -- invoke a tool with `name` and `arguments`
- `notifications/tools/list_changed` -- server notifies when tool list changes

**Tool call request**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {"location": "New York"}
  }
}
```

**Tool call response**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {"type": "text", "text": "Temperature: 72F\nConditions: Partly cloudy"}
    ],
    "isError": false
  }
}
```

**Result content types**: text, image, audio, resource_link, resource (embedded)

**Structured content**: returned in `structuredContent` field; for backwards compatibility, SHOULD also include serialized JSON in a TextContent block.

**Output schema**: Optional. If provided, servers MUST conform to it, clients SHOULD validate against it.

**Tool annotations** (ToolAnnotations object):

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `readOnlyHint` | boolean | false | If true, tool does not modify its environment |
| `destructiveHint` | boolean | true | If true, tool may perform destructive updates |
| `idempotentHint` | boolean | false | If true, calling repeatedly with same args has no additional effect |
| `openWorldHint` | boolean | true | If true, tool interacts with external entities |

Clients MUST consider tool annotations **untrusted** unless from trusted servers.

**Content annotations** (on all content types):
- `audience`: array of `"user"` and/or `"assistant"`
- `priority`: number 0.0 to 1.0 (1 = most important)
- `lastModified`: ISO 8601 timestamp

### 5.2 MCP Resources

> **Source:** https://modelcontextprotocol.io/docs/concepts/resources

**Control model**: Application-driven -- host app determines how to incorporate context.

**Capability declaration**:
```json
{
  "capabilities": {
    "resources": {
      "subscribe": true,
      "listChanged": true
    }
  }
}
```

Both `subscribe` and `listChanged` are optional independently.

**Resource definition fields**:
- `uri`: Unique identifier (RFC 3986 URI)
- `name`: Resource name
- `title`: Optional human-readable display name
- `description`: Optional description
- `mimeType`: Optional MIME type
- `size`: Optional size in bytes

**Protocol methods**:
- `resources/list` -- discover resources (paginated)
- `resources/read` -- retrieve resource contents by URI
- `resources/templates/list` -- discover parameterized resource templates
- `resources/subscribe` -- subscribe to changes on specific resource
- `notifications/resources/list_changed` -- list of resources changed
- `notifications/resources/updated` -- specific resource updated

**Resource templates**: Use URI templates (RFC 6570) for parameterized resources.

```json
{
  "uriTemplate": "file:///{path}",
  "name": "Project Files",
  "description": "Access files in the project directory",
  "mimeType": "application/octet-stream"
}
```

**Resource contents**: text (`text` field) or binary (`blob` field, base64-encoded).

**Common URI schemes**: `https://`, `file://`, `git://`, custom schemes (must follow RFC 3986).

**Error codes**: Resource not found: `-32002`, Internal errors: `-32603`.

### 5.3 MCP Prompts

> **Source:** https://modelcontextprotocol.io/docs/concepts/prompts

**Control model**: User-controlled -- exposed as slash commands or similar UI.

**Capability declaration**:
```json
{
  "capabilities": {
    "prompts": {
      "listChanged": true
    }
  }
}
```

**Prompt definition fields**:
- `name`: Unique identifier
- `title`: Optional human-readable display name
- `description`: Optional description
- `arguments`: Optional list of arguments for customization (each with `name`, `description`, `required`)

**Protocol methods**:
- `prompts/list` -- discover prompts (paginated)
- `prompts/get` -- retrieve specific prompt with arguments
- `notifications/prompts/list_changed` -- prompt list changed

**PromptMessage**: Contains `role` ("user" or "assistant") and `content` (text, image, audio, or embedded resource).

**Prompt get request**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {"code": "def hello():\n    print('world')"}
  }
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {"type": "text", "text": "Please review this Python code:\ndef hello():\n    print('world')"}
      }
    ]
  }
}
```

**Error codes**: Invalid prompt name: `-32602`, Missing required arguments: `-32602`, Internal errors: `-32603`.

**In Claude Code**: Prompts appear as `/mcp__servername__promptname` slash commands. Arguments are space-separated after the command.

---

## 6. MCP Error Handling

### Two Error Mechanisms

1. **Protocol Errors**: Standard JSON-RPC errors
   - Unknown tools: code `-32602`
   - Invalid arguments: code `-32602`
   - Server errors: code `-32603`
   - Resource not found: code `-32002`

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: invalid_tool_name"
  }
}
```

2. **Tool Execution Errors**: `isError: true` in tool results
   - API failures
   - Invalid input data
   - Business logic errors

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {"type": "text", "text": "Failed to fetch weather data: API rate limit exceeded"}
    ],
    "isError": true
  }
}
```

---

## 7. MCP Server Scoping in Claude Code

> **Source:** https://code.claude.com/docs/en/mcp

### Three Scopes

| Scope | Loads In | Shared with Team | Stored In |
|-------|----------|-----------------|-----------|
| **Local** (default) | Current project only | No | `~/.claude.json` (under project path) |
| **Project** | Current project only | Yes, via version control | `.mcp.json` in project root |
| **User** | All your projects | No | `~/.claude.json` (global section) |

### Scope Precedence (highest to lowest)

1. Local scope
2. Project scope
3. User scope
4. Plugin-provided servers
5. claude.ai connectors

### Adding Servers at Each Scope

```bash
# Local (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicit local
claude mcp add --transport http stripe --scope local https://mcp.stripe.com

# Project scope (creates/updates .mcp.json)
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp

# User scope (available across all projects)
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### Local Scope Storage

```json
{
  "projects": {
    "/path/to/your/project": {
      "mcpServers": {
        "stripe": {
          "type": "http",
          "url": "https://mcp.stripe.com"
        }
      }
    }
  }
}
```

### Project Scope (.mcp.json)

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

Project-scoped servers require approval before use (security).

### Important Note

The term "local scope" for MCP servers differs from general local settings. MCP local-scoped servers are stored in `~/.claude.json` (home directory), while general local settings use `.claude/settings.local.json` (project directory).

---

## 8. Environment Variable Expansion in .mcp.json

### Supported Syntax

| Syntax | Behavior |
|--------|----------|
| `${VAR}` | Expands to the value of environment variable `VAR` |
| `${VAR:-default}` | Expands to `VAR` if set, otherwise uses `default` |

### Expansion Locations

Environment variables can be expanded in these fields:
- `command` -- server executable path
- `args` -- command-line arguments
- `env` -- environment variables passed to the server
- `url` -- for HTTP server types
- `headers` -- for HTTP server authentication

### Example

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

If a required environment variable is not set and has no default value, Claude Code will **fail to parse the config**.

### Plugin Environment Variables

- `${CLAUDE_PLUGIN_ROOT}` -- path to bundled plugin files
- `${CLAUDE_PLUGIN_DATA}` -- persistent data directory surviving plugin updates

---

## 9. MCP Transport Types

> **Source:** https://modelcontextprotocol.io/docs/concepts/transports

### All Messages Use JSON-RPC 2.0

- Messages MUST be UTF-8 encoded

### 9.1 stdio Transport

- Client launches MCP server as a **subprocess**
- Server reads JSON-RPC from **stdin**, writes to **stdout**
- Messages delimited by **newlines**, MUST NOT contain embedded newlines
- Server MAY write to **stderr** for logging
- Server MUST NOT write non-MCP content to stdout
- Clients SHOULD support stdio whenever possible

```
Client launches subprocess
  -> Client writes to stdin
  <- Server writes to stdout
  <- Server optionally logs to stderr
Client closes stdin, terminates subprocess
```

### 9.2 Streamable HTTP Transport (replaces deprecated HTTP+SSE)

- Server operates as **independent process** handling multiple clients
- Single HTTP endpoint (the "MCP endpoint") supports both POST and GET
- Client sends JSON-RPC messages via HTTP POST
- Client MUST include `Accept` header listing both `application/json` and `text/event-stream`
- Server responds with either `Content-Type: application/json` or `Content-Type: text/event-stream` (SSE stream)

**Key behaviors**:
- POST body is a single JSON-RPC request, notification, or response
- For notifications/responses: server returns 202 Accepted (no body)
- For requests: server returns JSON or opens SSE stream
- SSE stream may include server requests/notifications before the response

**Session management**:
- Server MAY assign session ID via `Mcp-Session-Id` header on InitializeResult
- Client MUST include `Mcp-Session-Id` on all subsequent requests
- Server MAY terminate session; responds with 404 to expired session IDs
- Client SHOULD send HTTP DELETE to MCP endpoint to explicitly terminate

**Protocol version header**: Client MUST include `MCP-Protocol-Version: 2025-06-18` on all HTTP requests.

**Security**:
- Servers MUST validate `Origin` header (prevent DNS rebinding)
- Local servers SHOULD bind only to localhost (127.0.0.1)
- Servers SHOULD implement authentication

**Resumability**: Servers MAY attach `id` to SSE events; clients use `Last-Event-ID` header to resume.

### 9.3 SSE Transport (DEPRECATED)

- Deprecated in favor of Streamable HTTP
- Still available for backwards compatibility
- Claude Code supports it via `--transport sse`

### Transport Configuration in Claude Code

```bash
# HTTP (Streamable HTTP) -- recommended for remote
claude mcp add --transport http <name> <url>

# SSE -- deprecated
claude mcp add --transport sse <name> <url>

# stdio -- for local processes
claude mcp add --transport stdio <name> -- <command> [args...]
```

### Automatic Reconnection (Claude Code)

- HTTP/SSE servers: automatic reconnection with **exponential backoff**
- Up to 5 attempts, starting at 1-second delay, doubling each time
- After 5 failures: server marked as failed, manual retry from `/mcp`
- stdio servers: NOT reconnected automatically (local processes)

---

## 10. Claude Code Built-in Tools

> **Source:** https://code.claude.com/docs/en/tools-reference

### Tool Purpose and Selection

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **Read** | Read file contents from filesystem | When you know the specific file path; reads up to 2000 lines by default; supports images, PDFs, notebooks |
| **Write** | Write/overwrite files | Creating new files or complete rewrites; must Read first for existing files |
| **Edit** | Exact string replacements in files | Modifying existing files (preferred over Write); `old_string` must be unique in file; supports `replace_all` |
| **Bash** | Execute shell commands | Running git, npm, docker, build commands; persistent working directory between calls |
| **Grep** | Search file contents (built on ripgrep) | Finding patterns in code; supports regex, file type filtering, context lines; output modes: content, files_with_matches, count |
| **Glob** | Fast file pattern matching | Finding files by name pattern (e.g., `**/*.ts`); returns paths sorted by modification time |

### Selection Criteria

- **File search by name** -> Glob (NOT find or ls)
- **Content search** -> Grep (NOT grep or rg via Bash)
- **Read files** -> Read (NOT cat/head/tail)
- **Edit files** -> Edit (NOT sed/awk)
- **Write new files** -> Write (NOT echo)
- **Shell operations** -> Bash

### Additional Built-in Tools

- **ToolSearch** -- deferred tool discovery for MCP tools; searches by name/keywords to load schemas on demand
- **WebFetch** -- fetch and process web content
- **WebSearch** -- web search capability
- **NotebookEdit** -- edit Jupyter notebooks

---

## 11. Tool Distribution & Agent Design Principles

### Principle of Least Privilege

- Give each agent only the tools it needs for its specific role
- Avoid giving all tools to every agent

### Ideal Tool Count

- **4-5 tools per agent** is the ideal range
- Too many tools increase selection ambiguity
- Too few may require more agent hops

### Tool Design for Agents

- **Consolidate related operations** into fewer, more capable tools (e.g., one `github` tool with `action` parameter instead of `create_pr`, `review_pr`, `merge_pr`)
- **Use meaningful namespacing** when tools span services: `github_list_prs`, `slack_send_message`
- **Scoped cross-role tools**: tools shared across agents should be scoped to their specific needed capabilities

### MCP Tool Search for Scale

- Tool search keeps context usage low by deferring tool definitions until needed
- Only tool names load at session start
- Claude uses a search tool to discover relevant schemas on demand
- Enabled by default in Claude Code
- `ENABLE_TOOL_SEARCH` environment variable controls behavior:

| Value | Behavior |
|-------|----------|
| (unset) | All MCP tools deferred and loaded on demand |
| `true` | All MCP tools deferred (even for non-first-party hosts) |
| `auto` | Threshold mode: upfront if within 10% of context window |
| `auto:<N>` | Threshold with custom percentage (0-100) |
| `false` | All MCP tools loaded upfront |

- Requires models supporting `tool_reference` blocks: Sonnet 4+ or Opus 4+
- Haiku models do NOT support tool search

### MCP Output Limits (Claude Code)

- Warning threshold: 10,000 tokens
- Default maximum: 25,000 tokens
- Configurable via `MAX_MCP_OUTPUT_TOKENS` environment variable
- Per-tool override: `_meta["anthropic/maxResultSizeChars"]` in tool's `tools/list` entry (up to 500,000 chars)
- `MCP_TIMEOUT` environment variable controls startup timeout (e.g., `MCP_TIMEOUT=10000`)

---

## 12. Managed MCP Configuration (Enterprise)

### Option 1: managed-mcp.json (Exclusive Control)

Deployed to system-wide directory:
- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux/WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

Users cannot add/modify/use any servers other than those defined here.

### Option 2: Policy-based Allowlists/Denylists

Uses `allowedMcpServers` and `deniedMcpServers` in managed settings.

Restriction types:
- `serverName`: matches by configured name
- `serverCommand`: matches exact command + args array for stdio servers
- `serverUrl`: matches URL patterns with wildcard `*` for remote servers

Each entry must have exactly ONE of these three fields.

**Denylist takes absolute precedence** -- blocked even if on allowlist.

---

## 13. Key API Code Examples

### Complete Tool Use Cycle

```python
import anthropic

client = anthropic.Anthropic()

# Step 1: Send request with tools
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    tools=[{
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City and state"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }],
    messages=[{"role": "user", "content": "What's the weather in SF?"}]
)

# Step 2: Check for tool_use in response
# response.stop_reason == "tool_use"
# response.content contains tool_use blocks

# Step 3: Send tool_result back
# Continue conversation with tool_result in user message
```

### Strict Tool with Forced Choice

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    tool_choice={"type": "any"},  # Must use a tool
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "departure_date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1,2,3,4,5,6,7,8,9,10]}
            },
            "required": ["destination", "departure_date"],
            "additionalProperties": False
        }
    }],
    messages=[{"role": "user", "content": "Find flights to Tokyo on June 1"}]
)
```

### MCP .mcp.json with Environment Variables

```json
{
  "mcpServers": {
    "database-tools": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_URL": "${DB_URL}"
      }
    },
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

---

## 14. Quick Reference: Exam-Critical Facts

1. Tool name regex: `^[a-zA-Z0-9_-]{1,64}$`
2. tool_choice has exactly 4 options: `auto`, `any`, `tool`, `none`
3. `any`/`tool` prefill assistant message; no natural language before tool_use blocks
4. Extended thinking only supports `auto` and `none` for tool_choice
5. Strict mode: `strict: true` + `additionalProperties: false` = grammar-constrained sampling
6. Schema cache: 24 hours. No PHI in schema definitions (property names, enums, const, patterns)
7. MCP 3 primitives: Tools (model-controlled), Resources (application-driven), Prompts (user-controlled)
8. MCP error: `isError: true` in tool result for execution errors; JSON-RPC error codes for protocol errors
9. MCP transports: stdio (subprocess), Streamable HTTP (replaces SSE), SSE (deprecated)
10. JSON-RPC 2.0 over UTF-8 for all MCP messages
11. Claude Code scopes: local (default, ~/.claude.json per-project), project (.mcp.json), user (~/.claude.json global)
12. Scope precedence: local > project > user > plugin > claude.ai connectors
13. Env var expansion: `${VAR}` and `${VAR:-default}` in command, args, env, url, headers
14. tool_result blocks must come BEFORE any text in user messages
15. Claude retries invalid tool calls 2-3 times before apologizing
16. Built-in tools: Read, Write, Edit, Bash, Grep, Glob (plus ToolSearch, WebFetch, WebSearch)
17. Tool search enabled by default; `ENABLE_TOOL_SEARCH=false` to disable
18. MCP output warning at 10,000 tokens, default max 25,000 tokens
19. `_meta["anthropic/maxResultSizeChars"]` for per-tool output limits (max 500,000 chars)
20. Automatic reconnection for HTTP/SSE: 5 attempts, exponential backoff starting 1s
