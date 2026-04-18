# CCA Training System Validation Report

> **Date**: 2026-04-17
> **Validated Against**: Official Anthropic documentation (platform.claude.com, code.claude.com, modelcontextprotocol.io, anthropic.com/engineering) + Anthropic Academy Skilljar courses
> **Scope**: Exam guide, 319 questions (questions.json), 36 learn topics (learn_topics.json), research files, frontend components

---

## Executive Summary

Your training system is **largely accurate** — the research layer (`research/` files) is well-maintained and captures most recent API changes. However, there are **14 issues** ranging from outdated terminology to missing concepts that need attention. The most critical issues are in the questions/learn topics that haven't been fully updated to match the research files.

**Breakdown:**
- 🔴 **HIGH severity** (wrong information taught): 3 issues
- 🟡 **MEDIUM severity** (outdated/incomplete): 6 issues
- 🟢 **LOW severity** (terminology/minor gaps): 5 issues

---

## 🔴 HIGH SEVERITY — Incorrect or Outdated Information

### H1. "AgentDefinition" presented as a formal API type

**Where**: `questions.json` (~10 questions), `learn_topics.json` (d1-subagent-config)

**Problem**: Multiple questions reference "AgentDefinition" as if it's a named type/interface with specific fields (e.g., "the 7 fields of AgentDefinition," "the 'context' field of AgentDefinition," "tools is not a required field of AgentDefinition"). 

**Reality**: There is **no type called AgentDefinition** in the official docs. Subagents are defined via **Markdown files with YAML frontmatter** in `.claude/agents/` directories. The frontmatter has **16 fields** (not 7), with only `name` and `description` required:

| Field | Required | Description |
|-------|----------|-------------|
| name | Yes | Unique identifier |
| description | Yes | When to delegate to this subagent |
| tools | No | Tool allowlist (inherits all if omitted) |
| disallowedTools | No | Tool denylist |
| model | No | sonnet, opus, haiku, or inherit |
| permissionMode | No | default, acceptEdits, auto, etc. |
| maxTurns | No | Max agentic turns |
| skills | No | Preloaded skills |
| mcpServers | No | MCP server references |
| hooks | No | Lifecycle hooks |
| memory | No | Persistent memory scope |
| background | No | Background task flag |
| effort | No | low, medium, high, max |
| isolation | No | worktree for git isolation |
| color | No | Display color |
| initialPrompt | No | Initial prompt text |

**Fix needed**: Update all questions to refer to "subagent frontmatter configuration" or "subagent definition" (lowercase). Update field count from 7 to 16. Update required fields to `name` + `description` (not `description` + `prompt`).

---

### H2. Several questions still reference "Task tool" instead of "Agent tool"

**Where**: `questions.json` — questions mentioning "Task tool" in question text, options, and explanations

**Problem**: The Task tool was **renamed to Agent** in version 2.1.63. While "Task" still works as an alias, teaching the stale name means candidates may not recognize "Agent tool" on the exam.

**Specific instances found**:
- "The coordinator uses the Task tool to spawn subagents..."
- "Spawning parallel subagents by emitting multiple Task tool calls..."
- "Your research system has a coordinator with access to the Task tool..."
- "Use the Explore subagent (Task tool)..."

**Fix needed**: Replace "Task tool" with "Agent tool" in all question text, options, and explanations. Add a note that "Task" is a legacy alias.

---

### H3. Exam guide references "AgentDefinition configuration" — but this term is used by the exam itself

**Where**: Exam guide PDF page 6: "The AgentDefinition configuration including descriptions, system prompts, and tool restrictions for each subagent type"

**Nuance**: Since the exam guide itself uses "AgentDefinition," questions using this term may be **intentionally aligned with the exam**. However, the field list is still wrong (7 vs 16, "prompt" field vs actual fields).

**Recommendation**: Keep "AgentDefinition" as terminology if it matches the exam, but update the field list to match reality.

---

## 🟡 MEDIUM SEVERITY — Incomplete or Needs Update

