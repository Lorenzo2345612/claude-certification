# CCA Training System — Validated Research Index

> **Last updated**: 2026-04-17 (post-cleanup)
> **Active files**: 21 | **Archived**: 34 (in `archive/`)
> **Total validated lines**: ~12,000+
> **Purpose**: Single source of truth for validating all quiz questions, learn topics, and training content.
> **Rule**: Every fact must be traceable to a specific URL. If it can't be verified, it doesn't belong here.

---

## How to Use This Index

- **Validating a question**: Find the relevant domain file (d1–d5), look up the section, check the `> Source:` citation
- **Adding new content**: Check this index first to avoid duplication
- **Resolving conflicts**: Official docs (`*-official.md`) take precedence over Skilljar files
- **Known issues**: See `VALIDATION-REPORT.md` for 14 identified issues with priority actions
- **Archived files**: Old/superseded files are in `archive/` — do NOT use them as source of truth

---

## 1. Official Documentation (PRIMARY SOURCE OF TRUTH)

Every section includes the exact URL it was extracted from. These files have been validated against live Anthropic docs on 2026-04-17.

### Core Domain Files (Exam-Aligned)

| File | Lines | Exam Domain (Weight) | Primary Sources |
|------|-------|---------------------|-----------------|
| `d1-agentic-architecture-official.md` | 1,124 | D1: Agentic Architecture (27%) | `platform.claude.com/docs/en/agents-and-tools/tool-use/*`, `code.claude.com/docs/en/hooks`, `/sub-agents`, `anthropic.com/engineering/building-effective-agents` |
| `d2-tool-design-mcp-official.md` | 912 | D2: Tool Design & MCP (18%) | `platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools`, `modelcontextprotocol.io/docs/concepts/*`, `code.claude.com/docs/en/mcp` |
| `d3-claude-code-config-official.md` | 1,093 | D3: Claude Code Config (20%) | `code.claude.com/docs/en/memory`, `/skills`, `/cli-reference`, `/commands`, `/sub-agents`, `/hooks`, `/mcp`, `/github-actions` |
| `d4-prompting-structured-output-official.md` | 937 | D4: Prompt Engineering (20%) | `platform.claude.com/docs/en/build-with-claude/prompt-engineering/*`, `/structured-outputs`, `/batch-processing`, `/extended-thinking` |
| `d5-context-reliability-official.md` | 800 | D5: Context & Reliability (15%) | `platform.claude.com/docs/en/build-with-claude/context-windows`, `/compaction`, `/prompt-engineering/*` |

### Extended Coverage Files

| File | Lines | What It Covers | Primary Sources |
|------|-------|----------------|-----------------|
| `agent-sdk-official.md` | 1,555 | Claude Agent SDK — agent loop, custom tools, hooks, MCP, permissions, sessions, subagents, structured output, hosting, security | `code.claude.com/docs/en/agent-sdk/*` (21 pages) |
| `managed-agents-official.md` | 400 | Claude Managed Agents — setup, sessions, tools, multi-agent orchestration | `platform.claude.com/docs/en/managed-agents/*` |
| `platform-features-official.md` | 743 | Compaction API, context editing, 8 stop_reason values, task budgets, effort parameter, server tools, use case guides | `platform.claude.com/docs/en/build-with-claude/*` |
| `claude-code-advanced-official.md` | 939 | Agent teams, headless mode, tools reference, 6 permission modes, plugins, routines, GitHub Actions, best practices, 50+ settings | `code.claude.com/docs/en/*` (15 pages) |

---

## 2. Skilljar Academy Courses (SECONDARY REFERENCE)

Extracted from Anthropic Academy. Content was compiled from official docs matching each course's curriculum. Source URLs are at the top of each file.

### Exam-Critical Courses

