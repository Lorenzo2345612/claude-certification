# Claude Agent SDK - Official Documentation Reference

> Source: https://code.claude.com/docs/en/agent-sdk/ (21 pages)
> Extracted: 2026-04-17
> Note: The Claude Code SDK was renamed to the Claude Agent SDK.

---

## 1. OVERVIEW

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md

### What It Is
The Claude Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. Agents autonomously read files, run commands, search the web, edit code, and more.

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Get started

### Installation
- **TypeScript**: `npm install @anthropic-ai/claude-agent-sdk`
- **Python**: `pip install claude-agent-sdk`

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Get started / Set your API key

### Authentication
- Set `ANTHROPIC_API_KEY` environment variable
- **Amazon Bedrock**: set `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials
- **Google Vertex AI**: set `CLAUDE_CODE_USE_VERTEX=1` + Google Cloud credentials
- **Microsoft Azure**: set `CLAUDE_CODE_USE_FOUNDRY=1` + Azure credentials
- Anthropic does NOT allow third-party developers to offer claude.ai login or rate limits for their products (unless previously approved)

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Get started / Run your first agent

### Core Entry Point
```python
# Python
from claude_agent_sdk import query, ClaudeAgentOptions
async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    print(message)
```
```typescript
// TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";
for await (const message of query({
  prompt: "Find and fix the bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Capabilities / Built-in tools

### Built-in Tools

| Tool | What It Does |
|------|-------------|
| **Read** | Read any file in the working directory |
| **Write** | Create new files |
| **Edit** | Make precise edits to existing files |
| **Bash** | Run terminal commands, scripts, git operations |
| **Monitor** | Watch a background script and react to each output line as an event |
| **Glob** | Find files by pattern (`**/*.ts`, `src/**/*.py`) |
| **Grep** | Search file contents with regex |
| **WebSearch** | Search the web for current information |
| **WebFetch** | Fetch and parse web page content |
| **AskUserQuestion** | Ask the user clarifying questions with multiple choice options |
| **ToolSearch** | Dynamically find and load tools on-demand |
| **Agent** | Spawn subagents |
| **Skill** | Invoke skills |
| **TodoWrite** | Track tasks |

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Capabilities / Claude Code features

### Claude Code Features Loaded by SDK
| Feature | Description | Location |
|---------|-------------|----------|
| Skills | Specialized capabilities defined in Markdown | `.claude/skills/*/SKILL.md` |
| Slash commands | Custom commands for common tasks | `.claude/commands/*.md` |
| Memory | Project context and instructions | `CLAUDE.md` or `.claude/CLAUDE.md` |
| Plugins | Extend with custom commands, agents, and MCP servers | Programmatic via `plugins` option |

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Compare the Agent SDK to other Claude tools

### SDK vs Client SDK vs CLI
- **Client SDK**: You implement the tool loop manually
- **Agent SDK**: Claude handles tools autonomously (built-in tool execution)
- **CLI**: Interactive development, one-off tasks
- **SDK**: CI/CD pipelines, custom applications, production automation

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Note at top

### Model Compatibility
- Opus 4.7 (`claude-opus-4-7`) requires Agent SDK v0.2.111 or later
- If `thinking.type.enabled` error appears, upgrade SDK (Opus 4.7 uses `thinking.type.adaptive`)

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- Branding guidelines

### Branding Guidelines
- Allowed: "Claude Agent", "Claude", "{YourName} Powered by Claude"
- NOT allowed: "Claude Code" or "Claude Code Agent" or Claude Code-branded ASCII art

> **Source:** https://code.claude.com/docs/en/agent-sdk/overview.md -- License and terms

### License
Governed by Anthropic's Commercial Terms of Service.

---

## 2. QUICKSTART

> **Source:** https://code.claude.com/docs/en/agent-sdk/quickstart.md

### Prerequisites
- Node.js 18+ or Python 3.10+
- Anthropic API key

> **Source:** https://code.claude.com/docs/en/agent-sdk/quickstart.md -- Key concepts

### Permission Modes Quick Reference

| Mode | Behavior | Use Case |
|------|----------|----------|
| `acceptEdits` | Auto-approves file edits and common filesystem commands | Trusted development workflows |
| `dontAsk` | Denies anything not in `allowedTools` | Locked-down headless agents |
| `auto` (TS only) | Model classifier approves/denies each tool call | Autonomous agents with safety guardrails |
| `bypassPermissions` | Runs every tool without prompts | Sandboxed CI, fully trusted environments |
| `default` | Requires `canUseTool` callback for approval | Custom approval flows |

> **Source:** https://code.claude.com/docs/en/agent-sdk/quickstart.md -- Key concepts

### Tool Capability Levels

| Tools | What the agent can do |
|-------|----------------------|
| `Read`, `Glob`, `Grep` | Read-only analysis |
| `Read`, `Edit`, `Glob` | Analyze and modify code |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Full automation |

> **Source:** https://code.claude.com/docs/en/agent-sdk/quickstart.md -- Build an agent that finds and fixes bugs

### Key `query()` Components
1. **`query`**: Main entry point creating the agentic loop; returns async iterator
2. **`prompt`**: What you want Claude to do
3. **`options`**: Configuration (allowedTools, permissionMode, systemPrompt, mcpServers, etc.)

### Message Loop
The `async for` loop keeps running as Claude thinks, calls tools, observes results, and decides next steps. Each iteration yields a message: reasoning, tool call, tool result, or final outcome. The loop ends when Claude finishes or hits an error.

> **Source:** https://code.claude.com/docs/en/agent-sdk/quickstart.md -- Troubleshooting

### Troubleshooting
- Opus 4.7 `thinking.type.enabled` error: upgrade to Agent SDK v0.2.111 or later

---

## 3. AGENT LOOP

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md

### Loop Lifecycle

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- The loop at a glance

1. **Receive prompt** - SDK yields `SystemMessage` with subtype `"init"` containing session metadata
2. **Evaluate and respond** - Claude responds with text and/or tool call requests; SDK yields `AssistantMessage`
3. **Execute tools** - SDK runs each tool, collects results. Hooks can intercept/modify/block
4. **Repeat** - Steps 2-3 cycle; each full cycle = one turn
5. **Return result** - Final `AssistantMessage` (no tool calls) + `ResultMessage` with cost/usage/session_id

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Turns and messages

### Turns
A turn = one round trip: Claude produces output with tool calls, SDK executes, results feed back. Turns continue until Claude produces output with NO tool calls.

`max_turns` / `maxTurns` counts tool-use turns only.

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Message types

### Message Types (5 core)

| Type | Description |
|------|-------------|
| **SystemMessage** | Session lifecycle events. Subtypes: `"init"` (first message), `"compact_boundary"` (after compaction). In TS, compact boundary is its own `SDKCompactBoundaryMessage` type |
| **AssistantMessage** | After each Claude response. Contains text + tool call blocks. In TS, content at `message.message.content` |
| **UserMessage** | After tool execution with results. Also for user inputs mid-loop |
| **StreamEvent** | Only with partial messages enabled. Raw API streaming events |
| **ResultMessage** | End of agent loop. Contains result text, token usage, cost, session_id. A few trailing events (e.g. `prompt_suggestion`) can arrive after it -- iterate stream to completion |

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Handle messages

### Message Handling by SDK
- **Python**: `isinstance(message, ResultMessage)` against imported classes
- **TypeScript**: Check `message.type` string (e.g., `message.type === "result"`). Content at `message.message.content` not `message.content`

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Tool execution / Parallel tool execution

### Tool Execution Details

**Parallel execution**: Read-only tools (`Read`, `Glob`, `Grep`, read-only MCP tools) run concurrently. State-modifying tools (`Edit`, `Write`, `Bash`) run sequentially. Custom tools default to sequential; mark `readOnlyHint: true` for parallel.

**Tool denied**: Claude receives a rejection message and typically tries a different approach.

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Control how the loop runs / Turns and budget

### Control Options

| Option | Default |
|--------|---------|
| `max_turns` / `maxTurns` | No limit |
| `max_budget_usd` / `maxBudgetUsd` | No limit |

When hit, SDK returns `ResultMessage` with `error_max_turns` or `error_max_budget_usd`.

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Control how the loop runs / Effort level

### Effort Levels

| Level | Behavior | Good For |
|-------|----------|----------|
| `"low"` | Minimal reasoning, fast | File lookups, listing directories |
| `"medium"` | Balanced | Routine edits, standard tasks |
| `"high"` | Thorough analysis | Refactors, debugging |
| `"xhigh"` | Extended reasoning depth | Coding/agentic tasks; recommended on Opus 4.7 |
| `"max"` | Maximum reasoning depth | Multi-step deep analysis |

- Python SDK: leaves unset by default (model's default behavior)
- TypeScript SDK: defaults to `"high"`
- `effort` is independent of extended thinking
- Set at top-level `query()` options, NOT per-subagent

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Control how the loop runs / Permission mode

### Permission Modes (Full Detail)

| Mode | Behavior |
|------|----------|
| `"default"` | Unmatched tools trigger approval callback; no callback = deny |
| `"acceptEdits"` | Auto-approves file edits + filesystem commands (mkdir, touch, rm, rmdir, mv, cp, sed) |
| `"plan"` | No tool execution; Claude produces plan for review |
| `"dontAsk"` | Never prompts. Pre-approved tools run, everything else denied |
| `"auto"` (TS only) | Model classifier approves/denies each tool call |
| `"bypassPermissions"` | Runs all allowed tools without asking. Cannot be used as root on Unix |

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Control how the loop runs / Model

### Model Selection
If you don't set `model`, the SDK uses Claude Code's default (depends on auth method and subscription). Set explicitly (e.g., `model="claude-sonnet-4-6"`) to pin a specific model.

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- The context window

### Context Window
- Does NOT reset between turns within a session
- Everything accumulates: system prompt, tool definitions, conversation history, tool I/O
- Repeated content (system prompt, tool defs, CLAUDE.md) is automatically prompt-cached

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- What consumes context

**What consumes context:**
| Source | Impact |
|--------|--------|
| System prompt | Small fixed cost, always present |
| CLAUDE.md files | Full content every request (but prompt-cached) |
| Tool definitions | Each tool adds schema |
| Conversation history | Grows each turn |
| Skill descriptions | Short summaries; full only when invoked |

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Automatic compaction

### Automatic Compaction
When context approaches limit, SDK summarizes older history. Emits `SystemMessage` with `subtype: "compact_boundary"` (Python) or `SDKCompactBoundaryMessage` (TypeScript).

**Customize compaction:**
- Summarization instructions in CLAUDE.md (compactor reads it)
- `PreCompact` hook (archive transcript before summarizing)
- Manual: send `/compact` as prompt string

**Important**: Persistent rules belong in CLAUDE.md (re-injected every request), not initial prompt (may be lost on compaction).

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Keep context efficient

### Context Efficiency Tips
- Use subagents for subtasks (fresh conversation, only final response returns)
- Be selective with tools (every tool def takes context)
- Watch MCP server costs (all tool schemas loaded every request)
- Use `ToolSearch` for on-demand loading
- Use lower effort for routine tasks

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Handle the result

### Result Message Subtypes

| Subtype | What Happened | `result` field? |
|---------|---------------|----------------|
| `success` | Finished normally | Yes |
| `error_max_turns` | Hit maxTurns limit | No |
| `error_max_budget_usd` | Hit maxBudgetUsd limit | No |
| `error_during_execution` | Error interrupted loop | No |
| `error_max_structured_output_retries` | Structured output validation failed | No |

All subtypes carry `total_cost_usd`, `usage`, `num_turns`, `session_id`. In Python, `total_cost_usd` and `usage` may be `None`.

**`stop_reason` field**: `end_turn` (finished normally), `max_tokens` (hit output token limit), `refusal` (model declined).

> **Source:** https://code.claude.com/docs/en/agent-sdk/agent-loop.md -- Hooks

### Hooks in the Loop

| Hook | When | Common Uses |
|------|------|-------------|
| `PreToolUse` | Before tool executes | Validate inputs, block dangerous commands |
| `PostToolUse` | After tool returns | Audit outputs, trigger side effects |
| `UserPromptSubmit` | When prompt sent | Inject additional context |
| `Stop` | Agent finishes | Validate result, save state |
| `SubagentStart/Stop` | Subagent lifecycle | Track parallel tasks |
| `PreCompact` | Before compaction | Archive full transcript |

Hooks run in your application process, NOT in agent context (no context consumption). Hooks can short-circuit the loop.

---

## 4. CUSTOM TOOLS

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md

### Architecture

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Create a custom tool

Custom tools use the SDK's **in-process MCP server** (not a separate process).

### Defining a Tool (4 parts)
1. **Name**: Unique identifier
2. **Description**: Claude reads this to decide when to call it
3. **Input schema**: TS = Zod schema; Python = dict mapping or JSON Schema
4. **Handler**: Async function returning `{ content: [...], isError?: bool }`

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Weather tool example

### Tool Registration Pattern
```python
# Python
@tool("name", "description", {"param": type})
async def my_tool(args: dict) -> dict:
    return {"content": [{"type": "text", "text": "result"}]}

server = create_sdk_mcp_server(name="myserver", version="1.0.0", tools=[my_tool])
```
```typescript
// TypeScript
const myTool = tool("name", "description", { param: z.string() },
  async (args) => ({ content: [{ type: "text", text: "result" }] })
);
const server = createSdkMcpServer({ name: "myserver", version: "1.0.0", tools: [myTool] });
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Control tool access / Tool name format

### Tool Naming Convention
Pattern: `mcp__{server_name}__{tool_name}`
Example: `mcp__weather__get_temperature`
Wildcard: `mcp__weather__*` covers all tools from server.

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Control tool access / Configure allowed tools

### `tools` vs `allowedTools` vs `disallowedTools`

| Option | Layer | Effect |
|--------|-------|--------|
| `tools: ["Read", "Grep"]` | Availability | Only listed built-ins in context. Unlisted removed. MCP unaffected |
| `tools: []` | Availability | All built-ins removed. Only MCP tools |
| `allowedTools` | Permission | Listed tools run without prompt. Unlisted still available but need permission |
| `disallowedTools` | Permission | Every call denied. Tool stays in context (Claude may waste a turn) |

**Prefer `tools` over `disallowedTools`** to remove tools from context entirely.

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Add tool annotations

### Tool Annotations

| Field | Default | Meaning |
|-------|---------|---------|
| `readOnlyHint` | `false` | No side effects; enables parallel execution |
| `destructiveHint` | `true` | May perform destructive updates (informational) |
| `idempotentHint` | `false` | Repeated calls = no additional effect (informational) |
| `openWorldHint` | `true` | Reaches systems outside your process (informational) |

Annotations are metadata, not enforcement.

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Handle errors

### Error Handling
- **Uncaught exception**: Agent loop STOPS. Claude never sees the error
- **Return `isError: true`**: Agent loop CONTINUES. Claude sees error and can retry/adapt

> **Source:** https://code.claude.com/docs/en/agent-sdk/custom-tools.md -- Return images and resources

### Returning Non-Text Content
**Images**: `{ type: "image", data: "<base64>", mimeType: "image/png" }` (no URL field; fetch and encode in handler)
**Resources**: `{ type: "resource", resource: { uri: "file:///...", text: "...", mimeType: "..." } }` (URI is a label, not a path the SDK reads)

---

## 5. HOOKS

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md

### How Hooks Work

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- How hooks work

1. Event fires (tool about to be called, session ends, etc.)
2. SDK collects registered hooks for that event
3. Matchers filter which hooks run (regex against tool name)
4. Callback receives input (tool name, args, session_id, etc.)
5. Callback returns decision (allow, deny, modify, inject context)

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Available hooks

### Available Hook Events

| Hook | Python | TypeScript | Trigger |
|------|--------|-----------|---------|
| `PreToolUse` | Yes | Yes | Before tool executes (can block/modify) |
| `PostToolUse` | Yes | Yes | After tool returns result |
| `PostToolUseFailure` | Yes | Yes | After tool execution failure |
| `UserPromptSubmit` | Yes | Yes | User prompt submission |
| `Stop` | Yes | Yes | Agent execution stop |
| `SubagentStart` | Yes | Yes | Subagent initialization |
| `SubagentStop` | Yes | Yes | Subagent completion |
| `PreCompact` | Yes | Yes | Conversation compaction |
| `PermissionRequest` | Yes | Yes | Permission dialog would display |
| `Notification` | Yes | Yes | Agent status messages |
| `SessionStart` | No | Yes | Session initialization |
| `SessionEnd` | No | Yes | Session termination |
| `Setup` | No | Yes | Session setup/maintenance |
| `TeammateIdle` | No | Yes | Teammate becomes idle |
| `TaskCompleted` | No | Yes | Background task completes |
| `ConfigChange` | No | Yes | Configuration file changes |
| `WorktreeCreate` | No | Yes | Git worktree created |
| `WorktreeRemove` | No | Yes | Git worktree removed |

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Configure hooks / Matchers

### Matcher Configuration
- `matcher` field: regex pattern matched against tool name (for tool hooks)
- Omit matcher = runs for every event of that type
- MCP tool naming for matchers: `mcp__<server>__<action>`
- Default timeout: 60 seconds

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Configure hooks / Callback functions

### Callback Signature
Three arguments: `input_data`, `tool_use_id` (str|None), `context` (signal in TS)

All hook inputs share: `session_id`, `cwd`, `hook_event_name`.
`agent_id` and `agent_type` populated when inside a subagent.

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Configure hooks / Callback functions / Outputs

### Callback Return Fields
- **Top-level**: `systemMessage` (inject into conversation visible to model), `continue` / `continue_` (keep running)
- **`hookSpecificOutput`**: `permissionDecision` ("allow"/"deny"/"ask"), `permissionDecisionReason`, `updatedInput`, `additionalContext` (PostToolUse)
- Return `{}` to allow without changes

### Priority Rules
**deny > ask > allow** - If any hook returns deny, operation is blocked regardless of other hooks.

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Configure hooks / Callback functions / Asynchronous output

### Async Output
Return `{"async_": True, "asyncTimeout": 30000}` for fire-and-forget (Python uses `async_`). Agent continues without waiting. Cannot block/modify operations.

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Examples / Modify tool input

### Key Hook Patterns
- **`updatedInput`** requires `permissionDecision: 'allow'` and must be inside `hookSpecificOutput`
- **`hookEventName`** must be included in `hookSpecificOutput`
- Hooks run in your process, NOT in agent context (no context consumption)
- Hooks can short-circuit: PreToolUse reject prevents execution

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Fix common issues / Session hooks not available in Python

### Python Limitation
`SessionStart`/`SessionEnd` only available as shell command hooks in settings.json (not callback hooks in Python SDK).

> **Source:** https://code.claude.com/docs/en/agent-sdk/hooks.md -- Examples / Forward notifications to Slack

### Notification Types
Notifications fire for: `permission_prompt` (needs permission), `idle_prompt` (waiting for input), `auth_success` (auth completed), `elicitation_dialog` (prompting user). Each includes `message` and optionally `title`.

---

## 6. MCP (Model Context Protocol)

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md

### Transport Types

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- Transport types

1. **stdio**: Local processes via stdin/stdout (`command` + `args` + optional `env`)
2. **HTTP/SSE**: Cloud-hosted servers (`type: "http"` or `"sse"`, `url`, optional `headers`)
3. **SDK MCP servers**: In-process custom tools (see Custom Tools section)

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- Add an MCP server

### Configuration
- **In code**: `mcpServers` option in `query()`
- **Config file**: `.mcp.json` at project root (loaded when `"project"` setting source enabled)

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- Allow MCP tools

### Allowing MCP Tools
- Tools REQUIRE explicit permission via `allowedTools`
- `permissionMode: "acceptEdits"` does NOT auto-approve MCP tools
- `permissionMode: "bypassPermissions"` does auto-approve MCP tools (too broad)
- Use wildcard in `allowedTools`: `"mcp__github__*"`

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- MCP tool search

### Tool Search for MCP
Enabled by default. Withholds tool definitions from context; loads on demand. See Tool Search section.

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- Authentication

### Authentication
- stdio servers: pass via `env` field
- HTTP/SSE: pass via `headers` field
- `.mcp.json`: `${ENV_VAR}` syntax expands at runtime
- OAuth2: SDK doesn't handle flows; pass access tokens via headers after completing OAuth

> **Source:** https://code.claude.com/docs/en/agent-sdk/mcp.md -- Error handling

### Error Handling
Check `system` message with subtype `init` for MCP server connection status. MCP SDK default connection timeout: 60 seconds.

---

## 7. PERMISSIONS

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md

### Evaluation Order

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md -- How permissions are evaluated

1. **Hooks** - can allow, deny, or continue
2. **Deny rules** - `disallowed_tools` + settings.json. If match, BLOCKED (even in bypassPermissions)
3. **Permission mode** - bypassPermissions approves, acceptEdits approves file ops, others fall through
4. **Allow rules** - `allowed_tools` + settings.json. If match, APPROVED
5. **canUseTool callback** - if not resolved. In dontAsk mode, skipped (denied)

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md -- Allow and deny rules

### Critical Warning
**`allowed_tools` does NOT constrain `bypassPermissions`**. Setting `allowed_tools=["Read"]` alongside `bypassPermissions` still approves EVERY tool. Use `disallowed_tools` to block specific tools in bypassPermissions.

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md -- Permission modes / Set permission mode

### Dynamic Permission Mode
Call `set_permission_mode()` (Python) / `setPermissionMode()` (TypeScript) mid-session to change mode. Takes effect immediately for all subsequent tool requests.

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md -- Permission modes / Mode details / Accept edits mode

### acceptEdits Mode Details
Auto-approves:
- File edits (Edit, Write tools)
- Filesystem commands: `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed`
- Only for paths inside working directory or `additionalDirectories`

> **Source:** https://code.claude.com/docs/en/agent-sdk/permissions.md -- Permission modes / Available modes (Warning)

### Subagent Permission Inheritance
When parent uses `bypassPermissions`, `acceptEdits`, or `auto`, ALL subagents inherit that mode and it CANNOT be overridden per subagent.

---

## 8. SESSIONS

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md

### Session Types

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Choose an approach

| Scenario | Approach |
|----------|----------|
| One-shot task | Single `query()` call |
| Multi-turn chat (one process) | `ClaudeSDKClient` (Python) or `continue: true` (TS) |
| Resume after process restart | `continue_conversation=True` (Python) / `continue: true` (TS) |
| Resume specific past session | Capture session ID, pass to `resume` |
| Try alternative approach | `fork` the session |
| Stateless (no disk writes, TS only) | `persistSession: false` |

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Choose an approach / Continue, resume, and fork

### Continue vs Resume vs Fork
- **Continue**: Finds most recent session in current directory. No ID tracking.
- **Resume**: Takes specific session ID. Required for multiple sessions / non-most-recent.
- **Fork**: Creates new session with copy of original's history. Original unchanged.

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Automatic session management / Python: ClaudeSDKClient

### Python: ClaudeSDKClient
Handles session IDs internally. Each `client.query()` automatically continues same session.
```python
async with ClaudeSDKClient(options=options) as client:
    await client.query("Analyze the auth module")
    async for message in client.receive_response():
        print_response(message)
    await client.query("Now refactor it")  # Same session
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Automatic session management / TypeScript: continue: true

### TypeScript: `continue: true`
No session-holding client object. Pass `continue: true` on subsequent `query()` calls.

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Use session options with query() / Resume by ID

### Resume by ID
Common reasons: follow up on completed task, recover from error_max_turns/error_max_budget_usd, restart process.

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Use session options with query() / Fork to explore alternatives

### Fork
Creates new session with copy of original's history. Two independent session IDs.
```python
options=ClaudeAgentOptions(resume=session_id, fork_session=True)
```
**Fork branches conversation, NOT filesystem.** File changes are real.

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Use session options with query() / Resume by ID (Tip)

### Session Storage
Sessions stored at `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`
- `<encoded-cwd>` = absolute path with non-alphanumeric chars replaced by `-`
- `cwd` must match for resume to work

> **Source:** https://code.claude.com/docs/en/agent-sdk/sessions.md -- Resume across hosts

### Session Management Functions
- `list_sessions()` / `listSessions()` - enumerate sessions on disk
- `get_session_messages()` / `getSessionMessages()` - read messages
- `get_session_info()` / `getSessionInfo()` - lookup individual session
- `rename_session()` / `renameSession()` - set human-readable title
- `tag_session()` / `tagSession()` - organize by tag

### Resume Across Hosts
Session files are local to machine. Options: move session file to same path on new host (cwd must match), or capture results as application state for fresh session.

---

## 9. SUBAGENTS

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md

### Three Ways to Create

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Overview

1. **Programmatic**: `agents` parameter in `query()` options (recommended for SDK)
2. **Filesystem**: Markdown files in `.claude/agents/` directories
3. **Built-in**: `general-purpose` subagent via Agent tool (no definition needed)

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Benefits of using subagents

### Benefits
- **Context isolation**: Fresh conversation per subagent; only final message returns
- **Parallelization**: Multiple subagents run concurrently
- **Specialized instructions**: Tailored system prompts
- **Tool restrictions**: Limited tool access

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Creating subagents / AgentDefinition configuration

### AgentDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | When to use this agent (Claude reads this) |
| `prompt` | string | Yes | System prompt for the agent |
| `tools` | string[] | No | Allowed tools (inherits all if omitted) |
| `model` | `'sonnet'|'opus'|'haiku'|'inherit'` | No | Model override |
| `skills` | string[] | No | Available skill names |
| `memory` | `'user'|'project'|'local'` | No | Memory source (Python only) |
| `mcpServers` | (string|object)[] | No | MCP servers by name or inline config |

TypeScript additionally supports: `disallowedTools`, `maxTurns`, `criticalSystemReminder_EXPERIMENTAL`.

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- What subagents inherit

### What Subagents Inherit

| Receives | Does NOT Receive |
|----------|-----------------|
| Own system prompt + Agent tool's prompt | Parent's conversation history or tool results |
| Project CLAUDE.md (via settingSources) | Skills (unless listed in AgentDefinition.skills) |
| Tool definitions (inherited or subset) | Parent's system prompt |

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Creating subagents / AgentDefinition configuration (Note)

### Key Rules
- **Subagents CANNOT spawn their own subagents** (don't include `Agent` in subagent's tools)
- Must include `Agent` in parent's `allowedTools` for subagent invocation
- Programmatic agents take precedence over filesystem-based with same name
- `parent_tool_use_id` field on messages identifies subagent context
- Tool name renamed from `"Task"` to `"Agent"` in Claude Code v2.1.63

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Resuming subagents

### Resuming Subagents
Capture session_id + agent_id. Must resume same session. Transcripts persist independently (separate files, not affected by main compaction). Cleanup after `cleanupPeriodDays` (default: 30 days).

> **Source:** https://code.claude.com/docs/en/agent-sdk/subagents.md -- Troubleshooting / Windows

### Windows Limitation
Long prompts may fail due to command line length limits (8191 chars).

---

## 10. STRUCTURED OUTPUTS

> **Source:** https://code.claude.com/docs/en/agent-sdk/structured-outputs.md

### Configuration

> **Source:** https://code.claude.com/docs/en/agent-sdk/structured-outputs.md -- Quick start

```python
output_format={"type": "json_schema", "schema": schema_dict}
```
```typescript
outputFormat: { type: "json_schema", schema: schemaObject }
```

### How It Works
- Agent uses tools normally, then returns validated JSON matching schema
- SDK validates against schema, re-prompts on mismatch
- If validation fails after retry limit: `error_max_structured_output_retries`
- Result in `message.structured_output` field

> **Source:** https://code.claude.com/docs/en/agent-sdk/structured-outputs.md -- Type-safe schemas with Zod and Pydantic

### Type-Safe Schemas
- **TypeScript**: Zod schemas with `z.toJSONSchema()` for conversion, `safeParse()` for validation
- **Python**: Pydantic models with `.model_json_schema()` for conversion, `model_validate()` for validation

> **Source:** https://code.claude.com/docs/en/agent-sdk/structured-outputs.md -- Output format configuration

### Supported JSON Schema Features
All basic types (object, array, string, number, boolean, null), `enum`, `const`, `required`, nested objects, `$ref` definitions.

---

## 11. STREAMING OUTPUT

> **Source:** https://code.claude.com/docs/en/agent-sdk/streaming-output.md

### Enable Streaming

> **Source:** https://code.claude.com/docs/en/agent-sdk/streaming-output.md -- Enable streaming output

Set `include_partial_messages=True` (Python) / `includePartialMessages: true` (TypeScript)

### StreamEvent Structure
```python
@dataclass
class StreamEvent:
    uuid: str
    session_id: str
    event: dict[str, Any]  # Raw Claude API stream event
    parent_tool_use_id: str | None
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/streaming-output.md -- StreamEvent reference

### Event Types

| Event Type | Description |
|-----------|-------------|
| `message_start` | Start of new message |
| `content_block_start` | Start of text or tool_use block |
| `content_block_delta` | Incremental update (text_delta or input_json_delta) |
| `content_block_stop` | End of content block |
| `message_delta` | Message-level updates (stop reason, usage) |
| `message_stop` | End of message |

> **Source:** https://code.claude.com/docs/en/agent-sdk/streaming-output.md -- Message flow

### Message Flow
```
StreamEvent (message_start)
StreamEvent (content_block_start) - text block
StreamEvent (content_block_delta) - text chunks...
StreamEvent (content_block_stop)
AssistantMessage - complete message
... tool executes ...
ResultMessage - final result
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/streaming-output.md -- Known limitations

### Limitations
- **Extended thinking** (`maxThinkingTokens` set): StreamEvent messages NOT emitted
- **Structured output**: JSON only in final `ResultMessage.structured_output`, not as deltas

---

## 12. CLAUDE CODE FEATURES IN SDK

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md

### settingSources

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- Control filesystem settings with settingSources

Controls which filesystem-based settings the SDK loads. Default (when omitted) = `["user", "project", "local"]`.

| Source | What It Loads | Location |
|--------|--------------|----------|
| `"project"` | Project CLAUDE.md, `.claude/rules/*.md`, skills, hooks, settings.json | `<cwd>/.claude/` and parent dirs |
| `"user"` | User CLAUDE.md, `~/.claude/rules/*.md`, user skills, settings | `~/.claude/` |
| `"local"` | CLAUDE.local.md, `.claude/settings.local.json` | `<cwd>/` |

Pass `settingSources: []` to disable all filesystem settings.

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- What settingSources does not control

### Always Loaded (regardless of settingSources)
- Managed policy settings
- `~/.claude.json` global config (relocate with `CLAUDE_CONFIG_DIR` in `env`)
- Auto memory at `~/.claude/projects/<project>/memory/` (disable with `autoMemoryEnabled: false` or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`)

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- Project instructions (CLAUDE.md and rules)

### CLAUDE.md Load Locations

| Level | Location | When |
|-------|----------|------|
| Project (root) | `<cwd>/CLAUDE.md` or `<cwd>/.claude/CLAUDE.md` | settingSources includes "project" |
| Project rules | `<cwd>/.claude/rules/*.md` | settingSources includes "project" |
| Parent dirs | `CLAUDE.md` above cwd | settingSources includes "project", at session start |
| Child dirs | `CLAUDE.md` in subdirectories | settingSources includes "project", on demand |
| Local | `<cwd>/CLAUDE.local.md` | settingSources includes "local" |
| User | `~/.claude/CLAUDE.md` | settingSources includes "user" |
| User rules | `~/.claude/rules/*.md` | settingSources includes "user" |

All levels are additive. No hard precedence; state precedence explicitly if needed.

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- Hooks

### Two Hook Types in SDK
1. **Filesystem hooks**: Shell commands in `settings.json` (fire in main agent AND subagents)
2. **Programmatic hooks**: Callbacks in `query()` (scoped to main session only)

Filesystem hook types: `"command"` (shell), `"http"` (POST endpoint), `"prompt"` (LLM evaluates), `"agent"` (spawns verifier agent)

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- Choose the right feature

### Feature Selection Guide

| Goal | Use | SDK Surface |
|------|-----|-------------|
| Project conventions always followed | CLAUDE.md | `settingSources: ["project"]` |
| Reference material loaded when relevant | Skills | settingSources + `allowedTools: ["Skill"]` |
| Reusable workflow | User-invocable skills | settingSources + `allowedTools: ["Skill"]` |
| Isolated subtask | Subagents | `agents` param + `allowedTools: ["Agent"]` |
| Coordinate multiple Claude Code instances | Agent teams | CLI feature (not SDK options) |
| Deterministic logic on tool calls | Hooks | `hooks` param or shell scripts via settingSources |
| External service access | MCP | `mcpServers` param |

> **Source:** https://code.claude.com/docs/en/agent-sdk/claude-code-features.md -- What settingSources does not control (Warning)

### Multi-Tenant Warning
Do NOT rely on default `query()` options for multi-tenant isolation. For multi-tenant: run each tenant in own filesystem, set `settingSources: []`, set `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.

---

## 13. SKILLS

> **Source:** https://code.claude.com/docs/en/agent-sdk/skills.md

### How Skills Work

> **Source:** https://code.claude.com/docs/en/agent-sdk/skills.md -- How Skills Work with the SDK

- Defined as `SKILL.md` files in `.claude/skills/` directories
- Loaded from filesystem via settingSources
- Metadata discovered at startup; full content loaded when triggered
- Claude autonomously chooses when to use based on context
- Must include `"Skill"` in `allowedTools`

> **Source:** https://code.claude.com/docs/en/agent-sdk/skills.md -- Skill Locations

### Skill Locations
- **Project**: `.claude/skills/*/SKILL.md` (loaded with "project" setting source)
- **User**: `~/.claude/skills/*/SKILL.md` (loaded with "user" setting source)
- **Plugin**: Bundled with installed Claude Code plugins

> **Source:** https://code.claude.com/docs/en/agent-sdk/skills.md -- How Skills Work with the SDK

### Important Limitations
- Skills must be filesystem artifacts; NO programmatic API for registering skills
- The `allowed-tools` frontmatter in SKILL.md does NOT apply when using SDK (only CLI)
- Control tool access through main `allowedTools` option instead

---

## 14. COST TRACKING

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md

### Cost Fields

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md -- (Warning at top)

- `total_cost_usd`: Client-side estimate on ResultMessage (NOT authoritative billing)
- `model_usage` / `modelUsage`: Per-model breakdown
- For authoritative billing, use the Usage and Cost API or Claude Console

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md -- Understand token usage

### Scope
- **query() call**: One invocation; one `result` message at end
- **Step**: Single request/response cycle within a query() call
- **Session**: Series of query() calls linked by session ID; each reports independently

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md -- Track per-step and per-model usage

### Deduplication
Parallel tool calls produce multiple assistant messages with SAME `id` and identical usage. Always deduplicate by ID.

### Per-Model Usage Fields (TypeScript `modelUsage`)
- `inputTokens`, `outputTokens`, `cacheReadInputTokens`, `cacheCreationInputTokens`
- `webSearchRequests`, `costUSD`, `contextWindow`, `maxOutputTokens`

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md -- Handle errors, caching, and token discrepancies / Track cache tokens

### Cache Token Tracking
- `cache_creation_input_tokens`: tokens for new cache entries (higher rate)
- `cache_read_input_tokens`: tokens from existing cache (reduced rate)
- Prompt caching is automatic; no configuration needed

> **Source:** https://code.claude.com/docs/en/agent-sdk/cost-tracking.md -- Handle errors, caching, and token discrepancies / Track costs on failed conversations

### Cost on Errors
Both success and error results include `usage` and `total_cost_usd`. Always read cost data regardless of subtype.

---

## 15. TOOL SEARCH

> **Source:** https://code.claude.com/docs/en/agent-sdk/tool-search.md

### Purpose

> **Source:** https://code.claude.com/docs/en/agent-sdk/tool-search.md -- How tool search works

Scale to thousands of tools by discovering and loading on demand. Withholds tool definitions from context; agent searches when capability needed. 3-5 most relevant tools loaded per search.

> **Source:** https://code.claude.com/docs/en/agent-sdk/tool-search.md -- Configure tool search

### Configuration via `ENABLE_TOOL_SEARCH` env var

| Value | Behavior |
|-------|----------|
| (unset) / `true` | Always on (default) |
| `auto` | Activates when tool definitions exceed 10% of context |
| `auto:N` | Custom percentage threshold (e.g., `auto:5` = 5%) |
| `false` | Off; all tools loaded into context every turn |

> **Source:** https://code.claude.com/docs/en/agent-sdk/tool-search.md -- Limits

### Limits
- Maximum tools: 10,000
- Search results: 3-5 per search
- Model support: Claude Sonnet 4+, Claude Opus 4+ (NO Haiku)

> **Source:** https://code.claude.com/docs/en/agent-sdk/tool-search.md -- Optimize tool discovery

### Best Practices
- Use descriptive tool names: `search_slack_messages` > `query_slack`
- Add system prompt listing available tool categories
- Set `ENABLE_TOOL_SEARCH` in `options.env`

---

## 16. MODIFYING SYSTEM PROMPTS

> **Source:** https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts.md

### Default Behavior

> **Source:** https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts.md -- Understanding system prompts

SDK uses a **minimal system prompt** by default (only essential tool instructions). Omits Claude Code's coding guidelines, response style, project context. To include full Claude Code prompt:
```typescript
systemPrompt: { type: "preset", preset: "claude_code" }
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts.md -- Methods of modification

### Four Methods

#### 1. CLAUDE.md files (persistent, project-level)
- Loaded via settingSources, not by claude_code preset
- Version-controlled, shared with team

#### 2. Output Styles (persistent configurations)
- Markdown files with YAML frontmatter in `~/.claude/output-styles/` or `.claude/output-styles/`
- Loaded via settingSources

#### 3. systemPrompt with append (preserves defaults)
```typescript
systemPrompt: { type: "preset", preset: "claude_code", append: "Always include docstrings." }
```

#### 4. Custom systemPrompt string (complete replacement)
```typescript
systemPrompt: "You are a Python specialist..."
```
Loses default tools, safety instructions, environment context.

> **Source:** https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts.md -- Method 3: Using systemPrompt with append / Improve prompt caching across users and machines

### Cross-Session Cache Reuse
Set `excludeDynamicSections: true` to move per-session context (cwd, OS, git status) into first user message. System prompt becomes identical across sessions for better cache hit rates. Requires v0.2.98+ (TS) / v0.1.58+ (Python).

> **Source:** https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts.md -- Comparison of all four approaches

### Comparison

| Feature | CLAUDE.md | Output Styles | Append | Custom |
|---------|-----------|---------------|--------|--------|
| Persistence | Per-project file | Saved files | Session only | Session only |
| Default tools | Preserved | Preserved | Preserved | Lost |
| Built-in safety | Maintained | Maintained | Maintained | Must be added |
| Customization | Additions only | Replace default | Additions only | Complete control |

---

## 17. HOSTING

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md

### Requirements

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md -- Hosting Requirements

- Python 3.10+ or Node.js 18+
- Node.js required by bundled CLI (included in SDK packages)
- Recommended: 1GiB RAM, 5GiB disk, 1 CPU
- Network: outbound HTTPS to `api.anthropic.com`

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md -- Understanding the SDK Architecture

### Architecture
SDK runs as long-running process: executes commands in persistent shell, manages file operations, handles tool execution with prior context.

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md -- Production Deployment Patterns

### Deployment Patterns

| Pattern | Best For | Examples |
|---------|----------|---------|
| Ephemeral Sessions | One-off tasks | Bug fix, invoice processing, translation |
| Long-Running Sessions | Proactive agents, high-frequency | Email agent, site builder, chat bots |
| Hybrid Sessions | Intermittent interaction | Project manager, deep research, support |
| Single Containers | Closely collaborating agents | Simulations |

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md -- Sandbox Provider Options

### Sandbox Providers
Modal, Cloudflare, Daytona, E2B, Fly Machines, Vercel Sandbox

> **Source:** https://code.claude.com/docs/en/agent-sdk/hosting.md -- FAQ

### FAQ
- Container cost: ~5 cents/hour minimum running (dominant cost = tokens)
- Agent sessions do NOT timeout. Set `maxTurns` to prevent infinite loops.

---

## 18. SECURE DEPLOYMENT

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md

### Threat Model

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Threat model

Agents can take unintended actions due to prompt injection or model error. Defense in depth is good practice.

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Built-in security features

### Built-in Security Features
- **Permissions system**: Allow, block, or prompt per tool/command. Glob patterns supported.
- **Command parsing**: AST parsing before bash execution; `eval` always requires approval.
- **Web search summarization**: Results summarized (reduces prompt injection risk)
- **Sandbox mode**: Bash commands can run in sandbox restricting filesystem/network

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Isolation technologies

### Isolation Technologies

| Technology | Isolation | Performance | Complexity |
|-----------|-----------|-------------|-----------|
| Sandbox runtime | Good | Very low | Low |
| Containers (Docker) | Setup dependent | Low | Medium |
| gVisor | Excellent | Medium/High | Medium |
| VMs (Firecracker, QEMU) | Excellent | High | Medium/High |

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Isolation technologies / Sandbox runtime

### sandbox-runtime
- `npm install @anthropic-ai/sandbox-runtime`
- Uses OS primitives (bubblewrap on Linux, sandbox-exec on macOS)
- JSON-based allowlists for domains and filesystem paths
- No Docker required

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Isolation technologies / Containers

### Docker Hardening
Key flags: `--cap-drop ALL`, `--security-opt no-new-privileges`, `--read-only`, `--network none`, `--memory 2g`, `--pids-limit 100`, `--user 1000:1000`

**Unix socket architecture**: With `--network none`, only communication through mounted Unix socket to proxy. Proxy enforces domain allowlists + injects credentials.

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Credential management

### Credential Management - Proxy Pattern
Agent sends requests without credentials; proxy adds them and forwards. Agent never sees actual credentials.

**Claude Code proxy config:**
- `ANTHROPIC_BASE_URL`: Routes sampling requests to proxy
- `HTTP_PROXY`/`HTTPS_PROXY`: System-wide routing

> **Source:** https://code.claude.com/docs/en/agent-sdk/secure-deployment.md -- Filesystem configuration

### Filesystem Security
- Mount code read-only: `-v /path/to/code:/workspace:ro`
- Never mount: `~/.ssh`, `~/.aws`, `~/.config`
- Sensitive files to exclude: `.env`, `~/.git-credentials`, `~/.aws/credentials`, `*.pem`, `*.key`
- Use tmpfs for ephemeral workspaces

---

## 19. OBSERVABILITY (OpenTelemetry)

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md

### Architecture

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- How telemetry flows from the SDK

SDK itself does NOT produce telemetry. It passes config to the Claude Code CLI child process, which has OpenTelemetry instrumentation built in.

### Enable
Set `CLAUDE_CODE_ENABLE_TELEMETRY=1` + at least one exporter.

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- How telemetry flows from the SDK (table)

### Three Signals

| Signal | Contains | Enable With |
|--------|---------|-------------|
| Metrics | Token counters, cost, sessions, tool decisions | `OTEL_METRICS_EXPORTER` |
| Log events | Prompt, API request/error, tool result records | `OTEL_LOGS_EXPORTER` |
| Traces | Spans for interactions, API calls, tools, hooks | `OTEL_TRACES_EXPORTER` + `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1` |

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- Enable telemetry export

### Configuration
- Process environment (recommended for production)
- Per-call via `options.env`
- Python `env` merges on top of inherited environment
- TypeScript `env` REPLACES inherited environment (must include `...process.env`)
- Do NOT use `console` exporter (conflicts with stdout message channel)

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- Read agent traces

### Trace Spans
- `claude_code.interaction`: Single turn of agent loop
- `claude_code.llm_request`: Each Claude API call (model, latency, tokens)
- `claude_code.tool`: Each tool invocation (child spans for permission wait + execution)
- `claude_code.hook`: Each hook execution
- Spans carry `session.id` attribute

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- Control sensitive data in exports

### Sensitive Data Control

| Variable | Adds |
|----------|------|
| `OTEL_LOG_USER_PROMPTS=1` | Prompt text on events/spans |
| `OTEL_LOG_TOOL_DETAILS=1` | Tool input args (file paths, commands) |
| `OTEL_LOG_TOOL_CONTENT=1` | Full tool I/O (truncated 60KB). Requires tracing enabled |

> **Source:** https://code.claude.com/docs/en/agent-sdk/observability.md -- Flush telemetry from short-lived calls

### Flush for Short-Lived Calls
Default intervals: metrics=60s, traces/logs=5s. Reduce with:
- `OTEL_METRIC_EXPORT_INTERVAL=1000`
- `OTEL_LOGS_EXPORT_INTERVAL=1000`
- `OTEL_TRACES_EXPORT_INTERVAL=1000`

---

## 20. PYTHON SDK REFERENCE

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md

### Core Functions

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- query()

#### `query()`
```python
async def query(*, prompt: str | AsyncIterable[dict], options: ClaudeAgentOptions | None = None,
                transport: Transport | None = None) -> AsyncIterator[Message]
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- tool()

#### `@tool` decorator
```python
@tool(name: str, description: str, input_schema: type | dict, annotations: ToolAnnotations | None = None)
```
Input schema: simple dict (`{"name": str}`) or full JSON Schema dict.

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- create_sdk_mcp_server()

#### `create_sdk_mcp_server(name, version="1.0.0", tools=[])`
Returns `McpSdkServerConfig`.

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- ClaudeSDKClient

### ClaudeSDKClient
```python
class ClaudeSDKClient:
    async def connect(self, prompt=None)
    async def query(self, prompt, session_id="default")
    async def receive_messages() -> AsyncIterator
    async def receive_response() -> AsyncIterator
    async def interrupt()
    async def set_permission_mode(mode)
    async def set_model(model)
    async def rewind_files(user_message_id)
    async def get_mcp_status() -> McpStatusResponse
    async def reconnect_mcp_server(server_name)
    async def toggle_mcp_server(server_name, enabled)
    async def stop_task(task_id)
    async def get_server_info() -> dict | None
    async def disconnect()
```
Used as async context manager. Avoid `break` in message iteration.

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- ClaudeAgentOptions

### ClaudeAgentOptions (Key Fields)
```python
tools: list[str] | ToolsPreset | None
allowed_tools: list[str]
disallowed_tools: list[str]
system_prompt: str | SystemPromptPreset | None
mcp_servers: dict[str, McpServerConfig] | str | Path
permission_mode: PermissionMode | None  # "default"|"acceptEdits"|"plan"|"dontAsk"|"bypassPermissions"
continue_conversation: bool = False
resume: str | None
max_turns: int | None
max_budget_usd: float | None
model: str | None
fallback_model: str | None
output_format: dict | None
cwd: str | Path | None
env: dict[str, str]
can_use_tool: CanUseTool | None
hooks: dict[HookEvent, list[HookMatcher]] | None
include_partial_messages: bool = False
fork_session: bool = False
agents: dict[str, AgentDefinition] | None
setting_sources: list[SettingSource] | None
effort: Literal["low","medium","high","xhigh","max"] | None
sandbox: SandboxSettings | None
plugins: list[SdkPluginConfig]
thinking: ThinkingConfig | None
enable_file_checkpointing: bool = False
betas: list[SdkBeta]  # Only "context-1m-2025-08-07"
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- Message Types

### Message Types
```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage | StreamEvent | RateLimitEvent
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- ResultMessage

### ResultMessage Fields
```python
subtype: str  # "success", "error_max_turns", "error_max_budget_usd", "error_during_execution", "error_max_structured_output_retries"
duration_ms: int
duration_api_ms: int
is_error: bool
num_turns: int
session_id: str
total_cost_usd: float | None
usage: dict | None  # keys: input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens
result: str | None
stop_reason: str | None
structured_output: Any
model_usage: dict | None
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- HookEvent

### HookEvent (Python -- 10 events)
```python
Literal["PreToolUse", "PostToolUse", "PostToolUseFailure", "UserPromptSubmit",
        "Stop", "SubagentStop", "PreCompact", "Notification", "SubagentStart", "PermissionRequest"]
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- ThinkingConfig

### ThinkingConfig
```python
ThinkingConfigAdaptive: {"type": "adaptive"}
ThinkingConfigEnabled: {"type": "enabled", "budget_tokens": int}
ThinkingConfigDisabled: {"type": "disabled"}
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- Error Types

### Error Types
- `ClaudeSDKError`: Base exception
- `CLINotFoundError`: Claude Code not found
- `CLIConnectionError`: Failed to connect
- `ProcessError`: Has `exit_code`, `stderr`
- `CLIJSONDecodeError`: Has `line`, `original_error`

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- Transport

### Transport ABC
```python
class Transport(ABC):
    async def connect()
    async def write(data: str)
    def read_messages() -> AsyncIterator[dict]
    async def close()
    def is_ready() -> bool
    async def end_input()
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/python.md -- Session Management Functions

### Session Functions
- `list_sessions(directory?, limit?, include_worktrees?)` -> `list[SDKSessionInfo]`
- `get_session_messages(session_id, directory?, limit?, offset?)` -> `list[SessionMessage]`
- `get_session_info(session_id, directory?)` -> `SDKSessionInfo | None`
- `rename_session(session_id, title, directory?)` -> None
- `tag_session(session_id, tag, directory?)` -> None (pass None to clear)

---

## 21. TYPESCRIPT SDK REFERENCE

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md

### Core Functions

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- query()

#### `query()`
```typescript
function query({ prompt, options }: { prompt: string | AsyncIterable<SDKUserMessage>; options?: Options }): Query
```
Returns `Query` extending `AsyncGenerator<SDKMessage, void>` with methods: `interrupt()`, `rewindFiles()`, `setPermissionMode()`, `setModel()`, `setMaxThinkingTokens()`, `initializationResult()`, `supportedCommands()`, `supportedModels()`, `supportedAgents()`, `mcpServerStatus()`, `accountInfo()`, `reconnectMcpServer()`, `toggleMcpServer()`, `setMcpServers()`, `streamInput()`, `stopTask()`, `close()`

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- startup()

#### `startup()`
Pre-warms CLI subprocess before prompt available:
```typescript
const warm = await startup({ options: { maxTurns: 3 } });
for await (const msg of warm.query("prompt")) { ... }
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- tool()

#### `tool()`
```typescript
function tool<Schema>(name, description, inputSchema: Schema, handler, extras?: { annotations }): SdkMcpToolDefinition
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- createSdkMcpServer()

#### `createSdkMcpServer({ name, version?, tools? })`

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- Options

### Options (Key Fields)
```typescript
allowedTools?: string[]
disallowedTools?: string[]
systemPrompt?: string | { type: 'preset'; preset: 'claude_code'; append?: string; excludeDynamicSections?: boolean }
mcpServers?: Record<string, McpServerConfig>
permissionMode?: PermissionMode  // includes "auto"
continue?: boolean
resume?: string
maxTurns?: number
maxBudgetUsd?: number
model?: string
fallbackModel?: string
outputFormat?: { type: 'json_schema'; schema: JSONSchema }
effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max'
includePartialMessages?: boolean
forkSession?: boolean
agents?: Record<string, AgentDefinition>
settingSources?: SettingSource[]
hooks?: Partial<Record<HookEvent, HookCallbackMatcher[]>>
canUseTool?: CanUseTool
persistSession?: boolean  // default true; false = no disk writes (TS only)
sandbox?: SandboxSettings
plugins?: SdkPluginConfig[]
thinking?: ThinkingConfig
tools?: string[] | { type: 'preset'; preset: 'claude_code' }
enableFileCheckpointing?: boolean
maxThinkingTokens?: number
executable?: 'bun' | 'deno' | 'node'
debug?: boolean
promptSuggestions?: boolean
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- PermissionMode

### PermissionMode (TypeScript -- includes "auto")
```typescript
"default" | "acceptEdits" | "bypassPermissions" | "plan" | "dontAsk" | "auto"
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- Message Types

### SDKMessage Types (Full Union)
```typescript
SDKAssistantMessage | SDKUserMessage | SDKUserMessageReplay | SDKResultMessage |
SDKSystemMessage | SDKPartialAssistantMessage | SDKCompactBoundaryMessage |
SDKStatusMessage | SDKLocalCommandOutputMessage | SDKHookStartedMessage |
SDKHookProgressMessage | SDKHookResponseMessage | SDKPluginInstallMessage |
SDKToolProgressMessage | SDKAuthStatusMessage | SDKTaskNotificationMessage |
SDKTaskStartedMessage | SDKTaskProgressMessage | SDKFilesPersistedEvent |
SDKToolUseSummaryMessage | SDKRateLimitEvent | SDKPromptSuggestionMessage
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- SDKResultMessage

### SDKResultMessage (Success Variant)
```typescript
{
  type: "result"; subtype: "success";
  result: string; stop_reason: string | null;
  total_cost_usd: number; usage: NonNullableUsage;
  modelUsage: { [model: string]: ModelUsage };
  permission_denials: SDKPermissionDenial[];
  structured_output?: unknown;
  session_id: string; num_turns: number;
  duration_ms: number; duration_api_ms: number;
}
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- HookEvent

### HookEvent (TypeScript -- 18 events)
```typescript
"PreToolUse" | "PostToolUse" | "PostToolUseFailure" | "Notification" |
"UserPromptSubmit" | "SessionStart" | "SessionEnd" | "Stop" |
"SubagentStart" | "SubagentStop" | "PreCompact" | "PermissionRequest" |
"Setup" | "TeammateIdle" | "TaskCompleted" | "ConfigChange" |
"WorktreeCreate" | "WorktreeRemove"
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- Tool Input Types

### Tool Input Types (Common)

| Tool | Key Parameters |
|------|---------------|
| Bash | `command`, `timeout?`, `description?`, `run_in_background?`, `dangerouslyDisableSandbox?` |
| Read | `file_path`, `offset?`, `limit?`, `pages?` |
| Write | `file_path`, `content` |
| Edit | `file_path`, `old_string`, `new_string`, `replace_all?` |
| Glob | `pattern`, `path?` |
| Grep | `pattern`, `path?`, `glob?`, `type?`, `output_mode?`, `-i?`, `-n?`, `-B?`, `-A?`, `-C?`, `head_limit?`, `offset?`, `multiline?` |
| WebSearch | `query`, `allowed_domains?`, `blocked_domains?` |
| WebFetch | `url`, `prompt` |
| Agent | `description`, `prompt`, `subagent_type`, `model?`, `resume?`, `run_in_background?`, `max_turns?`, `name?`, `mode?`, `isolation?` |

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- AgentDefinition

### AgentDefinition (TypeScript extras)
```typescript
{
  description: string; prompt: string;
  tools?: string[]; disallowedTools?: string[];
  model?: "sonnet" | "opus" | "haiku" | "inherit";
  mcpServers?: AgentMcpServerSpec[];
  skills?: string[]; maxTurns?: number;
  criticalSystemReminder_EXPERIMENTAL?: string;
}
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- SDKControlInitializeResponse

### SDKControlInitializeResponse
```typescript
{
  commands: SlashCommand[];
  agents: AgentInfo[];
  output_style: string;
  available_output_styles: string[];
  models: ModelInfo[];
  account: AccountInfo;
  fast_mode_state?: "off" | "cooldown" | "on";
}
```

> **Source:** https://code.claude.com/docs/en/agent-sdk/typescript.md -- startup()

### startup() (TypeScript only)
Pre-warms CLI subprocess. Returns `WarmQuery` with `query()` method and `close()`.

---

## CROSS-CUTTING CONCERNS

> **Source:** Synthesized from https://code.claude.com/docs/en/agent-sdk/python.md and https://code.claude.com/docs/en/agent-sdk/typescript.md

### Python vs TypeScript Differences
| Feature | Python | TypeScript |
|---------|--------|-----------|
| Package | `claude-agent-sdk` | `@anthropic-ai/claude-agent-sdk` |
| Field naming | `snake_case` | `camelCase` |
| `auto` permission mode | Not available | Available |
| Default effort | Unset (model default) | `"high"` |
| `env` in options | Merged on top of inherited | Replaces inherited (must spread `process.env`) |
| `persistSession` | Always persists to disk | Can set `false` for memory-only |
| Session client | `ClaudeSDKClient` class | `continue: true` on query |
| Compact boundary | `SystemMessage` with subtype | Separate `SDKCompactBoundaryMessage` type |
| Content access | `message.content` directly | `message.message.content` (wrapped) |
| Type checking | `isinstance(message, ResultMessage)` | `message.type === "result"` |
| Hook events | 10 events | 18 events (includes SessionStart/End, Setup, etc.) |
| AgentDefinition extras | `memory` field | `disallowedTools`, `maxTurns`, `criticalSystemReminder_EXPERIMENTAL` |
| `startup()` pre-warm | Not available | Available |
