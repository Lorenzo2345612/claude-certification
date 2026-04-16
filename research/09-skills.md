# Research: Claude Code Skills
**Source:** https://docs.anthropic.com/en/docs/claude-code/skills

## Frontmatter Fields (14 fields)
All optional (only `description` recommended):

| Field | Description |
|---|---|
| `name` | Display name. Max **64 chars**, lowercase letters/numbers/hyphens |
| `description` | What skill does. Combined with when_to_use, truncated at **1,536 chars** |
| `when_to_use` | Additional trigger context. Appended to description, counts toward 1,536 cap |
| `argument-hint` | Hint shown during autocomplete (e.g., `[issue-number]`) |
| `disable-model-invocation` | `true` = description NOT in context; only user can invoke with /name |
| `user-invocable` | `false` hides from / menu but Claude can still invoke |
| `allowed-tools` | Tools without permission prompts. Space-separated or YAML list |
| `model` | Model to use when skill active |
| `effort` | Effort level: low, medium, high, max |
| `context` | Set to `fork` to run in forked subagent |
| `agent` | Subagent type when context:fork (Explore, Plan, general-purpose, custom) |
| `hooks` | Hooks scoped to skill lifecycle |
| `paths` | Glob patterns limiting when skill activates |
| `shell` | Shell for !`command` blocks: bash (default) or powershell |

## Character Limits
- `name`: max 64 chars
- `description` + `when_to_use`: truncated at **1,536 characters**
- Skill description budget: **1% of context window**, fallback **8,000 characters**
- Recommended: keep SKILL.md under **500 lines**

## $ARGUMENTS Parsing
- `$ARGUMENTS` — full argument string
- `$ARGUMENTS[N]` — 0-based index
- `$N` — shorthand for `$ARGUMENTS[N]`
- Uses **shell-style quoting**: `"hello world"` is a single argument
- Other substitutions: `${CLAUDE_SESSION_ID}`, `${CLAUDE_SKILL_DIR}`

## !`command` Preprocessing
- Runs shell commands **before** content sent to Claude
- Command output replaces placeholder inline
- Multi-line: fenced code block opened with `` ```! ``
- This is **preprocessing**, not something Claude executes
- Disable: `"disableSkillShellExecution": true` in settings
- Bundled and managed skills NOT affected by disable setting

## disable-model-invocation Behavior
- `true`: description **completely removed** from context; zero tokens until user invokes
- `false` (default): description always in context

## Compaction Behavior
- Re-attaches most recent invocation of each skill
- Each skill: first **5,000 tokens**
- Combined budget: **25,000 tokens**
- Filled from most recently invoked; older skills can be dropped

## Skill File Locations
- Enterprise: managed settings directory
- Personal: `~/.claude/skills/<name>/SKILL.md`
- Project: `.claude/skills/<name>/SKILL.md`
- Plugin: `<plugin>/skills/<name>/SKILL.md`
- Priority: enterprise > personal > project
- `.claude/commands/` still works; if skill and command share name, skill wins
