# Domains 3, 4, 5 - Deep Technical Research
## Claude Code, Prompt Engineering, Context Management

---

# DOMAIN 3: CLAUDE CODE

---

## 1. CLAUDE.md Memory System (code.claude.com/docs/en/memory)

### CLAUDE.md File Hierarchy (Precedence: more specific wins)

| Scope | Location | Purpose | Shared With |
|---|---|---|---|
| **Managed policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md` / Linux+WSL: `/etc/claude-code/CLAUDE.md` / Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Org-wide instructions managed by IT/DevOps | All users in organization |
| **Project instructions** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared instructions for the project | Team members via source control |
| **User instructions** | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Just you (all projects) |
| **Local instructions** | `./CLAUDE.local.md` | Personal project-specific preferences; add to `.gitignore` | Just you (current project) |

**Key behaviors:**
- Files in the directory hierarchy ABOVE the working directory are loaded in full at launch
- Files in subdirectories load ON DEMAND when Claude reads files in those subdirectories
- All discovered files are CONCATENATED into context (not overriding each other)
- Within each directory, `CLAUDE.local.md` is appended AFTER `CLAUDE.md`
- CLAUDE.md content is delivered as a USER MESSAGE after the system prompt, NOT as part of the system prompt
- Block-level HTML comments (`<!-- ... -->`) are stripped before injection (saves tokens); comments inside code blocks are preserved
- Managed policy CLAUDE.md files CANNOT be excluded
- Target under 200 lines per CLAUDE.md file

### @import Syntax

```
@path/to/import           # Basic import
@README                   # Import README
@package.json             # Import package.json
@docs/git-instructions.md # Import specific file
@~/.claude/my-project-instructions.md  # Absolute path from home
```

- Both relative and absolute paths allowed
- Relative paths resolve relative to the FILE containing the import, NOT the working directory
- Imported files can recursively import other files
- Maximum depth: **5 hops**
- First encounter of external imports shows an approval dialog

### AGENTS.md Compatibility

```markdown
# CLAUDE.md
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

### .claude/rules/ System

Directory structure:
```
your-project/
  .claude/
    CLAUDE.md
    rules/
      code-style.md
      testing.md
      security.md
      frontend/
      backend/
```

- All `.md` files discovered recursively
- Rules WITHOUT `paths` frontmatter load at launch (same priority as `.claude/CLAUDE.md`)
- User-level rules in `~/.claude/rules/` apply to every project; loaded BEFORE project rules
- Supports symlinks (circular symlinks detected gracefully)

### Path-Specific Rules - YAML Frontmatter Format

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
...
```

- Path-scoped rules trigger when Claude READS FILES matching the pattern, not on every tool use
- Rules WITHOUT a `paths` field are loaded unconditionally

**Glob patterns:**

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under `src/` directory |
| `*.md` | Markdown files in the project root |
| `src/components/*.tsx` | React components in a specific directory |

**Multiple patterns and brace expansion:**
```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

### claudeMdExcludes

Configured in settings (`.claude/settings.local.json` recommended):
```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

- Patterns matched against ABSOLUTE file paths using glob syntax
- Can be configured at any settings layer: user, project, local, or managed policy
- Arrays MERGE across layers
- Managed policy CLAUDE.md files CANNOT be excluded

### Auto Memory

**Storage:** `~/.claude/projects/<project>/memory/`
- `<project>` derived from git repository (all worktrees share one directory)
- Outside git repo, project root is used

**Directory structure:**
```
~/.claude/projects/<project>/memory/
  MEMORY.md          # Concise index, loaded into every session
  debugging.md       # Topic files
  api-conventions.md
  ...
```

**Loading behavior:**
- First **200 lines** of `MEMORY.md`, or first **25KB**, whichever comes first, loaded at session start
- Content beyond threshold NOT loaded at session start
- Topic files NOT loaded at startup; Claude reads them on demand
- Machine-local; not shared across machines

**Configuration:**
```json
{
  "autoMemoryEnabled": false
}
```
- Or env var: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`
- Custom directory: `autoMemoryDirectory` in user or local settings (NOT accepted from project settings)
- Requires Claude Code v2.1.59 or later

### /memory Command
- Lists all CLAUDE.md, CLAUDE.local.md, and rules files loaded in current session
- Toggle auto memory on/off
- Provides link to open auto memory folder
- Select any file to open in editor

### Loading from Additional Directories
```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```
Loads CLAUDE.md, .claude/CLAUDE.md, .claude/rules/*.md, and CLAUDE.local.md from the additional directory.

### Compaction Behavior
- Project-root CLAUDE.md SURVIVES compaction (re-read from disk and re-injected)
- Nested CLAUDE.md files in subdirectories are NOT re-injected automatically after compaction
- Nested files reload when Claude reads a file in that subdirectory again

### /init Command
- Generates starting CLAUDE.md automatically
- If CLAUDE.md exists, suggests improvements rather than overwriting
- `CLAUDE_CODE_NEW_INIT=1` enables interactive multi-phase flow

---

## 2. Skills System (code.claude.com/docs/en/skills)

### SKILL.md Location Hierarchy

| Location | Path | Applies to |
|---|---|---|
| Enterprise | Managed settings | All users in organization |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<skill-name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Where plugin is enabled |

Priority: enterprise > personal > project. Plugin skills use `plugin-name:skill-name` namespace.

### Skill Directory Structure
```
my-skill/
  SKILL.md           # Main instructions (required)
  template.md        # Template for Claude to fill in
  examples/
    sample.md        # Example output
  scripts/
    validate.sh      # Script Claude can execute
```

### Frontmatter Reference (ALL Fields)

```yaml
---
name: my-skill
description: What this skill does
when_to_use: Additional trigger context
argument-hint: [issue-number]
disable-model-invocation: true
user-invocable: false
allowed-tools: Read Grep
model: claude-opus-4-6
effort: high
context: fork
agent: Explore
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
paths:
  - "src/**/*.ts"
