# Introduction to Agent Skills - Complete Course Content

Source: https://anthropic.skilljar.com/introduction-to-agent-skills
Supplemented with: https://code.claude.com/docs/en/skills, https://agentskills.io/specification, https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills, https://claude.com/blog/skills

## Course Structure (6 Modules)

1. What are skills?
2. Creating your first skill
3. Configuration and multi-file skills
4. Skills vs. other Claude Code features
5. Sharing skills
6. Troubleshooting skills

---

## Module 1: What Are Skills?

### Definition
A skill is a directory containing a `SKILL.md` file with YAML frontmatter and markdown instructions. Skills extend what Claude can do by packaging reusable instructions, scripts, and resources that Claude loads when relevant.

### Key Concept: Progressive Disclosure
Skills use a three-tier loading system to manage context efficiently:

1. **Metadata (~100 tokens)**: Only `name` and `description` are loaded at startup for all skills. This is enough for Claude to know when each skill should be used.
2. **Instructions (<5000 tokens recommended)**: The full `SKILL.md` body loads only when the skill is activated.
3. **Resources (as needed)**: Files in `scripts/`, `references/`, `assets/` are loaded only when required during execution.

This prevents context window overload. Agents don't need to read the entirety of a skill into their context window when working on a particular task.

### When to Create a Skill
Create a skill when you:
- Keep pasting the same playbook, checklist, or multi-step procedure into chat
- Have a section of CLAUDE.md that has grown into a procedure rather than a fact
- Unlike CLAUDE.md content, a skill's body loads only when used, so long reference material costs almost nothing until needed

