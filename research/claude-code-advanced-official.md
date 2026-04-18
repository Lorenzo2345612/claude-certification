# Claude Code Advanced Features -- Official Documentation Research

> Extracted from 15 official documentation pages at code.claude.com (April 2026).
> Covers agent teams, headless/SDK mode, tools reference, permission modes, permissions system, context window, plugins, routines, best practices, GitHub Actions, architecture, common workflows, features overview, settings, and the .claude directory.

---

## 1. Agent Teams (Experimental)

> **Source:** https://code.claude.com/docs/en/agent-teams.md

### Enabling and Requirements
- Disabled by default; enable via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in env or settings.json
- Requires Claude Code v2.1.32 or later
- One team per session; no nested teams (teammates cannot spawn their own teams)

### Architecture
- **Team lead**: main Claude Code session that creates/coordinates the team
- **Teammates**: separate Claude Code instances with independent context windows
- **Task list**: shared list with states: pending, in progress, completed; supports task dependencies
- **Mailbox**: messaging system for inter-agent communication
- Storage: `~/.claude/teams/{team-name}/config.json` and `~/.claude/tasks/{team-name}/`
- Team config has a `members` array with name, agent ID, and agent type

### Communication
- Teammates message each other directly (unlike subagents which only report back)
- **message**: send to one specific teammate by name
- **broadcast**: send to all teammates simultaneously (costs scale with team size)
- Automatic message delivery, idle notifications, shared task list visibility
- Task claiming uses file locking to prevent race conditions

### Display Modes
- **In-process** (default): all teammates in main terminal; Shift+Down to cycle; works in any terminal
- **Split panes**: each teammate gets its own pane; requires tmux or iTerm2 with `it2` CLI
- Configure via `teammateMode` in `~/.claude.json`: `"auto"`, `"in-process"`, or `"tmux"`
- CLI flag: `claude --teammate-mode in-process`
- Not supported in VS Code integrated terminal, Windows Terminal, or Ghostty

### Plan Approval for Teammates
- Teammates can be required to plan before implementing
- Lead reviews and approves/rejects plans autonomously
- Rejected teammates revise and resubmit

### Subagent Definitions as Teammates
- Reference subagent types by name when spawning teammates
- Teammate honors the definition's `tools` allowlist and `model`
- Definition body is appended to teammate system prompt (not replaced)
- Team coordination tools (SendMessage, task management) always available
- `skills` and `mcpServers` frontmatter fields are NOT applied to teammates

### Permissions and Context
- Teammates start with lead's permission settings
- Each teammate has its own context window; loads same project context as regular session
- Lead's conversation history does NOT carry over to teammates

### Token Usage
- Significantly more tokens than single session; scales linearly with active teammates
- Recommended: 3-5 teammates; 5-6 tasks per teammate

### Hooks for Teams
- `TeammateIdle`: runs when teammate about to go idle; exit code 2 sends feedback
- `TaskCreated`: runs when task being created; exit code 2 prevents creation
- `TaskCompleted`: runs when task being marked complete; exit code 2 prevents completion

### Limitations
- No session resumption with in-process teammates
- Task status can lag
- Shutdown can be slow
- One team per session; no nested teams
- Lead is fixed for team lifetime
- Permissions set at spawn only

### Comparison: Agent Teams vs Subagents
> **Source:** https://code.claude.com/docs/en/agent-teams.md -- "Compare with subagents"
| Aspect | Subagents | Agent Teams |
|--------|-----------|-------------|
| Context | Own window; results return to caller | Own window; fully independent |
| Communication | Report back to main agent only | Direct peer messaging |
| Coordination | Main agent manages all work | Shared task list, self-coordination |
| Best for | Focused tasks, result only matters | Complex work requiring discussion |
| Token cost | Lower (summarized results) | Higher (each is separate instance) |

---

## 2. Headless Mode / Agent SDK (CLI)

> **Source:** https://code.claude.com/docs/en/headless.md

### Basic Usage
- `claude -p "prompt"` runs non-interactively (previously called "headless mode")
- All CLI options work with `-p`: `--continue`, `--allowedTools`, `--output-format`

### Bare Mode (`--bare`)
> **Source:** https://code.claude.com/docs/en/headless.md -- "Start faster with bare mode"
- Skips auto-discovery of hooks, skills, plugins, MCP servers, auto memory, CLAUDE.md
- Reduces startup time; useful for CI/scripts
- Tools available: Bash, file read, file edit
- Auth must come from `ANTHROPIC_API_KEY` or `apiKeyHelper` in `--settings`
- `--bare` will become default for `-p` in future release

### Bare Mode Context Loading Flags
| To load | Use |
|---------|-----|
| System prompt additions | `--append-system-prompt`, `--append-system-prompt-file` |
| Settings | `--settings <file-or-json>` |
| MCP servers | `--mcp-config <file-or-json>` |
| Custom agents | `--agents <json>` |
| Plugin directory | `--plugin-dir <path>` |

### Output Formats
- `text` (default): plain text
- `json`: structured JSON with result, session ID, metadata; `structured_output` field with `--json-schema`
- `stream-json`: newline-delimited JSON for real-time streaming

### Streaming Events
> **Source:** https://code.claude.com/docs/en/headless.md -- "Stream responses"
- `--output-format stream-json --verbose --include-partial-messages` for token-level streaming
- `system/api_retry` event fields: type, subtype, attempt, max_retries, retry_delay_ms, error_status, error, uuid, session_id
- Error categories: `authentication_failed`, `billing_error`, `rate_limit`, `invalid_request`, `server_error`, `max_output_tokens`, `unknown`
- `system/init` event: reports model, tools, MCP servers, loaded plugins, plugin_errors
- `system/plugin_install` events when `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` is set

