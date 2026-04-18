# Research: MCP Configuration in Claude Code
**Source:** https://docs.anthropic.com/en/docs/claude-code/mcp

## MCP Scope Precedence (highest to lowest)
1. **Local** (highest)
2. **Project**
3. **User**
4. **Plugin-provided**
5. **claude.ai connectors** (lowest)

Named scopes match duplicates by **name**. Plugins/connectors match by **endpoint**.

## Scope Storage Locations

| Scope | Loads In | Shared | Stored In |
|---|---|---|---|
| Local (default) | Current project only | No | `~/.claude.json` (under project path) |
| Project | Current project only | Yes, via VCS | `.mcp.json` in project root |
| User | All projects | No | `~/.claude.json` |

## Env Var Expansion Syntax
- `${VAR}` — direct expansion (fails if not set)
- `${VAR:-default}` — expansion with default value

## 5 Locations Where Env Vars Are Expanded
1. `command` — server executable path
2. `args` — command-line arguments
3. `env` — environment variables passed to server
4. `url` — for HTTP server types
5. `headers` — for HTTP authentication

If required var not set and no default → Claude Code fails to parse config.

## headersHelper
- Runs a command that outputs JSON key-value pairs to stdout
- Used for dynamic authentication tokens
- 10-second timeout
- Runs fresh on each connection (no caching)
- Dynamic headers override static headers with same name

## MCP_TIMEOUT
- Configures MCP server **startup timeout**
- Unit: milliseconds
- Example: `MCP_TIMEOUT=10000 claude` (10 seconds)

## MAX_MCP_OUTPUT_TOKENS
- Warning at **10,000 tokens** by default
- Configurable: `MAX_MCP_OUTPUT_TOKENS=50000`

## Transport Types (4)
1. **stdio** — local process
2. **http** (streamable-http) — recommended for remote
3. **sse** — **deprecated**, use HTTP instead
4. **ws** (WebSocket) — for inline definitions

## MCP Tool Naming
- Pattern: `mcp__<server>__<action>`
- Example: `mcp__playwright__browser_screenshot`

## Install Scopes
- `--scope local` (default): stored in `~/.claude.json` under project path
- `--scope project`: stored in `.mcp.json`
- `--scope user`: stored in `~/.claude.json`
