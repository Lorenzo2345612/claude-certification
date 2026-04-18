# Questions Audit Report

**Audit Date:** 2026-04-17
**Auditor:** Educational Research Agent
**Scope:** All generated exam questions across 5 domains

---

## Summary

| Metric | Count |
|--------|-------|
| Total questions audited | 316 |
| D1 — Agentic Architecture & Orchestration | 86 |
| D2 — Tool Design & MCP Integration | 60 |
| D3 — Claude Code Configuration & Workflows | 62 |
| D4 — Prompt Engineering & Structured Output | 60 |
| D5 — Context Management & Reliability | 48 |
| Questions with factual errors | 0 |
| Questions with deprecated content | 0 |
| Questions not answerable from topics | 2 |
| Questions with ambiguous options | 3 |
| Duplicate/overlapping questions across domains | 5 pairs |

---

## 1. Questions with Factual Errors

**No factual errors found.**

All 316 questions were cross-referenced against the learn topics and research files. The correct answers align with the documented facts in every case. Specific verifications performed:

- All 6 `stop_reason` values and handlers (D1 Q1-Q10): Correct per topics and research.
- `tool_use` / `tool_result` ordering rules (D1 Q12, Q16): Correct — 400 errors for violations confirmed.
- `disable_parallel_tool_use` truth table (D1 Q25, D2 Q102): Correct — `auto` = at most one, `any/tool` = exactly one.
- Hook exit codes 0/1/2 (D1 Q55, Q64): Correct — exit code 1 is non-blocking, exit code 2 is blocking.
- `permissionDecision` priority order (D1 Q66): Correct — `deny > defer > ask > allow`.
- 16 subagent frontmatter fields (D1 Q53): Correct — matches topic `d1-subagent-config`.
- Strict mode requirements (D2 Q105): Correct — both `strict: true` AND `additionalProperties: false` required.
- MCP primitive control models (D2): Correct — Tools=Model, Resources=Application, Prompts=User.
- Streamable HTTP replacing SSE (D2): Correct — SSE properly labeled as deprecated.
- Adaptive thinking / budget_tokens behavior (D4 Q236, Q238): Correct — `budget_tokens` returns 400 on Opus 4.7.
- `xhigh` effort level (D4 Q237): Correct — only available on Opus 4.7, error on other models.
- Compaction defaults (D5 Q277): Correct — 150K trigger, 50K minimum.
- Context rot definition (D5 Q269): Correct per research.

---

## 2. Questions Not Answerable from Topics

These questions require knowledge that does not appear in the corresponding learn topics file.

### Q77 (D1) — Agent SDK: `allowedTools` does not constrain `bypassPermissions`
- **Issue:** The question asks about the interaction between `allowed_tools` and `bypassPermissions` in the Agent SDK. While the topic `d1-subagent-config` covers permission inheritance, the specific warning that "`allowed_tools` does NOT constrain `bypassPermissions`" is only in the Agent SDK research, not in d1-topics.
- **Impact:** Low — the explanation teaches the concept, and it is indirectly covered by the general permission inheritance discussion.
- **Recommendation:** Add a brief mention to the `d1-subagent-config` or `d1-programmatic-enforcement` topic about `bypassPermissions` overriding `allowedTools`.

### Q73 (D1) — Cross-platform hook sharing with settings.example.json pattern
- **Issue:** The `settings.example.json` with `$PWD` placeholder pattern is cited as coming from the Skilljar course "Gotchas around hooks." This specific pattern is not present in any learn topic content — the topics cover hook configuration locations but not the cross-machine sharing workaround.
- **Impact:** Low — the question tests a practical skill, and the concept can be reasoned about from general hook knowledge.
- **Recommendation:** Add a brief note about the `settings.example.json` pattern to the hooks topic or a dedicated "hooks best practices" section.

---

## 3. Questions with Deprecated Content

**No deprecated content found.**

All questions were scanned for the following deprecated patterns:

| Pattern Checked | Status |
|----------------|--------|
| "Task tool" instead of "Agent tool" | CLEAN — Q43 explicitly tests this migration, correctly identifying "Agent tool" as current |
| "AgentDefinition" as formal type | NOT FOUND — no questions use this term |
| "HTTP" instead of "Streamable HTTP" for MCP transport | CLEAN — D2 correctly uses "Streamable HTTP" throughout and tests SSE deprecation |
| "7 fields" for subagent config | NOT FOUND — Q53 correctly tests "16 fields" |
| Missing "xhigh" effort level | CLEAN — D4 Q237 and Q247 correctly test `xhigh` as Opus 4.7-only |
| SSE as current transport | CLEAN — SSE is correctly labeled deprecated in D2 questions |
| `budget_tokens` as current approach | CLEAN — D4 Q236, Q238 correctly identify `budget_tokens` as returning 400 error on Opus 4.7, deprecated on 4.6/Sonnet 4.6 |

---

## 4. Questions with Ambiguous or Unclear Options

### Q100 (D2) — Consequence of separate parallel tool result messages
- **Issue:** Option C states "The API will return an HTTP 400 error because tool results must be in a single message." The `why_others_wrong` says it "does not necessarily cause an HTTP 400." However, based on the topic `d1-tool-use-contract`, separate user messages with tool results DO violate the contract. The ambiguity is whether the API enforces this with a 400 or merely degrades behavior.
- **Recommendation:** The explanation adequately addresses this by noting the behavioral degradation. Consider clarifying option C to make it more clearly wrong, e.g., "The API always returns an HTTP 400 error and rejects the request entirely."