### Permission Modes in CLI
- `--permission-mode dontAsk`: denies anything not in allow rules or read-only command set
- `--permission-mode acceptEdits`: auto-approves file writes plus common filesystem commands

### Continuing Conversations
- `--continue`: continue most recent conversation
- `--resume <session-id>`: continue specific conversation
- Session ID captured via `--output-format json | jq -r '.session_id'`

### System Prompt Customization
- `--append-system-prompt "..."`: adds to default behavior
- `--system-prompt`: fully replaces default prompt

---

## 3. Tools Reference

> **Source:** https://code.claude.com/docs/en/tools-reference.md

### Complete Tool List

| Tool | Description | Permission |
|------|-------------|------------|
| `Agent` | Spawns subagent with own context window | No |
| `AskUserQuestion` | Multiple-choice questions for requirements | No |
| `Bash` | Shell command execution | Yes |
| `CronCreate` | Session-scoped scheduled tasks (restored on resume if unexpired) | No |
| `CronDelete` | Cancel scheduled task by ID | No |
| `CronList` | List all scheduled tasks | No |
| `Edit` | Targeted file edits | Yes |
| `EnterPlanMode` | Switch to plan mode | No |
| `EnterWorktree` | Create/enter git worktree (not available to subagents) | No |
| `ExitPlanMode` | Present plan for approval | Yes |
| `ExitWorktree` | Exit worktree, return to original dir (not available to subagents) | No |
| `Glob` | File pattern matching | No |
| `Grep` | Content pattern search | No |
| `ListMcpResourcesTool` | List MCP server resources | No |
| `LSP` | Code intelligence via language servers | No |
| `Monitor` | Background command watching (v2.1.98+) | Yes |
| `NotebookEdit` | Jupyter notebook cell modification | Yes |
| `PowerShell` | Native PowerShell execution | Yes |
| `Read` | Read file contents | No |
| `ReadMcpResourceTool` | Read MCP resource by URI | No |
| `SendMessage` | Message teammate or resume subagent (teams only) | No |
| `Skill` | Execute skill in main conversation | Yes |
| `TaskCreate` | Create task in task list | No |
| `TaskGet` | Get task details | No |
| `TaskList` | List all tasks with status | No |
| `TaskOutput` | (Deprecated) Get background task output; use Read instead | No |
| `TaskStop` | Kill running background task | No |
| `TaskUpdate` | Update task status/dependencies/details | No |
| `TeamCreate` | Create agent team (teams feature required) | No |
| `TeamDelete` | Disband agent team (teams feature required) | No |
| `TodoWrite` | Session task checklist (non-interactive/SDK only) | No |
| `ToolSearch` | Search/load deferred tools (tool search enabled) | No |
| `WebFetch` | Fetch URL content | Yes |
| `WebSearch` | Web searches | Yes |
| `Write` | Create/overwrite files | Yes |

### Bash Tool Behavior
> **Source:** https://code.claude.com/docs/en/tools-reference.md -- "Bash tool behavior"
- Each command runs in a separate process
- `cd` carries over working directory if inside project or additional directories
- Environment variables do NOT persist between commands
- Set `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` to disable cd carry-over
- Read-only commands run without prompt: `ls`, `cat`, `head`, `tail`, `grep`, `find`, `wc`, `diff`, `stat`, `du`, `cd`, read-only `git`
- Process wrappers stripped before matching: `timeout`, `time`, `nice`, `nohup`, `stdbuf`
- Bare `xargs` also stripped

### LSP Tool
> **Source:** https://code.claude.com/docs/en/tools-reference.md -- "LSP tool behavior"
- Inactive until code intelligence plugin installed
- Capabilities: jump to definition, find references, type info, symbol lists, implementations, call hierarchies
- Auto-reports type errors/warnings after each file edit

### Monitor Tool
> **Source:** https://code.claude.com/docs/en/tools-reference.md -- "Monitor tool"
- Requires v2.1.98+
- Watches background processes; each output line delivered as notification
- Same permission rules as Bash
- NOT available on Bedrock, Vertex, or Foundry
- NOT available when `DISABLE_TELEMETRY` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set
- Plugins can declare auto-starting monitors

### PowerShell Tool
> **Source:** https://code.claude.com/docs/en/tools-reference.md -- "PowerShell tool"
- Enable: `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`
- Windows: auto-detects `pwsh.exe` (PS 7+) with fallback to `powershell.exe` (5.1)
- Linux/macOS/WSL: requires PowerShell 7+ (`pwsh` on PATH)
- Additional settings: `defaultShell`, hook-level `shell`, skill frontmatter `shell`
- Preview limitations: no auto mode, no profile loading, no Windows sandboxing, Git Bash still required to start

---

## 4. Permission Modes

> **Source:** https://code.claude.com/docs/en/permission-modes.md

### Available Modes

| Mode | Auto-approves | Best for |
|------|---------------|----------|
| `default` | Reads only | Getting started, sensitive work |
| `acceptEdits` | Reads, file edits, common filesystem cmds (mkdir, touch, mv, cp, rm, rmdir, sed) | Iterating on code |
| `plan` | Reads only (no edits) | Exploring before changing |
| `auto` | Everything, with background safety checks | Long tasks, reducing prompt fatigue |
| `dontAsk` | Only pre-approved tools | Locked-down CI/scripts |
| `bypassPermissions` | Everything except protected paths | Isolated containers/VMs only |

### Switching Modes
- During session: `Shift+Tab` to cycle (default -> acceptEdits -> plan)
- At startup: `claude --permission-mode <mode>`
- As default: `permissions.defaultMode` in settings
- VS Code: mode indicator at bottom of prompt box
- JetBrains: same as CLI (Shift+Tab)
- Web/mobile: mode dropdown next to prompt box