### M1. Transport terminology: "HTTP" should be "Streamable HTTP"

**Where**: `learn_topics.json` (d2-mcp-config), `questions.json` (transport questions)

**Problem**: Content says "HTTP (recommended)" but the official MCP spec calls it **"Streamable HTTP"** — a specific protocol that differs from plain HTTP:
- Supports session management via `Mcp-Session-Id` header
- Replaces the deprecated SSE transport
- Can operate in stateless mode for scalability

**Fix needed**: Update "HTTP" references to "Streamable HTTP" where referring to MCP transport.

---

### M2. @import syntax inconsistency

**Where**: `learn_topics.json` — verify all content uses `@path/to/file` not `@import path`

**Correct syntax**: `@path/to/file` (the `@` prefix directly precedes the path)
```text
See @README for project overview and @package.json for available npm commands.
```

**Additional facts to include**:
- Relative paths resolve relative to **the file containing the import**, not the working directory
- Recursive imports supported up to **5 hops** depth
- Imported files trigger a one-time approval dialog

---

### M3. Commands → Skills merger not documented

**Where**: `learn_topics.json` — commands-related topics

**Current state**: Custom commands (`.claude/commands/`) have been **merged into skills**. Both `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` create `/deploy` and work identically. Existing command files keep working, but skills are the recommended approach going forward.

**Fix needed**: Update learn topics to mention this merger.

---

### M4. CLAUDE.md hierarchy missing CLAUDE.local.md and managed policy

**Where**: `learn_topics.json` (d3-claude-md)

**Current content** describes 3 levels: user, project, directory.

**Complete hierarchy** (4 scopes):
1. **Managed policy**: OS-specific paths (e.g., `/Library/Application Support/ClaudeCode/CLAUDE.md`) — cannot be excluded
2. **Project**: `./CLAUDE.md` or `./.claude/CLAUDE.md` — shared via source control
3. **User**: `~/.claude/CLAUDE.md` — personal, all projects
4. **Local**: `./CLAUDE.local.md` — personal, current project, gitignored

**Additional behavior to document**:
- Files walk UP the directory tree from cwd
- All discovered files are concatenated, not overriding
- `CLAUDE.local.md` is appended AFTER `CLAUDE.md` within each directory
- HTML comments stripped before injection (except inside code blocks)

---

### M5. SKILL.md frontmatter fields incomplete

**Where**: `learn_topics.json` (d3-skills)

**Currently documented**: context, allowed-tools, argument-hint (3 fields)

**Complete frontmatter** (14+ fields):

| Field | Description |
|-------|-------------|
| name | Display name (overrides directory name) |
| description | What the skill does |
| context | `fork` to run in isolated subagent |
| allowed-tools | Tools permitted without prompts |
| argument-hint | Hint shown during autocomplete |
| when_to_use | When Claude should auto-invoke |
| disable-model-invocation | Prevent Claude from auto-invoking |
| user-invocable | Whether user can invoke via slash command |
| model | Model override (sonnet, opus, haiku) |
| effort | Reasoning effort level |
| agent | Agent definition reference |
| hooks | Lifecycle hooks scoped to skill |
| paths | Glob patterns for conditional activation |
| shell | Shell for Bash tool (bash, zsh, fish) |

---

### M6. Extended thinking effort level `xhigh` missing

**Where**: `learn_topics.json` (d4-adaptive-thinking), `questions.json`

**Currently documented**: low, medium, high, max

**Complete effort levels**: low, medium, high, **xhigh**, max

**Fix needed**: Add `xhigh` to effort level documentation.

---

## 🟢 LOW SEVERITY — Terminology or Minor Gaps

### L1. "Hub-and-spoke" vs "orchestrator-workers" terminology

**Where**: `learn_topics.json`, `questions.json` (multiple references)

**Status**: The exam guide itself uses "hub-and-spoke," so this is **acceptable for exam preparation** even though official Anthropic docs use "orchestrator-workers." No fix needed, but consider adding a note that these are equivalent terms.

