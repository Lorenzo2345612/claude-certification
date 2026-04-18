# Domain 1: Agentic Architecture & Orchestration - Official Documentation Research

> **Source**: Extracted from official Anthropic documentation (platform.claude.com, code.claude.com, anthropic.com/engineering)
> **Coverage**: 27% of CCA exam (largest domain)
> **Last updated**: 2026-04-17

---

## 1. THE AGENTIC LOOP LIFECYCLE

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works

### 1.1 The Tool-Use Contract

Tool use is a **contract** between your application and the model. You specify what operations are available and what shape their inputs and outputs take; Claude decides when and how to call them. The model **never executes anything on its own**. It emits a structured request, your code (or Anthropic's servers) runs the operation, and the result flows back into the conversation.

### 1.2 The Client-Side Agentic Loop (Canonical Shape)

The canonical shape is a `while` loop keyed on `stop_reason`:

1. Send a request with your `tools` array and the user message.
2. Claude responds with `stop_reason: "tool_use"` and one or more `tool_use` blocks.
3. Execute each tool. Format the outputs as `tool_result` blocks.
4. Send a new request containing the original messages, the assistant's response, and a user message with the `tool_result` blocks.
5. Repeat from step 2 while `stop_reason` is `"tool_use"`.

The loop exits on any other stop reason.

### 1.3 stop_reason Values (ALL)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons

| `stop_reason` Value | Meaning | Action Required |
|---|---|---|
| `"end_turn"` | Claude has produced a final answer | Loop exits; present response to user |
| `"tool_use"` | Claude wants to call one or more client tools | Execute tools, send `tool_result`, continue loop |
| `"max_tokens"` | Output hit `max_tokens` limit | Loop exits; response may be truncated |
| `"stop_sequence"` | A custom stop sequence was matched | Loop exits |
| `"pause_turn"` | Server-side loop hit iteration limit (server tools only) | Re-send conversation including paused response to let Claude continue |
| `"refusal"` | Claude refused to respond | Loop exits; handle refusal |

**Critical**: The loop continues ONLY while `stop_reason == "tool_use"`. Any other value exits the loop.

### 1.4 The Server-Side Loop

Server-executed tools run their own loop inside Anthropic's infrastructure. A single request might trigger several web searches or code executions before a response comes back. The model iterates **without your application participating**.

This internal loop has an **iteration limit**. If the model is still iterating when it hits the cap, the response comes back with `stop_reason: "pause_turn"` instead of `"end_turn"`.

**Handling `pause_turn`**:
- Continue the conversation: Pass the paused response back as-is in a subsequent request
- Modify if needed: You can optionally modify the content before continuing
- Preserve tool state: Include the same tools in the continuation request

---

## 2. TOOL EXECUTION BUCKETS (Three Categories)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works — "Three categories of tools"

### 2.1 User-Defined Tools (Client-Executed)

- **You** write the schema, execute the code, and return the results
- The vast majority of tool-use traffic
- Response contains `tool_use` block with tool name + JSON arguments
- You send back a `tool_result` block
- Claude never sees your implementation, only the schema and result

### 2.2 Anthropic-Schema Tools (Client-Executed)

- Anthropic publishes the tool schema; **your application handles execution**
- Tools: `bash`, `text_editor`, `computer`, `memory`
- Execution model identical to user-defined tools (`tool_use` -> execute -> `tool_result`)
- **Why use them**: These schemas are **trained-in** - Claude has been optimized on thousands of successful trajectories using these exact signatures, so calls them more reliably

### 2.3 Server-Executed Tools

- Tools: `web_search`, `web_fetch`, `code_execution`, `tool_search`
- **Anthropic runs the code** - you never construct a `tool_result`
- Response contains `server_tool_use` blocks (NOT `tool_use`)
- `server_tool_use` block `id` uses the `srvtoolu_` prefix (vs `toolu_` for client)
- Result block appears immediately after `server_tool_use` block in same assistant turn
- By the time you see them, execution is already complete

### 2.4 Summary Table

| Approach | Type Field Examples | Execution | You Handle |
|---|---|---|---|
| User-defined client tools | (no type, just name/description/input_schema) | Client | Schema + execution + agentic loop |
| Anthropic-schema client tools | `bash_20250124`, `text_editor_20250728`, `computer_20251124`, `memory_20250818` | Client | Execution + agentic loop (schema trained-in) |
| Server-executed tools | `web_search_20260209`, `web_fetch_20260209`, `code_execution_20260120`, `tool_search_tool_regex_20251119` | Server | Enable tool, read final answer |

---

## 3. TOOL DEFINITIONS & CONFIGURATION

### 3.1 Client Tool Definition Schema

| Parameter | Required | Description |
|---|---|---|
| `name` | Yes | Must match regex `^[a-zA-Z0-9_-]{1,64}$` |
| `description` | Yes | Detailed plaintext description of what the tool does, when to use, behavior |
| `input_schema` | Yes | JSON Schema object defining expected parameters |
| `input_examples` | No | Array of example input objects (must validate against `input_schema`) |

### 3.2 Optional Tool Definition Properties (ALL)

| Property | Purpose | Available On |
|---|---|---|
| `cache_control` | Set a prompt-cache breakpoint at this tool definition | All tools |
| `strict` | Guarantee schema validation on tool names and inputs (grammar-constrained sampling) | All tools except `mcp_toolset` |
| `defer_loading` | Exclude from initial system prompt; load on demand via tool search | All tools |
| `allowed_callers` | Restrict which callers can invoke the tool | All tools except `mcp_toolset` |
| `input_examples` | Example input objects to help Claude | User-defined and Anthropic-schema client tools only (NOT server tools) |
| `eager_input_streaming` | Fine-grained input streaming (`true`) or standard buffered (`false`) | User-defined tools only |

### 3.3 `allowed_callers` Values

| Value | Meaning |
|---|---|
| `"direct"` | Model can call this tool directly in a `tool_use` block (DEFAULT if omitted) |
| `"code_execution_20260120"` | Code running inside a code execution sandbox can call this tool |

Omitting `"direct"` means tool is callable ONLY from within code execution.

### 3.4 `tool_choice` Parameter (4 Options)

| Value | Behavior |
|---|---|
| `auto` | Claude decides whether to call any tools. **Default when `tools` are provided** |
| `any` | Claude MUST use one of the provided tools |
| `tool` | Claude MUST use a specific named tool: `{"type": "tool", "name": "get_weather"}` |
| `none` | Claude cannot use any tools. **Default when no `tools` provided** |

**Key facts**:
- When `tool_choice` is `any` or `tool`, the API **prefills** the assistant message to force tool use. This means the model will NOT emit natural language before `tool_use` blocks
- Extended thinking only supports `auto` and `none` (not `any` or `tool`)
- `disable_parallel_tool_use=true` can be combined with `tool_choice`

### 3.5 Strict Tool Use (`strict: true`)

- Uses **grammar-constrained sampling** to guarantee tool inputs match JSON Schema
- Guarantees: tool `input` strictly follows `input_schema`; tool `name` is always valid
- Compiled schemas cached up to 24 hours since last use
- PHI must NOT be in tool schema definitions (cached separately from message content)
- Combine with `tool_choice: {"type": "any"}` for guaranteed tool call AND schema compliance

### 3.6 `defer_loading` and Prompt Caching

- Tools with `defer_loading: true` are stripped from rendered tools section before cache key computed
- Don't appear in system-prompt prefix at all
- Preserves prompt cache - adding deferred tools won't invalidate existing cache entries

### 3.7 Tool Use System Prompt (Auto-Generated)

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### 3.8 Tool Use Token Costs

| Model | `auto`/`none` | `any`/`tool` |
|---|---|---|
| Claude Opus 4.7, 4.6, 4.5, 4.1, 4 | 346 tokens | 313 tokens |
| Claude Sonnet 4.6, 4.5, 4 | 346 tokens | 313 tokens |
| Claude Haiku 4.5 | 346 tokens | 313 tokens |
| Claude Haiku 3.5 | 264 tokens | 340 tokens |
| Claude Opus 3 (deprecated) | 530 tokens | 281 tokens |

---

## 4. HANDLING TOOL CALLS

### 4.1 `tool_use` Response Block Structure

```json
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-opus-4-7",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": { "location": "San Francisco, CA", "unit": "celsius" }
    }
  ]
}
```

### 4.2 `tool_result` Format

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls

The `tool_result` goes in a `user` message with these fields:

| Field | Required | Description |
|---|---|---|
| `tool_use_id` | Yes | The `id` of the `tool_use` request this is a result for |
| `content` | No | String, list of content blocks (`text`/`image`/`document`), or omitted for empty result |
| `is_error` | No | Set to `true` if tool execution resulted in an error |

**Content formats supported**:
- Simple string: `"content": "15 degrees"`
- Nested content blocks: `"content": [{"type": "text", "text": "15 degrees"}]`
- Document blocks: `"content": [{"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}}]`
- Image blocks: `"content": [{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}]`
- Empty (omit content entirely)

### 4.3 CRITICAL Ordering Rules

1. **Tool result blocks must immediately follow** their corresponding tool use blocks in message history. You CANNOT include any messages between the assistant's tool use message and the user's tool result message.
2. **In the user message containing tool results, `tool_result` blocks must come FIRST** in the content array. Any text must come AFTER all tool results.

```json
// WRONG - causes 400 error:
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // Text BEFORE tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01" }
]}

// CORRECT:
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01" },
  {"type": "text", "text": "What should I do next?"}   // Text AFTER tool_result
]}
```

### 4.4 Error Handling with `is_error`

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "ConnectionError: the weather service API is not available (HTTP 500)",
  "is_error": true
}
```

- Claude will incorporate the error into its response
- **Best practice**: Write instructive error messages including what went wrong and what to try next
- If Claude makes an invalid tool call, it will retry **2-3 times** with corrections before apologizing

### 4.5 Server Tool Error Codes (Web Search)

| Error Code | Meaning |
|---|---|
| `too_many_requests` | Rate limit exceeded |
| `invalid_input` | Invalid search query parameter |
| `max_uses_exceeded` | Maximum web search tool uses exceeded |
| `query_too_long` | Query exceeds maximum length |
| `unavailable` | Internal error occurred |

---

## 5. PARALLEL TOOL USE

### 5.1 Behavior

- By default, Claude may use **multiple tools** in a single response
- Multiple `tool_use` blocks appear in the `content` array
- All tool results must be sent in a **single user message** (NOT separate messages)

### 5.2 Disabling Parallel Tool Use

- `disable_parallel_tool_use=true` + `tool_choice: auto` = **at most one** tool
- `disable_parallel_tool_use=true` + `tool_choice: any/tool` = **exactly one** tool

### 5.3 Correct Parallel Result Formatting

```json
// WRONG - reduces parallel tool use:
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}   // Separate messages
]