### Auto Mode Details
> **Source:** https://code.claude.com/docs/en/permission-modes.md -- "Eliminate prompts with auto mode"
- Requires v2.1.83+
- Plans: Max, Team, Enterprise, or API (NOT Pro)
- Models: Sonnet 4.6, Opus 4.6, Opus 4.7 (Team/Enterprise/API); Opus 4.7 only on Max
- Provider: Anthropic API only (NOT Bedrock, Vertex, Foundry)
- Classifier runs on separate server-configured model
- Classifier blocks: curl | bash, sending sensitive data externally, production deploys, mass deletion, IAM modifications, force push to main, destroying pre-existing files
- Classifier allows: local file ops in working dir, declared dependency installs, reading .env and sending creds to matching API, read-only HTTP, pushing to current/new branch
- Boundaries stated in conversation act as block signals until lifted
- Falls back after 3 consecutive blocks or 20 total blocks in session
- `claude auto-mode defaults` / `config` / `critique` CLI subcommands
- In non-interactive mode, repeated blocks abort the session

### Auto Mode Classifier Evaluation Order
1. Allow/deny rules resolve immediately
2. Read-only actions and working-directory edits auto-approved (except protected paths)
3. Everything else goes to classifier
4. If blocked, Claude receives reason and tries alternative

### Auto Mode and Subagents
- Checks at 3 points: before spawn (task description), during (each action), after (full history review)
- `permissionMode` in subagent frontmatter is ignored in auto mode

### Protected Paths (All Modes)
> **Source:** https://code.claude.com/docs/en/permission-modes.md -- "Protected paths"
- Directories: `.git`, `.vscode`, `.idea`, `.husky`, `.claude` (except `.claude/commands`, `.claude/agents`, `.claude/skills`, `.claude/worktrees`)
- Files: `.gitconfig`, `.gitmodules`, `.bashrc`, `.bash_profile`, `.zshrc`, `.zprofile`, `.profile`, `.ripgreprc`, `.mcp.json`, `.claude.json`

### Plan Mode Features
- `Ctrl+G` opens plan in text editor for direct editing
- After plan ready, options: approve + auto mode, approve + accept edits, approve + manual review, keep planning, refine with Ultraplan
- Session auto-named from plan content

---

## 5. Permissions System

> **Source:** https://code.claude.com/docs/en/permissions.md

### Rule Evaluation Order
- deny -> ask -> allow (first match wins; deny always takes precedence)

### Permission Rule Syntax
- Format: `Tool` or `Tool(specifier)`
- `Bash(*)` equivalent to `Bash` (matches all)
- Wildcards: `*` matches any sequence including spaces
- Space before `*` enforces word boundary: `Bash(ls *)` matches `ls -la` but NOT `lsof`
- `:*` suffix equivalent to trailing wildcard: `Bash(ls:*)` same as `Bash(ls *)`

### Bash Compound Commands
> **Source:** https://code.claude.com/docs/en/permissions.md -- "Compound commands"
- Shell operators recognized: `&&`, `||`, `;`, `|`, `|&`, `&`, newlines
- "Yes, don't ask again" saves separate rule for each subcommand (up to 5)

### Read/Edit Rules
> **Source:** https://code.claude.com/docs/en/permissions.md -- "Read and Edit"
- Follow gitignore specification with 4 pattern types:
  - `//path`: absolute from filesystem root
  - `~/path`: from home directory
  - `/path`: relative to project root
  - `path` or `./path`: relative to current directory
- Windows: paths normalized to POSIX (`C:\Users\alice` -> `/c/Users/alice`)
- Symlink rules: allow requires both link and target match; deny applies if either matches

### WebFetch Rules
- `WebFetch(domain:example.com)` matches requests to domain

### MCP Rules
- `mcp__servername` matches all tools from server
- `mcp__servername__toolname` matches specific tool

### Agent Rules
- `Agent(AgentName)` to control subagent usage
- Can deny specific agents: `"deny": ["Agent(Explore)"]`

### Working Directories
- `--add-dir <path>` at startup, `/add-dir` during session, or `additionalDirectories` in settings
- Configuration loaded from add-dir: skills (with live reload), enabledPlugins/extraKnownMarketplaces, CLAUDE.md (only when `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`)
- NOT loaded: subagents, commands, output styles, hooks, other settings

### Managed Settings (Organization Policies)
> **Source:** https://code.claude.com/docs/en/permissions.md -- "Managed settings"
- Delivery: server-managed, MDM/OS-level (macOS plist, Windows registry), file-based
- Managed-only settings: `allowedChannelPlugins`, `allowManagedHooksOnly`, `allowManagedMcpServersOnly`, `allowManagedPermissionRulesOnly`, `blockedMarketplaces`, `channelsEnabled`, `forceRemoteSettingsRefresh`, `pluginTrustMessage`, `sandbox.filesystem.allowManagedReadPathsOnly`, `sandbox.network.allowManagedDomainsOnly`, `strictKnownMarketplaces`

### Auto Mode Classifier Configuration
> **Source:** https://code.claude.com/docs/en/permissions.md -- "Configure the auto mode classifier"
- `autoMode.environment`: prose descriptions of trusted infrastructure (repos, buckets, domains, services)
- `autoMode.allow`: exceptions to block rules
- `autoMode.soft_deny`: block rules (replaces defaults when set)
- Read from: user settings, `.claude/settings.local.json`, managed settings (NOT shared project settings)
- Setting `allow` or `soft_deny` REPLACES entire default list

---

