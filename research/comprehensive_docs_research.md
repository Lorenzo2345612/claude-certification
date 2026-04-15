# Comprehensive Anthropic Documentation Research
## Claude Certified Architect Study Guide

Generated: 2026-04-15
Sources: 24 official documentation pages from platform.claude.com, code.claude.com, and modelcontextprotocol.io

---

# PART 1: AGENTIC ARCHITECTURE & TOOL USE

---

## 1.1 How Tool Use Works

### Core Concept
Tool use is a **contract** between your application and the model. You specify what operations are available and what shape their inputs/outputs take; Claude decides when and how to call them. The model **never executes anything on its own** -- it emits a structured request, your code runs the operation, and the result flows back into the conversation.

### Three Categories of Tools

| Category | Who Writes Schema | Who Executes | Examples |
|----------|------------------|--------------|----------|
| **User-defined (client-executed)** | You | You | Custom business logic, internal APIs |
| **Anthropic-schema (client-executed)** | Anthropic | You | `bash`, `text_editor`, `computer`, `memory` |
| **Server-executed** | Anthropic | Anthropic | `web_search`, `web_fetch`, `code_execution`, `tool_search` |

**Key insight**: Anthropic-schema tools are "trained-in" -- Claude has been optimized on thousands of successful trajectories using these exact tool signatures, so it calls them more reliably and recovers from errors more gracefully than equivalent custom tools.

### The Agentic Loop (Client Tools)

```
1. Send request with `tools` array + user message
2. Claude responds with stop_reason: "tool_use" + tool_use blocks
3. Execute each tool, format outputs as tool_result blocks
4. Send new request with original messages + assistant response + tool_results
5. Repeat while stop_reason == "tool_use"
```

The loop exits on: `"end_turn"`, `"max_tokens"`, `"stop_sequence"`, or `"refusal"`.

### The Server-Side Loop
- Server-executed tools run their own loop inside Anthropic's infrastructure
- Has an iteration limit; if hit, returns `stop_reason: "pause_turn"` 
- **Paused turn**: re-send the conversation (including paused response) to let the model continue

### When to Use Tools vs. Not

**USE tools when:**
- Actions have side effects (sending email, writing files)
- Fresh or external data needed (current prices, database contents)
- Structured, guaranteed-shape outputs required
- Calling into existing systems (APIs, databases, file systems)

**DON'T use tools when:**
- Model can answer from training alone (summarization, translation)
- One-shot Q&A with no side effects
- Tool-calling latency would dominate a trivial response

**Key anti-pattern**: If you're writing a regex to extract a decision from model output, that decision should have been a tool call.

---

## 1.2 Define Tools

### Tool Definition Structure

| Parameter | Description |
|-----------|-------------|
| `name` | Must match regex `^[a-zA-Z0-9_-]{1,64}$` |
| `description` | Detailed plaintext description of what/when/how |
| `input_schema` | JSON Schema object defining expected parameters |
| `input_examples` | (Optional) Array of example input objects |

Additional optional properties: `cache_control`, `strict`, `defer_loading`, `allowed_callers`

