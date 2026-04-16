# Research: tool_choice Configuration
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/tool-use/define-tools

## All 4 tool_choice Modes

| Mode | Syntax | Behavior |
|---|---|---|
| `auto` | `{"type": "auto"}` | Claude decides whether to call any tools. **Default when tools provided.** |
| `any` | `{"type": "any"}` | Claude MUST use one tool, but can choose which |
| `tool` | `{"type": "tool", "name": "<name>"}` | Forces a specific tool |
| `none` | `{"type": "none"}` | Prevents tool use. **Default when no tools provided.** |

## Prefilling Behavior with any/tool
- When tool_choice is `any` or `tool`, the API **prefills the assistant message** to force tool use
- Claude will **NOT emit natural language** before tool_use blocks, even if explicitly asked
- To get natural language + specific tool: use `auto` with explicit instructions in user message

## Extended Thinking Restrictions
- `tool_choice: any` and `tool_choice: tool` are **NOT supported** with extended thinking → **error**
- Only `auto` and `none` are compatible with extended thinking

## Caching Impact
- Changes to `tool_choice` **invalidate cached message blocks**
- Tool definitions and system prompts **remain cached**

## Combining with strict
- `tool_choice: any` + `strict: true` = guarantees BOTH that a tool is called AND inputs match schema