## 6. Context Window

> **Source:** https://code.claude.com/docs/en/context-window.md

### What Loads at Session Start (in order)
1. System prompt (~4,200 tokens)
2. Auto memory (MEMORY.md) - first 200 lines or 25KB
3. Environment info (~280 tokens): working dir, platform, shell, OS, git status
4. MCP tools (deferred): names only; full schemas on demand via tool search
5. Skills: descriptions only; full content on use
6. CLAUDE.md files: full content from project/user/managed levels
7. Rules (.claude/rules/): path-scoped rules load when matching files accessed

### Tool Search Behavior
- `ENABLE_TOOL_SEARCH=auto` (default): deferred schemas, loaded on demand
- `ENABLE_TOOL_SEARCH=false`: load all schemas upfront
- Auto loads schemas upfront when they fit within 10% of context window

### Context Management
- `/clear` resets context between tasks
- `/compact <instructions>` manual compaction with focus
- `/context` shows what's using space
- `/btw` for side questions that don't enter conversation history
- `Esc+Esc` or `/rewind` to open rewind menu; "Summarize from here" for partial compaction
- CLAUDE.md "Compact Instructions" section preserved during compaction

### Compaction Behavior
- Clears older tool outputs first, then summarizes conversation
- Requests and key code snippets preserved; early detailed instructions may be lost
- If single file/output refills context immediately, stops auto-compacting after few attempts (thrashing error)

---

## 7. Plugins

> **Source:** https://code.claude.com/docs/en/plugins.md

### Plugin vs Standalone
| Approach | Skill names | Best for |
|----------|-------------|----------|
| Standalone (.claude/) | `/hello` | Personal, project-specific, quick experiments |
| Plugins | `/plugin-name:hello` | Sharing, distributing, versioned, reusable |

### Plugin Structure
- Manifest: `.claude-plugin/plugin.json` (name, description, version, author)
- Skills: `skills/<name>/SKILL.md`
- Commands: `commands/` (flat markdown; use skills/ for new plugins)
- Agents: `agents/`
- Hooks: `hooks/hooks.json`
- MCP servers: `.mcp.json`
- LSP servers: `.lsp.json`
- Monitors: `monitors/monitors.json`
- Executables: `bin/` (added to Bash PATH)
- Default settings: `settings.json` (supports `agent` and `subagentStatusLine` keys)

### Plugin Loading
- `--plugin-dir ./my-plugin` for local testing
- `/reload-plugins` picks up changes without restart
- Multiple plugins: `--plugin-dir ./one --plugin-dir ./two`
- Local `--plugin-dir` overrides same-name installed plugin (except managed force-enabled)

### Plugin Settings
- `settings.json` at plugin root; `agent` key activates plugin's custom agent as main thread
- Takes priority over `settings` in `plugin.json`

### LSP Plugins
- `.lsp.json` at plugin root
- Users must install language server binary separately

### Background Monitors
- `monitors/monitors.json` array of entries with `name`, `command`, `description`
- Auto-start when plugin active; stdout lines delivered as notifications

### Plugin Distribution
- Submit to official marketplace via claude.ai/settings/plugins/submit or platform.claude.com/plugins/submit
- Distribute via plugin marketplaces

---

## 8. Routines (Cloud Automation)

> **Source:** https://code.claude.com/docs/en/routines.md

### Overview
- Research preview; saved Claude Code configurations running on Anthropic-managed infrastructure
- Available on Pro, Max, Team, Enterprise plans with Claude Code on the web enabled
- Manage at claude.ai/code/routines or via `/schedule` CLI

### Trigger Types
- **Scheduled**: hourly, daily, weekdays, weekly; custom cron via `/schedule update` (minimum 1 hour)
- **API**: HTTP POST to per-routine endpoint with bearer token; returns session ID and URL
- **GitHub**: react to pull_request and release events with filters

### API Trigger Details
> **Source:** https://code.claude.com/docs/en/routines.md -- "Add an API trigger"
- Endpoint: `POST https://api.anthropic.com/v1/claude_code/routines/trig_.../fire`
- Headers: `Authorization: Bearer sk-ant-oat01-xxxxx`, `anthropic-beta: experimental-cc-routine-2026-04-01`, `anthropic-version: 2023-06-01`
- Request body: optional `text` field for run-specific context
- Response: `routine_fire` with `claude_code_session_id` and `claude_code_session_url`
- Token scoped to routine only; show once, store securely

### GitHub Trigger Details
> **Source:** https://code.claude.com/docs/en/routines.md -- "Add a GitHub trigger"
- Events: Pull request (opened, closed, assigned, labeled, synchronized), Release (created, published, edited, deleted)
- Filter fields: Author, Title, Body, Base branch, Head branch, Labels, Is draft, Is merged
- Operators: equals, contains, starts with, is one of, is not one of, matches regex
- `matches regex` tests entire field value (use `.*hotfix.*` not `hotfix`)
- Each matching event starts a new session (no session reuse)
- Requires Claude GitHub App installation (separate from `/web-setup` repo access)

### Repository and Branch Permissions
- Repos cloned on every run from default branch
- Claude creates `claude/`-prefixed branches by default
- "Allow unrestricted branch pushes" option per repository

### Environments
- Control network access, environment variables, setup scripts
- Setup script results are cached

### Usage Limits
- Daily cap on runs per account
- Draws from subscription usage
- Extra usage available for organizations

---

## 9. Best Practices

> **Source:** https://code.claude.com/docs/en/best-practices.md

### Context Management (Most Important)
- Context window fills fast; performance degrades as it fills
- `/clear` between unrelated tasks
- `/compact <focus>` for targeted compaction
- "Summarize from here" via Esc+Esc or /rewind for partial compaction
- `/btw` for side questions that don't grow context
- Custom compaction instructions in CLAUDE.md

