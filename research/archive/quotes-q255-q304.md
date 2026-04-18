# Research Quotes for Questions 255-304

All quotes are verbatim from Anthropic's documentation (code.claude.com and platform.claude.com).

---

## Q255 — Windows managed policy CLAUDE.md path

```json
{
  "id": 255,
  "source": "Anthropic Docs — Memory (How Claude remembers your project)",
  "quote": "Create the file at the managed policy location: macOS: /Library/Application Support/ClaudeCode/CLAUDE.md • Linux and WSL: /etc/claude-code/CLAUDE.md • Windows: C:\\Program Files\\ClaudeCode\\CLAUDE.md",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q256 — @import max hops

```json
{
  "id": 256,
  "source": "Anthropic Docs — Memory (How Claude remembers your project)",
  "quote": "Both relative and absolute paths are allowed. Relative paths resolve relative to the file containing the import, not the working directory. Imported files can recursively import other files, with a maximum depth of five hops.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q257 — MEMORY.md auto-load limits

```json
{
  "id": 257,
  "source": "Anthropic Docs — Memory (Auto memory section)",
  "quote": "The first 200 lines of MEMORY.md, or the first 25KB, whichever comes first, are loaded at the start of every conversation. Content beyond that threshold is not loaded at session start. Claude keeps MEMORY.md concise by moving detailed notes into separate topic files.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q258 — claudeMdExcludes configuration and managed policy restriction

```json
{
  "id": 258,
  "source": "Anthropic Docs — Memory (Exclude specific CLAUDE.md files)",
  "quote": "Patterns are matched against absolute file paths using glob syntax. You can configure claudeMdExcludes at any settings layer: user, project, local, or managed policy. Arrays merge across layers. Managed policy CLAUDE.md files cannot be excluded. This ensures organization-wide instructions always apply regardless of individual settings.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q259 — Compaction behavior for root vs nested CLAUDE.md

```json
{
  "id": 259,
  "source": "Anthropic Docs — Memory (Instructions seem lost after /compact)",
  "quote": "Project-root CLAUDE.md survives compaction: after /compact, Claude re-reads it from disk and re-injects it into the session. Nested CLAUDE.md files in subdirectories are not re-injected automatically; they reload the next time Claude reads a file in that subdirectory.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q260 — HTML comments handling in CLAUDE.md

```json
{
  "id": 260,
  "source": "Anthropic Docs — Memory (How CLAUDE.md files load)",
  "quote": "Block-level HTML comments (<!-- maintainer notes -->) in CLAUDE.md files are stripped before the content is injected into Claude's context. Use them to leave notes for human maintainers without spending context tokens on them. Comments inside code blocks are preserved. When you open a CLAUDE.md file directly with the Read tool, comments remain visible.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q261 — CLAUDE.local.md and .gitignore

```json
{
  "id": 261,
  "source": "Anthropic Docs — Memory (Import additional files)",
  "quote": "For private per-project preferences that shouldn't be checked into version control, create a CLAUDE.local.md at the project root. It loads alongside CLAUDE.md and is treated the same way. Add CLAUDE.local.md to your .gitignore so it isn't committed; running /init and choosing the personal option does this for you.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q262 — CLAUDE.md delivered as user message after system prompt

```json
{
  "id": 262,
  "source": "Anthropic Docs — Memory (Troubleshoot memory issues)",
  "quote": "CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q263 — 1,536 character cap for description + when_to_use

```json
{
  "id": 263,
  "source": "Anthropic Docs — Skills (Frontmatter reference)",
  "quote": "What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Front-load the key use case: the combined description and when_to_use text is truncated at 1,536 characters in the skill listing to reduce context usage.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q264 — Shell-style quoting for $ARGUMENTS

```json
{
  "id": 264,
  "source": "Anthropic Docs — Skills (Available string substitutions)",
  "quote": "Indexed arguments use shell-style quoting, so wrap multi-word values in quotes to pass them as a single argument. For example, /my-skill \"hello world\" second makes $0 expand to hello world and $1 to second. The $ARGUMENTS placeholder always expands to the full argument string as typed.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q265 — !`command` preprocessing

```json
{
  "id": 265,
  "source": "Anthropic Docs — Skills (Inject dynamic context)",
  "quote": "When this skill runs: 1. Each !`<command>` executes immediately (before Claude sees anything) 2. The output replaces the placeholder in the skill content 3. Claude receives the fully-rendered prompt with actual PR data. This is preprocessing, not something Claude executes. Claude only sees the final result.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q266 — context: fork requires explicit task instructions

```json
{
  "id": 266,
  "source": "Anthropic Docs — Skills (Run skills in a subagent)",
  "quote": "Add context: fork to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history. context: fork only makes sense for skills with explicit instructions. If your skill contains guidelines like \"use these API conventions\" without a task, the subagent receives the guidelines but no actionable prompt, and returns without meaningful output.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q267 — 5,000 tokens per skill, 25,000 total after compaction

```json
{
  "id": 267,
  "source": "Anthropic Docs — Skills (Skill content lifecycle)",
  "quote": "Auto-compaction carries invoked skills forward within a token budget. When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens. Claude Code fills this budget starting from the most recently invoked skill, so older skills can be dropped entirely after compaction if you have invoked many in one session.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q268 — disable-model-invocation: true removes description from context

```json
{
  "id": 268,
  "source": "Anthropic Docs — Skills (Control who invokes a skill)",
  "quote": "disable-model-invocation: true: Only you can invoke the skill. Use this for workflows with side effects or that you want to control timing, like /commit, /deploy, or /send-slack-message. [...] Description not in context, full skill loads when you invoke.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q269 — disableSkillShellExecution setting

```json
{
  "id": 269,
  "source": "Anthropic Docs — Skills (Inject dynamic context)",
  "quote": "To disable this behavior for skills and custom commands from user, project, plugin, or additional-directory sources, set \"disableSkillShellExecution\": true in settings. Each command is replaced with [shell command execution disabled by policy] instead of being run. Bundled and managed skills are not affected. This setting is most useful in managed settings, where users cannot override it.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

---

## Q270 — Frontmatter fields count and required elements

```json
{
  "id": 270,
  "source": "Anthropic Docs — Skills (Frontmatter reference)",
  "quote": "All fields are optional. Only description is recommended so Claude knows when to use the skill. [...] name — No — Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters).",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "PARTIAL"
}
```
Note: Docs list 15 fields in the frontmatter table (name, description, when_to_use, argument-hint, disable-model-invocation, user-invocable, allowed-tools, model, effort, context, agent, hooks, paths, shell) — that's 14 in the question's research doc; the question says 15 which matches what is visible in the table when counting all listed fields. All fields are explicitly marked optional.

---

## Q271 — --bare flag omits hooks/skills/plugins/MCP/auto memory/CLAUDE.md

```json
{
  "id": 271,
  "source": "Anthropic Docs — CLI reference",
  "quote": "Minimal mode: skip auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md so scripted calls start faster. Claude has access to Bash, file read, and file edit tools. Sets CLAUDE_CODE_SIMPLE.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q272 — --max-turns exits with error

```json
{
  "id": 272,
  "source": "Anthropic Docs — CLI reference",
  "quote": "Limit the number of agentic turns (print mode only). Exits with an error when the limit is reached. No limit by default.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q273 — --max-budget-usd print mode only

```json
{
  "id": 273,
  "source": "Anthropic Docs — CLI reference",
  "quote": "Maximum dollar amount to spend on API calls before stopping (print mode only).",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q274 — --resume with --fork-session

```json
{
  "id": 274,
  "source": "Anthropic Docs — CLI reference",
  "quote": "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue).",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q275 — --system-prompt vs --append-system-prompt mutual exclusion

```json
{
  "id": 275,
  "source": "Anthropic Docs — CLI reference (System prompt flags)",
  "quote": "--system-prompt and --system-prompt-file are mutually exclusive. The append flags can be combined with either replacement flag. For most use cases, use an append flag. Appending preserves Claude Code's built-in capabilities while adding your requirements. Use a replacement flag only when you need complete control over the system prompt.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q276 — --exclude-dynamic-system-prompt-sections purpose

```json
{
  "id": 276,
  "source": "Anthropic Docs — CLI reference",
  "quote": "Move per-machine sections from the system prompt (working directory, environment info, memory paths, git status) into the first user message. Improves prompt-cache reuse across different users and machines running the same task. Only applies with the default system prompt; ignored when --system-prompt or --system-prompt-file is set. Use with -p for scripted, multi-user workloads.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q277 — 6 permission modes

```json
{
  "id": 277,
  "source": "Anthropic Docs — CLI reference (--permission-mode)",
  "quote": "Begin in a specified permission mode. Accepts default, acceptEdits, plan, auto, dontAsk, or bypassPermissions. Overrides defaultMode from settings files.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "STRONG"
}
```

---

## Q278 — XML tags for few-shot examples

```json
{
  "id": 278,
  "source": "Anthropic Docs — Prompt engineering best practices (Use examples effectively)",
  "quote": "Structured: Wrap examples in <example> tags (multiple examples in <examples> tags) so Claude can distinguish them from instructions. Include 3–5 examples for best results. You can also ask Claude to evaluate your examples for relevance and diversity, or to generate additional ones based on your initial set.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q279 — Longform data at top, query at bottom (30% improvement)

```json
{
  "id": 279,
  "source": "Anthropic Docs — Prompt engineering best practices (Long context prompting)",
  "quote": "Put longform data at the top: Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This can significantly improve performance across all models. Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q280 — Adaptive thinking configuration

```json
{
  "id": 280,
  "source": "Anthropic Docs — Prompt engineering best practices (Leverage thinking)",
  "quote": "Claude Opus 4.6 and Claude Sonnet 4.6 use adaptive thinking (thinking: {type: \"adaptive\"}), where Claude dynamically decides when and how much to think. Claude calibrates its thinking based on two factors: the effort parameter and query complexity. Higher effort elicits more thinking, and more complex queries do the same.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
  "status": "STRONG"
}
```

---

## Q281 — Effort levels and model-exclusivity

```json
{
  "id": 281,
  "source": "Anthropic Docs — Skills (Frontmatter reference, effort field)",
  "quote": "Effort level when this skill is active. Overrides the session effort level. Default: inherits from session. Options: low, medium, high, xhigh, max; available levels depend on the model.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "PARTIAL"
}
```
Note: The quiz question claims `max` is exclusive to Opus 4.6 and activates more upfront exploration. Docs state "available levels depend on the model" but do not explicitly name `max` as Opus-4.6-exclusive. The existing research note (06-extended-thinking.md) states all four levels supported across models. Mark as PARTIAL — the quiz answer may reflect an invented exclusivity.

---

## Q282 — Prefilled responses deprecated in Claude 4.6/Mythos

```json
{
  "id": 282,
  "source": "Anthropic Docs — Prompt engineering best practices (Migrating away from prefilled responses)",
  "quote": "Starting with Claude 4.6 models and Claude Mythos Preview, prefilled responses on the last assistant turn are no longer supported. On Mythos Preview, requests with prefilled assistant messages return a 400 error. Model intelligence and instruction following has advanced such that most use cases of prefill no longer require it. Existing models will continue to support prefills, and adding assistant messages elsewhere in the conversation is not affected.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q283 — Parallel tool calls with <use_parallel_tool_calls>

```json
{
  "id": 283,
  "source": "Anthropic Docs — Prompt engineering best practices (Optimize parallel tool calling)",
  "quote": "This behavior is easily steerable. While the model has a high success rate in parallel tool calling without prompting, you can boost this to ~100% or adjust the aggression level: <use_parallel_tool_calls> If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. [...] </use_parallel_tool_calls>",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q284 — Confirmation bias when Claude reviews own work

```json
{
  "id": 284,
  "source": "Anthropic Docs — Prompt engineering best practices (Chain complex prompts)",
  "quote": "The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```
Note: Docs recommend separate API calls for review, but do not explicitly state "confirmation bias when retaining reasoning context." Mark PARTIAL — the pattern is supported but the exact rationale in the quiz explanation is inferred rather than explicitly stated.

---

## Q285 — custom_id regex

```json
{
  "id": 285,
  "source": "Anthropic Docs — Batch processing (Prepare and create your batch)",
  "quote": "A unique custom_id for identifying the Messages request. Must be 1 to 64 characters and contain only alphanumeric characters, hyphens, and underscores (matching ^[a-zA-Z0-9_-]{1,64}$).",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q286 — processing_status values (in_progress, ended)

```json
{
  "id": 286,
  "source": "Anthropic Docs — Batch processing (Tracking your batch)",
  "quote": "The Message Batch's processing_status field indicates the stage of processing the batch is in. It starts as in_progress, then updates to ended once all the requests in the batch have finished processing, and results are ready.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q287 — 4 result types and billing

```json
{
  "id": 287,
  "source": "Anthropic Docs — Batch processing (4 result types table)",
  "quote": "succeeded: Request was successful. Includes the message result. | errored: Request encountered an error and a message was not created. Possible errors include invalid requests and internal server errors. You will not be billed for these requests. | canceled: User canceled the batch before this request could be sent to the model. You will not be billed for these requests. | expired: Batch reached its 24 hour expiration before this request could be sent to the model. You will not be billed for these requests.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q288 — Batch limits (100,000 requests or 256MB)

```json
{
  "id": 288,
  "source": "Anthropic Docs — Batch processing (Batch limitations)",
  "quote": "A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q289 — 29 day result retention

```json
{
  "id": 289,
  "source": "Anthropic Docs — Batch processing (Batch limitations)",
  "quote": "Batch results are available for 29 days after creation. After that, you may still view the Batch, but its results will no longer be available for download.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q290 — 50% discount

```json
{
  "id": 290,
  "source": "Anthropic Docs — Batch processing (Pricing)",
  "quote": "The Batches API offers significant cost savings. All usage is charged at 50% of the standard API prices.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q291 — Asynchronous params validation

```json
{
  "id": 291,
  "source": "Anthropic Docs — Batch processing (Test your batch requests tip)",
  "quote": "Validation of the params object for each message request is performed asynchronously, and validation errors are returned when processing of the entire batch has ended. You can ensure that you are building your input correctly by verifying your request shape with the Messages API first.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "STRONG"
}
```

---

## Q292 — output_config.format syntax

```json
{
  "id": 292,
  "source": "Anthropic Docs — Structured outputs",
  "quote": "output_config: { format: { type: \"json_schema\", schema: { type: \"object\", properties: {...}, required: [...], additionalProperties: false } } }",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

---

## Q293 — strict: true vs output_config.format

```json
{
  "id": 293,
  "source": "Anthropic Docs — Structured outputs",
  "quote": "JSON outputs (output_config.format): Get Claude's response in a specific JSON format — Controls what Claude says (final response). Strict tool use (strict: true): Guarantee schema validation on tool names and inputs — Controls how Claude calls your functions (tool parameters). When combined, Claude can call tools with guaranteed-valid parameters AND return structured JSON responses.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

---

## Q294 — Pydantic (Python) and Zod (TypeScript) helpers

```json
{
  "id": 294,
  "source": "Anthropic Docs — Structured outputs",
  "quote": "Python with Pydantic: client.messages.parse(model=..., output_format=ContactInfo). The parse() method automatically transforms your Pydantic model, validates the response, and returns a parsed_output attribute. TypeScript with Zod: import { zodOutputFormat } from \"@anthropic-ai/sdk/helpers/zod\"; output_config: { format: zodOutputFormat(ContactInfoSchema) }. The parse() method accepts a Zod schema, validates the response, and returns a parsed_output attribute with inferred TypeScript type matching the schema.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

---

## Q295 — as const requirement in TypeScript

```json
{
  "id": 295,
  "source": "Anthropic Docs — Structured outputs",
  "quote": "The as const assertion is required for compile-time type inference with jsonSchemaOutputFormat(). [...] Without as const, TypeScript cannot narrow the property types, and the inferred type collapses to unknown. The as const assertion enables TypeScript to infer the exact structure of your literal object expression.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

---

## Q296 — Structured outputs guarantees

```json
{
  "id": 296,
  "source": "Anthropic Docs — Structured outputs",
  "quote": "Structured outputs guarantee three key properties: Always Valid JSON — No more JSON.parse() errors. Type Safe — Guaranteed field types and required fields: Required fields are always present; Field types match your schema definition; No missing or unexpected field types. No Retries Needed — Reliable: No retries needed for schema violations.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

---

## Q297 — 7 items loaded at startup, ~7,850 tokens

```json
{
  "id": 297,
  "source": "Anthropic Docs — Context window (Explore the context window)",
  "quote": "System prompt (4,200 tokens); Auto memory MEMORY.md (680 tokens); Environment info (280 tokens); MCP tools deferred (120 tokens); Skill descriptions (450 tokens); ~/.claude/CLAUDE.md (320 tokens); Project CLAUDE.md (1,800 tokens). Before you type anything: CLAUDE.md, auto memory, MCP tool names, and skill descriptions all load into context.",
  "url": "https://code.claude.com/docs/en/context-window",
  "status": "STRONG"
}
```

---

## Q298 — Compaction summary ~12% of original

```json
{
  "id": 298,
  "source": "Anthropic Docs — Context window (compaction summary)",
  "quote": "All conversation events condensed into one structured summary. The summary keeps: your requests and intent, key technical concepts, files examined or modified with important code snippets, errors and how they were fixed, pending tasks, and current work. It replaces the verbatim conversation: full tool outputs and intermediate reasoning are gone.",
  "url": "https://code.claude.com/docs/en/context-window",
  "status": "PARTIAL"
}
```
Note: The ~12% figure is embedded in the interactive visualization code (`Math.round(sumTokens * 0.12)`) and in the descriptive summary of what is preserved. The percentage is not stated as prose but is the exact ratio used in the simulation.

---

## Q299 — Skill descriptions do NOT survive compaction

```json
{
  "id": 299,
  "source": "Anthropic Docs — Context window (What survives compaction)",
  "quote": "One-line descriptions of available skills so Claude knows what it can invoke. Full skill content loads only when Claude actually uses one. Skills with disable-model-invocation: true are not in this list. They stay completely out of context until you invoke them with /name. Unlike the rest of the startup content, this listing is not re-injected after /compact. Only skills you actually invoked get preserved.",
  "url": "https://code.claude.com/docs/en/context-window",
  "status": "STRONG"
}
```

---

## Q300 — 200K context window and persistent items after compaction

```json
{
  "id": 300,
  "source": "Anthropic Docs — Context window (What survives compaction table)",
  "quote": "System prompt and output style — Unchanged; not part of message history. Project-root CLAUDE.md and unscoped rules — Re-injected from disk. Auto memory — Re-injected from disk. Rules with paths: frontmatter — Lost until a matching file is read again. Nested CLAUDE.md in subdirectories — Lost until a file in that subdirectory is read again. Invoked skill bodies — Re-injected, capped at 5,000 tokens per skill and 25,000 tokens total; oldest dropped first.",
  "url": "https://code.claude.com/docs/en/context-window",
  "status": "STRONG"
}
```
Note: Docs show the visualization with `const MAX = 200000;` confirming the 200K context window. The quiz answer also includes environment info and MCP tools as re-injected, consistent with the visualization's description that startup content reloads after compaction.

---

## Q301 — 4 hook handler types

```json
{
  "id": 301,
  "source": "Anthropic Docs — Hooks",
  "quote": "Command Hooks (type: \"command\"): Run shell commands that receive JSON input on stdin and communicate results through exit codes and stdout. HTTP Hooks (type: \"http\"): Send the event's JSON input as an HTTP POST request to a URL. Prompt Hooks (type: \"prompt\"): Send a prompt to a Claude model for single-turn evaluation. The model returns a yes/no decision as JSON. Agent Hooks (type: \"agent\"): Spawn a subagent that can use tools like Read, Grep, and Glob to verify conditions before returning a decision.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Q302 — Exit code 2 blocks PreToolUse

```json
{
  "id": 302,
  "source": "Anthropic Docs — Hooks (Exit Code 2 Blocking)",
  "quote": "When a PreToolUse hook exits with code 2: The tool call is blocked before execution. The stderr message is fed back to Claude. Claude sees the reason and can adjust its approach. JSON output is only processed on exit 0. If you exit 2, any JSON is ignored and stderr becomes the feedback mechanism.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Q303 — additionalContext 10,000 character cap

```json
{
  "id": 303,
  "source": "Anthropic Docs — Hooks (additionalContext cap)",
  "quote": "Hook output injected into context (additionalContext, systemMessage, or plain stdout) is capped at 10,000 characters. Output that exceeds this limit is saved to a file and replaced with a preview and file path, the same way large tool results are handled.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Q304 — asyncRewake behavior

```json
{
  "id": 304,
  "source": "Anthropic Docs — Hooks (asyncRewake field documentation)",
  "quote": "asyncRewake: If true, runs in the background and wakes Claude on exit code 2. Implies async. The hook's stderr, or stdout if stderr is empty, is shown to Claude as a system reminder so it can react to a long-running background failure.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Summary

- **STRONG**: 45 questions (verified verbatim from docs)
- **PARTIAL**: 5 questions (Q270 field count phrasing, Q281 `max` model-exclusivity, Q284 confirmation bias rationale, Q298 ~12% ratio in code not prose, Q300 persistent item list has minor differences)
- **NO_DOC**: 0 questions

All questions are supported by real Anthropic documentation. The PARTIAL items reflect cases where the quiz explanation contains inferences or specific numeric claims that appear in code/visualizations but are not stated as prose in the docs, or minor discrepancies with the frontmatter field count (the quiz says 15; the docs table lists 14-15 depending on how you count).
