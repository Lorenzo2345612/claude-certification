# Research: CLAUDE.md & Memory System
**Source:** https://docs.anthropic.com/en/docs/claude-code/memory

## CLAUDE.md Hierarchy

| Scope | Location | Shared With |
|---|---|---|
| Managed policy | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL: `/etc/claude-code/CLAUDE.md`; Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | All org users |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via VCS |
| User | `~/.claude/CLAUDE.md` | Just you (all projects) |
| Local | `./CLAUDE.local.md` | Just you (current project) |

Loading: walks up directory tree from cwd, loading CLAUDE.md and CLAUDE.local.md at each level. Within each directory, CLAUDE.local.md appended after CLAUDE.md. Subdirectory CLAUDE.md files load on demand.

## MEMORY.md Auto-Load Limits
- First **200 lines** or first **25KB**, whichever comes first
- Beyond that: not loaded at session start

## HTML Comment Handling
- Block-level HTML comments (`<!-- ... -->`) are **stripped** before injection (saves tokens)
- Comments inside **code blocks are preserved**
- When opening CLAUDE.md with Read tool, comments remain visible

## Delivery Mechanism
- CLAUDE.md content delivered as a **user message after the system prompt**
- NOT as part of the system prompt itself
- For system-prompt-level: use `--append-system-prompt`

## @import Max Hops
- Maximum depth of **5 hops**
- Both relative and absolute paths allowed
- First encounter of external imports shows approval dialog

## claudeMdExcludes
- Configured in settings (any layer)
- Patterns matched against **absolute file paths** using glob syntax
- Arrays **merge across layers**
- **Managed policy CLAUDE.md files CANNOT be excluded**

## Managed Policy Paths
- **macOS**: `/Library/Application Support/ClaudeCode/CLAUDE.md`
- **Linux/WSL**: `/etc/claude-code/CLAUDE.md`
- **Windows**: `C:\Program Files\ClaudeCode\CLAUDE.md`

## CLAUDE.local.md
- Lives at project root: `./CLAUDE.local.md`
- Should be added to `.gitignore`
- Appended after CLAUDE.md at same directory level
- Personal project-specific preferences

## Compaction Survival
- **Project-root CLAUDE.md survives**: re-read from disk and re-injected after /compact
- **Nested subdirectory CLAUDE.md NOT re-injected** until Claude reads files in that subdirectory
- Instructions given only in conversation do NOT survive

## Target Length
- Under **200 lines** per CLAUDE.md for best adherence
