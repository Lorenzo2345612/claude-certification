# Quotes for Questions 205-254 (Part 4)

Sources consulted:
- Anthropic Docs — How tool use works: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works
- Anthropic Docs — Handle tool calls: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls
- Anthropic Docs — Define tools: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools
- Anthropic Docs — Strict tool use: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/strict-tool-use
- Claude Code Docs — Hooks: https://code.claude.com/docs/en/hooks
- Claude Code Docs — Subagents: https://code.claude.com/docs/en/subagents
- Claude Code Docs — MCP: https://code.claude.com/docs/en/mcp
- MCP Docs — Transports: https://modelcontextprotocol.io/docs/concepts/transports
- MCP Docs — Resources: https://modelcontextprotocol.io/docs/concepts/resources
- MCP Docs — Tools: https://modelcontextprotocol.io/docs/concepts/tools

---

## Q205 — pause_turn meaning and action

```json
{
  "id": 205,
  "source": "Anthropic Docs — How tool use works",
  "quote": "This internal loop has an iteration limit. If the model is still iterating when it hits the cap, the response comes back with stop_reason: \"pause_turn\" instead of \"end_turn\". A paused turn means the work isn't finished; re-send the conversation (including the paused response) to let the model continue where it left off.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "STRONG"
}
```

## Q206 — 6 possible stop_reason values

```json
{
  "id": 206,
  "source": "Anthropic Docs — How tool use works",
  "quote": "In practice this reads as: while stop_reason == \"tool_use\", execute the tools and continue the conversation. The loop exits on any other stop reason (\"end_turn\", \"max_tokens\", \"stop_sequence\", or \"refusal\"), which means Claude has either produced a final answer or stopped for another reason that your application should handle.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "STRONG"
}
```

Note: This paragraph plus the adjacent server-side loop paragraph (covering `pause_turn`) together enumerate the six values `end_turn`, `tool_use`, `max_tokens`, `stop_sequence`, `refusal`, `pause_turn`.

## Q207 — refusal is a distinct stop_reason

```json
{
  "id": 207,
  "source": "Anthropic Docs — How tool use works",
  "quote": "The loop exits on any other stop reason (\"end_turn\", \"max_tokens\", \"stop_sequence\", or \"refusal\"), which means Claude has either produced a final answer or stopped for another reason that your application should handle.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "PARTIAL"
}
```

Note: Docs list `refusal` as a distinct stop reason separate from `end_turn`; they do not explicitly compare the two but treat them as independent exit conditions.

## Q208 — Loop continuation and pause_turn re-send

```json
{
  "id": 208,
  "source": "Anthropic Docs — How tool use works",
  "quote": "A paused turn means the work isn't finished; re-send the conversation (including the paused response) to let the model continue where it left off. In practice this reads as: while stop_reason == \"tool_use\", execute the tools and continue the conversation.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "STRONG"
}
```

## Q209 — Server-executed vs client-executed tools

```json
{
  "id": 209,
  "source": "Anthropic Docs — How tool use works",
  "quote": "For web_search, web_fetch, code_execution, and tool_search, Anthropic runs the code. You enable the tool in your request and the server handles everything else. You never construct a tool_result block for these tools because the server-side loop executes the operation and feeds the output back to the model before the response reaches you. The response you receive contains server_tool_use blocks showing what ran and what came back, but by the time you see them, execution is already complete.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "STRONG"
}
```

## Q210 — tool_result ordering (400 error)

```json
{
  "id": 210,
  "source": "Anthropic Docs — Handle tool calls",
  "quote": "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message. In the user message containing tool results, the tool_result blocks must come FIRST in the content array. Any text must come AFTER all tool results.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls",
  "status": "STRONG"
}
```

## Q211 — is_error retry behavior

```json
{
  "id": 211,
  "source": "Anthropic Docs — Handle tool calls",
  "quote": "If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls",
  "status": "STRONG"
}
```

## Q212 — Valid content types in tool_result

```json
{
  "id": 212,
  "source": "Anthropic Docs — Handle tool calls",
  "quote": "content: The result of the tool, as a string (for example, \"content\": \"15 degrees\"), a list of nested content blocks (for example, \"content\": [{\"type\": \"text\", \"text\": \"15 degrees\"}]), or a list of document blocks (for example, \"content\": [{\"type\": \"document\", \"source\": {\"type\": \"text\", \"media_type\": \"text/plain\", \"data\": \"15 degrees\"}}]). These content blocks can use the text, image, or document types.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls",
  "status": "STRONG"
}
```

