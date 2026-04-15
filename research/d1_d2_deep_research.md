# Domain 1 & Domain 2 Deep Research -- Exact Technical Details
## Sources: Anthropic Official Documentation (platform.claude.com, code.claude.com, modelcontextprotocol.io)
## Extracted: 2026-04-15

---

# DOMAIN 1: AGENTIC ARCHITECTURE

---

## 1. THE TOOL-USE CONTRACT

Tool use is a **contract** between your application and the model:
- You specify what operations are available and what shape their inputs/outputs take
- Claude decides **when and how** to call them
- **The model never executes anything on its own** -- it emits a structured request, your code (or Anthropic's servers) runs the operation, and the result flows back into the conversation

---

## 2. WHERE TOOLS RUN -- THREE BUCKETS

### 2a. User-Defined Tools (Client-Executed)
- You write the schema, you execute the code, you return the results
- The vast majority of tool-use traffic
- When Claude uses a tool, the API response contains a `tool_use` block with tool name and JSON arguments
- Your app extracts args, runs the operation, sends output back in a `tool_result` block
- **Claude never sees your implementation** -- only the schema and the result

### 2b. Anthropic-Schema Tools (Client-Executed)
- Anthropic publishes the schema, your application handles execution
- Tools in this category: **`bash`**, **`text_editor`**, **`computer`**, **`memory`**
- Execution model identical to user-defined tools (`tool_use` -> you run -> `tool_result`)
- These schemas are **trained-in** -- Claude has been optimized on thousands of successful trajectories using these exact tool signatures
- Claude calls them more reliably and recovers from errors more gracefully

### 2c. Server-Executed Tools
- Tools: **`web_search`**, **`web_fetch`**, **`code_execution`**, **`tool_search`**
- Anthropic runs the code; you enable the tool and the server handles everything
- You **never** construct a `tool_result` block for these tools
- Response contains **`server_tool_use`** blocks (execution already complete by the time you see them)
- Server tools run their own internal loop with an **iteration limit**

---

## 3. THE AGENTIC LOOP -- EXACT 5 STEPS

The canonical shape is a `while` loop keyed on `stop_reason`:

1. **Send a request** with your `tools` array and the user message
2. **Claude responds** with `stop_reason: "tool_use"` and one or more `tool_use` blocks
3. **Execute each tool.** Format the outputs as `tool_result` blocks
4. **Send a new request** containing the original messages, the assistant's response, and a user message with the `tool_result` blocks
5. **Repeat from step 2** while `stop_reason` is `"tool_use"`

**Loop exit condition:** `while stop_reason == "tool_use"`, execute tools and continue. The loop exits on any other stop reason.

---

## 4. ALL stop_reason VALUES

| Value | Meaning |
|-------|---------|
| `"end_turn"` | Claude has produced a final answer |
| `"tool_use"` | Claude wants to use one or more tools (loop continues) |
| `"max_tokens"` | Response hit the max_tokens limit |
| `"stop_sequence"` | A stop sequence was matched |
| `"refusal"` | Claude refused the request |
| `"pause_turn"` | Server-side loop hit iteration limit -- re-send conversation to continue |

---

## 5. CONTENT BLOCK TYPES

Messages contain arrays of these block types:
- **`text`** -- text content
- **`tool_use`** -- Claude requesting tool execution (in `assistant` messages)
- **`tool_result`** -- Your tool execution results (in `user` messages)
- **`server_tool_use`** -- Server-executed tool calls (in responses, already executed)
- **`image`** -- Image content (in tool results)
- **`document`** -- Document content (in tool results)

---

## 6. EXACT tool_use BLOCK FORMAT

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA", "unit": "celsius" }
}
```

Fields:
- **`id`**: Unique identifier for this tool use block (used to match tool results later)
- **`name`**: The name of the tool being used
- **`input`**: Object containing input conforming to the tool's `input_schema`

---

## 7. EXACT API RESPONSE WITH TOOL USE

```json
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-opus-4-6",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather in San Francisco for you."
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

Key: Claude may include BOTH `text` AND `tool_use` blocks in a single response. The text is natural language commentary about what it's doing.

---

## 8. SERVER-SIDE LOOP AND pause_turn

