# Claude Code in Action -- Full Course Extraction

**Course URL:** https://anthropic.skilljar.com/claude-code-in-action
**Lessons:** 21 total (excluding survey and quiz)
**Course Description:** Learn how to use Claude Code as your AI-powered coding assistant, covering setup, context management, hooks, the SDK, and GitHub integration.

---

## Section 1: What is Claude Code?

### Lesson 1: Introduction

**URL:** https://anthropic.skilljar.com/claude-code-in-action (intro)

- Welcome/overview lesson introducing the course structure
- Course covers: what Claude Code is, hands-on setup, context management, hooks, the SDK
- Prerequisites: basic familiarity with terminal/command line

---

### Lesson 2: What is a coding assistant?

**URL:** https://anthropic.skilljar.com/claude-code-in-action (section 1)

- Coding assistants are AI-powered tools that help developers write, understand, and modify code
- They go beyond autocomplete -- they can understand context, make multi-file changes, and reason about codebases
- Claude Code is Anthropic's agentic coding assistant that runs in the terminal
- Unlike IDE-embedded assistants, Claude Code operates directly in your development environment
- It can read files, write code, run commands, and interact with your full development toolchain

---

### Lesson 3: Claude Code in action

**URL:** https://anthropic.skilljar.com/claude-code-in-action (section 1)

- Demonstration of Claude Code capabilities in a real coding scenario
- Shows Claude Code reading project structure, understanding codebase, making targeted changes
- Highlights the agentic loop: Claude reads context, plans changes, implements them, verifies results
- Built-in tools: Read, Write, Edit, Bash, Glob, Grep -- these are abstract/generic tools that combine creatively
- Claude Code can handle tasks like refactoring, bug fixing, adding features, writing tests

---

## Section 2: Getting Hands On

### Lesson 4: Claude Code setup

**URL:** https://anthropic.skilljar.com/claude-code-in-action/301614

**Key Facts:**
- Install via npm: `npm install -g @anthropic-ai/claude-code`
- Requires Node.js 18+ installed
- Run `claude` in terminal to start
- Authenticate with Anthropic API key or Anthropic account
- API key via `ANTHROPIC_API_KEY` environment variable
- First run walks through authentication and setup
- Claude Code runs in your terminal, inheriting your shell environment and permissions
- Works on macOS, Linux, and Windows (via WSL or native)

---

### Lesson 5: Project setup

**URL:** https://anthropic.skilljar.com/claude-code-in-action (section 2)

**Key Facts:**
- Navigate to your project directory before running `claude`
- Claude Code automatically discovers project structure on launch
- It reads package.json, README, and other project files to understand context
- CLAUDE.md file in project root provides persistent instructions to Claude
- CLAUDE.md is loaded every session automatically
- Project-level settings in `.claude/settings.json`
- Claude Code respects .gitignore for file discovery

---

### Lesson 6: Adding context

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303241

**Key Facts:**
- Claude Code needs context to make good decisions -- the more relevant context, the better results
- Ways to add context:
  - **CLAUDE.md files**: Project instructions loaded every session
  - **Direct file references**: Mention files in your prompts, Claude reads them
  - **Drag and drop**: Drag files/images directly into the terminal
  - **@ mentions**: Reference specific files with `@filename` syntax
  - **Paste content**: Paste code or text directly into the prompt
- CLAUDE.md is the most important context mechanism:
  - Lives in project root (shared with team) or `~/.claude/CLAUDE.md` (personal)
  - Contains: coding standards, project architecture, build commands, preferences
  - Loaded automatically every conversation
- Use `#` to add quick memories that persist across sessions
- Memory system: Claude saves learnings to MEMORY.md automatically
- Auto memory loads first 200 lines or 25KB

---

### Lesson 7: Making changes

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303236

**Key Facts:**
- Claude Code can create, edit, and delete files across your project
- It shows diffs before applying changes so you can review
- Permission system controls what Claude can do:
  - Read operations: generally allowed
  - Write operations: require approval (unless pre-approved)
  - Command execution: requires approval (unless pre-approved)
- Accept or reject changes individually
- Claude Code uses Edit tool for targeted modifications (not full file rewrites)
- Multi-file changes: Claude can coordinate changes across many files in one task
- After making changes, Claude can run tests/builds to verify correctness
- Iterative workflow: make change, test, fix issues, repeat

---

### Lesson 8: Course satisfaction survey

**(Skipped -- survey lesson)**

---

## Section 3: Controlling Context

### Lesson 9: Controlling context

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303237