## Q213 — No intermediate messages between tool_use and tool_result

```json
{
  "id": 213,
  "source": "Anthropic Docs — Handle tool calls",
  "quote": "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls",
  "status": "STRONG"
}
```

## Q214 — Instructive error messages

```json
{
  "id": 214,
  "source": "Anthropic Docs — Handle tool calls",
  "quote": "Write instructive error messages. Instead of generic errors like \"failed\", include what went wrong and what Claude should try next, e.g., \"Rate limit exceeded. Retry after 60 seconds.\" This gives Claude the context it needs to recover or adapt without guessing.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls",
  "status": "STRONG"
}
```

## Q215 — Grammar-constrained sampling

```json
{
  "id": 215,
  "source": "Anthropic Docs — Strict tool use",
  "quote": "Setting strict: true on a tool definition uses grammar-constrained sampling to guarantee Claude's tool inputs match your JSON Schema.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/strict-tool-use",
  "status": "STRONG"
}
```

## Q216 — additionalProperties: false recommendation

```json
{
  "id": 216,
  "source": "Anthropic Docs — Strict tool use (example schemas)",
  "quote": "input_schema: type: object properties: location: type: string description: The city and state, e.g. San Francisco, CA unit: type: string enum: [celsius, fahrenheit] required: [location] additionalProperties: false",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/strict-tool-use",
  "status": "PARTIAL"
}
```

Note: Every strict-mode example schema in the docs uses `additionalProperties: false`. The explicit requirement statement appears in research/02-strict-tool-use.md as documented from the Anthropic docs (research file notes it must be set to false or a 400 is returned).

## Q217 — Schema caching (24 hours) and no retention of prompts/responses

```json
{
  "id": 217,
  "source": "Anthropic Docs — Strict tool use",
  "quote": "Strict tool use compiles tool input_schema definitions into grammars using the same pipeline as structured outputs. Tool schemas are temporarily cached for up to 24 hours since last use. Prompts and responses are not retained beyond the API response.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/strict-tool-use",
  "status": "STRONG"
}
```

## Q218 — Extended thinking restrictions on tool_choice

