# Introduction to Claude Cowork -- Skilljar Course

> Source: https://anthropic.skilljar.com/introduction-to-claude-cowork
> Extracted: 2026-04-17
> Description: The Cowork task loop, plugins and skills, file and research workflows, steering multi-step work.

---

## Course Structure

### Module 1: Meet Claude Cowork

#### Lesson 1.1 -- What is Cowork?

Claude Cowork is Claude working directly with your files, folders, and apps -- reading, editing, and producing real outputs on your machine. It runs Claude Code tasks through two primary interfaces:

1. **Claude Code on the Web** (claude.ai/code): runs tasks on Anthropic-managed cloud infrastructure. Sessions persist even if you close your browser. Monitor from the Claude mobile app.
2. **Claude Code Desktop App**: a standalone native app for macOS and Windows. Run multiple sessions side by side, review diffs visually, schedule recurring tasks, kick off cloud sessions.

Cowork is the concept of Claude operating autonomously on real tasks -- not just chatting, but actually doing work: editing files, running commands, creating pull requests, researching codebases, and producing deliverables.

**Key capabilities**:
- Read, edit, and create files across your project
- Run shell commands and scripts
- Work with git (commits, branches, PRs)
- Connect to external tools via MCP (Slack, Jira, Google Drive, etc.)
- Run in parallel sessions for simultaneous work
- Schedule recurring tasks (routines)
- Move work between terminal, desktop, web, and mobile

**Available on**: Pro, Max, Team, and Enterprise plans.

#### Lesson 1.2 -- Getting Set Up

**Desktop App Setup**:
- Download from claude.com/download for macOS or Windows
- Launch Claude, sign in, click the **Code** tab
- The Desktop app includes: parallel sessions with Git worktree isolation, drag-and-drop layout, integrated terminal and file editor, visual diff review, live app preview

**Web Setup** (claude.ai/code):
- Visit claude.ai/code
- Connect GitHub via the Claude GitHub App (per-repo authorization) or `/web-setup` (syncs local `gh` CLI token)
- Create a cloud environment with network access, environment variables, and setup scripts

**Terminal CLI Setup**:
- Install: `curl -fsSL https://claude.ai/install.sh | bash`
- Start: `cd your-project && claude`
- Use `--remote` to start cloud sessions from terminal
- Use `--teleport` to pull cloud sessions into terminal

#### Lesson 1.3 -- Running Your First Task

**On the web**:
1. Go to claude.ai/code
2. Select a repository
3. Type a task description (e.g., "Fix the failing tests in tests/auth")
4. Claude clones the repo, runs in an isolated VM, and works autonomously
5. Review changes, leave inline comments, create a PR

**From the terminal**:
```bash
claude --remote "Fix the authentication bug in src/auth/login.ts"
```

**From Desktop**:
1. Open the Code tab
2. Start a new session
3. Type your task

**Tips for first tasks**:
- Be explicit about what success looks like
- Include verification criteria (run tests, check output)
- Start with a focused, well-scoped task

---

### Module 2: The Task Loop

#### Lesson 2.1 -- Giving Cowork Context

The **agentic task loop** is how Cowork operates:
1. Receive a task (your prompt)
2. Read relevant files and explore the codebase
3. Plan an approach
4. Execute (edit files, run commands)
5. Verify results (run tests, check output)
6. Report back or continue

**Context is the fundamental constraint**. Claude's context window holds the entire conversation, files read, and command outputs. It fills up fast and performance degrades as it fills.

**Ways to provide context**:

1. **CLAUDE.md files**: persistent instructions loaded every session. Include build commands, code style rules, architecture decisions.
   ```markdown
   # Code style
   - Use ES modules (import/export) syntax
   - Destructure imports when possible
   # Workflow
   - Run `npm test` before committing
   ```

2. **@ file references**: include file content directly: `Explain the logic in @src/utils/auth.js`

3. **Pasting images**: copy/paste or drag-and-drop screenshots, design mockups, error screenshots.

