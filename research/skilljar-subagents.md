# Skilljar Course: Introduction to Subagents
**Source:** https://anthropic.skilljar.com/introduction-to-subagents
**Official Docs:** https://code.claude.com/docs/en/subagents, https://code.claude.com/docs/en/agent-teams, https://code.claude.com/docs/en/tools-reference, https://code.claude.com/docs/en/context-window

## Course Structure (4 Modules)

1. What are subagents?
2. Creating a subagent
3. Designing effective subagents
4. Using subagents effectively

---

## Module 1: What Are Subagents?

### Definition
Subagents are specialized AI assistants that handle specific types of tasks. Each subagent runs in **its own context window** with a custom system prompt, specific tool access, and independent permissions.

### Core Purpose
Use a subagent when a side task would flood your main conversation with search results, logs, or file contents you won't reference again. The subagent does that work in its own context and returns **only the summary**.

Define a custom subagent when you keep spawning the same kind of worker with the same instructions.

### How Subagents Work (Context Flow)
1. Claude encounters a task matching a subagent's `description` field
2. Claude writes a task prompt based on the user's request
3. A **fresh, separate context window** is created for the subagent
4. The subagent loads:
   - Its own system prompt (from the markdown body) -- NOT the full Claude Code system prompt
   - Basic environment details (working directory, platform, shell, OS)
   - CLAUDE.md files (same content, but counted against subagent's context, not yours)
   - Same MCP servers and skills setup
   - **NOT** the main session's conversation history
   - **NOT** the main session's auto memory (MEMORY.md)
   - If the custom agent has `memory:` in frontmatter, it loads its own separate MEMORY.md
5. The subagent works independently (reads files, runs commands, etc.)
6. Only the subagent's **final text response** comes back to your context, plus a small metadata trailer with token counts and duration

### Context Savings Example (from official visualization)
- Subagent reads 6,100 tokens of files in its own context
- Only a 420-token summary returns to the main context
- The large file reads stay entirely in the subagent's context window

### Key Properties
- Subagents **cannot spawn other subagents** (no nesting)
- Subagents communicate with parent **via prompt only**
- Each subagent invocation creates a **new instance** with fresh context (unless resumed)
- A subagent starts in the main conversation's current working directory
- Within a subagent, `cd` commands do NOT persist between Bash/PowerShell tool calls
- `cd` commands do NOT affect the main conversation's working directory

### Tool Rename (v2.1.63)
- The **Task** tool was renamed to **Agent**
- Existing `Task(...)` references still work as aliases

### Subagents vs Agent Teams

| Aspect | Subagents | Agent Teams |
|---|---|---|
| **Context** | Own context window; results return to caller | Own context window; fully independent |
| **Communication** | Report results back to main agent only | Teammates message each other directly |
| **Coordination** | Main agent manages all work | Shared task list with self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion/collaboration |
| **Token cost** | Lower: results summarized back to main context | Higher: each teammate is separate Claude instance |
| **Nesting** | Cannot spawn other subagents | Cannot spawn their own teams |

### Subagents vs Skills
- **Skills**: Reusable prompts/workflows that run **in the main conversation context**
- **Subagents**: Run in **isolated context**, only summary returns

### When NOT to Use Subagents
- Task needs frequent back-and-forth or iterative refinement
- Multiple phases share significant context (planning -> implementation -> testing)
- Making a quick, targeted change
- Latency matters (subagents start fresh and may need time to gather context)

### /btw Alternative
For a quick question about something already in your conversation, use `/btw` instead of a subagent. It sees your full context but has no tool access, and the answer is discarded rather than added to history.

---

## Module 2: Creating a Subagent

### 3 Creation Methods

#### 1. File-based (Markdown with YAML frontmatter)
Store in different locations depending on scope:

| Location | Scope | Priority |
|---|---|---|
| Managed settings | Organization-wide | 1 (highest) |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin's `agents/` directory | Where plugin is enabled | 5 (lowest) |

When multiple subagents share the same name, the **higher-priority location wins**.

Project subagents (`.claude/agents/`) are discovered by walking up from the current working directory. Directories added with `--add-dir` grant file access only and are NOT scanned for subagents.

**Subagents are loaded at session start.** If you create one by manually adding a file, restart your session or use `/agents` to load it immediately.

#### 2. CLI flag (`--agents`)
Session-only, not saved to disk. Useful for quick testing or automation scripts:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger..."
  }
}'
```

The `--agents` flag accepts JSON with the same frontmatter fields: `description`, `prompt`, `tools`, `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `initialPrompt`, `memory`, `effort`, `background`, `isolation`, `color`. Use `prompt` for the system prompt (equivalent to the markdown body in file-based subagents).