**Key Facts:**
- **Escape key**: Stops Claude mid-response (interrupt generation)
- **Double Escape**: Rewinds conversation to before the last turn
- **`#` command**: Adds a memory note that persists across sessions
- **`/compact`**: Summarizes the current conversation, preserving key knowledge while freeing context window space
- **`/clear`**: Removes all history completely (fresh start, no memory of conversation)
- Context window management is critical for long sessions
- Claude Code automatically compacts when approaching context limits
- Compaction preserves: key decisions, code changes made, important findings
- Compaction discards: intermediate reasoning, verbose tool outputs
- Use `/compact` proactively before context gets too large

---

### Lesson 10: Custom commands

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303234

**Key Facts:**
- Custom commands are reusable prompt templates stored as markdown files
- Location: `.claude/commands/` directory in your project
- Filename becomes the command name: `audit.md` becomes `/project:audit`
- Invoke with `/project:commandname` syntax
- `$ARGUMENTS` placeholder in markdown file gets replaced with user input
- Example: `/project:audit $ARGUMENTS` where user provides the file path
- User-level commands: `~/.claude/commands/` (available in all projects)
- Project-level commands: `.claude/commands/` (shared with team via version control)
- Must restart Claude Code after creating new commands for them to appear
- Great for: code review templates, deployment checklists, migration scripts, standardized tasks

---

### Lesson 11: MCP servers with Claude Code

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303239

**Key Facts:**
- MCP (Model Context Protocol) servers extend Claude Code with additional tools and data sources
- Install MCP servers with: `claude mcp add <name> <command> [args...]`
- Example: `claude mcp add postman npx -y @postman/postman-mcp-server`
- MCP servers run locally alongside Claude Code or connect to remote services
- Configuration stored in `.claude/settings.json` or `~/.claude/settings.json`
- Permission pre-approval pattern: add `mcp__<servername>` (double underscore) to allowed permissions
- MCP servers provide: tools (actions), resources (data), and prompts (templates)
- Common MCP servers: file systems, databases, APIs, search engines, documentation
- Servers start automatically when Claude Code launches
- Use `claude mcp list` to see installed servers
- Scope: project-level (`.claude/settings.json`) or user-level (`~/.claude/settings.json`)

---

### Lesson 12: Github integration

**URL:** https://anthropic.skilljar.com/claude-code-in-action/303240

**Key Facts:**
- Claude Code integrates with GitHub workflows for automated code review and PR management
- Use `gh` CLI (GitHub CLI) alongside Claude Code for GitHub operations
- Claude Code can:
  - Create branches, commits, and pull requests
  - Review PRs and provide feedback
  - Resolve merge conflicts
  - Update PR descriptions based on actual changes
- Automated code review: Claude Code can review diffs and suggest improvements
- CI/CD integration: run Claude Code in GitHub Actions for automated tasks
- GitHub Actions workflow: use Claude Code SDK to run tasks in CI pipeline
- PR review workflow: Claude reads the diff, analyzes changes, provides structured feedback
- Can be triggered on PR events (opened, updated) via GitHub Actions
- Best practice: use Claude Code for first-pass reviews, human reviewers for final approval

---

## Section 4: Hooks and the SDK

### Lesson 13: Introducing hooks

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312000

**Key Facts:**
- Hooks let you run commands before or after Claude attempts to use a tool
- Two primary hook types for tool events:
  - **PreToolUse**: Runs BEFORE tool execution -- can block the tool call
  - **PostToolUse**: Runs AFTER tool execution -- cannot block, but can provide feedback to Claude
- Configuration locations (in priority order):
  - Global: `~/.claude/settings.json`
  - Project: `.claude/settings.json`
  - Local: `.claude/settings.local.json`
- `/hooks` command available inside Claude Code to manage hooks interactively
- Applications for hooks:
  - **Code formatting**: Auto-format files after Claude edits them
  - **Testing**: Run tests after code changes
  - **Access control**: Prevent reading sensitive files
  - **Code quality**: Run linters after edits
  - **Logging**: Track tool usage
  - **Validation**: Verify changes meet standards

---

### Lesson 14: Defining hooks

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312002

**Key Facts:**
- 4 steps to define a hook:
  1. Choose Pre or Post (PreToolUse or PostToolUse)
  2. Pick target tools (which tools trigger the hook)
  3. Write the command (shell script or command to execute)
  4. Handle feedback (how to process results)
- Hook command receives JSON via stdin containing:
  - `session_id` -- current session identifier
  - `transcript_path` -- path to conversation transcript
  - `hook_event_name` -- which event triggered (e.g., "PreToolUse")
  - `tool_name` -- which tool is being used (e.g., "Read", "Edit", "Bash")
  - `tool_input` -- the arguments being passed to the tool