4. **Piping data**: `cat error.log | claude -p "explain this error"`

5. **URLs**: give documentation URLs for Claude to fetch.

6. **MCP resources**: `@github:repos/owner/repo/issues` to fetch from connected services.

7. **Skills**: on-demand instructions that load only when relevant (unlike CLAUDE.md which loads always).

**Context management commands**:

| Command | Purpose |
|---------|---------|
| `/clear` | Reset context between unrelated tasks |
| `/compact` | Summarize conversation to free space |
| `/btw` | Side question that doesn't enter history |
| `/rewind` | Restore to previous checkpoint |
| Subagents | Delegate research to separate context |

**The interview pattern**: For larger features, have Claude interview you first:
```
I want to build [brief description]. Interview me in detail using the AskUserQuestion tool.
Ask about technical implementation, UI/UX, edge cases, and tradeoffs.
```

---

### Module 3: Making Claude Cowork Yours

#### Lesson 3.1 -- Plugins: Cowork as a Specialist

Plugins bundle skills, hooks, subagents, MCP servers, LSP servers, and monitors into installable units.

**Installing plugins**:
- Run `/plugin` to browse the marketplace
- Plugins add capabilities without manual configuration

**Plugin vs standalone configuration**:

| Approach | Skill names | Best for |
|----------|-------------|----------|
| Standalone (`.claude/` directory) | `/hello` | Personal workflows, project-specific, quick experiments |
| Plugins | `/plugin-name:hello` | Sharing with team, distributing to community, reusable across projects |

**Plugin structure**:
```
my-plugin/
  .claude-plugin/
    plugin.json       # Manifest: name, description, version
  skills/             # SKILL.md files
  agents/             # Custom agent definitions
  hooks/
    hooks.json        # Event handlers
  .mcp.json           # MCP server configurations
  .lsp.json           # LSP server configurations
  monitors/
    monitors.json     # Background monitors
  bin/                # Executables added to PATH
  settings.json       # Default settings when plugin enabled
```

**Creating plugins**:
1. Create directory with `.claude-plugin/plugin.json` manifest
2. Add skills in `skills/<name>/SKILL.md`
3. Test with `claude --plugin-dir ./my-plugin`
4. Share via marketplace or commit to repo

**LSP plugins**: give Claude real-time code intelligence (go-to-definition, find-references, error detection). Install pre-built plugins for TypeScript, Python, Rust, etc.

**Background monitors**: watch logs, files, or external status and notify Claude as events arrive.

**Official marketplace**: submit plugins at claude.ai/settings/plugins/submit.

#### Lesson 3.2 -- Scheduled Tasks

Claude can handle tasks automatically on a recurring basis.

**Routines** (cloud-based, runs even when laptop is closed):
- Created at claude.ai/code/routines or via `/schedule` in CLI
- Three trigger types:
  - **Scheduled**: hourly, daily, weekdays, weekly, or custom cron
  - **API**: HTTP POST endpoint with bearer token (wire into alerting, deploy pipelines)
  - **GitHub**: react to PRs opened, releases published, etc.
- Run on Anthropic-managed cloud infrastructure

**Example use cases**:
- **Backlog maintenance**: nightly run reads new issues, applies labels, assigns owners, posts summary to Slack
- **Alert triage**: monitoring tool calls API endpoint when error threshold crossed; Claude correlates with recent commits, opens draft PR with fix
- **Bespoke code review**: GitHub trigger on `pull_request.opened`; applies team review checklist, leaves inline comments
- **Deploy verification**: CD pipeline calls endpoint after deploy; Claude runs smoke checks, scans error logs
- **Docs drift**: weekly scan of merged PRs, flags outdated documentation, opens update PRs

**Desktop scheduled tasks**: local tasks that run on your machine with access to local files and tools.

**`/loop`**: repeats a prompt within a CLI session for quick polling.

**Creating a routine from CLI**:
```bash
/schedule daily PR review at 9am
```

