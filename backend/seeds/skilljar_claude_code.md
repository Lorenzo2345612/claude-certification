# Skilljar Course Notes: Claude Code, Subagents, and Agent Skills

Scraped from Anthropic Academy (Skilljar) on 2026-04-18.

---

## COURSE: Claude Code in Action

Course URL: https://anthropic.skilljar.com/claude-code-in-action
21 lessons covering practical Claude Code usage.

---

### Lesson: What is a coding assistant?
URL: https://anthropic.skilljar.com/claude-code-in-action/303235

- A coding assistant uses language models to tackle complex programming tasks by: (1) gathering context, (2) formulating a plan, (3) taking action
- Language models by themselves can only process text and return text -- they cannot actually read files or run commands
- Coding assistants solve this with "tool use" -- they add instructions to messages that teach the LM how to request actions
- Tool use flow: user asks question -> coding assistant adds tool instructions -> LM responds with tool request (e.g., "ReadFile: main.go") -> assistant executes tool -> sends result back to model -> model provides final answer
- The Claude series of models (Opus, Sonnet, and Haiku) are particularly strong at understanding what tools do and using them effectively
- Benefits of strong tool use: tackles harder tasks, extensible platform (you can add new tools), better security (no codebase indexing required, avoids sending entire codebase to external servers)
- Claude Code can navigate codebases without requiring indexing

### Lesson: Claude Code in action
URL: https://anthropic.skilljar.com/claude-code-in-action/303242

- Claude Code comes with a comprehensive set of built-in tools that handle common development tasks: reading files, writing code, running commands, and managing directories
- What makes Claude Code powerful is how intelligently it combines these tools to tackle complex, multi-step problems

### Lesson: Claude Code setup
URL: https://anthropic.skilljar.com/claude-code-in-action/301614

- Install Claude Code:
  - MacOS (Homebrew): `brew install --cask claude-code`
  - MacOS, Linux, WSL: `curl -fsSL https://claude.ai/install.sh | bash`
  - Windows CMD: `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd`
- After installation, run `claude` at your terminal. First time will prompt authentication
- Special directions for AWS Bedrock: https://code.claude.com/docs/en/amazon-bedrock
- Special directions for Google Cloud Vertex: https://code.claude.com/docs/en/google-vertex-ai

### Lesson: Project setup
URL: https://anthropic.skilljar.com/claude-code-in-action/301615

- The example project in the course is a UI generation app
- Project setup requires Node JS installed locally
- Run `npm run setup` to install dependencies and set up a local SQLite database
- The app uses Claude through the Anthropic API to generate UI components
- If no API key is provided, the app generates static fake code
- Start the project with `npm run dev`

### Lesson: Adding context
URL: https://anthropic.skilljar.com/claude-code-in-action/303241

- Too much irrelevant context actually decreases Claude's performance
- The `/init` command tells Claude to analyze the entire codebase and creates a CLAUDE.md file summarizing: project purpose/architecture, important commands, critical files, coding patterns
- When Claude asks for permission to create CLAUDE.md, press Enter to approve each write, or press Shift+Tab to let Claude write files freely throughout the session
- The CLAUDE.md file gets included in every request to Claude -- like a persistent system prompt for your project
- Three CLAUDE.md file locations:
  - `CLAUDE.md` -- generated with /init, committed to source control, shared with team
  - `CLAUDE.local.md` -- NOT shared, contains personal instructions/customizations
  - `~/.claude/CLAUDE.md` -- used with ALL projects on your machine, contains global instructions
- Use the `#` command to enter "memory mode" to edit CLAUDE.md files (e.g., `# Use comments sparingly. Only comment complex code.`)
- Claude will merge the instruction into CLAUDE.md automatically
- Use `@` symbol followed by file path to include file contents in your request (e.g., `How does the auth system work? @auth`)
- You can mention files directly in CLAUDE.md using @ syntax -- those file contents are automatically included in every request

### Lesson: Making changes
URL: https://anthropic.skilljar.com/claude-code-in-action/303236

- Paste screenshots into Claude using Ctrl+V (not Cmd+V on macOS)
- Planning Mode: enabled by pressing Shift+Tab twice (or once if already auto-accepting edits)
- In Planning Mode, Claude will: read more files, create a detailed implementation plan, show you what it intends to do, wait for your approval
- Thinking modes (progressively more tokens for deeper analysis):
  - "Think" -- basic reasoning
  - "Think more" -- extended reasoning
  - "Think a lot" -- comprehensive reasoning
  - "Think longer" -- extended time reasoning
  - "Ultrathink" -- maximum reasoning capability