#### 3. Interactive (`/agents` command)
The `/agents` command opens a tabbed interface:
- **Running tab**: shows live subagents, lets you open or stop them
- **Library tab**: view all available subagents (built-in, user, project, plugin), create new, edit existing, delete custom, see which are active when duplicates exist

Steps via `/agents`:
1. Run `/agents`
2. Switch to Library tab -> Create new agent -> choose Personal or Project
3. Select "Generate with Claude" -> describe the subagent
4. Select tools (read-only, all, or custom)
5. Select model
6. Choose a color
7. Configure memory scope
8. Save (press `s` or `Enter`) or save and edit (`e`)

To list all configured subagents from CLI without starting interactive session: `claude agents`

### Subagent File Format

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

Frontmatter = metadata/configuration. Body = system prompt.

### All 16 Supported Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `name` | **Yes** | Unique identifier using lowercase letters and hyphens |
| `description` | **Yes** | When Claude should delegate to this subagent |
| `tools` | No | Tools the subagent can use. **Inherits ALL tools if omitted** (including MCP) |
| `disallowedTools` | No | Tools to deny, removed from inherited or specified list |
| `model` | No | `sonnet`, `opus`, `haiku`, full model ID (e.g. `claude-opus-4-7`), or `inherit`. Default: `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Maximum agentic turns before the subagent stops |
| `skills` | No | Skills preloaded into subagent's context at startup. Full content injected, not just available. Subagents don't inherit skills from parent |
| `mcpServers` | No | MCP servers: string references to existing servers OR inline definitions |
| `hooks` | No | Lifecycle hooks scoped to this subagent |
| `memory` | No | Persistent memory scope: `user`, `project`, `local` |
| `background` | No | `true` for background task; default `false` |
| `effort` | No | `low`, `medium`, `high`, `xhigh`, `max` (available levels depend on model). Overrides session effort level |
| `isolation` | No | `worktree` for isolated git worktree; auto-cleaned if subagent makes no changes |
| `color` | No | Display color: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `initialPrompt` | No | Auto-submitted as first user turn when agent runs as main session agent (via `--agent` or `agent` setting). Commands and skills are processed. Prepended to any user-provided prompt |

Only `name` and `description` are required.

### Model Resolution Order
When Claude invokes a subagent, the model is resolved in this order:
1. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable (if set)
2. Per-invocation `model` parameter (Claude can pass at invocation time)
3. Subagent definition's `model` frontmatter
4. Main conversation's model

### Plugin Subagent Security Restrictions
Plugin subagents do NOT support `hooks`, `mcpServers`, or `permissionMode` frontmatter fields (silently ignored). To use them, copy the agent file into `.claude/agents/` or `~/.claude/agents/`.

### Managed Subagents
Deployed by org admins via managed settings directory. Take precedence over project/user subagents with same name.

---

## Module 3: Designing Effective Subagents

### Tool Inheritance & Control

#### Tool Access Rules
- `tools` omitted -> **inherits ALL tools** including MCP
- `tools` set -> only those tools allowed
- `disallowedTools` set -> those tools denied from inherited/specified list
- If both `tools` and `disallowedTools` set: disallowed applied first, then tools resolved. A tool in both is removed.
- If `Agent` not in tools -> subagent cannot spawn subagents (but subagents already can't spawn subagents)
- Subagents get most parent tools MINUS: plan-mode controls, background-task tools, and by default the Agent tool itself (to prevent recursion)
- `EnterWorktree` and `ExitWorktree` are NOT available to subagents

#### Restrict Which Subagents Can Be Spawned (Coordinator Pattern)
Use `Agent(agent_type)` syntax in `tools` field for agents running as main thread with `--agent`:

```yaml
---
name: coordinator
description: Coordinates work across specialized agents
tools: Agent(worker, researcher), Read, Bash
---
```

This is an **allowlist**: only `worker` and `researcher` can be spawned. To block specific agents while allowing others, use `permissions.deny` instead.

`Agent` without parentheses = allow spawning any subagent.
`Agent` omitted entirely = agent cannot spawn any subagents.

**Important**: `Agent(agent_type)` only applies to agents running as main thread with `--agent`. Subagents cannot spawn other subagents, so this has no effect in subagent definitions.

#### Disabling Specific Subagents
Add to `deny` array in settings:
```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```
Or via CLI: `claude --disallowedTools "Agent(Explore)"`

### Permission Modes

| Mode | Behavior |
|---|---|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits and common filesystem commands for paths in working directory or additionalDirectories |
| `auto` | Background classifier reviews commands and protected-directory writes |
| `dontAsk` | Auto-deny permission prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip permission prompts (writes to `.git`, `.claude`, `.vscode`, `.idea`, `.husky` still prompt except for `.claude/commands`, `.claude/agents`, `.claude/skills`) |
| `plan` | Plan mode (read-only exploration) |

#### Permission Inheritance Rules
- Subagents **inherit** permission context from main conversation
- Can override via `permissionMode` field, **with exceptions**:
  - If parent uses `bypassPermissions` or `acceptEdits`: **takes precedence, cannot be overridden**
  - If parent uses `auto` mode: subagent inherits auto mode, frontmatter `permissionMode` is **ignored**; classifier evaluates subagent's tool calls with same block/allow rules as parent
- Background subagents: permissions **pre-approved before launch**; auto-deny anything not pre-approved

### Scoping MCP Servers to Subagents

```yaml
---
name: browser-tester
description: Tests features in a real browser using Playwright
mcpServers:
  # Inline definition: scoped to this subagent only
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  # Reference by name: reuses an already-configured server
  - github