### Verification is Highest Leverage
- Include tests, screenshots, expected outputs for self-checking
- Claude in Chrome extension for UI verification
- Provide specific test cases, not vague requirements

### Explore -> Plan -> Implement -> Commit
1. Enter Plan Mode; read and understand
2. Create detailed plan; `Ctrl+G` to edit in text editor
3. Switch to Normal Mode; implement with verification
4. Commit and create PR

### CLAUDE.md Best Practices
> **Source:** https://code.claude.com/docs/en/best-practices.md -- "Write an effective CLAUDE.md"
- Run `/init` to generate starter file
- Keep under 200 lines
- Include: commands Claude can't guess, non-default code style, test instructions, repo etiquette, architecture decisions, dev environment quirks, common gotchas
- Exclude: anything Claude infers from code, standard conventions, detailed API docs, frequently changing info
- Use `@path/to/import` syntax for imports
- Add emphasis ("IMPORTANT", "YOU MUST") for critical rules
- Locations: `~/.claude/CLAUDE.md` (global), `./CLAUDE.md` (project), `./CLAUDE.local.md` (personal), parent/child directories

### Subagent Usage
- Delegate research to preserve main context: "use subagents to investigate X"
- Use for verification after implementation
- Custom subagents in `.claude/agents/` with tools, model, system prompt

### Interview Pattern
> **Source:** https://code.claude.com/docs/en/best-practices.md -- "Let Claude interview you"
- Ask Claude to interview you using AskUserQuestion tool for larger features
- Covers: technical implementation, UI/UX, edge cases, tradeoffs
- Write spec to file, then start fresh session for implementation

### Course Correction
- `Esc`: stop mid-action
- `Esc+Esc` or `/rewind`: restore checkpoints
- "Undo that": revert changes
- `/clear`: reset context
- After 2 failed corrections, /clear and rewrite better prompt

### Common Failure Patterns
> **Source:** https://code.claude.com/docs/en/best-practices.md -- "Avoid common failure patterns"
1. Kitchen sink session (unrelated tasks in one session)
2. Correcting over and over (polluted context)
3. Over-specified CLAUDE.md (too long, rules get lost)
4. Trust-then-verify gap (no tests/verification)
5. Infinite exploration (unscoped investigation)

---

## 10. GitHub Actions

> **Source:** https://code.claude.com/docs/en/github-actions.md

### Setup
- Quick: `/install-github-app` in Claude Code terminal
- Manual: install Claude GitHub App, add ANTHROPIC_API_KEY secret, copy workflow file

### Action Parameters (v1)

| Parameter | Description | Required |
|-----------|-------------|----------|
| `prompt` | Instructions (text or skill name) | No* |
| `claude_args` | CLI arguments passed through | No |
| `anthropic_api_key` | API key | Yes** |
| `github_token` | GitHub token for API access | No |
| `trigger_phrase` | Custom trigger (default: "@claude") | No |
| `use_bedrock` | Use AWS Bedrock | No |
| `use_vertex` | Use Google Vertex AI | No |

### Common claude_args
- `--max-turns`: maximum conversation turns (default: 10)
- `--model`: model selection (e.g., `claude-sonnet-4-6`, `claude-opus-4-7`)
- `--mcp-config`: MCP configuration path
- `--allowedTools`: comma-separated allowed tools
- `--append-system-prompt`: custom system prompt additions

### v1 Breaking Changes from Beta
> **Source:** https://code.claude.com/docs/en/github-actions.md -- "Upgrading from Beta"
- `mode` removed (auto-detected)
- `direct_prompt` -> `prompt`
- `custom_instructions` -> `claude_args: --append-system-prompt`
- `max_turns` -> `claude_args: --max-turns`
- `model` -> `claude_args: --model`
- `claude_env` -> `settings` JSON format

### Cloud Provider Integration
> **Source:** https://code.claude.com/docs/en/github-actions.md -- "Using with AWS Bedrock & Google Vertex AI"
- **AWS Bedrock**: OIDC authentication, model ID format `us.anthropic.claude-sonnet-4-6`
- **Google Vertex AI**: Workload Identity Federation, model format `claude-sonnet-4-5@20250929`
- Both recommend custom GitHub App for best security

---

## 11. How Claude Code Works

> **Source:** https://code.claude.com/docs/en/how-claude-code-works.md

### Agentic Loop
- Three phases: gather context -> take action -> verify results
- Phases blend together; Claude chains dozens of actions, course-correcting along the way
- User can interrupt at any point

### Tool Categories
| Category | Capabilities |
|----------|-------------|
| File operations | Read, edit, create, rename, reorganize |
| Search | Find files by pattern, search content with regex |
| Execution | Shell commands, servers, tests, git |
| Web | Search web, fetch docs, look up errors |
| Code intelligence | Type errors, jump to definition, find references (requires plugin) |

### What Claude Can Access
- Project files in working directory and subdirectories
- Terminal: any command you could run
- Git state: current branch, uncommitted changes, recent history
- CLAUDE.md files
- Auto memory (MEMORY.md): first 200 lines or 25KB
- Extensions: MCP, skills, subagents, Chrome extension

### Execution Environments
| Environment | Where | Use case |
|-------------|-------|----------|
| Local | Your machine | Default; full access |
| Cloud | Anthropic-managed VMs | Offload tasks |
| Remote Control | Your machine, browser-controlled | Web UI + local execution |