### Agent Skills Open Standard
Claude Code skills follow the Agent Skills open standard (https://agentskills.io), which works across multiple AI tools including: Claude Code, Cursor, GitHub Copilot, VS Code, Gemini CLI, OpenHands, Roo Code, Goose, Junie (JetBrains), OpenAI Codex, Kiro, Amp, and many others. Claude Code extends the standard with additional features like invocation control, subagent execution, and dynamic context injection.

### Skill Directory Structure

```
my-skill/
  SKILL.md           # Main instructions (required)
  template.md        # Template for Claude to fill in (optional)
  examples/
    sample.md        # Example output showing expected format (optional)
  scripts/
    validate.sh      # Script Claude can execute (optional)
  references/        # Additional documentation (optional)
  assets/            # Static resources, templates, data files (optional)
```

---

## Module 2: Creating Your First Skill

### Basic SKILL.md Format

```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?
```

### Where Skills Live (Priority Order)

| Location    | Path                                             | Applies to                      |
|-------------|--------------------------------------------------|---------------------------------|
| Enterprise  | Managed settings                                 | All users in your organization  |
| Personal    | `~/.claude/skills/<skill-name>/SKILL.md`         | All your projects               |
| Project     | `.claude/skills/<skill-name>/SKILL.md`           | This project only               |
| Plugin      | `<plugin>/skills/<skill-name>/SKILL.md`          | Where plugin is enabled         |

When skills share the same name across levels, higher-priority locations win: enterprise > personal > project. Plugin skills use a `plugin-name:skill-name` namespace, so they cannot conflict with other levels.

### Invocation Methods
1. **Auto-invocation by Claude**: Ask something matching the description (e.g., "How does this code work?")
2. **Direct invocation**: Type `/skill-name` (e.g., `/explain-code src/auth/login.ts`)

### Live Change Detection
Claude Code watches skill directories for file changes. Adding, editing, or removing a skill takes effect within the current session without restarting. Creating a top-level skills directory that did not exist when the session started requires restarting Claude Code.

### Automatic Discovery from Nested Directories
When working with files in subdirectories, Claude Code automatically discovers skills from nested `.claude/skills/` directories. For example, editing a file in `packages/frontend/` also looks for skills in `packages/frontend/.claude/skills/`. This supports monorepo setups.

### Skills from Additional Directories
The `--add-dir` flag grants file access, and `.claude/skills/` within an added directory is loaded automatically as an exception to the general rule.

### Custom Commands Merged into Skills
A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to control invocation, and the ability for Claude to load them automatically.

---

## Module 3: Configuration and Multi-File Skills

### SKILL.md Frontmatter Reference (Complete)

```yaml
---
name: my-skill
description: What this skill does
when_to_use: Additional context for when Claude should invoke the skill
argument-hint: [issue-number]
disable-model-invocation: true
user-invocable: false
allowed-tools: Read Grep Bash(git *)
model: claude-sonnet-4-20250514
effort: high
context: fork
agent: Explore
hooks: ...
paths: "*.py,src/**/*.ts"
shell: bash
---
```

### All Frontmatter Fields

| Field                      | Required    | Description |
|----------------------------|-------------|-------------|
| `name`                     | No          | Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters). Must not start/end with hyphen. Must not contain consecutive hyphens. Must match parent directory name. |
| `description`              | Recommended | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses first paragraph of markdown content. Combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing. |
| `when_to_use`              | No          | Additional context for when Claude should invoke the skill, such as trigger phrases or example requests. Appended to `description` in the listing and counts toward the 1,536-character cap. |
| `argument-hint`            | No          | Hint shown during autocomplete to indicate expected arguments. Example: `[issue-number]` or `[filename] [format]`. |
| `disable-model-invocation` | No          | Set to `true` to prevent Claude from automatically loading this skill. Use for workflows you want to trigger manually with `/name`. Default: `false`. |
| `user-invocable`           | No          | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`. |
| `allowed-tools`            | No          | Tools Claude can use without asking permission when this skill is active. Accepts a space-separated string or a YAML list. Does NOT restrict tools -- only pre-approves listed ones. |
| `model`                    | No          | Model to use when this skill is active. |
| `effort`                   | No          | Effort level when this skill is active. Overrides session effort level. Options: `low`, `medium`, `high`, `xhigh`, `max`. |
| `context`                  | No          | Set to `fork` to run in a forked subagent context. The skill content becomes the prompt that drives the subagent. The subagent won't have access to conversation history. |
| `agent`                    | No          | Which subagent type to use when `context: fork` is set. Options: built-in agents (`Explore`, `Plan`, `general-purpose`) or custom subagent from `.claude/agents/`. If omitted, uses `general-purpose`. |
| `hooks`                    | No          | Hooks scoped to this skill's lifecycle. |
| `paths`                    | No          | Glob patterns that limit when this skill is activated. Accepts comma-separated string or YAML list. When set, Claude loads the skill automatically only when working with files matching the patterns. |
| `shell`                    | No          | Shell to use for `!` command blocks. Accepts `bash` (default) or `powershell`. |
| `license`                  | No          | (Open standard) License name or reference to a bundled license file. |
| `compatibility`            | No          | (Open standard) Max 500 chars. Indicates environment requirements. |
| `metadata`                 | No          | (Open standard) Arbitrary key-value mapping for additional metadata. |

### Agent Skills Open Standard vs Claude Code Extensions

**Open Standard fields** (agentskills.io): `name` (required), `description` (required), `license`, `compatibility`, `metadata`, `allowed-tools` (experimental)

**Claude Code extensions**: `when_to_use`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `model`, `effort`, `context`, `agent`, `hooks`, `paths`, `shell`

### String Substitutions

| Variable               | Description |
|------------------------|-------------|
| `$ARGUMENTS`           | All arguments passed when invoking the skill. If not present in content, arguments are appended as `ARGUMENTS: <value>`. |
| `$ARGUMENTS[N]`        | Access a specific argument by 0-based index (e.g., `$ARGUMENTS[0]`). |
| `$N`                   | Shorthand for `$ARGUMENTS[N]` (e.g., `$0`, `$1`). |
| `${CLAUDE_SESSION_ID}` | The current session ID. |
| `${CLAUDE_SKILL_DIR}`  | The directory containing the skill's `SKILL.md` file. Useful for referencing bundled scripts/files. |

Indexed arguments use shell-style quoting: `/my-skill "hello world" second` makes `$0` = `hello world` and `$1` = `second`.

### Passing Arguments

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.
```

When you run `/fix-issue 123`, Claude receives "Fix GitHub issue 123 following our coding standards..."

If the skill doesn't include `$ARGUMENTS`, Claude Code appends `ARGUMENTS: <your input>` to the end.

### Multi-File Skills / Supporting Files

Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files:

```
my-skill/
  SKILL.md (required - overview and navigation)
  reference.md (detailed API docs - loaded when needed)
  examples.md (usage examples - loaded when needed)
  scripts/
    helper.py (utility script - executed, not loaded)
```

Reference supporting files from `SKILL.md`:
```markdown
## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

### Dynamic Context Injection (Shell Commands in Skills)

The `` !`<command>` `` syntax runs shell commands before the skill content is sent to Claude. The command output replaces the placeholder.

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

For multi-line commands, use a fenced code block opened with ` ```! `:
````
## Environment
```!
node --version
npm --version
git status --short
```
````

