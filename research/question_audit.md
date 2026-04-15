# Quiz Question Audit Report

**Audit Date:** 2026-04-15
**Auditor:** Automated + Manual Review
**Total Questions Audited:** 304 across 5 files

---

## Summary Statistics

| Metric | Result |
|--------|--------|
| Total questions | 304 |
| ID range | 1-304 (contiguous, no gaps) |
| Duplicate IDs | 0 |
| Files audited | 5 (questions.js: 32, part2: 68, part3: 104, part4: 50, part5: 50) |

### Domain Distribution

| Domain | Count |
|--------|-------|
| 1 - Agentic Architecture & Orchestration | 68 |
| 2 - Tool Design & MCP Integration | 55 |
| 3 - Claude Code Configuration & Workflows | 85 |
| 4 - Prompt Engineering & Structured Output | 48 |
| 5 - Context Management & Reliability | 48 |

### Scenario Distribution (after fixes)

| Scenario | Count |
|----------|-------|
| Customer Support Resolution Agent | 48 |
| Code Generation with Claude Code | 61 |
| Multi-Agent Research System | 57 |
| Developer Productivity | 44 |
| Claude Code for Continuous Integration | 33 |
| Structured Data Extraction | 61 |

---

## Check Results

### 1. Structural Integrity - PASS

All 304 questions have:
- `id`, `domain`, `domainId`, `scenario`, `question` fields present
- `options` array with exactly 4 entries (a, b, c, d)
- `correctAnswer` field
- `explanation` field
- `whyOthersWrong` object with exactly 3 entries

### 2. Exactly One Correct Answer - PASS

All 304 questions have exactly 1 option with `correct: true`, and in every case the `correctAnswer` letter matches the option marked as correct.

### 3. No Duplicate IDs - PASS

All 304 IDs are unique and contiguous (1-304).

### 4. No Spanish Text Remaining - PASS

Scanned all question text for: accented characters, inverted question marks, and Spanish keywords. No matches found.

### 5. Domain Names - PASS

All 304 questions have exact domain names matching the specification:
- domainId 1: "Agentic Architecture & Orchestration"
- domainId 2: "Tool Design & MCP Integration"
- domainId 3: "Claude Code Configuration & Workflows"
- domainId 4: "Prompt Engineering & Structured Output"
- domainId 5: "Context Management & Reliability"

### 6. Scenario Names - FIXED (100 issues)

**Questions 205-304 (questions_part4.js and questions_part5.js)** used descriptive scenario names (e.g., "Server-Side Tool Execution", "CLAUDE.md Memory System", "CLI Reference") instead of the 6 valid scenarios.

**Fix applied:** All 100 questions remapped to valid scenarios based on content analysis:

| Original Invalid Scenario | Mapped To | Count |
|---------------------------|-----------|-------|
| Server-Side Tool Execution, Server-Executed Tools | Multi-Agent Research System | 2 |
| API Response Handling, Agentic Loop Design, Content Moderation Agent | Customer Support Resolution Agent | 3 |
| Subagent Architecture/Communication/Tracking/Permissions/etc. | Multi-Agent Research System | 8 |
| Agent Tool Naming, Subagent Detection in Code | Code Generation with Claude Code | 2 |
| Hook System/Callback/Permission/Matcher/etc. (10 hooks) | Code Generation with Claude Code | 10 |
| CLAUDE.md Memory System (8 questions) | Code Generation with Claude Code | 8 |
| Skills System (8 questions) | Code Generation with Claude Code | 8 |
| Hooks Configuration (4 questions) | Code Generation with Claude Code | 4 |
| CLI Reference (7 questions) | Claude Code for Continuous Integration | 7 |
| Strict Schema/Mode/Caching/HIPAA/etc. | Structured Data Extraction | 7 |
| Tool Choice/Extended Thinking/Forced Use | Structured Data Extraction | 5 |
| MCP Installation/Env/Transport/etc. | Developer Productivity | 7 |
| API Integration Debug, API Message Ordering | Developer Productivity | 2 |
| Tool Error Recovery, Effective Error Messages | Customer Support Resolution Agent | 2 |
| Prompt Engineering Best Practices, Long Context, etc. | Structured Data Extraction | 5 |
| Parallel Tool Calling | Claude Code for Continuous Integration | 1 |
| Self-Review Limitations | Code Generation with Claude Code | 1 |
| Message Batches API (7 questions) | Claude Code for Continuous Integration | 7 |
| Structured Outputs (5 questions) | Structured Data Extraction | 5 |
| Context Window Management (4 questions) | Developer Productivity | 4 |
| Multi-Modal Tool Results | Structured Data Extraction | 1 |
| MCP Protocol Fundamentals, MCP Schema Naming | Developer Productivity | 2 |
| Prompt Caching with Tool Choice | Developer Productivity | 1 |

### 7. Technical Accuracy Spot-Check (20 questions)

Checked the following questions for factual accuracy:

