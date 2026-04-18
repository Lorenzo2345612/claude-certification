# Claude Code 101 -- Skilljar Course

> Source: https://anthropic.skilljar.com/claude-code-101
> Extracted: 2026-04-17
> Description: Learn how to use Claude Code effectively in your daily development workflow.

---

## Course Structure

### Module 1: What is Claude Code?

#### Lesson 1.1 -- What is Claude Code?

Claude Code is an AI-powered agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. It is available in your terminal, IDE (VS Code, JetBrains), desktop app, and browser.

Key distinctions from chat-based AI tools:
- Claude Code is an **agentic** tool -- it does not just answer questions and wait. It can read files, run commands, make changes, and autonomously work through problems.
- It understands your **entire codebase** and can work across multiple files and tools.
- Instead of writing code yourself and asking Claude to review it, you **describe what you want** and Claude figures out how to build it.

What you can do with Claude Code:
- **Automate tedious tasks**: writing tests, fixing lint errors, resolving merge conflicts, updating dependencies, writing release notes.
- **Build features and fix bugs**: describe in plain language. Claude plans, writes code across multiple files, and verifies.
- **Create commits and pull requests**: Claude works directly with git -- stages changes, writes commit messages, creates branches, opens PRs.
- **Connect tools with MCP**: Model Context Protocol lets Claude read design docs in Google Drive, update Jira tickets, pull Slack data, etc.
- **Customize with CLAUDE.md, skills, and hooks**: set coding standards, create repeatable workflows, enforce deterministic behaviors.
- **Run agent teams and custom agents**: spawn multiple agents for parallel work; use the Agent SDK for fully custom workflows.
- **Pipe, script, and automate**: composable CLI following Unix philosophy -- pipe logs in, run in CI, chain with other tools.
- **Schedule recurring tasks**: morning PR reviews, overnight CI failure analysis, weekly dependency audits.
- **Work from anywhere**: move between terminal, desktop, web, and mobile; use Remote Control, Dispatch, teleport.

#### Lesson 1.2 -- How Claude Code Works

Claude Code operates through an **agentic loop**:
1. You provide a prompt (natural language description of what you want).
2. Claude reads relevant files, analyzes your codebase.
3. Claude plans an approach.
4. Claude executes: edits files, runs commands, creates commits.
5. Claude verifies its work (runs tests, checks output).
6. Claude requests approval for changes or continues autonomously.

**Context window**: Claude's context window holds your entire conversation, including every message, file read, and command output. Performance degrades as context fills. Context management is the most important resource to manage.

**Permission modes**:
- **Default mode**: Claude asks permission for each action that modifies your system.
- **Auto mode**: a classifier model reviews commands and blocks only risky ones.
- **Plan mode**: Claude reads and analyzes without making changes (read-only).
- **Accept edits mode**: Claude edits files without asking but still prompts for commands.

**Built-in tools**: Claude Code has access to file reading/writing, search (grep/glob), bash commands, web fetch, and can call MCP servers.

---

### Module 2: Your First Prompt

#### Lesson 2.1 -- Installing Claude Code

**System requirements**:
- macOS 13.0+, Windows 10 1809+, Ubuntu 20.04+, Debian 10+, Alpine Linux 3.19+
- 4 GB+ RAM, x64 or ARM64 processor
- Internet connection required
- Bash, Zsh, PowerShell, or CMD shell
- Native Windows requires Git for Windows

**Installation methods**:

1. **Native Install (Recommended)** -- auto-updates in background:
   - macOS/Linux/WSL: `curl -fsSL https://claude.ai/install.sh | bash`
   - Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
   - Windows CMD: `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`

2. **Homebrew**: `brew install --cask claude-code` (does not auto-update)

3. **WinGet**: `winget install Anthropic.ClaudeCode` (does not auto-update)

**Other surfaces**:
- **VS Code**: install extension "Claude Code" from Marketplace
- **JetBrains**: install plugin from JetBrains Marketplace
- **Desktop app**: download from claude.com/download
- **Web**: use at claude.ai/code (no local setup needed)

**Authentication**: requires Pro, Max, Team, Enterprise, or Console account. Also supports Amazon Bedrock, Google Vertex AI, and Microsoft Foundry.

**Verification**: run `claude --version` or `claude doctor`.

#### Lesson 2.2 -- Your First Prompt

**Starting a session**:
```bash
cd your-project
claude
```

**First questions to try**:
- `what does this project do?`
- `what technologies does this project use?`
- `where is the main entry point?`
- `explain the folder structure`

**Making your first code change**:
- `add a hello world function to the main file`
- Claude finds the file, shows proposed changes, asks for approval, makes the edit.

**Using Git**:
- `what files have I changed?`
- `commit my changes with a descriptive message`
- `create a new branch called feature/quickstart`

**Essential commands**:

| Command | What it does |
|---------|-------------|
| `claude` | Start interactive mode |
| `claude "task"` | Run a one-time task |
| `claude -p "query"` | Run one-off query, then exit |
| `claude -c` | Continue most recent conversation |
| `claude -r` | Resume a previous conversation |
| `/clear` | Clear conversation history |
| `/help` | Show available commands |
| `exit` or Ctrl+D | Exit Claude Code |