- Server-executed tools run their own loop inside Anthropic's infrastructure
- A single request may trigger several web searches/code executions before response
- Has an **iteration limit**
- If model is still iterating when it hits the cap: `stop_reason: "pause_turn"`
- A paused turn means work isn't finished; **re-send the conversation** (including the paused response) to let the model continue

---

## 9. WHEN TO USE TOOLS (AND WHEN NOT TO)

**Use tools for:**
- Actions with side effects (sending email, writing file, updating record)
- Fresh or external data (current prices, today's weather, database contents)
- Structured, guaranteed-shape outputs (need specific JSON fields, not prose)
- Calling into existing systems (databases, internal APIs, file systems)

**Key signal you should use tools:** If you're writing a regex to extract a decision from model output, that decision should have been a tool call.

**Don't use tools for:**
- Model can answer from training alone (summarization, translation, general knowledge)
- One-shot Q&A with no side effects
- Tool-calling latency would dominate a trivial response

---

# DOMAIN 2: TOOL DESIGN & MCP

---

## 10. TOOL DEFINITION -- EXACT JSON SCHEMA FORMAT

### Tool Definition Parameters

| Parameter | Description |
|-----------|-------------|
| `name` | Must match regex `^[a-zA-Z0-9_-]{1,64}$` |
| `description` | Detailed plaintext description of what the tool does, when to use it, how it behaves |
| `input_schema` | A JSON Schema object defining expected parameters |
| `input_examples` | (Optional) Array of example input objects |

### Additional Optional Properties (from Tool Reference)
- `cache_control` -- for prompt caching
- `strict` -- for grammar-constrained sampling
- `defer_loading` -- deferred tool loading
- `allowed_callers` -- restrict which callers can use the tool

### Complete Tool Definition Example

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
        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
      }
    },
    "required": ["location"]
  }
}
```

### Good vs Poor Tool Description Example

**Good** (at least 3-4 sentences):
```json
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