shell: bash
---
```

| Field | Required | Description |
|---|---|---|
| `name` | No | Display name. Lowercase letters, numbers, hyphens only (max 64 chars). Default: directory name |
| `description` | Recommended | What skill does and when to use it. Combined `description` + `when_to_use` truncated at **1,536 characters** |
| `when_to_use` | No | Additional trigger context. Appended to description, counts toward 1,536 cap |
| `argument-hint` | No | Hint during autocomplete. E.g., `[issue-number]` or `[filename] [format]` |
| `disable-model-invocation` | No | `true` prevents Claude auto-loading. Default: `false` |
| `user-invocable` | No | `false` hides from `/` menu. Default: `true` |
| `allowed-tools` | No | Space-separated string or YAML list |
| `model` | No | Model to use when skill active |
| `effort` | No | `low`, `medium`, `high`, `max` (Opus 4.6 only). Overrides session effort |
| `context` | No | `fork` to run in forked subagent context |
| `agent` | No | Subagent type when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`, or custom |
| `hooks` | No | Hooks scoped to skill lifecycle |
| `paths` | No | Glob patterns limiting activation. Comma-separated or YAML list |
| `shell` | No | `bash` (default) or `powershell`. Requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` for powershell |

### $ARGUMENTS Substitution

| Variable | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed. If not present in content, appended as `ARGUMENTS: <value>` |
| `$ARGUMENTS[N]` | Specific argument by 0-based index |
| `$N` | Shorthand for `$ARGUMENTS[N]` (`$0`, `$1`, etc.) |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing SKILL.md |

- Shell-style quoting: wrap multi-word values in quotes
- `/my-skill "hello world" second` -> `$0` = `hello world`, `$1` = `second`

### !`command` Dynamic Injection

**Inline form:**
```yaml
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
```

**Multi-line form (fenced code block with ```!):**
````markdown
```!
node --version
npm --version
git status --short
```
````

- Commands execute IMMEDIATELY (before Claude sees anything)
- Output REPLACES the placeholder
- Claude receives the fully-rendered prompt with actual data
- This is PREPROCESSING, not something Claude executes
- Disable with `"disableSkillShellExecution": true` in settings

### Skill Content Lifecycle

1. When invoked, rendered SKILL.md content enters conversation as a SINGLE MESSAGE
2. Stays for the REST of the session
3. Claude Code does NOT re-read the skill file on later turns
4. Auto-compaction carries invoked skills forward within a token budget
5. After compaction: re-attaches most recent invocation of each skill, keeping first **5,000 tokens** of each
6. Re-attached skills share a combined budget of **25,000 tokens**
7. Budget fills starting from MOST RECENTLY invoked skill
8. Older skills can be dropped entirely after compaction

### Invocation Control

| Frontmatter | You can invoke | Claude can invoke | Context loading |
|---|---|---|---|
| (default) | Yes | Yes | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes | No | Description NOT in context, full skill loads when you invoke |
| `user-invocable: false` | No | Yes | Description always in context, full skill loads when invoked |

### Skill Description Budget
- Dynamic: 1% of context window, fallback 8,000 characters
- Each entry's combined `description` + `when_to_use` capped at 1,536 characters
- Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var

### Live Change Detection
- Watches skill directories for file changes
- Adding/editing/removing skills takes effect within current session
- Creating a TOP-LEVEL skills directory that didn't exist at session start requires restart

### Enabling Extended Thinking in a Skill
Include the word "ultrathink" anywhere in skill content.

---

## 3. CLI Reference (code.claude.com/docs/en/cli-reference)

### CLI Commands

