# Skilljar MCP Remaining Lessons — Extracted Content

## Source Courses
- **Course 1:** Introduction to Model Context Protocol (https://anthropic.skilljar.com/introduction-to-model-context-protocol)
- **Course 2:** MCP Advanced Topics (https://anthropic.skilljar.com/model-context-protocol-advanced-topics)
- **Course 3:** Building with the Claude API — MCP Section (https://anthropic.skilljar.com/claude-with-the-anthropic-api)

**Note:** Lesson content behind Skilljar authentication was supplemented with official MCP documentation at modelcontextprotocol.io and the Anthropic Python SDK docs at py.sdk.modelcontextprotocol.io.

---

## COURSE 1: Introduction to Model Context Protocol

### Full Course Structure
1. Welcome to the course
2. Introducing MCP
3. MCP clients
4. Project setup
5. Defining tools with MCP
6. **The server inspector**
7. **Implementing a client**
8. Defining resources
9. **Accessing resources**
10. Defining prompts
11. **Prompts in the client**
12. Final assessment on MCP
13. **MCP review**

(Items in **bold** are the remaining lessons extracted below. Items 2-5 and 8-10 were previously extracted in skilljar-facts-extraction.md)

---

### Lesson: The Server Inspector
**Skilljar URL (API course):** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287781
**Official docs:** https://modelcontextprotocol.io/docs/tools/inspector

**Key Facts:**
- The MCP Inspector is an interactive developer tool for testing and debugging MCP servers
- Runs directly through npx without installation: `npx @modelcontextprotocol/inspector <command>`
- For npm packages: `npx -y @modelcontextprotocol/inspector npx <package-name> <args>`
- For PyPI packages: `npx @modelcontextprotocol/inspector uvx <package-name> <args>`
- For local Python servers: `npx @modelcontextprotocol/inspector uv --directory path/to/server run package-name args...`
- For local TypeScript servers: `npx @modelcontextprotocol/inspector node path/to/server/index.js args...`
- In the Skilljar course, servers are tested with: `uv run mcp dev mcp_server.py`

**Inspector Features:**
- **Server connection pane:** Select transport type (stdio, HTTP), customize command-line args and environment
- **Resources tab:** List all available resources, view metadata (MIME types, descriptions), inspect resource content, test subscriptions
- **Prompts tab:** Display available prompt templates, show arguments and descriptions, test prompts with custom arguments, preview generated messages
- **Tools tab:** List available tools, show tool schemas and descriptions, test tools with custom inputs, display execution results
- **Notifications pane:** View all logs recorded from the server, show notifications received from the server

**Development Workflow (Best Practices):**
1. Start: Launch Inspector with your server, verify basic connectivity, check capability negotiation
2. Iterative testing: Make server changes, rebuild, reconnect Inspector, test affected features, monitor messages
3. Test edge cases: Invalid inputs, missing prompt arguments, concurrent operations, verify error handling

---

### Lesson: Implementing a Client
**Skilljar URL (API course):** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287793
**Official docs:** https://modelcontextprotocol.io/quickstart/client

**Key Facts:**
- An MCP client bridges your application and MCP servers
- The client: connects to server, lists available tools, sends them to Claude, handles tool calls, returns results

**Python Client Structure:**
```python
import asyncio
from typing import Optional
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from anthropic import Anthropic
from dotenv import load_dotenv

class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.anthropic = Anthropic()
```

**Server Connection:**
```python
async def connect_to_server(self, server_script_path: str):
    is_python = server_script_path.endswith('.py')
    command = "python" if is_python else "node"
    server_params = StdioServerParameters(
        command=command, args=[server_script_path], env=None
    )
    stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
    self.stdio, self.write = stdio_transport
    self.session = await self.exit_stack.enter_async_context(
        ClientSession(self.stdio, self.write)
    )
    await self.session.initialize()
    response = await self.session.list_tools()
    tools = response.tools
```

**Query Processing Flow:**
1. List tools from MCP server: `await self.session.list_tools()`
2. Convert tool schemas for Claude API: `{"name": tool.name, "description": tool.description, "input_schema": tool.inputSchema}`
3. Send user query + tools to Claude: `self.anthropic.messages.create(model=..., tools=available_tools, messages=messages)`
4. When Claude returns `tool_use` block, execute via MCP: `await self.session.call_tool(tool_name, tool_args)`
5. Send tool result back to Claude with `tool_use_id` matching
6. Continue loop until Claude returns text (no more tool calls)

**Key Components:**
- `AsyncExitStack` for proper resource management
- `ClientSession` manages the MCP protocol session
- Supports both Python (.py) and Node.js (.js) servers
- Run with: `uv run client.py path/to/server.py`

---

### Lesson: Accessing Resources
**Skilljar URL (API course):** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287783

**Key Facts:**
- Resources are application-controlled (host app decides when to load), unlike tools (model-controlled)
- Client-side operations for resources:

**Listing resources:**
```python
resources = await session.list_resources()
# Returns resources with uri, name, description, mimeType
```

**Reading a resource:**
```python
from pydantic import AnyUrl
from mcp import types

resource_content = await session.read_resource(AnyUrl("greeting://World"))
content_block = resource_content.contents[0]
if isinstance(content_block, types.TextResourceContents):
    print(f"Resource content: {content_block.text}")
```

- Reading returns a `contents` array with `uri`, `mimeType`, and either `text` (string) or `blob` (base64)
- Direct resources have fixed URIs; templated resources use URI templates (RFC 6570) like `docs://documents/{doc_id}`
- Resources are discovered via `resources/list` (direct) and `resources/templates/list` (templated)
- The Anthropic SDK provides helper functions `mcpResourceToContent` and `mcpResourceToFile` to convert MCP resources for use with Claude API

---

### Lesson: Prompts in the Client
**Skilljar URL (API course):** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287786

**Key Facts:**
- Prompts are user-controlled (user selects which prompt to use)
- Client-side operations for prompts:

**Listing prompts:**
```python
prompts = await session.list_prompts()
# Returns prompts with name, description, and arguments
```

**Getting a specific prompt:**
```python
prompt = await session.get_prompt(
    "greet_user",
    arguments={"name": "Alice", "style": "friendly"}
)
# Returns messages array with role and content
print(prompt.messages[0].content)
```

- `list_prompts()` returns available prompts with their names, descriptions, and expected arguments
- `get_prompt(name, arguments)` retrieves a specific prompt with filled-in arguments
- Prompts return a list of messages (UserMessage, AssistantMessage, etc.) ready for the Claude API
- Session must be initialized first: `await session.initialize()`
- Supports pagination via cursor parameter for large prompt lists

---

### Lesson: MCP Review
**Skilljar URL (API course):** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287790

**Key Facts (Summary of MCP concepts):**
- MCP defines three core primitives with different control models:
  - **Tools:** Model-controlled — the LLM decides when to call them
  - **Resources:** Application-controlled — the host app decides when to load them
  - **Prompts:** User-controlled — the user selects which prompt to use
- MCP architecture: Client ↔ Server communication over transports (stdio for local, StreamableHTTP for remote)
- Server creation: `FastMCP("name")` + decorators (`@mcp.tool()`, `@mcp.resource()`, `@mcp.prompt()`)
- Client creation: `ClientSession` + transport + `session.initialize()`
- Testing: MCP Inspector for interactive debugging
- MCP shifts burden of tool creation from app developers to MCP server maintainers
- Anyone can create MCP servers; service providers often create official implementations
- MCP != tool use — MCP is about WHO creates and maintains tools

---

## COURSE 2: MCP Advanced Topics

### Full Course Structure
**Introduction:**
1. Introduction
2. Let's get started!

**Core MCP Features:**
3. Sampling
4. Sampling walkthrough
5. Log and progress notifications
6. Notifications walkthrough
7. Roots
8. Roots walkthrough
9. Survey

**Transports and Communication:**
10. JSON message types
11. The STDIO transport
12. The StreamableHTTP transport
13. StreamableHTTP in depth
14. State and the StreamableHTTP transport

**Assessment and Next Steps:**
15. Assessment on MCP concepts
16. Wrapping up

---

### Lesson: Sampling
**Official docs:** https://modelcontextprotocol.io/docs/concepts/sampling

**Key Facts:**
- Sampling allows MCP servers to request LLM completions/generations from clients
- Enables agentic behaviors: LLM calls occur *nested* inside other MCP server features
- Clients maintain control over model access, selection, and permissions — no server API keys needed
- Servers can request text, audio, or image-based interactions

**Human-in-the-Loop (CRITICAL):**
- There SHOULD always be a human in the loop with ability to deny sampling requests
- Applications SHOULD: provide UI to review requests, allow users to view/edit prompts, present responses for review

**Capability Declaration:**
```json
{
  "capabilities": {
    "sampling": {}
  }
}
```

**Request (server → client):**
```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [{"role": "user", "content": {"type": "text", "text": "..."}}],
    "modelPreferences": {
      "hints": [{"name": "claude-3-sonnet"}],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}
```

**Response:**
```json
{
  "result": {
    "role": "assistant",
    "content": {"type": "text", "text": "The capital of France is Paris."},
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}
```

**Model Preferences:**
- `hints`: Suggest specific models (treated as substrings, matched flexibly). Advisory only — clients make final selection
- `costPriority` (0-1): Higher = prefer cheaper models
- `speedPriority` (0-1): Higher = prefer faster models
- `intelligencePriority` (0-1): Higher = prefer more capable models
- Clients MAY map hints to equivalent models from different providers

**Message Content Types:** text, image (base64), audio (base64)

**Flow:** Server → Client request → Human review → LLM call → Response review → Return to server

---

### Lesson: Log and Progress Notifications
**Official docs:** https://modelcontextprotocol.io/specification/2025-03-26/basic/utilities/progress, logging spec

**Logging Key Facts:**
- Servers send structured log messages to clients via `notifications/message`
- Follows RFC 5424 syslog severity levels: debug, info, notice, warning, error, critical, alert, emergency
- Clients control verbosity with `logging/setLevel` request
- Server capability declaration: `"logging": {}`

**Log notification format:**
```json
{
  "method": "notifications/message",
  "params": {
    "level": "error",
    "logger": "database",
    "data": {
      "error": "Connection failed",
      "details": {"host": "localhost", "port": 5432}
    }
  }
}
```

- `level`: Severity level (required)
- `logger`: Optional name identifying the source component
- `data`: Arbitrary JSON-serializable data

**Progress Notifications Key Facts:**
- Optional tracking for long-running operations
- Either side can send progress notifications
- Receiver of a request includes `progressToken` in `_meta` to request progress updates

**Progress request with token:**
```json
{
  "method": "some_method",
  "params": {
    "_meta": {
      "progressToken": "abc123"
    }
  }
}
```

**Progress notification:**
```json
{
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50,
    "total": 100,
    "message": "Reticulating splines..."
  }
}
```

- `progressToken`: MUST be string or integer, MUST be unique across all active requests
- `progress`: MUST increase with each notification (even if total unknown). MAY be floating point.
- `total`: Optional. MAY be floating point.
- `message`: Optional human-readable progress information
- Receivers MAY choose not to send any progress notifications
- Progress notifications MUST stop after completion

---

### Lesson: Roots
**Official docs:** https://modelcontextprotocol.io/docs/concepts/roots

**Key Facts:**
- Roots define filesystem boundaries where servers can operate
- Clients expose roots to servers; servers request the list and receive change notifications
- A root has: `uri` (MUST be `file://` URI) and optional `name` (human-readable)

**Capability declaration:**
```json
{
  "capabilities": {
    "roots": {
      "listChanged": true
    }
  }
}
```

**Listing roots (server → client):**
```json
{"method": "roots/list"}
```
Response: `{"roots": [{"uri": "file:///home/user/projects/myproject", "name": "My Project"}]}`

**Change notifications (client → server):**
```json
{"method": "notifications/roots/list_changed"}
```
- Server then re-requests `roots/list` to get updated list

**Use cases:**
- Project directory boundaries
- Multiple repositories
- Workspace/project pickers in IDEs

**Security:**
- Clients MUST only expose roots with appropriate permissions
- Clients MUST validate all root URIs to prevent path traversal
- Servers SHOULD respect root boundaries during operations
- Clients SHOULD prompt users for consent before exposing roots

---

### Lesson: JSON Message Types

**Key Facts:**
- MCP uses JSON-RPC 2.0 for all message encoding
- Messages MUST be UTF-8 encoded
- Three message types:

**1. Requests:** Expect a response
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```
- MUST include a string or integer `id` (MUST NOT be null, unlike base JSON-RPC)

**2. Responses:** Reply to requests
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {...}
}
```
- MUST include same `id` as the request
- Either `result` OR `error` MUST be set (not both)
- Error format: `{"code": number, "message": string, "data?": unknown}`

**3. Notifications:** One-way, no reply expected
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {...}
}
```
- MUST NOT include an `id` field

---

### Lesson: The STDIO Transport

**Key Facts:**
- Client launches MCP server as a subprocess
- Server reads JSON-RPC messages from stdin, writes to stdout
- Messages delimited by newlines, MUST NOT contain embedded newlines
- Server MAY write UTF-8 strings to stderr for logging (clients MAY capture, forward, or ignore)
- Server MUST NOT write anything to stdout that is not a valid MCP message
- Client MUST NOT write anything to server's stdin that is not a valid MCP message
- Clients SHOULD support stdio whenever possible
- Best for: local servers, single-client scenarios

---

### Lesson: The StreamableHTTP Transport

**Key Facts:**
- Replaces the deprecated HTTP+SSE transport from protocol version 2024-11-05
- Server operates as independent process handling multiple client connections
- Uses HTTP POST (client → server) and optionally SSE (server → client streaming)
- Server provides a single MCP endpoint (e.g., `https://example.com/mcp`) supporting both POST and GET

**Client Sending (POST):**
- Client MUST use HTTP POST for all JSON-RPC messages
- Client MUST include `Accept` header listing both `application/json` and `text/event-stream`
- Body can be: single request/notification/response, or a JSON-RPC batch array
- For notifications/responses only: server returns 202 Accepted (no body)
- For requests: server returns either `application/json` (single response) or `text/event-stream` (SSE stream)

**Server SSE Streams (on POST response):**
- SSE stream SHOULD include one JSON-RPC response per request
- Server MAY send requests/notifications before the response (e.g., progress updates)
- Server SHOULD close SSE stream after all responses sent
- Disconnection SHOULD NOT be interpreted as cancellation — client SHOULD send explicit `CancelledNotification`

**Client Listening (GET):**
- Client MAY issue HTTP GET to MCP endpoint to open SSE stream for server-initiated messages
- Server returns `text/event-stream` or 405 Method Not Allowed
- Used for server-to-client communication without client first sending data

**Python SDK client connection:**
```python
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

async with streamable_http_client("http://localhost:8000/mcp") as (read_stream, write_stream, _):
    async with ClientSession(read_stream, write_stream) as session:
        await session.initialize()
```

---

### Lesson: StreamableHTTP in Depth

**Security Requirements:**
- Servers MUST validate `Origin` header on all incoming connections (prevent DNS rebinding attacks)
- When running locally, servers SHOULD bind only to localhost (127.0.0.1)
- Servers SHOULD implement proper authentication

**Multiple Connections:**
- Client MAY remain connected to multiple SSE streams simultaneously
- Server MUST send each message on only ONE stream (no broadcasting)

**Resumability and Redelivery:**
- Servers MAY attach `id` field to SSE events (must be globally unique within session)
- Client resumes by GET with `Last-Event-ID` header
- Server MAY replay missed messages from that stream
- Event IDs assigned per-stream as a cursor within that stream

---

### Lesson: State and the StreamableHTTP Transport (Session Management)

**Key Facts:**
- MCP "session" = logically related interactions beginning with initialization
- Server MAY assign session ID via `Mcp-Session-Id` header on `InitializeResult` response
- Session ID SHOULD be globally unique and cryptographically secure (e.g., UUID, JWT, cryptographic hash)
- Session ID MUST only contain visible ASCII characters (0x21 to 0x7E)
- Clients MUST include `Mcp-Session-Id` in all subsequent HTTP requests
- Servers MAY terminate sessions; MUST respond to terminated session IDs with HTTP 404
- On 404, clients MUST start new session with fresh `InitializeRequest`
- Clients SHOULD send HTTP DELETE to MCP endpoint to explicitly terminate sessions

**Backwards Compatibility (with old HTTP+SSE):**
- Servers: host both old SSE/POST endpoints and new MCP endpoint
- Clients: POST InitializeRequest first; if 4xx, fall back to GET for SSE endpoint event

---

## Python SDK Client Operations Summary

**All operations require initialized session:**
```python
await session.initialize()
```

| Operation | Code |
|-----------|------|
| List tools | `tools = await session.list_tools()` |
| Call tool | `result = await session.call_tool("add", arguments={"a": 5, "b": 3})` |
| List resources | `resources = await session.list_resources()` |
| Read resource | `content = await session.read_resource(AnyUrl("greeting://World"))` |
| List prompts | `prompts = await session.list_prompts()` |
| Get prompt | `prompt = await session.get_prompt("name", arguments={...})` |
| Set log level | `await session.set_logging_level("info")` |
| Send ping | `await session.send_ping()` |
| Notify roots changed | `await session.send_roots_list_changed()` |

**Display utilities:** `get_display_name()` retrieves human-readable names, prioritizing title over name.
**Logging callback:** Supply `logging_callback` to handle server log messages.
**Roots callback:** Implement `list_roots_callback` to expose client workspace directories.