**Routine configuration**:
- Prompt (must be self-contained and explicit about success criteria)
- Repositories (cloned at start of each run)
- Environment (network access, env vars, setup script)
- Connectors (MCP services like Slack, Linear, Google Drive)
- Triggers (schedule, API, GitHub events)

**Branch permissions**: Claude can only push to `claude/`-prefixed branches by default. Enable "Allow unrestricted branch pushes" per repository if needed.

---

### Module 4: Claude Cowork in Practice

#### Lesson 4.1 -- File and Document Tasks

Cowork excels at tasks involving files and documents:

**Code tasks**:
- Fix bugs: `there's a bug where users can submit empty forms - fix it`
- Add features: `add input validation to the user registration form`
- Refactor: `refactor the authentication module to use async/await`
- Write tests: `write unit tests for the calculator functions`
- Update docs: `update the README with installation instructions`

**Multi-file operations**:
- Claude works across multiple files simultaneously
- Fan out across files for large migrations:
  ```bash
  for file in $(cat files.txt); do
    claude -p "Migrate $file from React to Vue." --allowedTools "Edit,Bash(git commit *)"
  done
  ```

**Git worktrees for parallel work**:
- `claude --worktree feature-auth` -- creates isolated worktree with new branch
- Each session gets its own copy of the codebase
- Multiple Claude sessions can work on different tasks simultaneously without conflicts

**Visual diff review** (Desktop):
- See all changes with lines added/removed
- Leave inline comments on specific lines
- Send comments to Claude for iteration

**Working with images**:
- Drag-and-drop images, paste screenshots, reference image paths
- Claude can analyze UI designs, error screenshots, diagrams
- Generate CSS from design mockups

**Output format control**:
- `--output-format text` -- plain text (default)
- `--output-format json` -- JSON array of messages with metadata
- `--output-format stream-json` -- real-time streaming JSON

#### Lesson 4.2 -- Research and Analysis at Scale

**Codebase exploration**:
- `give me an overview of this codebase`
- `explain the main architecture patterns`
- `trace the login process from front-end to database`
- `find the files that handle user authentication`

**Using subagents for research**: Delegate investigation to separate context windows:
```
Use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse.
```

**Web-based research at scale**:
- Cloud sessions (claude.ai/code) run on Anthropic infrastructure
- Multiple `--remote` commands run simultaneously in separate sessions:
  ```bash
  claude --remote "Fix the flaky test in auth.spec.ts"
  claude --remote "Update the API documentation"
  claude --remote "Refactor the logger to use structured output"
  ```
- Monitor all with `/tasks`

**Plan Mode for safe analysis**:
- `claude --permission-mode plan` -- read-only exploration
- Perfect for: multi-step implementation planning, code exploration, interactive development
- Press Ctrl+G to open and edit the plan in your text editor

**Extended thinking**:
- Enabled by default -- Claude reasons through complex problems step-by-step
- Toggle verbose mode with Ctrl+O to see internal reasoning
- Adjust effort level with `/effort`
- Use "ultrathink" keyword for deeper reasoning on specific turns

**Non-interactive mode for automation**:
```bash
claude -p "Explain what this project does"
claude -p "List all API endpoints" --output-format json
cat build-error.txt | claude -p "explain the root cause" > output.txt
```

---

### Module 5: Working Responsibly

#### Lesson 5.1 -- Permissions, Usage, and Choosing Your Model

**Permission modes**:

| Mode | Behavior |
|------|----------|
| Default | Claude asks permission for each modifying action |
| Auto | Classifier reviews commands, blocks only risky ones |
| Accept Edits | Claude edits files freely, still prompts for shell commands |
| Plan | Read-only, no modifications allowed |

**Permission rules**: allowlist specific safe commands in `/permissions`:
```
Bash(git add *) Bash(git commit *) Bash(git status *)
```

**Sandboxing**: OS-level isolation that restricts filesystem and network access. Claude can work freely within boundaries.