**Poor** (too brief):
```json
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

---

## 11. TOOL DESCRIPTION BEST PRACTICES

1. **Provide extremely detailed descriptions** -- most important factor in tool performance. Include:
   - What the tool does
   - When it should be used (and when it shouldn't)
   - What each parameter means and how it affects behavior
   - Important caveats or limitations
   - Aim for at least **3-4 sentences per tool**, more for complex tools

2. **Prioritize descriptions, but consider `input_examples` for complex tools** -- for tools with complex inputs, nested objects, or format-sensitive parameters

3. **Consolidate related operations into fewer tools** -- use an `action` parameter instead of separate tools (`create_pr`, `review_pr`, `merge_pr` -> single tool with `action`)

4. **Use meaningful namespacing in tool names** -- prefix with service (e.g., `github_list_prs`, `slack_send_message`), especially important for tool search

5. **Design tool responses to return only high-signal information** -- return semantic, stable identifiers (slugs/UUIDs) rather than opaque internal references

---

## 12. input_examples FIELD

- Optional field on tool definition
- Array of example input objects
- Each example **must be valid according to the tool's `input_schema`** (invalid examples return 400 error)
- **Not supported for server-side tools** (only user-defined and Anthropic-schema client tools)
- Token cost: ~20-50 tokens for simple examples, ~100-200 tokens for complex nested objects

```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": { ... },
  "input_examples": [
    {"location": "San Francisco, CA", "unit": "fahrenheit"},
    {"location": "Tokyo, Japan", "unit": "celsius"},
    {"location": "New York, NY"}
  ]
}
```

---

## 13. tool_choice -- EXACT OPTIONS

Four possible options for `tool_choice`:

| Option | Syntax | Behavior |
|--------|--------|----------|
| `auto` | `{"type": "auto"}` | Claude decides whether to call tools. **Default when `tools` are provided.** |
| `any` | `{"type": "any"}` | Claude **must** use one of the provided tools, but doesn't force a particular one |
| `tool` | `{"type": "tool", "name": "get_weather"}` | Forces Claude to **always** use a particular tool |
| `none` | `{"type": "none"}` | Prevents Claude from using any tools. **Default when no `tools` provided.** |

**Critical details:**
- When `tool_choice` is `any` or `tool`, the API **prefills the assistant message** to force tool use
- This means the model will **NOT emit natural language** before `tool_use` blocks, even if explicitly asked
- Changes to `tool_choice` **invalidate cached message blocks** (tool definitions and system prompts remain cached)
- With **extended thinking**: only `auto` and `none` are supported. `any` and `tool` return an error
- With **Claude Mythos Preview**: only `auto` and `none` are supported. `any` and `tool` return 400 error

---

## 14. STRICT TOOL USE (`strict: true`)

### What It Does
- Uses **grammar-constrained sampling** to guarantee Claude's tool inputs match your JSON Schema
- Set `"strict": true` as a **top-level property** in tool definition (alongside `name`, `description`, `input_schema`)
- Default is `false` (not strict)

### Guarantees
- Tool `input` **strictly follows** the `input_schema`
- Tool `name` is always valid (from provided tools or server tools)
- Functions receive correctly-typed arguments every time
- No need to validate and retry tool calls

### Best Practice with strict
- Recommend using `"additionalProperties": false` in `input_schema` with strict mode
- Combine `tool_choice: {"type": "any"}` with `strict: true` to guarantee BOTH that a tool will be called AND inputs follow schema

### Schema Caching
- Strict mode compiles `input_schema` into grammars (same pipeline as structured outputs)
- Tool schemas **temporarily cached for up to 24 hours** since last use
- Prompts and responses are NOT retained beyond the API response
- HIPAA eligible, but **PHI must NOT be in tool schema definitions** (not in property names, enum values, const values, or pattern regexes)

### Strict Tool Example

```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"]
      }
    },
    "required": ["location"],
    "additionalProperties": false
  }
}
```

---

## 15. TOOL USE SYSTEM PROMPT (AUTO-GENERATED)

When you call with the `tools` parameter, the API constructs this system prompt:

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

---

## 16. HANDLING TOOL CALLS -- tool_result FORMAT

### Steps When Receiving tool_use Response

1. Extract `name`, `id`, and `input` from the `tool_use` block
2. Run the actual tool corresponding to that tool name, passing the `input`
3. Continue the conversation by sending a new message with `role: "user"` and `tool_result` content block

### tool_result Fields

| Field | Description |
|-------|-------------|
| `tool_use_id` | The `id` of the tool use request this is a result for |
| `content` | Result as a string, list of nested content blocks, or list of document blocks |
| `is_error` | (Optional) Set to `true` if tool execution resulted in an error |

### Content Types Supported in tool_result
- **String**: `"content": "15 degrees"`
- **Text blocks**: `"content": [{"type": "text", "text": "15 degrees"}]`
- **Image blocks**: `"content": [{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}]`
- **Document blocks**: `"content": [{"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}}]`

### Successful Tool Result Example

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

### Tool Result with Image

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        { "type": "text", "text": "15 degrees" },
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg..."
          }
        }
      ]
    }
  ]
}
```

### Empty Tool Result (no content needed)

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9"
    }
  ]
}
```