// CORRECT - maintains parallel tool use:
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

---

## 6. SERVER TOOLS REFERENCE

### 6.1 Complete Anthropic-Provided Tools Table

| Tool | `type` | Execution | Status |
|---|---|---|---|
| Web search | `web_search_20260209`, `web_search_20250305` | Server | GA |
| Web fetch | `web_fetch_20260209`, `web_fetch_20250910` | Server | GA |
| Code execution | `code_execution_20260120`, `code_execution_20250825` | Server | GA |
| Advisor | `advisor_20260301` | Server | Beta: `advisor-tool-2026-03-01` |
| Tool search (regex) | `tool_search_tool_regex_20251119` | Server | GA |
| Tool search (bm25) | `tool_search_tool_bm25_20251119` | Server | GA |
| MCP connector | `mcp_toolset` | Server | Beta: `mcp-client-2025-11-20` |
| Memory | `memory_20250818` | Client | GA |
| Bash | `bash_20250124` | Client | GA |
| Text editor | `text_editor_20250728` (Claude 4), `text_editor_20250124` (earlier) | Client | GA |
| Computer use | `computer_20251124`, `computer_20250124` | Client | Beta |

### 6.2 Tool Versioning Patterns

- **Capability-keyed**: `_20260209` versions add dynamic content filtering over predecessors
- **Model-keyed**: `text_editor_20250728` for Claude 4 models, `_20250124` for earlier models
- **Variant, not version**: `tool_search_tool_regex` and `tool_search_tool_bm25` are two algorithms
- **Legacy**: `code_execution_20250522` supports only Python; `_20250825` adds Bash and file ops

