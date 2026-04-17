# Knowledge Sources Map

This document lists every location in the system where educational content is stored, referenced, or used to teach/evaluate knowledge about Claude and Anthropic technologies. Use this as a checklist when validating that all facts are accurate.

## 1. Quiz Questions (Evaluation)

**Primary source:** `backend/seeds/questions.json`
- 319 questions across 5 domains
- Each question includes: scenario, question text, 4 options (with correct flag), explanation, `why_others_wrong` per option, `doc_reference` (quote + source), `doc_status`, and `skilljar_ref`
- **What to validate:** Every correct answer, every explanation, every doc quote, and every "why wrong" explanation contains factual claims about Claude's behavior

**Legacy copies (kept as backup, not used at runtime):**
- `quiz-app/src/data/questions.js`
- `quiz-app/src/data/questions_part2.js` through `questions_part6.js`

### Question fields that contain knowledge claims

| Field | What it claims |
|-------|---------------|
| `options[].text` | Each option states a technical fact — the correct one is true, the others are false |
| `correct_answer` | Asserts which option is factually correct |
| `explanation` | Explains WHY the correct answer is right — contains technical facts |
| `why_others_wrong` | Explains WHY each wrong option is incorrect — contains counter-facts |
| `doc_reference.quote` | Direct quote attributed to `doc_reference.source` |
| `doc_status` | Claims the strength of documentation backing (STRONG / PARTIAL / EXAM_GUIDE) |

## 2. Learn Topics (Teaching)

**Primary source:** `backend/seeds/learn_topics.json`
- 36 topics with full HTML content
- Each topic includes: title, rich HTML content (with code examples, tables, diagrams), summary, key concepts with definitions, doc URLs, related topics, Skilljar references

**Legacy copies (not used at runtime):**
- `quiz-app/src/data/learnTopics.js`
- `quiz-app/src/data/learnSummaries.js`

### Topic fields that contain knowledge claims

| Field | What it claims |
|-------|---------------|
| `content` | Full HTML teaching material — code examples, API behaviors, architecture patterns, best practices. **This is the largest source of factual claims in the system** |
| `summary` | Condensed paragraph summarizing the topic — contains key facts |
| `key_concepts[].definition` | Definitions shown as hover tooltips — each is a factual claim |
| `doc_url` | Links to official docs — should still be valid URLs |
| `skilljar_refs` | Claims which Skilljar lessons cover this topic |

### Topics by domain

**D1 — Agentic Architecture & Orchestration (8 topics):**
- `d1-agentic-loop` — stop_reason values, tool_result matching, server-executed tools
- `d1-tool-use-contract` — tool_result format, is_error flag, content block types
- `d1-multi-agent` — multi-agent patterns, coordinator/worker, hub-spoke
- `d1-hooks` — PreToolUse/PostToolUse, exit codes (0/1/2), hook events
- `d1-subagent-config` — Agent tool, allowed tools, context isolation
- `d1-sessions` — session resume, fork_session, crash recovery
- `d1-task-decomposition` — parallelization, chaining, routing patterns
- `d1-programmatic-enforcement` — deterministic guarantees vs prompt instructions

**D2 — Tool Design & MCP Integration (7 topics):**
- `d2-tool-interfaces` — input_schema, tool naming, description best practices
- `d2-tool-choice` — auto/any/none/specific, forced tool calling
- `d2-strict-tool-use` — strict:true, additionalProperties:false, grammar-constrained
- `d2-error-responses` — is_error:true, error categories, retry strategies
- `d2-mcp-architecture` — 3 primitives (Tools/Resources/Prompts), transport types
- `d2-mcp-config` — .mcp.json, scopes, env var expansion
- `d2-builtin-tools` — Read/Write/Edit/Grep/Glob/Bash, file pattern matching

**D3 — Claude Code Configuration & Workflows (8 topics):**
- `d3-claude-md` — CLAUDE.md hierarchy, @import, auto memory, .claude/rules
- `d3-rules` — path-specific rules, .claude/rules directory
- `d3-skills` — SKILL.md frontmatter, context-fork, allowed-tools, argument-hint
- `d3-plan-mode` — plan vs direct execution, Explore subagent
- `d3-cli` — --print, --output-format, --max-turns, --permission-mode, --worktree
- `d3-cicd` — GitHub Actions, automated PR review, pre-merge checks
- `d3-context-window` — /compact, compaction behavior, scratchpad pattern
- `d3-iterative-refinement` — prompt iteration techniques