### Session Management
> **Source:** https://code.claude.com/docs/en/how-claude-code-works.md -- "Work with sessions"
- Conversations saved as plaintext JSONL under `~/.claude/projects/`
- File snapshots before edits for revert capability
- Sessions are independent (no cross-session conversation history)
- Auto memory persists learnings across sessions

### Session Resumption
- `claude --continue`: most recent conversation
- `claude --resume`: conversation picker or by name/ID
- `claude --from-pr 123`: resume session linked to PR
- `--fork-session`: creates new session ID preserving history; original unchanged
- Session-scoped permissions NOT restored on resume

### Context Window Management
- Holds: conversation history, file contents, command outputs, CLAUDE.md, auto memory, skills, system instructions
- Auto-compaction: clears older tool outputs first, then summarizes
- MCP tool definitions deferred by default (tool search)
- `/context` to see usage; `/mcp` for per-server costs

---

## 12. Common Workflows

> **Source:** https://code.claude.com/docs/en/common-workflows.md

### Git Worktrees
> **Source:** https://code.claude.com/docs/en/common-workflows.md -- "Run parallel Claude Code sessions with Git worktrees"
- `claude --worktree <name>` or `claude -w <name>`: creates isolated worktree at `<repo>/.claude/worktrees/<name>`
- Branch named `worktree-<name>`, based on `origin/HEAD`
- `claude --worktree` (no name): auto-generates random name
- Subagent worktrees: `isolation: worktree` in agent frontmatter
- `.worktreeinclude` file: copies gitignored files (`.env`, etc.) into worktrees
- Cleanup: no changes = auto-remove; changes = prompt keep/remove
- Orphaned subagent worktrees cleaned at startup after `cleanupPeriodDays`
- Worktree settings: `worktree.symlinkDirectories`, `worktree.sparsePaths`

### Session Picker (`/resume`)
| Shortcut | Action |
|----------|--------|
| Up/Down | Navigate sessions |
| Right/Left | Expand/collapse groups |
| Enter | Resume selected |
| Space | Preview session |
| Ctrl+R | Rename session |
| `/` or printable char | Search mode |
| Ctrl+A | Show all projects |
| Ctrl+W | Show all worktrees |
| Ctrl+B | Filter by current branch |

### Extended Thinking
> **Source:** https://code.claude.com/docs/en/common-workflows.md -- "Use extended thinking (thinking mode)"
- Enabled by default with adaptive reasoning
- `ultrathink` keyword in prompt: adds instruction for deeper reasoning
- `Option+T` / `Alt+T`: toggle thinking on/off
- `/effort` or `/model`: adjust effort level (low, medium, high, xhigh)
- `MAX_THINKING_TOKENS` env var: limit budget (on adaptive models, only `0` applies)
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1`: reverts to fixed budget (Opus 4.6/Sonnet 4.6 only; NOT Opus 4.7)
- `showThinkingSummaries: true` in settings to show full summaries

### Scheduling Options
> **Source:** https://code.claude.com/docs/en/common-workflows.md -- "Run Claude on a schedule"
| Option | Where it runs | Best for |
|--------|---------------|----------|
| Routines | Anthropic infrastructure | Runs even when computer off |
| Desktop scheduled tasks | Your machine | Local file access |
| GitHub Actions | CI pipeline | Repo events, cron |
| `/loop` | Current CLI session | Quick polling; stops on new conversation |

### Notification Hooks
> **Source:** https://code.claude.com/docs/en/common-workflows.md -- "Get notified when Claude needs your attention"
- `Notification` hook event fires on: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`
- Platform-specific commands: macOS (`osascript`), Linux (`notify-send`), Windows (PowerShell toast)

### Non-Interactive Patterns
- Pipe data: `cat file | claude -p "prompt" > output.txt`
- Structured output: `--output-format json`
- Fan-out: loop through file list with `claude -p` per file
- Add to build scripts: `"lint:claude": "claude -p '...'"`

---

## 13. Features Overview

> **Source:** https://code.claude.com/docs/en/features-overview.md

### Extension Layer
| Feature | What it does | When to use |
|---------|-------------|-------------|
| CLAUDE.md | Persistent context every session | Project conventions, "always do X" |
| Skill | Instructions, knowledge, workflows | Reusable content, reference docs, tasks |
| Subagent | Isolated execution context | Context isolation, parallel tasks |
| Agent teams | Coordinate multiple sessions | Parallel research, debugging hypotheses |
| MCP | Connect external services | External data or actions |
| Hook | Deterministic event script | Predictable automation, no LLM |
| Plugin | Package and distribute features | Cross-repo reuse |

### Context Cost by Feature
> **Source:** https://code.claude.com/docs/en/features-overview.md -- "Understand context costs"
| Feature | When it loads | Context cost |
|---------|--------------|-------------|
| CLAUDE.md | Session start | Every request |
| Skills | Start (descriptions) + use | Low until used |
| MCP servers | Start (names) | Low until tool used |
| Subagents | When spawned | Isolated (zero to main) |
| Hooks | On trigger | Zero (external) |

### Feature Layering
> **Source:** https://code.claude.com/docs/en/features-overview.md -- "Understand how features layer"
- CLAUDE.md: additive across all levels
- Skills/subagents: override by name (priority: managed > user > project for skills)
- MCP servers: override by name (local > project > user)
- Hooks: merge (all matching hooks fire)

### Build Setup Triggers
| Trigger | Add |
|---------|-----|
| Claude gets convention wrong twice | CLAUDE.md |
| Keep typing same prompt | User-invocable skill |
| Paste same playbook 3 times | Skill |
| Keep copying from browser | MCP server |
| Side task floods conversation | Subagent |
| Want something every time without asking | Hook |
| Second repo needs same setup | Plugin |

---

## 14. Settings System