### Tool Result with Document

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        { "type": "text", "text": "The weather is" },
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 degrees"
          }
        }
      ]
    }
  ]
}
```

---

## 17. CRITICAL FORMATTING REQUIREMENTS FOR tool_result

- Tool result blocks **must immediately follow** their corresponding tool use blocks in message history
- **Cannot include any messages** between the assistant's tool use message and the user's tool result message
- In the user message, **tool_result blocks must come FIRST** in the content array. Any text must come AFTER all tool results

**WRONG (causes 400 error):**
```json
{
  "role": "user",
  "content": [
    { "type": "text", "text": "Here are the results:" },
    { "type": "tool_result", "tool_use_id": "toolu_01" }
  ]
}
```

**CORRECT:**
```json
{
  "role": "user",
  "content": [
    { "type": "tool_result", "tool_use_id": "toolu_01" },
    { "type": "text", "text": "What should I do next?" }
  ]
}
```

---

## 18. ERROR HANDLING WITH is_error

### Tool Execution Error
```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: the weather service API is not available (HTTP 500)",
      "is_error": true
    }
  ]
}
```

### Invalid Tool Call / Missing Parameters
```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Missing required 'location' parameter",
      "is_error": true
    }
  ]
}
```

**Key behavior:** If a tool request is invalid or missing parameters, Claude will **retry 2-3 times** with corrections before apologizing to the user.

**Best practice for error messages:** Write instructive error messages. Instead of generic `"failed"`, include what went wrong and what Claude should try next, e.g., `"Rate limit exceeded. Retry after 60 seconds."`

### Server Tool Error Codes (web_search)
- `too_many_requests`: Rate limit exceeded
- `invalid_input`: Invalid search query parameter
- `max_uses_exceeded`: Maximum web search tool uses exceeded
- `query_too_long`: Query exceeds maximum length
- `unavailable`: An internal error occurred

---

## 19. API MESSAGE STRUCTURE

- Unlike other APIs that use special roles like `tool` or `function`, Claude integrates tools into `user` and `assistant` messages
- `user` messages contain: client content + `tool_result`
- `assistant` messages contain: AI-generated content + `tool_use`
- Content arrays can contain `text`, `image`, `tool_use`, and `tool_result` blocks

---

# CLAUDE AGENT SDK -- HOOKS

---

## 20. ALL HOOK EVENT TYPES

| Hook Event | Python SDK | TypeScript SDK | Trigger |
|------------|-----------|----------------|---------|
| `PreToolUse` | Yes | Yes | Tool call request (can block or modify) |
| `PostToolUse` | Yes | Yes | Tool execution result |
| `PostToolUseFailure` | Yes | Yes | Tool execution failure |
| `UserPromptSubmit` | Yes | Yes | User prompt submission |
| `Stop` | Yes | Yes | Agent execution stop |
| `SubagentStart` | Yes | Yes | Subagent initialization |
| `SubagentStop` | Yes | Yes | Subagent completion |
| `PreCompact` | Yes | Yes | Conversation compaction request |
| `PermissionRequest` | Yes | Yes | Permission dialog would be displayed |
| `SessionStart` | No | Yes | Session initialization |
| `SessionEnd` | No | Yes | Session termination |
| `Notification` | Yes | Yes | Agent status messages |
| `Setup` | No | Yes | Session setup/maintenance |
| `TeammateIdle` | No | Yes | Teammate becomes idle |
| `TaskCompleted` | No | Yes | Background task completes |
| `ConfigChange` | No | Yes | Configuration file changes |
| `WorktreeCreate` | No | Yes | Git worktree created |
| `WorktreeRemove` | No | Yes | Git worktree removed |

**Note:** `SessionStart` and `SessionEnd` are TypeScript-only for SDK callback hooks. In Python, they are only available as shell command hooks from settings files.

---

## 21. HOOK CONFIGURATION FORMAT

### TypeScript
```typescript
const options = {
  hooks: {
    PreToolUse: [{ matcher: "Bash", hooks: [myCallback] }]
  }
};
```

### Python
```python
options = ClaudeAgentOptions(
    hooks={"PreToolUse": [HookMatcher(matcher="Bash", hooks=[my_callback])]}
)
```

The `hooks` option is a dictionary/object where:
- **Keys**: hook event names (`'PreToolUse'`, `'PostToolUse'`, `'Stop'`, etc.) -- **case-sensitive**
- **Values**: arrays of matchers, each containing optional filter pattern and callback functions

---

## 22. MATCHER CONFIGURATION

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `matcher` | `string` | `undefined` | Regex pattern matched against event's filter field (for tool hooks = tool name) |
| `hooks` | `HookCallback[]` | required | Array of callback functions |
| `timeout` | `number` | `60` | Timeout in seconds |

**Built-in tool names for matchers:** `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebFetch`, `Agent`

**MCP tool naming pattern:** `mcp__<server>__<action>` (e.g., `mcp__playwright__browser_screenshot`)

**Important:** Matchers only filter by **tool name**, NOT by file paths or arguments. To filter by file path, check `tool_input.file_path` inside your callback.

---

## 23. HOOK CALLBACK SIGNATURE

Every hook callback receives **three arguments**:

1. **Input data**: typed object with event details
   - All hooks share: `session_id`, `cwd`, `hook_event_name`
   - `agent_id` and `agent_type`: populated in subagent context (TS: all hooks; Python: PreToolUse, PostToolUse, PostToolUseFailure only)
   - `PreToolUseHookInput`: includes `tool_name` and `tool_input`
   - `PostToolUseHookInput`: includes `tool_name` and tool result
   - `NotificationHookInput`: includes `message`
   - `SubagentStopHookInput`: includes `agent_id`, `agent_transcript_path`, `stop_hook_active`

2. **Tool use ID** (`str | None` / `string | undefined`): correlates `PreToolUse` and `PostToolUse` events for the same tool call

3. **Context**: TypeScript = `{ signal: AbortSignal }` for cancellation; Python = reserved for future use

---

## 24. HOOK OUTPUT / RETURN VALUES

### Top-Level Fields (control conversation)
- `systemMessage`: injects a message into conversation visible to model
- `continue` (`continue_` in Python): whether agent keeps running after hook

### hookSpecificOutput Fields (control current operation)
For **PreToolUse** hooks:
- `hookEventName`: identifies which hook type the output is for
- `permissionDecision`: `"allow"`, `"deny"`, or `"ask"`
- `permissionDecisionReason`: string explaining the decision
- `updatedInput`: modified tool input (must also include `permissionDecision: "allow"`)

For **PostToolUse** hooks:
- `additionalContext`: append information to the tool result

### Priority Rule
When multiple hooks apply: **deny > ask > allow**. If any hook returns `deny`, operation is blocked regardless of other hooks.

### Return `{}` (empty object) to allow without changes

### Example: Block a Tool
```typescript
return {
  systemMessage: "Remember: system directories like /etc are protected.",
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: "Writing to /etc is not allowed"
  }
};
```

### Example: Modify Input
```typescript
return {
  hookSpecificOutput: {
    hookEventName: preInput.hook_event_name,
    permissionDecision: "allow",
    updatedInput: {
      ...toolInput,
      file_path: `/sandbox${originalPath}`
    }
  }
};
```

**Critical:** When using `updatedInput`, you MUST also include `permissionDecision: 'allow'`. Always return a new object rather than mutating original `tool_input`.

### Async Output (for side effects only)
```typescript
return { async: true, asyncTimeout: 30000 };
```
```python
return {"async_": True, "asyncTimeout": 30000}
```
Cannot block, modify, or inject context (agent has already moved on).

---

## 25. HOOK CHAINING

Hooks execute in **the order they appear in the array**:

```python
options = ClaudeAgentOptions(
    hooks={
        "PreToolUse": [
            HookMatcher(hooks=[rate_limiter]),        # First: check rate limits
            HookMatcher(hooks=[authorization_check]),  # Second: verify permissions
            HookMatcher(hooks=[input_sanitizer]),      # Third: sanitize inputs
            HookMatcher(hooks=[audit_logger]),         # Last: log the action
        ]
    }
)
```

### Regex Matcher Examples
```python
# Match file modification tools
HookMatcher(matcher="Write|Edit|Delete", hooks=[file_security_hook]),
# Match all MCP tools
HookMatcher(matcher="^mcp__", hooks=[mcp_audit_hook]),
# Match everything (no matcher)
HookMatcher(hooks=[global_logger]),
```

---

## 26. NOTIFICATION HOOK EVENTS

Notification types: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`

