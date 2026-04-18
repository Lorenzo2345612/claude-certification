# Platform Features -- Official Documentation Research

Extracted from official Anthropic platform docs on 2026-04-17.

---

## 1. Server-Side Compaction

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md

### What It Is

- Server-side context compaction for managing long conversations approaching context window limits
- Recommended strategy for context management in long-running conversations and agentic workflows
- Automatically summarizes older context when approaching context window limit
- Replaces stale content with concise summaries to keep active context focused

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Overview

### Beta Header

- `compact-2026-01-12`
- Strategy type: `compact_20260112`
- ZDR eligible

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Beta access

### Supported Models

- Claude Mythos Preview (`claude-mythos-preview`)
- Claude Opus 4.7 (`claude-opus-4-7`)
- Claude Opus 4.6 (`claude-opus-4-6`)
- Claude Sonnet 4.6 (`claude-sonnet-4-6`)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Supported models

### How It Works

1. Detects when input tokens exceed configured trigger threshold
2. Generates a summary of the current conversation
3. Creates a `compaction` block containing the summary
4. Continues the response with compacted context
5. On subsequent requests, API automatically drops all message blocks prior to the compaction block

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- How compaction works

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | Required | Must be `"compact_20260112"` |
| `trigger` | object | 150,000 tokens | When to trigger. Must be at least 50,000 tokens. |
| `pause_after_compaction` | boolean | `false` | Whether to pause after generating compaction summary |
| `instructions` | string | `null` | Custom summarization prompt. Completely replaces default. |

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Parameters

### Usage Pattern

- Add `compact_20260112` to `context_management.edits` array
- Append response (including compaction block) to messages for next turn
- API handles dropping pre-compaction content automatically

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Basic usage

### Pause After Compaction

- When `pause_after_compaction: true`, API returns with `stop_reason: "compaction"` after generating the summary
- Allows adding additional content blocks before continuing
- Use case: enforcing total token budget across long agentic loops by counting compactions

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Pausing after compaction

### Custom Summarization Instructions

- `instructions` parameter completely replaces the default prompt (does not supplement it)
- Default prompt asks for a continuation summary wrapped in `<summary></summary>`

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction.md -- Custom summarization instructions

---

## 2. Context Editing

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md

### Overview

- Selectively clear specific content from conversation history as it grows
- Server-side (applied before prompt reaches Claude) -- your client maintains full unmodified history
- Beta header: `context-management-2025-06-27`
- ZDR eligible
- Available on all supported Claude models

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Overview

### Three Approaches

| Approach | Where it runs | How it works |
|----------|---------------|--------------|
| **Server-side tool result clearing** (`clear_tool_uses_20250919`) | API | Clears oldest tool results in chronological order, replaces with placeholder |
| **Server-side thinking block clearing** (`clear_thinking_20251015`) | API | Controls thinking block preservation |
| **Client-side SDK compaction** | SDK (Python, TypeScript, Ruby) | Generates summary, replaces full history |

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Overview table

### Tool Result Clearing (`clear_tool_uses_20250919`)

**Configuration options:**

| Option | Default | Description |
|--------|---------|-------------|
| `trigger` | 100,000 input tokens | When clearing activates (input_tokens or tool_uses) |
| `keep` | 3 tool uses | How many recent tool use/result pairs to keep |
| `clear_at_least` | None | Minimum tokens to clear each time (prevents wasteful cache invalidation) |
| `exclude_tools` | None | Tool names to never clear |
| `clear_tool_inputs` | `false` | Whether to also clear tool call parameters (not just results) |

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Configuration options for tool result clearing

### Thinking Block Clearing (`clear_thinking_20251015`)

- Default behavior (without config): keeps only thinking blocks from last assistant turn (equivalent to `keep: {type: "thinking_turns", value: 1}`)
- Configuration: `keep` parameter accepts:
  - `{type: "thinking_turns", value: N}` where N > 0
  - `"all"` to keep all thinking blocks (maximizes cache hits)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Thinking block clearing

### Combining Strategies

- Can use both thinking block clearing and tool result clearing together
- **`clear_thinking_20251015` must be listed FIRST** in the `edits` array

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Combining strategies