---
```

- Inline servers are connected when subagent starts, disconnected when it finishes
- String references share the parent session's connection
- Inline definitions keep MCP server OUT of the main conversation entirely (avoids tool descriptions consuming context there)

### Preloading Skills

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---
```

- Full skill content is **injected** into subagent's context, not just made available for invocation
- Subagents **don't inherit skills** from parent conversation; must list explicitly
- This is the inverse of `context: fork` in a skill

### Persistent Memory

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
memory: user
---
```

| Scope | Location | Use when |
|---|---|---|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, not checked in |

When memory is enabled:
- System prompt includes instructions for reading/writing to memory directory
- System prompt includes first 200 lines or 25KB of `MEMORY.md` in memory directory (whichever comes first)
- Instructions to curate MEMORY.md if it exceeds that limit
- Read, Write, Edit tools automatically enabled for memory management

**Tips:**
- `project` is the recommended default scope
- Ask subagent to consult memory before starting: "Review this PR, and check your memory for patterns you've seen before"
- Ask subagent to update memory after completing: "Save what you learned to your memory"
- Include memory instructions directly in the markdown body

### Hooks for Subagents

#### In Subagent Frontmatter (fires when spawned as subagent)
Supported events:
- `PreToolUse` (matcher: tool name) - before subagent uses a tool
- `PostToolUse` (matcher: tool name) - after subagent uses a tool
- `Stop` (no matcher) - when subagent finishes (converted to `SubagentStop` at runtime)

**Important**: Frontmatter hooks fire when spawned as subagent through Agent tool or @-mention. They do NOT fire when the agent runs as main session via `--agent` or `agent` setting.

```yaml
---
name: code-reviewer
description: Review code changes with automatic linting
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh $TOOL_INPUT"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

#### In settings.json (project-level, fires in main session)

