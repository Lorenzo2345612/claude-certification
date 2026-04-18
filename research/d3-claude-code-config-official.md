# Domain 3: Claude Code Configuration & Workflows -- Official Documentation Reference

> CCA Certification Exam -- 20% of exam weight
> Sources: code.claude.com/docs/en/{memory, skills, cli, commands, sub-agents, hooks, mcp, github-actions}

---

## 1. CLAUDE.md Hierarchy & Memory System

> **Source:** https://code.claude.com/docs/en/memory

### 1.1 Two Memory Systems

| Aspect | CLAUDE.md files | Auto memory |
|---|---|---|
| **Who writes it** | You (the developer) | Claude |
| **What it contains** | Instructions and rules | Learnings and patterns |
| **Scope** | Project, user, or org | Per working tree |
| **Loaded into** | Every session | Every session (first 200 lines or 25KB) |
| **Use for** | Coding standards, workflows, project architecture | Build commands, debugging insights, preferences Claude discovers |

### 1.2 CLAUDE.md File Locations (Resolution Order)

| Scope | Location | Purpose | Shared with |
|---|---|---|---|
| **Managed policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL: `/etc/claude-code/CLAUDE.md`; Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Organization-wide instructions managed by IT/DevOps | All users in org |
| **Project instructions** | `./CLAUDE.md` OR `./.claude/CLAUDE.md` | Team-shared instructions | Team via source control |
| **User instructions** | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Just you (all projects) |
| **Local instructions** | `./CLAUDE.local.md` | Personal project-specific; add to `.gitignore` | Just you (current project) |

**Key loading behavior:**
- Files walk UP the directory tree from cwd. Running in `foo/bar/` loads `foo/bar/CLAUDE.md`, `foo/CLAUDE.md`, etc.
- All discovered files are **concatenated**, not overriding each other
- Within each directory, `CLAUDE.local.md` is appended AFTER `CLAUDE.md`
- Subdirectory CLAUDE.md files load **on demand** when Claude reads files in those subdirectories
- HTML comments (`<!-- -->`) are stripped before injection into context (except inside code blocks)
- Managed policy CLAUDE.md **cannot be excluded** by individual settings

### 1.3 @import Syntax

> **Source:** https://code.claude.com/docs/en/memory — "Import additional files"

**Syntax:** `@path/to/file` (NOT `@import` -- just the `@` prefix)

```text
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

- Both **relative and absolute paths** are allowed
- Relative paths resolve relative to **the file containing the import**, NOT the working directory
- Imported files can recursively import other files, max depth of **5 hops**
- First encounter of external imports shows an **approval dialog**; declining permanently disables those imports

**Cross-worktree sharing pattern:**
```text
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

### 1.4 AGENTS.md Compatibility

Claude Code reads `CLAUDE.md`, NOT `AGENTS.md`. Import pattern:

```markdown
# CLAUDE.md
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

### 1.5 Excluding CLAUDE.md Files

Setting: `claudeMdExcludes` -- skip specific files by path or glob pattern.

```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

- Patterns matched against **absolute file paths** using glob syntax
- Configurable at any settings layer: user, project, local, or managed policy
- Arrays **merge** across layers
- **Managed policy CLAUDE.md cannot be excluded**

### 1.6 Additional Directories

Flag `--add-dir` gives access to additional directories. CLAUDE.md from these dirs are **NOT loaded by default**.

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

### 1.7 Compaction Behavior

- **Project-root CLAUDE.md survives compaction**: re-read from disk and re-injected
- **Nested subdirectory CLAUDE.md files are NOT re-injected** automatically; they reload when Claude reads files in that subdirectory again

### 1.8 Writing Effective Instructions

- Target **under 200 lines** per CLAUDE.md file
- Use markdown headers and bullets
- Be specific and verifiable
- Avoid contradicting instructions across files

### 1.9 /init Command