| Command | Description |
|---|---|
| `claude` | Start interactive session |
| `claude "query"` | Start with initial prompt |
| `claude -p "query"` | Query via SDK, then exit |
| `cat file \| claude -p "query"` | Process piped content |
| `claude -c` | Continue most recent conversation in current directory |
| `claude -c -p "query"` | Continue via SDK |
| `claude -r "<session>" "query"` | Resume session by ID or name |
| `claude update` | Update to latest version |
| `claude auth login` | Sign in (flags: `--email`, `--sso`, `--console`) |
| `claude auth logout` | Log out |
| `claude auth status` | Show auth status as JSON (`--text` for human-readable) |
| `claude agents` | List all configured subagents |
| `claude auto-mode defaults` | Print built-in auto mode classifier rules as JSON |
| `claude mcp` | Configure MCP servers |
| `claude plugin` | Manage plugins (alias: `claude plugins`) |
| `claude remote-control` | Start Remote Control server |
| `claude setup-token` | Generate long-lived OAuth token for CI |

### Key CLI Flags

| Flag | Description | Example |
|---|---|---|
| `-p` / `--print` | Print response without interactive mode | `claude -p "query"` |
| `-c` / `--continue` | Load most recent conversation | `claude -c` |
| `-r` / `--resume` | Resume session by ID or name | `claude -r "auth-refactor"` |
| `--model` | Set model (alias like `sonnet`/`opus` or full name) | `claude --model claude-sonnet-4-6` |
| `--output-format` | Output format: `text`, `json`, `stream-json` | `claude -p --output-format json` |
| `--input-format` | Input format: `text`, `stream-json` | `claude -p --input-format stream-json` |
| `--json-schema` | Validated JSON output matching schema (print mode) | `claude -p --json-schema '{"type":"object",...}'` |
| `--permission-mode` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` | `claude --permission-mode plan` |
| `--allowedTools` | Tools that execute without permission prompting | `"Bash(git log *)" "Read"` |
| `--disallowedTools` | Tools removed from model context entirely | `"Bash(git log *)" "Edit"` |
| `--tools` | Restrict available built-in tools (`""` = none, `"default"` = all) | `claude --tools "Bash,Edit,Read"` |
| `--max-turns` | Limit agentic turns (print mode). Exits with error at limit | `claude -p --max-turns 3` |
| `--max-budget-usd` | Max dollar amount for API calls (print mode) | `claude -p --max-budget-usd 5.00` |
| `--append-system-prompt` | Append text to default system prompt | `claude --append-system-prompt "..."` |
| `--append-system-prompt-file` | Append file contents to default prompt | `claude --append-system-prompt-file ./rules.txt` |
| `--system-prompt` | Replace ENTIRE system prompt | `claude --system-prompt "..."` |
| `--system-prompt-file` | Replace with file contents | `claude --system-prompt-file ./prompt.txt` |
| `--fork-session` | Create new session ID when resuming | `claude --resume abc123 --fork-session` |
| `--worktree` / `-w` | Start in isolated git worktree | `claude -w feature-auth` |
| `--bare` | Minimal mode: skip hooks, skills, plugins, MCP, auto memory, CLAUDE.md | `claude --bare -p "query"` |
| `--add-dir` | Add additional working directories | `claude --add-dir ../apps ../lib` |
| `--effort` | Set effort level: `low`, `medium`, `high`, `max` (Opus 4.6 only) | `claude --effort high` |
| `--agent` | Specify agent for session | `claude --agent my-custom-agent` |
| `--agents` | Define subagents via JSON | `claude --agents '{"name":{...}}'` |
| `--name` / `-n` | Set session display name | `claude -n "my-feature-work"` |
| `--session-id` | Use specific session UUID | `claude --session-id "550e8400-..."` |
| `--setting-sources` | Comma-separated: `user`, `project`, `local` | `claude --setting-sources user,project` |
| `--settings` | Path to settings JSON file | `claude --settings ./settings.json` |
| `--mcp-config` | Load MCP servers from JSON | `claude --mcp-config ./mcp.json` |
| `--strict-mcp-config` | Only use MCP from `--mcp-config` | `claude --strict-mcp-config` |
| `--betas` | Beta headers for API requests | `claude --betas interleaved-thinking` |
| `--chrome` | Enable Chrome browser integration | `claude --chrome` |
| `--debug` | Enable debug mode with category filtering | `claude --debug "api,hooks"` |
| `--verbose` | Enable verbose logging | `claude --verbose` |
| `--version` / `-v` | Output version number | `claude -v` |
| `--fallback-model` | Auto fallback when overloaded (print mode) | `claude -p --fallback-model sonnet` |
| `--enable-auto-mode` | Unlock auto mode in Shift+Tab cycle | `claude --enable-auto-mode` |
| `--dangerously-skip-permissions` | Skip permission prompts | `claude --dangerously-skip-permissions` |
| `--exclude-dynamic-system-prompt-sections` | Move per-machine sections to user message (cache optimization) | `claude -p --exclude-dynamic-system-prompt-sections` |
| `--no-session-persistence` | Disable session persistence (print mode) | `claude -p --no-session-persistence` |
| `--from-pr` | Resume sessions linked to GitHub PR | `claude --from-pr 123` |
| `--remote` | Create web session on claude.ai | `claude --remote "Fix the login bug"` |
| `--teleport` | Resume web session locally | `claude --teleport` |
| `--tmux` | Create tmux session for worktree | `claude -w feature-auth --tmux` |
| `--teammate-mode` | Agent team display: `auto`, `in-process`, `tmux` | `claude --teammate-mode in-process` |
| `--init` | Run initialization hooks and start interactive | `claude --init` |
| `--init-only` | Run initialization hooks and exit | `claude --init-only` |
| `--include-hook-events` | Include hook events in output (needs `stream-json`) | `claude -p --output-format stream-json --include-hook-events` |

### System Prompt Flags (all work in both interactive and non-interactive)

| Flag | Behavior |
|---|---|
| `--system-prompt` | Replaces entire default prompt |
| `--system-prompt-file` | Replaces with file contents |
| `--append-system-prompt` | Appends to default prompt |
| `--append-system-prompt-file` | Appends file contents to default |

- `--system-prompt` and `--system-prompt-file` are MUTUALLY EXCLUSIVE
- Append flags CAN be combined with either replacement flag

---

## 4. Hooks Configuration (code.claude.com/docs/en/hooks)

### ALL Hook Event Types (25 total)

1. **SessionStart** - When session begins/resumes
2. **SessionEnd** - When session ends
3. **UserPromptSubmit** - Before Claude processes a prompt
4. **PreToolUse** - Before tool call executes (CAN BLOCK)
5. **PermissionRequest** - When permission dialog appears
6. **PermissionDenied** - When auto mode classifier denies
7. **PostToolUse** - After tool call succeeds
8. **PostToolUseFailure** - After tool call fails
9. **Notification** - When Claude Code sends notifications
10. **SubagentStart** - When subagent spawned
11. **SubagentStop** - When subagent finishes
12. **TaskCreated** - When task created via TaskCreate tool
13. **TaskCompleted** - When task marked as completed
14. **Stop** - When Claude finishes responding
15. **StopFailure** - When turn ends due to API error
16. **TeammateIdle** - When agent team teammate about to go idle
17. **InstructionsLoaded** - When CLAUDE.md or .claude/rules/*.md loaded
18. **ConfigChange** - When config file changes during session
19. **CwdChanged** - When working directory changes
20. **FileChanged** - When watched file changes on disk
21. **WorktreeCreate** - When worktree being created
22. **WorktreeRemove** - When worktree being removed
23. **PreCompact** - Before context compaction
24. **PostCompact** - After context compaction
25. **Elicitation** - When MCP server requests user input
26. **ElicitationResult** - After user responds to MCP elicitation

### Exact JSON Configuration Structure

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-rm.sh",
            "timeout": 600,
            "statusMessage": "Checking command...",
            "async": false,
            "asyncRewake": false,
            "shell": "bash",
            "once": false
          }
        ]
      }
    ]
  },
  "disableAllHooks": false
}
```

