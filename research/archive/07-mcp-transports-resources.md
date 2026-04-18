# Research: MCP Transports & Resources
**Source:** https://modelcontextprotocol.io/docs/concepts/transports, https://modelcontextprotocol.io/docs/concepts/resources

## Transport Types
1. **stdio** — Local process, stdin/stdout communication
2. **Streamable HTTP** — HTTP POST/GET based (current standard, recommended for remote)
3. **HTTP+SSE** — **DEPRECATED** (from protocol version 2024-11-05), replaced by Streamable HTTP

## stdio Details
- Client launches server as subprocess
- Server reads JSON-RPC from stdin, writes to stdout
- Messages delimited by newlines
- Server MAY write to stderr for logging

## Streamable HTTP Details
- Server provides single MCP endpoint (e.g., `https://example.com/mcp`)
- Client sends JSON-RPC via HTTP POST
- Supports session management via `Mcp-Session-Id` header

## Direct Resources vs Resource Templates

### Direct Resources (fixed URI)
- Discovered via `resources/list`
- Fixed `uri` (e.g., `file:///project/src/main.rs`)
- Fields: `uri` (required), `name` (required), `title`, `description`, `mimeType`, `size`

### Resource Templates (parameterized URI)
- Discovered via `resources/templates/list`
- Use URI templates per RFC 6570
- Fields: `uriTemplate` (required, e.g., `file:///{path}`), `name` (required), `title`, `description`, `mimeType`
- Arguments may be auto-completed via completion API

## URI Schemes
- `https://` — Web resources
- `file://` — Filesystem resources
- `git://` — Git integration
- Custom schemes allowed (RFC 3986 compliant)

## Resource Reading
- Method: `resources/read` with `uri` parameter
- Response `contents` array with `uri`, `mimeType`, and either `text` (string) or `blob` (base64)

## MCP Three Primitives (Control Model)
- **Tools**: Model-controlled (LLM decides when to call)
- **Resources**: Application-controlled (host app decides when to load)
- **Prompts**: User-controlled (user selects)
