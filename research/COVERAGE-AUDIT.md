# CCA Exam Coverage Audit Report

> Generated: 2026-04-17
> Audited against: CCA Certification Exam Guide (Technologies + In-Scope Topics)
> Research library: 9 files in `C:\dev\claude-certifications\research\`

---

## TECHNOLOGIES (Exam Guide Appendix)

### 1. Claude Agent SDK -- Agent definitions, agentic loops, stop_reason handling, hooks (PostToolUse, tool call interception), subagent spawning via Agent tool, allowedTools

- **Agent definitions**: COVERED in `agent-sdk-official.md`, Section 9 (Subagents) -- `AgentDefinition` fields fully documented
- **Agentic loops**: COVERED in `agent-sdk-official.md`, Section 3 (Agent Loop) -- lifecycle, turns, message types
- **stop_reason handling**: COVERED in `d1-agentic-architecture-official.md`, Section 1.3 -- ALL values listed (end_turn, tool_use, max_tokens, stop_sequence, pause_turn, refusal); also `platform-features-official.md` Section 3 adds `model_context_window_exceeded` and `compaction`
- **Hooks (PostToolUse, tool call interception)**: COVERED in `agent-sdk-official.md`, Section 5 -- PreToolUse, PostToolUse, PostToolUseFailure documented with callback signatures and decision control
- **Subagent spawning via Agent tool**: COVERED in `agent-sdk-official.md`, Section 9 -- three creation methods, key constraints (no nesting)
- **allowedTools**: COVERED in `agent-sdk-official.md`, Section 4 -- `tools` vs `allowedTools` vs `disallowedTools` comparison table

**Verdict: COVERED**

---

### 2. MCP -- servers, tools, resources, isError flag, tool descriptions, tool distribution, .mcp.json, env var expansion

- **MCP servers**: COVERED in `d2-tool-design-mcp-official.md`, Sections 7-9 -- scoping (local/project/user), transport types (stdio, HTTP, SSE)
- **MCP tools**: COVERED in `d2-tool-design-mcp-official.md`, Section 5.1 -- tool definition fields, protocol methods, annotations
- **MCP resources**: COVERED in `d2-tool-design-mcp-official.md`, Section 5.2 -- URI-based, subscribe, templates, read protocol
- **isError flag**: COVERED in `d2-tool-design-mcp-official.md`, Section 6 -- `isError: true` in tool results for execution errors
- **Tool descriptions**: COVERED in `d2-tool-design-mcp-official.md`, Section 1 -- best practices for descriptions (3-4 sentences)
- **Tool distribution**: COVERED in `d2-tool-design-mcp-official.md`, Section 11 -- tool search, `ENABLE_TOOL_SEARCH` values, ideal 4-5 tools per agent
- **.mcp.json**: COVERED in `d2-tool-design-mcp-official.md`, Section 7 -- project scope configuration
- **Env var expansion**: COVERED in `d2-tool-design-mcp-official.md`, Section 8 -- `${VAR}` and `${VAR:-default}` in command, args, env, url, headers

**Verdict: COVERED**

---

### 3. Claude Code -- CLAUDE.md hierarchy (user/project/directory), .claude/rules/ with YAML frontmatter, .claude/commands/, .claude/skills/ with SKILL.md (context: fork, allowed-tools, argument-hint), plan mode, /memory, /compact, --resume, fork_session, Explore subagent

- **CLAUDE.md hierarchy**: COVERED in `d3-claude-code-config-official.md`, Section 1 -- managed policy, project, user, local; resolution order; @import syntax
- **.claude/rules/ with YAML frontmatter**: COVERED in `d3-claude-code-config-official.md`, Section 2 -- `paths` frontmatter, glob patterns, unconditional vs conditional loading
- **.claude/commands/**: COVERED in `d3-claude-code-config-official.md`, Section 4.1 -- commands-to-skills merge, skills take precedence
- **.claude/skills/ with SKILL.md**: COVERED in `d3-claude-code-config-official.md`, Section 4 -- complete frontmatter reference
  - **context: fork**: COVERED -- Section 4.4 and 4.10
  - **allowed-tools**: COVERED -- Section 4.4 (space-separated string or YAML list)
  - **argument-hint**: COVERED -- Section 4.4 (`argument-hint: "[issue-number]"`)
- **Plan mode**: COVERED in `d3-claude-code-config-official.md`, Section 7 -- activation, Plan subagent (read-only)
- **/memory**: COVERED in `d3-claude-code-config-official.md`, Section 3.3 -- lists files, toggle auto memory
- **/compact**: COVERED in `d5-context-reliability-official.md`, Section 6 -- behavior, what survives
- **--resume**: COVERED in `d3-claude-code-config-official.md`, Section 5.2 -- `--resume` flag documented
- **fork_session**: COVERED in `d3-claude-code-config-official.md`, Section 5.2 -- `--fork-session` flag; also `agent-sdk-official.md` Section 8
- **Explore subagent**: COVERED in `d3-claude-code-config-official.md`, Section 8.1 -- Haiku model, read-only, thoroughness levels

**Verdict: COVERED**

---

### 4. Claude Code CLI -- -p/--print, --output-format json, --json-schema

- **-p/--print**: COVERED in `d3-claude-code-config-official.md`, Section 5.1 -- print mode documented; also `claude-code-advanced-official.md` Section 2 (Headless Mode)
- **--output-format json**: COVERED in `d3-claude-code-config-official.md`, Section 5.3 -- text, json, stream-json formats
- **--json-schema**: COVERED in `d3-claude-code-config-official.md`, Section 5.3 -- validated JSON output matching schema (print mode only)

**Verdict: COVERED**

---

### 5. Claude API -- tool_use with JSON schemas, tool_choice (auto/any/tool/none), stop_reason values (ALL of them), max_tokens, system prompts

- **tool_use with JSON schemas**: COVERED in `d1-agentic-architecture-official.md`, Sections 3-4 -- tool definitions, input_schema, tool_use/tool_result blocks
- **tool_choice (auto/any/tool/none)**: COVERED in `d1-agentic-architecture-official.md`, Section 3.4 -- all 4 options with behavior
- **stop_reason values (ALL)**: COVERED in `d1-agentic-architecture-official.md`, Section 1.3 (6 values: end_turn, tool_use, max_tokens, stop_sequence, pause_turn, refusal); `platform-features-official.md` Section 3 adds `model_context_window_exceeded` and `compaction`
- **max_tokens**: COVERED in `d4-prompting-structured-output-official.md`, Section 13.2 -- required parameter
- **System prompts**: COVERED in `d4-prompting-structured-output-official.md`, Section 13.3 -- system parameter; also `d1-agentic-architecture-official.md` Section 3.7 (auto-generated tool use system prompt)

**Verdict: COVERED**

---

### 6. Message Batches API -- 50% cost savings, 24h window, custom_id, no multi-turn tool calling, polling

- **50% cost savings**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.1 -- "50% off standard API prices"
- **24h window**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.1 -- "Up to 24 hours"
- **custom_id**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.2 -- regex, uniqueness, correlation purpose
- **No multi-turn tool calling**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.1 -- "Each request is independent; no multi-turn tool loops within a batch"
- **Polling**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.6 -- API endpoints for retrieve/list batch status

**Verdict: COVERED**

---

### 7. JSON Schema -- required/optional fields, enum, nullable, "other"+detail patterns, strict mode

- **required/optional fields**: COVERED in `d4-prompting-structured-output-official.md`, Section 3.3 -- `required` supported; up to 24 optional parameters
- **enum**: COVERED in `d4-prompting-structured-output-official.md`, Section 3.3 -- scalars only
- **nullable**: COVERED in `d4-prompting-structured-output-official.md`, Section 3.3 -- `null` type supported; `anyOf` supported
- **"other"+detail patterns**: PARTIAL -- The pattern of using an enum with an "other" value plus a detail field for open-ended options is not explicitly documented by name in any research file. The concept is implicitly covered by the enum + nullable/anyOf support in the schema features table.
- **strict mode**: COVERED in `d4-prompting-structured-output-official.md`, Section 5 -- `strict: true`, grammar-constrained sampling, `additionalProperties: false` required

**Verdict: PARTIAL -- missing explicit documentation of the "other"+detail enum pattern as a schema design technique**

---

### 8. Pydantic -- schema validation, semantic errors, validation-retry loops

- **Schema validation (Pydantic)**: COVERED in `d4-prompting-structured-output-official.md`, Section 3.7 -- Python SDK `client.messages.parse(output_format=PydanticModel)` with `model_json_schema()` for conversion; also `agent-sdk-official.md` Section 10 -- Pydantic `model_validate()` for validation
- **Semantic errors**: PARTIAL -- Validation errors are covered (type mismatches, missing fields), but the specific concept of "semantic errors" (where the schema validates but the content is logically wrong) is not explicitly discussed as a distinct category.
- **Validation-retry loops**: COVERED in `d4-prompting-structured-output-official.md`, Section 10 -- retry patterns for different error types; Section 10.3 -- retry with error feedback pattern; also `agent-sdk-official.md` Section 10 -- SDK re-prompts on mismatch, `error_max_structured_output_retries`

**Verdict: PARTIAL -- semantic error concept (schema-valid but logically wrong) not explicitly named/discussed**

---

### 9. Built-in tools -- Read, Write, Edit, Bash, Grep, Glob (purpose and selection criteria)

- **All 6 tools**: COVERED in `d2-tool-design-mcp-official.md`, Section 10 -- purpose table and selection criteria (File search -> Glob, Content search -> Grep, Read files -> Read, Edit files -> Edit, Write new files -> Write, Shell operations -> Bash)

**Verdict: COVERED**

---

### 10. Few-shot prompting -- examples for ambiguous scenarios, format demonstration, generalization

- **Examples for ambiguous scenarios**: COVERED in `d4-prompting-structured-output-official.md`, Section 2 -- "Few-shot examples are the primary mechanism for disambiguating ambiguous scenarios"
- **Format demonstration**: COVERED in `d4-prompting-structured-output-official.md`, Section 2 -- "one of the most reliable ways to steer output format, tone, and structure"
- **Generalization**: COVERED in `d4-prompting-structured-output-official.md`, Section 2 -- "Claude generalizes the reasoning style from examples to new situations"; `<thinking>` tags in examples teach reasoning patterns

**Verdict: COVERED**

---

### 11. Prompt chaining -- sequential decomposition into focused passes

- **Sequential decomposition**: COVERED in `d1-agentic-architecture-official.md`, Section 7.2 (Pattern 1: Prompt Chaining) -- "Sequential LLM calls where each processes previous output"; gates for intermediate verification
- **Focused passes**: COVERED in `d4-prompting-structured-output-official.md`, Section 1.10 -- generate draft -> review -> refine; each step = separate API call

**Verdict: COVERED**

---

### 12. Context window management -- token budgets, progressive summarization, lost-in-the-middle/context rot, scratchpad files

- **Token budgets**: COVERED in `d5-context-reliability-official.md`, Section 1 -- context window sizes; `platform-features-official.md` Section 4 -- task budgets (advisory token budget)
- **Progressive summarization**: COVERED in `d5-context-reliability-official.md`, Section 5 -- how compaction summarization works, risks of precision loss
- **Lost-in-the-middle / context rot**: COVERED in `d5-context-reliability-official.md`, Section 2 -- official Anthropic term is "context rot"; architectural explanation; Section 3 -- position effects (queries at end = 30% improvement)
- **Scratchpad files**: COVERED in `d5-context-reliability-official.md`, Section 7 -- progress.txt pattern, tests.json structured state files, multi-context-window workflow

**Verdict: COVERED**

---

### 13. Session management -- resumption, fork_session, named sessions, context isolation

- **Resumption**: COVERED in `agent-sdk-official.md`, Section 8 -- continue vs resume vs fork; session IDs
- **fork_session**: COVERED in `agent-sdk-official.md`, Section 8 -- creates new session with copy of history; also `d3-claude-code-config-official.md` Section 5.2
- **Named sessions**: COVERED in `d3-claude-code-config-official.md`, Section 5.2 -- `--name` flag; `agent-sdk-official.md` Section 8 -- `rename_session()`
- **Context isolation**: COVERED in `d1-agentic-architecture-official.md`, Section 12.4 -- isolation mechanisms table (subagent, background, worktree, agent teams, fork)

**Verdict: COVERED**

---

### 14. Confidence scoring -- field-level confidence, calibration with labeled sets, stratified sampling

- **Field-level confidence**: COVERED in `d5-context-reliability-official.md`, Section 12 -- high/medium/low confidence at field level
- **Calibration with labeled sets**: PARTIAL -- The concept of calibrating confidence with labeled sets is not explicitly documented. The research mentions "stratified random sampling" and "accuracy segmentation" but does not describe a calibration process using labeled ground-truth data.
- **Stratified sampling**: COVERED in `d5-context-reliability-official.md`, Section 12 -- sample from different confidence tiers, higher rate for low-confidence

**Verdict: PARTIAL -- calibration with labeled sets not explicitly documented as a technique**

---

## IN-SCOPE TOPICS (Exam Guide)

### 15. Agentic loop implementation: stop_reason control flow, tool result handling, loop termination

- **stop_reason control flow**: COVERED in `d1-agentic-architecture-official.md`, Section 1.2-1.3 -- canonical while loop keyed on stop_reason; all values listed
- **Tool result handling**: COVERED in `d1-agentic-architecture-official.md`, Section 4 -- tool_result format, ordering rules, error handling with is_error
- **Loop termination**: COVERED in `d1-agentic-architecture-official.md`, Section 1.3 -- "loop continues ONLY while stop_reason == tool_use; any other value exits"

**Verdict: COVERED**

---

### 16. Multi-agent orchestration: coordinator-subagent, task decomposition, parallel execution, iterative refinement

- **Coordinator-subagent**: COVERED in `d1-agentic-architecture-official.md`, Section 12.2 -- coordinator = main thread, subagents = specialized workers
- **Task decomposition**: COVERED in `d1-agentic-architecture-official.md`, Section 7.2 (Pattern 4: Orchestrator-Workers) -- dynamically decomposes tasks
- **Parallel execution**: COVERED in `d1-agentic-architecture-official.md`, Section 7.2 (Pattern 3: Parallelization) -- sectioning and voting; Section 12.3 -- Agent Teams
- **Iterative refinement**: COVERED in `d1-agentic-architecture-official.md`, Section 7.2 (Pattern 5: Evaluator-Optimizer) -- generate -> evaluate -> refine

**Verdict: COVERED**

---

### 17. Subagent context management: explicit context passing, structured state persistence, crash recovery with manifests

- **Explicit context passing**: COVERED in `agent-sdk-official.md`, Section 9 -- what subagents inherit vs don't; summary-only return
- **Structured state persistence**: COVERED in `d5-context-reliability-official.md`, Section 7 -- progress.txt, tests.json patterns; subagent persistent memory (user/project/local scopes)
- **Crash recovery with manifests**: COVERED in `d5-context-reliability-official.md`, Section 9 -- two-agent architecture (initializer + coding agent), session startup recovery sequence, git as recovery mechanism, state validation on recovery

**Verdict: COVERED**

---

### 18. Tool interface design: descriptions, splitting vs consolidating, naming

- **Descriptions**: COVERED in `d2-tool-design-mcp-official.md`, Section 1 -- "extremely detailed descriptions", 3-4 sentences minimum
- **Splitting vs consolidating**: COVERED in `d2-tool-design-mcp-official.md`, Section 11 -- "consolidate related operations into fewer tools with action parameter"; ideal 4-5 tools per agent
- **Naming**: COVERED in `d2-tool-design-mcp-official.md`, Section 1 -- meaningful namespacing, regex pattern `^[a-zA-Z0-9_-]{1,64}$`

**Verdict: COVERED**

---

### 19. MCP tool and resource design: resources for catalogs, tools for actions

- **Resources for catalogs**: COVERED in `d2-tool-design-mcp-official.md`, Section 5.2 -- application-driven, URI-based, subscribe for changes, templates for parameterized resources
- **Tools for actions**: COVERED in `d2-tool-design-mcp-official.md`, Section 5.1 -- model-controlled, tool annotations (readOnlyHint, destructiveHint, etc.)
- **Design distinction**: COVERED in `d2-tool-design-mcp-official.md`, Section 5 overview table -- Tools = model-controlled, Resources = application-driven, Prompts = user-controlled

**Verdict: COVERED**

---

### 20. MCP server configuration: project vs user scope, env var expansion, multi-server

- **Project vs user scope**: COVERED in `d2-tool-design-mcp-official.md`, Section 7 -- three scopes (local, project, user) with precedence
- **Env var expansion**: COVERED in `d2-tool-design-mcp-official.md`, Section 8 -- `${VAR}` and `${VAR:-default}` in all config fields
- **Multi-server**: COVERED in `d2-tool-design-mcp-official.md`, Section 7 -- multiple servers in .mcp.json; `d3-claude-code-config-official.md` Section 10 -- `--mcp-config` for additional servers

**Verdict: COVERED**

---

### 21. Error handling: structured error responses, transient/business/permission errors, local recovery

- **Structured error responses**: COVERED in `d1-agentic-architecture-official.md`, Section 4.4 -- is_error flag, instructive error messages
- **Transient/business/permission errors**: PARTIAL -- Transient errors (rate limits, server errors) covered in `d4-prompting-structured-output-official.md` Section 10.1; business logic errors covered in `d2-tool-design-mcp-official.md` Section 6 (MCP isError). However, the three-way classification (transient/business/permission) as a formal taxonomy is not explicitly laid out in any single document.
- **Local recovery**: COVERED in `d5-context-reliability-official.md`, Section 11 -- "agents should attempt recovery locally before escalating"; poka-yoke principles; `d1-agentic-architecture-official.md` Section 4.4 -- Claude retries 2-3 times

**Verdict: PARTIAL -- the transient/business/permission error taxonomy is not formally presented as a classification framework**

---

### 22. Escalation: explicit criteria, honoring customer preferences, policy gaps

- **Explicit criteria**: COVERED in `d5-context-reliability-official.md`, Section 10 -- explicit criteria-based escalation, checkpoints, stopping conditions
- **Honoring customer preferences**: PARTIAL -- The routing pattern (classify and direct to specialized handlers) is covered. Customer preference honoring is implied in the customer support guide (`platform-features-official.md` Section 10) but not deeply treated as an escalation principle.
- **Policy gaps**: PARTIAL -- The concept of escalating when encountering policy gaps (situations not covered by existing rules) is not explicitly documented. The research covers escalation at blockers and checkpoints but does not name "policy gaps" as an escalation trigger.

**Verdict: PARTIAL -- customer preference honoring and policy gap escalation not explicitly documented**

---

### 23. CLAUDE.md: hierarchy, @import, .claude/rules/ with glob patterns

- **Hierarchy**: COVERED in `d3-claude-code-config-official.md`, Section 1.2 -- managed policy, project, user, local; resolution order; walking up directory tree
- **@import**: COVERED in `d3-claude-code-config-official.md`, Section 1.3 -- `@path/to/file` syntax, relative/absolute paths, max 5 hops
- **.claude/rules/ with glob patterns**: COVERED in `d3-claude-code-config-official.md`, Section 2 -- YAML frontmatter `paths:` field, glob pattern examples

**Verdict: COVERED**

---

### 24. Custom commands and skills: project vs user scope, context: fork, allowed-tools, argument-hint

- **Project vs user scope**: COVERED in `d3-claude-code-config-official.md`, Section 4.3 -- project (`.claude/skills/`) vs personal (`~/.claude/skills/`); priority order
- **context: fork**: COVERED in `d3-claude-code-config-official.md`, Section 4.4 and 4.10 -- runs skill in forked subagent context
- **allowed-tools**: COVERED in `d3-claude-code-config-official.md`, Section 4.4 -- space-separated string or YAML list
- **argument-hint**: COVERED in `d3-claude-code-config-official.md`, Section 4.4 -- `argument-hint: "[issue-number]"`

**Verdict: COVERED**

---

### 25. Plan mode vs direct execution: complexity assessment, architectural decisions

- **Plan mode**: COVERED in `d3-claude-code-config-official.md`, Section 7 -- read-only exploration, no modification risk
- **Complexity assessment**: COVERED in `claude-code-advanced-official.md`, Section 9 -- "Explore -> Plan -> Implement -> Commit" workflow; plan mode for understanding architecture before changing
- **Architectural decisions**: COVERED in `d3-claude-code-config-official.md`, Section 7.3 -- "Researching codebase before implementing changes; Understanding architecture before making decisions"

**Verdict: COVERED**

---

### 26. Iterative refinement: input/output examples, test-driven iteration, interview pattern

- **Input/output examples**: COVERED in `d3-claude-code-config-official.md`, Section 13.1 -- examples in SKILL.md for consistent behavior
- **Test-driven iteration**: COVERED in `d3-claude-code-config-official.md`, Section 13.2 -- skill defines task, PostToolUse hook runs tests, Claude iterates until tests pass
- **Interview pattern**: COVERED in `d3-claude-code-config-official.md`, Section 13.3 -- `$ARGUMENTS` with `disable-model-invocation: true` for structured workflows; also `claude-code-advanced-official.md` Section 9 -- AskUserQuestion tool for requirements gathering

**Verdict: COVERED**

---

### 27. Structured output via tool_use: schema design, tool_choice, nullable fields

- **Schema design**: COVERED in `d4-prompting-structured-output-official.md`, Section 4 -- tool_use with JSON schemas; `input_schema` with properties, required, types
- **tool_choice**: COVERED in `d4-prompting-structured-output-official.md`, Section 6 -- exact JSON syntax for auto/any/tool/none; disable_parallel_tool_use
- **Nullable fields**: COVERED in `d4-prompting-structured-output-official.md`, Section 3.3 -- `null` type supported; `anyOf` for union types

**Verdict: COVERED**

---

### 28. Few-shot prompting: ambiguous targeting, format consistency, false positive reduction

- **Ambiguous targeting**: COVERED in `d4-prompting-structured-output-official.md`, Section 2 -- diverse examples covering edge cases to disambiguate
- **Format consistency**: COVERED in `d4-prompting-structured-output-official.md`, Section 2 -- examples steer output format, wrapped in `<example>` tags
- **False positive reduction**: COVERED in `d4-prompting-structured-output-official.md`, Section 12.3 -- separate finding stage (high recall) from filtering stage (high precision); confidence and severity for downstream filtering

**Verdict: COVERED**

---

### 29. Batch processing: appropriateness, latency tolerance, failure handling by custom_id

- **Appropriateness**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.1 -- 50% savings, no latency SLA, independent requests, no streaming
- **Latency tolerance**: COVERED in `d4-prompting-structured-output-official.md`, Section 8.1 -- "No guaranteed latency; async processing"; up to 24 hours
- **Failure handling by custom_id**: COVERED in `d4-prompting-structured-output-official.md`, Section 9.2 -- use custom_id to identify failures, create new batch with only failed requests

**Verdict: COVERED**

---

### 30. Context window optimization: trimming tool outputs, structured fact extraction, position-aware ordering

- **Trimming tool outputs**: COVERED in `d5-context-reliability-official.md`, Section 4 (Strategy 1) -- "one of the safest, lightest touch forms of compaction"; `platform-features-official.md` Section 2 -- `clear_tool_uses_20250919` for server-side tool result clearing
- **Structured fact extraction**: COVERED in `d5-context-reliability-official.md`, Section 4 (Strategy 2) -- XML tags for document structure; `d4-prompting-structured-output-official.md` Section 1.6 -- quote extraction pattern
- **Position-aware ordering**: COVERED in `d5-context-reliability-official.md`, Section 3 -- put data at top, queries at bottom (30% improvement)

**Verdict: COVERED**

---

### 31. Human review workflows: confidence calibration, stratified sampling, accuracy segmentation

- **Confidence calibration**: PARTIAL -- Field-level confidence (high/medium/low) is documented in `d5-context-reliability-official.md` Section 12, but the process of calibrating confidence scores against labeled ground truth is not explicitly described.
- **Stratified sampling**: COVERED in `d5-context-reliability-official.md`, Section 12 -- sample from different confidence tiers with varying rates
- **Accuracy segmentation**: COVERED in `d5-context-reliability-official.md`, Section 12 -- segment by document type, field type, source quality

**Verdict: PARTIAL -- confidence calibration process not explicitly described**

---

### 32. Information provenance: claim-source mappings, temporal data, conflict annotation, coverage gaps

- **Claim-source mappings**: COVERED in `d5-context-reliability-official.md`, Section 13 -- track which claims from which sources; XML tags for provenance
- **Temporal data**: COVERED in `d5-context-reliability-official.md`, Section 13 -- track publication dates, flag outdated information
- **Conflict annotation**: COVERED in `d5-context-reliability-official.md`, Section 13 -- note conflicts explicitly, report each source with attribution
- **Coverage gaps**: COVERED in `d5-context-reliability-official.md`, Section 13 -- report what was NOT found; distinguish "not found" vs "confirmed absent"

**Verdict: COVERED**

---

## SUMMARY

| # | Item | Status |
|---|------|--------|
| 1 | Claude Agent SDK | COVERED |
| 2 | MCP | COVERED |
| 3 | Claude Code | COVERED |
| 4 | Claude Code CLI | COVERED |
| 5 | Claude API | COVERED |
| 6 | Message Batches API | COVERED |
| 7 | JSON Schema | PARTIAL -- "other"+detail pattern not explicit |
| 8 | Pydantic | PARTIAL -- semantic errors not named |
| 9 | Built-in tools | COVERED |
| 10 | Few-shot prompting | COVERED |
| 11 | Prompt chaining | COVERED |
| 12 | Context window management | COVERED |
| 13 | Session management | COVERED |
| 14 | Confidence scoring | PARTIAL -- calibration with labeled sets not explicit |
| 15 | Agentic loop implementation | COVERED |
| 16 | Multi-agent orchestration | COVERED |
| 17 | Subagent context management | COVERED |
| 18 | Tool interface design | COVERED |
| 19 | MCP tool and resource design | COVERED |
| 20 | MCP server configuration | COVERED |
| 21 | Error handling | PARTIAL -- transient/business/permission taxonomy not formal |
| 22 | Escalation | PARTIAL -- customer preferences, policy gaps not explicit |
| 23 | CLAUDE.md | COVERED |
| 24 | Custom commands and skills | COVERED |
| 25 | Plan mode vs direct execution | COVERED |
| 26 | Iterative refinement | COVERED |
| 27 | Structured output via tool_use | COVERED |
| 28 | Few-shot prompting (topics) | COVERED |
| 29 | Batch processing | COVERED |
| 30 | Context window optimization | COVERED |
| 31 | Human review workflows | PARTIAL -- confidence calibration process not explicit |
| 32 | Information provenance | COVERED |

### Totals

- **COVERED**: 26 of 32 items (81%)
- **PARTIAL**: 6 of 32 items (19%)
- **MISSING**: 0 of 32 items (0%)

### Gaps Requiring Supplementary Material

1. **JSON Schema "other"+detail pattern** (#7): Add a section showing the common pattern of `enum: ["category_a", "category_b", "other"]` paired with a nullable `detail` string field for open-ended input.

2. **Pydantic semantic errors** (#8): Add content distinguishing schema-level validation errors (type/format) from semantic errors (schema-valid but logically incorrect, e.g., end_date before start_date) and how to build validation-retry loops that catch both.

3. **Confidence calibration with labeled sets** (#14, #31): Add content describing the calibration process: running the model on labeled ground-truth data, measuring predicted-vs-actual confidence accuracy, and adjusting thresholds or prompts based on calibration results.

4. **Error taxonomy: transient/business/permission** (#21): Add a formal three-category error classification framework with handling strategies for each: transient (retry with backoff), business logic (return to user), permission (escalate/authenticate).

5. **Escalation: customer preferences and policy gaps** (#22): Add content on honoring stated customer escalation preferences (e.g., "always escalate billing issues to a human") and handling policy gaps (situations where no existing rule applies, requiring human judgment).
