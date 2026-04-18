# Research: Claude Code CLI
**Source:** https://docs.anthropic.com/en/docs/claude-code/cli

## Key CLI Flags
- `-p` / `--print` — non-interactive mode, exits after response
- `--bare` — minimal: skips hooks, skills, plugins, MCP, auto memory, CLAUDE.md; sets CLAUDE_CODE_SIMPLE
- `--max-turns` — limit agentic turns (print mode only); **exits with error** when reached
- `--max-budget-usd` — max dollar spend (print mode only)
- `--system-prompt` — **replaces** entire default system prompt
- `--system-prompt-file` — replaces with file contents (mutually exclusive with --system-prompt)
- `--append-system-prompt` — **appends** to default system prompt
- `--append-system-prompt-file` — appends file contents
- `--exclude-dynamic-system-prompt-sections` — moves per-machine sections to first user message; improves prompt-cache reuse
- `--resume` / `-r` — resume session by ID or name
- `--fork-session` — with --resume or --continue, creates new session ID
- `-c` / `--continue` — load most recent conversation
- `--output-format` — `text`, `json`, `stream-json` (print mode only)
- `--json-schema` — get validated JSON matching schema (print mode only)
- `--permission-mode` — begin in specified mode
- `--model` — set model
- `--effort` — set effort level: low, medium, high, max
- `--allowedTools` — tools that execute without permission prompts
- `--disallowedTools` — tools removed from context entirely
- `--tools` — restrict built-in tools
- `--add-dir` — additional working directories
- `--mcp-config` — load MCP servers from JSON files
- `--worktree` / `-w` — start in isolated git worktree
- `-n` / `--name` — display name for session

## 6 Permission Modes
1. `default` — standard permission checking with prompts
2. `acceptEdits` — auto-accept file edits and common filesystem commands
3. `plan` — plan mode (read-only exploration)
4. `auto` — background classifier reviews commands
5. `dontAsk` — auto-deny permission prompts (explicitly allowed tools still work)
6. `bypassPermissions` — skip permission prompts entirely

## --output-format Options (3)
- `text` — plain text
- `json` — structured JSON
- `stream-json` — streaming JSON

## --system-prompt vs --append-system-prompt
- `--system-prompt`: **completely replaces** default system prompt
- `--append-system-prompt`: **appends** to end of default prompt
- `--system-prompt` and `--system-prompt-file` are **mutually exclusive** with each other
- Append flags CAN be combined with either replacement flag

## --exclude-dynamic-system-prompt-sections
- Moves dynamic per-machine sections (working dir, env info, memory paths, git status) from system prompt to first user message
- Improves prompt-cache reuse across executions
- Ignored when used with --system-prompt/--system-prompt-file

## --max-turns Behavior
- Print mode only
- When limit reached: **exits with error** (not graceful summary)
- No limit by default

## --fork-session
- Used with --resume or --continue
- Creates a new session ID from the specified session
- Original session unmodified