Each notification includes `message` (human-readable) and optionally `title`.

---

# CLAUDE AGENT SDK -- SUBAGENTS

---

## 27. AgentDefinition FIELDS

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | `string` | **Yes** | Natural language description of when to use this agent |
| `prompt` | `string` | **Yes** | The agent's system prompt defining its role and behavior |
| `tools` | `string[]` | No | Allowed tool names. If omitted, inherits all tools |
| `model` | `'sonnet' \| 'opus' \| 'haiku' \| 'inherit'` | No | Model override. Defaults to main model if omitted |
| `skills` | `string[]` | No | List of skill names available to this agent |
| `memory` | `'user' \| 'project' \| 'local'` | No | Memory source (Python only) |
| `mcpServers` | `(string \| object)[]` | No | MCP servers available, by name or inline config |

**Critical constraint:** Subagents **cannot spawn their own subagents**. Don't include `Agent` in a subagent's `tools` array.

---

## 28. THREE WAYS TO CREATE SUBAGENTS

1. **Programmatically**: `agents` parameter in `query()` options (recommended for SDK)
2. **Filesystem-based**: markdown files in `.claude/agents/` directories
3. **Built-in general-purpose**: Claude can invoke built-in `general-purpose` subagent via Agent tool without you defining anything

Programmatically defined agents take **precedence** over filesystem-based agents with the same name.

---

## 29. HOW THE AGENT TOOL WORKS