To disable shell execution for user/project/plugin sources: set `"disableSkillShellExecution": true` in settings.

### Pre-Approving Tools (allowed-tools)

`allowed-tools` grants permission for listed tools WITHOUT per-use approval. It does NOT restrict which tools are available. Every tool remains callable; permission settings still govern unlisted tools.

```yaml
---
name: commit
description: Stage and commit the current changes
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *)
---
```

To block a skill from using certain tools, add deny rules in permission settings instead.

### context: fork (Running Skills as Subagents)

Add `context: fork` when you want a skill to run in isolation. The skill content becomes the prompt driving the subagent. The subagent has no access to conversation history.

**Important**: `context: fork` only makes sense for skills with explicit instructions. If the skill contains only guidelines without a task, the subagent receives the guidelines but no actionable prompt and returns without meaningful output.

| Approach                    | System prompt                              | Task                         | Also loads     |
|-----------------------------|-------------------------------------------|------------------------------|----------------|
| Skill with `context: fork`  | From agent type (`Explore`, `Plan`, etc.) | SKILL.md content             | CLAUDE.md      |
| Subagent with `skills` field| Subagent's markdown body                  | Claude's delegation message  | Preloaded skills + CLAUDE.md |

Example:
```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Summarize findings with specific file references
```

### Skill Content Lifecycle

1. When invoked, rendered `SKILL.md` content enters the conversation as a single message and stays for the rest of the session.
2. Claude Code does NOT re-read the skill file on later turns.
3. Auto-compaction carries invoked skills forward within a token budget:
   - Re-attaches most recent invocation of each skill after summary
   - Keeps first 5,000 tokens of each skill
   - Combined budget of 25,000 tokens for re-attached skills
   - Budget fills starting from most recently invoked skill; older skills can be dropped entirely
4. To restore full content after compaction, re-invoke the skill.

### Extended Thinking in Skills
Include the word "ultrathink" anywhere in skill content to enable extended thinking.

---

## Module 4: Skills vs. Other Claude Code Features

### Skills vs CLAUDE.md
- **CLAUDE.md**: Always loaded into context. Good for project-wide facts, conventions, rules.
- **Skills**: Loaded on-demand only when relevant. Good for procedures, checklists, multi-step workflows. Cost almost nothing until needed.

### Skills vs Hooks
- **Skills**: Prompt-based. Claude follows instructions. Can be invoked by user or Claude.
- **Hooks**: Deterministic shell commands that run on tool events. Enforce behavior programmatically.

### Skills vs Subagents
- **Skills**: Instructions that Claude follows in the current context (or forked via `context: fork`).
- **Subagents**: Custom agent definitions with their own system prompt, model, tools. Skills can be preloaded into subagents.

### Skills vs Custom Commands
Custom commands (`.claude/commands/`) have been merged into skills. Both create `/command-name`. Skills add optional features: supporting files, frontmatter for invocation control, auto-loading by Claude. If a skill and command share the same name, the skill takes precedence.

### Types of Skill Content

**Reference content**: Knowledge Claude applies to current work (conventions, patterns, style guides). Runs inline.
```yaml
---
name: api-conventions
description: API design patterns for this codebase
---
When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
```

**Task content**: Step-by-step instructions for a specific action. Often `disable-model-invocation: true`.
```yaml
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---
Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

---

## Module 5: Sharing Skills

### Distribution Scopes

| Method     | Description |
|------------|-------------|
| **Project skills** | Commit `.claude/skills/` to version control |
| **Plugins** | Create a `skills/` directory in your plugin |
| **Managed** | Deploy organization-wide through managed settings |

### Plugin Distribution

Plugins let you package skills with other extensions (agents, hooks, MCP servers) for sharing:

```
my-plugin/
  .claude-plugin/
    plugin.json
  skills/
    code-review/
      SKILL.md