### Tool Use System Prompt (Auto-Generated)
When you call the API with `tools`, a special system prompt is constructed:
```
In this environment you have access to a set of tools...
{{ FORMATTING INSTRUCTIONS }}
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Best Practices for Tool Definitions

1. **Provide extremely detailed descriptions** (3-4+ sentences per tool). This is THE most important factor in tool performance.
2. **Use `input_examples` for complex tools** -- schema-validated examples add ~20-50 tokens for simple, ~100-200 for complex
3. **Consolidate related operations** into fewer tools with an `action` parameter (e.g., one `github_pr` tool with actions, not `create_pr`, `review_pr`, `merge_pr`)
4. **Use meaningful namespacing** (e.g., `github_list_prs`, `slack_send_message`)
5. **Return only high-signal information** -- semantic/stable identifiers, only fields Claude needs

### Controlling Claude's Output: tool_choice

| Option | Behavior |
|--------|----------|
| `auto` (default when tools provided) | Claude decides whether to call tools |
| `any` | Must use one of the provided tools |
| `tool` | Must use a specific named tool |
| `none` (default when no tools) | Cannot use any tools |

**Important constraints:**
- With `any` or `tool`, the API prefills the assistant message -- Claude will NOT emit natural language before tool_use blocks
- Extended thinking only supports `auto` and `none` (not `any` or `tool`)
- Claude Mythos Preview does not support forced tool use

### Input Examples
- Each example must be valid according to `input_schema` (invalid returns 400)
- Not supported for server-side tools
- Token cost: ~20-50 tokens simple, ~100-200 complex

---

## 1.3 Handle Tool Calls

### Tool Use Response Structure
```json
{
  "stop_reason": "tool_use",
  "content": [
    { "type": "text", "text": "I'll check..." },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": { "location": "San Francisco, CA" }
    }
  ]
}
```

### Tool Result Format
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

### Critical Formatting Rules
- Tool result blocks MUST immediately follow their corresponding tool use blocks
- In user message containing tool results, **tool_result blocks must come FIRST** in the content array; text must come AFTER all tool results
- Content can be: string, list of nested content blocks (text/image), or list of document blocks
- `is_error: true` flag for error results

### Error Handling
- **Tool execution errors**: Return error message in `content` with `"is_error": true`
- **Invalid tool calls**: Claude will retry 2-3 times with corrections before apologizing
- **Write instructive error messages**: e.g., "Rate limit exceeded. Retry after 60 seconds." not just "failed"
- **Server tool errors**: Handled transparently by Claude (web search error codes: `too_many_requests`, `invalid_input`, `max_uses_exceeded`, `query_too_long`, `unavailable`)

---

## 1.4 Strict Tool Use

### Core Concept
Setting `strict: true` uses **grammar-constrained sampling** to guarantee Claude's tool inputs match your JSON Schema exactly.

### Why It Matters for Agents
Without strict mode: Claude might return `"2"` instead of `2`, or miss required fields.
With strict mode: Functions receive correctly-typed arguments every time. No validation/retry needed.

### Configuration
```json
{
  "name": "search_flights",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": { ... },
    "required": ["destination", "departure_date"],
    "additionalProperties": false
  }
}
```

### Guarantees
- Tool `input` strictly follows `input_schema`
- Tool `name` is always valid (from provided tools or server tools)

### Data Retention
- Schemas temporarily cached up to 24 hours since last use
- HIPAA eligible, but **PHI must NOT be in tool schema definitions** (property names, enum values, const values, pattern regex)
- PHI should only appear in message content (prompts and responses)

### Combine with tool_choice
`tool_choice: {"type": "any"}` + `strict: true` = guaranteed tool call AND guaranteed schema compliance.

---

## 1.5 Parallel Tool Use

### Default Behavior
Claude may call multiple tools in a single response by default.

### Disabling
```json
{ "tool_choice": { "type": "auto", "disable_parallel_tool_use": true } }
```
- With `auto`: ensures **at most one** tool
- With `any` or `tool`: ensures **exactly one** tool

### Critical Formatting Rule for Parallel Results
All tool results from parallel calls MUST be in a **single user message**:
```json
// CORRECT: Single message with all results
{ "role": "user", "content": [tool_result_1, tool_result_2] }