**Model selection**:
- Choose model with `/model`
- Adjust effort level with `/effort`
- Subagents can use different models (e.g., route to cheaper/faster Haiku for simple tasks)
- Models support adaptive reasoning: dynamically allocate thinking based on task complexity

**Usage and costs**:
- Claude Code shares rate limits with all Claude usage within your account
- Cloud sessions share the same limits
- Routines draw down subscription usage
- Monitor at claude.ai/settings/usage

**Security in cloud sessions**:
- Each session runs in an isolated VM
- Credentials never enter the sandbox -- authentication through secure proxy
- Network access controlled by environment settings
- Code analyzed within isolated VMs before creating PRs

#### Lesson 5.2 -- Troubleshooting and Next Steps

**Common failure patterns**:
1. **Kitchen sink session**: mixing unrelated tasks in one session. Fix: `/clear` between tasks.
2. **Correcting over and over**: context polluted with failed approaches. Fix: after two failed corrections, `/clear` and write a better prompt.
3. **Over-specified CLAUDE.md**: too long, Claude ignores rules. Fix: ruthlessly prune.
4. **Trust-then-verify gap**: plausible implementation without edge case handling. Fix: always provide verification (tests, scripts).
5. **Infinite exploration**: scoping investigations too broadly. Fix: scope narrowly or use subagents.

**Course-correcting**:
- `Esc` -- stop Claude mid-action
- `Esc + Esc` or `/rewind` -- restore previous state
- `"Undo that"` -- have Claude revert changes
- `/clear` -- reset and start fresh

**Checkpoints**: Every action creates a checkpoint. Double-tap Escape to open rewind menu. Restore conversation, code, or both.

**Getting help**:
- In Claude Code: type `/help` or ask "how do I..."
- Ask Claude about its own capabilities: `what can Claude Code do?`
- Documentation: code.claude.com/docs
- Community: Anthropic Discord

**Next steps after the course**:
- Set up CLAUDE.md for your projects
- Create custom skills for repeatable workflows
- Install relevant plugins (code intelligence, etc.)
- Configure hooks for automated formatting/linting
- Connect MCP servers for external tools
- Try parallel sessions and cloud-based tasks
- Set up routines for recurring work

---

### Module 6: Check Your Understanding

#### Lesson 6.1 -- Quiz on Claude Cowork

Assessment covering:
- What Cowork is and how it differs from chat-based AI
- Setting up Cowork (desktop, web, terminal)
- Running first tasks
- The agentic task loop
- Providing context (CLAUDE.md, @references, images, MCP)
- Plugins and their structure
- Scheduled tasks and routines (triggers, configuration)
- File and document workflows
- Research and analysis at scale (subagents, parallel sessions, Plan Mode)
- Permission modes and security
- Model selection and usage
- Troubleshooting common issues

---

## Prerequisites

- Basic familiarity with a text editor and file management
- A Claude account (Pro, Max, Team, or Enterprise)

## Key Takeaways

1. **Cowork = Claude doing real work** -- not just chatting, but reading, editing, and producing outputs on your machine or in the cloud.
2. **The task loop** is the core concept: receive task, explore, plan, execute, verify, report.
3. **Context is the fundamental constraint** -- manage it aggressively with `/clear`, subagents, and `/compact`.
4. **Plugins** turn Cowork into a specialist by bundling skills, hooks, agents, and MCP servers into installable units.
5. **Scheduled tasks (Routines)** automate recurring work on cloud infrastructure -- triggered by schedule, API, or GitHub events.
6. **Parallel sessions** multiply output: use worktrees, cloud sessions, or the Desktop app for simultaneous work.
7. **Permission modes** let you balance autonomy and control: Default, Auto, Accept Edits, Plan.
8. **Always provide verification criteria** -- tests, screenshots, expected outputs -- so Claude can check its own work.
9. **Start with focused tasks**, provide explicit success criteria, and iterate from there.
10. Cowork works across **terminal, desktop, web, and mobile** -- sessions can move between surfaces.