- Subagents are invoked via the **Agent tool** (renamed from `"Task"` in Claude Code v2.1.63)
- `Agent` must be in `allowedTools` for subagent invocation to work
- To detect subagent invocation: check for `tool_use` blocks where `name` is `"Agent"` (or `"Task"` for older SDK versions)
- Messages from within a subagent include `parent_tool_use_id` field
- Current SDK releases emit `"Agent"` in `tool_use` blocks but still use `"Task"` in `system:init` tools list and in `result.permission_denials[].tool_name`

---

## 30. SUBAGENT CONTEXT ISOLATION

### What Subagents Receive:
- Its own system prompt (`AgentDefinition.prompt`)
- The Agent tool's prompt string
- Project CLAUDE.md (loaded via `settingSources`)
- Tool definitions (inherited from parent, or subset in `tools`)

### What Subagents Do NOT Receive:
- The parent's conversation history or tool results
- Skills (unless listed in `AgentDefinition.skills`)
- The parent's system prompt

**The ONLY channel from parent to subagent is the Agent tool's prompt string.** Include any file paths, error messages, or decisions the subagent needs directly in that prompt.

---

## 31. SUBAGENT PARALLELIZATION

Multiple subagents can run concurrently. Example: during code review, run `style-checker`, `security-scanner`, and `test-coverage` subagents simultaneously.

---

## 32. SUBAGENT TOOL RESTRICTION PATTERNS

| Use Case | Tools | Description |
|----------|-------|-------------|
| Read-only analysis | `Read`, `Grep`, `Glob` | Can examine but not modify or execute |
| Test execution | `Bash`, `Read`, `Grep` | Can run commands and analyze output |
| Code modification | `Read`, `Edit`, `Write`, `Grep`, `Glob` | Read/write without command execution |
| Full access | All tools (omit `tools` field) | Inherits all tools from parent |

---

## 33. SUBAGENT RESUMPTION

- Subagents can be resumed to continue where they left off
- Resumed subagents retain full conversation history
- Capture `session_id` from messages during first query
- Extract `agentId` from message content
- Resume: pass `resume: sessionId` in second query's options

### Transcript Persistence:
- Main conversation compaction does NOT affect subagent transcripts (stored separately)
- Subagent transcripts persist within their session
- Automatic cleanup based on `cleanupPeriodDays` setting (default: **30 days**)

---

## 34. DYNAMIC AGENT CONFIGURATION

Create agent definitions dynamically based on runtime conditions:

```python
def create_security_agent(security_level: str) -> AgentDefinition:
    is_strict = security_level == "strict"
    return AgentDefinition(
        description="Security code reviewer",
        prompt=f"You are a {'strict' if is_strict else 'balanced'} security reviewer...",
        tools=["Read", "Grep", "Glob"],
        model="opus" if is_strict else "sonnet",
    )
```

---

# MCP (MODEL CONTEXT PROTOCOL)

---

## 35. THREE MCP PRIMITIVES

| Feature | Description | Who Controls It |
|---------|-------------|-----------------|
| **Tools** | Functions the LLM can actively call; can write to databases, call APIs, modify files | **Model** (model-controlled) |
| **Resources** | Passive data sources providing read-only access to information for context | **Application** (application-controlled) |
| **Prompts** | Pre-built instruction templates that tell the model to work with specific tools and resources | **User** (user-controlled) |

---

## 36. MCP TOOLS -- PROTOCOL OPERATIONS

| Method | Purpose | Returns |
|--------|---------|---------|
| `tools/list` | Discover available tools | Array of tool definitions with schemas |
| `tools/call` | Execute a specific tool | Tool execution result |

### MCP Tool Definition Format
```typescript
{
  name: "searchFlights",
  description: "Search for available flights",
  inputSchema: {
    type: "object",
    properties: {
      origin: { type: "string", description: "Departure city" },
      destination: { type: "string", description: "Arrival city" },
      date: { type: "string", format: "date", description: "Travel date" }
    },
    required: ["origin", "destination", "date"]
  }
}
```

Note: MCP uses `inputSchema` (camelCase), while the Claude API uses `input_schema` (snake_case).

---

## 37. MCP RESOURCES -- PROTOCOL OPERATIONS

| Method | Purpose | Returns |
|--------|---------|---------|
| `resources/list` | List available direct resources | Array of resource descriptors |
| `resources/templates/list` | Discover resource templates | Array of resource template definitions |
| `resources/read` | Retrieve resource contents | Resource data with metadata |
| `resources/subscribe` | Monitor resource changes | Subscription confirmation |