- Planning Mode is best for: tasks requiring broad understanding of codebase, multi-step implementations, changes affecting multiple files
- Thinking Mode is best for: complex logic problems, debugging difficult issues, algorithmic challenges
- Both features consume additional tokens -- there is a cost consideration

### Lesson: Controlling context
URL: https://anthropic.skilljar.com/claude-code-in-action/303237

- Press Escape to stop Claude mid-response and redirect the conversation
- Combine Escape with the `#` shortcut to add a memory about the correct approach -- prevents repeated errors in future conversations
- Press Escape TWICE to rewind the conversation -- shows all sent messages, lets you jump back to an earlier point
- `/compact` command: summarizes entire conversation history while preserving key information Claude has learned. Use when Claude has gained valuable knowledge and you want to maintain it
- `/clear` command: completely removes conversation history, giving a fresh start. Use when switching to a completely different, unrelated task

### Lesson: Custom commands
URL: https://anthropic.skilljar.com/claude-code-in-action/303234

- Create custom commands by: (1) find the `.claude` folder, (2) create a `commands` directory, (3) create a markdown file with desired command name (e.g., `audit.md` creates `/audit` command)
- The filename becomes the command name
- After creating a command file, you MUST restart Claude Code for it to recognize the new command
- Custom commands can accept arguments using the `$ARGUMENTS` placeholder
- Example: a `write_tests.md` command with `$ARGUMENTS` can be invoked as `/write_tests the use-auth.ts file in the hooks directory`
- Arguments can be any string, not just file paths

### Lesson: MCP servers with Claude Code
URL: https://anthropic.skilljar.com/claude-code-in-action/303239

- Add MCP servers to Claude Code with: `claude mcp add playwright npx @playwright/mcp@latest`
- This names the MCP server "playwright" and provides the command to start it locally
- To pre-approve MCP server tools (avoid permission prompts), edit `.claude/settings.local.json`:
  ```json
  {
    "permissions": {
      "allow": ["mcp__playwright"],
      "deny": []
    }
  }
  ```
- Note the DOUBLE underscores in `mcp__playwright`
- With Playwright MCP, Claude can open a browser, navigate to your app, generate components, analyze visual styling, and update prompts based on what it observes
- MCP ecosystem includes servers for: database interactions, API testing, file system operations, cloud service integrations, development tool automation

### Lesson: Github integration
URL: https://anthropic.skilljar.com/claude-code-in-action/303240

- Run `/install-github-app` in Claude to set up the GitHub integration
- The integration provides two main workflows:
  - **Mention Action**: Mention Claude with `@claude` in any issue or PR; Claude analyzes, creates a plan, executes, and responds
  - **Pull Request Action**: Automatically reviews PRs when created; posts a detailed report
- Customization options in workflow files:
  - Add project setup steps (e.g., `npm run setup`)
  - Provide custom instructions about your project
  - Configure MCP servers
  - Define tool permissions
- Tool permissions in GitHub Actions: you MUST explicitly list ALL allowed tools -- no shortcut unlike local development
- Format: `allowed_tools: "Bash(npm:*),Bash(sqlite3:*),mcp__playwright__browser_snapshot,..."`
- Each tool from each MCP server must be individually listed

### Lesson: Introducing hooks
URL: https://anthropic.skilljar.com/claude-code-in-action/312000

- Hooks allow you to run commands before or after Claude attempts to run a tool
- Two main types:
  - **PreToolUse hooks** -- run BEFORE a tool is called; can BLOCK the tool call
  - **PostToolUse hooks** -- run AFTER a tool is called; CANNOT block (already happened)
- Hooks defined in Claude settings files:
  - Global: `~/.claude/settings.json` (affects all projects)
  - Project: `.claude/settings.json` (shared with team)
  - Project (not committed): `.claude/settings.local.json` (personal settings)
- Can write hooks by hand or use the `/hooks` command inside Claude Code
- PreToolUse hook: matcher specifies which tool types to target; command receives details and can allow/block
- PostToolUse hook: can run follow-up operations (like formatting) or provide additional feedback to Claude
- Matcher uses pipe `|` for OR: e.g., `"matcher": "Write|Edit|MultiEdit"`
- Common hook uses: code formatting, testing, access control, code quality (linters/type checkers), logging, validation

### Lesson: Defining hooks
URL: https://anthropic.skilljar.com/claude-code-in-action/312002