**D4 — Prompt Engineering & Structured Output (6 topics):**
- `d4-prompting-best-practices` — clear/direct, specific, XML tags, examples
- `d4-few-shot` — input/output examples, explicit criteria
- `d4-structured-output` — output_config, json_schema, confidence fields
- `d4-batch-processing` — Message Batches API, custom_id, 50% cost, 24h processing
- `d4-multi-instance-review` — multi-pass review, independent review, per-file pass
- `d4-adaptive-thinking` — budget_tokens, extended thinking, effort parameter

**D5 — Context Management & Reliability (7 topics):**
- `d5-context-windows` — token limits, lost-in-middle, progressive summarization
- `d5-escalation` — human handoff, sentiment analysis, confidence scoring
- `d5-error-propagation` — partial results, structured error context, failure types
- `d5-large-codebase` — codebase exploration strategies, subagent delegation
- `d5-human-review` — human-in-the-loop, review workflows
- `d5-provenance` — source attribution, conflicting statistics, temporal data
- `d5-hooks-settings` — settings.json hooks, exit code 2 blocking, handler types

## 3. Hardcoded Knowledge in Frontend Components

### PracticeScreen.jsx — DOC_KEYWORD_MAP
**Location:** `quiz-app/src/components/PracticeScreen.jsx` lines 20-55
- 30+ regex patterns that map question keywords to official documentation URLs
- **What to validate:** Each URL should still be a valid, relevant documentation page
- URLs point to: `platform.claude.com/docs`, `code.claude.com/docs`, `modelcontextprotocol.io/docs`

### PracticeScreen.jsx — DOMAIN_FALLBACK
**Location:** `quiz-app/src/components/PracticeScreen.jsx` lines 57-63
- Fallback doc URLs per domain when no keyword matches
- 5 URLs, one per domain

### RoadmapScreen.jsx — PREREQUISITE_EDGES
**Location:** `quiz-app/src/components/RoadmapScreen.jsx` lines 52-107
- 37 directed edges defining the recommended learning order
- **What to validate:** The prerequisite relationships should be pedagogically correct (e.g., "agentic loop" before "tool use contract" makes sense)

### Multiple components — DOMAINS definition
**Locations:**
- `quiz-app/src/App.jsx` lines 10-16 (with weights: 27%, 18%, 20%, 20%, 15%)
- `quiz-app/src/components/LearnScreen.jsx` lines 39-45
- `quiz-app/src/components/RoadmapScreen.jsx` lines 31-45
- `quiz-app/src/components/PerformanceScreen.jsx` lines 5-11

Domain names and weights are factual claims about the certification exam structure.

## 4. Research Files (Source Documentation)

**Location:** `research/`

These files contain extracted facts from official sources used to write questions and topics. They are reference-only (not served to users) but document the provenance of the knowledge.

### Skilljar course research
- `skilljar-facts-extraction.md` — Facts extracted from ~50 Skilljar lessons
- `skilljar-courses-investigation.md` — Investigation of course structure, changes made
- `skilljar-url-mapping.md` — Complete URL mapping tables for all courses/lessons
- `api-course-lessons.json` — 71 API course lesson IDs and URLs

### Deep research by domain
- `d1_d2_deep_research.md` — D1 & D2 facts from official docs
- `d3_d4_d5_deep_research.md` — D3-D5 facts from official docs
- `comprehensive_docs_research.md` — Cross-domain documentation review

### Topic-specific research (16 files)
- `01-agentic-loop-tool-use.md` through `16-prompt-caching.md`
- Each contains extracted facts, API behaviors, and code examples from official Anthropic documentation

### Question documentation quotes (6 files)
- `quotes-q001-q032.md` through `quotes-q305-q331.md`
- Direct quotes from official docs that back each question's correct answer

### Audit
- `question_audit.md` — Distribution analysis of 304 questions by domain and scenario

## 5. Validation Checklist

When validating knowledge accuracy, check these in order of impact:

### High priority (directly shown to users)
1. **Question correct answers** — `questions.json` → `correct_answer` + `explanation`
2. **Learn topic content** — `learn_topics.json` → `content` (HTML)
3. **Key concept definitions** — `learn_topics.json` → `key_concepts[].definition`
4. **Topic summaries** — `learn_topics.json` → `summary`

### Medium priority (shown when users get answers wrong)
5. **Why others wrong** — `questions.json` → `why_others_wrong`
6. **Doc reference quotes** — `questions.json` → `doc_reference.quote`

### Lower priority (navigation/linking)
7. **Documentation URLs** — `doc_url` in topics, `DOC_KEYWORD_MAP` in PracticeScreen
8. **Skilljar references** — `skilljar_ref` in questions, `skilljar_refs` in topics
9. **Prerequisite edges** — `PREREQUISITE_EDGES` in RoadmapScreen
10. **Domain weights** — `DOMAINS` in App.jsx

### Not shown to users (reference only)
11. **Research files** — `research/` directory (provenance documentation)
