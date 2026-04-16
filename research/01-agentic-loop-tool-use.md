# Research: Agentic Loop & Tool Use
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/agentic-loops, https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview

## stop_reason Values (6 total)

| stop_reason | Meaning | Action |
|---|---|---|
| `end_turn` | Claude is done; no more tool calls needed | Return the final response to the user |
| `tool_use` | Claude wants to call one or more tools | Execute tool(s), append tool_result, loop again |
| `max_tokens` | Response hit the max_tokens limit | Decide whether to continue or truncate |
| `stop_sequence` | A custom stop sequence was matched | Handle based on which sequence triggered |
| `pause_turn` | Server-side loop hit its internal iteration limit while executing server tools (web_search, code_execution) | Re-send the conversation including the paused response to let Claude continue |
| `refusal` | Claude declined to respond (safety) | Log and handle gracefully; do not retry |

## Three Tool Execution Buckets

### A. User-defined tools (client-executed)
- You write the schema, you execute the code, you return results
- Response contains `tool_use` block; you send back `tool_result`

### B. Anthropic-schema tools (client-executed)
- Anthropic publishes the schema, your application handles execution
- Tools: `bash`, `text_editor`, `computer`, `memory`
- Schemas are "trained-in" — Claude optimized on thousands of successful trajectories

### C. Server-executed tools
- Tools: `web_search`, `web_fetch`, `code_execution`, `tool_search` (plus `advisor` in beta)
- Anthropic runs the code on its infrastructure
- You **never** construct a `tool_result` for these
- Response contains `server_tool_use` blocks (with `srvtoolu_` prefix on id)
- Results appear in the same assistant turn
- Server runs its own internal loop: may trigger several searches/executions before responding

## pause_turn Behavior (exact details)
- **When it occurs**: The server-side loop hits its internal iteration limit while executing server tools
- **Meaning**: The work is not finished; Claude was still iterating
- **How to resume**: Re-send the conversation including the paused response content as an assistant message
- **Key rules**:
  - Pass the paused response back **as-is** in `{"role": "assistant", "content": response.content}`
  - Include the **same tools** in the continuation request

## tool_use Block Structure
```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA" }
}
```

## tool_result Block Structure and Formatting Rules

### Basic structure:
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "15 degrees",
  "is_error": false
}
```

### Valid content types inside the content array:
1. **Plain string**: `"content": "15 degrees"`
2. **text block**: `{"type": "text", "text": "15 degrees"}`
3. **image block**: `{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}`
4. **document block**: `{"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "..."}}`

### CRITICAL ORDERING RULES:

**Rule 1 — No intermediate messages**: Tool result blocks MUST immediately follow their corresponding tool use blocks. You CANNOT include any messages between the assistant's tool_use message and the user's tool_result message.

**Rule 2 — tool_result blocks come FIRST in content array**: In the user message containing tool results, `tool_result` blocks must come FIRST. Any `text` must come AFTER all tool results. Violating this causes a **400 error**.

## is_error Behavior
- When `is_error: true`, Claude incorporates the error into its response
- **Retry behavior**: Claude will retry **2-3 times with corrections** before apologizing
- Best practice: Write **instructive error messages**, not generic ones
- Example: `"Rate limit exceeded. Retry after 60 seconds."`

## Tool Name Regex
- Must match: `^[a-zA-Z0-9_-]{1,64}$`

## Agentic Loop Pattern
1. Send request with `tools` array and user message
2. Claude responds with `stop_reason: "tool_use"` and tool_use blocks
3. Execute each tool, format as tool_result blocks
4. Send new request with original messages + assistant response + user message with tool_results
5. Repeat while `stop_reason == "tool_use"` OR `stop_reason == "pause_turn"`
6. Exit on: `end_turn`, `max_tokens`, `stop_sequence`, `refusal`