### Resource URI Format
- Each resource has a unique URI: `file:///path/to/document.md`
- Declares its MIME type for content handling

### Two Discovery Patterns
- **Direct Resources**: Fixed URIs pointing to specific data (e.g., `calendar://events/2024`)
- **Resource Templates**: Dynamic URIs with parameters (e.g., `travel://activities/{city}/{category}`)

### Resource Template Example
```json
{
  "uriTemplate": "weather://forecast/{city}/{date}",
  "name": "weather-forecast",
  "title": "Weather Forecast",
  "description": "Get weather forecast for any city and date",
  "mimeType": "application/json"
}
```

---

## 38. MCP PROMPTS -- PROTOCOL OPERATIONS

| Method | Purpose | Returns |
|--------|---------|---------|
| `prompts/list` | Discover available prompts | Array of prompt descriptors |
| `prompts/get` | Retrieve prompt details | Full prompt definition with arguments |

### Prompt Definition Example
```json
{
  "name": "plan-vacation",
  "title": "Plan a vacation",
  "description": "Guide through vacation planning process",
  "arguments": [
    { "name": "destination", "type": "string", "required": true },
    { "name": "duration", "type": "number", "description": "days" },
    { "name": "budget", "type": "number", "required": false },
    { "name": "interests", "type": "array", "items": { "type": "string" } }
  ]
}
```

### Prompt UI Patterns
- Slash commands (typing "/" to see available prompts)
- Command palettes
- Dedicated UI buttons
- Context menus

---

## 39. MCP TOOL USER INTERACTION / SAFETY

Tools may require user consent prior to execution. Safety mechanisms include:
- Displaying available tools in UI
- Approval dialogs for individual tool executions
- Permission settings for pre-approving safe operations
- Activity logs showing all tool executions with results

---

# MCP IN CLAUDE CODE

---

## 40. .mcp.json FILE FORMAT

### Project Scope (.mcp.json at project root)
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

### HTTP Server Configuration
```json
{
  "mcpServers": {
    "stripe": {
      "type": "http",
      "url": "https://mcp.stripe.com"
    }
  }
}
```

### Local Scope (stored in ~/.claude.json)
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

### Plugin MCP Configuration
```json
{
  "mcpServers": {
    "database-tools": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_URL": "${DB_URL}"
      }
    }
  }
}
```

### With OAuth Configuration
```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "your-client-id",
        "callbackPort": 8080
      }
    }
  }
}
```

### With Dynamic Headers
```json
{
  "mcpServers": {
    "internal-api": {
      "type": "http",
      "url": "https://mcp.internal.example.com",
      "headersHelper": "/opt/bin/get-mcp-auth-headers.sh"
    }
  }
}
```

### With Auth Server Metadata Override
```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "authServerMetadataUrl": "https://auth.example.com/.well-known/openid-configuration"
      }
    }
  }
}
```

---

## 41. ENVIRONMENT VARIABLE EXPANSION

### Supported Syntax
- `${VAR}` -- expands to the value of environment variable `VAR`
- `${VAR:-default}` -- expands to `VAR` if set, otherwise uses `default`

### Expansion Locations (where variables can be expanded)
- `command` -- server executable path
- `args` -- command-line arguments
- `env` -- environment variables passed to server
- `url` -- for HTTP server types
- `headers` -- for HTTP server authentication

### Complete Example
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

**If a required env var is not set and has no default value, Claude Code will fail to parse the config.**

### Plugin-Specific Environment Variables
- `${CLAUDE_PLUGIN_ROOT}` -- for bundled plugin files
- `${CLAUDE_PLUGIN_DATA}` -- for persistent state that survives plugin updates

---

## 42. MCP INSTALLATION SCOPES

| Scope | Loads In | Shared with Team | Stored In |
|-------|----------|-----------------|-----------|
| **Local** (default) | Current project only | No | `~/.claude.json` |
| **Project** | Current project only | Yes, via version control | `.mcp.json` in project root |
| **User** | All your projects | No | `~/.claude.json` |

### Scope Precedence (highest to lowest)
1. Local scope
2. Project scope
3. User scope
4. Plugin-provided servers
5. claude.ai connectors

Duplicates matched by name (scopes) or by endpoint (plugins/connectors).