### 6.3 `server_tool_use` Block Structure

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01A2B3C4D5E6F7G8H9",
  "name": "web_search",
  "input": { "query": "latest quantum computing breakthroughs" }
}
```

- Uses `srvtoolu_` prefix (distinguishes from client `toolu_` prefix)
- You do NOT respond with a `tool_result`
- Result appears immediately after in same assistant turn

### 6.4 Domain Filtering (Server Tools)

- `allowed_domains` and `blocked_domains` parameters
- Cannot use both simultaneously
- Domains should NOT include HTTP/HTTPS scheme
- Subdomains automatically included (`example.com` covers `docs.example.com`)
- Subpaths supported (`example.com/blog` matches `example.com/blog/post-1`)
- Only one wildcard `*` per entry, must appear after domain part in path

### 6.5 ZDR (Zero Data Retention) Eligibility

- Basic versions (`web_search_20250305`, `web_fetch_20250910`) are ZDR-eligible
- `_20260209` versions are **NOT** ZDR-eligible by default (use code execution internally)
- To use `_20260209` with ZDR: set `"allowed_callers": ["direct"]` to disable dynamic filtering

---

## 7. BUILDING EFFECTIVE AGENTS (Anthropic Engineering Guide)

> **Source:** https://anthropic.com/engineering/building-effective-agents

### 7.1 Core Definitions

| Term | Definition |
|---|---|
| **Workflows** | LLMs and tools orchestrated through **predefined code paths** with predetermined sequences |
| **Agents** | Systems where LLMs **dynamically direct** their own processes and tool usage, maintaining autonomous control |

**Key guidance**: Start with simple LLM calls optimized with retrieval and contextual examples. Use workflows for "predictability and consistency for well-defined tasks"; agents for "flexibility and model-driven decision-making."

### 7.2 The Five Core Workflow Patterns

#### Pattern 1: Prompt Chaining
- **Structure**: Sequential LLM calls where each processes previous output
- **Benefit**: Trades latency for higher accuracy by simplifying individual tasks
- **Key feature**: Programmatic **"gates"** verify intermediate steps remain on track
- **Use cases**: Marketing copy generation -> translation; Document outline -> validation -> full document

#### Pattern 2: Routing
- **Structure**: Classifies input and directs to specialized downstream tasks
- **Benefit**: Separation of concerns enabling task-specific prompt optimization
- **Use cases**: Customer service triage (general/refunds/technical); Model selection routing (simple -> Haiku, complex -> Sonnet)

#### Pattern 3: Parallelization
- **Structure**: Simultaneous LLM operations with programmatic output aggregation
- **Two variations**:
  - **Sectioning**: Independent subtasks run in parallel
  - **Voting**: Same task executed multiple times for diverse outputs
- **Use cases**: Dual-instance guardrails; Code vulnerability reviews across multiple prompts; Content appropriateness with configurable vote thresholds

#### Pattern 4: Orchestrator-Workers (Hub-and-Spoke)
- **Structure**: Central LLM **dynamically decomposes** tasks and delegates to worker LLMs
- **Key distinction from parallelization**: Orchestrator determines decomposition based on specific input analysis (NOT predefined subtasks)
- **Use cases**: Multi-file code modifications; Multi-source research and analysis

#### Pattern 5: Evaluator-Optimizer
- **Structure**: Iterative loop - one LLM generates, another evaluates with feedback
- **Success indicators**: Clear evaluation criteria exist; Human feedback demonstrably improves outputs; LLM can articulate useful critiques
- **Use cases**: Literary translation through iterative refinement; Complex search requiring multiple analysis rounds

### 7.3 Autonomous Agents

- **Definition**: LLMs maintaining control over task execution through **environmental feedback loops**, planning independently after receiving initial direction
- **Key requirements**:
  - Gain "ground truth" from environment at each step (tool results, code execution feedback)
  - **Pause capability** at checkpoints or when encountering blockers
  - **Stopping conditions** (maximum iterations) to maintain operational control
- **When to use**: Open-ended problems with unpredictable step counts; Tasks where fixed paths cannot be hardcoded; Trusted environments requiring autonomous scaling
- **Implementation**: "Agents are typically just LLMs using tools based on environmental feedback in a loop"

### 7.4 Three Core Principles for Agent Success

1. **Simplicity**: Minimize agent design complexity
2. **Transparency**: Explicitly display planning steps
3. **Agent-Computer Interface (ACI)**: Thoroughly document and test tools

### 7.5 Tool Development Best Practices

- Allow sufficient tokens for model reasoning before execution
- Maintain format proximity to internet-sourced text patterns
- Eliminate formatting overhead (avoid line counting, string-escaping requirements)
- Include example usage, edge cases, input requirements in documentation
- Clarify tool boundaries from similar tools
- Test extensively with varied inputs; identify recurring mistakes
- Implement **"poka-yoke" modifications** making errors harder
- Example: Absolute filepath requirements replaced relative paths after model errors

### 7.6 Framework Guidance

- Frameworks simplify initial implementation but create abstraction layers obscuring prompts and responses
- **Recommendation**: Start with direct LLM API calls; use frameworks only when understanding underlying code mechanisms

---

## 8. CLAUDE CODE HOOKS (Complete Reference)

> **Source:** https://code.claude.com/docs/en/hooks

### 8.1 ALL Hook Event Types (26 Events)

#### Session Lifecycle (3)
| Event | Description | Can Block? |
|---|---|---|
| `SessionStart` | New session or resume | No |
| `SessionEnd` | Session terminates | No |
| `InstructionsLoaded` | CLAUDE.md or `.claude/rules/*.md` loaded | No (exit code ignored) |

#### Per-Turn Events (2)
| Event | Description | Can Block? |
|---|---|---|
| `UserPromptSubmit` | User submits prompt (before processing) | Yes (exit 2 or JSON `decision: "block"`) |
| `Stop` | Claude finishes responding | Yes (exit 2) |
| `StopFailure` | Turn ends due to API error | No |

#### Tool Execution Loop (5)
| Event | Description | Can Block? |
|---|---|---|
| `PreToolUse` | Before tool execution | Yes (exit 2 or `permissionDecision: "deny"`) |
| `PostToolUse` | After successful tool execution | No (tool already ran) |
| `PostToolUseFailure` | After tool execution fails | No |
| `PermissionRequest` | Permission dialog appears | Yes (exit 2 or JSON decision) |
| `PermissionDenied` | Auto mode classifier denies call | No (use `retry: true`) |

#### Subagent Events (2)
| Event | Description | Can Block? |
|---|---|---|
| `SubagentStart` | Subagent spawned | No (stderr shown to user only) |
| `SubagentStop` | Subagent finishes | Yes (exit 2) |

#### Task Management (2)
| Event | Description | Can Block? |
|---|---|---|
| `TaskCreated` | Task created via TaskCreate | Yes (exit 2 rolls back) |
| `TaskCompleted` | Task marked as completed | Yes (exit 2) |

#### File & Environment (3)
| Event | Description | Can Block? |
|---|---|---|
| `FileChanged` | Watched file changes | No |
| `CwdChanged` | Working directory changes | No |
| `ConfigChange` | Configuration file changes | Yes (exit 2) |

#### Context Management (2)
| Event | Description | Can Block? |
|---|---|---|
| `PreCompact` | Before context compaction | Yes (exit 2) |
| `PostCompact` | After context compaction | No |

#### Team & Notifications (2)
| Event | Description | Can Block? |
|---|---|---|
| `TeammateIdle` | Agent team teammate about to go idle | Yes (exit 2) |
| `Notification` | Claude Code sends notification | No |

#### Elicitation Events (2)
| Event | Description | Can Block? |
|---|---|---|
| `Elicitation` | MCP server requests user input | Yes (exit 2) |
| `ElicitationResult` | User responds to MCP elicitation | Yes (exit 2, becomes decline) |

#### Worktree Events (2)
| Event | Description | Can Block? |
|---|---|---|
| `WorktreeCreate` | Worktree created | Yes (any non-zero exit) |
| `WorktreeRemove` | Worktree removed | No (failures debug-logged only) |

### 8.2 Four Handler Types

#### 1. Command Handler (`type: "command"`)
```json
{
  "type": "command",
  "command": "path/to/script.sh",
  "async": false,
  "asyncRewake": false,
  "shell": "bash",
  "timeout": 600,
  "if": "Bash(rm *)",
  "statusMessage": "Running validation...",
  "once": false
}
```

#### 2. HTTP Handler (`type: "http"`)
```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/endpoint",
  "headers": {"Authorization": "Bearer $MY_TOKEN"},
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 30
}
```

#### 3. Prompt Handler (`type: "prompt"`)
```json
{
  "type": "prompt",
  "prompt": "Review this tool call and return yes/no: $ARGUMENTS",
  "model": "claude-opus",
  "timeout": 30
}
```

#### 4. Agent Handler (`type: "agent"`)
```json
{
  "type": "agent",
  "prompt": "Verify these conditions: $ARGUMENTS",
  "timeout": 60
}
```

### 8.3 Common Handler Fields (All Types)

| Field | Type | Description |
|---|---|---|
| `type` | Required | `"command"`, `"http"`, `"prompt"`, or `"agent"` |
| `if` | Optional | Permission rule syntax for tool events: `"Bash(git *)"`, `"Edit(*.ts)"` |
| `timeout` | Optional | Seconds before canceling (defaults: 600 command, 30 prompt/http, 60 agent) |
| `statusMessage` | Optional | Custom spinner message while running |
| `once` | Optional | If `true`, runs once per session then removed (skills only) |

### 8.4 Exit Codes (CRITICAL)

| Code | Meaning | JSON Processing |
|---|---|---|
| **0** | Success | Parses stdout JSON, added to debug log |
| **1** | Non-blocking error | Continues execution (does NOT block) |
| **2** | Blocking error | Ignores stdout JSON, uses stderr as error message |
| Other | Non-blocking error | Continues execution |

**CRITICAL**: Exit code 1 does **NOT** block. Use exit code **2** to enforce policy.

### 8.5 Exit Code 2 Behavior by Event (Complete)

| Event | Exit 2 Blocks? | Effect |
|---|---|---|
| `PreToolUse` | **Yes** | Blocks tool call |
| `PermissionRequest` | **Yes** | Denies permission |
| `UserPromptSubmit` | **Yes** | Blocks prompt, erases it |
| `Stop` | **Yes** | Prevents Claude from stopping |
| `SubagentStop` | **Yes** | Prevents subagent from stopping |
| `TeammateIdle` | **Yes** | Prevents teammate going idle |
| `TaskCreated` | **Yes** | Rolls back task creation |
| `TaskCompleted` | **Yes** | Prevents task completion |
| `ConfigChange` | **Yes** | Blocks config change |
| `PreCompact` | **Yes** | Blocks compaction |
| `Elicitation` | **Yes** | Denies elicitation |
| `ElicitationResult` | **Yes** | Blocks response (becomes decline) |
| `WorktreeCreate` | **Yes** | Any non-zero fails creation |
| `PostToolUse` | No | Shows stderr to Claude (tool already ran) |
| `PostToolUseFailure` | No | Shows stderr to Claude |
| `PermissionDenied` | No | Ignored (use exit JSON for retry) |
| `StopFailure` | No | Ignored |
| `Notification` | No | Shows stderr to user only |
| `SubagentStart` | No | Shows stderr to user only |
| `SessionStart/End` | No | Shows stderr to user only |
| `CwdChanged`, `FileChanged` | No | Shows stderr to user only |
| `PostCompact` | No | Shows stderr to user only |
| `WorktreeRemove` | No | Failures logged (debug only) |
| `InstructionsLoaded` | No | Exit code ignored |

### 8.6 `permissionDecision` Values (PreToolUse)

| Value | Effect |
|---|---|
| `"allow"` | Skip permission prompt, allow tool execution |
| `"deny"` | Prevent tool call |
| `"ask"` | Prompt user to confirm |
| `"defer"` | Exit gracefully for resumption (requires `-p` flag, agent SDK only) |

### 8.7 `updatedInput` (PreToolUse)

Modify tool parameters before execution:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": { "command": "modified command" },
    "additionalContext": "Shown to Claude before execution"
  }
}
```

### 8.8 Matcher Patterns

| Pattern Type | Evaluation | Example |
|---|---|---|
| `"*"`, `""`, omitted | Match all | Fires on every occurrence |
| Only `[a-zA-Z0-9_\|]` | Exact string or pipe-separated list | `Bash`, `Edit\|Write` |
| Contains other chars | JavaScript regex | `^Notebook`, `mcp__memory__.*` |

**Matcher by event type**:
- `PreToolUse`/`PostToolUse`/`PostToolUseFailure`/`PermissionRequest`/`PermissionDenied`: matches on **tool name**
- `SessionStart`: matches on `startup`, `resume`, `clear`, `compact`
- `SessionEnd`: matches on `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`
- `StopFailure`: matches on `rate_limit`, `authentication_failed`, `billing_error`, `invalid_request`, `server_error`, `max_output_tokens`
- `Notification`: matches on `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`
- `SubagentStart`/`SubagentStop`: matches on agent type name
- `PreCompact`/`PostCompact`: matches on `manual`, `auto`
- `ConfigChange`: matches on `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`
- `InstructionsLoaded`: matches on `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`
- `FileChanged`: literal filenames (NOT regex)
- `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `CwdChanged`: matchers ignored (always fire)

### 8.9 MCP Tool Naming Pattern

```
mcp__<server>__<tool>
```
Examples: `mcp__memory__create_entities`, `mcp__filesystem__read_file`
Match all from server: `mcp__memory__.*` (requires `.*`)

### 8.10 Hook Configuration Structure

```json
{
  "disableAllHooks": false,
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "/path/to/script.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 8.11 Settings File Locations & Priority

| Location | Scope | Shareable |
|---|---|---|
| `~/.claude/settings.json` | All projects | No (local machine) |
| `.claude/settings.json` | Single project | Yes (commit to repo) |
| `.claude/settings.local.json` | Single project | No (gitignored) |
| Managed policy settings | Organization-wide | Yes (admin-controlled) |
| `Plugin/hooks/hooks.json` | When plugin enabled | Yes (bundled) |
| Skill/Agent frontmatter | While component active | Yes (in component file) |

**Hierarchy**: User/project settings cannot disable managed hooks.

### 8.12 Environment Variables Passed to Hooks

- `CLAUDE_PROJECT_DIR` - Project root directory (always)
- `CLAUDE_PLUGIN_ROOT` - Plugin installation directory (plugins only)
- `CLAUDE_PLUGIN_DATA` - Plugin persistent data directory (plugins only)
- `CLAUDE_CODE_REMOTE` - Set to `"true"` in remote web environments
- `CLAUDE_ENV_FILE` - File path for persisting environment variables (SessionStart, CwdChanged, FileChanged only)

### 8.13 Hook Input (Common Fields)

```json
{
  "session_id": "abc123",
  "transcript_path": "/home/user/.claude/projects/.../transcript.jsonl",
  "cwd": "/home/user/my-project",
  "permission_mode": "default|plan|acceptEdits|auto|dontAsk|bypassPermissions",
  "hook_event_name": "PreToolUse",
  "agent_id": "unique-subagent-id",
  "agent_type": "Explore|Bash|Plan|custom-name"
}
```

### 8.14 Hook Output Limits

- Output injected into context capped at **10,000 characters**
- Exceeding limit saves to file, replaced with preview and path

### 8.15 Async Hooks

- `async: true` - Runs in background, does NOT block
- `asyncRewake: true` - Runs in background, Claude wakes on exit code 2 (stderr shown as system reminder)

### 8.16 Hook Deduplication

- Command hooks deduplicated by command string
- HTTP hooks deduplicated by URL
- Identical handlers across hook groups run once

---

## 9. SUBAGENTS (Agent Tool)

> **Source:** https://code.claude.com/docs/en/sub-agents

### 9.1 Overview

- Formerly called **"Task tool"** - renamed to **"Agent"** in version 2.1.63
- Existing `Task(...)` references in settings still work as aliases
- Each subagent runs in its **own context window** with custom system prompt, specific tool access, independent permissions
- Returns only the summary to main conversation (context isolation)

### 9.2 Key Constraint: No Nesting

**Subagents cannot spawn other subagents.** If your workflow requires nested delegation, use Skills or chain subagents from the main conversation.

### 9.3 Built-in Subagents

| Agent | Model | Tools | Purpose |
|---|---|---|---|
| **Explore** | Haiku (fast) | Read-only (denied Write/Edit) | File discovery, code search, codebase exploration |
| **Plan** | Inherits from main | Read-only (denied Write/Edit) | Codebase research for planning |
| **General-purpose** | Inherits from main | All tools | Complex research, multi-step operations, code modifications |
| statusline-setup | Sonnet | - | Configure status line |
| Claude Code Guide | Haiku | - | Questions about Claude Code features |

**Explore thoroughness levels**: `quick` (targeted lookups), `medium` (balanced), `very thorough` (comprehensive)

### 9.4 Supported Frontmatter Fields (ALL)

| Field | Required | Description |
|---|---|---|
| `name` | **Yes** | Unique identifier using lowercase letters and hyphens |
| `description` | **Yes** | When Claude should delegate to this subagent |
| `tools` | No | Tools the subagent can use. Inherits all if omitted |
| `disallowedTools` | No | Tools to deny, removed from inherited or specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, full model ID, or `inherit` (default: `inherit`) |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Maximum agentic turns before subagent stops |
| `skills` | No | Skills to load into context at startup (full content injected) |
| `mcpServers` | No | MCP servers available to this subagent |
| `hooks` | No | Lifecycle hooks scoped to this subagent |
| `memory` | No | Persistent memory scope: `user`, `project`, or `local` |
| `background` | No | `true` to always run as background task (default: `false`) |
| `effort` | No | Effort level: `low`, `medium`, `high`, `xhigh`, `max` |
| `isolation` | No | `worktree` for isolated git worktree copy |
| `color` | No | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `initialPrompt` | No | Auto-submitted as first user turn when running as main session agent |

### 9.5 Subagent Scope & Priority

| Location | Scope | Priority |
|---|---|---|
| Managed settings | Organization-wide | 1 (highest) |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin's `agents/` directory | Where plugin enabled | 5 (lowest) |

When multiple subagents share the same name, higher-priority location wins.

### 9.6 Model Resolution Order

1. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable (if set)
2. Per-invocation `model` parameter
3. Subagent definition's `model` frontmatter
4. Main conversation's model

### 9.7 Tool Restriction Patterns

- `tools: Read, Grep, Glob, Bash` - Allowlist (only these tools)
- `disallowedTools: Write, Edit` - Denylist (inherit everything except these)
- If both set: `disallowedTools` applied first, then `tools` resolved against remaining
- `Agent(worker, researcher)` in tools field - Restrict which subagent types can be spawned
- `Agent` without parentheses - Allow spawning any subagent
- Agent omitted from tools list - Cannot spawn any subagents

### 9.8 Permission Mode Inheritance

- If parent uses `bypassPermissions` or `acceptEdits`: takes precedence, cannot be overridden
- If parent uses `auto` mode: subagent inherits auto mode, `permissionMode` frontmatter ignored
- Plugin subagents do NOT support `hooks`, `mcpServers`, or `permissionMode` (ignored)

### 9.9 Memory Scopes

| Scope | Location | Use When |
|---|---|---|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT checked in |

When enabled: includes first 200 lines or 25KB of `MEMORY.md` (whichever first); Read/Write/Edit tools auto-enabled.

### 9.10 Foreground vs Background Subagents

- **Foreground**: Block main conversation; permission prompts and clarifying questions passed through
- **Background**: Run concurrently; pre-approve permissions upfront; auto-deny anything not pre-approved; clarifying questions fail but subagent continues
- Claude decides based on task; user can press **Ctrl+B** to background a running task

### 9.11 Subagent File Format

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

The body becomes the system prompt. Subagents receive ONLY this system prompt (plus basic environment details), NOT the full Claude Code system prompt.

---

## 10. CLI SESSION MANAGEMENT

> **Source:** https://code.claude.com/docs/en/cli — "Session management flags"

### 10.1 Core Session Commands

| Command | Description |
|---|---|
| `claude` | Start interactive session |
| `claude "query"` | Start with initial prompt |
| `claude -p "query"` | Print mode: query via SDK, then exit |
| `claude -c` / `claude --continue` | Continue most recent conversation in current directory |
| `claude -c -p "query"` | Continue via SDK |
| `claude -r "<session>" "query"` / `claude --resume` | Resume session by ID or name |

### 10.2 Session Management Flags

| Flag | Description |
|---|---|
| `--continue`, `-c` | Load most recent conversation in current directory |
| `--resume`, `-r` | Resume specific session by ID or name, or show interactive picker |
| `--fork-session` | When resuming, create new session ID instead of reusing original (use with `--resume` or `--continue`) |
| `--name`, `-n` | Set display name for session (shown in `/resume` and terminal title) |
| `--session-id` | Use specific session ID (must be valid UUID) |
| `--from-pr` | Resume sessions linked to specific GitHub PR |
| `--no-session-persistence` | Disable session persistence (print mode only) |

### 10.3 Key Print Mode Flags

| Flag | Description |
|---|---|
| `-p`, `--print` | Print response without interactive mode |
| `--output-format` | `text`, `json`, `stream-json` |
| `--input-format` | `text`, `stream-json` |
| `--max-turns` | Limit agentic turns (print mode only) |
| `--max-budget-usd` | Maximum dollar spend before stopping (print mode only) |
| `--json-schema` | Get validated JSON output matching schema |
| `--fallback-model` | Automatic fallback when default model overloaded |

### 10.4 System Prompt Flags

| Flag | Behavior |
|---|---|
| `--system-prompt` | Replaces entire default prompt |
| `--system-prompt-file` | Replaces with file contents |
| `--append-system-prompt` | Appends to default prompt |
| `--append-system-prompt-file` | Appends file contents to default prompt |

`--system-prompt` and `--system-prompt-file` are mutually exclusive. Append flags can combine with either.

### 10.5 Other Important Flags

| Flag | Description |
|---|---|
| `--model` | Set model: alias (`sonnet`, `opus`) or full name |
| `--agent` | Specify agent for current session |
| `--agents` | Define custom subagents dynamically via JSON |
| `--permission-mode` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` |
| `--dangerously-skip-permissions` | Skip all permission prompts |
| `--bare` | Minimal mode: skip auto-discovery of hooks, skills, plugins, MCP, CLAUDE.md |
| `--tools` | Restrict which built-in tools available: `""` (none), `"default"` (all), `"Bash,Edit,Read"` |
| `--allowedTools` | Tools that execute without permission prompts |
| `--disallowedTools` | Tools removed from context entirely |
| `--worktree`, `-w` | Start in isolated git worktree |
| `--effort` | `low`, `medium`, `high`, `xhigh`, `max` |
| `--debug` | Enable debug mode with optional category filtering |
| `--add-dir` | Add additional working directories |
| `--mcp-config` | Load MCP servers from JSON files |
| `--betas` | Beta headers for API requests |
| `--exclude-dynamic-system-prompt-sections` | Move per-machine sections to first user message (improves prompt cache reuse) |

### 10.6 `/compact` Command

- Triggers context compaction manually
- Matcher values for `PreCompact`/`PostCompact` hooks: `manual`, `auto`
- Auto-compaction triggers at approximately **95% capacity** (configurable via `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`)

---

## 11. PROGRAMMATIC ENFORCEMENT vs PROMPT-BASED

### 11.1 Deterministic Guarantees (Hooks)

Hooks provide **deterministic, programmatic enforcement**:

- Exit code 2 from a `PreToolUse` hook will **always** block the tool call
- `permissionDecision: "deny"` will **always** prevent execution
- `updatedInput` will **always** modify tool parameters before execution
- No amount of prompt injection can bypass a hook that returns exit code 2
- Hooks run outside the model's control - the model cannot skip or modify them

**Use cases for deterministic enforcement**:
- Blocking dangerous commands (`rm -rf /`)
- Enforcing read-only access for specific agents
- Validating SQL queries (only SELECT allowed)
- Modifying commands before execution (adding safety flags)
- Enforcing organization security policies via managed settings

### 11.2 Probabilistic Guidance (Prompts)

System prompts and tool descriptions provide **probabilistic guidance**:

- The model "usually" follows instructions but can deviate
- Prompt injection attacks can potentially override instructions
- Complex or ambiguous instructions may be misinterpreted
- No guarantee of compliance - the model makes best-effort decisions

**Use cases where prompts suffice**:
- Stylistic preferences (output format, tone)
- General behavioral guidance
- Tool selection hints (descriptions help Claude choose)
- When the consequence of deviation is low

### 11.3 Comparison Table

| Aspect | Hooks (Deterministic) | Prompts (Probabilistic) |
|---|---|---|
| Guarantee level | 100% - code enforced | Best effort - model may deviate |
| Bypass risk | None (runs outside model) | Prompt injection possible |
| Latency | Adds hook execution time | Zero additional latency |
| Flexibility | Binary (allow/deny/modify) | Nuanced reasoning possible |
| Configuration | JSON in settings files | Natural language |
| Scope | Specific tool calls | General behavior |

### 11.4 `strict: true` as a Third Category

Strict tool use provides **deterministic schema enforcement at the API level**:
- Guarantees tool inputs match JSON Schema (grammar-constrained sampling)
- Prevents type mismatches, missing fields, invalid values
- Operates at the sampling level - not bypassable by the model
- Complementary to hooks: strict validates schema, hooks validate semantics

---

## 12. MULTI-AGENT ORCHESTRATION PATTERNS

### 12.1 Orchestrator-Workers (Hub-and-Spoke)

From the "Building Effective Agents" guide:
- Central LLM **dynamically** decomposes tasks based on input analysis
- Delegates to worker LLMs that execute subtasks
- Workers return results to orchestrator for synthesis
- **Key difference from parallelization**: decomposition is dynamic, not predefined

In Claude Code implementation:
- Main conversation acts as orchestrator
- Subagents (Agent tool) serve as workers
- Each worker has own context window, tool restrictions, model
- Workers return summaries to orchestrator

### 12.2 Coordinator-Subagent Pattern

In Claude Code:
- Coordinator = main conversation thread
- Subagents = specialized workers spawned via Agent tool
- Context isolation: subagent works in own context, returns summary only
- No nesting: subagents cannot spawn other subagents
- Chaining: coordinator can invoke subagents in sequence, passing context between them

### 12.3 Agent Teams (Parallel Multi-Agent)

- Multiple agents working in parallel, communicating with each other
- Different from subagents: coordinate across separate sessions
- Subagents work within a single session
- Teammates can be resumed via `SendMessage` tool

### 12.4 Context Isolation Mechanisms

| Mechanism | Isolation Level | Context Sharing |
|---|---|---|
| Subagent (foreground) | Own context window | Returns summary to parent |
| Subagent (background) | Own context window + concurrent | Returns summary when done |
| Subagent with `isolation: worktree` | Own context + isolated git copy | Returns summary + changes |
| Agent teams | Separate sessions entirely | Communicate via SendMessage |
| `--fork-session` | New session ID from existing point | Independent from fork point |

---

## 13. HOOK LIFECYCLE FLOW (Complete)

```
SessionStart
  |
InstructionsLoaded (at start)
  |
UserPromptSubmit --> [LOOP]
  |
  Agentic Loop:
    PreToolUse --> PermissionRequest --> [PermissionDenied | Block]
      |
    PostToolUse / PostToolUseFailure
      |
    SubagentStart --> ... --> SubagentStop
      |
    TaskCreated --> TaskCompleted
      |
    [Async: Notification, FileChanged, CwdChanged, ConfigChange, InstructionsLoaded]
  |
Stop / StopFailure
  |
[Async: PreCompact --> PostCompact]
  |
TeammateIdle
  |
[Async: WorktreeCreate, WorktreeRemove]
  |
SessionEnd
```

---

## 14. PERMISSION UPDATE ENTRIES (PermissionRequest Hook Output)

```json
{
  "type": "addRules|replaceRules|removeRules|setMode|addDirectories|removeDirectories",
  "rules": [{"toolName": "Bash", "ruleContent": "optional-pattern"}],
  "behavior": "allow|deny|ask",
  "mode": "default|acceptEdits|dontAsk|bypassPermissions|plan",
  "directories": ["/path/to/dir"],
  "destination": "session|localSettings|projectSettings|userSettings"
}
```

**Destination values**:
- `session` - In-memory only (discarded at session end)
- `localSettings` - `.claude/settings.local.json`
- `projectSettings` - `.claude/settings.json`
- `userSettings` - `~/.claude/settings.json`

---

## 15. WHEN TO USE TOOLS vs NOT

### Use Tools When:
- **Actions with side effects**: Sending email, writing file, updating record
- **Fresh or external data**: Current prices, today's weather, database contents
- **Structured, guaranteed-shape outputs**: Need JSON with specific fields (not prose)
- **Calling into existing systems**: Databases, internal APIs, file systems

### Don't Use Tools When:
- Model can answer from training alone (summarization, translation, general knowledge)
- One-shot Q&A with no side effects
- Tool-calling latency would dominate a trivial response

**Key heuristic**: "If you're writing a regex to extract a decision from model output, that decision should have been a tool call."

---

## 16. KEY API FACTS FOR EXAM

### Message Structure
- `user` messages contain: client content + `tool_result` blocks
- `assistant` messages contain: AI-generated text + `tool_use` blocks
- Claude API integrates tools into `user`/`assistant` structure (no separate `tool` or `function` role)

### Content Block Types
- `text` - Text content
- `tool_use` - Client tool call (id prefix: `toolu_`)
- `tool_result` - Tool execution result
- `server_tool_use` - Server tool call (id prefix: `srvtoolu_`)
- `image` - Image content
- `document` - Document content

### Tool Name Regex
`^[a-zA-Z0-9_-]{1,64}$`

### Input Examples Limitations
- Each example must validate against `input_schema` (400 error if invalid)
- NOT supported for server-side tools
- Token cost: ~20-50 tokens simple, ~100-200 tokens complex nested

### Model Behavior Notes
- Claude Opus is much more likely to ask for clarification when parameters are missing
- Claude Sonnet may infer/guess reasonable values for missing parameters
- When `tool_choice` is `any` or `tool`, model will NOT emit natural language before tool_use blocks
- Claude retries invalid tool calls 2-3 times with corrections before apologizing