```

Plugin skills are namespaced: `/plugin-name:skill-name` (e.g., `/my-plugin:code-review`). This prevents conflicts between plugins.

Plugin manifest (`plugin.json`):
```json
{
  "name": "my-plugin",
  "description": "A plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

### Plugin Installation and Testing
- Test locally: `claude --plugin-dir ./my-plugin`
- Reload during development: `/reload-plugins`
- Submit to official marketplace: `claude.ai/settings/plugins/submit` or `platform.claude.com/plugins/submit`

### Standalone vs Plugin

| Standalone (`.claude/`)           | Plugin                                  |
|-----------------------------------|-----------------------------------------|
| Short skill names `/hello`        | Namespaced `/plugin-name:hello`         |
| Only available in one project     | Can be shared via marketplaces          |
| Personal/project-specific         | Versioned, reusable across projects     |
| Must manually copy to share       | Install with `/plugin install`          |

---

## Module 6: Troubleshooting Skills

### Skill Not Triggering

1. Check the description includes keywords users would naturally say
2. Verify the skill appears in `What skills are available?`
3. Try rephrasing your request to match the description more closely
4. Invoke it directly with `/skill-name` if user-invocable

### Skill Triggers Too Often

1. Make the description more specific
2. Add `disable-model-invocation: true` if you only want manual invocation

### Skill Descriptions Are Cut Short

All skill names are always included, but if you have many skills, descriptions are shortened to fit the character budget. The budget scales dynamically at 1% of the context window, with a fallback of 8,000 characters.

To raise the limit: set `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable.

To optimize: front-load the key use case. Each entry's combined `description` + `when_to_use` text is capped at 1,536 characters regardless of budget.

### Skill Seems to Stop Working After First Response

The content is usually still present -- the model is choosing other tools/approaches. Options:
- Strengthen the skill's `description` and instructions
- Use hooks to enforce behavior deterministically
- If large or many other skills invoked after it, re-invoke after compaction to restore full content

---

## Controlling Who Invokes a Skill (Invocation Matrix)

| Frontmatter                      | User can invoke | Claude can invoke | When loaded into context |
|----------------------------------|-----------------|-------------------|--------------------------|
| (default)                        | Yes             | Yes               | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes             | No                | Description NOT in context, full skill loads when user invokes |
| `user-invocable: false`          | No              | Yes               | Description always in context, full skill loads when invoked |

**Important**: `user-invocable` only controls menu visibility, not Skill tool access. Use `disable-model-invocation: true` to block programmatic invocation.

---

## Restricting Claude's Skill Access

Three methods:

1. **Disable all skills**: Deny the `Skill` tool in `/permissions`
2. **Allow/deny specific skills**: Permission rules like `Skill(commit)`, `Skill(review-pr *)`, deny `Skill(deploy *)`
3. **Hide individual skills**: Add `disable-model-invocation: true` to frontmatter

Permission syntax: `Skill(name)` for exact match, `Skill(name *)` for prefix match with any arguments.

---

## Bundled Skills

Claude Code includes bundled skills available in every session: `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`, `/init`, `/review`, `/security-review`. These are prompt-based: they give Claude a detailed playbook and let it orchestrate using its tools.

---

## Visual Output Pattern

Skills can bundle and run scripts to generate visual output (interactive HTML files). Example pattern:

1. Create skill directory with `SKILL.md` and `scripts/` subfolder
2. `SKILL.md` instructs Claude to run the bundled script
3. Script generates HTML/visualization and opens in browser
4. Claude handles orchestration while the script does heavy lifting

This works for: dependency graphs, test coverage reports, API documentation, database schema visualizations, codebase explorers.

---

## Key Technical Facts Summary

- `SKILL.md` is the required entrypoint file in every skill directory
- Frontmatter is YAML between `---` markers at the top of `SKILL.md`
- `name` and `description` are the only standard-required fields (Claude Code makes both optional but recommends `description`)
- `context: fork` runs the skill as an isolated subagent with no conversation history access
- `agent` field specifies which subagent type (`Explore`, `Plan`, `general-purpose`, or custom)
- `allowed-tools` pre-approves tools but does NOT restrict them
- `disable-model-invocation: true` prevents auto-invocation AND removes description from context
- `user-invocable: false` hides from `/` menu but Claude can still invoke
- Description + when_to_use combined text is truncated at 1,536 characters in skill listing
- Skill description budget is 1% of context window with 8,000-character fallback (configurable via `SLASH_COMMAND_TOOL_CHAR_BUDGET`)
- After compaction, skills are re-attached with first 5,000 tokens each, combined budget 25,000 tokens
- `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_SKILL_DIR}` are available substitutions
- Shell injection via `` !`command` `` runs BEFORE Claude sees the content (preprocessing)
- Can disable shell execution with `"disableSkillShellExecution": true` in settings
- Include "ultrathink" in skill content to enable extended thinking
- Skills from `--add-dir` directories are loaded automatically (exception to general `--add-dir` behavior)
- CLAUDE.md from `--add-dir` directories require `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`
- The `paths` field uses glob patterns to limit auto-activation to specific file patterns
- The `shell` field accepts `bash` (default) or `powershell` (requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`)