- Exit codes determine behavior:
  - **Exit code 0**: Allow -- tool call proceeds normally
  - **Exit code 2**: Block -- tool call is prevented (PreToolUse only)
  - **Exit code 1 or other**: Non-blocking error -- execution continues, error logged
- Stderr output with exit code 2 is sent to Claude as feedback (Claude sees why the tool was blocked)
- Common use case: prevent Claude from reading sensitive files like `.env`

Example hook configuration in settings.json:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "command": "/path/to/check-sensitive-files.sh"
      }
    ]
  }
}
```

Example hook script (block reading .env):
```bash
#!/bin/bash
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path')
if [[ "$file_path" == *".env"* ]]; then
  echo "Blocked: Cannot read .env files" >&2
  exit 2
fi
exit 0
```

---

### Lesson 15: Implementing a hook

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312003

**Key Facts:**
- Walkthrough of building a complete hook from scratch
- Step-by-step implementation of a PreToolUse hook
- Hook script reads JSON from stdin using tools like `jq`
- Parse `tool_name` and `tool_input` to make decisions
- Important: hook scripts must be executable (`chmod +x`)
- Test hooks by triggering the tool and observing behavior
- Debug hooks by checking stderr output and exit codes
- Hook scripts can be in any language (bash, python, node, etc.)
- The hook runs in the same working directory as Claude Code

---

### Lesson 16: Gotchas around hooks

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312423

**Key Facts:**
- **Use absolute paths for scripts** -- this is a security recommendation
  - Relative paths could be exploited if someone puts a malicious script in the project
  - Absolute paths ensure you always run YOUR script, not a project-supplied one
- **Absolute paths make sharing settings.json harder** across different machines
  - Different developers have different home directories and OS layouts
  - A path like `/Users/alice/scripts/hook.sh` won't work on Bob's machine
- **Solution: use `$PWD` placeholder** in a `settings.example.json` template
  - Create `settings.example.json` with `$PWD` placeholder for paths
  - An init/setup script replaces `$PWD` with the actual absolute path
  - Each developer runs the init script to generate their local `settings.json`
- Hook scripts run with the same permissions as the Claude Code process
- Hooks have a default timeout (600 seconds for command hooks)
- Long-running hooks can slow down Claude Code's operation

---

### Lesson 17: Useful hooks!

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312004

**Key Facts:**
- **TypeScript type checking hook**:
  - PostToolUse hook that triggers after every Edit on TypeScript files
  - Runs `tsc --noEmit` to check for type errors without producing output files
  - Feeds any type errors back to Claude as feedback
  - Claude then automatically fixes the type errors it introduced
  - Only monitors critical directories to minimize performance overhead
  - Auto-correction loop: edit -> type check -> fix errors -> type check again

- **Query duplication hook**:
  - More advanced hook that launches a separate Claude instance
  - Uses the Claude Code TypeScript SDK programmatically
  - Reviews code for duplicate database queries or logic
  - Pattern: hook script imports `@anthropic-ai/claude-code` SDK and runs a query
  - The separate Claude instance analyzes the change and reports duplications
  - Demonstrates hooks can be sophisticated, not just simple shell scripts

---

### Lesson 18: Another useful hook

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312427

**Key Facts:**
- Demonstrates additional practical hook patterns
- **Auto-formatting hook**:
  - PostToolUse hook on Edit/Write tools
  - Runs prettier/eslint/black (or your formatter) on changed files
  - Ensures all Claude-written code matches project style
  - Claude doesn't need to know formatting rules -- the hook handles it
- **Test runner hook**:
  - PostToolUse hook that runs relevant tests after code changes
  - Can scope to specific test files based on which source files changed
  - Reports test failures back to Claude for automatic fixing
- Hooks compose well -- you can have multiple hooks on the same event
- All matching hooks run in parallel for performance
- Hook philosophy: automate the checks you'd do manually after every change

---

### Lesson 19: The Claude Code SDK

**URL:** https://anthropic.skilljar.com/claude-code-in-action/312001

**Key Facts:**
- The SDK lets you run Claude Code programmatically from code (not just interactively in terminal)
- Available for TypeScript, Python, and CLI usage
- TypeScript import: `import { query } from "@anthropic-ai/claude-code"`
- Python: `from claude_code import query`
- **Read-only permissions by default** -- Claude cannot modify files unless you explicitly allow it
- Enable write access: `allowedTools: ["Edit", "Write"]` in the query options
- The SDK inherits all settings from the directory it runs in (CLAUDE.md, settings.json, etc.)
- Primary use cases:
  - **Git hooks**: Run Claude Code as a pre-commit hook to review changes
  - **Build scripts**: Integrate AI-powered analysis into build pipelines
  - **CI/CD**: Use in GitHub Actions or other CI systems for automated review
  - **Documentation**: Auto-generate docs from code changes
  - **Custom tooling**: Build your own AI-powered development tools
- SDK query returns structured response with messages and metadata
- Can pass system prompts, tools, and configuration programmatically
- Example TypeScript usage:
```typescript
import { query } from "@anthropic-ai/claude-code";