- Four steps to build a hook: (1) decide Pre or Post, (2) determine which tools to watch, (3) write a command that receives the tool call, (4) provide feedback to Claude
- Hook receives JSON data through stdin:
  ```json
  {
    "session_id": "...",
    "transcript_path": "...",
    "hook_event_name": "PreToolUse",
    "tool_name": "Read",
    "tool_input": { "file_path": "/code/queries/.env" }
  }
  ```
- Exit codes:
  - Exit Code 0: allow the tool call to proceed
  - Exit Code 2: BLOCK the tool call (PreToolUse hooks only)
- When exiting with code 2, error messages written to stderr are sent to Claude as feedback

### Lesson: Implementing a hook
URL: https://anthropic.skilljar.com/claude-code-in-action/312003

- Example: preventing Claude from reading .env files
- Configure in `.claude/settings.local.json` with `"matcher": "Read|Grep"` (catches both read and grep)
- The hook script reads tool call data from stdin, parses JSON, checks if path contains `.env`
- After saving configuration and hook script, RESTART Claude Code for changes to take effect
- Same protection works for both Read and Grep operations

### Lesson: Gotchas around hooks
URL: https://anthropic.skilljar.com/claude-code-in-action/312423

- Security recommendation: use ABSOLUTE paths (not relative) for hook scripts to mitigate path interception and binary planting attacks
- Using absolute paths makes sharing settings.json files challenging (paths differ per machine)
- Solution pattern: use a `settings.example.json` with `$PWD` placeholders, then a setup script replaces with actual absolute paths and copies to `settings.local.json`

### Lesson: Useful hooks!
URL: https://anthropic.skilljar.com/claude-code-in-action/312004

- TypeScript type checking hook: runs `tsc --noEmit` after every file edit; captures errors and feeds them back to Claude immediately
- This addresses a common problem: when Claude modifies a function signature, it often doesn't update all call sites
- For untyped languages, implement similar functionality using automated tests
- Query duplication prevention hook: launches a SEPARATE instance of Claude Code programmatically to review changes and check for similar existing queries
- The query duplication hook uses Claude's TypeScript SDK
- Trade-off consideration: query duplication hook requires additional time and API usage; only monitor critical directories

### Lesson: Another useful hook
URL: https://anthropic.skilljar.com/claude-code-in-action/312427

- Additional hook types beyond PreToolUse and PostToolUse:
  - **Notification** -- runs when Claude Code sends a notification (permission needed or idle for 60 seconds)
  - **Stop** -- runs when Claude Code has finished responding
  - **SubagentStop** -- runs when a subagent ("Task" in UI) has finished
  - **PreCompact** -- runs before a compact operation (manual or automatic)
  - **UserPromptSubmit** -- runs when user submits a prompt, before Claude processes it
  - **SessionStart** -- runs when starting or resuming a session
  - **SessionEnd** -- runs when a session ends
- The stdin input differs based on hook type AND the tool that was called
- Debugging tip: use a helper hook with `"matcher": "*"` and command `"jq . > post-log.json"` to capture and inspect stdin input

### Lesson: The Claude Code SDK
URL: https://anthropic.skilljar.com/claude-code-in-action/312001

- SDK available for TypeScript, Python, and CLI
- Runs the exact same Claude Code with access to all the same tools
- Inherits all settings from Claude Code instances in the same directory
- **Read-only permissions by default** -- can read files, search, grep, but cannot write, edit, or create files
- To enable write permissions, add `allowedTools` option:
  ```typescript
  import { query } from "@anthropic-ai/claude-code";
  for await (const message of query({
    prompt,
    options: { allowedTools: ["Edit"] }
  })) { ... }
  ```
- Can also configure permissions in `.claude` directory settings file
- Use cases: git hooks for code review, build scripts, helper commands, automated documentation, CI/CD code quality checks

---

## COURSE: Introduction to Subagents

Course URL: https://anthropic.skilljar.com/introduction-to-subagents
4 lessons covering subagent architecture and usage.

---

### Lesson: What are subagents?
URL: https://anthropic.skilljar.com/introduction-to-subagents/450698

- Subagents are specialized assistants that Claude Code delegates tasks to, each running in its own conversation context window
- Subagent receives two things: (1) a custom system prompt from config, (2) a task description written by the parent agent
- When done, only a SUMMARY comes back to the main conversation; the entire subagent conversation is then DISCARDED
- Main context stays clean -- you get the answer without the noise of the journey
- Tradeoff: you lose visibility into how the subagent reached its conclusions
- Built-in subagents:
  - **General purpose** -- for multi-step tasks requiring both exploration and action
  - **Explore** -- for fast searching and navigation of codebases
  - **Plan** -- used during plan mode for research and analysis before presenting a plan