### Hook Handler Types

**1. Command hooks:**
```json
{
  "type": "command",
  "command": "script.sh",
  "async": false,
  "asyncRewake": false,
  "shell": "bash",
  "timeout": 600,
  "if": "Bash(git *)",
  "statusMessage": "Running...",
  "once": false
}
```

**2. HTTP hooks:**
```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/pre-tool-use",
  "headers": { "Authorization": "Bearer $MY_TOKEN" },
  "allowedEnvVars": ["MY_TOKEN"],
  "timeout": 30
}
```

**3. Prompt hooks:**
```json
{
  "type": "prompt",
  "prompt": "Should this action be allowed? Context: $ARGUMENTS",
  "model": "claude-opus",
  "timeout": 30
}
```

**4. Agent hooks:**
```json
{
  "type": "agent",
  "prompt": "Verify this configuration: $ARGUMENTS",
  "timeout": 60
}
```

### Matcher Patterns

| Pattern Type | Evaluation | Examples |
|---|---|---|
| `"*"`, `""`, or omitted | Match all | Fires on every occurrence |
| Only letters, digits, `_`, `\|` | Exact string or `\|`-separated list | `Bash`, `Edit\|Write` |
| Any other character | JavaScript regex | `^Notebook`, `mcp__memory__.*` |

### MCP Tool Naming Pattern
```
mcp__<server>__<tool>
mcp__memory__create_entities
mcp__filesystem__read_file
```

### Exit Code Meanings

| Exit Code | Meaning | JSON Processing |
|---|---|---|
| **0** | Success | Parses stdout JSON if present |
| **2** | Blocking error | Ignores any JSON |
| **Any other** | Non-blocking error | Ignores JSON; shows stderr first line in transcript |

### Exit Code 2 Effects by Event