> **Source:** https://code.claude.com/docs/en/settings.md

### Configuration Scopes (Precedence, Highest to Lowest)
1. **Managed** (server-managed > MDM/OS-level > file-based; cannot be overridden)
2. **Command line arguments** (temporary session overrides)
3. **Local** (`.claude/settings.local.json`)
4. **Project** (`.claude/settings.json`)
5. **User** (`~/.claude/settings.json`)

### Managed Settings Delivery
> **Source:** https://code.claude.com/docs/en/settings.md -- "Settings files"
- Server-managed: Anthropic servers via Claude.ai admin console
- macOS: `com.anthropic.claudecode` managed preferences domain
- Windows: `HKLM\SOFTWARE\Policies\ClaudeCode` registry (REG_SZ/REG_EXPAND_SZ JSON)
- Windows user-level: `HKCU\SOFTWARE\Policies\ClaudeCode` (lowest policy priority)
- File-based: `managed-settings.json` at system paths:
  - macOS: `/Library/Application Support/ClaudeCode/`
  - Linux/WSL: `/etc/claude-code/`
  - Windows: `C:\Program Files\ClaudeCode\`
- Drop-in directory: `managed-settings.d/` alongside managed-settings.json (alphabetical merge)

### Key Settings
> **Source:** https://code.claude.com/docs/en/settings.md -- "Available settings"

| Setting | Description |
|---------|-------------|
| `agent` | Run main thread as named subagent |
| `apiKeyHelper` | Custom script for auth value generation |
| `attribution` | Customize git commit/PR attribution |
| `autoMemoryDirectory` | Custom auto memory storage path |
| `autoMode` | Auto mode classifier configuration |
| `autoUpdatesChannel` | `"stable"` (week-old, skip regressions) or `"latest"` (most recent) |
| `availableModels` | Restrict model selection |
| `awaySummaryEnabled` | One-line recap when returning to terminal |
| `cleanupPeriodDays` | Session file retention (default: 30, min: 1) |
| `companyAnnouncements` | Startup announcements (cycled randomly) |
| `defaultShell` | `"bash"` or `"powershell"` for `!` commands |
| `disableSkillShellExecution` | Disable `!` and ```! blocks in skills |
| `effortLevel` | Persist effort: `"low"`, `"medium"`, `"high"`, `"xhigh"` |
| `fileSuggestion` | Custom `@` autocomplete command |
| `forceLoginMethod` | `"claudeai"` or `"console"` |
| `forceLoginOrgUUID` | Require specific org login (single UUID or array) |
| `includeGitInstructions` | Include built-in git instructions in system prompt (default: true) |
| `language` | Response language and voice dictation language |
| `minimumVersion` | Floor for auto-updates |
| `model` | Override default model |
| `modelOverrides` | Map model IDs to provider-specific IDs (e.g., Bedrock ARNs) |
| `outputStyle` | Custom system prompt style |
| `plansDirectory` | Where plan files stored (default: `~/.claude/plans`) |
| `prefersReducedMotion` | Reduce UI animations for accessibility |
| `respectGitignore` | `@` picker respects .gitignore (default: true) |
| `showThinkingSummaries` | Show extended thinking summaries |
| `spinnerTipsEnabled` | Show tips in spinner (default: true) |
| `spinnerTipsOverride` | Custom spinner tips |
| `spinnerVerbs` | Custom action verbs in spinner |
| `statusLine` | Custom status line command |
| `tui` | `"fullscreen"` or `"default"` renderer |
| `viewMode` | Default view: `"default"`, `"verbose"`, `"focus"` |
| `voiceEnabled` | Push-to-talk voice dictation |

### Global Config (~/.claude.json)
> **Source:** https://code.claude.com/docs/en/settings.md -- "Global config settings"
| Setting | Description |
|---------|-------------|
| `autoConnectIde` | Auto-connect to running IDE |
| `autoInstallIdeExtension` | Auto-install VS Code extension (default: true) |
| `autoScrollEnabled` | Follow new output in fullscreen mode |
| `editorMode` | `"normal"` or `"vim"` |
| `externalEditorContext` | Prepend Claude's response as comments in Ctrl+G editor |
| `showTurnDuration` | Show turn duration messages |
| `terminalProgressBarEnabled` | Progress bar in ConEmu, Ghostty 1.2.0+, iTerm2 3.6.6+ |
| `teammateMode` | Agent team display: `"auto"`, `"in-process"`, `"tmux"` |

### Worktree Settings
| Setting | Description |
|---------|-------------|
| `worktree.symlinkDirectories` | Directories to symlink from main repo (e.g., `node_modules`) |
| `worktree.sparsePaths` | Sparse-checkout paths for large monorepos |

### Sandbox Settings
> **Source:** https://code.claude.com/docs/en/settings.md -- "Sandbox settings"

| Setting | Description |
|---------|-------------|
| `enabled` | Enable bash sandboxing (macOS, Linux, WSL2) |
| `failIfUnavailable` | Exit at startup if sandbox unavailable |
| `autoAllowBashIfSandboxed` | Auto-approve bash when sandboxed (default: true) |
| `excludedCommands` | Commands that run outside sandbox |
| `allowUnsandboxedCommands` | Allow dangerouslyDisableSandbox escape hatch (default: true) |
| `filesystem.allowWrite` | Additional writable paths (merged across scopes) |
| `filesystem.denyWrite` | Paths denied writes |
| `filesystem.denyRead` | Paths denied reads |
| `filesystem.allowRead` | Re-allow reads within denyRead regions |
| `network.allowedDomains` | Allowed outbound domains |
| `network.allowUnixSockets` | macOS: specific socket paths |
| `network.allowAllUnixSockets` | Allow all Unix sockets |
| `network.allowLocalBinding` | Allow localhost port binding (macOS) |
| `network.allowMachLookup` | XPC/Mach service names (macOS) |
| `network.httpProxyPort` | Custom HTTP proxy port |
| `network.socksProxyPort` | Custom SOCKS5 proxy port |
| `enableWeakerNestedSandbox` | Weaker sandbox for unprivileged Docker (Linux/WSL2) |
| `enableWeakerNetworkIsolation` | macOS TLS trust service access |