- You can create custom subagents with custom system prompts and tool access

### Lesson: Creating a subagent
URL: https://anthropic.skilljar.com/introduction-to-subagents/450699

- Use the `/agents` slash command to manage subagents; select "Create new agent"
- Scope options: Project-level (current project only) or User-level (all projects)
- Recommended approach: let Claude generate the subagent config (name, description, system prompt)
- Tool categories: Read-only tools, Execution tools, Other tools
- Model options: Haiku (fast/lightweight), Sonnet (middle ground), Opus (complex analysis), Inherit (uses main conversation model)
- Config file saved to `.claude/agents/your-agent-name.md`
- Config structure (YAML frontmatter):
  ```yaml
  name: code-quality-reviewer
  description: Use this agent when you need to review...
  tools: Bash, Glob, Grep, Read, WebFetch, WebSearch
  model: sonnet
  color: purple
  ```
- **name** -- unique identifier; reference with `@agent code-quality-reviewer`
- **description** -- controls WHEN Claude decides to use the subagent; MUST be a single line
- **tools** -- which tools the subagent can access
- **model** -- sonnet, opus, haiku, or inherit
- **color** -- UI color for identification
- Body of markdown (below frontmatter) = system prompt
- To make Claude delegate AUTOMATICALLY: include the word "proactively" in the description field
- Add example conversations to the description for better matching

### Lesson: Designing effective subagents
URL: https://anthropic.skilljar.com/introduction-to-subagents/450700

- Name and description of every available subagent are included in the system prompt of the main agent
- The description shapes both WHEN a subagent is triggered AND the input prompt written by the main agent
- Writing specific descriptions (e.g., "You must tell the agent precisely which files you want it to review") produces more targeted input prompts
- **Defining an output format is the single most important improvement** -- it creates natural stopping points and prevents running too long
- Without a defined output, subagents struggle to decide when enough research has been done
- Include an "Obstacles Encountered" section in the output format to surface workarounds, setup issues, commands needing special flags
- Limit tool access based on subagent type:
  - Research/read-only: Glob, Grep, Read only
  - Code reviewer: add Bash (for git diff) but no Edit/Write
  - Code modification agent: gets Edit and Write access

### Lesson: Using subagents effectively
URL: https://anthropic.skilljar.com/introduction-to-subagents/450701

- Decision rule: if intermediate work doesn't matter (just need the result), delegate to subagent; if you need to see/react to what's happening, keep in main thread
- Subagents excel at:
  - **Research tasks** -- exploring unfamiliar codebases, tracing function calls; main thread gets clean summary
  - **Code reviews** -- Claude reviews code more effectively when presented as authored by someone else (fresh context)
  - **Custom system prompts** -- e.g., copywriting subagent with different tone/voice instructions; styling subagent pointed at design system files
- Anti-patterns (when subagents HURT):
  - **Expert claims** -- "you are a Python expert" adds NO value; Claude already has that knowledge
  - **Sequential pipelines** -- multi-agent flows where each step depends on the previous (information gets lost in handoffs); bug-fixing pipelines always fail this way
  - **Test runners** -- subagents that return "tests failed" hide information you need for debugging; testing has shown test runner pattern performed WORST among all configurations

---

## COURSE: Introduction to Agent Skills

Course URL: https://anthropic.skilljar.com/introduction-to-agent-skills
6 lessons covering skills creation, configuration, sharing, and troubleshooting.

---

### Lesson: What are skills?
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434525

- Skills are folders of instructions that Claude Code can discover and use to handle tasks more accurately
- Each skill lives in a SKILL.md file with name and description in frontmatter
- Claude uses the description to match skills to requests via semantic matching
- Personal skills: `~/.claude/skills` (follow you across all projects). On Windows: `C:/Users/<your-user>/.claude/skills`
- Project skills: `.claude/skills` inside root of repository (shared via version control)
- Skills load ON DEMAND -- unlike CLAUDE.md (loads into every conversation) or slash commands (require explicit invocation)
- Skills activate AUTOMATICALLY when Claude recognizes the situation
- Rule of thumb: if you find yourself explaining the same thing to Claude repeatedly, that's a skill waiting to be written

### Lesson: Creating your first skill
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434527