| Event | Blocks? | Effect |
|---|---|---|
| PreToolUse | **Yes** | Blocks tool call |
| PermissionRequest | **Yes** | Denies permission |
| UserPromptSubmit | **Yes** | Blocks prompt, erases it |
| Stop | **Yes** | Prevents stopping, continues conversation |
| SubagentStop | **Yes** | Prevents subagent from stopping |
| TeammateIdle | **Yes** | Prevents idle |
| TaskCreated | **Yes** | Rolls back task creation |
| TaskCompleted | **Yes** | Prevents completion |
| ConfigChange | **Yes** | Blocks config change |
| PreCompact | **Yes** | Blocks compaction |
| Elicitation | **Yes** | Denies elicitation |
| ElicitationResult | **Yes** | Blocks response (becomes decline) |
| WorktreeCreate | **Yes** | Any non-zero fails creation |
| PostToolUse | No | Shows stderr to Claude |
| PostToolUseFailure | No | Shows stderr to Claude |
| StopFailure | No | Output and exit code ignored |
| Notification | No | Shows stderr to user only |
| SubagentStart | No | Shows stderr to user only |
| SessionStart | No | Shows stderr to user only |
| InstructionsLoaded | No | Exit code ignored |

### PreToolUse Decision Control (hookSpecificOutput)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask|defer",
    "permissionDecisionReason": "Explanation",
    "updatedInput": { "field": "modified value" },
    "additionalContext": "Context for Claude"
  }
}
```
Precedence when multiple hooks return: `deny` > `defer` > `ask` > `allow`

### Async Hooks

- `"async": true` - Runs in background, execution continues immediately
- `"asyncRewake": true` - Runs in background, WAKES Claude on exit code 2. Implies async: true. Hook stderr shown to Claude as system reminder.

### Environment Variables in Hooks

| Variable | Description |
|---|---|
| `$CLAUDE_PROJECT_DIR` | Project root |
| `${CLAUDE_PLUGIN_ROOT}` | Plugin installation directory |
| `${CLAUDE_PLUGIN_DATA}` | Plugin persistent data directory |
| `$CLAUDE_CODE_REMOTE` | "true" in remote web, unset in CLI |
| `$CLAUDE_ENV_FILE` | File path (SessionStart/CwdChanged/FileChanged only) |

### Hook Locations & Scope

| Location | Scope |
|---|---|
| `~/.claude/settings.json` | All projects (local only) |
| `.claude/settings.json` | Single project (shareable) |
| `.claude/settings.local.json` | Single project (local, gitignored) |
| Managed policy settings | Organization-wide |
| Plugin hooks/hooks.json | When plugin enabled |
| Skill/agent frontmatter (YAML) | While component active |

### Common Input Fields (All hooks receive)

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "agent_id": "agent-123",
  "agent_type": "Explore"
}
```

### Output Size Limits
- `additionalContext`, `systemMessage`, `updatedMCPToolOutput`: **10,000 character cap**
- Exceeds limit: saved to file, replaced with preview + path

---

## 5. Context Window (code.claude.com/docs/en/context-window)

### What Loads at Startup (in order)

| Order | Item | Tokens (example) | Visible? |
|---|---|---|---|
| 1 | System prompt | ~4,200 | Hidden |
| 2 | Auto memory (MEMORY.md) | ~680 | Hidden |
| 3 | Environment info | ~280 | Hidden |
| 4 | MCP tools (deferred) | ~120 | Hidden |
| 5 | Skill descriptions | ~450 | Hidden |
| 6 | ~/.claude/CLAUDE.md | ~320 | Hidden |
| 7 | Project CLAUDE.md | ~1,800 | Hidden |

**Total startup overhead:** approximately 7,850 tokens before first prompt

### MCP Tool Loading Behavior
- By default, full schemas stay deferred; Claude loads on demand via tool search
- `ENABLE_TOOL_SEARCH=auto` - loads schemas upfront when fit within 10% of context window
- `ENABLE_TOOL_SEARCH=false` - loads everything

### Context Window Size
- `const MAX = 200000` (200K tokens)

### What Survives Compaction

**Survives:**
- System prompt
- Auto memory (MEMORY.md)
- Environment info
- MCP tools (deferred)
- ~/.claude/CLAUDE.md
- Project CLAUDE.md
- Conversation summary (replaces conversation at ~12% of original tokens)

**Does NOT survive:**
- Skill descriptions listing (only invoked skills preserved)
- Nested CLAUDE.md from subdirectories (reload when files in that subdirectory are accessed)
- Full tool outputs and intermediate reasoning

### Compaction Details
- Summary replaces verbatim conversation: ~12% of original token count
- Summary keeps: requests/intent, key technical concepts, files examined/modified with code snippets, errors and fixes, pending tasks, current work
- Skills with `disable-model-invocation: true` cost ZERO context until manually invoked
- Path-scoped rules load automatically when Claude reads matching files