---

### L2. "Lost in the middle" vs "context rot"

**Where**: `learn_topics.json` (d5-context-windows), `questions.json`

**Status**: The exam guide uses "lost in the middle." Official docs use **"context rot"** as the broader term. Your questions already quote "context rot" from the docs in some places. Both terms appear, which is appropriate since "lost in the middle" is a well-known ML concept that the exam guide explicitly references.

**Recommendation**: Keep both terms but note that "context rot" is Anthropic's official terminology.

---

### L3. stop_reason — exam focuses on tool_use/end_turn but 6 exist

**Where**: `learn_topics.json` (d1-agentic-loop)

**Status**: Your research files already document all 6 values. The exam guide primarily focuses on `tool_use` and `end_turn` for the agentic loop, which is correct. Ensure questions don't imply these are the ONLY values.

---

### L4. Tool use pricing not documented

**Where**: Not in learn topics

**Fact**: Tool use has specific token costs:
- Tool descriptions: counted as input tokens
- Tool use blocks: counted as output tokens  
- Tool results: counted as input tokens
- The `tools` parameter adds tokens even when tools aren't called

**Recommendation**: Low priority since pricing is out-of-scope per the exam guide.

---

### L5. Subagent nesting — technical vs architectural

**Where**: `questions.json` — question about sub-subagents

**Current answer**: "No, because the Task tool cannot be used by subagents — it only works in the main context"

**Corrected fact**: Subagents **cannot** spawn other subagents — this is enforced. The Agent tool is simply not available to subagents. The question's correct answer is right, but option D's explanation ("Task tool can be given to subagents, but it should not be for architectural design reasons, not because of technical limitations") is **WRONG** — it IS a technical limitation, not just an architectural preference.

---

## Validated As Correct ✅

The following claims in your training system were **confirmed accurate** against official docs:

| Topic | Status |
|-------|--------|
| Agentic loop lifecycle (stop_reason check, tool_result flow) | ✅ Correct |
| tool_choice: 4 options (auto/any/tool/none) | ✅ Already in learn_topics |
| MCP 3 primitives (Tools/Resources/Prompts) | ✅ Correct |
| MCP isError flag pattern | ✅ Correct |
| Hook exit codes (0=success, 1=non-blocking, 2=blocking) | ✅ Correct |
| Hook event types (26 types) | ✅ Correct |
| CLI flags (-p, --output-format, --json-schema, etc.) | ✅ Correct |
| .claude/rules/ with YAML frontmatter paths | ✅ Correct |
| Plan mode vs direct execution | ✅ Correct |
| Explore subagent (Haiku, read-only) | ✅ Correct |
| Adaptive thinking (type: "adaptive" + effort) | ✅ Correct |
| budget_tokens deprecated on Opus 4.6+ | ✅ Correct |
| output_config.format with json_schema | ✅ Already in questions |
| strict: true + additionalProperties: false | ✅ Correct |
| Message Batches API (50%, 24h, no SLA) | ✅ Correct |
| Batch API no multi-turn tool calling | ✅ Correct |
| custom_id for batch correlation | ✅ Correct |
| Few-shot prompting best practices (3-5 examples) | ✅ Correct |
| Context rot / progressive summarization | ✅ Correct |
| Scratchpad file pattern | ✅ Correct |
| Session management (--resume, --fork-session, --name) | ✅ Correct |
| Prompt chaining / routing / parallelization patterns | ✅ Correct |
| MCP env var expansion (${VAR}, ${VAR:-default}) | ✅ Correct |
| MCP server scoping (3 scopes) | ✅ Correct |
| SSE deprecated, HTTP recommended | ✅ Correct |
| Tool_choice restrictions with extended thinking (auto/none only) | ✅ Correct |
| Domain weights (27/18/20/20/15) | ✅ Matches exam guide |

---

## New Knowledge from Official Docs (Not in Training System)

These facts from the official documentation are **not currently covered** in your questions or learn topics but are exam-relevant:

### From D1 (Agentic Architecture):
1. **Server-executed tools**: `web_search`, `web_fetch`, `code_execution`, `tool_search` — use `server_tool_use` blocks with `srvtoolu_` prefix. You NEVER construct a `tool_result` for these.
2. **Anthropic-schema tools**: `bash`, `text_editor`, `computer`, `memory` — Anthropic publishes schema, you execute. "Trained-in" for better reliability.
3. **pause_turn handling**: Re-send conversation including paused response as-is.
4. **Parallel tool use**: `disable_parallel_tool_use` boolean in tool_choice. Format: each `tool_result` must have matching `tool_use_id`.
5. **Agent Teams**: Experimental feature for parallel agents communicating across sessions (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1).

### From D2 (Tool Design & MCP):
6. **MCP Sampling**: Server can request LLM access through the client — no API keys needed on server.
7. **MCP Roots**: Permission system for file access; SDK does NOT auto-enforce restrictions.
8. **MCP Handshake**: Required 3-step sequence (Initialize Request → Initialize Result → Initialized Notification).
9. **Managed MCP**: `managed-mcp.json` for org-wide MCP server policy control.
10. **Tool input_examples**: New feature for providing example inputs to improve tool calling accuracy.

### From D3 (Claude Code):
11. **Auto memory**: Separate from CLAUDE.md — Claude writes these. First 200 lines or 25KB loaded per session.
12. **Skill content lifecycle**: 5,000 token / 25,000 budget compaction thresholds.
13. **Dynamic context injection**: `!` syntax in SKILL.md for shell command output injection.
14. **GitHub Actions**: `@claude` trigger for PR reviews, v1 action parameters.

### From D4 (Prompt Engineering):
15. **Structured output complexity limits**: 20 strict tools, 24 optional params, 16 unions, 180s compilation timeout.
16. **Batch API limits**: 100k requests or 256MB per batch. Results available for 29 days.
17. **Extended output beta**: Batch API supports up to 300k output tokens per request.

### From D5 (Context Management):
18. **Context awareness tags**: `<context_window_remaining>`, `<token_budget>` XML tags available in some contexts.
19. **Compaction API**: Beta feature with `anthropic-beta: interleaved-thinking-2025-05-14` header, configurable triggers.

---

## Documentation Files Created

| File | Lines | Domain |
|------|-------|--------|
| `d1-agentic-architecture-official.md` | 1,108 | D1: Agentic Architecture (27%) |
| `d2-tool-design-mcp-official.md` | 894 | D2: Tool Design & MCP (18%) |
| `d3-claude-code-config-official.md` | 1,071 | D3: Claude Code Config (20%) |
| `d4-prompting-structured-output-official.md` | 937 | D4: Prompt Engineering (20%) |
| `d5-context-reliability-official.md` | 788 | D5: Context & Reliability (15%) |
| **Total** | **4,798** | All 5 domains |

These files serve as the **ground truth reference** for validating all 319 questions and 36 learn topics.

---

## Recommended Priority Actions

1. **[HIGH]** Fix "AgentDefinition" references — update field count, required fields, and terminology
2. **[HIGH]** Replace "Task tool" → "Agent tool" in all question text
3. **[HIGH]** Fix subagent nesting question — it IS a technical limitation, not architectural preference
4. **[MEDIUM]** Update transport name "HTTP" → "Streamable HTTP"
5. **[MEDIUM]** Add CLAUDE.local.md and managed policy to CLAUDE.md hierarchy
6. **[MEDIUM]** Update SKILL.md frontmatter to show all 14+ fields
7. **[MEDIUM]** Add `xhigh` effort level
8. **[MEDIUM]** Document commands → skills merger
9. **[MEDIUM]** Verify @import syntax is `@path/to/file` everywhere
10. **[LOW]** Add "orchestrator-workers" as alternative term for "hub-and-spoke"
11. **[LOW]** Note "context rot" as official Anthropic terminology
12. **[LOW]** Consider adding new topics: server-executed tools, MCP sampling, MCP roots