### Plugin Settings
- `enabledPlugins`: `"plugin-name@marketplace-name": true/false`
- `extraKnownMarketplaces`: additional marketplace sources per repo

### Array Settings Merge
- Array settings (permissions.allow, sandbox paths, etc.) concatenate and deduplicate across scopes
- Scalar settings use most-specific value

### Verification
- `/status` shows active settings sources and origins
- `/config` opens tabbed Settings interface

---

## 15. The .claude Directory

> **Source:** https://code.claude.com/docs/en/claude-directory.md

### Project-Level Files

| Path | Purpose | Committed? |
|------|---------|------------|
| `CLAUDE.md` | Project instructions every session | Yes |
| `.mcp.json` | Project-scoped MCP servers | Yes |
| `.worktreeinclude` | Gitignored files to copy to worktrees | Yes |
| `.claude/settings.json` | Permissions, hooks, configuration | Yes |
| `.claude/settings.local.json` | Personal settings overrides | Gitignored |
| `.claude/rules/` | Topic-scoped instructions (optional path frontmatter) | Yes |
| `.claude/skills/` | Reusable prompts and workflows | Yes |
| `.claude/commands/` | Single-file prompts (legacy; use skills/) | Yes |
| `.claude/agents/` | Custom subagent definitions | Yes |
| `.claude/output-styles/` | Custom output styles | Yes |
| `.claude/worktrees/` | Git worktree directories | Gitignored |
| `CLAUDE.local.md` | Personal project-specific notes | Gitignored |

### User-Level Files (~/.claude/)

| Path | Purpose |
|------|---------|
| `~/.claude/CLAUDE.md` | Global instructions for all sessions |
| `~/.claude/settings.json` | User-wide settings |
| `~/.claude/agents/` | User-wide subagent definitions |
| `~/.claude/skills/` | User-wide skills |
| `~/.claude/output-styles/` | User-wide output styles |
| `~/.claude/plans/` | Plan files from plan mode |
| `~/.claude/projects/` | Session data (plaintext JSONL) |
| `~/.claude/teams/` | Agent team configs |
| `~/.claude/tasks/` | Agent team task lists |
| `~/.claude.json` | Preferences, OAuth, MCP servers, per-project state, caches |

### Rules Directory (.claude/rules/)
> **Source:** https://code.claude.com/docs/en/claude-directory.md
- Rules without `paths:` frontmatter load at session start (like CLAUDE.md)
- Rules with `paths:` frontmatter load when matching files enter context
- Subdirectories auto-discovered: `.claude/rules/frontend/react.md` works
- Uses glob patterns in `paths:` array

### Skills Directory (.claude/skills/)
> **Source:** https://code.claude.com/docs/en/claude-directory.md
- Each skill: folder with `SKILL.md` plus supporting files
- Frontmatter: `description`, `disable-model-invocation`, `user-invocable`, `argument-hint`
- `$ARGUMENTS` placeholder for user input; `$0`, `$1` for positional access
- `${CLAUDE_SKILL_DIR}` placeholder for skill directory path
- `` !`command` `` syntax for inline shell execution
- Commands and skills are now the same mechanism; skills preferred for new work

### Configuration Auto-Backup
- Claude Code creates timestamped backups of config files; retains 5 most recent

---

## Cross-Cutting Technical Facts

> **Sources:** Aggregated from all 15 pages listed above.

### Version Requirements
- Agent teams: v2.1.32+
- Auto mode: v2.1.83+
- Monitor tool: v2.1.98+

### Model Compatibility
- Auto mode: Sonnet 4.6, Opus 4.6, Opus 4.7 (Team/Enterprise/API); Opus 4.7 only on Max
- Auto mode: NOT available on Bedrock, Vertex, Foundry
- Adaptive reasoning: Opus 4.6 and Sonnet 4.6 (can disable); Opus 4.7 (always adaptive)

### Environment Variables Referenced
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`: enable agent teams
- `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`: disable cd carry-over
- `CLAUDE_CODE_USE_POWERSHELL_TOOL`: enable PowerShell tool
- `CLAUDE_ENV_FILE`: persistent env vars across Bash commands
- `CLAUDE_CODE_SYNC_PLUGIN_INSTALL`: sync plugin installs in streaming
- `ENABLE_TOOL_SEARCH`: control MCP tool schema loading
- `MAX_THINKING_TOKENS`: limit thinking budget
- `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING`: revert to fixed thinking budget
- `CLAUDE_CODE_EFFORT_LEVEL`: set effort level
- `CLAUDE_CODE_ENABLE_AWAY_SUMMARY`: session recap on return
- `CLAUDE_CODE_SKIP_PROMPT_HISTORY`: disable transcript writes
- `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD`: load CLAUDE.md from add-dir
- `DISABLE_TELEMETRY` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`: disable Monitor tool
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`: disable git instructions in system prompt

### Deep Links
- `claude-cli://open?q=...` protocol handler
- Supports multi-line via URL-encoded newlines (`%0A`)
- Disable with `disableDeepLinkRegistration: "disable"`

### JSON Schema
- `"$schema": "https://json.schemastore.org/claude-code-settings.json"` for settings validation