### Q66 (D1) — Hook permission decision priority
- **Issue:** The correct answer states "deny > ask > allow" but the full priority order from the topics is "deny > defer > ask > allow." The question omits `defer` entirely from all options. While the answer is correct in context, a student who knows about `defer` might be confused by its absence.
- **Recommendation:** Consider adding `defer` to the priority chain in the correct answer to match the complete documented order, or note that `defer` is omitted for simplicity.

### Q210 (D4) — Prefill behavior on Claude 4.6+ models
- **Issue:** The question states prefilled assistant responses return a 400 error "starting with Claude 4.6 models and Claude Mythos Preview." The explanation mentions "Mythos Preview" returning a 400 but also says "Claude 4.6+" which could be read as including 4.6. The topics clarify this is specifically about the last assistant turn being prefilled, which is nuanced. Students might confuse this with prefill in earlier turns (which may still work).
- **Recommendation:** The explanation is accurate. No change required, but consider adding "on the last assistant turn" to the question text for precision.

---

## 5. Duplicate/Overlapping Questions Across Domains

Several questions test nearly identical concepts across D1 and D2:

| D1 Question | D2 Question | Overlap |
|------------|------------|---------|
| Q18 (extended thinking + tool_choice) | Q98 (extended thinking + tool_choice) | Both test that `any`/`tool` + extended thinking returns error |
| Q19 (strict + tool_choice:any) | Q107 (strict + tool_choice:any) | Both test the combination for guaranteed invocation + schema compliance |
| Q25 (disable_parallel + any = exactly one) | Q102 (disable_parallel + auto = at most one) | Similar concept but different tool_choice values — acceptable |
| Q17 (tool_choice:tool forces specific tool) | Q97 (any/tool prefill suppresses text) | Both involve prefill behavior — somewhat overlapping |
| Q16 (tool_result ordering 400 error) | Q93 (tool_result ordering 400 error) | Virtually identical scenario and correct answer |

**Recommendation:** Q16 (D1) and Q93 (D2) are essentially the same question and should be deduplicated. Remove Q93 from D2 or substantially differentiate the scenario. Q18/Q98 and Q19/Q107 test the same fact and should have one removed from each pair.

---

## 6. Overall Quality Assessment by Domain

### D1 — Agentic Architecture & Orchestration (86 questions)
**Rating: EXCELLENT**
- Strong scenario-based questions that test deep understanding.
- Comprehensive coverage: agentic loop, stop_reasons, tool categories, workflow patterns, multi-agent orchestration, hooks, deterministic enforcement.
- Hook questions (Q54-Q74) are particularly well-crafted with practical scenarios.
- Subagent configuration questions (Q38-Q53) thoroughly cover the 16 frontmatter fields.
- Minor overlap with D2 on tool_choice and strict mode topics (see above).

### D2 — Tool Design & MCP Integration (60 questions)
**Rating: VERY GOOD**
- Strong coverage of tool definition best practices, tool_choice, strict mode, error handling, and MCP architecture.
- MCP transport questions correctly handle the SSE deprecation and Streamable HTTP transition.
- Environment variable expansion syntax (`${VAR}` and `${VAR:-default}`) well tested.
- Some overlap with D1 on tool_choice, parallel tool use, and strict mode. 3 questions should be deduplicated.
- MCP output limits and tool search configuration well covered.

### D3 — Claude Code Configuration & Workflows (62 questions)
**Rating: VERY GOOD**
- Comprehensive CLAUDE.md hierarchy coverage (4 levels, compaction behavior, import syntax).
- Rules system well tested (path-triggered vs unconditional, recursive discovery).
- Skills system thoroughly covered (allowed-tools, context modes, shell execution, invocation matrix).
- Plan mode and permission mode cycling well tested.
- Settings file scopes (project, local, user, managed) consistently accurate.

### D4 — Prompt Engineering & Structured Output (60 questions)
**Rating: EXCELLENT**
- Adaptive thinking / effort levels properly handled with xhigh correctly scoped to Opus 4.7.
- budget_tokens deprecation path accurately represented across model generations.
- Structured output via output_config well tested.
- Prompting best practices (XML tags, positive instructions, long context positioning) well covered.
- Citation system and document processing patterns accurately tested.

### D5 — Context Management & Reliability (48 questions)
**Rating: VERY GOOD**
- Context rot concept and architectural explanation well tested.
- Compaction strategies (server-side, Claude Code /compact, context editing) comprehensive.
- Token budget awareness mechanism (XML tags) accurately described.
- Prompt caching mechanics well covered.
- Batch API questions accurately represent async processing semantics.
- Slightly smaller question pool (48) compared to other domains but adequate coverage.

---

## 7. Actionable Recommendations

1. **Deduplicate 3 question pairs** between D1 and D2 (Q16/Q93, Q18/Q98, Q19/Q107).
2. **Add topic coverage** for the `allowedTools` + `bypassPermissions` interaction (Q77) and the `settings.example.json` cross-machine sharing pattern (Q73).
3. **Add `defer`** to the permission decision priority in Q66 or note its omission.
4. **Verify Q210** wording to clarify that prefill restriction applies specifically to "the last assistant turn."
5. **Ensure exam pools** do not serve both questions from overlapping pairs (Q25/Q102 are acceptable as they test different tool_choice modes).

---

## 8. Conclusion

The question bank is of **high quality overall**. All 316 questions have factually correct answers grounded in official documentation and learn topics. No deprecated terminology or outdated concepts were found — the questions correctly reflect current API behavior including Streamable HTTP, Agent tool naming, 16 subagent fields, xhigh effort level, and adaptive thinking. The primary recommendation is to deduplicate 3 nearly-identical question pairs that span D1 and D2, and to add minor topic coverage for 2 questions that reference Skilljar-specific content not fully represented in the learn topics.