### Subagent Context
- Subagent gets its OWN separate context window
- Loads CLAUDE.md (own copy, counts against subagent's context)
- Main session's auto memory NOT included in subagent
- Only subagent's final text response comes back to main context + small metadata trailer
- Built-in Explore and Plan agents skip CLAUDE.md loading for smaller context

### Token Cost Examples from Visualization

| Item | Typical Tokens |
|---|---|
| File read (large) | 1,800-2,400 |
| File read (medium) | 1,100 |
| Grep results | 600 |
| Claude analysis | 800 |
| Edit operation | 400-600 |
| npm test output | 1,200 |
| Path-scoped rule | 290-380 |
| Hook output | 100-120 |
| User prompt | ~45 |
| Subagent summary return | ~420 |
| Skill invocation | ~620 |

---

# DOMAIN 4: PROMPT ENGINEERING

---

## 6. Prompt Engineering Best Practices (platform.claude.com)

### General Principles

1. **Be clear and direct** - Think of Claude as brilliant but new employee
2. **Golden rule:** Show prompt to colleague with minimal context; if confused, Claude will be too
3. **Add context/motivation** - Explain WHY, not just what
4. **Specific > vague** - "Use 2-space indentation" not "Format code properly"

### XML Tags Best Practices
- Wrap each content type: `<instructions>`, `<context>`, `<input>`
- Consistent, descriptive tag names across prompts
- Nest tags for hierarchy: `<documents>` containing `<document index="n">` containing `<document_content>` and `<source>`
- Reduces misinterpretation

### Long Context Document Structure
```xml
<documents>
  <document index="1">
    <source>annual_report_2023.pdf</source>
    <document_content>
      {{ANNUAL_REPORT}}
    </document_content>
  </document>
  <document index="2">
    <source>competitor_analysis_q2.xlsx</source>
    <document_content>
      {{COMPETITOR_ANALYSIS}}
    </document_content>
  </document>
</documents>
```

### Few-Shot Format
- Wrap in `<example>` tags (multiple in `<examples>`)
- Include 3-5 examples for best results
- Make examples: **Relevant** (mirror actual use case), **Diverse** (cover edge cases), **Structured** (distinguish from instructions)

### Long Context Handling
1. **Put longform data at the TOP** of prompt, above query/instructions/examples
2. Queries at the end improve response quality by **up to 30%** in tests
3. **Ground responses in quotes** - ask Claude to quote relevant parts first
4. Use `<quotes>` tags for extracted quotes, `<info>` for diagnostic information

### "Lost in the Middle" Mitigation
- Put important content at top and bottom of context
- Use document structure with index numbers
- Ask Claude to quote relevant sections before answering
- Use XML structure to separate documents clearly

### Role Prompting
```python
message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system="You are a helpful coding assistant specializing in Python.",
    messages=[...]
)
```

### Thinking and Reasoning

**Adaptive thinking (Claude 4.6):**
```python
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[...]
)
```

- Claude dynamically decides when/how much to think
- Calibrated by: `effort` parameter AND query complexity
- Options: `low`, `medium`, `high`, `max`
- On easy queries, responds directly without thinking

**Manual CoT fallback (when thinking off):**
- Ask Claude to think step-by-step
- Use `<thinking>` and `<answer>` tags to separate reasoning from output
- "Before you finish, verify your answer against [test criteria]"

### Output Formatting Control
1. Tell Claude what to do INSTEAD of what not to do
2. Use XML format indicators: `<smoothly_flowing_prose_paragraphs>` tags
3. Match prompt style to desired output style
4. Claude Opus 4.6 defaults to LaTeX for math; override with explicit plain text instruction

### Agentic System Patterns

**Context awareness:** Claude 4.6/4.5 track remaining context window ("token budget")

**Multi-context window workflows:**
1. Use different prompt for FIRST context window (set up framework, write tests)
2. Have model write tests in structured format (e.g., `tests.json`)
3. Set up QOL tools - create `init.sh` scripts
4. Starting fresh vs compacting - consider fresh start; Claude discovers state from filesystem
5. Provide verification tools (Playwright MCP, computer use)
6. Encourage complete usage of context

**State management:**
- Use structured formats (JSON) for state data (tests, task status)
- Use unstructured text for progress notes
- Use git for state tracking (checkpoints, log of what's done)
- Emphasize incremental progress

### Subagent Orchestration (Claude 4.6)
- Claude 4.6 has significantly improved NATIVE subagent orchestration
- Recognizes when tasks benefit from delegation and does so PROACTIVELY
- May OVERUSE subagents - spawning them for tasks where direct approach suffices
- Control with explicit guidance about when subagents are/aren't warranted

### Balancing Autonomy and Safety
- Claude Opus 4.6 may take hard-to-reverse actions (deleting files, force-pushing)
- Add guidance about confirming before risky actions
- Examples warranting confirmation: destructive ops, hard-to-reverse ops, ops visible to others

### Reducing Hallucinations
```xml
<investigate_before_answering>
Never speculate about code you have not opened. If the user references
a specific file, you MUST read the file before answering.
</investigate_before_answering>
```

### Claude Opus 4.6 vs Previous Models
- More direct and grounded communication
- More conversational, less machine-like
- Less verbose (may skip summaries after tool calls)
- More proactive about tools (may overtrigger on old aggressive prompts)
- Tune ANTI-LAZINESS prompting DOWN (remove "CRITICAL: You MUST use this tool")
- Defaults to LaTeX for math
- Strong predilection for subagents (may overuse)
- Significantly more upfront exploration at higher `effort` settings
- Prefilled responses on last assistant turn NO LONGER SUPPORTED (deprecated in 4.6)

### Prefill Migration (Claude 4.6+)
- **Controlling output format:** Use Structured Outputs feature instead
- **Eliminating preambles:** Direct instructions: "Respond directly without preamble"
- **Avoiding bad refusals:** Clear prompting in user message sufficient now
- **Continuations:** Move to user message: "Your previous response ended with `[text]`. Continue."
- **Context hydration:** Inject as user turn, or hydrate via tools

### Parallel Tool Calling
- Claude 4.6 excels at parallel tool execution
- Near 100% success rate with explicit prompt
- Boost with `<use_parallel_tool_calls>` wrapper

---

# DOMAIN 5: CONTEXT MANAGEMENT (Batch Processing + Structured Outputs)

---

## 7. Message Batches API (platform.claude.com)

### How It Works
1. System creates new Message Batch with provided requests
2. Batch processed asynchronously, each request independently
3. Poll for status and retrieve results when processing ended

### API Endpoints

| Operation | Endpoint |
|---|---|
| Create batch | `POST https://api.anthropic.com/v1/messages/batches` |
| Retrieve batch | `GET https://api.anthropic.com/v1/messages/batches/{batch_id}` |
| List batches | `GET https://api.anthropic.com/v1/messages/batches?limit=20` |
| Cancel batch | (cancel endpoint) |
| Retrieve results | `GET {results_url}` (from batch object) |

### Request Format
```json
{
  "requests": [
    {
      "custom_id": "my-first-request",
      "params": {
        "model": "claude-opus-4-6",
        "max_tokens": 1024,
        "messages": [
          {"role": "user", "content": "Hello, world"}
        ]
      }
    }
  ]
}
```

**custom_id rules:**
- 1 to 64 characters
- Only alphanumeric, hyphens, underscores
- Regex: `^[a-zA-Z0-9_-]{1,64}$`

### Batch Response Object
```json
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### processing_status Values
- `in_progress` - Batch is being processed
- `ended` - All requests finished, results ready

### Result Types (4 total)

| Type | Description | Billed? |
|---|---|---|
| `succeeded` | Request successful, includes message result | Yes |
| `errored` | Request encountered error (invalid request or server error) | No |
| `canceled` | User canceled batch before request sent to model | No |
| `expired` | Batch reached 24h expiration before request sent | No |

### Batch Limitations
- Max **100,000** Message requests OR **256 MB** in size (whichever first)
- Most batches complete within **1 hour**
- Results accessible when all messages complete OR after **24 hours** (whichever first)
- Batches EXPIRE if processing not complete within **24 hours**
- Results available for **29 days** after creation (batch viewable after, but results not downloadable)
- Batches scoped to a Workspace
- NOT eligible for Zero Data Retention (ZDR)

### Pricing (50% Discount)

| Model | Batch Input | Batch Output |
|---|---|---|
| Claude Opus 4.6 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.5 | $2.50 / MTok | $12.50 / MTok |
| Claude Sonnet 4.6 | $1.50 / MTok | $7.50 / MTok |
| Claude Sonnet 4.5 | $1.50 / MTok | $7.50 / MTok |
| Claude Haiku 4.5 | $0.50 / MTok | $2.50 / MTok |
| Claude Haiku 3.5 | $0.40 / MTok | $2 / MTok |

### What Can Be Batched
- Vision
- Tool use
- System messages
- Multi-turn conversations
- Any beta features
- Can mix different request types within a single batch

### Supported Models
All active models support the Message Batches API.

### Error Handling
- `errored` with `invalid_request_error`: Fix request body before re-sending
- `errored` with other type: Can retry directly
- `expired`: Re-submit in new batch
- Validation of `params` is performed ASYNCHRONOUSLY (not at creation time)

---

## 8. Structured Outputs (platform.claude.com)

### Two Complementary Features

1. **JSON outputs** (`output_config.format`) - Control Claude's response format
2. **Strict tool use** (`strict: true`) - Guarantee schema validation on tool names and inputs

Can use independently or together in same request.

### JSON Outputs - Exact API Format

```json
{
  "model": "claude-opus-4-6",
  "max_tokens": 1024,
  "messages": [...],
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "demo_requested"],
        "additionalProperties": false
      }
    }
  }
}
```

**Response:** Valid JSON in `response.content[0].text`

### Migration Note
- Old parameter: `output_format` -> New: `output_config.format`
- Old beta header: `structured-outputs-2025-11-13` no longer required
- Both old paths continue working during transition period

### Supported Models
- Claude Mythos Preview
- Claude Opus 4.6
- Claude Sonnet 4.6
- Claude Sonnet 4.5
- Claude Opus 4.5
- Claude Haiku 4.5

Available on: Claude API, Amazon Bedrock. Beta on Microsoft Foundry. NOT supported on Vertex AI for Mythos Preview.

### SDK Helpers for Schema Definition

| Language | Schema Tool | Method |
|---|---|---|
| Python | Pydantic models | `client.messages.parse()` with `output_format=MyModel` |
| TypeScript | Zod schemas | `zodOutputFormat()` with `client.messages.parse()` |
| TypeScript | JSON Schema | `jsonSchemaOutputFormat()` with `as const` for type inference |
| Java | Plain classes | `outputConfig(Class<T>)` with automatic schema derivation |
| Ruby | `Anthropic::BaseModel` | `output_config: {format: Model}` |
| PHP | `StructuredOutputModel` | `outputConfig: ['format' => MyClass::class]` |
| CLI, C#, Go | Raw JSON schemas | `output_config` directly |

### Python SDK Example
```python
from pydantic import BaseModel
from anthropic import Anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()
response = client.messages.parse(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[...],
    output_format=ContactInfo,
)
print(response.parsed_output)
```

### TypeScript SDK with Zod
```typescript
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const ContactInfo = z.object({
  name: z.string(),
  email: z.string(),
  demo_requested: z.boolean()
});

