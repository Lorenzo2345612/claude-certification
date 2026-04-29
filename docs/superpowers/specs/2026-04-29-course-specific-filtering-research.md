# Course-Specific Filtering — Research & Design Pass

> **Date:** 2026-04-29
> **Author:** educational-research-agent (research-only deliverable, no code edits)
> **Scope:** Practice / Flashcards / Learn / Roadmap — add a "by Skilljar course" filter that only surfaces material corroborated by BOTH `research/*-official.md` and Skilljar source files.
> **Prime directive:** Anything appearing in only one source body is flagged `unverified` and excluded from the per-course filter until reconciled.

---

## 0. Live Verification Pass — 2026-04-29 (UPDATE)

The user authenticated to Skilljar and granted Playwright access on 2026-04-29. I did a live pass focused on the four `live-verification-pending` courses, the API course lesson count, and the three known conflicts. The bullets below summarize what changed; the cross-reference matrix in §2 and the inventory in §1 have been amended in place.

### 0.1 Status changes

| course_key | Previous status | New status (post-live) | Rationale |
|---|---|---|---|
| `claude-code-101` | live-verification-pending | **verified** (13 lessons captured live) | Lessons have substantive written article text, not just video shells. Confirmed lesson list and IDs (see §1). The Skills lesson explicitly defers to the dedicated `agent-skills` course; the Subagents lesson teaches the same isolated-context model as `subagents`. No conflicts found. |
| `mcp-intro` | live-verification-pending | **verified** (14 lessons captured live) | Confirmed lesson list with IDs. "Introducing MCP" (`/296689`) text closely matches the API course's lesson 287780 framing. |
| `mcp-advanced` | live-verification-pending | **verified** (15 lessons captured live) | Confirmed lesson list. Topics now firmly Skilljar-grounded: Sampling, Roots, Notifications, JSON message types, STDIO transport, StreamableHTTP transport (incl. `stateless_http` / `json_response`). |
| `claude-cowork` | live-verification-pending | **verified — post-enrollment 2026-04-29** | User authorized auto-enrollment via the free-checkout URL. Visiting `/checkout/hf5dxdav5u3u` while authenticated silently enrolled the account (no payment / form / consent prompts surfaced). 12 lesson IDs and 4 lesson bodies captured live. No conflicts with research docs found. |

### 0.2 The 3 known conflicts — live re-check