| Event | Matcher input | When it fires |
|---|---|---|
| `SubagentStart` | Agent type name | When a subagent begins execution |
| `SubagentStop` | Agent type name | When a subagent completes |

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          { "type": "command", "command": "./scripts/setup-db-connection.sh" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command", "command": "./scripts/cleanup-db-connection.sh" }
        ]
      }
    ]
  }
}
```

### Hook-Based Conditional Rules (e.g., Read-Only DB Queries)

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

The validation script:
- Reads JSON from stdin (Claude Code passes hook input as JSON)
- Extracts `tool_input.command` using jq
- Exits with code 2 to block write operations (exit code 2 = block in PreToolUse)
- Exit code 0 = allow

### Worktree Isolation

Set `isolation: worktree` in frontmatter to run the subagent in a **temporary git worktree**:
- Gives the subagent an isolated copy of the repository
- Worktree is automatically cleaned up if the subagent makes no changes
- Useful for parallel work without file conflicts

Note: `EnterWorktree` and `ExitWorktree` tools are NOT available to subagents directly.

### Design Best Practices
- **Design focused subagents**: each should excel at one specific task
- **Write detailed descriptions**: Claude uses the description to decide when to delegate
- **Limit tool access**: grant only necessary permissions for security and focus
- **Check into version control**: share project subagents with your team

---

## Module 4: Using Subagents Effectively

### Automatic Delegation
Claude automatically delegates based on:
- Task description in your request
- `description` field in subagent configurations
- Current context

To encourage proactive delegation, include phrases like **"use proactively"** in your subagent's description field.

### Explicit Invocation (3 Patterns)

#### 1. Natural Language
```
Use the test-runner subagent to fix failing tests
Have the code-reviewer subagent look at my recent changes
```
Claude decides whether to delegate.

#### 2. @-mention (Guarantees Subagent Runs)
```
@"code-reviewer (agent)" look at the auth changes
```
Type `@` and pick from typeahead. Your full message still goes to Claude, which writes the subagent's task prompt. The @-mention controls WHICH subagent, not what prompt it receives.

Plugin subagents appear as `<plugin-name>:<agent-name>`. Named background subagents show status next to name.

Manual mention format: `@agent-<name>` or `@agent-<plugin-name>:<agent-name>`.

#### 3. Session-Wide (`--agent` flag)
```bash
claude --agent code-reviewer
```
- Subagent's system prompt **replaces** the default Claude Code system prompt entirely
- CLAUDE.md files and project memory still load through normal message flow
- Agent name appears as `@<name>` in startup header
- Works with built-in and custom subagents
- Choice persists when you resume the session
- For plugin subagents: `claude --agent <plugin-name>:<agent-name>`

Make it default for every session in a project:
```json
{
  "agent": "code-reviewer"
}
```
CLI flag overrides the setting if both present.

### Foreground vs Background Subagents

| Aspect | Foreground | Background |
|---|---|---|
| **Blocking** | Blocks main conversation until complete | Runs concurrently |
| **Permissions** | Prompts passed through to user | Pre-approved before launch; auto-deny anything not pre-approved |
| **Clarifying questions** | Passed through to user | Tool call fails but subagent continues |
| **How to trigger** | Default behavior | Ask "run this in the background" or press **Ctrl+B** |

If background subagent fails due to missing permissions, start a new foreground subagent with the same task to retry with interactive prompts.

To disable all background task functionality: set `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`.

### Common Patterns

#### Isolate High-Volume Operations
```
Use a subagent to run the test suite and report only the failing tests with their error messages
```
Verbose output stays in subagent's context; only relevant summary returns.

#### Run Parallel Research
```
Research the authentication, database, and API modules in parallel using separate subagents
```
Each subagent explores independently; Claude synthesizes findings. Works best when research paths don't depend on each other.

**Warning**: Running many subagents that each return detailed results can consume significant main context. For sustained parallelism or exceeding context window, use agent teams instead.

#### Chain Subagents
```
Use the code-reviewer subagent to find performance issues, then use the optimizer subagent to fix them
```
Each completes its task and returns results to Claude, which passes relevant context to the next.

### Resuming Subagents
- Each invocation normally creates a new instance with fresh context
- To continue existing subagent's work, ask Claude to resume it
- Resumed subagents retain **full conversation history** (all tool calls, results, reasoning)
- Claude uses `SendMessage` tool with agent's ID (requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- If a stopped subagent receives a `SendMessage`, it auto-resumes in the background
- Agent IDs found in transcripts at `~/.claude/projects/{project}/{sessionId}/subagents/` as `agent-{agentId}.jsonl`

### Subagent Transcript Persistence
- **Main conversation compaction**: subagent transcripts are unaffected (stored in separate files)
- **Session persistence**: transcripts persist within session; can resume after restarting Claude Code
- **Automatic cleanup**: based on `cleanupPeriodDays` setting (default: 30 days)

### Auto-Compaction
- Subagents support automatic compaction using same logic as main conversation
- Default trigger: approximately 95% capacity
- Override: set `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` to lower percentage (e.g., `50`)
- Compaction events logged in transcript files with `preTokens` count

---

## Built-in Subagents (Complete Reference)

### Explore
- **Model**: Haiku (fast, low-latency)
- **Tools**: Read-only tools (denied: Write, Edit)
- **Purpose**: File discovery, code search, codebase exploration
- **Behavior**: Claude delegates when it needs to search/understand codebase without changes
- **Thoroughness levels**: `quick` (targeted lookups), `medium` (balanced), `very thorough` (comprehensive)
- **Note**: Skips loading CLAUDE.md for smaller context

### Plan
- **Model**: Inherits from main conversation
- **Tools**: Read-only tools (denied: Write, Edit)
- **Purpose**: Codebase research for planning (used in plan mode)
- **Behavior**: Prevents infinite nesting while gathering context

### General-purpose
- **Model**: Inherits from main conversation
- **Tools**: All tools
- **Purpose**: Complex research, multi-step operations, code modifications
- **Behavior**: Delegates when task requires both exploration and modification, complex reasoning, or multiple dependent steps

### Other Helper Agents
| Agent | Model | When Used |
|---|---|---|
| statusline-setup | Sonnet | When running `/statusline` to configure status line |
| Claude Code Guide | Haiku | When asking questions about Claude Code features |

---

## Agent Tool Reference

| Tool | Description | Permission Required |
|---|---|---|
| `Agent` | Spawns a subagent with its own context window to handle a task | No |
| `SendMessage` | Sends message to agent team teammate or resumes subagent by ID. Stopped subagents auto-resume in background. Only available when `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | No |