### Prompt Caching Interaction

- **Tool result clearing**: Invalidates cached prompt prefixes when content is cleared
- **Thinking block clearing**: Keeping blocks preserves cache; clearing invalidates cache at clearing point

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Context editing and prompt caching

### Response Format

- `context_management.applied_edits` in response shows which edits were applied
- Includes `cleared_tool_uses`, `cleared_thinking_turns`, `cleared_input_tokens`
- In streaming: included in final `message_delta` event

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Context editing response

### Token Counting Support

- `/v1/messages/count_tokens` endpoint supports context management
- Shows `input_tokens` (after clearing) and `context_management.original_input_tokens` (before clearing)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Token counting

### Memory Tool Integration

- Context editing can be combined with memory tool (`memory_20250818`)
- Claude receives automatic warning when approaching clearing threshold
- Can save important context to memory files before they are cleared

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Using with the Memory Tool

### Client-Side SDK Compaction

- Available in Python, TypeScript, Ruby SDKs via `tool_runner` method
- **Server-side compaction is recommended over SDK compaction**
- SDK monitors token usage after each response
- Threshold check formula: `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
- Default threshold: 100,000 tokens
- Can use different model for summaries (e.g., `claude-haiku-4-5`)
- Limitation: server-side tools cause inaccurate token calculation (cache_read_input_tokens inflated)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-editing.md -- Client-side compaction (SDK)

---

## 3. Handling Stop Reasons

> **Source:** https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons.md

### Stop Reason Values

| Value | Meaning |
|-------|---------|
| `end_turn` | Claude finished response naturally (most common) |
| `max_tokens` | Reached the `max_tokens` limit in request |
| `stop_sequence` | Encountered a custom stop sequence |
| `tool_use` | Claude is calling a tool, expects execution |
| `pause_turn` | Server-side sampling loop reached iteration limit (default 10) while executing server tools |
| `refusal` | Claude refused due to safety concerns |
| `model_context_window_exceeded` | Reached model's context window limit |
| `compaction` | (from compaction feature) Compaction summary generated with pause |

> **Source:** https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons.md -- Stop reason values

### Key Details

- **Empty responses with `end_turn`**: Can happen when adding text blocks after tool results (trains model to end turn). Fix: never add text blocks immediately after `tool_result`
- **Incomplete tool use blocks at `max_tokens`**: Retry with higher `max_tokens`
- **`pause_turn`**: Continue by sending response back as-is (may contain `server_tool_use` without `server_tool_result`)
- **`model_context_window_exceeded`**: Available by default on Sonnet 4.5+; earlier models need beta header `model-context-window-exceeded-2025-08-26`
- **Streaming**: `stop_reason` is `null` in `message_start`, provided in `message_delta` event

> **Source:** https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons.md -- Various sections

### Best Practices

1. Always check `stop_reason` in response handling
2. Handle `pause_turn` in any agent loop using server tools
3. For `max_tokens` with incomplete tool_use, retry with higher limit
4. For continuation after truncation, add a new user message ("Please continue")

> **Source:** https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons.md -- Best practices

---

## 4. Task Budgets

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md

### What It Is

- Advisory token budget for the full agentic loop
- Helps model self-regulate on long agentic tasks
- Counts thinking, tool calls, tool results, and output
- Model sees a running countdown that updates as generation proceeds

### Beta Header & Model Support

- Beta header: `task-budgets-2026-03-13`
- **Only supported on Claude Opus 4.7**
- NOT supported on Opus 4.6, Sonnet 4.6, Haiku 4.5

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- Feature support

### Configuration

- Located in `output_config.task_budget`
- Fields:
  - `type`: always `"tokens"`
  - `total`: number of tokens for the entire agentic loop
  - `remaining` (optional): budget remainder from prior request (defaults to `total`)
- Minimum accepted total: **20,000 tokens** (below returns 400 error)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- Setting a task budget

### Key Behavior

- **Advisory, not enforced** -- soft hint, NOT a hard cap
- Model may exceed budget if interrupting would be more disruptive than finishing
- Hard cap is still `max_tokens` (per-request)
- `task_budget` spans full agentic loop (many requests); `max_tokens` caps each individual request
- Budget too small can cause refusal-like behavior (model declines to attempt task)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- Task budgets are advisory

### Budget Counting

- Counts what Claude **sees** (thinking, tool calls/results, text), NOT what's in request payload
- Resent history tokens are NOT counted again
- Tool result tokens ARE counted when they appear as new content

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- How the budget countdown works

### Carrying Budget Across Compaction

- Pass `remaining` on next request after compaction so countdown continues correctly
- Without `remaining`, budget resets to `total`

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- Carrying a budget across compaction

### Interaction with Other Parameters

- **`max_tokens`**: Orthogonal. `max_tokens` is hard per-request cap; `task_budget` is advisory loop-wide cap
- **Effort**: Effort tunes depth per step; task budgets tune breadth across loop
- **Adaptive thinking**: Thinking tokens count against budget; thinking scales down as budget depletes
- **Prompt caching**: Budget countdown marker invalidates cache if client mutates `remaining`; set once and let model self-regulate

> **Source:** https://platform.claude.com/docs/en/build-with-claude/task-budgets.md -- Interaction with other parameters

---

## 5. Effort Parameter

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md

### What It Is

- Controls how eager Claude is about spending tokens
- Trade-off between response thoroughness and token efficiency
- **Generally available** (no beta header needed)
- Located in `output_config.effort`

### Supported Models

- Claude Mythos Preview, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 4.6, Claude Opus 4.5

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- Note

### Effort Levels

| Level | Description | Typical Use Case |
|-------|-------------|------------------|
| `max` | Absolute maximum capability, no token constraints. Available on Mythos, Opus 4.7, 4.6, Sonnet 4.6. | Deepest reasoning, most thorough analysis |
| `xhigh` | Extended capability for long-horizon work. **Available only on Opus 4.7.** | Long-running agentic/coding tasks (30+ min) |
| `high` | High capability. **Equivalent to not setting parameter.** API default. | Complex reasoning, difficult coding, agentic tasks |
| `medium` | Balanced with moderate token savings. | Balance of speed, cost, and performance |
| `low` | Most efficient. Significant token savings. | Simple tasks, subagents, speed-sensitive |

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- Effort levels

### What Effort Affects

- Text responses and explanations
- Tool calls and function arguments
- Extended thinking (when enabled)
- Lower effort = fewer tool calls, less preamble, terse messages
- Higher effort = more tool calls, detailed plans, comprehensive code comments

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- How effort works

### Key Facts About `budget_tokens` Deprecation

- For Opus 4.6 and Sonnet 4.6: effort replaces `budget_tokens` as recommended way to control thinking depth
- `budget_tokens` still accepted on Opus 4.6 and Sonnet 4.6 but deprecated
- Opus 4.7: manual `thinking: {type: "enabled", budget_tokens: N}` is NO LONGER SUPPORTED; use adaptive thinking with effort

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- Effort with extended thinking

### Model-Specific Recommendations

**Sonnet 4.6**: Default `high`. Recommended: `medium` as default; `low` for latency; `high`/`max` for max intelligence.

**Opus 4.7**: Start with `xhigh` for coding/agentic. `high` minimum for intelligence-sensitive workloads. At `xhigh`/`max`, set `max_tokens` to at least 64k.

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- Recommended effort levels

### Effort with Extended Thinking (by model)

- **Mythos Preview**: Adaptive thinking by default; `thinking: {type: "disabled"}` rejected
- **Opus 4.7**: Adaptive thinking (`thinking: {type: "adaptive"}`); manual `budget_tokens` NOT supported
- **Opus 4.6**: Adaptive thinking recommended; `budget_tokens` deprecated but still accepted
- **Sonnet 4.6**: Adaptive thinking; interleaved mode still functional but deprecated
- **Opus 4.5 and earlier**: Manual thinking with `budget_tokens`; effort works alongside

> **Source:** https://platform.claude.com/docs/en/build-with-claude/effort.md -- Effort with extended thinking

---

## 6. Agent Skills

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md

### What Skills Are

- Modular capabilities that extend Claude's functionality
- Package instructions, metadata, and optional resources (scripts, templates)
- Reusable, filesystem-based resources providing domain-specific expertise
- Progressive disclosure: metadata loaded at startup (~100 tokens), instructions loaded when triggered (under 5k tokens), resources loaded as needed

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Why use Skills

### Three Levels of Loading

| Level | When Loaded | Token Cost | Content |
|-------|------------|------------|---------|
| Level 1: Metadata | Always (at startup) | ~100 tokens per Skill | `name` and `description` from YAML frontmatter |
| Level 2: Instructions | When Skill is triggered | Under 5k tokens | SKILL.md body |
| Level 3+: Resources | As needed | Effectively unlimited | Bundled files executed via bash |

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Three types of Skill content

### Pre-Built Agent Skills

- PowerPoint (`pptx`): Create presentations, edit slides
- Excel (`xlsx`): Create spreadsheets, analyze data, generate reports
- Word (`docx`): Create documents, edit content
- PDF (`pdf`): Generate formatted PDF documents

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Available Skills

### API Requirements (3 beta headers)

- `code-execution-2025-08-25` -- Skills run in code execution container
- `skills-2025-10-02` -- Enables Skills functionality
- `files-api-2025-04-14` -- Required for uploading/downloading files

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Claude API

### Skill Structure

- Every Skill requires `SKILL.md` with YAML frontmatter
- Required fields: `name` and `description`
- `name`: max 64 chars, lowercase letters/numbers/hyphens, no XML tags, no "anthropic" or "claude"
- `description`: max 1024 chars, non-empty

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Skill structure

### Where Skills Work

| Surface | Pre-built Skills | Custom Skills | Sharing |
|---------|-----------------|---------------|---------|
| Claude API | Yes | Yes (upload via /v1/skills) | Workspace-wide |
| Claude Code | No | Yes (filesystem-based) | Personal or project-based |
| Claude.ai | Yes (auto) | Yes (zip upload in Settings) | Individual user only |

- Skills do NOT sync across surfaces (must upload separately)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Where Skills work

### Runtime Constraints

- **Claude.ai**: Varying network access depending on settings
- **Claude API**: NO network access, NO runtime package installation
- **Claude Code**: Full network access

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Runtime environment constraints

### Not ZDR Eligible

- Agent Skills is NOT covered by ZDR arrangements

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview.md -- Data retention

### Using Skills in Messages API

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart.md

- Specify skills in `container.skills` parameter
- Requires code execution tool: `{"type": "code_execution_20250825", "name": "code_execution"}`
- Pre-built skill format: `{"type": "anthropic", "skill_id": "pptx", "version": "latest"}`
- List available skills: `GET /v1/skills?source=anthropic`

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart.md -- Step 1-2

### Skills Guide (API)

> **Source:** https://platform.claude.com/docs/en/build-with-claude/skills-guide.md

- Custom Skills uploaded via `/v1/skills` endpoints
- Both pre-built and custom use same `container` structure
- Skill Management API: CRUD operations for Skills
- Skill Versions API: Version management

> **Source:** https://platform.claude.com/docs/en/build-with-claude/skills-guide.md -- Overview

### Best Practices (Authoring)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md

- Context window is a public good -- be concise
- Default assumption: Claude is already very smart; only add context Claude doesn't have
- Challenge each piece: "Does Claude really need this explanation?"
- Keep SKILL.md under 5k tokens

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md -- Core principles

---

## 7. Web Search Tool

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool.md

### Tool Versions

- `web_search_20260209` -- Latest, supports **dynamic filtering** with code execution
- `web_search_20250305` -- Previous version without dynamic filtering

### Dynamic Filtering

- Claude writes and executes code to post-process/filter search results BEFORE they reach context window
- Requires code execution tool enabled
- Effective for: technical documentation search, literature review, technical research, response grounding
- Available on Claude API and Microsoft Azure; basic version (no filtering) on Google Vertex AI

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool.md -- Dynamic filtering

### How It Works

1. Claude decides when to search based on prompt
2. API executes searches and provides results (may repeat multiple times)
3. Claude provides final response with cited sources

### Configuration

- `max_uses`: limit number of search operations per request
- Organization admin must enable web search in Claude Console

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool.md -- How to use

---

## 8. Code Execution Tool

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md

### Tool Versions

- `code_execution_20260120` -- Adds REPL state persistence and programmatic tool calling (Opus 4.5+, Sonnet 4.5+)
- `code_execution_20250825` -- Bash commands and file operations (all listed models)
- `code_execution_20250522` -- Legacy (Python only)

### Free When Combined

- **Code execution is free when used with web search or web fetch** (`web_search_20260209` or `web_fetch_20260209`)
- Only standard input/output token costs apply

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md -- Free when combined

### Model Compatibility

| Model | Tool Versions |
|-------|--------------|
| Claude Opus 4.7 | `code_execution_20250825`, `code_execution_20260120` |
| Claude Opus 4.6 | `code_execution_20250825`, `code_execution_20260120` |
| Claude Sonnet 4.6 | `code_execution_20250825`, `code_execution_20260120` |
| Claude Opus 4.5 | `code_execution_20250825`, `code_execution_20260120` |
| Claude Sonnet 4.5 | `code_execution_20250825`, `code_execution_20260120` |
| Claude Haiku 4.5 | `code_execution_20250825` only |

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md -- Model compatibility

### Platform Availability

- Claude API (Anthropic) and Microsoft Azure AI Foundry
- NOT available on Amazon Bedrock or Google Vertex AI

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md -- Platform availability

### Not ZDR Eligible

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool.md -- ZDR note

---

## 9. Tool Reference (Directory)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference.md

### All Anthropic-Provided Tools

| Tool | Type(s) | Execution | Status |
|------|---------|-----------|--------|
| Web search | `web_search_20260209`, `web_search_20250305` | Server | GA |
| Web fetch | `web_fetch_20260209`, `web_fetch_20250910` | Server | GA |
| Code execution | `code_execution_20260120`, `code_execution_20250825` | Server | GA |
| Advisor | `advisor_20260301` | Server | Beta: `advisor-tool-2026-03-01` |
| Tool search | `tool_search_tool_regex_20251119`, `tool_search_tool_bm25_20251119` | Server | GA |
| MCP connector | `mcp_toolset` | Server | Beta: `mcp-client-2025-11-20` |
| Memory | `memory_20250818` | Client | GA |
| Bash | `bash_20250124` | Client | GA |
| Text editor | `text_editor_20250728`, `text_editor_20250124` | Client | GA |
| Computer use | `computer_20251124`, `computer_20250124` | Client | Beta |

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference.md -- Anthropic-provided tools

### Tool Definition Properties (Optional, any tool)

| Property | Purpose |
|----------|---------|
| `cache_control` | Set prompt-cache breakpoint at this tool definition |
| `strict` | Guarantee schema validation on tool names and inputs |
| `defer_loading` | Exclude from initial system prompt; load on demand via tool search |
| `allowed_callers` | Restrict which callers can call the tool |
| `input_examples` | Example input objects (user-defined and client tools only) |
| `eager_input_streaming` | Enable fine-grained input streaming (user-defined only) |

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference.md -- Tool definition properties

### `allowed_callers` Values

| Value | Meaning |
|-------|---------|
| `"direct"` | Model can call tool directly (default if omitted) |
| `"code_execution_20260120"` | Only callable from within code execution sandbox |

Omitting `"direct"` means tool only callable from code execution.

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference.md -- allowed_callers

### `defer_loading` and Prompt Caching

- Tools with `defer_loading: true` stripped from rendered tools section before cache key
- Do not appear in system-prompt prefix
- Discovered via tool search, expanded inline at conversation body
- Preserves prompt cache (adding deferred tools does not invalidate cache)

> **Source:** https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-reference.md -- defer_loading

---

## 10. Customer Support Chat Guide

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat.md

### When to Use Claude for Support

- High volume of repetitive queries
- Need for quick information synthesis
- 24/7 availability requirement
- Rapid scaling during peak periods
- Consistent brand voice

### Why Claude Over Other LLMs

- Natural, nuanced conversation
- Complex and open-ended queries without canned responses
- Scalable multilingual support (200+ languages)

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat.md -- Decide whether to use Claude

### Implementation Approach

1. Define ideal chat interaction (write example conversation)
2. Break interaction into unique tasks (greeting, product info, conversation management, quote generation, etc.)
3. Establish success criteria with measurable benchmarks

### Success Criteria

- Query comprehension accuracy: target 95%+
- Response relevance: target 90%+
- Response accuracy: target 100%
- Topic adherence: target 95%+
- Escalation efficiency: target 95%+
- Deflection rate: target 70-80%
- Customer satisfaction: target 4/5+

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat.md -- Establish success criteria

### Model Choice

- Claude Opus 4.7 for balance of intelligence, latency, cost
- Claude Haiku 4.5 for optimizing latency in multi-prompt flows (RAG, tool use, long context)

### Prompt Architecture

- System prompt: role prompting only (e.g., "You are Eva, a friendly AI assistant for Acme Insurance")
- Bulk of prompt content goes in first User turn (not system prompt)
- Break complex prompts into subsections for each task

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat.md -- Build a strong prompt

---

## 11. Ticket Routing Guide

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing.md

### When to Use Claude for Classification

- Limited labeled training data
- Classification categories likely to change/evolve
- Complex, unstructured text inputs
- Semantic understanding required (not pattern matching)
- Interpretable reasoning needed
- Edge cases and ambiguous tickets
- Multilingual support without separate models

### Implementation Steps

1. Understand current support approach
2. Define user intent categories (technical issue, account management, product info, etc.)
3. Establish success criteria

### Example Intent Categories

- Technical issue (hardware, software, compatibility, performance)
- Account management (password reset, billing, subscription)
- Product information (features, pricing, availability)
- User guidance (how-to, best practices, troubleshooting)
- Feedback (bug reports, feature requests, complaints)
- Order-related (status, shipping, returns)
- Service request (installation, upgrade, maintenance)
- Security concerns (privacy, suspicious activity)
- Emergency support (critical failures, urgent security)
- Integration and API (integration help, API usage)

### Success Criteria

- Classification consistency: target 95%+
- Adaptation speed: target >90% accuracy within 50-100 sample tickets for new categories
- Multilingual handling: no more than 5-10% accuracy drop for non-primary languages
- Edge case handling: target 80%+ accuracy
- Bias mitigation: within 2-3% accuracy across demographics
- Prompt efficiency: target 90%+ with just title and brief description
- Explainability score: target 4/5+

> **Source:** https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing.md -- Success criteria

---

## Key Exam Facts -- Quick Reference

### Beta Headers Summary

| Feature | Beta Header |
|---------|-------------|
| Managed Agents | `managed-agents-2026-04-01` |
| Server-side Compaction | `compact-2026-01-12` |
| Context Editing | `context-management-2025-06-27` |
| Task Budgets | `task-budgets-2026-03-13` |
| Skills | `skills-2025-10-02` |
| Code Execution | `code-execution-2025-08-25` |
| Files API | `files-api-2025-04-14` |
| Advisor Tool | `advisor-tool-2026-03-01` |
| MCP Connector | `mcp-client-2025-11-20` |
| Computer Use | `computer-use-2025-11-24` |

### Effort (No Beta Header Required)

- `low` < `medium` < `high` (default) < `xhigh` (Opus 4.7 only) < `max`
- `high` = same as omitting parameter
- Affects ALL tokens: text, tool calls, thinking

### Context Management Hierarchy

1. **Server-side compaction** (recommended) -- automatic summarization
2. **Context editing** -- selective clearing (tool results, thinking blocks)
3. **Client-side SDK compaction** -- SDK-based summarization (least recommended)

### Stop Reasons to Know

- `end_turn`, `max_tokens`, `stop_sequence`, `tool_use`, `pause_turn`, `refusal`, `model_context_window_exceeded`, `compaction`

### Tool Type Strings to Know

- `web_search_20260209` / `web_search_20250305`
- `web_fetch_20260209` / `web_fetch_20250910`
- `code_execution_20260120` / `code_execution_20250825`
- `memory_20250818`
- `bash_20250124`
- `text_editor_20250728`
- `agent_toolset_20260401` (Managed Agents)
- `mcp_toolset`

### ZDR Eligibility

- Eligible: Compaction, Context Editing, Effort, Task Budgets
- NOT eligible: Agent Skills, Code Execution