### Scope CLI Flags
- `--scope local` (default) -- only you, current project
- `--scope project` -- shared via `.mcp.json`
- `--scope user` -- you, all projects

**Note:** "local scope" for MCP servers is stored in `~/.claude.json` (home directory), NOT in `.claude/settings.local.json` (project directory).

---

## 43. MCP SERVER TRANSPORT TYPES

### HTTP (Recommended for remote)
```bash
claude mcp add --transport http <name> <url>
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### SSE (Deprecated -- use HTTP instead)
```bash
claude mcp add --transport sse <name> <url>
```

### Stdio (Local processes)
```bash
claude mcp add [options] <name> -- <command> [args...]
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

---

## 44. MCP CLI COMMANDS

```bash
# Add servers
claude mcp add --transport http <name> <url>
claude mcp add --transport stdio <name> -- <command> [args...]
claude mcp add-json <name> '<json>'
claude mcp add-from-claude-desktop

# Manage servers
claude mcp list
claude mcp get <server-name>
claude mcp remove <server-name>
claude mcp reset-project-choices

# Within Claude Code
/mcp   # Check server status, authenticate
```

### Option Ordering Rule
All options (`--transport`, `--env`, `--scope`, `--header`) must come **before** the server name. The `--` (double dash) separates the server name from the command and arguments.

### Windows Note
On native Windows (not WSL), use `cmd /c` wrapper:
```bash
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

---

## 45. MCP DYNAMIC FEATURES

- **`list_changed` notifications**: MCP servers can dynamically update available tools, prompts, and resources without disconnect/reconnect
- **Channels**: MCP server can push messages into your session (declares `claude/channel` capability, opt in with `--channels` flag)
- **`MAX_MCP_OUTPUT_TOKENS`**: Warning when tool output exceeds 10,000 tokens; set env var to increase
- **`MCP_TIMEOUT`**: Configure server startup timeout (e.g., `MCP_TIMEOUT=10000 claude` for 10-second timeout)

---

## 46. headersHelper DETAILS

- Command must write JSON object of string key-value pairs to stdout
- Command runs in shell with **10-second timeout**
- Dynamic headers override static `headers` with same name
- Helper runs fresh on each connection (no caching)

Environment variables set during helper execution:

| Variable | Value |
|----------|-------|
| `CLAUDE_CODE_MCP_SERVER_NAME` | Name of the MCP server |
| `CLAUDE_CODE_MCP_SERVER_URL` | URL of the MCP server |

---

## 47. MODEL RECOMMENDATION FOR TOOLS

- **Claude Opus 4.6**: Complex tools and ambiguous queries; handles multiple tools better and seeks clarification when needed
- **Claude Haiku**: Straightforward tools, but note it may infer missing parameters

---

## 48. COMPARISON TABLE: CHOOSING THE RIGHT APPROACH

| Approach | When to Use | What to Expect |
|----------|-------------|----------------|
| User-defined client tools | Custom business logic, internal APIs, proprietary data | You handle execution and the agentic loop |
| Anthropic-schema client tools | Standard dev ops (bash, file editing, browser control) | You handle execution; schema is trained-in |
| Server-executed tools | Web search, code sandbox, web fetch | Anthropic handles execution; results directly |

---

## 49. SUBAGENT TROUBLESHOOTING

- **Claude not delegating**: Include Agent tool in `allowedTools`; use explicit naming in prompt; write clear descriptions
- **Filesystem agents not loading**: Loaded at startup only; restart session for new files
- **Windows long prompt failures**: Command line limit is 8191 chars; keep prompts concise or use filesystem-based agents
- **Subagent permission prompts multiplying**: Subagents do NOT inherit parent permissions; use PreToolUse hooks to auto-approve
- **Recursive hook loops**: UserPromptSubmit hook spawning subagents can create infinite loops; check for subagent indicator in hook input

---

## 50. HOOK TROUBLESHOOTING

- Hook event names are **case-sensitive** (`PreToolUse`, not `preToolUse`)
- Hooks may not fire when agent hits `max_turns` limit (session ends before hooks execute)
- `systemMessage` adds context to conversation model sees, but may not appear in all SDK output modes
- When `updatedInput` not applied: ensure it's inside `hookSpecificOutput` (not top level), include `permissionDecision: "allow"`, and include `hookEventName`
