# Research: Strict Tool Use
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/tool-use/strict-tool-use

## How strict: true Works
- Uses **grammar-constrained sampling** to guarantee Claude's tool inputs match your JSON Schema
- Compiles tool `input_schema` definitions into grammars using the same pipeline as structured outputs
- `strict` is a **top-level property** on the tool definition
- Available on: **All tools except `mcp_toolset`**

## Guarantees
- Tool `input` strictly follows the `input_schema`
- Tool `name` is always valid
- Functions receive correctly-typed arguments every time
- No need to validate and retry tool calls

## Schema Caching
- **Duration**: Cached for **up to 24 hours since last use**
- **What is cached**: Compiled grammar artifacts only
- **What is NOT retained**: Prompts and responses are NOT retained beyond the API response
- **Cache invalidation**: Changing JSON schema structure invalidates; changing only `name` or `description` does NOT

## PHI Restrictions (HIPAA)
- Strict tool use is **HIPAA eligible**
- **PHI must NOT be included in tool schema definitions**
- Cached schemas do not receive same PHI protections as prompts/responses
- Do NOT include PHI in: `input_schema` property names, `enum` values, `const` values, or `pattern` regular expressions
- PHI should only appear in message content (prompts and responses)

## additionalProperties Requirement
- Must be set to `false` for ALL objects
- Setting it to anything other than `false` returns a **400 error**

## Extended Thinking Compatibility
- With extended thinking, only `tool_choice: auto` and `tool_choice: none` are compatible
- `tool_choice: any` and `tool_choice: tool` **return an error** with extended thinking

## Complexity Limits
| Limit | Value |
|---|---|
| Strict tools per request | **20** |
| Optional parameters (total across all strict schemas) | **24** |
| Parameters with union types (total) | **16** |
| Compilation timeout | **180 seconds** |