const result = await query({
  prompt: "Review this code for security issues",
  allowedTools: ["Read", "Glob", "Grep"],
  cwd: "/path/to/project"
});
```

---

## Section 5: Wrapping Up

### Lesson 20: Quiz on Claude Code

**(Skipped -- quiz lesson)**

---

### Lesson 21: Summary and next steps

**URL:** https://anthropic.skilljar.com/claude-code-in-action (section 5)

**Key Facts:**
- Recap of all course topics:
  - What Claude Code is and how it differs from other coding assistants
  - Setting up Claude Code and configuring projects
  - Adding context via CLAUDE.md, memories, and file references
  - Making changes with permission controls and diff review
  - Controlling context with /compact, /clear, escape, and memory
  - Custom commands for reusable workflows
  - MCP servers for extending capabilities
  - GitHub integration for automated workflows
  - Hooks for automated quality checks (PreToolUse and PostToolUse)
  - The Claude Code SDK for programmatic usage
- Next steps: explore the Claude Code documentation, try hooks in your projects, build custom MCP servers
- Encourages building custom commands and hooks tailored to your team's workflow

---

## Quick Reference: All Lesson URLs

| # | Lesson | Section | URL |
|---|--------|---------|-----|
| 1 | Introduction | What is Claude Code? | (course landing page) |
| 2 | What is a coding assistant? | What is Claude Code? | (course landing page) |
| 3 | Claude Code in action | What is Claude Code? | (course landing page) |
| 4 | Claude Code setup | Getting Hands On | https://anthropic.skilljar.com/claude-code-in-action/301614 |
| 5 | Project setup | Getting Hands On | (video lesson) |
| 6 | Adding context | Getting Hands On | https://anthropic.skilljar.com/claude-code-in-action/303241 |
| 7 | Making changes | Getting Hands On | https://anthropic.skilljar.com/claude-code-in-action/303236 |
| 8 | Controlling context | Controlling Context | https://anthropic.skilljar.com/claude-code-in-action/303237 |
| 9 | Custom commands | Controlling Context | https://anthropic.skilljar.com/claude-code-in-action/303234 |
| 10 | MCP servers with Claude Code | Controlling Context | https://anthropic.skilljar.com/claude-code-in-action/303239 |
| 11 | Github integration | Controlling Context | https://anthropic.skilljar.com/claude-code-in-action/303240 |
| 12 | Introducing hooks | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312000 |
| 13 | Defining hooks | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312002 |
| 14 | Implementing a hook | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312003 |
| 15 | Gotchas around hooks | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312423 |
| 16 | Useful hooks! | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312004 |
| 17 | Another useful hook | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312427 |
| 18 | The Claude Code SDK | Hooks and the SDK | https://anthropic.skilljar.com/claude-code-in-action/312001 |
| 19 | Summary and next steps | Wrapping Up | (course landing page) |

---

## Key Concepts Summary

### Hooks System
- **PreToolUse**: Runs before tool execution; exit code 0 = allow, exit code 2 = block
- **PostToolUse**: Runs after tool execution; provides feedback but cannot block
- Hook commands receive JSON via stdin with session_id, tool_name, tool_input, etc.
- Stderr with exit code 2 is sent to Claude as feedback
- Use absolute paths for hook scripts (security)
- Hooks run in parallel when multiple match
- All matching hooks from all config levels are merged

### Context Management
- CLAUDE.md: always-on project instructions (loaded every session)
- `#` command: quick persistent memories
- `/compact`: summarize conversation to free context
- `/clear`: fresh start, no conversation history
- Escape: stop generation; Double Escape: rewind last turn

### Custom Commands
- `.claude/commands/` directory with markdown files
- Filename = command name (`audit.md` -> `/project:audit`)
- `$ARGUMENTS` placeholder for user input
- Restart required after creating new commands

### MCP Integration
- `claude mcp add <name> <command>` to install
- Permission pre-approval: `mcp__<servername>` pattern
- Configured in settings.json (project or user level)

### SDK
- TypeScript: `import { query } from "@anthropic-ai/claude-code"`
- Read-only by default; opt-in to write tools
- Inherits settings from working directory
- Use for: git hooks, CI/CD, build scripts, custom tooling

### GitHub Integration
- Works with `gh` CLI for GitHub operations
- Can create branches, commits, PRs, and review code
- CI/CD via GitHub Actions with Claude Code SDK
- Automated first-pass code review on PR events