---

### Module 3: Daily Workflows

#### Lesson 3.1 -- The Explore, Plan, Code, Commit Workflow

The recommended workflow has four phases:

**1. Explore** (Plan Mode):
- Enter Plan Mode (Shift+Tab to cycle, or `claude --permission-mode plan`)
- Claude reads files and answers questions without making changes.
- Example: `read /src/auth and understand how we handle sessions and login.`

**2. Plan** (Plan Mode):
- Ask Claude to create a detailed implementation plan.
- Example: `I want to add Google OAuth. What files need to change? Create a plan.`
- Press Ctrl+G to open the plan in your text editor for direct editing.

**3. Implement** (Normal Mode):
- Switch back to Normal Mode and let Claude code.
- Example: `implement the OAuth flow from your plan. write tests for the callback handler, run the test suite and fix any failures.`

**4. Commit** (Normal Mode):
- Ask Claude to commit and create a PR.
- Example: `commit with a descriptive message and open a PR`

**When to skip planning**: For clear, small-scope tasks (fixing a typo, adding a log line, renaming a variable), ask Claude to do it directly.

**Key best practices**:
- Give Claude a way to verify its work (tests, screenshots, expected outputs) -- this is the single highest-leverage thing you can do.
- Be specific: "write a validateEmail function with these test cases..." instead of "validate emails."
- Reference existing patterns: "look at how HotDogWidget.php is implemented and follow the pattern."
- Point to sources: "look through ExecutionFactory's git history and summarize how its api came to be."

#### Lesson 3.2 -- Context Management

**Why context matters**: Claude's context window fills up fast. Performance degrades as it fills -- Claude may start "forgetting" earlier instructions or making more mistakes.

**Context management strategies**:
- `/clear` -- Reset context between unrelated tasks. This is the most important habit.
- `/compact <instructions>` -- Summarize conversation to free space. Example: `/compact Focus on the API changes`
- `Esc + Esc` or `/rewind` -- Open rewind menu, restore previous state, or "Summarize from here."
- `/btw` -- Ask a side question that never enters conversation history.
- Auto-compaction triggers automatically when context approaches limits.

**Subagents for investigation**: Delegate research to subagents that run in separate context windows and report back summaries, keeping your main conversation clean.
```
Use subagents to investigate how our authentication system handles token refresh.
```

**Reference files with @**: Use `@src/utils/auth.js` to include file content directly without waiting for Claude to read it.

**Resuming conversations**:
- `claude --continue` -- resume most recent conversation
- `claude --resume` -- pick from recent conversations
- `/rename` -- give sessions descriptive names (e.g., "auth-refactor")

#### Lesson 3.3 -- Code Review

Claude Code can act as a code reviewer:

**Inline review**:
```
review my changes and suggest improvements
```

**As a linter in build scripts**:
```json
{
  "scripts": {
    "lint:claude": "claude -p 'you are a linter. look at changes vs main and report any issues related to typos.'"
  }
}
```

**Writer/Reviewer pattern** (two sessions):
- Session A (Writer): `Implement a rate limiter for our API endpoints`
- Session B (Reviewer): `Review the rate limiter implementation. Look for edge cases, race conditions.`

**Creating pull requests**:
```
summarize the changes I've made to the authentication module
create a pr
enhance the PR description with more context about the security improvements
```

---

### Module 4: Customizing Claude Code

#### Lesson 4.1 -- The CLAUDE.md File

CLAUDE.md is a markdown file Claude reads at the start of every session. It gives Claude persistent context it cannot infer from code alone.

**Where to put CLAUDE.md files** (in order of precedence):

| Scope | Location | Shared with |
|-------|----------|-------------|
| Managed policy | System-level paths | All users in org |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team (via source control) |
| User | `~/.claude/CLAUDE.md` | Just you (all projects) |
| Local | `./CLAUDE.local.md` (gitignored) | Just you (current project) |

**What to include**:
- Bash commands Claude can't guess (build, test, lint commands)
- Code style rules that differ from defaults
- Testing instructions and preferred test runners
- Repository etiquette (branch naming, PR conventions)
- Architectural decisions specific to your project
- Common gotchas or non-obvious behaviors

**What NOT to include**:
- Anything Claude can figure out by reading code
- Standard language conventions Claude already knows
- Detailed API documentation (link to docs instead)
- Information that changes frequently

**Best practices**:
- Target under 200 lines per file. Longer files reduce adherence.
- Use markdown headers and bullets.
- Be specific: "Use 2-space indentation" not "Format code properly."
- Run `/init` to generate a starter CLAUDE.md automatically.
- Check it into git so your team can contribute.

**Importing files**: Use `@path/to/import` syntax to reference other files:
```markdown
See @README.md for project overview and @package.json for available npm commands.
```

**Auto memory**: Claude accumulates knowledge across sessions automatically -- build commands, debugging insights, preferences. Stored in `~/.claude/projects/<project>/memory/`. Toggle with `/memory`.

#### Lesson 4.2 -- Subagents