| ID | Topic | Verdict | Notes |
|----|-------|---------|-------|
| 3 | stop_reason for agentic loops | CORRECT | end_turn and tool_use are correct termination signals |
| 206 | 6 stop_reason values | CORRECT | end_turn, tool_use, max_tokens, stop_sequence, refusal, pause_turn |
| 208 | Agentic loop continuation | CORRECT | Continue on tool_use/pause_turn, special handling for pause_turn |
| 215 | strict:true mechanism | CORRECT | Grammar-constrained sampling is the correct mechanism |
| 217 | Schema caching duration | CORRECT | Up to 24 hours, prompts/responses NOT retained |
| 218 | Extended thinking + strict | CORRECT | Only auto/none tool_choice with extended thinking |
| 220 | Four tool_choice options | CORRECT | auto, any, tool, none |
| 227 | Hook priority | CORRECT | deny > ask > allow |
| 237 | Subagents cannot spawn subagents | CORRECT | Critical restriction documented |
| 247 | MCP scope precedence | CORRECT | Local > Project > User > Plugin > Connectors |
| 255 | Windows managed policy path | CORRECT | C:\Program Files\ClaudeCode\CLAUDE.md |
| 257 | MEMORY.md auto-load limits | CORRECT | 200 lines / 25KB |
| 262 | CLAUDE.md delivered as user message | CORRECT | Not system prompt |
| 283 | Parallel tool calls tag | CORRECT | <use_parallel_tool_calls> documented |
| 287 | Batch result types and billing | CORRECT | succeeded(billed), errored/canceled/expired(not billed) |
| 288 | Batch limits | CORRECT | 100K requests or 256MB |
| 290 | Batch API discount | CORRECT | 50% on input and output tokens |
| 291 | Batch param validation timing | CORRECT | Asynchronous during processing |
| 300 | Context window and persistent items | CORRECT | 200K, re-injected items listed correctly |
| 17 | Batches API: 50% savings, up to 24h | CORRECT | Correctly identifies batch limitations |

**All 20 spot-checked questions are factually accurate.**

### 8. whyOthersWrong Completeness - PASS

All 912 whyOthersWrong entries (304 questions x 3 entries each) have substantive explanations. The shortest entry found was 12 words. No entries under 10 words were found.

### 9. No Empty/Placeholder Text - PASS

Two matches for "placeholder" were found but both are legitimate technical usage:
- ID 254: "...allow dynamic queries with placeholders like {city}."
- ID 265: "...The output REPLACES the placeholder. Claude receives..."

No TODO, FIXME, lorem, or empty string fields found.

---

## Issues Found and Fixed

### Issue 1: Invalid Scenario Names (FIXED)
- **Scope:** 100 questions (IDs 205-304) in questions_part4.js and questions_part5.js
- **Problem:** Used 64 different descriptive scenario names instead of the 6 valid scenarios
- **Fix:** Remapped all 100 questions to the most appropriate valid scenario
- **Files modified:** questions_part4.js (50 replacements), questions_part5.js (50 replacements)

### Issue 2: Incorrect whyOthersWrong in Q149 (FIXED)
- **Question ID:** 149 (questions_part3.js)
- **Problem:** Option C's explanation incorrectly stated "~/.claude/CLAUDE.md doesn't exist as a Claude Code convention" -- this contradicts questions 14, 72, 261, 297, 300 which all correctly reference it
- **Fix:** Updated to: "~/.claude/CLAUDE.md is for global personal preferences that apply to ALL projects. The question asks about preferences for a specific project, so CLAUDE.local.md within the project is the correct choice."
- **File modified:** questions_part3.js

---

## Potential Factual Concerns (Minor, Not Fixed)

### Q86: tool_choice 'any' vs 'tool' distinction
- Option C says `tool_choice: 'any'` with only one tool available "works but is less explicit." This is technically correct but the distinction is marginal -- both would work identically with a single tool.

### Q83: "Batches do not support multi-turn conversations"
- This is stated as "no multi-turn tool calling" in the specification. The question correctly states this but uses the term "multi-turn conversations" which is slightly broader. The answer is still correct per Anthropic docs.

### Q35: References "Task tool" instead of "Agent tool"
- Q35 references the "Task tool" which was the old name. Q236 documents the rename from Task to Agent in v2.1.63. This is not incorrect (the question could be describing legacy usage) but could cause confusion.

---

## Recommendations

1. **No critical issues remain.** All fixable issues have been resolved in the source files.

2. **Consider updating Q35** to use "Agent tool" instead of "Task tool" for consistency with the rename documented in Q236, unless the question intentionally tests knowledge of the old name.

3. **Scenario distribution is now reasonable** but heavily weighted toward "Code Generation with Claude Code" (61) and "Structured Data Extraction" (61). Consider redistributing some questions to "Claude Code for Continuous Integration" (33) or "Developer Productivity" (44) in future updates.

4. **Parts 4 and 5 focus on specific technical topics** (stop_reason, tool_result, strict:true, hooks, subagents, MCP, CLAUDE.md, skills, CLI, prompt engineering, batches, structured outputs, context window). These are valuable reference questions but may feel different in tone from the scenario-based questions in parts 1-3.