// WRONG: Separate messages (reduces future parallel tool use!)
{ "role": "user", "content": [tool_result_1] },
{ "role": "user", "content": [tool_result_2] }
```

### Maximizing Parallel Tool Use
System prompt for Claude 4 models:
```
For maximum efficiency, whenever you need to perform multiple independent 
operations, invoke all relevant tools simultaneously rather than sequentially.
```

### Measuring Parallel Usage
Average tools per tool-calling message should be > 1.0 if parallel calls are working.

---

# PART 2: CLAUDE AGENT SDK

---

## 2.1 Agent SDK Overview

### What It Is
The Claude Agent SDK (formerly Claude Code SDK) provides the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.

### Installation
```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python  
pip install claude-agent-sdk
```

### Authentication
- Default: `ANTHROPIC_API_KEY` env var
- Amazon Bedrock: `CLAUDE_CODE_USE_BEDROCK=1`
- Google Vertex AI: `CLAUDE_CODE_USE_VERTEX=1`
- Microsoft Azure: `CLAUDE_CODE_USE_FOUNDRY=1`

### Core Function: `query()`
```python
async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    print(message)
```

### Built-in Tools

| Tool | What it does |
|------|-------------|
| **Read** | Read any file in working directory |
| **Write** | Create new files |
| **Edit** | Make precise edits to existing files |
| **Bash** | Run terminal commands, scripts, git |
| **Monitor** | Watch background script, react to output |
| **Glob** | Find files by pattern |
| **Grep** | Search file contents with regex |
| **WebSearch** | Search the web |
| **WebFetch** | Fetch and parse web pages |
| **AskUserQuestion** | Ask user clarifying questions |

### Key Difference: Agent SDK vs Client SDK
- **Client SDK**: You implement the tool loop (while stop_reason == "tool_use")
- **Agent SDK**: Claude handles tools autonomously (just iterate messages)

### Features from Claude Code
When `setting_sources=["project"]` is set:
- Skills (`.claude/skills/*/SKILL.md`)
- Slash commands (`.claude/commands/*.md`)
- Memory (`CLAUDE.md` or `.claude/CLAUDE.md`)
- Plugins (programmatic via `plugins` option)

---

## 2.2 Agent SDK Hooks

### Concept
Hooks are callback functions that run your code in response to agent events. They can block, log, transform, require approval, or track events.

### Available Hook Events

| Hook Event | Python | TypeScript | Trigger |
|-----------|--------|-----------|---------|
| `PreToolUse` | Yes | Yes | Before tool execution (can block/modify) |
| `PostToolUse` | Yes | Yes | After tool execution result |
| `PostToolUseFailure` | Yes | Yes | After tool execution failure |
| `UserPromptSubmit` | Yes | Yes | User prompt submission |
| `Stop` | Yes | Yes | Agent execution stop |
| `SubagentStart` | Yes | Yes | Subagent initialization |
| `SubagentStop` | Yes | Yes | Subagent completion |
| `PreCompact` | Yes | Yes | Conversation compaction request |
| `PermissionRequest` | Yes | Yes | Permission dialog |
| `Notification` | Yes | Yes | Agent status messages |
| `SessionStart` | No | Yes | Session initialization |
| `SessionEnd` | No | Yes | Session termination |

### Hook Configuration Structure
```python
options = ClaudeAgentOptions(
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Write|Edit", hooks=[my_callback])
        ]
    }
)
```

### Matcher Filtering
- Regex pattern matched against event's filter field (usually tool name)
- `"Bash"` -- only fires for Bash commands
- `"^mcp__"` -- all MCP tools
- No matcher = fires for every event of that type
- **Matchers only filter tool names, NOT file paths** -- check `tool_input.file_path` inside callback

### Callback Return Values

**Top-level fields:**
- `systemMessage` -- inject message into conversation visible to model
- `continue` / `continue_` -- whether agent keeps running

**hookSpecificOutput fields (PreToolUse):**
- `permissionDecision`: `"allow"`, `"deny"`, or `"ask"`
- `permissionDecisionReason`: explanation string
- `updatedInput`: modified tool input (must also set permissionDecision: "allow")

**Priority rule**: deny > ask > allow (if any hook returns deny, operation is blocked)

### Async Hooks
```python
return {"async_": True, "asyncTimeout": 30000}
```
Agent proceeds without waiting. Cannot block/modify. Use for logging, metrics, notifications.

---

## 2.3 Agent SDK Subagents

### Three Ways to Create Subagents
1. **Programmatically**: `agents` parameter in `query()` options
2. **Filesystem-based**: `.claude/agents/` markdown files
3. **Built-in**: `general-purpose` subagent (always available via Agent tool)

### AgentDefinition Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | Yes | When to use this agent |
| `prompt` | string | Yes | System prompt defining role/behavior |
| `tools` | string[] | No | Allowed tools (inherits all if omitted) |
| `model` | `'sonnet'|'opus'|'haiku'|'inherit'` | No | Model override |
| `skills` | string[] | No | Available skills |
| `memory` | `'user'|'project'|'local'` | No | Memory source (Python only) |
| `mcpServers` | (string|object)[] | No | MCP servers available |

**Critical**: Subagents CANNOT spawn their own subagents. Don't include `Agent` in a subagent's tools.

### What Subagents Inherit vs. Don't

| Receives | Does NOT Receive |
|----------|-----------------|
| Own system prompt + Agent tool's prompt | Parent's conversation history |
| Project CLAUDE.md (via settingSources) | Skills (unless in AgentDefinition.skills) |
| Tool definitions (inherited or subset) | Parent's system prompt |

### Benefits
- **Context isolation**: Intermediate results stay in subagent; only final message returns
- **Parallelization**: Multiple subagents can run concurrently
- **Specialized instructions**: Tailored prompts with domain expertise
- **Tool restrictions**: Read-only agents, test-only agents, etc.

### Detecting Subagent Invocation
Messages from subagents include `parent_tool_use_id`. Tool name is `"Agent"` (previously `"Task"` before v2.1.63).

---

## 2.4 Agent SDK Sessions

### Core Concept
A session is the conversation history accumulated while an agent works. Written to disk automatically at `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`.

### Session Operations

| Operation | How to Find Session | Use Case |
|-----------|-------------------|----------|
| **Continue** | Most recent in current directory | One conversation at a time |
| **Resume** | Specific session ID | Multiple sessions, specific past session |
| **Fork** | Creates new session from copy of original | Try alternative approaches |

### Automatic Session Management

**Python**: `ClaudeSDKClient` handles session IDs internally
```python
async with ClaudeSDKClient(options=options) as client:
    await client.query("Analyze the auth module")  # First query
    await client.query("Now refactor it")  # Auto-continues same session
```

**TypeScript**: `continue: true` on subsequent `query()` calls
```typescript
for await (const message of query({
    prompt: "Now refactor it",
    options: { continue: true, allowedTools: [...] }
})) { ... }
```

### Capturing Session ID
Available from `ResultMessage.session_id` (always present on result) or from init `SystemMessage`.

### Fork Sessions
```python
async for message in query(
    prompt="Try OAuth2 instead",
    options=ClaudeAgentOptions(resume=session_id, fork_session=True),
):
```
Fork creates a NEW session with copied history. Original stays unchanged. File changes are real (not branched).

### Cross-Host Resume
Sessions are local to the machine. To resume elsewhere:
- Move session file to same path on new host (cwd must match)
- Or capture results as application state and pass to fresh session's prompt

---

# PART 3: CLAUDE CODE

---

## 3.1 Memory (CLAUDE.md)

### Two Memory Systems

| | CLAUDE.md Files | Auto Memory |
|--|----------------|-------------|
| **Who writes** | You | Claude |
| **Contains** | Instructions and rules | Learnings and patterns |
| **Scope** | Project, user, or org | Per working tree |
| **Loaded into** | Every session | Every session (first 200 lines or 25KB) |

### CLAUDE.md Locations (by priority)

| Scope | Location | Shared with |
|-------|----------|------------|
| **Managed policy** | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | All org users |
| **Project** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via source control |
| **User** | `~/.claude/CLAUDE.md` | Just you (all projects) |
| **Local** | `./CLAUDE.local.md` | Just you (current project) |

### Writing Effective Instructions
- **Size**: Target under 200 lines per CLAUDE.md file
- **Structure**: Use markdown headers and bullets
- **Specificity**: "Use 2-space indentation" not "Format code properly"
- **Consistency**: Remove conflicting instructions across files
- **Emphasis**: "IMPORTANT" or "YOU MUST" can improve adherence

### Import Syntax
```markdown
See @README.md for project overview
@docs/git-instructions.md
@~/.claude/my-project-instructions.md
```
Max depth: 5 hops. HTML comments are stripped (use for human-only notes).

### Path-Specific Rules (.claude/rules/)
```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- All endpoints must include input validation
```

### Auto Memory
- Storage: `~/.claude/projects/<project>/memory/`
- `MEMORY.md` entrypoint + optional topic files
- First 200 lines or 25KB loaded at session start
- Claude reads/writes during session
- Toggle: `autoMemoryEnabled` in settings or `/memory` command

### Compaction Behavior
- Project-root CLAUDE.md survives compaction (re-read from disk)
- Nested CLAUDE.md files in subdirectories NOT re-injected automatically until Claude reads files in that subdirectory

---

## 3.2 Skills

### Core Concept
Skills are `SKILL.md` files that extend Claude's capabilities. They load only when used (unlike CLAUDE.md which always loads), making them ideal for long reference material and multi-step procedures.

### Skill Structure
```
my-skill/
  SKILL.md           # Main instructions (required)
  template.md        # Templates for Claude
  examples/sample.md # Example outputs
  scripts/validate.sh # Executable scripts
```

### Frontmatter Reference

| Field | Description |
|-------|-------------|
| `name` | Display name (lowercase, numbers, hyphens, max 64 chars) |
| `description` | What it does and when to use it (1,536 char cap) |
| `disable-model-invocation` | `true` = only manual invocation |
| `user-invocable` | `false` = hidden from / menu |
| `allowed-tools` | Auto-approved tools when skill active |
| `model` | Model override |
| `effort` | `low`, `medium`, `high`, `max` |
| `context` | `fork` = run in forked subagent context |
| `agent` | Subagent type for `context: fork` |
| `paths` | Glob patterns limiting activation |

### Invocation Control

| Setting | You invoke | Claude invokes |
|---------|-----------|---------------|
| (default) | Yes | Yes |
| `disable-model-invocation: true` | Yes | No |
| `user-invocable: false` | No | Yes |

### String Substitutions
- `$ARGUMENTS` -- all arguments passed
- `$ARGUMENTS[N]` or `$N` -- specific argument by index
- `${CLAUDE_SESSION_ID}` -- current session ID
- `${CLAUDE_SKILL_DIR}` -- directory containing SKILL.md

### Dynamic Context Injection
`` !`gh pr diff` `` -- runs shell command before sending to Claude; output replaces placeholder.

### Skill Content Lifecycle
- Content enters conversation as single message, stays for rest of session
- After compaction: most recent invocation re-attached (first 5,000 tokens each, 25,000 total budget)
- Re-attached starting from most recently invoked

---

## 3.3 CLI Reference

### Key Commands

| Command | Purpose |
|---------|---------|
| `claude` | Start interactive session |
| `claude "query"` | Interactive with initial prompt |
| `claude -p "query"` | Non-interactive (print mode), then exit |
| `claude -c` | Continue most recent conversation |
| `claude -r "<session>" "query"` | Resume specific session |
| `claude mcp` | Configure MCP servers |

### Important Flags

| Flag | Purpose |
|------|---------|
| `--model` | Set model (`sonnet`, `opus`, or full name) |
| `--max-turns` | Limit agentic turns (print mode only) |
| `--max-budget-usd` | Max API spend before stopping |
| `--allowedTools` | Tools that execute without prompting |
| `--disallowedTools` | Tools removed from context entirely |
| `--permission-mode` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` |
| `--system-prompt` | Replace entire system prompt |
| `--append-system-prompt` | Append to default prompt |
| `--json-schema` | Get validated JSON output matching schema |
| `--output-format` | `text`, `json`, `stream-json` |
| `--bare` | Minimal mode, skip auto-discovery |
| `--effort` | `low`, `medium`, `high`, `max` |
| `--worktree`, `-w` | Start in isolated git worktree |

### System Prompt Flags
- `--system-prompt` / `--system-prompt-file`: **Replace** entire prompt
- `--append-system-prompt` / `--append-system-prompt-file`: **Append** to default
- Append flags preserve Claude Code's built-in capabilities
- Replace flags for complete control only

---

## 3.4 GitHub Actions

### Setup
1. Install Claude GitHub app or run `/install-github-app`
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Copy workflow file to `.github/workflows/`

### Basic Workflow
```yaml
name: Claude Code
on:
  issue_comment: { types: [created] }
  pull_request_review_comment: { types: [created] }
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Action Parameters

| Parameter | Description |
|-----------|-------------|
| `prompt` | Instructions for Claude |
| `claude_args` | CLI arguments (`--max-turns 5 --model opus`) |
| `anthropic_api_key` | API key (required for direct API) |
| `trigger_phrase` | Custom trigger (default: "@claude") |
| `use_bedrock` | Use AWS Bedrock |
| `use_vertex` | Use Google Vertex AI |

### Cloud Provider Support
- **AWS Bedrock**: OIDC authentication, model format `us.anthropic.claude-sonnet-4-6`
- **Google Vertex AI**: Workload Identity Federation, model format `claude-sonnet-4-5@20250929`

---

## 3.5 Context Window (Claude Code)

### What Loads at Startup (in order)
1. System prompt (~4,200 tokens)
2. Auto memory (MEMORY.md) (~680 tokens)
3. Environment info (~280 tokens)
4. MCP tools (deferred) (~120 tokens)
5. CLAUDE.md files (variable)
6. Git status, skill descriptions, etc.

### Key Concepts
- Context window fills fast; LLM performance degrades as it fills
- **Auto-compaction** triggers when approaching limits
- `/compact <instructions>` for manual compaction with focus
- `/clear` resets context entirely between tasks

### What Survives Compaction
- Project-root CLAUDE.md (re-read from disk)
- Invoked skills (first 5,000 tokens each, 25,000 total budget)
- Key code and decisions (summarized)

### What Does NOT Survive
- Nested CLAUDE.md files (reload on demand)
- Conversation-only instructions
- Full file contents (summarized)

---

## 3.6 Hooks (Claude Code Shell Hooks)

### Four Hook Types

| Type | Description | Default Timeout |
|------|-------------|----------------|
| `command` | Shell scripts | 600s |
| `http` | POST requests | 30s |
| `prompt` | Single-turn LLM evaluation | 30s |
| `agent` | Subagent-based verification | 60s |

### Configuration Location
```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "path/to/script.sh"
      }]
    }]
  }
}
```

### Exit Code Behavior

| Exit Code | Meaning | JSON Processing |
|-----------|---------|-----------------|
| 0 | Success | Parse JSON from stdout |
| 1 | Non-blocking error | Log, continue |
| 2 | **Blocking error** | Use stderr as error, ignore JSON |
| Other | Non-blocking | Log, continue |

**Critical**: Exit code 1 does NOT block. Use exit 2 for enforcement.

### Key Hook Events

| Event | Control | Key Output |
|-------|---------|-----------|
| `PreToolUse` | Allow/deny/ask/defer | `permissionDecision`, `updatedInput` |
| `PostToolUse` | Block/feedback | `additionalContext` |
| `Stop` | Prevent stopping | `decision: "block"` |
| `UserPromptSubmit` | Block prompt | `additionalContext` |
| `SessionStart` | Context injection | `additionalContext`, `CLAUDE_ENV_FILE` |
| `FileChanged` | React to file changes | Literal filename matcher |

### MCP Tool Naming Pattern
`mcp__<server>__<tool>` (e.g., `mcp__memory__save`)

---

## 3.7 Subagents (Claude Code)

### Defining Subagents as Files
```markdown
<!-- .claude/agents/security-reviewer.md -->
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities
- Authentication flaws
- Secrets in code
```

### Supported Frontmatter Fields

| Field | Description |
|-------|-------------|
| `name` | Unique identifier |
| `description` | When to use this agent |
| `tools` | Comma-separated list (Read, Grep, Glob, Bash, Edit, Write, Monitor, WebFetch, WebSearch) |
| `model` | `sonnet`, `opus`, `haiku`, or `inherit` |
| `skills` | List of preloaded skill names |
| `memory` | `user`, `project`, or `local` |
| `auto_memory` | Enable auto memory for subagent |
| `max_turns` | Limit turns for this subagent |

### Where Subagent Files Live

| Location | Scope |
|----------|-------|
| `~/.claude/agents/` | All your projects |
| `.claude/agents/` | Current project |
| Plugin agents | Where plugin is enabled |

### Context Isolation
Each subagent gets its own context window. Only the final message returns to parent. Intermediate tool calls/results stay inside.

---

## 3.8 Best Practices

### #1 Most Important Rule
**Context window management is the most important resource to manage.** Performance degrades as context fills.

### Top Patterns

1. **Give Claude verification** -- tests, screenshots, expected outputs. Single highest-leverage practice.
2. **Explore first, then plan, then code** -- Use Plan Mode (Ctrl+G to edit plan)
3. **Provide specific context** -- reference files, mention constraints, point to patterns
4. **Use /clear between unrelated tasks**
5. **Use subagents for investigation** -- keeps main conversation clean
6. **Course-correct early** -- Esc to stop, Esc+Esc or /rewind to restore
7. **After 2 failed corrections** -- /clear and write a better initial prompt

### Anti-Patterns to Avoid
- **Kitchen sink session** -- mixing unrelated tasks in one context
- **Correcting over and over** -- pollutes context with failed approaches
- **Over-specified CLAUDE.md** -- too long = Claude ignores rules
- **Trust-then-verify gap** -- always provide verification
- **Infinite exploration** -- scope investigations or use subagents

### Scaling Patterns
- `claude -p "prompt"` for non-interactive/CI use
- Multiple parallel sessions (desktop, web, or agent teams)
- Fan-out: loop through files calling `claude -p` for each
- Writer/Reviewer pattern: one session writes, another reviews
- Auto mode: `claude --permission-mode auto -p "fix all lint errors"`

---

# PART 4: API & PROMPT ENGINEERING

---

## 4.1 Prompt Engineering Best Practices

### General Principles

1. **Be clear and direct** -- specific output format, sequential numbered steps
2. **Add context/motivation** -- explain WHY (e.g., "read aloud by TTS" explains no-ellipses rule)
3. **Use examples (few-shot)** -- 3-5 examples in `<example>` tags; diverse, relevant, structured
4. **Structure with XML tags** -- `<instructions>`, `<context>`, `<input>` reduce misinterpretation
5. **Give Claude a role** in system prompt

### Long Context Prompting (20k+ tokens)
- **Put longform data at top**, query at bottom (up to 30% quality improvement)
- **Structure documents in XML**: `<document index="1"><source>...</source><document_content>...</document_content></document>`
- **Ground in quotes**: Ask Claude to quote relevant parts before answering

### Output & Formatting Control
- Tell Claude what to DO instead of what NOT to do
- Use XML format indicators: `<smoothly_flowing_prose_paragraphs>`
- Match prompt style to desired output style
- Claude Opus 4.6 defaults to LaTeX for math

### Thinking & Reasoning
- **Adaptive thinking** (`thinking: {type: "adaptive"}`) is recommended for Claude 4.6
- Effort levels: `low`, `medium`, `high` (default), `max` (Opus 4.6 only)
- Claude calibrates thinking based on effort + query complexity
- **Prefer general instructions over prescriptive steps** for thinking
- Multishot examples work with thinking (use `<thinking>` tags in examples)

### Agentic Systems Best Practices
- **Context awareness**: Claude 4.5+ models track remaining token budget
- **Multi-window workflows**: Write tests first (tests.json), create setup scripts (init.sh), use git for state
- **Starting fresh vs. compacting**: Sometimes a new context window beats compaction
- **Subagent orchestration**: Claude 4.6 may over-spawn subagents; add guidance when direct approach suffices
- **Reduce overengineering**: "Only make changes directly requested or clearly necessary"
- **Minimize hallucinations**: "Never speculate about code you have not opened"

### Migration to Claude 4.6
- Adaptive thinking replaces manual `budget_tokens`
- Prefilled responses deprecated (no more last-assistant-turn prefills)
- Tune anti-laziness prompting DOWN (model is more proactive now)
- Anti-overprompting for tools: "If in doubt use [tool]" will now cause overtriggering

---

## 4.2 Structured Outputs

### Two Features
1. **JSON outputs** (`output_config.format`): Control response format
2. **Strict tool use** (`strict: true`): Guarantee schema validation on tool inputs

### JSON Output Configuration
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[...],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": { ... },
                "required": [...],
                "additionalProperties": False,
            }
        }
    },
)
```

### JSON Schema Limitations
- Max 5 levels of nesting depth
- No `$ref` / `$defs` (must inline)
- No `oneOf`, `anyOf`, `allOf`, `not`
- No `if`/`then`/`else`
- `additionalProperties` must be `false` at every level
- All object properties must be in `required`
- Limited `format` support (only `date`, `date-time`, `time`)
- `pattern` regex limited subset

### Combining with Tools
You can use structured outputs + tool use together. After the agentic loop, the final response follows your output schema.

---

## 4.3 Batch Processing

### Message Batches API
- Asynchronous processing of large volumes of Messages requests
- **50% cost reduction** vs standard API pricing
- Most batches complete within 1 hour
- Results available for 29 days after creation

### Batch Pricing (per MTok)

| Model | Batch Input | Batch Output |
|-------|------------|-------------|
| Claude Opus 4.6 | $2.50 | $12.50 |
| Claude Sonnet 4.6 | $1.50 | $7.50 |
| Claude Haiku 4.5 | $0.50 | $2.50 |

### Limitations
- Max 100,000 requests or 256 MB per batch
- 24-hour expiry if not completed
- Not eligible for Zero Data Retention (ZDR)
- Can mix different request types in single batch

### Workflow
1. Create batch with array of `{ custom_id, params }` objects
2. Poll for status (or use webhook)
3. Retrieve results when `ended_at` is set
4. Results are JSONL format, one result per line

### Batch Statuses
`in_progress` -> `ended` (or `canceling` -> `canceled`, or `expired`)

Each request result: `succeeded`, `errored`, `canceled`, `expired`

---

## 4.4 Context Windows (API)

### Context Window Sizes

| Model | Context Window |
|-------|---------------|
| Claude Mythos Preview, Opus 4.6, Sonnet 4.6 | **1M tokens** |
| Claude Sonnet 4.5, Sonnet 4 (deprecated) | 200K tokens |

### Key Concepts
- As token count grows, accuracy/recall degrade ("context rot")
- Curating what's in context is as important as how much fits
- Max 600 images or PDF pages per request (100 for 200K models)

### Extended Thinking & Context
- Thinking tokens count toward context window limit
- BUT previous thinking blocks are **automatically stripped** from subsequent turns
- You don't need to strip them yourself; API does it automatically
- Exception: During tool use, thinking blocks **MUST** be returned with tool results
- After tool use cycle completes, thinking blocks can be dropped

### Context Awareness (Sonnet 4.6, Sonnet 4.5, Haiku 4.5)
At conversation start:
```xml
<budget:token_budget>1000000</budget:token_budget>
```
After each tool call:
```xml
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

### Context Management: Compaction
Server-side summarization that condenses earlier parts of conversation. Recommended for long-running conversations. Available for Opus 4.6 and Sonnet 4.6.

### Validation
Newer models return validation error when prompt + output exceed context window (rather than silently truncating).

---

## 4.5 Adaptive Thinking

### Core Concept
Instead of manually setting a thinking token budget, adaptive thinking lets Claude dynamically determine when and how much to use extended thinking. Recommended over manual `budget_tokens`.

### Configuration
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[...]
)
```

### Effort Levels

| Level | Behavior |
|-------|----------|
| `max` | Always thinks, no constraints (Opus 4.6, Sonnet 4.6) |
| `high` (default) | Always thinks, deep reasoning |
| `medium` | Moderate thinking, may skip for simple queries |
| `low` | Minimizes thinking, skips for simple tasks |

### Adaptive vs Manual vs Disabled

| Mode | Config | When to Use |
|------|--------|------------|
| **Adaptive** | `thinking: {type: "adaptive"}` | Most workloads (Claude 4.6) |
| **Manual** | `thinking: {type: "enabled", budget_tokens: N}` | Precise cost control (deprecated on 4.6) |
| **Disabled** | Omit `thinking` | Lowest latency, no reasoning |

### Key Facts
- Adaptive automatically enables **interleaved thinking** (thinks between tool calls)
- Thinking blocks contain **summarized** thinking (not full) on Claude 4 models
- `display: "omitted"` returns empty thinking field (faster time-to-first-token when streaming)
- Thinking encryption: `signature` field verifies authenticity; do NOT modify
- You are billed for FULL thinking tokens, not the summary

### Prompt Caching with Adaptive Thinking
- Consecutive requests using same thinking mode preserve cache breakpoints
- Switching between `adaptive` and `enabled`/`disabled` breaks cache for messages
- System prompts and tool definitions remain cached regardless

---

# PART 5: MODEL CONTEXT PROTOCOL (MCP)

---

## 5.1 MCP Architecture

### Key Participants

| Participant | Role |
|------------|------|
| **MCP Host** | AI application that coordinates MCP clients (e.g., Claude Code, VS Code) |
| **MCP Client** | Component maintaining connection to an MCP server |
| **MCP Server** | Program providing context to MCP clients |

**Architecture**: One host creates one client per server. Each client maintains a dedicated connection.

### Two Protocol Layers

**Data Layer** (inner):
- JSON-RPC 2.0 based protocol
- Lifecycle management (initialization, capability negotiation, termination)
- Server features: Tools, Resources, Prompts
- Client features: Sampling, Elicitation, Logging
- Utility: Notifications, progress tracking

**Transport Layer** (outer):
- **Stdio**: Standard input/output for local process communication. No network overhead.
- **Streamable HTTP**: HTTP POST + optional Server-Sent Events. Supports remote servers, OAuth, API keys.

### Lifecycle Management
1. Client sends `initialize` request with `protocolVersion` and `capabilities`
2. Server responds with its `capabilities` and `serverInfo`
3. Client sends `notifications/initialized`
4. Connection established with negotiated capabilities

### Three Core Server Primitives

| Primitive | Purpose | Methods | Controlled By |
|-----------|---------|---------|--------------|
| **Tools** | Executable functions (actions) | `tools/list`, `tools/call` | Model |
| **Resources** | Read-only data sources (context) | `resources/list`, `resources/read`, `resources/subscribe` | Application |
| **Prompts** | Reusable interaction templates | `prompts/list`, `prompts/get` | User |

### Client Primitives
- **Sampling**: Request LLM completions from host (model-independent)
- **Elicitation**: Request user input/confirmation
- **Logging**: Send log messages for debugging

### Notifications
Real-time updates (JSON-RPC notification, no response expected). Example: `notifications/tools/list_changed` when server tools change.

---

## 5.2 MCP Server Concepts

### Tools (Model-Controlled)
- Schema-defined interfaces using JSON Schema for validation
- Each tool performs single operation with typed inputs/outputs
- May require user consent before execution

```typescript
{
  name: "searchFlights",
  description: "Search for available flights",
  inputSchema: {
    type: "object",
    properties: {
      origin: { type: "string" },
      destination: { type: "string" },
      date: { type: "string", format: "date" }
    },
    required: ["origin", "destination", "date"]
  }
}
```

### Resources (Application-Controlled)
- Passive data sources with unique URIs (`file:///path/to/doc.md`)
- Declare MIME type for content handling
- Two discovery patterns:
  - **Direct Resources**: Fixed URIs (e.g., `calendar://events/2024`)
  - **Resource Templates**: Dynamic URIs with parameters (e.g., `travel://activities/{city}/{category}`)
- Support parameter completion (autocomplete for URI parameters)

### Prompts (User-Controlled)
- Structured templates with typed arguments
- Require explicit invocation (not auto-triggered)
- Context-aware, can reference available resources and tools

### Multi-Server Integration
The real power of MCP: multiple servers working together. Example flow:
1. User invokes prompt with parameters
2. User selects resources from multiple servers
3. AI reads resources for context, then executes tools across servers
4. Results combined into unified experience

---

# CROSS-CUTTING CONCEPTS & RELATIONSHIPS

---

## Concept Map

```
API Layer
  |-- Messages API (synchronous)
  |-- Batch API (asynchronous, 50% cheaper)
  |-- Tool Use (user-defined, Anthropic-schema, server-executed)
  |-- Structured Outputs (JSON schema + strict tools)
  |-- Adaptive Thinking (dynamic reasoning)
  |
Agent SDK Layer
  |-- query() function (core interface)
  |-- Built-in tools (Read, Write, Edit, Bash, Glob, Grep, etc.)
  |-- Hooks (PreToolUse, PostToolUse, Stop, etc.)
  |-- Subagents (context isolation, parallelization)
  |-- Sessions (continue, resume, fork)
  |
Claude Code Layer
  |-- CLAUDE.md (persistent instructions)
  |-- Auto Memory (Claude's learnings)
  |-- Skills (on-demand capabilities)
  |-- Hooks (shell commands, HTTP, prompt, agent types)
  |-- Subagents (filesystem-based .claude/agents/)
  |-- CLI (interactive, print mode, flags)
  |-- GitHub Actions (CI/CD integration)
  |
MCP Layer
  |-- Tools (model-controlled actions)
  |-- Resources (application-controlled data)
  |-- Prompts (user-controlled templates)
  |-- Transport (Stdio for local, Streamable HTTP for remote)
```

## Key Relationships

1. **Agent SDK wraps the API**: The `query()` function handles the agentic loop (tool_use -> execute -> tool_result -> repeat) that you'd otherwise build manually with the Client SDK.

2. **Claude Code builds on Agent SDK**: Same capabilities (tools, hooks, sessions) available both as CLI and as SDK library.

3. **MCP extends tool surface**: MCP servers provide additional tools, resources, and prompts that plug into both Claude Code and the Agent SDK.

4. **Hooks enforce what CLAUDE.md advises**: CLAUDE.md instructions are advisory; hooks are deterministic. Use hooks for actions that MUST happen every time.

5. **Skills complement CLAUDE.md**: CLAUDE.md = always-loaded context. Skills = on-demand knowledge. Use CLAUDE.md for facts/rules, skills for procedures/workflows.

6. **Subagents manage context**: The fundamental constraint is context window size. Subagents run in separate context windows, keeping the main conversation clean.

7. **Structured outputs + strict tools**: JSON outputs control response format; strict tools control tool input format. Use together for full schema compliance.

8. **Adaptive thinking + effort**: Replaces manual `budget_tokens`. Let Claude decide when to think, guide with effort level.