Subagents are specialized AI assistants that handle specific tasks in their own context window.

**Benefits**:
- Preserve context -- keep exploration/implementation out of main conversation.
- Enforce constraints -- limit which tools a subagent can use.
- Specialize behavior -- focused system prompts for specific domains.
- Control costs -- route tasks to faster, cheaper models.

**Built-in agent types**: `Bash`, `Explore`, `Plan`, `general-purpose`.

**Creating custom subagents** in `.claude/agents/`:
```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling
```

**Usage**:
- Claude delegates automatically based on descriptions.
- Explicit: `use a subagent to review this code for security issues`
- View available: `/agents`

**Worktree isolation**: Subagents can use `isolation: worktree` to work in parallel without file conflicts.

#### Lesson 4.3 -- Skills

Skills extend what Claude can do via `SKILL.md` files. They load on demand (unlike CLAUDE.md which loads every session).

**Creating a skill** in `.claude/skills/<skill-name>/SKILL.md`:
```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies
---
When explaining code, always include:
1. Start with an analogy
2. Draw a diagram (ASCII art)
3. Walk through the code step-by-step
4. Highlight a gotcha
```

**Invocation**: Claude loads automatically when relevant, or invoke directly with `/explain-code`.

**Key frontmatter fields**:
- `name` -- display name and slash command
- `description` -- helps Claude decide when to use it
- `disable-model-invocation: true` -- only you can invoke (for workflows with side effects)
- `user-invocable: false` -- only Claude can invoke (background knowledge)
- `allowed-tools` -- pre-approve tools for this skill
- `context: fork` -- run in a subagent
- `$ARGUMENTS` -- pass user input to the skill

**Dynamic context injection**: `!`command`` syntax runs shell commands before content is sent to Claude.

#### Lesson 4.4 -- MCP (Model Context Protocol)

MCP is an open standard for connecting AI tools to external data sources.

**Adding MCP servers**:
```bash
claude mcp add <server-name> -- <command> [args...]
```

**Scope levels**:
- **User**: `~/.claude.json` -- available in all projects
- **Project**: `.mcp.json` -- shared with team via source control

**Use cases**: Notion, Figma, Jira, Slack, databases, Google Drive, custom internal tools.

**Resources**: Reference MCP data with `@server:resource` syntax.

**In Claude Code on the web**: MCP servers declared in `.mcp.json` are available in cloud sessions. Connectors for Slack, Linear, Google Drive are available as managed services.

#### Lesson 4.5 -- Hooks

Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Unlike CLAUDE.md instructions (advisory), hooks are **deterministic** and guarantee the action happens.

**Hook lifecycle events**:

| Event | When it fires |
|-------|--------------|
| SessionStart | When a session begins or resumes |
| UserPromptSubmit | When you submit a prompt, before Claude processes it |
| PreToolUse | Before a tool call executes (can block it) |
| PostToolUse | After a tool call succeeds |
| Stop | When Claude finishes responding |
| Notification | When Claude Code sends a notification |
| SubagentStart/Stop | When subagents spawn/finish |
| And many more... | WorktreeCreate, ConfigChange, FileChanged, etc. |

**Configuration** in settings JSON files:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Hook types**: `command` (shell), `http` (webhook), `prompt` (LLM evaluation), `agent` (subagent).

**Exit codes**: 0 = success, 2 = blocking error (blocks the action), other = non-blocking error.

**Common use cases**:
- Auto-format after every file edit
- Run lint before commits
- Block dangerous commands (e.g., `rm -rf`)
- Desktop notifications when Claude needs attention
- Audit logging

**Viewing hooks**: Type `/hooks` in Claude Code to browse configured hooks.

---

### Module 5: Quiz

#### Lesson 5.1 -- Course Quiz

Assessment covering all course material:
- Distinguishing AI coding agents from chat-based tools
- Understanding agentic loops and context windows
- Installing Claude Code across multiple platforms
- Crafting effective prompts with approval and auto-accept modes
- The Explore - Plan - Code - Commit workflow
- Context optimization techniques (/compact, /clear, /context)
- Creating CLAUDE.md files for persistent project memory
- Building custom subagents for task delegation
- Creating skills for repeatable workflows
- Integrating external data sources through MCP
- Writing hooks for deterministic control

---

## Prerequisites

- Basic command-line and code editor familiarity
- A Claude account (Pro/Max/Enterprise tier) or API key

## Key Takeaways

1. Claude Code is an **agentic** tool -- it explores, plans, implements, and verifies autonomously.
2. **Context management** is the single most important concept -- use `/clear` between tasks, delegate research to subagents.
3. **Give Claude verification criteria** (tests, screenshots, expected outputs) -- this is the highest-leverage practice.
4. **CLAUDE.md** provides persistent project instructions; keep it concise and specific.
5. **Skills** extend Claude with on-demand workflows; **Hooks** enforce deterministic behaviors.
6. **MCP** connects Claude to external tools and data sources.
7. **Subagents** preserve main conversation context by handling exploration in isolation.
8. The **Explore - Plan - Code - Commit** workflow separates research from implementation.