| File | Lines | Course | Content Source |
|------|-------|--------|---------------|
| `skilljar-agent-skills.md` | 487 | Introduction to Agent Skills | `code.claude.com/docs/en/skills`, `agentskills.io/specification` |
| `skilljar-subagents.md` | 714 | Introduction to Subagents | `code.claude.com/docs/en/subagents`, `/agent-teams`, `/tools-reference` |
| `skilljar-claude-code-in-action.md` | 489 | Claude Code in Action (21 lessons) | `code.claude.com/docs/en/*` |
| `skilljar-claude-code-101.md` | 422 | Claude Code 101 | `code.claude.com/docs/en/*` |
| `skilljar-mcp-remaining.md` | 555 | MCP Intro + Advanced remaining lessons | `modelcontextprotocol.io/docs/*`, `code.claude.com/docs/en/mcp` |
| `skilljar-api-remaining.md` | 458 | API course — RAG, evals, image/PDF, models | `platform.claude.com/docs/en/*` |
| `skilljar-claude-cowork.md` | 411 | Introduction to Claude Cowork | `code.claude.com/docs/en/*` |

### Non-Exam Courses (Supplementary)

| File | Lines | Course | Content Source |
|------|-------|--------|---------------|
| `skilljar-claude-bedrock.md` | 230 | Claude with Amazon Bedrock | `anthropic.skilljar.com` (curriculum structure) |
| `skilljar-claude-vertex.md` | 266 | Claude with Vertex AI | `anthropic.skilljar.com` (curriculum structure) |
| `skilljar-ai-fluency-foundations.md` | 310 | AI Fluency: Framework & Foundations | `aifluencyframework.org`, public course page |
| `skilljar-ai-capabilities-limitations.md` | 284 | AI Capabilities and Limitations | Public course page, Anthropic research |

---

## 3. Reports

| File | Purpose |
|------|---------|
| `VALIDATION-REPORT.md` | 14 issues identified: 3 HIGH, 6 MEDIUM, 5 LOW severity — action items for fixing questions.json and learn_topics.json |
| `RESEARCH-INDEX.md` | This file — master index of all validated research |

---

## 4. Archived (DO NOT USE as source of truth)

Location: `research/archive/`

34 files moved here because they are either:
- **Superseded** by `*-official.md` files (topic files 01-16, deep research files)
- **Unvalidated** quotes referencing old URLs (quote files q001-q331)
- **Curriculum-only** without real lesson content (thin AI Fluency educator files)

---

## Source URL Registry

### Verified Sources (fetched 2026-04-17)

| Domain | Base URL | Pages Verified |
|--------|----------|---------------|
| Anthropic API Docs | `platform.claude.com/docs/en/` | ~40 pages |
| Claude Code Docs | `code.claude.com/docs/en/` | ~50 pages |
| Agent SDK Docs | `code.claude.com/docs/en/agent-sdk/` | 21 pages |
| MCP Specification | `modelcontextprotocol.io/docs/` | 4 concept pages |
| Engineering Blog | `anthropic.com/engineering/` | building-effective-agents |
| Skilljar Academy | `anthropic.skilljar.com/` | 15 courses (curriculum + select lessons) |

### URL Migration Note

Anthropic docs moved from `docs.anthropic.com` → `platform.claude.com/docs/en/`. Old URLs redirect but should be updated in training content. Claude Code docs moved from `docs.anthropic.com/en/docs/claude-code/` → `code.claude.com/docs/en/`.

---

## Critical Facts Discovered During Validation

These are facts that differ from or extend what the training system currently teaches:

1. **stop_reason has 8 values** — not 6. Includes `content_filter` and potentially `end_turn_tool_call`
2. **Task tool renamed to Agent tool** (v2.1.63) — "Task" still works as alias
3. **AgentDefinition is NOT a formal API type** — it's subagent YAML frontmatter with 16 fields
4. **Subagents CANNOT spawn subagents** — technical limitation, not architectural preference
5. **tool_choice has 4 options** — auto, any, tool, none (not 3)
6. **SSE transport is deprecated** → replaced by Streamable HTTP
7. **budget_tokens deprecated** on Opus 4.6+ → use adaptive thinking with effort parameter
8. **Effort has 5 levels** — low, medium, high, xhigh, max
9. **output_config.format** is now the primary structured output mechanism (not just tool_use)
10. **@import syntax** is `@path/to/file` (not `@import path`)
11. **Commands merged into Skills** — .claude/commands/ still works but skills recommended
12. **CLAUDE.local.md** exists as gitignored personal project-specific instructions
13. **Managed Agents** — entirely new product with API-level agent management
14. **Task Budgets** — new beta feature (Opus 4.7 only, advisory counting, min 20k tokens)
15. **Context Editing** — new feature for clearing tool results and thinking blocks
16. **Official term is "context rot"** — not "lost in the middle"