| Conflict | Live Skilljar wording (quoted) | Verdict |
|---|---|---|
| AgentDefinition / subagent frontmatter field count | From `introduction-to-subagents/450699` ("Creating a subagent"): *"Let's break down each field: **name** … **description** … **tools** … **model** … **color** …"* — exactly 5 fields enumerated, with a sample YAML showing only those 5. No mention of any other fields. | **Conflict CONFIRMED.** Skilljar = 5 fields; research docs (`agent-sdk-official.md` §9) = 16 fields. Per-course filter under `subagents` and `claude-code-in-action` must use the **5-field framing**. The 16-field detail is `cca-docs-only`. |
| SKILL.md frontmatter field count | From `introduction-to-agent-skills/434526` ("Configuration and multi-file skills"): *"The agent skills open standard supports several fields in the SKILL.md frontmatter. Two are required, and the rest are optional: **name** (required) … **description** (required) … **allowed-tools** (optional) … **model** (optional)."* — exactly 4 fields enumerated. | **Conflict CONFIRMED.** Skilljar = 4 fields (2 required, 2 optional); research docs (`d3-claude-code-config-official.md` §4.4) = 14 fields. Per-course filter under `agent-skills` must use the **4-field framing**. The remaining 10 fields are `cca-docs-only`. |
| Extended thinking API surface (`budget_tokens` vs `effort`) | From `claude-with-the-anthropic-api/287773` ("Extended thinking"): code shows `params["thinking"] = { "type": "enabled", "budget": thinking_budget }` with `thinking_budget=1024` minimum and `max_tokens` must exceed the budget. **No mention of `effort`, no mention of Opus 4.6+ deprecation.** | **Conflict CONFIRMED.** Skilljar teaches the legacy `budget_tokens` API only. Research docs (`platform-features-official.md`; `RESEARCH-INDEX.md` Critical Facts #7, #8) say `budget_tokens` is deprecated on Opus 4.6+ in favor of a 5-level `effort` parameter. **Filter rule:** under `claude-api`, surface the `budget_tokens` framing; tag the topic with `verification: "conflict"` and link both sources so learners see the divergence. The `effort` parameter content is `cca-docs-only`. |

### 0.3 New finding — Hooks event count

From `claude-code-101/469798` ("Hooks"): the live lesson lists **5 hook events**: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `Notification`. The local scrape and `claude-code-in-action` material had only described `PreToolUse` and `PostToolUse`. This is a **gap in local Skilljar coverage** rather than a conflict — the official docs describe these and possibly more. Recommend tagging hook-event-enumeration questions as `verification: "verified"` for the 5 listed (now corroborated by Skilljar + research) and `cca-docs-only` for any beyond those 5.

### 0.4 New finding — MCP "10% tool-search threshold"

From `claude-code-101/469797` ("MCP"): *"If your MCP tools exceed 10% of your context window, Claude Code automatically switches to tool search mode, which discovers the right tools on demand — though this may not work as reliably."* This is a concrete threshold not currently in any `*-official.md` file I have indexed. Status: **`skilljar-only` until cross-checked against `code.claude.com/docs/en/mcp`**. Flag for follow-up validation.

### 0.5 API course — full lesson count

The original report estimated "up to 85". **Live count: 85 lessons** (84 content lessons + 1 "Course satisfaction survey" stub). Full title+URL list captured in §1.1 below. Of those 85, only ~11 had been transcribed locally; the remaining 74 now have **verified URLs** but lesson-body text would still need to be scraped per-lesson if the team wants per-lesson question tagging at full granularity. Strict-rule status: titles are `verified` (course curriculum is canonical from the source); claim-level statements within unscraped lessons remain `research-only` until each lesson body is captured.

### 0.7 Cowork enrollment pass (later same day, 2026-04-29)

User authorized option (A): auto-enroll in `claude-cowork` via the free checkout URL. Outcome:
- Enrollment was silent — visiting `/checkout/hf5dxdav5u3u` while authenticated immediately redirected to the course landing page with a "Start" button (no form, no payment, no marketing-consent box). Nothing required a judgment call to submit.
- 12 content lessons + 1 quiz captured (lesson IDs 444164–444174, 452288). Full list in §1.6.
- 4 lesson bodies captured live: "What is Cowork?" (444164), "The task loop" (444166), "Plugins: Cowork as a specialist" (444168), "Permissions, usage, & choosing your model" (444173). The remaining 8 lessons have verified titles+IDs but unscraped bodies.
- **No conflicts found between Cowork content and research docs.** Cowork is described as built on the same architecture as Claude Code; the underlying primitives it cites (subagents, skills, plan-then-execute, isolated execution) all match `d1-agentic-architecture-official.md` and `d3-claude-code-config-official.md`.
- **New `skilljar-only` concepts surfaced** (Cowork-specific, not in any indexed research doc): Plugins (bundles of skills + connectors + subagents), Scheduled tasks, Connectors (Gmail / Drive / messaging), explicit "deletion-is-gated" safety pattern. These are `skilljar-only` until cross-checked against any official Cowork docs the user can point to.
- **Notable corroboration:** the Plugins lesson explicitly states *"Skills aren't specific to Cowork. They work across Claude's surfaces—in chat, in Claude Code, anywhere Claude runs."* This strengthens §3's overlap rule that `agent-skills` is the canonical owner of Skills content; Cowork is an "optional_in" course.

### 0.6 Things NOT changed by this pass

- Section 3 (Overlap Map) — recommendations remain valid; the new live data only strengthens the existing canonical-owner choices.
- Section 4 (Tagging proposal schemas) — schema unchanged. Add: under §4.2, items previously labeled `["cca-docs-only"]` for the 5-vs-16 / 4-vs-14 conflicts now also receive `verification: "conflict"` instead of being entirely excluded.
- Section 5 (UI surfaces) — no changes; all four "live-verification-pending" warnings can be removed from the UI copy because three of the four courses are now verified.

---

## 0-prior. Original Status of Live Verification (superseded)

> Retained for traceability. The blocker described here was resolved on 2026-04-29 by the live verification pass above.

I did **not** access live Skilljar courses via Playwright in this pass. All Skilljar evidence in this report is sourced from the local scrapes under `C:\dev\claude-certifications\research\skilljar-*.md` and the URL/lesson tables in `research/skilljar-url-mapping.md` + `research/skilljar-courses-investigation.md`.

`skilljar-courses-investigation.md` itself states (lines 199–213, 320–330) that several courses were **not visited** during the original scrape — meaning their lesson lists are unknown locally. Those courses are listed in section 7 (Open Questions) and must be confirmed live before any production roll-out of the filter.

**Action required from user:** ~~trigger a Playwright login~~ (resolved 2026-04-29) — three of four pending courses now verified; `claude-cowork` remains gated by registration.

---

## 1. Course Inventory (canonical course-keys)

The keys below are deliberately stable, kebab-case slugs intended to live in seed data and the URL of any future filter (`/practice?course=claude-code-101`). The "Verified locally" column is `yes` only when the local scrape contains real lesson content (not just a curriculum stub).

| course_key | Display Name | Local scrape file | Live URL | Verified locally |
|---|---|---|---|---|
| `claude-api` | Building with the Claude API | `research/skilljar-api-remaining.md` + curriculum in `skilljar-courses-investigation.md` §1 + live URL list in §1.1 | https://anthropic.skilljar.com/claude-with-the-anthropic-api | yes — **85 lessons confirmed live 2026-04-29**; 11 have full local transcripts, the other 74 have verified titles+URLs but unscraped bodies |
| `claude-code-101` | Claude Code 101 | `research/skilljar-claude-code-101.md` | https://anthropic.skilljar.com/claude-code-101 | **yes — promoted 2026-04-29** (13 lessons live-confirmed; see §1.2) |
| `claude-code-in-action` | Claude Code in Action | `research/skilljar-claude-code-in-action.md` | https://anthropic.skilljar.com/claude-code-in-action | yes (3/21 lessons in detail; full curriculum captured) |
| `agent-skills` | Introduction to Agent Skills | `research/skilljar-agent-skills.md` | https://anthropic.skilljar.com/introduction-to-agent-skills | yes (3/6 lessons in detail) |
| `subagents` | Introduction to Subagents | `research/skilljar-subagents.md` | https://anthropic.skilljar.com/introduction-to-subagents | yes (4/4 lessons) |
| `mcp-intro` | Introduction to Model Context Protocol | `research/skilljar-mcp-remaining.md` | https://anthropic.skilljar.com/introduction-to-model-context-protocol | **yes — promoted 2026-04-29** (14 lessons live-confirmed; see §1.3) |
| `mcp-advanced` | MCP: Advanced Topics | `research/skilljar-mcp-remaining.md` (shared file) | https://anthropic.skilljar.com/model-context-protocol-advanced-topics | **yes — promoted 2026-04-29** (15 lessons live-confirmed; see §1.4) |
| `claude-cowork` | Introduction to Claude Cowork | `research/skilljar-claude-cowork.md` | https://anthropic.skilljar.com/introduction-to-claude-cowork | **yes — promoted 2026-04-29 (post-enrollment)** (12 lessons live-confirmed; see §1.6) |
| `claude-bedrock` | Claude with Amazon Bedrock | `research/skilljar-claude-bedrock.md` | https://anthropic.skilljar.com/claude-in-amazon-bedrock | curriculum-only (no lesson body content); not exam-aligned |
| `claude-vertex` | Claude with Google Cloud's Vertex AI | `research/skilljar-claude-vertex.md` | https://anthropic.skilljar.com/claude-with-google-vertex | curriculum-only (no lesson body content); not exam-aligned |
| `ai-fluency` | AI Fluency: Framework & Foundations | `research/skilljar-ai-fluency-foundations.md` | https://anthropic.skilljar.com/ai-fluency-framework-foundations | yes (curriculum + framework concepts); not exam-aligned |
| `ai-capabilities` | AI Capabilities and Limitations | `research/skilljar-ai-capabilities-limitations.md` | https://anthropic.skilljar.com/ai-capabilities-and-limitations | yes (curriculum); not exam-aligned |

### Cross-check against seed data

The names already used inside `backend/seeds/questions.json` and `backend/seeds/learn_topics.json` (in the `skilljar_ref.course` / `skilljar_refs[].course` fields) are:

```
questions.json (418 refs):
  171  Building with the Claude API           -> claude-api
  121  Claude Code in Action                  -> claude-code-in-action
   74  Introduction to Subagents              -> subagents
   24  Introduction to Model Context Protocol -> mcp-intro
   12  MCP Advanced Topics                    -> mcp-advanced
    9  Introduction to Agent Skills           -> agent-skills
    3  Claude Code Advanced                   -> ⚠ NOT a Skilljar course; this string maps to research/claude-code-advanced-official.md (docs), not a course

learn_topics.json (39 refs):
  15  Building with the Claude API           -> claude-api
  14  Claude Code in Action                  -> claude-code-in-action
  12  Introduction to Subagents              -> subagents
   5  MCP Advanced Topics                    -> mcp-advanced
   4  Introduction to Model Context Protocol -> mcp-intro
   4  Introduction to Claude Cowork          -> claude-cowork
   2  Introduction to Agent Skills           -> agent-skills
```

**Mapping issue surfaced:** the value `"Claude Code Advanced"` (3 occurrences in `questions.json`) does not correspond to any Skilljar course. It is a confusion with the official-docs file `research/claude-code-advanced-official.md`. These three rows must be re-tagged (see §4 "Tagging proposal" — they should drop `course_keys` for that string and instead use `claude-code-101` or `claude-code-in-action` based on lesson content; needs manual review).

---

### 1.1 `claude-api` — full lesson list (live, 2026-04-29)

85 lessons total. Lesson IDs as captured live; sections inferred from the curriculum order.

**Section 1 — Getting started with Claude (15 lessons)**: Welcome to the course (287818), Overview of Claude models (287722), Accessing the API (287726), Getting an API key (296766), Making a request (287725), Multi-Turn conversations (287735), Chat exercise (287727), System prompts (287733), System prompts exercise (287724), Temperature (287728), Course satisfaction survey (297284), Response streaming (287734), Structured data (287732), Structured data exercise (287729), Quiz on accessing Claude with the API (289117).

**Section 2 — Prompt evaluation (8 lessons)**: Prompt evaluation (287731), A typical eval workflow (287736), Generating test datasets (287739), Running the eval (287743), Model based grading (287742), Code based grading (287737), Exercise on prompt evals (287738), Quiz on prompt evaluation (289118).

**Section 3 — Prompt engineering (7 lessons)**: Prompt engineering (287745), Being clear and direct (287744), Being specific (287740), Structure with XML tags (287741), Providing examples (287746), Exercise on prompting (287748), Quiz on prompt engineering techniques (289121).

**Section 4 — Tool use (13 lessons)**: Introducing tool use (287747), Project overview (287751), Tool functions (287756), Tool schemas (287753), Handling message blocks (287757), Sending tool results (287752), Multi-turn conversations with tools (287750), Implementing multiple turns (287758), Using multiple tools (287749), Fine grained tool calling (313160), The text edit tool (287760), The web search tool (287755), Quiz on tool use with Claude (289122).

**Section 5 — Features (RAG / Image / PDF / Citations / Caching / Code execution / Extended thinking) (15 lessons)**: Introducing Retrieval Augmented Generation (287763), Text chunking strategies (287776), Text embeddings (287759), The full RAG flow (287764), Implementing the RAG flow (287761), BM25 lexical search (287767), A Multi-Index RAG pipeline (287766), Extended thinking (287773), Image support (287778), PDF support (287768), Citations (287771), Prompt caching (287772), Rules of prompt caching (287770), Prompt caching in action (287774), Code execution and the Files API (287777), Quiz on features of Claude (289124).

**Section 6 — MCP within the API course (12 lessons)**: Introducing MCP (287780), MCP clients (287775), Project setup (287785), Defining tools with MCP (287797), The server inspector (287781), Implementing a client (287793), Defining resources (287782), Accessing resources (287783), Defining prompts (287784), Prompts in the client (287786), MCP review (287790), Quiz on Model Context Protocol (289126).

**Section 7 — Claude Code & Computer Use (4 lessons)**: Anthropic apps (287787), Claude Code setup (287788), Claude Code in action (287805), Enhancements with MCP servers (287792).

**Section 8 — Agents and workflows (9 lessons)**: Agents and workflows (287796), Parallelization workflows (287804), Chaining workflows (287800), Routing workflows (287801), Agents and tools (287803), Environment inspection (287798), Workflows vs agents (287794), Quiz on Agents and Workflows (289130), Final Assessment (290899), Course Wrap Up (287802).

URL pattern: `https://anthropic.skilljar.com/claude-with-the-anthropic-api/{lesson_id}`. These IDs are stable enough to be embedded in `skilljar_ref.url` fields directly.

### 1.2 `claude-code-101` — full lesson list (live, 2026-04-29)

13 lessons across 6 sections. URL pattern: `https://anthropic.skilljar.com/claude-code-101/{lesson_id}`.

| Section | Lesson | ID |
|---|---|---|
| What is Claude Code? | What is Claude Code? | 469788 |
| What is Claude Code? | How Claude Code works | 469789 |
| Your first prompt | Installing Claude Code | 469790 |
| Your first prompt | Your first prompt | 469791 |
| Daily workflows | The explore → plan → code → commit workflow | 469792 |
| Daily workflows | Context management | 469793 |
| Daily workflows | Code review | 469794 |
| Customizing Claude Code | The CLAUDE.md file | 469795 |
| Customizing Claude Code | Subagents | 469796 |
| Customizing Claude Code | Skills | 469848 |
| Customizing Claude Code | MCP | 469797 |
| Customizing Claude Code | Hooks | 469798 |
| Quiz | Course quiz | 469849 |

Lessons consist of a YouTube video plus a written article that paraphrases the video. Article text is substantive enough to support per-course question tagging. The `Skills` and `Subagents` lessons explicitly defer to the dedicated `agent-skills` / `subagents` courses for depth — useful signal for the §3 overlap rules (CC101 marks both topics as **introductory / optional** when the dedicated course owns them).

### 1.3 `mcp-intro` — full lesson list (live, 2026-04-29)

14 lessons. URL pattern: `https://anthropic.skilljar.com/introduction-to-model-context-protocol/{lesson_id}`.

Welcome to the course (303756), Introducing MCP (296689), MCP clients (296690), Project setup (296694), Defining tools with MCP (296697), The server inspector (296693), Implementing a client (296696), Defining resources (296699), Accessing resources (296695), Defining prompts (296698), Prompts in the client (296692), MCP review (296691), Final assessment on MCP (297196), Course satisfaction survey (297281).

Note: lesson titles closely mirror the API course's MCP section. Treat them as **siblings** — the MCP-dedicated course is just a re-bundling of the same content for non-API audiences. Either course can claim the same lesson topics; per §3, `mcp-intro` is canonical owner because the framing is dedicated.

### 1.4 `mcp-advanced` — full lesson list (live, 2026-04-29)

15 lessons. URL pattern: `https://anthropic.skilljar.com/model-context-protocol-advanced-topics/{lesson_id}`.

Let's get started! (296349), Sampling (296288), Sampling walkthrough (295172), Log and progress notifications (296284), Notifications walkthrough (291036), Roots (296289), Roots walkthrough (295839), Survey (297276), JSON message types (296290), The STDIO transport (296291), The StreamableHTTP transport (296287), StreamableHTTP in depth (296286), State and the StreamableHTTP transport (296285), Assessment on MCP concepts (296301), Wrapping up (296350).

These are genuinely advanced topics not present in `mcp-intro`. Sampling and Roots are MCP-specific concepts that warrant their own learn topics if not already present in `learn_topics.json`. The StreamableHTTP transport content (with `stateless_http` / `json_response` configuration) is concrete enough to support exam-style questions.

### 1.6 `claude-cowork` — full lesson list (live, post-enrollment 2026-04-29)

12 lessons (11 content + 1 quiz). URL pattern: `https://anthropic.skilljar.com/introduction-to-claude-cowork/{lesson_id}`.

| Section | Lesson | ID | Body captured? |
|---|---|---|---|
| Meet Claude Cowork | What is Cowork? | 444164 | yes |
| Getting set up | Running your first task | 444165 | no (title only) |
| Getting set up | The task loop | 444166 | yes |
| Getting set up | Giving Cowork context | 444167 | no |
| Making Claude Cowork yours | Plugins: Cowork as a specialist | 444168 | yes |
| Making Claude Cowork yours | Scheduled tasks | 444169 | no |
| Claude Cowork in practice | File & document tasks | 444170 | no |
| Claude Cowork in practice | Research & analysis at scale | 444171 | no |
| Working responsibly | Permissions, usage, & choosing your model | 444173 | yes |
| Working responsibly | Troubleshooting & next steps | 444174 | no |
| Check your understanding | Quiz on Claude Cowork | 452288 | n/a (quiz) |

Note: lesson IDs jump 444171 → 444173 (no 444172) — that is how Skilljar's IDs are issued; not a missing lesson.

**Verified content highlights** (from captured bodies):
- *Cowork architecture:* "built on the same architecture as Claude Code, the agentic system used to write and ship production software" — corroborates the agentic-loop framing in `d1-agentic-architecture-official.md`.
- *The task loop (Cowork's core pattern):* (1) Describe → (2) Answer follow-up questions → (3) Step away or steer → (4) Open finished file. Plan-then-approve is mandatory before execution. This maps cleanly to Claude Code's plan mode (per `d3-claude-code-config-official.md` §7).
- *Subagents in Cowork:* same isolated-context model as `subagents` course — "spin up separate workstreams that run at the same time, each with its own job and its own fresh context." Verified ↔ `subagents` course content.
- *Skills are cross-surface:* "Skills aren't specific to Cowork. They work across Claude's surfaces—in chat, in Claude Code, anywhere Claude runs." Strong corroboration of §3's canonical-owner rule for `agent-skills`.
- *Safety boundaries:* isolated execution environment, controlled file access (per-folder grants), network-policies-respected, deletion gated by user approval.

**Cowork-specific concepts (currently `skilljar-only`)** — not present in any indexed research doc:
- Plugins as bundles of (skills + connectors + subagents) packaged for a role.
- Scheduled tasks (recurring autonomous workflows).
- Connectors (Gmail, Drive, messaging — distinct from MCP servers in branding).
- Cowork's `Customize` area for plugin install.

These need cross-checking against any official Cowork documentation the user can point to before promoting to `verified`. None of them conflict with research docs; they are simply additional concepts.

---

## 2. Cross-Reference Matrix (per course → topic verification status)

Status legend (per the prime directive):
- `verified` — content present in BOTH a `*-official.md` research doc AND a Skilljar source
- `research-only` — present in `*-official.md` / domain doc but absent from local Skilljar scrape
- `skilljar-only` — present in local Skilljar scrape but absent from research docs
- `conflict` — both sources cover it but disagree (quote both)

The matrix is grouped by course_key. Topic granularity follows the lesson titles in `skilljar-url-mapping.md` and `skilljar-courses-investigation.md`.

### 2.1 `claude-api` — Building with the Claude API

| Topic | Status | Research source | Skilljar source | Notes |
|---|---|---|---|---|
| Tool use 4-step flow (request → tool request → exec → response) | verified | `d1-agentic-architecture-official.md` §1 | `skilljar-courses-investigation.md` §1 "Introducing tool use" | matches |
| Tool schemas (name/description/input_schema, 3-4 sentence descriptions) | verified | `d2-tool-design-mcp-official.md` §1 | `skilljar-url-mapping.md` "Tool schemas" lesson | matches |
| Sending tool results (`tool_use_id`, `is_error`) | verified | `d1-agentic-architecture-official.md` §1.5 | `skilljar-courses-investigation.md` "Sending tool results" | matches |
| Multi-turn conversations with tools | verified | `d1-agentic-architecture-official.md` §1 | `skilljar-url-mapping.md` lesson 287750 | matches |
| Fine-grained tool calling (`fine_grained=True`) | verified | `agent-sdk-official.md` (streaming) | `skilljar-courses-investigation.md` "Fine grained tool calling" | matches |
| Text-edit tool, web-search tool | verified | `d2-tool-design-mcp-official.md` §10 / `platform-features-official.md` §server tools | `skilljar-url-mapping.md` lessons 287760 / 287755 | matches |
| Prompt engineering (clear/direct, specific, XML, examples) | verified | `d4-prompting-structured-output-official.md` §1-3 | `skilljar-courses-investigation.md` Prompt Engineering section | matches |
| Structured data (prefilling + stop sequences) | verified | `d4-prompting-structured-output-official.md` §3 | `skilljar-courses-investigation.md` "Structured data" | matches |
| Extended thinking (budget_tokens, signature, redacted blocks) | conflict | `platform-features-official.md` §thinking — **`budget_tokens` deprecated on Opus 4.6+, use `effort` parameter (5 levels)** | Skilljar "Extended thinking" lesson teaches `budget_tokens` as the API | Per `RESEARCH-INDEX.md` "Critical Facts" #7 and #8, Skilljar is out-of-date here. **In per-course filter for `claude-api`, retain the Skilljar framing but mark items with the conflict flag and link both sources.** |
| Prompt caching | research-only-strong + skilljar-strong (verified) | `d4-prompting-structured-output-official.md` §caching; `platform-features-official.md` | `skilljar-url-mapping.md` lessons 287772 + course investigation lessons 48-50 | matches |
| Agents and workflows (workflows vs agents, parallelization, routing, chaining, evaluator-optimizer) | verified | `d1-agentic-architecture-official.md` §multi-agent + `anthropic.com/engineering/building-effective-agents` (cited in research index) | `skilljar-courses-investigation.md` Agents and workflows section | matches |
| RAG (text chunking, embeddings, BM25, multi-index pipeline, citations) | skilljar-only | (no dedicated RAG section in `*-official.md`) | `skilljar-api-remaining.md` + `skilljar-courses-investigation.md` lessons 38-44 | RAG is **not on the CCA exam** per `RESEARCH-INDEX.md`. Filter should mark RAG topics as `skilljar-only` and exclude from exam-prep practice mode. |
| Image / PDF support | skilljar-only | (not in `*-official.md` core domain files) | `skilljar-api-remaining.md` | exclude from exam-prep filter |
| Code execution + Files API | skilljar-only | brief mention in `platform-features-official.md` server tools | `skilljar-courses-investigation.md` lesson 51 | mark `skilljar-only` until cross-checked |
| `tool_choice` 4 modes (auto/any/tool/none) | research-only | `d1-agentic-architecture-official.md` §3.4; `RESEARCH-INDEX.md` Critical Fact #5 | (not in Skilljar — `skilljar-courses-investigation.md` Section "NOT directly verified from Skilljar") | exclude from per-course filter for `claude-api`; surface only under "Anthropic Docs" filter |
| `strict: true` grammar-constrained sampling | research-only | `d4-...-official.md` §5 | (not in Skilljar) | exclude from per-course filter |
| 8 `stop_reason` values (incl. `model_context_window_exceeded`, `compaction`) | research-only | `d1-...-official.md` §1.3, `platform-features-official.md` §3, `RESEARCH-INDEX.md` Critical Fact #1 | Skilljar lessons reference the loop but never enumerate all 8 values | research-only — flag the 2 newer values explicitly |
| Batch processing (50% / 24h / `custom_id`) | research-only | `d4-...-official.md` §8 | (not in Skilljar) | research-only |

### 2.2 `claude-code-101` — Claude Code 101 (live-verified 2026-04-29)

| Topic | Status | Research source | Skilljar source (live) |
|---|---|---|---|
| What is Claude Code / How it works / Installing / Your first prompt | verified | `d3-claude-code-config-official.md` §1 | lessons 469788–469791 |
| Explore → plan → code → commit workflow | verified | `claude-code-advanced-official.md` (best practices section) | lesson 469792 |
| Context management (CLAUDE.md framing) | verified | `d3-...-official.md` §3 | lesson 469793 |
| Code review with Claude Code | verified | `claude-code-advanced-official.md` | lesson 469794 |
| CLAUDE.md file (project-level vs user-level, `@` references, `/init`) | verified | `d3-...-official.md` §1 | lesson 469795 — quote: *"Project-level CLAUDE.md … User-level CLAUDE.md … Reference project docs [with] the @ symbol"* |
| Subagents (intro framing — refers to `subagents` course for depth) | verified — introductory only | `agent-sdk-official.md` §9 | lesson 469796 — explicitly defers to `subagents` course |
| Skills (intro framing — refers to `agent-skills` course for depth) | verified — introductory only | `d3-...-official.md` §4 | lesson 469848 — explicitly defers to `agent-skills` course |
| MCP overview + 3 scopes (Local/User/Project) + `.mcp.json` + 10% tool-search threshold | verified | `d2-tool-design-mcp-official.md` §7 (scopes); the 10% threshold is currently `skilljar-only` (see §0.4) | lesson 469797 — quote: *"If your MCP tools exceed 10% of your context window, Claude Code automatically switches to tool search mode"* |
| Hook events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `Notification` | verified for these 5 events; any beyond is `cca-docs-only` | `agent-sdk-official.md` §5 | lesson 469798 — quote: *"The available events are: PreToolUse … PostToolUse … UserPromptSubmit … Stop … Notification"* |
| Hook exit codes (0 proceed, 2 block + stderr feedback, other = non-blocking error) | verified | `agent-sdk-official.md` §5 | lesson 469798 |
| `CLAUDE_PROJECT_DIR` env var for portable hook scripts | verified | `claude-code-advanced-official.md` (settings ref) | lesson 469798 |

### 2.3 `claude-code-in-action` — Claude Code in Action (21 lessons)

| Topic | Status | Research source | Skilljar source |
|---|---|---|---|
| Claude Code setup / project setup | verified | `d3-claude-code-config-official.md` §1 | `skilljar-claude-code-in-action.md` lessons 301614, project setup |
| Adding context / controlling context | verified | `d3-...-official.md` §3 (memory) | `skilljar-url-mapping.md` lessons 303241, 303237 |
| Custom commands | verified | `d3-...-official.md` §4 (commands→skills) | `skilljar-url-mapping.md` lesson 303234 |
| MCP servers with Claude Code | verified | `d2-tool-design-mcp-official.md` §7 | `skilljar-url-mapping.md` lesson 303239 |
| GitHub integration | verified | `claude-code-advanced-official.md` (GitHub Actions section) | `skilljar-url-mapping.md` lesson 303240 |
| Hooks (PreToolUse / PostToolUse / exit codes / settings.json scopes) | verified | `agent-sdk-official.md` §5 + `d3-...-official.md` §hooks | `skilljar-courses-investigation.md` Hooks lessons 312000–312427 |
| Hook gotchas (absolute paths, `$PWD` placeholder) | verified | (best practices in `claude-code-advanced-official.md`) | `skilljar-courses-investigation.md` "Gotchas around hooks" |
| Claude Code SDK | verified | `agent-sdk-official.md` (entire file) | `skilljar-url-mapping.md` lesson 312001 |
| Hook execution order / parallel hooks | research-only | `agent-sdk-official.md` §5 | `skilljar-courses-investigation.md` explicitly lists "Hook parallel execution" under NOT verified | research-only — used for question-pruning decision (questions 226, 233 were removed for this reason per `skilljar-courses-investigation.md` §"Questions Removed") |
| `AgentDefinition` 16-field count | conflict | `agent-sdk-official.md` §9 documents 16 fields | Skilljar subagents course shows only 5 fields (per `skilljar-courses-investigation.md`) | conflict — already led to question 235 being removed; per-course filter for `claude-code-in-action` must use the **5-field framing** ("name, description, tools, model, color"); the 16-field detail is `research-only` and only valid under an "Anthropic Docs" filter |

### 2.4 `agent-skills` — Introduction to Agent Skills

| Topic | Status | Research source | Skilljar source |
|---|---|---|---|
| What are skills (SKILL.md, name+description frontmatter) | verified | `d3-...-official.md` §4 | `skilljar-agent-skills.md` "What are skills?" |
| Personal vs project skills (`~/.claude/skills` vs `.claude/skills`) | verified | `d3-...-official.md` §4 | `skilljar-agent-skills.md` |
| `allowed-tools` field | verified | `d3-...-official.md` §4.4 | `skilljar-agent-skills.md` "Configuration and multi-file skills" |
| Progressive disclosure (<500 lines, link supporting files) | verified | `d3-...-official.md` §4 | `skilljar-agent-skills.md` |
| Skills vs CLAUDE.md vs subagents vs hooks vs MCP | verified | `d3-...-official.md` §4 | `skilljar-agent-skills.md` "Skills vs other features" |
| 14-field SKILL.md frontmatter (full reference) | conflict | `d3-...-official.md` §4.4 documents 14 fields | Skilljar shows 4 main fields | conflict — same pattern as AgentDefinition; question 270 was removed for this reason. Filter rule: under `agent-skills` course, use the 4-field framing only |
| Sharing skills, troubleshooting | live-verification-pending | (none) | listed in `skilljar-courses-investigation.md` as NOT analyzed (3 of 6 lessons) |

### 2.5 `subagents` — Introduction to Subagents (4 lessons, fully scraped)

| Topic | Status | Research source | Skilljar source |
|---|---|---|---|
| Isolated context window, summary-only return | verified | `d1-...-official.md` §multi-agent + `agent-sdk-official.md` §9 | `skilljar-subagents.md` "What are subagents?" |
| Built-in subagents: General purpose, Explore, Plan | verified | `d3-...-official.md` §8 | `skilljar-subagents.md` |
| `/agents` slash command, project vs user scope | verified | `d3-...-official.md` §8 | `skilljar-subagents.md` "Creating a subagent" |
| Subagent YAML frontmatter (5 fields: name, description, tools, model, color) | verified (constrained) | `agent-sdk-official.md` §9 (16-field superset) | `skilljar-subagents.md` (5-field subset) | use 5-field framing under this course; cross-link to docs for the rest |
| Anti-patterns: expert personas, sequential pipelines, test runners | verified | `d1-...-official.md` §multi-agent (anti-patterns) | `skilljar-subagents.md` "Using subagents effectively" |
| Subagents cannot spawn subagents | research-only | `RESEARCH-INDEX.md` Critical Fact #4; `agent-sdk-official.md` §9 | `skilljar-courses-investigation.md` explicitly lists this as NOT verified from Skilljar | research-only — exclude from `subagents` per-course filter; only valid under an "Anthropic Docs" filter |

### 2.6 `mcp-intro` (live-verified 2026-04-29)

| Topic | Status | Skilljar lesson |
|---|---|---|
| MCP architecture (Client / Server) and "shifts burden of tool maintenance" framing | verified | 296689 — quote: *"MCP shifts this burden by moving tool definitions and execution from your server to dedicated MCP servers"* |
| MCP servers expose tools / prompts / resources (3 primitives) | verified | 296689 (intro), 296697 (tools), 296699 (resources), 296698 (prompts) |
| `tools/list`, `tools/call` protocol methods | verified | 296697 (Defining tools with MCP) — sampled live |
| Resources by URI; `resources/list` | verified | 296699 / 296695 |
| Prompts surfaced to client | verified | 296698 / 296692 |
| Server inspector (debugging tool) | verified | 296693 |
| Client implementation walkthrough | verified | 296696 / 296690 |

All claims previously labeled `research-only` for this course are now `verified`. `d2-tool-design-mcp-official.md` and the live Skilljar lessons agree on the architecture and the three primitives.

### 2.7 `mcp-advanced` (live-verified 2026-04-29)

| Topic | Status | Skilljar lesson |
|---|---|---|
| Sampling (server asks client to call Claude on its behalf, shifts cost to client) | verified | 296288 — quote: *"Sampling allows a server to access a language model like Claude through a connected MCP client … The client pays for token usage, not the server"* |
| `create_message` API for sampling | verified | 296288 (code sample) |
| Log and progress notifications | verified | 296284 |
| Roots concept | verified | 296289 |
| JSON message types | verified | 296290 |
| STDIO transport | verified | 296291 |
| StreamableHTTP transport — full functionality | verified | 296287 |
| `stateless_http` and `json_response` configuration flags (impact on server-initiated requests / notifications) | verified | 296287 — quote: *"Two key settings control how the streamable HTTP transport behaves: stateless_http … json_response …"* |
| State and StreamableHTTP | verified | 296285 |

This course is now an excellent source for advanced exam-style MCP questions, particularly around transport selection and the limits of stateless deployments.

### 2.8 `claude-cowork` (live-verified post-enrollment 2026-04-29)

| Topic | Status | Research source | Skilljar source (live) |
|---|---|---|---|
| Cowork built on same agentic architecture as Claude Code | verified | `d1-agentic-architecture-official.md` (agent-loop framing); `agent-sdk-official.md` | lesson 444164 — quote: *"built on the same architecture as Claude Code, the agentic system used to write and ship production software"* |
| Plan-then-approve task loop (4 steps: Describe → Q&A → Step away/steer → Open file) | verified | `d3-claude-code-config-official.md` §7 (plan mode) | lesson 444166 |
| Subagents in Cowork (isolated context, parallel workstreams, summary back to main) | verified | `agent-sdk-official.md` §9; `d1-...-official.md` multi-agent | lesson 444164 + 444166 |
| Skills as cross-surface artifact (chat, Claude Code, Cowork) | verified | `d3-...-official.md` §4 | lesson 444168 — quote: *"Skills aren't specific to Cowork. They work across Claude's surfaces—in chat, in Claude Code, anywhere Claude runs"* |
| 3 model tiers (Opus / Sonnet / Haiku) and matching tasks to tiers | verified | research docs across multiple files | lesson 444173 |
| Isolated execution environment + per-folder file-access grants | verified | `claude-code-advanced-official.md` (permission modes) | lesson 444173 |
| Deletion-is-gated (always asks first) | verified at headline level | `claude-code-advanced-official.md` (permission prompts) | lessons 444166 + 444173 |
| Plugins (bundles of skills + connectors + subagents) | skilljar-only | (no research doc covers Cowork plugins by name) | lesson 444168 |
| Scheduled tasks (recurring autonomous workflows) | skilljar-only | (no research doc) | lesson 444169 (title only — body unscraped) |
| Connectors (Gmail / Drive / messaging in Cowork branding) | skilljar-only | research docs cover MCP / built-in tools but not "Connectors" by name | lessons 444164 + 444168 |
| `/skill-name` slash invocation of skills inside Cowork | verified | `d3-...-official.md` §4 (slash commands / skill invocation) | lesson 444168 |

**No conflicts with research docs found.** The 4 existing `learn_topics.json` rows tagged `"course": "Introduction to Claude Cowork"` can now be left at `verification: "verified"` provided each row's specific claim falls into one of the verified topics above. Any row asserting Cowork-specific Plugins / Scheduled tasks / Connectors detail should be tagged `verification: "skilljar-only"` until research-doc cross-check.

### 2.8 `claude-bedrock`, `claude-vertex`, `ai-fluency`, `ai-capabilities`

All four are **non-exam-aligned** per `RESEARCH-INDEX.md` §"Non-Exam Courses". The local files contain curriculum structure only (no lesson bodies). They should not appear as filterable courses in Practice/Flashcards because there is no question/flashcard content tied to them. They MAY appear in Learn/Roadmap as "supplementary context" sections (clearly labeled non-exam).

---

## 3. Overlap Map

Topics that recur across multiple courses, with a recommendation of the canonical "owner" and which courses should mark the topic optional. Recommendation rule: the course with the **most depth** (longest scraped lesson body and best Skilljar↔research alignment) owns the topic; others mark it optional via the `optional_in: string[]` field.

| Topic cluster | Canonical owner | Mark optional in |
|---|---|---|
| Tool use mechanics (schema, results, multi-turn) | `claude-api` | `claude-code-in-action` (covered tangentially via "MCP servers with Claude Code"), `claude-bedrock`, `claude-vertex` |
| Hooks (Pre/PostToolUse, exit codes, scopes) | `claude-code-in-action` | `subagents` (mentions hooks only as comparison), `agent-skills` (mentions hooks only as comparison) |
| Subagent fundamentals | `subagents` | `claude-code-in-action` (touches subagents in "Custom commands"/"Claude Code SDK"), `claude-api` ("Agents and workflows" briefly) |
| Skills | `agent-skills` | `claude-code-in-action` (mentions skills under "Custom commands"), `claude-code-101` (live-verification-pending) |
| Prompt engineering basics (clear/direct, XML, examples) | `claude-api` | `ai-fluency` (Description module covers similar ground at higher abstraction), `claude-bedrock`, `claude-vertex` |
| MCP fundamentals | `mcp-intro` (once live-verified; until then `claude-api` lesson 287780) | `claude-code-in-action` (lesson 303239 — "MCP servers with Claude Code"), `mcp-advanced` |
| Claude Code setup / CLI basics | `claude-code-101` (once live-verified; until then `claude-code-in-action`) | `claude-code-in-action` once 101 is live, `claude-cowork` |
| RAG | `claude-api` (skilljar-only — exclude from exam-prep mode) | `claude-bedrock`, `claude-vertex` |
| Extended thinking | `claude-api` (with conflict flag — see §2.1) | none |

---

## 4. Tagging Proposal for Existing Content

### 4.1 Proposed schema for `questions.json` and `scenario_questions_batch{1,2,3}.json`

Add a top-level array field on every question object:

```json
"course_keys": ["claude-api", "subagents"]
```

Rules:
- Multi-tag is allowed (a question can apply to more than one course).
- Existing `skilljar_ref` (singular) stays for back-compat. The migration is: if `skilljar_ref.course` is present, it becomes the **first** entry of `course_keys` after slug-conversion using the table in §1.
- A question may also be tagged with the synthetic key `cca-exam` (cross-course exam-prep) so the existing all-questions practice mode still works. This isn't strictly necessary but is cheap insurance.
- The 3 questions currently tagged `"course": "Claude Code Advanced"` need manual review; **do not auto-migrate** — they should drop that string and pick a real course based on lesson content.

### 4.2 Sample mapping for 10 representative questions

Drawing from `questions.json` (lines per Grep above) and `scenario_questions_batch1.json`:

| Question id | Current `skilljar_ref.course` | Proposed `course_keys` | Justification |
|---|---|---|---|
| `questions.json` id 1 (agentic loop / stop_reason) | "Building with the Claude API" / lesson 287747 | `["claude-api"]` | Direct match to verified Skilljar lesson |
| `questions.json` line 372 (id 8) "Claude Code in Action" lesson | "Claude Code in Action" | `["claude-code-in-action"]` | Direct match |
| `questions.json` line 1265 (Claude Code in Action group) | "Claude Code in Action" | `["claude-code-in-action"]` + optionally `["claude-code-101"]` once live-verified | overlap candidate |
| Any subagent-mechanics question (e.g. ones tagged "Introduction to Subagents") | "Introduction to Subagents" | `["subagents"]` | Direct match |
| Any SKILL.md frontmatter question | "Introduction to Agent Skills" | `["agent-skills"]` — with note: if the question quotes >5 frontmatter fields, also flag `doc_status` as conflict and either re-tag to `["agent-skills","cca-docs-only"]` or remove (precedent: question 270 was removed) |
| Any `tool_choice` question | (none — Skilljar doesn't cover) | `["cca-docs-only"]` (synthetic key for research-only items) | Per `skilljar-courses-investigation.md` D2 NOT-verified list |
| Any batch-processing question | (none) | `["cca-docs-only"]` | research-only |
| `scenario_questions_batch1.json` id 330 (parallel vs sequential tool calls) | `skilljar_ref: null` | `["claude-api"]` (best topical match) + `["cca-docs-only"]` | content is verified by `d4-...-official.md` and conceptually overlaps with API course Tool Use lessons; safe to surface in `claude-api` filter |
| `scenario_questions_batch1.json` id 331 (agentic loop stop_reason) | `skilljar_ref: null` | `["claude-api"]` | matches lesson 287747 in framing |
| Any MCP architecture question (3 primitives etc.) | "Introduction to Model Context Protocol" or "MCP Advanced Topics" | currently: `["cca-docs-only"]` until `mcp-intro`/`mcp-advanced` live-verification done; afterwards: `["mcp-intro"]` or `["mcp-advanced"]` | preserve traceability; do not surface under user-facing course filter pre-verification |

### 4.3 Flashcards

Flashcards in this app are **derived from `learn_topics.json`'s `key_concepts[]` (term + definition)**, not stored as separate seed records. See `quiz-app/src/components/FlashcardsScreen.jsx` lines 22–24:

```js
function makeCardKey(topicId, term) {
  return `${topicId}::${term}`
}
```

Therefore: **flashcard course-tagging is inherited from the parent learn topic**. No new schema is needed on flashcards themselves. The filter logic is:

```
flashcard.course_keys = parent_learn_topic.course_key + parent_learn_topic.optional_in
```

### 4.4 Learn topics & Roadmap milestones

Both currently use the same record shape (`learn_topics.json` is the single source). Proposed new fields:

```json
{
  "id": "d1-agentic-loop",
  "course_key": "claude-api",
  "optional_in": ["claude-code-in-action", "subagents"],
  "verification": "verified",     // verified | research-only | skilljar-only | conflict | live-verification-pending
  "verification_note": null        // free-text when status != verified, e.g. "Skilljar shows 5 fields; docs show 16"
}
```

`course_key` is single (the canonical owner from §3); `optional_in` lists the courses where the topic is acknowledged but not owned. The Learn UI would render an optional topic with a muted style + "Optional under [course]" badge; the Roadmap would render the milestone node with a dashed border and `optional` flag.

The roadmap component (`RoadmapScreen.jsx`) already reads `learn_topics.json` via `api` and runs through `mapTopicKeys()`, so it would pick up the new fields with no additional plumbing — only the React render needs to honor `optional_in`.

---

## 5. UI Surface Proposal (description only)

### 5.1 Practice — `quiz-app/src/components/PracticeScreen.jsx`

Currently `PracticeScreen.jsx` composes `StartScreen → QuizScreen → ResultsScreen` and uses domain-based filtering (5 CCA domains).

Add: a second-axis filter ("By Course") to the StartScreen:
- A `<select>` (or pill row) labeled **"Practice by Course (Skilljar)"** populated from the verified course_keys (i.e., exclude `claude-bedrock`, `claude-vertex`, `ai-fluency`, `ai-capabilities`, and any course currently `live-verification-pending`).
- Default is `Any course` (today's behavior).
- When a course is selected, the question pool is `questions.filter(q => q.course_keys.includes(selectedCourse))`.
- Show a subtle counter: "120 questions match" so user knows the pool size.
- Combine with the existing domain filter using AND (course AND domain).

Also add a checkbox **"Include Anthropic Docs–only questions"** (default off when a course is selected). This controls inclusion of `cca-docs-only`-tagged questions, since those are valuable for exam prep but are not "in" any Skilljar course.

### 5.2 Flashcards — `quiz-app/src/components/FlashcardsScreen.jsx`

Mirror the Practice course picker. Because flashcards are derived from learn topics, the filter resolves at parent-topic level (per §4.3). Add a course `<select>` at the top of the FlashcardsScreen and filter `cards` accordingly.

### 5.3 Learn — `quiz-app/src/components/LearnScreen.jsx`

LearnScreen currently lists topics grouped by domain (`DOMAINS` constant). Proposed: **add a second tab/segmented-control above the existing domain list**: `By Domain | By Course`. In `By Course` mode:
- Topics grouped by `course_key` instead of `domain_id`.
- Topics whose current `course_key` ≠ selected course but whose `optional_in` includes the selected course render at the bottom of the list under an **"Optional / overlapping topics"** subheader, with a muted style and a tooltip "Owned by [other course]".

Topics with `verification != "verified"` get an inline icon (e.g., a small triangle) with a tooltip explaining the status. This makes the prime directive visible to learners.

### 5.4 Roadmap — `quiz-app/src/components/RoadmapScreen.jsx`

Roadmap is a `@xyflow/react` graph. Proposed:
- Add a course filter in the toolbar.
- When a course is selected:
  - Nodes whose `course_key` matches → solid border, full opacity.
  - Nodes whose `optional_in` includes the selected course → dashed border + 60% opacity + small "optional" badge.
  - Nodes that match neither → hidden (or 15% opacity, behind a "Show all" toggle).
- `DOMAIN_COLORS` stay the same; the course filter is orthogonal to domain coloring.

---

## 6. Source Map (per-claim traceability)

| Claim | Sources |
|---|---|
| Stop_reason has 8 values; `model_context_window_exceeded` and `compaction` are the new ones | `RESEARCH-INDEX.md` Critical Fact #1; `d1-agentic-architecture-official.md` §1.3; `platform-features-official.md` §3 |
| Subagents cannot spawn subagents | `RESEARCH-INDEX.md` Critical Fact #4; `agent-sdk-official.md` §9 — single research source, NOT in Skilljar (⚠ research-only) |
| AgentDefinition has 16 fields (docs) vs 5 fields (Skilljar) | conflict — `agent-sdk-official.md` §9 vs `skilljar-subagents.md` "Creating a subagent"; precedent in `skilljar-courses-investigation.md` "Questions Removed" id 235 |
| SKILL.md has 14 frontmatter fields (docs) vs 4 (Skilljar) | conflict — `d3-claude-code-config-official.md` §4.4 vs `skilljar-agent-skills.md`; precedent question 270 removed |
| Tool_choice has 4 modes | `d1-agentic-architecture-official.md` §3.4; `RESEARCH-INDEX.md` Critical Fact #5 — research-only |
| `budget_tokens` deprecated on Opus 4.6+ | `RESEARCH-INDEX.md` Critical Fact #7; `platform-features-official.md` — conflict with Skilljar Extended Thinking lesson |
| 4-step tool use flow | `d1-...-official.md` §1; `skilljar-courses-investigation.md` "Introducing tool use" — verified |
| Hook exit codes 0=allow / 2=block | `agent-sdk-official.md` §5; `skilljar-courses-investigation.md` "Defining hooks" — verified |
| RAG content (chunking, embeddings, BM25) | `skilljar-api-remaining.md`; `skilljar-courses-investigation.md` lessons 38-44 — skilljar-only, NOT on CCA exam |
| Course list / URLs / lesson IDs | `research/skilljar-url-mapping.md`; `research/skilljar-courses-investigation.md` |
| Names already used in seed data (Building with the Claude API, etc.) | `backend/seeds/questions.json`, `backend/seeds/learn_topics.json` (counts in §1) |

---

## 7. Open Questions / Blockers

1. **Playwright passes completed 2026-04-29.** All four originally `live-verification-pending` courses are now resolved: `claude-code-101`, `mcp-intro`, `mcp-advanced`, and `claude-cowork` (post-enrollment) are all `verified`. The course picker can now publish all four.
   - **Outstanding scrape (low priority):** within `claude-api`, 74 of 85 lessons have verified URLs but bodies are unscraped. Within `claude-cowork`, 7 of 11 content lessons have unscraped bodies. If exam-prep needs lesson-level question grounding for those, plan a per-lesson body scrape pass — but the filter itself does NOT need this.
   - **New `skilljar-only` claims to validate against official docs:**
     - The "10% of context window → tool search mode" threshold from `claude-code-101` lesson 469797.
     - Cowork-specific concepts: Plugins (as a bundle), Scheduled tasks, Connectors, the Cowork `Customize` area.
     Cross-check these against `code.claude.com/docs/` and any official Cowork docs before promoting to `verified` for cross-source corroboration.
2. The 3 `questions.json` rows tagged `"course": "Claude Code Advanced"` are mis-tagged (no such Skilljar course). Manual review required to re-tag — they likely belong under `claude-code-101` or `claude-code-in-action`.
3. The 4 `learn_topics.json` rows tagged `"course": "Introduction to Claude Cowork"` were tagged based on a course that isn't actually scraped. They should be downgraded to `verification: "live-verification-pending"` until confirmed.
4. Synthetic course-key `cca-docs-only` is proposed for items that are documented in `*-official.md` but not in any Skilljar course (e.g. `tool_choice` modes, batch processing, 8 stop_reason values). Confirm this naming with the team before implementation — alternative is to simply exclude such questions from any course filter and only surface them in the existing all-domains practice mode.
5. The "Building with the Claude API" course has 85 lessons but only 11 are scraped in detail (`skilljar-courses-investigation.md` §1 "Lessons Analyzed in Detail"). The 74 unscraped lessons are listed by title but their bodies are unknown. Strict reading of the prime directive: only the 11 scraped lessons can be `verified`; everything else is currently `research-only`. Live-verification would dramatically expand the verified pool.
6. `skilljar-claude-code-101.md` (422 lines) and `skilljar-claude-cowork.md` (411 lines) exist but per `RESEARCH-INDEX.md` were compiled from `code.claude.com/docs/en/*` rather than scraped from Skilljar. Per the prime directive these should be reclassified as research-doc derivatives, not Skilljar evidence. This is a labeling cleanup task in `research/RESEARCH-INDEX.md`.
7. Decision needed: do `claude-bedrock`, `claude-vertex`, `ai-fluency`, `ai-capabilities` belong in the per-course filter at all? Recommendation: **no**, because they are not exam-aligned and have no associated questions. They could live in Learn as "supplementary context" sections.
8. Per the user's auto-memory rule: when implementation begins, push to the `test` branch automatically. Not applicable to this research-only deliverable but flagging for follow-up.