const response = await client.messages.parse({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [...],
  output_config: { format: zodOutputFormat(ContactInfo) }
});
console.log(response.parsed_output);
```

### TypeScript jsonSchemaOutputFormat
```typescript
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";

const response = await client.messages.parse({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [...],
  output_config: {
    format: jsonSchemaOutputFormat({
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
      additionalProperties: false
    } as const)
  }
});
```
- Type inference requires `as const`
- Without `as const`, inferred type collapses to `unknown`
- Pass `{ transform: false }` to send schema unchanged

### Strict Tool Use

Add `strict: true` to tool definitions for guaranteed schema validation on tool names and inputs:
- Guarantees tool inputs match the schema exactly
- Combined with JSON outputs: full end-to-end schema validation

### Structured Outputs Guarantee
- **Always valid**: No `JSON.parse()` errors
- **Type safe**: Guaranteed field types and required fields
- **Reliable**: No retries needed for schema violations
- Uses constrained decoding

### When to Use Which

| Use Case | Mechanism |
|---|---|
| Control response format | JSON outputs (`output_config.format`) |
| Extract data from text/images | JSON outputs |
| Generate structured reports | JSON outputs |
| Validate tool inputs | Strict tool use (`strict: true`) |
| Both response + tool validation | Use both together |

### Data Retention
- Qualifies for Zero Data Retention (ZDR) with limited technical retention
- Batch processing does NOT qualify for ZDR

---

## CROSS-DOMAIN EXAM-RELEVANT DETAILS

### Claude Code --bare Mode
Sets `CLAUDE_CODE_SIMPLE` env var. Skips: hooks, skills, plugins, MCP servers, auto memory, CLAUDE.md. Only has: Bash, file read, file edit tools.

### Effort Levels
`low`, `medium`, `high`, `max` (max is Opus 4.6 only)

### Permission Modes
`default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`

### Output Formats (print mode)
`text`, `json`, `stream-json`

### Adaptive vs Extended Thinking
- Adaptive: `thinking: {"type": "adaptive"}` with `output_config: {"effort": "high"}`
- Extended (deprecated): `thinking: {"type": "enabled", "budget_tokens": 32000}`
- Disabled: `thinking: {"type": "disabled"}`

### Key Environment Variables
- `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`
- `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`
- `CLAUDE_CODE_NEW_INIT=1`
- `CLAUDE_CODE_SIMPLE` (set by `--bare`)
- `ENABLE_TOOL_SEARCH=auto|false`
- `SLASH_COMMAND_TOOL_CHAR_BUDGET`
- `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`
- `CLAUDE_REMOTE_CONTROL_SESSION_NAME_PREFIX`

### Key Token Numbers
- System prompt: ~4,200 tokens
- Auto memory loaded: first 200 lines or 25KB
- Skill compaction budget: 5,000 tokens per skill, 25,000 total
- Skill description cap: 1,536 characters each
- Hook output cap: 10,000 characters
- Compaction summary: ~12% of original conversation tokens
- Context window: 200,000 tokens
