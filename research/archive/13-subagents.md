# Research: Subagents in Claude Code
**Source:** https://docs.anthropic.com/en/docs/claude-code/subagents

## AgentDefinition Frontmatter Fields (15 fields)

| Field | Required | Description |
|---|---|---|
| `name` | **Yes** | Unique identifier, lowercase letters and hyphens |
| `description` | **Yes** | When Claude should delegate to this subagent |
| `tools` | No | Tools subagent can use; **inherits all if omitted** |
| `disallowedTools` | No | Tools to deny from inherited/specified list |
| `model` | No | sonnet, opus, haiku, full ID, or `inherit` (default) |
| `permissionMode` | No | default, acceptEdits, auto, dontAsk, bypassPermissions, plan |
| `maxTurns` | No | Max agentic turns before stop |
| `skills` | No | Skills preloaded into subagent context |
| `mcpServers` | No | MCP servers (references or inline) |
| `hooks` | No | Lifecycle hooks scoped to subagent |
| `memory` | No | Persistent memory scope: user, project, local |
| `background` | No | `true` for background task; default false |
| `effort` | No | low, medium, high, max |
| `isolation` | No | `worktree` for isolated git worktree |
| `color` | No | Display color |

Only `name` and `description` are required.

## Task vs Agent Rename
- In version **2.1.63**, Task tool renamed to **Agent**
- Existing `Task(...)` references still work as aliases

## Communication Channel
- Subagents communicate with parent **via prompt only**
- Claude writes the task prompt based on user's request
- Subagent works independently and returns results (summary)
- Subagents receive only their system prompt + basic env details, NOT full Claude Code system prompt

## Permission Inheritance
- Subagents **inherit** permission context from main conversation
- Can override via `permissionMode` field, with exceptions:
  - `bypassPermissions` in parent: takes precedence, cannot be overridden
  - `auto` mode in parent: subagent inherits auto mode, frontmatter ignored
- Background subagents: permissions pre-approved before launch; auto-deny anything not approved

## 3 Creation Methods
1. **File-based**: `.claude/agents/` (project) or `~/.claude/agents/` (user) or managed settings
2. **CLI flag** (`--agents`): JSON passed when launching; session-only
3. **Interactive** (`/agents` command): guided setup

## Tool Inheritance
- `tools` omitted → **inherits all tools** including MCP
- If both `tools` and `disallowedTools` set: disallowed applied first, then tools resolved
- If `Agent` not in tools: subagent cannot spawn subagents
- **Subagents cannot spawn other subagents** (no nesting)

## Scope Priority
1. Managed settings (highest)
2. `--agents` CLI flag
3. `.claude/agents/` (project)
4. `~/.claude/agents/` (user)
5. Plugin agents (lowest)

## Built-in Subagents
- **Explore**: Haiku model, read-only tools, quick/medium/very thorough
- **Plan**: inherits model, read-only tools
- **general-purpose**: inherits model, all tools