- Create skill directory: `mkdir -p ~/.claude/skills/pr-description`
- Create SKILL.md inside with frontmatter (name, description) and instructions below
- Claude Code loads skills at startup -- RESTART your session after creating one
- Skill matching: Claude compares your message against descriptions of all available skills
- Confirmation prompt: Claude asks you to confirm loading the skill before reading full SKILL.md
- Skill priority hierarchy (for name conflicts):
  1. **Enterprise** -- managed settings, highest priority
  2. **Personal** -- `~/.claude/skills`
  3. **Project** -- `.claude/skills` inside a repository
  4. **Plugins** -- installed plugins, lowest priority
- To avoid conflicts, use descriptive names (e.g., "frontend-review" not just "review")
- To update a skill: edit its SKILL.md. To remove: delete its directory. Always restart Claude Code.

### Lesson: Configuration and multi-file skills
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434526

- Skill metadata fields:
  - **name** (required) -- lowercase letters, numbers, hyphens only. Max 64 characters. Should match directory name
  - **description** (required) -- max 1,024 characters. Most important field for matching
  - **allowed-tools** (optional) -- restricts which tools Claude can use when skill is active
  - **model** (optional) -- specifies which Claude model to use
- A good description answers: What does the skill do? When should Claude use it?
- Example with allowed-tools restriction:
  ```yaml
  name: codebase-onboarding
  description: Helps new developers understand the system works.
  allowed-tools: Read, Grep, Glob, Bash
  model: sonnet
  ```
- If you omit allowed-tools entirely, the skill doesn't restrict anything
- Progressive disclosure: keep SKILL.md under 500 lines; link to supporting files (references, scripts, assets) that Claude reads only when needed
- Directory structure: `scripts/`, `references/`, `assets/`
- Scripts execute without loading their contents into context -- only the OUTPUT consumes tokens
- Key instruction: tell Claude to RUN the script, not READ it

### Lesson: Skills vs. other Claude Code features
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434528

- **CLAUDE.md vs Skills**: CLAUDE.md loads into EVERY conversation (always-on standards). Skills load ON DEMAND (task-specific expertise)
- **Skills vs Subagents**: Skills ADD KNOWLEDGE to current conversation. Subagents run in a SEPARATE context with isolated execution
- **Skills vs Hooks**: Hooks are EVENT-DRIVEN (fire on file saves, tool calls). Skills are REQUEST-DRIVEN (activate based on what you're asking)
- **MCP servers**: provide external tools and integrations -- different category entirely from skills
- Typical setup combines: CLAUDE.md (always-on standards) + Skills (on-demand expertise) + Hooks (automated event-driven operations) + Subagents (isolated delegated work) + MCP (external tools)

### Lesson: Sharing skills
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434529

- Three distribution methods:
  1. **Repository commits** -- place in `.claude/skills`, shared via Git clone
  2. **Plugins** -- distribute across repositories via marketplaces
  3. **Enterprise managed settings** -- deploy organization-wide with highest priority
- Enterprise managed settings support `strictKnownMarketplaces` to control where plugins can be installed from
- **Subagents do NOT automatically see skills** -- you must explicitly list them in the subagent's frontmatter `skills` field
- **Built-in agents (Explorer, Plan, Verify) CANNOT access skills at all** -- only custom subagents in `.claude/agents` can
- Custom subagent with skills example:
  ```yaml
  name: frontend-security-accessibility-reviewer
  tools: Bash, Glob, Grep, Read, WebFetch, WebSearch, Skill...
  model: sonnet
  color: blue
  skills: accessibility-audit, performance-check
  ```
- Skills are loaded when the subagent STARTS, not on demand

### Lesson: Troubleshooting skills
URL: https://anthropic.skilljar.com/introduction-to-agent-skills/434530

- Start with the skills validator tool (agent skills verifier command)
- **Not triggering?** Almost always the description -- add trigger phrases matching how you phrase requests
- **Not loading?** Check: SKILL.md must be inside a NAMED directory (not at skills root); file name must be exactly `SKILL.md` (all caps "SKILL", lowercase "md")
- Use `claude --debug` to see loading errors
- **Wrong skill used?** Descriptions are too similar -- make them more distinct
- **Priority conflicts**: enterprise skill with same name overrides personal skill. Options: rename your skill or talk to admin
- **Plugin skills not appearing**: clear cache, restart Claude Code, reinstall
- **Runtime errors**: check dependencies (must be installed), permissions (`chmod +x` on scripts), path separators (use forward slashes everywhere, even on Windows)