- Generates starting CLAUDE.md automatically
- If CLAUDE.md exists, suggests improvements (doesn't overwrite)
- `CLAUDE_CODE_NEW_INIT=1` enables interactive multi-phase flow (CLAUDE.md files, skills, hooks)

---

## 2. .claude/rules/ Directory

> **Source:** https://code.claude.com/docs/en/memory — "Organize rules"

### 2.1 Structure

```
your-project/
  .claude/
    CLAUDE.md
    rules/
      code-style.md
      testing.md
      security.md
      frontend/
        react-patterns.md
```

- All `.md` files are discovered **recursively** (can use subdirectories)
- Rules without `paths` frontmatter load at launch (same priority as `.claude/CLAUDE.md`)
- Supports **symlinks** (circular symlinks detected gracefully)

### 2.2 Path-Specific Rules (YAML Frontmatter)

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
- All API endpoints must include input validation
```

- Rules WITHOUT `paths` field: loaded **unconditionally** at launch
- Rules WITH `paths` field: loaded when Claude **reads files matching the pattern**
- Glob patterns in `paths` field:

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under `src/` |
| `*.md` | Markdown files in project root |
| `src/components/*.tsx` | React components in specific directory |
| `src/**/*.{ts,tsx}` | Brace expansion for multiple extensions |

### 2.3 User-Level Rules

Location: `~/.claude/rules/` -- applies to every project. Loaded **before** project rules (project rules have higher priority).

---

## 3. Auto Memory

### 3.1 Overview

- Claude saves notes for itself: build commands, debugging insights, architecture notes, preferences
- Requires Claude Code **v2.1.59+**
- On by default; toggle via `/memory` or setting `autoMemoryEnabled: false`
- Disable via env var: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`

### 3.2 Storage

Location: `~/.claude/projects/<project>/memory/`

```
~/.claude/projects/<project>/memory/
  MEMORY.md          # Concise index, loaded every session
  debugging.md       # Topic file (loaded on demand)
  api-conventions.md # Topic file (loaded on demand)
```

- `<project>` derived from git repo (all worktrees share one auto memory dir)
- Custom location: `autoMemoryDirectory` setting (accepted from policy, local, user settings; NOT project settings)
- First **200 lines** or **25KB** of `MEMORY.md` loaded at session start (whichever comes first)
- Topic files are **NOT loaded at startup** -- read on demand
- Machine-local, not shared across machines

### 3.3 /memory Command

- Lists all CLAUDE.md, CLAUDE.local.md, and rules files loaded in session
- Toggle auto memory on/off
- Link to open auto memory folder
- Select any file to open in editor

---

## 4. Skills System (.claude/skills/)

> **Source:** https://code.claude.com/docs/en/skills

### 4.1 Commands-to-Skills Merge

- `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`
- Existing `.claude/commands/` files keep working
- If a skill and command share the same name, **the skill takes precedence**
- Skills add: directory for supporting files, frontmatter, auto-invocation by Claude

### 4.2 Skill Directory Structure

```
my-skill/
  SKILL.md           # Main instructions (required)
  template.md        # Optional template
  examples/
    sample.md        # Optional example output
  scripts/
    validate.sh      # Optional script
```

### 4.3 Where Skills Live

| Location | Path | Applies to |
|---|---|---|
| Enterprise | Managed settings | All users in org |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<skill-name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Where plugin is enabled |

Priority: enterprise > personal > project. Plugin skills use namespace `plugin-name:skill-name`.

### 4.4 SKILL.md Frontmatter Reference (ALL Fields)

```yaml
---
name: my-skill
description: What this skill does
when_to_use: Additional trigger context
argument-hint: "[issue-number]"
disable-model-invocation: true
user-invocable: true
allowed-tools: Read Grep
model: sonnet
effort: high
context: fork
agent: Explore
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/check.sh"
          once: true
paths: "src/**/*.ts"
shell: bash
---
```

| Field | Required | Description |
|---|---|---|
| `name` | No | Display name. Lowercase letters, numbers, hyphens only (max 64 chars). Defaults to directory name |
| `description` | Recommended | What the skill does and when to use it. Combined with `when_to_use`, truncated at **1,536 characters** |
| `when_to_use` | No | Additional trigger context. Appended to `description` in listing |
| `argument-hint` | No | Hint during autocomplete. Example: `[issue-number]` |
| `disable-model-invocation` | No | `true` = only user can invoke. Default: `false` |
| `user-invocable` | No | `false` = hidden from `/` menu. Default: `true` |
| `allowed-tools` | No | Tools without permission prompt. Space-separated string or YAML list |
| `model` | No | Model to use when skill is active |
| `effort` | No | Effort level: `low`, `medium`, `high`, `xhigh`, `max`. Overrides session level |
| `context` | No | `fork` = run in forked subagent context |
| `agent` | No | Subagent type when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`, or custom name |
| `hooks` | No | Hooks scoped to skill lifecycle |
| `paths` | No | Glob patterns limiting auto-activation. Same format as rules |
| `shell` | No | `bash` (default) or `powershell`. Requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` for powershell |

### 4.5 String Substitutions in Skills

| Variable | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` | Specific argument by 0-based index |
| `$N` | Shorthand for `$ARGUMENTS[N]` (`$0`, `$1`, etc.) |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing SKILL.md |

Shell-style quoting: wrap multi-word values in quotes to pass as single argument.

If `$ARGUMENTS` not present in content, arguments appended as `ARGUMENTS: <value>`.

### 4.6 Invocation Control

| Frontmatter | You can invoke | Claude can invoke | Context behavior |
|---|---|---|---|
| (default) | Yes | Yes | Description always in context; full loads when invoked |
| `disable-model-invocation: true` | Yes | No | Description NOT in context |
| `user-invocable: false` | No | Yes | Description always in context |

### 4.7 Dynamic Context Injection

`` !`<command>` `` syntax runs shell commands **before** skill content is sent to Claude.

```yaml
## Pull request context
- PR diff: !`gh pr diff`
- Changed files: !`gh pr diff --name-only`
```

Multi-line with fenced code block: ` ```! `

Disable with `"disableSkillShellExecution": true` in settings.

### 4.8 Skill Content Lifecycle

- Rendered SKILL.md enters conversation as single message, stays for rest of session
- Claude Code does NOT re-read skill file on later turns
- **Auto-compaction**: re-attaches most recent invocation of each skill (first 5,000 tokens each)
- Combined budget: **25,000 tokens** across all re-attached skills
- Budget filled starting from most recently invoked skill

### 4.9 Skill Description Budget

- Descriptions in context so Claude knows what's available
- Budget scales at **1% of context window**, fallback **8,000 characters**
- Each entry's combined `description` + `when_to_use` capped at **1,536 characters**
- Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var

### 4.10 Running Skills in Subagent

`context: fork` with `agent` field:

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---
```

| Approach | System prompt | Task | Also loads |
|---|---|---|---|
| Skill with `context: fork` | From agent type | SKILL.md content | CLAUDE.md |
| Subagent with `skills` field | Subagent's markdown body | Claude's delegation message | Preloaded skills + CLAUDE.md |

### 4.11 Live Change Detection

- Skill directories watched for file changes
- Adding/editing/removing skills takes effect within current session
- Creating a **new top-level** skills directory requires restart

### 4.12 Bundled Skills

`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`, `/less-permission-prompts`

### 4.13 Extended Thinking in Skills

Include the word **"ultrathink"** anywhere in skill content to enable extended thinking.

---

## 5. CLI Flags (Complete Reference)

> **Source:** https://code.claude.com/docs/en/cli-reference

### 5.1 CLI Commands

| Command | Description |
|---|---|
| `claude` | Start interactive session |
| `claude "query"` | Start with initial prompt |
| `claude -p "query"` | Print mode (non-interactive SDK), then exit |
| `cat file \| claude -p "query"` | Process piped content |
| `claude -c` | Continue most recent conversation in current directory |
| `claude -c -p "query"` | Continue via SDK |
| `claude -r "<session>" "query"` | Resume by ID or name |
| `claude update` | Update to latest version |
| `claude auth login` | Sign in (flags: `--email`, `--sso`, `--console`) |
| `claude auth status` | Show auth status as JSON (`--text` for human-readable) |
| `claude agents` | List all configured subagents |
| `claude auto-mode defaults` | Print built-in auto mode classifier rules as JSON |
| `claude mcp` | Configure MCP servers |
| `claude plugin` | Manage plugins |
| `claude remote-control` | Start Remote Control server |
| `claude setup-token` | Generate long-lived OAuth token for CI |

### 5.2 All CLI Flags

| Flag | Description | Example |
|---|---|---|
| `--add-dir` | Additional working directories | `claude --add-dir ../apps ../lib` |
| `--agent` | Specify agent for session | `claude --agent my-custom-agent` |
| `--agents` | Define subagents via JSON | `claude --agents '{"reviewer":{...}}'` |
| `--allow-dangerously-skip-permissions` | Add bypassPermissions to Shift+Tab cycle | |
| `--allowedTools` | Tools that execute without permission prompt | `"Bash(git log *)" "Read"` |
| `--append-system-prompt` | Append to default system prompt | `claude --append-system-prompt "Always use TypeScript"` |
| `--append-system-prompt-file` | Append file contents to default prompt | |
| `--bare` | Minimal mode: skip hooks, skills, plugins, MCP, auto memory, CLAUDE.md | `claude --bare -p "query"` |
| `--betas` | Beta headers for API requests | |
| `--channels` | MCP channel notifications to listen for | |
| `--chrome` | Enable Chrome browser integration | |
| `--continue`, `-c` | Load most recent conversation | |
| `--dangerously-skip-permissions` | Skip permission prompts (= `--permission-mode bypassPermissions`) | |
| `--debug` | Enable debug mode with category filtering | `claude --debug "api,mcp"` |
| `--debug-file <path>` | Write debug logs to file | |
| `--disable-slash-commands` | Disable all skills and commands | |
| `--disallowedTools` | Tools removed from context entirely | |
| `--effort` | Effort level: `low`, `medium`, `high`, `xhigh`, `max` | |
| `--exclude-dynamic-system-prompt-sections` | Move per-machine sections to first user message (improves cache reuse) | |
| `--fallback-model` | Fallback model when overloaded (print mode only) | |
| `--fork-session` | Create new session ID when resuming | |
| `--from-pr` | Resume sessions linked to GitHub PR | |
| `--ide` | Auto-connect to IDE | |
| `--init` | Run initialization hooks + interactive mode | |
| `--init-only` | Run initialization hooks and exit | |
| `--include-hook-events` | Include hook lifecycle in output stream | |
| `--include-partial-messages` | Include partial streaming events | |
| `--input-format` | Input format for print mode: `text`, `stream-json` | |
| `--json-schema` | Validated JSON output matching schema (print mode only) | |
| `--maintenance` | Run maintenance hooks + interactive mode | |
| `--max-budget-usd` | Max dollar amount for API calls (print mode only) | `claude -p --max-budget-usd 5.00 "query"` |
| `--max-turns` | Limit agentic turns (print mode only). Exits with error at limit | `claude -p --max-turns 3 "query"` |
| `--mcp-config` | Load MCP servers from JSON files | |
| `--model` | Set model: alias (`sonnet`, `opus`) or full name | |
| `--name`, `-n` | Display name for session | `claude -n "my-feature-work"` |
| `--no-chrome` | Disable Chrome integration | |
| `--no-session-persistence` | Don't save sessions (print mode only) | |
| `--output-format` | Output format: `text`, `json`, `stream-json` | |
| `--permission-mode` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` | |
| `--permission-prompt-tool` | MCP tool to handle permission prompts (non-interactive) | |
| `--plugin-dir` | Load plugins from directory | |
| `--print`, `-p` | Non-interactive print mode | |
| `--remote` | Create web session on claude.ai | |
| `--remote-control`, `--rc` | Enable remote control | |
| `--replay-user-messages` | Re-emit user messages on stdout | |
| `--resume`, `-r` | Resume session by ID or name | |
| `--session-id` | Use specific UUID | |
| `--setting-sources` | Comma-separated: `user`, `project`, `local` | |
| `--settings` | Path to settings JSON or JSON string | |
| `--strict-mcp-config` | Only use MCP servers from `--mcp-config` | |
| `--system-prompt` | Replace entire system prompt | |
| `--system-prompt-file` | Replace with file contents | |
| `--teleport` | Resume web session in local terminal | |
| `--teammate-mode` | `auto`, `in-process`, `tmux` | |
| `--tmux` | Create tmux session for worktree | |
| `--tools` | Restrict built-in tools: `""`, `"default"`, `"Bash,Edit,Read"` | |
| `--verbose` | Verbose logging | |
| `--version`, `-v` | Output version | |
| `--worktree`, `-w` | Start in isolated git worktree | `claude -w feature-auth` |

### 5.3 System Prompt Flags

| Flag | Behavior |
|---|---|
| `--system-prompt` | **Replaces** entire default prompt |
| `--system-prompt-file` | **Replaces** with file contents |
| `--append-system-prompt` | **Appends** to default prompt |
| `--append-system-prompt-file` | **Appends** file contents to default prompt |

- `--system-prompt` and `--system-prompt-file` are **mutually exclusive**
- Append flags can be combined with either replacement flag

---

## 6. Slash Commands (Complete Reference)

> **Source:** https://code.claude.com/docs/en/commands

### 6.1 Key Built-in Commands

| Command | Purpose |
|---|---|
| `/add-dir <path>` | Add working directory for current session |
| `/agents` | Manage agent configurations |
| `/autofix-pr [prompt]` | Spawn web session to watch PR and push fixes |
| `/batch <instruction>` | **Skill.** Orchestrate parallel changes across codebase (5-30 independent units in git worktrees) |
| `/branch [name]` | Branch conversation (alias: `/fork`) |
| `/btw <question>` | Side question without adding to conversation |
| `/clear` | New conversation, empty context (aliases: `/reset`, `/new`) |
| `/compact [instructions]` | Compact conversation with optional focus |
| `/config` | Open settings (alias: `/settings`) |
| `/context` | Visualize current context usage as colored grid |
| `/copy [N]` | Copy last assistant response to clipboard |
| `/cost` | Show token usage statistics |
| `/debug [description]` | **Skill.** Enable debug logging and troubleshoot |
| `/diff` | Interactive diff viewer (uncommitted + per-turn diffs) |
| `/doctor` | Diagnose installation and settings |
| `/effort [level\|auto]` | Set effort: `low`, `medium`, `high`, `xhigh`, `max` |
| `/export [filename]` | Export conversation as plain text |
| `/fast [on\|off]` | Toggle fast mode |
| `/focus` | Toggle focus view (fullscreen only) |
| `/help` | Show help |
| `/hooks` | View hook configurations |
| `/init` | Initialize CLAUDE.md (`CLAUDE_CODE_NEW_INIT=1` for interactive flow) |
| `/less-permission-prompts` | **Skill.** Scan transcripts, add allowlist to settings |
| `/loop [interval] [prompt]` | **Skill.** Run prompt repeatedly (alias: `/proactive`) |
| `/mcp` | Manage MCP connections and OAuth |
| `/memory` | Edit CLAUDE.md, toggle auto-memory |
| `/model [model]` | Select/change model |
| `/permissions` | Manage allow/ask/deny rules (alias: `/allowed-tools`) |
| `/plan [description]` | Enter plan mode with optional task description |
| `/recap` | Generate one-line session summary |
| `/rename [name]` | Rename session, show on prompt bar |
| `/resume [session]` | Resume conversation (alias: `/continue`) |
| `/review [PR]` | Review a pull request locally |
| `/rewind` | Rewind conversation/code (aliases: `/checkpoint`, `/undo`) |
| `/sandbox` | Toggle sandbox mode |
| `/schedule [description]` | Create/manage routines (alias: `/routines`) |
| `/security-review` | Analyze pending changes for security vulnerabilities |
| `/simplify [focus]` | **Skill.** Review changed files for reuse, quality, efficiency |
| `/skills` | List available skills (press `t` to sort by tokens) |
| `/tasks` | List/manage background tasks (alias: `/bashes`) |
| `/teleport` | Pull web session into terminal (alias: `/tp`) |
| `/theme` | Change color theme |
| `/ultraplan <prompt>` | Draft plan in ultraplan session |
| `/ultrareview [PR]` | Multi-agent code review in cloud sandbox |
| `/voice` | Toggle push-to-talk voice dictation |

### 6.2 MCP Prompts as Commands

Format: `/mcp__<server>__<prompt>` -- dynamically discovered from connected servers.

---

## 7. Plan Mode

> **Source:** https://code.claude.com/docs/en/sub-agents — "Plan subagent"

### 7.1 Activation

- CLI: `--permission-mode plan`
- In-session: `/plan [description]`
- Shift+Tab cycling through permission modes: `default` -> `acceptEdits` -> `plan` -> `auto` -> etc.

### 7.2 Plan Subagent

- **Model**: Inherits from main conversation
- **Tools**: Read-only (Write and Edit tools **denied**)
- **Purpose**: Codebase research for planning
- Prevents infinite nesting (subagents cannot spawn other subagents)
- Gathers context, then presents a plan

### 7.3 When to Use

- Safe code analysis without risk of modifications
- Researching codebase before implementing changes
- Understanding architecture before making decisions

---

## 8. Subagents

> **Source:** https://code.claude.com/docs/en/sub-agents

### 8.1 Built-in Subagents

| Agent | Model | Tools | Purpose |
|---|---|---|---|
| **Explore** | Haiku (fast, low-latency) | Read-only (Write/Edit denied) | File discovery, code search, codebase exploration |
| **Plan** | Inherits from main | Read-only (Write/Edit denied) | Codebase research for planning |
| **general-purpose** | Inherits from main | All tools | Complex research, multi-step operations, code modifications |
| statusline-setup | Sonnet | (specific) | `/statusline` configuration |
| Claude Code Guide | Haiku | (specific) | Questions about Claude Code features |

**Explore thoroughness levels:** `quick` (targeted lookups), `medium` (balanced), `very thorough` (comprehensive)

### 8.2 Subagent File Locations (Priority Order)

| Location | Scope | Priority |
|---|---|---|
| Managed settings | Organization-wide | 1 (highest) |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin `agents/` directory | Where plugin enabled | 5 (lowest) |

### 8.3 Subagent Frontmatter Fields (ALL)

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Unique identifier, lowercase + hyphens |
| `description` | Yes | When to delegate to this subagent |
| `tools` | No | Allowlisted tools. Inherits all if omitted |
| `disallowedTools` | No | Tools to deny (removed from inherited list) |
| `model` | No | `sonnet`, `opus`, `haiku`, full ID, or `inherit` (default) |
| `permissionMode` | No | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Max agentic turns |
| `skills` | No | Skills preloaded at startup (full content injected) |
| `mcpServers` | No | MCP servers: string refs or inline definitions |
| `hooks` | No | Lifecycle hooks scoped to subagent |
| `memory` | No | Persistent memory scope: `user`, `project`, `local` |
| `background` | No | `true` = always run as background task |
| `effort` | No | Effort level override |
| `isolation` | No | `worktree` = run in temporary git worktree |
| `color` | No | Display color: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `initialPrompt` | No | Auto-submitted first user turn when running via `--agent` |

### 8.4 Model Resolution Order

1. `CLAUDE_CODE_SUBAGENT_MODEL` env var
2. Per-invocation `model` parameter
3. Subagent definition's `model` frontmatter
4. Main conversation's model

### 8.5 Tool Restriction with Agent()

```yaml
tools: Agent(worker, researcher), Read, Bash
```

This is an **allowlist**: only specified subagents can be spawned. If `Agent` omitted from `tools` entirely, agent **cannot spawn any subagents**. Only applies to main thread via `--agent`.

### 8.6 Persistent Memory

| Scope | Location | Use when |
|---|---|---|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT in VCS |

When enabled: first 200 lines or 25KB of MEMORY.md loaded; Read/Write/Edit tools auto-enabled.

### 8.7 Foreground vs Background

- **Foreground**: Blocks main conversation; permission prompts passed through
- **Background**: Concurrent; permissions pre-approved; auto-denies unapproved
- Press **Ctrl+B** to background a running task
- Disable: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

### 8.8 Key Constraints

- **Subagents cannot spawn other subagents**
- Plugin subagents do NOT support `hooks`, `mcpServers`, or `permissionMode` fields
- `--add-dir` directories are NOT scanned for subagents

### 8.9 Invoking Subagents

- **Natural language**: Name subagent in prompt
- **@-mention**: `@"code-reviewer (agent)"` -- guarantees that subagent runs
- **Session-wide**: `claude --agent code-reviewer` or `agent` in `.claude/settings.json`

---

## 9. Hooks

> **Source:** https://code.claude.com/docs/en/hooks

### 9.1 Hook Events (Complete List)

**Session Level:**
- `SessionStart` (matcher: `startup`, `resume`, `clear`, `compact`)
- `SessionEnd` (matcher: `clear`, `resume`, `logout`, `prompt_input_exit`, `other`)
- `InstructionsLoaded` (matcher: `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`)

**Per-Turn:**
- `UserPromptSubmit` -- before prompt processing (no matcher)
- `Stop` -- after Claude finishes responding (no matcher)
- `StopFailure` (matcher: `rate_limit`, `authentication_failed`, `billing_error`, `invalid_request`, `server_error`)

**Agentic Loop (Tool Execution):**
- `PreToolUse` (matcher: tool name)
- `PermissionRequest` (matcher: tool name)
- `PermissionDenied` (matcher: tool name)
- `PostToolUse` (matcher: tool name)
- `PostToolUseFailure` (matcher: tool name)

**Async Events:**
- `Notification` (matcher: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`)
- `SubagentStart` / `SubagentStop` (matcher: agent type)
- `TaskCreated` / `TaskCompleted` (no matcher)
- `ConfigChange` (matcher: config source)
- `CwdChanged` (no matcher)
- `FileChanged` (matcher: literal filenames)
- `PreCompact` / `PostCompact` (matcher: `manual`, `auto`)
- `Elicitation` / `ElicitationResult` (matcher: MCP server name)
- `WorktreeCreate` / `WorktreeRemove`
- `TeammateIdle` (no matcher)

### 9.2 Configuration Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "MatchPattern",
        "hooks": [
          {
            "type": "command|http|prompt|agent",
            "command": "path/to/script.sh",
            "if": "Bash(git *)",
            "timeout": 600,
            "statusMessage": "Running validation...",
            "async": false,
            "asyncRewake": false,
            "shell": "bash|powershell"
          }
        ]
      }
    ]
  }
}
```

**Hook Locations:**
- `~/.claude/settings.json` (user)
- `.claude/settings.json` (project, shareable)
- `.claude/settings.local.json` (project, local)
- Managed policy settings
- Plugin `hooks/hooks.json`
- Skill/agent frontmatter YAML

### 9.3 Matcher Syntax

| Syntax | Evaluation |
|---|---|
| `"*"`, `""`, or omitted | Match all |
| Letters/digits/`_`/`\|` only | Exact string or \|-separated list (`Bash`, `Edit\|Write`) |
| Contains other chars | JavaScript regex (`^Notebook`, `mcp__memory__.*`) |

### 9.4 Hook Handler Types

| Type | Description | Default timeout |
|---|---|---|
| `command` | Shell script, receives JSON on stdin | 600s |
| `http` | POST to URL with JSON body | 30s |
| `prompt` | Single-turn LLM evaluation | 30s |
| `agent` | Spawns subagent with Read/Grep/Glob tools | 60s |

### 9.5 Exit Codes

| Exit Code | Meaning | Effect |
|---|---|---|
| **0** | Success | Parse stdout JSON, proceed |
| **2** | Blocking error | Block action (ignore JSON) |
| **Other (1, etc.)** | Non-blocking error | Log error, continue |

**CRITICAL: Exit code 1 is NOT blocking. Only exit code 2 blocks.**

### 9.6 JSON Output Format

```json
{
  "continue": true,
  "stopReason": "Build failed",
  "suppressOutput": false,
  "systemMessage": "Warning",
  "decision": "block",
  "reason": "Explanation",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask|defer",
    "permissionDecisionReason": "...",
    "updatedInput": { "command": "modified" },
    "additionalContext": "Context for Claude",
    "retry": true
  }
}
```

- `continue: false` stops Claude entirely (takes precedence)
- `decision: "block"` blocks the specific action

### 9.7 PreToolUse Decision Control

Permission decisions (precedence: **deny > defer > ask > allow**):
- `allow` -- skip permission prompt
- `deny` -- block tool call
- `ask` -- prompt user
- `defer` -- exit for external handler (requires `-p` flag)

### 9.8 Environment Variables for Hooks

```bash
CLAUDE_PROJECT_DIR        # Project root
CLAUDE_PLUGIN_ROOT        # Plugin install directory
CLAUDE_PLUGIN_DATA        # Plugin persistent data dir
CLAUDE_CODE_REMOTE        # "true" in web, unset locally
CLAUDE_ENV_FILE           # Path to env persistence file (SessionStart, CwdChanged, FileChanged)
```

### 9.9 Common Input Fields (All Hooks)

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/current/working/dir",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "agent_id": "agent-123",
  "agent_type": "Explore"
}
```

### 9.10 Disabling Hooks

```json
{ "disableAllHooks": true }
```

Managed policy hooks can only be disabled by admin-level `disableAllHooks`.

### 9.11 Hook `once` Flag

In skill/agent frontmatter: `once: true` -- run only once per session.

---

## 10. MCP (Model Context Protocol) Integration

> **Source:** https://code.claude.com/docs/en/mcp

### 10.1 Transport Types

| Transport | Command | Description |
|---|---|---|
| **HTTP** (recommended) | `claude mcp add --transport http <name> <url>` | Remote MCP servers |
| **SSE** (deprecated) | `claude mcp add --transport sse <name> <url>` | Server-Sent Events |
| **stdio** | `claude mcp add <name> -- <command> [args...]` | Local processes |

### 10.2 Installation Scopes

| Scope | Loads in | Shared | Stored in |
|---|---|---|---|
| `local` (default) | Current project | No | `~/.claude.json` |
| `project` | Current project | Yes (via VCS) | `.mcp.json` in project root |
| `user` | All projects | No | `~/.claude.json` |

**Scope precedence:** local > project > user > plugin > claude.ai connectors

### 10.3 Management Commands

```bash
claude mcp add --transport http <name> <url>
claude mcp add --transport http <name> --scope project <url>
claude mcp add --transport stdio --env KEY=value <name> -- <command> [args...]
claude mcp list
claude mcp get <name>
claude mcp remove <name>
claude mcp reset-project-choices   # Reset project scope approval choices
```

**Option ordering:** All options BEFORE server name; `--` separates name from command/args.

### 10.4 Environment Variable Expansion in .mcp.json

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": { "Authorization": "Bearer ${API_KEY}" }
    }
  }
}
```

Supported: `${VAR}` and `${VAR:-default}` in `command`, `args`, `env`, `url`, `headers`.

### 10.5 Dynamic Updates and Reconnection

- Supports `list_changed` notifications for dynamic tool updates
- HTTP/SSE auto-reconnect: exponential backoff, up to 5 attempts (1s -> 2s -> 4s -> 8s -> 16s)
- Stdio servers NOT auto-reconnected
- `MCP_TIMEOUT` env var controls startup timeout
- `MAX_MCP_OUTPUT_TOKENS` for output limit (default 10,000 tokens warning)

### 10.6 Windows Note

```bash
# Windows (not WSL) requires cmd /c wrapper for npx
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

### 10.7 --mcp-config and --strict-mcp-config Flags

- `--mcp-config ./mcp.json`: Load additional MCP servers from file
- `--strict-mcp-config`: ONLY use servers from `--mcp-config`, ignore all others

---

## 11. CI/CD Integration

### 11.1 Non-Interactive Mode (`-p` flag)

```bash
claude -p "query"                                    # Basic
claude -p --output-format json "query"               # JSON output
claude -p --output-format stream-json "query"         # Streaming JSON
claude -p --max-turns 3 "query"                       # Limit turns
claude -p --max-budget-usd 5.00 "query"              # Budget limit
claude -p --json-schema '{"type":"object",...}' "q"  # Structured output
cat file | claude -p "analyze this"                   # Piped input
```

### 11.2 Output Formats

| Format | Description |
|---|---|
| `text` | Plain text (default) |
| `json` | Full JSON response after completion |
| `stream-json` | Streaming JSON events |

### 11.3 Structured Output

`--json-schema` flag: validated JSON matching schema after agent workflow completes (print mode only).

### 11.4 Key Print-Mode-Only Flags

- `--max-turns`: Limit agentic turns (no limit by default)
- `--max-budget-usd`: Dollar limit for API calls
- `--json-schema`: Schema-validated output
- `--no-session-persistence`: Don't save sessions to disk
- `--fallback-model`: Fallback when primary overloaded

---

## 12. GitHub Actions Integration

> **Source:** https://code.claude.com/docs/en/github-actions

### 12.1 Setup

Quick: `/install-github-app` in Claude Code terminal

Manual:
1. Install Claude GitHub App: https://github.com/apps/claude
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Copy workflow from `examples/claude.yml`

### 12.2 Basic Workflow

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 12.3 Action Parameters (v1)

| Parameter | Description | Required |
|---|---|---|
| `prompt` | Instructions for Claude (text or skill name) | No |
| `claude_args` | CLI arguments passed to Claude Code | No |
| `anthropic_api_key` | Claude API key | Yes (direct API) |
| `github_token` | GitHub token for API access | No |
| `trigger_phrase` | Custom trigger (default: `@claude`) | No |
| `use_bedrock` | Use AWS Bedrock | No |
| `use_vertex` | Use Google Vertex AI | No |

### 12.4 @claude Trigger

Works in issue comments, PR comments, and PR review comments:

```
@claude implement this feature based on the issue description
@claude fix the TypeError in the user dashboard component
```

### 12.5 CLI Args Passthrough

```yaml
claude_args: "--max-turns 5 --model claude-sonnet-4-6 --append-system-prompt 'Follow standards'"
```

### 12.6 Cloud Provider Support

- **AWS Bedrock**: OIDC auth, model format `us.anthropic.claude-sonnet-4-6`
- **Google Vertex AI**: Workload Identity Federation, model format `claude-sonnet-4-5@20250929`

---

## 13. Iterative Refinement Patterns

### 13.1 Input/Output Examples in Skills

Include examples of expected input and output in SKILL.md for consistent behavior:

```yaml
---
name: api-generator
description: Generate API endpoints from specifications
---

## Examples

Input: "Create a user registration endpoint"
Output: POST /api/users with validation, error handling, tests
```

### 13.2 Test-Driven Iteration

Use hooks and skills together:
1. Skill defines the task
2. PostToolUse hook runs tests after edits
3. Claude iterates until tests pass

### 13.3 Interview Pattern

Use `$ARGUMENTS` with `disable-model-invocation: true` to create structured workflows:

```yaml
---
name: implement-feature
description: Implement a feature with guided process
disable-model-invocation: true
---

1. Read and understand the requirement: $ARGUMENTS
2. Research relevant existing code
3. Propose implementation plan
4. Implement after approval
5. Write tests
6. Run tests and fix failures
```

---

## 14. Permission Modes Reference

| Mode | Behavior |
|---|---|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits and common filesystem commands |
| `plan` | Read-only exploration (no writes) |
| `auto` | Background classifier reviews commands |
| `dontAsk` | Auto-deny permission prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip all permission prompts |

**Shift+Tab cycling**: Cycles through available modes. `--allow-dangerously-skip-permissions` adds `bypassPermissions` to the cycle.

---

## 15. Key Environment Variables

| Variable | Purpose |
|---|---|
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | Set `1` to disable auto memory |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | Set `1` to load CLAUDE.md from `--add-dir` dirs |
| `CLAUDE_CODE_NEW_INIT` | Set `1` for interactive `/init` flow |
| `CLAUDE_CODE_SIMPLE` | Set by `--bare` flag |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Override subagent model |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Set `1` to disable background tasks |
| `CLAUDE_CODE_USE_POWERSHELL_TOOL` | Set `1` for PowerShell tool support |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | Override skill description budget |
| `MCP_TIMEOUT` | MCP server startup timeout (ms) |
| `MAX_MCP_OUTPUT_TOKENS` | MCP output token limit |

---

## 16. Quick-Reference: Exam-Critical Facts

1. **@import syntax** is `@path/to/file` (NOT `@import path/to/file`), max **5 hops** recursive
2. **CLAUDE.local.md** is gitignored, personal project-specific preferences
3. **Managed policy CLAUDE.md** cannot be excluded by any setting
4. **Auto memory** loads first 200 lines or 25KB of MEMORY.md
5. **Skills** description+when_to_use truncated at **1,536 chars**; budget is **1% of context** or **8,000 chars**
6. **Skill compaction**: first 5,000 tokens per skill, combined 25,000 token budget
7. **Exit code 2** blocks in hooks (NOT exit code 1)
8. **PreToolUse** decision precedence: deny > defer > ask > allow
9. **Explore** subagent uses **Haiku** model with read-only tools
10. **Plan** subagent inherits main conversation model, read-only tools
11. **Subagents cannot spawn other subagents**
12. **`--bare`** skips hooks, skills, plugins, MCP, auto memory, CLAUDE.md
13. **`--max-turns`** and **`--max-budget-usd`** are print-mode-only flags
14. **MCP scopes**: local (default, in `~/.claude.json`) > project (`.mcp.json`) > user
15. **`context: fork`** in skills runs skill in isolated subagent context
16. **`disable-model-invocation: true`** removes skill from Claude's context entirely
17. **`user-invocable: false`** only hides from menu, does NOT block Skill tool access
18. **GitHub Actions** trigger: `@claude` in comments (not `/claude`)
19. **`--json-schema`** provides validated structured output (print mode only)
20. **Rules without `paths`** load unconditionally at launch; rules WITH `paths` load on file match