```json
{
  "id": 218,
  "source": "Anthropic Docs — Define tools",
  "quote": "When using extended thinking with tool use, tool_choice: {\"type\": \"any\"} and tool_choice: {\"type\": \"tool\", \"name\": \"...\"} are not supported and will result in an error. Only tool_choice: {\"type\": \"auto\"} (the default) and tool_choice: {\"type\": \"none\"} are compatible with extended thinking.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q219 — PHI in tool schemas (HIPAA)

```json
{
  "id": 219,
  "source": "Anthropic Docs — Strict tool use",
  "quote": "Strict tool use is HIPAA eligible, but PHI must not be included in tool schema definitions. The API caches compiled schemas separately from message content, and these cached schemas do not receive the same PHI protections as prompts and responses. Do not include PHI in input_schema property names, enum values, const values, or pattern regular expressions.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/strict-tool-use",
  "status": "STRONG"
}
```

## Q220 — Four tool_choice options including none

```json
{
  "id": 220,
  "source": "Anthropic Docs — Define tools",
  "quote": "When working with the tool_choice parameter, there are four possible options: auto allows Claude to decide whether to call any provided tools or not. This is the default value when tools are provided. any tells Claude that it must use one of the provided tools, but doesn't force a particular tool. tool forces Claude to always use a particular tool. none prevents Claude from using any tools. This is the default value when no tools are provided.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q221 — Extended thinking with tool_choice tool returns error

```json
{
  "id": 221,
  "source": "Anthropic Docs — Define tools",
  "quote": "When using extended thinking with tool use, tool_choice: {\"type\": \"any\"} and tool_choice: {\"type\": \"tool\", \"name\": \"...\"} are not supported and will result in an error. Only tool_choice: {\"type\": \"auto\"} (the default) and tool_choice: {\"type\": \"none\"} are compatible with extended thinking.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q222 — Prefilling with any/tool suppresses natural language

```json
{
  "id": 222,
  "source": "Anthropic Docs — Define tools",
  "quote": "Note that when you have tool_choice as any or tool, the API prefills the assistant message to force a tool to be used. This means that the models will not emit a natural language response or explanation before tool_use content blocks, even if explicitly asked to do so.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q223 — tool_choice cache invalidation

```json
{
  "id": 223,
  "source": "Anthropic Docs — Define tools",
  "quote": "When using prompt caching, changes to the tool_choice parameter will invalidate cached message blocks. Tool definitions and system prompts remain cached, but message content must be reprocessed.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q224 — tool_choice any + strict: true for guaranteed structured outputs

```json
{
  "id": 224,
  "source": "Anthropic Docs — Define tools",
  "quote": "Guaranteed tool calls with strict tools — Combine tool_choice: {\"type\": \"any\"} with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema. Set strict: true on your tool definitions to enable schema validation.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q225 — TypeScript-only hook events

```json
{
  "id": 225,
  "source": "Claude Code Docs — Hooks",
  "quote": "Hooks support four implementation types, all command-based (no SDK-only variants): 1. Command hooks (type: \"command\"): Shell scripts receiving JSON on stdin 2. HTTP hooks (type: \"http\"): POST requests to URLs, responses in JSON 3. Prompt hooks (type: \"prompt\"): Single-turn Claude evaluation 4. Agent hooks (type: \"agent\"): Subagents with tool access",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "NO_DOC"
}
```

Note: The question hinges on an invented list of 18 hook events with 8 that are "TypeScript-only SDK callbacks" (SessionStart, SessionEnd, Setup, TeammateIdle, TaskCompleted, ConfigChange, WorktreeCreate, WorktreeRemove). The current Anthropic hooks documentation describes four handler types (command/http/prompt/agent), all command-based with no SDK-only variants. The claimed TypeScript-only distinction is not found in the current public docs.

## Q226 — Hook callback arguments

```json
{
  "id": 226,
  "source": "Claude Code Docs — Hooks",
  "quote": "All hook events receive common fields: session_id, transcript_path, cwd, permission_mode, hook_event_name. Event-specific fields follow, such as tool_name, tool_input, and tool_use_id for tool events.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "PARTIAL"
}
```

Note: Docs describe the JSON input fields on stdin for command/http hooks (including `tool_use_id`). The "3 arguments" framing (input_data, tool_use_id, context/AbortSignal) is an SDK-callback signature not present in this exact form in the current published docs.

## Q227 — Hook permission priority (deny > ask > allow)

```json
{
  "id": 227,
  "source": "Claude Code Docs — Hooks",
  "quote": "When multiple PreToolUse hooks return different decisions, precedence is: deny > defer > ask > allow. The strongest decision wins. A single hook returning \"deny\" overrides others returning \"allow\".",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q228 — updatedInput requires permissionDecision allow

```json
{
  "id": 228,
  "source": "Claude Code Docs — Hooks",
  "quote": "When modifying tool input via updatedInput: Must replace the entire input object – include unchanged fields alongside modified ones. Works in: PreToolUse (with \"allow\" or \"ask\"), PermissionRequest (with \"allow\").",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q229 — Matcher regex is evaluated against the tool name

```json
{
  "id": 229,
  "source": "Claude Code Docs — Hooks",
  "quote": "Matchers filter when hooks fire based on different fields per event. Tool Events (PreToolUse, PostToolUse, etc.) — Matchers filter on tool name.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q230 — Built-in tool names (PascalCase)

```json
{
  "id": 230,
  "source": "Claude Code Docs — Hooks",
  "quote": "Tool Events (PreToolUse, PostToolUse, etc.) Matchers filter on tool name. Built-in tools are PascalCase: Bash – shell commands, Read – file reading, Write – file creation, Edit – file editing, Glob – file pattern matching, Grep – text search, WebFetch – web content retrieval, WebSearch – web search, Agent – spawn subagents, AskUserQuestion – user prompts, ExitPlanMode – exit plan mode.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q231 — MCP tool naming pattern for matchers

```json
{
  "id": 231,
  "source": "Claude Code Docs — Hooks",
  "quote": "MCP tools follow the pattern: mcp__<server>__<tool>. mcp__memory__create_entities, mcp__filesystem__read_file, mcp__github__search_repositories. To match all tools from a server: mcp__memory__.* (the .* is required). To match write operations from any server: mcp__.*__write.*",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q232 — Hook event names are case-sensitive PascalCase

```json
{
  "id": 232,
  "source": "Claude Code Docs — Hooks",
  "quote": "Hooks fire at specific lifecycle points in Claude Code sessions. Events fall into three cadences: Once per session: SessionStart, SessionEnd. Once per turn: UserPromptSubmit, Stop, StopFailure. On every tool call: PreToolUse, PostToolUse, PostToolUseFailure, PermissionRequest, PermissionDenied.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

Note: All event names in the official docs are rendered in PascalCase. Exact-string matching by configuration key is how hooks are wired in `settings.json`.

## Q233 — Hook execution order per array

```json
{
  "id": 233,
  "source": "Claude Code Docs — Hooks",
  "quote": "Hook Execution Order: 1. Matcher checks – filters by tool name, agent type, notification type, etc. 2. if condition evaluation – permission rule syntax like \"Bash(rm *)\" (optional, tool events only) 3. Hook handler spawns – command, HTTP, prompt, or agent executes 4. Deduplication – identical handlers run once (by command string for commands, by URL for HTTP)",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "PARTIAL"
}
```

Note: Docs describe matcher/if/handler/dedup steps but do not state sequential array-order execution in the text extracted. Existing research file (08-hooks.md) states hooks run in parallel with deduplication. The question's answer (sequential by array order) may not match current docs.

## Q234 — Empty object {} to allow without modifications

```json
{
  "id": 234,
  "source": "Claude Code Docs — Hooks (exit code semantics)",
  "quote": "Exit 0: Success. JSON output processed if present. Stdout added to debug log (except UserPromptSubmit/SessionStart where it becomes context).",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "PARTIAL"
}
```

Note: For shell hooks, exit code 0 with no JSON is the pass-through. For SDK/JSON callbacks, returning `{}` (empty object) as the documented no-op is implied but not explicitly quoted in the fetched page.

## Q235 — AgentDefinition fields and required fields

```json
{
  "id": 235,
  "source": "Claude Code Docs — Subagents",
  "quote": "The following fields can be used in the YAML frontmatter. Only name and description are required.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Note: The actual frontmatter table lists 15 fields (name, description, tools, disallowedTools, model, permissionMode, maxTurns, skills, mcpServers, hooks, memory, background, effort, isolation, color, initialPrompt). The question asserts "7 fields with description and prompt as the only required" which matches an SDK `AgentDefinition` signature (programmatic) different from the filesystem-frontmatter schema. The docs state only `name` and `description` are required for filesystem-based agents.

## Q236 — Task renamed to Agent in v2.1.63

```json
{
  "id": 236,
  "source": "Claude Code Docs — Subagents",
  "quote": "In version 2.1.63, the Task tool was renamed to Agent. Existing Task(...) references in settings and agent definitions still work as aliases.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "STRONG"
}
```

## Q237 — Subagents cannot spawn other subagents

```json
{
  "id": 237,
  "source": "Claude Code Docs — Subagents",
  "quote": "Subagents cannot spawn other subagents. If your workflow requires nested delegation, use Skills or chain subagents from the main conversation.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "STRONG"
}
```

Also: "If Agent is omitted from the tools list entirely, the agent cannot spawn any subagents. This restriction only applies to agents running as the main thread with claude --agent. Subagents cannot spawn other subagents, so Agent(agent_type) has no effect in subagent definitions."

## Q238 — Prompt is the only parent-to-subagent channel

```json
{
  "id": 238,
  "source": "Claude Code Docs — Subagents",
  "quote": "Your full message still goes to Claude, which writes the subagent's task prompt based on what you asked. The @-mention controls which subagent Claude invokes, not what prompt it receives.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Also: "The frontmatter defines the subagent's metadata and configuration. The body becomes the system prompt that guides the subagent's behavior. Subagents receive only this system prompt (plus basic environment details like working directory), not the full Claude Code system prompt."

Note: Docs confirm the subagent receives only its system prompt plus basic env details and the task prompt generated by Claude; they do not use the phrase "only communication channel" verbatim.

## Q239 — parent_tool_use_id on subagent messages

```json
{
  "id": 239,
  "source": "Claude Code Docs — Subagents",
  "quote": "",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "NO_DOC"
}
```

Note: The current Anthropic subagents page does not mention a `parent_tool_use_id` field on subagent-generated messages in the fetched content. The page mentions `agent_id` as an identifier and says subagent transcripts are stored in separate `agent-{agentId}.jsonl` files. This question appears to reference Agent SDK-specific message metadata.

## Q240 — Subagents do not inherit permissions

```json
{
  "id": 240,
  "source": "Claude Code Docs — Subagents",
  "quote": "The permissionMode field controls how the subagent handles permission prompts. Subagents inherit the permission context from the main conversation and can override the mode, except when the parent mode takes precedence as described below.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Note: The docs actually state subagents DO inherit permission context from the parent — which contradicts the question's "No, subagents do NOT inherit" premise. The claim about multiplied permission prompts is not supported verbatim.

## Q241 — 3 ways to create subagents

```json
{
  "id": 241,
  "source": "Claude Code Docs — Subagents",
  "quote": "You can also create subagents manually as Markdown files, define them via CLI flags, or distribute them through plugins.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Note: The docs list markdown files, CLI flags (`--agents`), and plugin distribution — not exactly the "programmatic/filesystem/built-in general-purpose" wording. Built-in subagents (Explore, Plan, general-purpose) are described separately. "Programmatic via query() agents parameter" is an Agent SDK concept not covered in the subagents page.

## Q242 — Tools omitted means inherit all

```json
{
  "id": 242,
  "source": "Claude Code Docs — Subagents",
  "quote": "Subagents can use any of Claude Code's internal tools. By default, subagents inherit all tools from the main conversation, including MCP tools.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "STRONG"
}
```

Also (frontmatter table): "tools — No — Tools the subagent can use. Inherits all tools if omitted"

## Q243 — Detecting subagent invocation via Agent tool_use

```json
{
  "id": 243,
  "source": "Claude Code Docs — Subagents",
  "quote": "In version 2.1.63, the Task tool was renamed to Agent. Existing Task(...) references in settings and agent definitions still work as aliases.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Note: Docs confirm the tool is called Agent (previously Task); they do not explicitly state "look for tool_use blocks where name is Agent" as API-response-inspection guidance.

## Q244 — Passing file path via Agent tool prompt

```json
{
  "id": 244,
  "source": "Claude Code Docs — Subagents",
  "quote": "Subagents receive only this system prompt (plus basic environment details like working directory), not the full Claude Code system prompt.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

Also: "Your full message still goes to Claude, which writes the subagent's task prompt based on what you asked."

Note: Docs support the isolation claim but do not verbatim call the prompt string the "only communication channel."

## Q245 — Three MCP primitives and control model

```json
{
  "id": 245,
  "source": "MCP Docs — Tools / Resources",
  "quote": "Tools in MCP are designed to be model-controlled, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user's prompts. Resources in MCP are designed to be application-driven, with host applications determining how to incorporate context based on their needs.",
  "url": "https://modelcontextprotocol.io/docs/concepts/tools",
  "status": "STRONG"
}
```

Note: Prompts-are-user-controlled is stated on the separate Prompts concept page (not fetched here but part of the standard MCP framing: Tools = model-controlled, Resources = application-controlled, Prompts = user-controlled).

## Q246 — MCP uses inputSchema (camelCase)

```json
{
  "id": 246,
  "source": "MCP Docs — Tools",
  "quote": "A tool definition includes: name: Unique identifier for the tool. title: Optional human-readable name of the tool for display purposes. description: Human-readable description of functionality. inputSchema: JSON Schema defining expected parameters. outputSchema: Optional JSON Schema defining expected output structure.",
  "url": "https://modelcontextprotocol.io/docs/concepts/tools",
  "status": "STRONG"
}
```

Contrast with Anthropic Docs — Define tools, which uses `input_schema` (snake_case) for direct Claude API tool definitions.

## Q247 — MCP scope precedence

```json
{
  "id": 247,
  "source": "Claude Code Docs — MCP",
  "quote": "When the same server is defined in more than one place, Claude Code connects to it once, using the definition from the highest-precedence source: 1. Local scope 2. Project scope 3. User scope 4. Plugin-provided servers 5. claude.ai connectors. The three scopes match duplicates by name. Plugins and connectors match by endpoint, so one that points at the same URL or command as a server above is treated as a duplicate.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q248 — Env variable expansion syntax

```json
{
  "id": 248,
  "source": "Claude Code Docs — MCP",
  "quote": "Supported syntax: ${VAR} - Expands to the value of environment variable VAR. ${VAR:-default} - Expands to VAR if set, otherwise uses default.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q249 — Five expansion locations

```json
{
  "id": 249,
  "source": "Claude Code Docs — MCP",
  "quote": "Expansion locations: Environment variables can be expanded in: command - The server executable path. args - Command-line arguments. env - Environment variables passed to the server. url - For HTTP server types. headers - For HTTP server authentication.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q250 — headersHelper requirements

```json
{
  "id": 250,
  "source": "Claude Code Docs — MCP",
  "quote": "Requirements: The command must write a JSON object of string key-value pairs to stdout. The command runs in a shell with a 10-second timeout. Dynamic headers override any static headers with the same name. The helper runs fresh on each connection (at session start and on reconnect). There is no caching, so your script is responsible for any token reuse.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q251 — Three MCP transports, SSE deprecated

```json
{
  "id": 251,
  "source": "Claude Code Docs — MCP",
  "quote": "HTTP servers are the recommended option for connecting to remote MCP servers. This is the most widely supported transport for cloud-based services. [...] The SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead, where available.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

Also supporting (MCP spec): "This replaces the HTTP+SSE transport from protocol version 2024-11-05." (https://modelcontextprotocol.io/docs/concepts/transports)

## Q252 — MCP_TIMEOUT and MAX_MCP_OUTPUT_TOKENS

```json
{
  "id": 252,
  "source": "Claude Code Docs — MCP",
  "quote": "Configure MCP server startup timeout using the MCP_TIMEOUT environment variable (for example, MCP_TIMEOUT=10000 claude sets a 10-second timeout). Claude Code will display a warning when MCP tool output exceeds 10,000 tokens. To increase this limit, set the MAX_MCP_OUTPUT_TOKENS environment variable (for example, MAX_MCP_OUTPUT_TOKENS=50000).",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q253 — Local scope stored in ~/.claude.json

```json
{
  "id": 253,
  "source": "Claude Code Docs — MCP",
  "quote": "Local scope is the default. A local-scoped server loads only in the project where you added it and stays private to you. Claude Code stores it in ~/.claude.json under that project's path, so the same server won't appear in your other projects. [...] The term \"local scope\" for MCP servers differs from general local settings. MCP local-scoped servers are stored in ~/.claude.json (your home directory), while general local settings use .claude/settings.local.json (in the project directory).",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q254 — Direct Resources vs Resource Templates

```json
{
  "id": 254,
  "source": "MCP Docs — Resources",
  "quote": "To discover available resources, clients send a resources/list request. [...] Resource templates allow servers to expose parameterized resources using URI templates. Arguments may be auto-completed through the completion API. [...] resourceTemplates: uriTemplate: \"file:///{path}\", name: \"Project Files\", title: \"📁 Project Files\", description: \"Access files in the project directory\", mimeType: \"application/octet-stream\"",
  "url": "https://modelcontextprotocol.io/docs/concepts/resources",
  "status": "STRONG"
}
```

---

## Summary counts

- STRONG: 29 (205, 206, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219, 220, 221, 222, 223, 224, 227, 228, 229, 230, 231, 232, 236, 237, 242, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254 — counted as strongly supported by verbatim docs)
- PARTIAL: 12 (207, 216, 226, 233, 234, 235, 238, 240, 241, 243, 244 — supported in spirit but not word-for-word, or cover SDK-level details not in public docs)
- NO_DOC: 2 (225, 239 — invented or SDK-internal specifics not found in public documentation)

## Notable gaps

1. **Q225** (TypeScript-only hook list): The public Hooks doc describes four command-based handler types, not an 18-event taxonomy with 8 SDK-only TypeScript callbacks. This is an SDK-implementation-level claim that is not in the public Anthropic hooks docs.

2. **Q226** (3-argument hook callback signature): The public doc describes stdin-JSON input for command hooks, not a programmatic `(input_data, tool_use_id, context)` callback signature. This is an SDK internal.

3. **Q235** (AgentDefinition = 7 fields with description + prompt required): Conflicts with the public subagents filesystem frontmatter schema (15 fields, `name` + `description` required). The 7-field variant matches an Agent SDK `AgentDefinition` type, which is not in the public subagents docs fetched.

4. **Q239** (parent_tool_use_id): Not found in the current Subagents page. The page uses `agent_id` for subagent identification and does not describe this field on assistant messages.

5. **Q240** (no permission inheritance): Contradicts the current docs, which state subagents DO inherit permission context from the main conversation.

6. **Q241** (3 creation methods — programmatic/filesystem/general-purpose): The current docs list markdown files, `--agents` CLI flag, and plugin distribution. Built-in subagents (Explore/Plan/general-purpose) are described separately. The "programmatic via query()" option is Agent SDK-specific.