---

## Agent Teams (Experimental, Separate from Subagents)

Agent teams are disabled by default. Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

### Architecture
- **Team lead**: main Claude Code session that creates team, spawns teammates, coordinates
- **Teammates**: separate Claude Code instances working on assigned tasks
- **Task list**: shared, with states: pending, in progress, completed. Tasks can depend on other tasks
- **Mailbox**: messaging system for inter-agent communication

### Key Differences from Subagents
- Teammates can message each other directly (not just report back)
- Shared task list with self-coordination
- Each teammate is fully independent Claude Code session
- Higher token cost
- Cannot nest (teammates can't spawn their own teams)

### Using Subagent Definitions as Teammates
Subagent definitions from any scope can be used for teammates:
- Teammate honors definition's `tools` allowlist and `model`
- Definition body appended to teammate's system prompt (not replacing)
- Team coordination tools (SendMessage, task tools) always available even when `tools` restricts other tools
- `skills` and `mcpServers` from subagent definition are NOT applied to teammates

### Coordinator Pattern with Agent Teams
```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
```

### Plan Approval for Teammates
Can require teammates to plan before implementing:
- Teammate works in read-only plan mode until lead approves
- Lead makes approval decisions autonomously
- Influence via prompt: "only approve plans that include test coverage"

---

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `CLAUDE_CODE_SUBAGENT_MODEL` | Override model for all subagents (highest priority) |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Set to `1` to disable all background task functionality |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Set to `1` to enable agent teams |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Percentage at which auto-compaction triggers (default ~95%) |

---

## Example Subagent Definitions

### Code Reviewer (Read-only)
```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)
```

### Debugger (Can edit)
```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works
```

### Data Scientist
```markdown
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights.
tools: Bash, Read, Write
model: sonnet
---
```

### Database Query Validator (Hook-based validation)
```markdown
---
name: db-reader
description: Execute read-only database queries.
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

---

## Critical Facts for Exam Preparation

1. Only `name` and `description` are required frontmatter fields
2. Subagents **cannot spawn other subagents** (no nesting)
3. Tool omission = inherit ALL tools (including MCP)
4. `disallowedTools` is applied FIRST, then `tools` is resolved
5. Default model behavior = `inherit` from main conversation
6. Subagents receive their system prompt + basic env details, NOT full Claude Code system prompt
7. Background subagents: permissions pre-approved, auto-deny anything not approved
8. If parent uses `bypassPermissions` or `acceptEdits`, it takes precedence (cannot be overridden by subagent)
9. If parent uses `auto` mode, subagent inherits it and frontmatter `permissionMode` is ignored
10. `isolation: worktree` creates a temporary git worktree; auto-cleaned if no changes
11. Plugin subagents ignore `hooks`, `mcpServers`, `permissionMode` fields (security)
12. Scope priority: Managed (1) > CLI flag (2) > .claude/agents/ (3) > ~/.claude/agents/ (4) > Plugin (5)
13. `Stop` hooks in frontmatter are automatically converted to `SubagentStop` events
14. Memory `MEMORY.md` loads first 200 lines or 25KB (whichever comes first)
15. `--agent` flag makes the whole session use a subagent's system prompt (replaces default)
16. `Agent(agent_type)` syntax only applies to agents running as main thread with `--agent`
17. Built-in Explore agent uses Haiku model; Plan and general-purpose inherit
18. Explore and Plan agents skip loading CLAUDE.md for smaller context
19. Subagent transcripts stored at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`
20. Auto-compaction triggers at ~95% capacity by default
21. `project` is the recommended default memory scope
22. Ctrl+B backgrounds a running task
23. `effort` options: `low`, `medium`, `high`, `xhigh`, `max`
24. `initialPrompt` only applies when agent runs as main session (via `--agent` or `agent` setting)
25. `claude agents` (CLI command) lists all configured subagents without starting interactive session
