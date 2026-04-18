# Topics Audit Report

> **Date**: 2026-04-17
> **Auditor**: Educational Research Agent (Claude Opus 4.6)
> **Scope**: 38 learn topics across 5 domains audited against 9 research files, 11 Skilljar courses, and VALIDATION-REPORT.md
> **Generated topics**: d1 (8), d2 (8), d3 (8), d4 (7), d5 (7)

---

## Part 1: Per-Topic Content Audit

### Domain 1: Agentic Architecture & Orchestration (8 topics)

#### d1-agentic-loop — The Agentic Loop Lifecycle
**Depth Rating**: RICH

**Correctly Covered**:
- 5-step client-side loop keyed on stop_reason
- All 6 stop_reason values with correct handlers (end_turn, tool_use, max_tokens, stop_sequence, pause_turn, refusal)
- Three tool execution categories with correct schema authors and execution models
- server_tool_use vs tool_use blocks with correct ID prefixes (srvtoolu_ vs toolu_)
- pause_turn handling (re-send conversation, preserve tool state)
- Loop guards (max iterations, token budget, cost budget, timeout)
- Code example with agentic loop pattern

**Missing from Research**:
- Server-side loop default iteration limit is 10 (mentioned in platform-features-official.md but not explicit in topic)
- `model_context_window_exceeded` stop_reason from platform-features-official.md (7th stop reason not in topic's table of 6)
- `compaction` stop_reason (from pause_after_compaction feature) from platform-features-official.md

**Contradictions**: None found.

---

#### d1-tool-use-contract — Tool Use Message Contract
**Depth Rating**: RICH

**Correctly Covered**:
- tool_use and tool_result block structure with all fields
- Critical ordering rules (tool_result must immediately follow, tool_result blocks first in content array)
- Content formats (string, text block array, document block, image block, empty)
- Error handling with is_error flag
- Claude's 2-3 retry behavior
- Parallel tool results in single message
- disable_parallel_tool_use behavior matrix

**Missing from Research**:
- Nothing significant missing. This topic is comprehensive.

**Contradictions**: None found.

---

#### d1-tool-categories — Tool Categories and Configuration
**Depth Rating**: RICH

**Correctly Covered**:
- Three tool categories deep dive
- tool_choice (auto/any/tool/none) with extended thinking restrictions
- Prefill behavior with any/tool
- strict: true with grammar-constrained sampling, 24h cache, PHI warnings
- defer_loading and prompt cache preservation
- allowed_callers values
- Tool token overhead per model
- Optional tool definition properties table
- Tool name regex

**Missing from Research**:
- `eager_input_streaming` property mentioned in research but included in the optional properties table
- `tool_search` listed as a server-executed tool in research (d1 research mentions `tool_search_tool_regex_20251119`)

**Contradictions**: None found.

---

#### d1-workflow-patterns — Workflow and Agent Patterns
**Depth Rating**: RICH

**Correctly Covered**:
- Workflows vs Agents distinction (predefined vs dynamic)
- All 5 workflow patterns: prompt chaining, routing, parallelization (sectioning/voting), orchestrator-workers, evaluator-optimizer
- Autonomous agents with environmental feedback loops
- Three principles: simplicity, transparency, ACI
- Poka-yoke concept with SWE-bench example
- When NOT to use agents
- Framework guidance (start with direct API calls)
- Key Anthropic quotes

**Missing from Research**:
- The "regex extraction" heuristic quote is present. Coverage is comprehensive.

**Contradictions**: None found.

---

#### d1-multi-agent — Multi-Agent Orchestration
**Depth Rating**: RICH

**Correctly Covered**:
- Coordinator-subagent pattern with 5-step workflow
- Context isolation (what subagent receives and does NOT receive)
- Agent Teams experimental feature with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
- One-level delegation constraint (hard architectural limit)
- Summary return size (1,000-2,000 tokens)
- Chaining vs parallel subagents
- Foreground vs background subagents with permission differences
- Task tool rename to Agent in v2.1.63

**Missing from Research**:
- Agent Teams display modes (in-process vs split panes, tmux requirement) from claude-code-advanced-official.md
- Agent Teams task claiming uses file locking from claude-code-advanced-official.md
- Agent Teams recommended 3-5 teammates, 5-6 tasks per teammate
- Agent Teams hooks (TeammateIdle, TaskCreated, TaskCompleted) from claude-code-advanced-official.md
- Managed agents concept (separate from Claude Code subagents) from managed-agents-official.md

**Contradictions**: None found.

---

#### d1-subagent-config — Subagent Definition and Configuration
**Depth Rating**: RICH

**Correctly Covered**:
- Markdown + YAML frontmatter format
- All 16 frontmatter fields documented in table
- Only name and description required
- Built-in subagents (Explore, Plan, general-purpose) with models/tools
- Scope priority (Managed > CLI > Project > User > Plugin)
- Model resolution order (env var > invocation > frontmatter > main)
- Tool restrictions (tools/disallowedTools/Agent() syntax)
- Permission inheritance rules
- Memory scopes (user/project/local) with paths
- Worktree isolation
- Plugin security restrictions (silently ignores hooks, mcpServers, permissionMode)

**Missing from Research**:
- `cd` commands within subagents do NOT persist between Bash/PowerShell tool calls (from skilljar-subagents.md)
- `cd` commands do NOT affect the main conversation's working directory

**Contradictions**: None found.

---

#### d1-hooks — Hooks: Deterministic Enforcement
**Depth Rating**: RICH

**Correctly Covered**:
- 26 hook event types across categories
- Four handler types (command, http, prompt, agent) with default timeouts
- Exit codes 0/1/2 with critical note about exit code 1 NOT blocking
- PreToolUse permissionDecision priority (deny > defer > ask > allow)
- updatedInput for parameter modification
- Matcher patterns (exact/pipe/regex)
- MCP tool naming (mcp__server__tool)
- Config locations and scope
- Environment variables
- Async hooks (async: true, asyncRewake: true)
- Hook output limit (10,000 characters)

**Missing from Research**:
- The `once: true` property for hooks in skills context (mentioned in skills but not hooks topic directly)

**Contradictions**: None found.

---

#### d1-programmatic-enforcement — Deterministic vs Probabilistic Control
**Depth Rating**: RICH

**Correctly Covered**:
- Three layers: hooks (100% deterministic), prompts (probabilistic), strict: true (API-level)
- Comparison table with guarantee levels, bypass risk, latency, flexibility, configuration, scope
- Use cases for each layer
- Defense in depth pattern (combine all three)
- Managed hooks cannot be disabled by user/project settings

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

### Domain 2: Tool Design & MCP Integration (8 topics)

#### d2-tool-interfaces — Tool Definition Best Practices
**Depth Rating**: ADEQUATE

**Correctly Covered**:
- Tool definition schema (name, description, input_schema, input_examples)
- Description best practices (3-4 sentences, single most important factor)
- Consolidation with action parameters
- Namespacing conventions
- Tool name regex
- Tool response design (high-signal, stable identifiers)
- input_examples constraints (validate against schema, not for server tools, token costs)
- Ideal tool count (4-5 per agent)

**Missing from Research**:
- The "poka-yoke" tool design principles (covered in d1-workflow-patterns but relevant here)
- Tool description should include when NOT to use the tool

**Contradictions**: None found.

---

#### d2-tool-choice — tool_choice and Parallel Tool Use
**Depth Rating**: RICH

**Correctly Covered**:
- Four options with JSON syntax
- Prefill behavior with any/tool
- Extended thinking restrictions
- disable_parallel_tool_use behavior matrix
- Token overhead per model
- Correct/wrong parallel result formatting

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d2-strict-tool-use — Strict Tool Use and Structured Guarantees
**Depth Rating**: RICH

**Correctly Covered**:
- Two requirements (strict: true + additionalProperties: false)
- Grammar-constrained sampling mechanism
- Schema caching (24h)
- PHI/HIPAA restrictions
- Complexity limits (20 tools, 24 optional params, 16 unions, 180s timeout)
- strict + tool_choice:any combination
- Three enforcement categories

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d2-error-responses — Error Handling in Tool Use
**Depth Rating**: RICH

**Correctly Covered**:
- is_error:true pattern
- Instructive error messages best practice
- Claude's 2-3 retry self-correction
- Server tool error codes
- Access failure vs valid empty result distinction
- Local recovery before escalation
- MCP two error mechanisms (protocol JSON-RPC vs execution isError)

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d2-mcp-architecture — MCP Architecture and Primitives
**Depth Rating**: RICH

**Correctly Covered**:
- Three MCP primitives with control models (Tools=Model, Resources=Application, Prompts=User)
- Tool annotations (readOnlyHint, destructiveHint, idempotentHint, openWorldHint with defaults)
- Resource templates using RFC 6570
- Two error mechanisms
- Content annotations (audience, priority, lastModified)
- MCP Sampling with human-in-the-loop requirement
- MCP Roots

**Missing from Research**:
- MCP Handshake 3-step sequence (Initialize Request -> Initialize Result -> Initialized Notification) from d2 research
- outputSchema field for tools (mentioned in research but not in topic)
- Tool pagination support (cursor) for tools/list

**Contradictions**: None found.

---

#### d2-mcp-transports — MCP Transports and Communication
**Depth Rating**: RICH

**Correctly Covered**:
- JSON-RPC 2.0 over UTF-8
- Three message types (Request, Response, Notification)
- stdio transport details (stdin/stdout/stderr, newline-delimited)
- Streamable HTTP (correct naming, replaces deprecated SSE)
- Session management (Mcp-Session-Id)
- Security requirements (Origin validation, localhost binding)
- Resumability (Last-Event-ID)
- Claude Code exponential backoff reconnection (1s->2s->4s->8s->16s, 5 attempts)

**Missing from Research**:
- MCP-Protocol-Version header requirement (2025-06-18) mentioned but could be more prominent
- stdio servers NOT auto-reconnected (mentioned in table but worth emphasizing)

**Contradictions**: None found.

---

#### d2-mcp-config — MCP Server Configuration in Claude Code
**Depth Rating**: RICH

**Correctly Covered**:
- Three scopes (local, project, user) with storage locations
- Scope precedence (local > project > user > plugin > claude.ai)
- CLI commands (add, list, get, remove, reset-project-choices)
- Environment variable expansion (${VAR} and ${VAR:-default})
- managed-mcp.json paths and behavior
- Tool search (ENABLE_TOOL_SEARCH) values and model requirements
- MCP output limits (10K warning, 25K default, 500K max per-tool)
- MCP_TIMEOUT env var

**Missing from Research**:
- The naming gotcha (MCP "local" scope stores in ~/.claude.json, not .claude/settings.local.json) is covered with callout

**Contradictions**: None found.

---

#### d2-builtin-tools — Claude Code Built-in Tools
**Depth Rating**: RICH

**Correctly Covered**:
- Six core tools (Read, Write, Edit, Bash, Grep, Glob) with selection criteria
- Tool selection over shell equivalents table
- Additional tools (ToolSearch, WebFetch, WebSearch, Agent, Skill, Monitor, PowerShell, NotebookEdit)
- Agent SDK tools/allowedTools/disallowedTools distinction
- Tool annotations for custom tools (readOnlyHint for parallel execution)
- Prefer tools over disallowedTools best practice

**Missing from Research**:
- Several tools from claude-code-advanced-official.md not listed: CronCreate/CronDelete/CronList, EnterPlanMode/ExitPlanMode, EnterWorktree/ExitWorktree, LSP, SendMessage, TaskCreate/TaskGet/TaskList/TaskUpdate/TaskStop, TeamCreate/TeamDelete, TodoWrite, AskUserQuestion, ListMcpResourcesTool, ReadMcpResourceTool
- Bash tool behavior details: cd carry-over, env vars don't persist, read-only commands list, process wrapper stripping

**Contradictions**: None found.

---

### Domain 3: Claude Code Configuration & Workflows (8 topics)

#### d3-claude-md — CLAUDE.md Hierarchy and Memory System
**Depth Rating**: RICH

**Correctly Covered**:
- Four scopes (managed policy, project, user, local) with locations
- Managed policy cannot be excluded
- Directory walk-up behavior
- @import syntax (@path/to/file, not @import)
- Recursive imports max 5 hops
- Relative path resolution (from containing file)
- claudeMdExcludes setting
- AGENTS.md compatibility
- Auto memory (MEMORY.md) with 200 lines/25KB limit
- Compaction behavior (project-root survives, subdirectory does not)
- /init command
- Writing effective instructions (under 200 lines)

**Missing from Research**:
- HTML comments stripped before injection (except inside code blocks) from d3 research
- CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 for --add-dir CLAUDE.md loading
- autoMemoryDirectory setting from d3 research
- Auto memory requires Claude Code v2.1.59+

**Contradictions**: None found.

---

#### d3-rules — Rules Directory and Path-Scoped Instructions
**Depth Rating**: ADEQUATE

**Correctly Covered**:
- .claude/rules/ directory structure
- Unconditional vs path-triggered rules
- YAML frontmatter paths with glob patterns
- User-level rules at ~/.claude/rules/
- Priority and loading behavior
- Symlinks supported

**Missing from Research**: Nothing significant beyond what's covered.

**Contradictions**: None found.

---

#### d3-skills — Skills System
**Depth Rating**: RICH

**Correctly Covered**:
- Progressive disclosure (three-tier loading)
- Directory structure
- Commands-to-skills merger (skill takes precedence)
- Skill locations with priority order
- All SKILL.md frontmatter fields (14+)
- String substitutions ($ARGUMENTS, $N, ${CLAUDE_SESSION_ID}, ${CLAUDE_SKILL_DIR})
- Dynamic context injection (!`command`)
- Invocation control matrix (disable-model-invocation, user-invocable)
- context:fork and agent field
- Compaction budget (5K per skill, 25K total)
- Description budget (1% of context window, 8K fallback, 1,536 per-entry cap)
- Extended thinking ("ultrathink" keyword)

**Missing from Research**:
- Live change detection (skills discovered in real-time without restart) from skilljar-agent-skills.md
- Automatic discovery from nested directories (monorepo support) from skilljar-agent-skills.md
- Skills from additional directories (--add-dir) from skilljar-agent-skills.md
- Agent Skills open standard (agentskills.io) cross-tool compatibility from skilljar-agent-skills.md
- disableSkillShellExecution setting mentioned but could be more prominent

**Contradictions**: None found.

---

#### d3-plan-mode — Plan Mode and Permission Modes
**Depth Rating**: RICH

**Correctly Covered**:
- Six permission modes with correct descriptions
- Plan mode as read-only subagent
- Auto mode classifier behavior (blocks/allows table)
- Auto mode fallback (3 consecutive or 20 total blocks)
- Permission rule syntax (Tool/Tool(specifier) with wildcards)
- Permission evaluation order (deny > ask > allow)
- Protected paths
- Shift+Tab mode cycling
- Ctrl+G for plan editing

**Missing from Research**:
- acceptEdits includes specific filesystem commands (mkdir, touch, mv, cp, rm, rmdir, sed) - partially listed in summary but not in the table

**Contradictions**: None found.

---

#### d3-cli — CLI Flags and Session Management
**Depth Rating**: RICH

**Correctly Covered**:
- Core commands (claude, claude -p, claude -c, claude -r)
- Print mode flags (--output-format, --max-turns, --max-budget-usd, --json-schema, --no-session-persistence, --fallback-model)
- Session management flags (--continue, --resume, --fork-session, --name, --from-pr)
- System prompt flags (--system-prompt replaces, --append-system-prompt appends; mutually exclusive)
- Tool restriction (--tools, --allowedTools, --disallowedTools)
- --bare mode
- --worktree flag
- --agent, --mcp-config, --add-dir, --permission-mode, --effort, --model flags

**Missing from Research**:
- `claude doctor` for verification from skilljar-claude-code-101.md
- `claude auto-mode defaults` command listed in core commands table
- `claude agents` command listed in core commands table
- Streaming events detail (system/api_retry, system/init, error categories) from claude-code-advanced-official.md

**Contradictions**: None found.

---

#### d3-cicd — CI/CD and GitHub Actions Integration
**Depth Rating**: RICH

**Correctly Covered**:
- claude-code-action@v1 setup
- @claude trigger (not /claude)
- Action parameters (prompt, claude_args, anthropic_api_key, github_token, trigger_phrase, use_bedrock, use_vertex)
- CLI args passthrough
- Cloud provider support (AWS Bedrock OIDC, Google Vertex AI WIF)
- Routines (scheduled, API, GitHub triggers)
- Routine use cases

**Missing from Research**:
- Routines clone repos from default branch every run
- Claude creates claude/-prefixed branches by default in routines
- Each GitHub event match starts a new session (no session reuse)
- /install-github-app quick setup path
- /schedule command for routine management

**Contradictions**: None found.

---

#### d3-agent-sdk — Claude Agent SDK
**Depth Rating**: RICH

**Correctly Covered**:
- SDK vs Client SDK vs CLI distinction
- Installation (npm/pip)
- query() entry point with Python and TypeScript examples
- 5 message types (System, Assistant, User, StreamEvent, Result)
- ResultMessage subtypes (success, error_max_turns, error_max_budget_usd, error_during_execution, error_max_structured_output_retries)
- Custom tools via @tool decorator and create_sdk_mcp_server()
- Tool naming convention (mcp__server__tool)
- Permission modes in SDK (auto is TS-only)
- Programmatic vs filesystem hooks distinction
- settingSources
- Session management differences (Python ClaudeSDKClient vs TS continue: true)
- Python vs TypeScript key differences table

**Missing from Research**:
- Opus 4.7 requires Agent SDK v0.2.111+ from agent-sdk-official.md
- Branding guidelines (allowed/not allowed naming) from agent-sdk-official.md
- AskUserQuestion and TodoWrite tools from agent-sdk-official.md
- Managed Agents concept (separate API product at platform.claude.com) from managed-agents-official.md — this is a completely separate feature not covered by any topic

**Contradictions**: None found.

---

#### d3-settings — Settings System and .claude Directory
**Depth Rating**: RICH

**Correctly Covered**:
- Five-layer precedence (Managed > CLI > Local > Project > User)
- Managed settings delivery (server, MDM/OS-level, file-based)
- Array merge vs scalar override
- .claude directory structure with committed/gitignored status
- User-level files (~/.claude/)
- Global config (~/.claude.json)
- Sandbox settings
- /status and /config verification

**Missing from Research**:
- Drop-in directory (managed-settings.d/) mentioned in text but could be more prominent
- Windows registry paths for managed settings (HKLM vs HKCU precedence)
- JSON schema validation URL

**Contradictions**: None found.

---

### Domain 4: Prompt Engineering & Structured Output (7 topics)

#### d4-prompting-best-practices — Prompting Best Practices
**Depth Rating**: RICH

**Correctly Covered**:
- Be clear and direct (brilliant new employee analogy)
- Add context (explain why)
- XML tags for structure
- Role prompting in system prompt
- Long context ordering (data top, query bottom, 30% improvement)
- Ground in quotes before analysis
- Prefill deprecation (4.6+, 400 on Mythos Preview)
- Format control techniques (4 ordered)

**Missing from Research**:
- "Think thoroughly" vs prescriptive steps guidance from d4 research
- Opus 4.5 sensitivity to the word "think" from d4 research
- Prompt chaining pattern (self-correction: generate -> review -> refine) largely moved to d4-multi-instance-review

**Contradictions**: None found.

---

#### d4-few-shot — Few-Shot and Multishot Prompting
**Depth Rating**: RICH

**Correctly Covered**:
- 3-5 examples recommendation
- Example quality criteria (relevant, diverse, structured)
- <example>/<examples> tags
- <thinking> tags in examples for reasoning patterns
- Anti-hallucination patterns (ground in quotes, require file reading, "I don't know" examples)
- Practical classification example

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d4-structured-output — Structured Output: JSON and Tool-Based
**Depth Rating**: RICH

**Correctly Covered**:
- output_config.format with json_schema
- additionalProperties: false required
- Schema requirements and limitations table
- Complexity limits (20 strict tools, 24 optional params, 16 unions, 180s timeout)
- Guarantees and exceptions (refusals, max_tokens)
- output_config.format vs tool_use comparison
- SDK helpers (Pydantic, Zod)
- Grammar compilation and 24h cache
- Citations incompatible with output_config.format

**Missing from Research**:
- SDK helpers for Java, Ruby, PHP, C#, Go from d4 research
- Legacy output_format parameter still accepted
- ZDR eligibility
- Message prefilling incompatible with JSON outputs

**Contradictions**: None found.

---

#### d4-adaptive-thinking — Extended and Adaptive Thinking
**Depth Rating**: RICH

**Correctly Covered**:
- Adaptive thinking configuration (thinking.type: "adaptive" + output_config.effort)
- Five effort levels including xhigh (Opus 4.7 only)
- budget_tokens deprecation (400 on Opus 4.7, deprecated on 4.6)
- Thinking display modes (summarized/omitted) with billing
- Interleaved thinking
- Multi-turn thinking pass-back requirements
- Cannot toggle mid-turn (graceful degradation)
- Prompt caching with thinking
- tool_choice restrictions with extended thinking

**Missing from Research**:
- Signature field for continuity across turns mentioned but could explain encrypted full thinking purpose more
- Cache TTL recommendation: "1h" for extended thinking

**Contradictions**: None found.

---

#### d4-batch-processing — Message Batches API
**Depth Rating**: RICH

**Correctly Covered**:
- 50% cost savings
- 24-hour window, no latency SLA
- Max 100K requests or 256 MB
- custom_id requirements (same regex as tool names)
- Processing states (in_progress, canceling, ended)
- Result types (succeeded/errored/canceled/expired, only succeeded billed)
- Error handling with code examples
- Prompt caching with batches (30-98% hit rates)
- Extended output (300K tokens with beta header)
- API endpoints

**Missing from Research**:
- Results available for 29 days (mentioned in topic)
- Cannot modify after submission (mentioned in topic)

**Contradictions**: None found.

---

#### d4-multi-instance-review — Multi-Pass Review and Explicit Criteria
**Depth Rating**: RICH

**Correctly Covered**:
- Self-review limitations
- Generate-Review-Refine pattern with separate API calls
- Finding pass (recall) vs filtering pass (precision)
- Opus 4.7 literal interpretation
- Per-file + cross-file passes
- Confidence and severity dimensions
- Opus 4.7: 11pp better recall on bug-finding

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d4-messages-api — Messages API Reference
**Depth Rating**: RICH

**Correctly Covered**:
- Three required parameters (model, messages, max_tokens)
- Temperature default 1.0 (not 0.7)
- Key optional parameters table
- output_config syntax
- Content block types (user-side and assistant-side)
- Response fields with stop_reason values
- Cache control (5m default, 1h option)
- Service tier (auto/standard_only)
- Complete request example

**Missing from Research**:
- stop_reason: "model_context_window_exceeded" from platform-features-official.md not listed in the 5 values (topic shows 5 but research shows 7+)
- stop_reason: "compaction" from compaction feature
- metadata.user_id for abuse detection (UUID/hash, never PII) — mentioned in table but could be more prominent
- redacted_thinking block type mentioned in list

**Contradictions**: None found.

---

### Domain 5: Context Management & Reliability (7 topics)

#### d5-context-windows — Context Windows and Context Rot
**Depth Rating**: RICH

**Correctly Covered**:
- Model context windows table (1M for Mythos/Opus 4.7/4.6/Sonnet 4.6, 200K for others)
- Context window structure (input + output phases)
- Linear growth across turns
- Context rot as official Anthropic term
- N-squared degradation explanation
- Position effects (up to 30% improvement)
- Context awareness tags (budget:token_budget, system_warning)
- Image/PDF limits (600 vs 100)

**Missing from Research**:
- Context awareness available on Sonnet 4.6, Sonnet 4.5, Haiku 4.5 — correctly stated
- "More context is NOT automatically better" — covered
- Cooking show analogy — covered

**Contradictions**: None found.

---

#### d5-context-strategies — Context Management Strategies
**Depth Rating**: RICH

**Correctly Covered**:
- Five strategies (trim tool outputs, structured extraction, JIT retrieval, system prompt optimization, structured note-taking)
- Server-side compaction (compact_20260112) with parameters
- Minimum trigger 50K, default 150K
- Context editing (clear_tool_uses_20250919, clear_thinking_20251015)
- Thinking must be listed FIRST ordering rule
- /compact behavior in Claude Code
- Skills re-attachment budget (5K per, 25K total)
- Fresh start vs compact decision table
- Compaction token tracking (sum iterations)

**Missing from Research**:
- Beta header for compaction: `anthropic-beta: compact-2026-01-12` from platform-features-official.md
- pause_after_compaction returns stop_reason: "compaction" from platform-features-official.md
- Context editing beta header: `context-management-2025-06-27` from platform-features-official.md
- Tool result clearing configuration options (keep, clear_at_least, exclude_tools, clear_tool_inputs) from platform-features-official.md
- Memory tool integration with context editing from platform-features-official.md
- Client-side SDK compaction as alternative from platform-features-official.md
- Token counting endpoint (/v1/messages/count_tokens) supports context management from platform-features-official.md

**Contradictions**: None found.

---

#### d5-state-persistence — State Persistence and Crash Recovery
**Depth Rating**: RICH

**Correctly Covered**:
- progress.txt pattern (unstructured notes)
- tests.json pattern (structured state, only change status)
- Git as recovery mechanism
- Multi-context window workflow
- Two-Agent Architecture (Initializer + Coding Agent)
- Session startup sequence (pwd, read logs, review features, start server, verify)
- Context awareness prompt pattern

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d5-escalation — Escalation and Human Review Patterns
**Depth Rating**: RICH

**Correctly Covered**:
- Three escalation triggers (checkpoints, blockers, max iterations)
- Routing for specialized handlers
- Reversibility heuristic (reversible vs irreversible)
- Field-level confidence (High/Medium/Low)
- Stratified random sampling for QA
- Accuracy segmentation
- Code review harness (finding + filtering)
- Opus 4.7: 11pp recall improvement

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d5-error-propagation — Error Propagation in Agent Systems
**Depth Rating**: RICH

**Correctly Covered**:
- Compounding errors in autonomous systems
- Structured error context (failure type, attempted query, partial results, recovery action)
- Access failure vs valid empty result
- Local recovery before escalation
- Poka-yoke in tool design
- SWE-bench team spent more time on tools than prompts
- Self-check pattern

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d5-provenance — Information Provenance and Hallucination Prevention
**Depth Rating**: RICH

**Correctly Covered**:
- XML document tags with index and source for provenance
- Quote extraction pattern
- Conflicting statistics annotation
- Temporal data and publication dates
- Coverage gap reporting
- investigate_before_answering pattern
- Research best practices (competing hypotheses, confidence tracking, self-critique)
- Provenance-aware agent workflow

**Missing from Research**: Nothing significant.

**Contradictions**: None found.

---

#### d5-subagent-context — Subagent Delegation for Context Management
**Depth Rating**: RICH

**Correctly Covered**:
- Subagents as context management strategy
- Context savings example (6,100 in, 420 out, ~93%)
- Explore subagent (Haiku, read-only, thoroughness levels)
- Subagent persistent memory (user/project/local scopes, 200 lines/25KB)
- /btw alternative (full context, no tools, discarded)
- When NOT to use subagents
- Opus 4.6 over-delegation warning
- Subagent compaction (~95% capacity, independent)
- Context flow (what receives, what does not receive)

**Missing from Research**:
- Explore subagent skips loading CLAUDE.md for smaller context footprint (mentioned in skilljar-subagents.md)

**Contradictions**: None found.

---

## Part 2: Research Coverage Matrix

### d1-agentic-architecture-official.md
- **Used by topics**: d1-agentic-loop, d1-tool-use-contract, d1-tool-categories, d1-workflow-patterns, d1-multi-agent, d1-subagent-config, d1-hooks, d1-programmatic-enforcement
- **Coverage**: ~95%
- **Not covered**: model_context_window_exceeded stop_reason; compaction stop_reason

### d2-tool-design-mcp-official.md
- **Used by topics**: d2-tool-interfaces, d2-tool-choice, d2-strict-tool-use, d2-error-responses, d2-mcp-architecture, d2-mcp-transports, d2-mcp-config, d2-builtin-tools
- **Coverage**: ~93%
- **Not covered**: MCP handshake 3-step sequence (Initialize -> InitializeResult -> Initialized); outputSchema for MCP tools; tool pagination cursor

### d3-claude-code-config-official.md
- **Used by topics**: d3-claude-md, d3-rules, d3-skills, d3-plan-mode, d3-cli, d3-cicd, d3-agent-sdk, d3-settings
- **Coverage**: ~92%
- **Not covered**: HTML comment stripping; CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1; autoMemoryDirectory setting; auto memory version requirement v2.1.59+

### d4-prompting-structured-output-official.md
- **Used by topics**: d4-prompting-best-practices, d4-few-shot, d4-structured-output, d4-adaptive-thinking, d4-batch-processing, d4-multi-instance-review, d4-messages-api
- **Coverage**: ~94%
- **Not covered**: SDK helpers for Java/Ruby/PHP/C#/Go; legacy output_format parameter; Opus 4.5 word "think" sensitivity

### d5-context-reliability-official.md
- **Used by topics**: d5-context-windows, d5-context-strategies, d5-state-persistence, d5-escalation, d5-error-propagation, d5-provenance, d5-subagent-context
- **Coverage**: ~90%
- **Not covered**: Compaction beta header; pause_after_compaction stop_reason; context editing beta header; tool result clearing detailed configuration options; memory tool integration with context editing; token counting endpoint

### agent-sdk-official.md
- **Used by topics**: d3-agent-sdk, d2-builtin-tools
- **Coverage**: ~80%
- **Not covered**: Opus 4.7 requires SDK v0.2.111+; branding guidelines; AskUserQuestion tool; TodoWrite tool; complete built-in tools list from SDK docs; Monitor tool v2.1.98+ requirement; Bash tool cd carry-over behavior

### platform-features-official.md
- **Used by topics**: d5-context-strategies (partially), d4-messages-api (partially)
- **Coverage**: ~65%
- **Not covered**: Full compaction API details (beta header, pause_after_compaction stop_reason "compaction"); context editing full configuration (keep, clear_at_least, exclude_tools, clear_tool_inputs); memory tool integration with context editing; client-side SDK compaction; token counting endpoint; model_context_window_exceeded stop_reason

### claude-code-advanced-official.md
- **Used by topics**: d1-multi-agent (partially), d2-builtin-tools (partially), d3-cli (partially)
- **Coverage**: ~60%
- **Not covered**: Agent Teams detailed architecture (display modes, task claiming, hooks, recommended team size); complete tools reference list (30+ tools); Bash tool detailed behavior; LSP tool; CronCreate/CronDelete/CronList tools; headless mode streaming events detail

### managed-agents-official.md
- **Used by topics**: None directly
- **Coverage**: ~5%
- **CRITICAL GAP**: Claude Managed Agents is a completely separate API product (platform.claude.com/docs/en/managed-agents/) with its own agent/environment/session/event model. No topic covers this. Key concepts: agent_toolset_20260401, cloud environments, session streaming via SSE, managed infrastructure. Beta header: managed-agents-2026-04-01.

---

## Part 3: Skilljar Course Coverage

### Introduction to Agent Skills
- **Reflected in**: d3-skills
- **Missing**: Agent Skills open standard (agentskills.io) cross-tool compatibility; live change detection; automatic discovery from nested directories; skills from --add-dir directories

### Introduction to Subagents
- **Reflected in**: d1-multi-agent, d1-subagent-config, d5-subagent-context
- **Missing**: cd commands within subagents don't persist; cd doesn't affect main conversation working directory; 3 creation methods detailed walkthrough

### Claude Code in Action
- **Reflected in**: d3-claude-md, d3-cli, d3-plan-mode, d3-cicd, d1-hooks, d3-agent-sdk, d3-skills
- **Missing**: Drag-and-drop context; @ mentions for file references; # for quick memories; vim mode; /review and /pr workflow commands

### Claude Code 101
- **Reflected in**: d3-cli, d3-claude-md, d3-plan-mode
- **Missing**: Installation methods (native install, Homebrew, WinGet); system requirements; VS Code/JetBrains extensions; Desktop app; Web (claude.ai/code); claude doctor; Dispatch and Remote Control features

### Introduction to Model Context Protocol (MCP)
- **Reflected in**: d2-mcp-architecture, d2-mcp-transports, d2-mcp-config
- **Missing**: MCP Inspector tool (npx @modelcontextprotocol/inspector); MCP client implementation patterns (Python MCPClient class)

### MCP Advanced Topics
- **Reflected in**: d2-mcp-transports, d2-mcp-architecture
- **Missing**: Detailed MCP Sampling configuration (model preferences with hints, costPriority, speedPriority, intelligencePriority)

### Building with the Claude API
- **Reflected in**: d4-prompting-best-practices, d4-few-shot, d4-structured-output, d4-messages-api, d4-batch-processing, d2-tool-interfaces
- **Missing**: RAG pipeline (chunking strategies, text embeddings, Voyage AI, vector databases); eval workflow details; citations feature

### Introduction to Claude Cowork
- **Reflected in**: d3-claude-md, d3-plan-mode, d3-cli, d3-cicd
- **Missing**: Cowork concept (cloud vs desktop vs terminal); claude.ai/code web interface; --remote and --teleport flags; Dispatch feature; GitHub App /web-setup; cloud environments with network access/setup scripts

### Claude with Amazon Bedrock
- **Reflected in**: d3-cicd (Bedrock auth mentioned)
- **Missing**: Bedrock-specific API patterns (boto3 usage); model ID format (us.anthropic.claude-sonnet-4-6); OIDC authentication details; Bedrock-specific pricing/limits
- **Note**: This is a provider-specific course; core concepts overlap with general API topics

### Claude with Google Cloud's Vertex AI
- **Reflected in**: d3-cicd (Vertex auth mentioned)
- **Missing**: Vertex-specific API patterns (GCP SDK); model ID format (claude-sonnet-4-5@20250929); WIF authentication details
- **Note**: This is a provider-specific course; core concepts overlap with general API topics

### AI Fluency: Framework & Foundations
- **Reflected in**: None directly (foundational course)
- **Missing**: 4D Framework (Delegation, Description, Discernment, Diligence); Constitutional AI explanation; transformer architecture basics
- **Note**: This is a foundational literacy course, not directly CCA exam-relevant

### AI Capabilities and Limitations
- **Reflected in**: None directly (foundational course)
- **Missing**: Next token prediction mental model; knowledge vs working memory distinction; steerability concept; "When Properties Collide"
- **Note**: This is a foundational literacy course, not directly CCA exam-relevant

---

## Part 4: Critical Gaps

### GAP 1: Claude Managed Agents (HIGH)
**managed-agents-official.md** documents a complete, separate API product not covered by any topic. Key exam-relevant facts:
- Four core concepts: Agent, Environment, Session, Events
- Pre-built agent toolset (agent_toolset_20260401)
- Cloud container environments with network access and mounted files
- Session streaming via SSE events (agent.message, agent.tool_use, session.status_idle)
- Agent lifecycle (create, update with version tracking, archive)
- Beta header: managed-agents-2026-04-01
- Multi-agent orchestration via callable_agents (research preview)
- Rate limits: 60 creates/min, 600 reads/min
- SDK support: Python, TypeScript, Java, Go, C#, Ruby, PHP
- CLI tool: `ant` (Anthropic CLI)

**Recommendation**: Create a new topic (d1-managed-agents or d3-managed-agents) covering this API product.

### GAP 2: Additional stop_reason Values (MEDIUM)
Topics document 5-6 stop_reason values but platform-features-official.md lists at least 7:
- `model_context_window_exceeded` — reached model's context window limit
- `compaction` — from pause_after_compaction feature

### GAP 3: Context Editing Detailed Configuration (MEDIUM)
platform-features-official.md has detailed configuration options for context editing not in topics:
- Tool result clearing: keep, clear_at_least, exclude_tools, clear_tool_inputs options
- Thinking block clearing: keep parameter with thinking_turns or "all"
- Response format: context_management.applied_edits with cleared counts
- Token counting endpoint support
- Memory tool integration with context editing

### GAP 4: RAG Pipeline (LOW-MEDIUM)
The Building with the Claude API Skilljar course covers RAG extensively:
- Text chunking strategies (fixed-size, sentence, paragraph, semantic, recursive)
- Text embeddings with Voyage AI (recommended provider)
- Vector databases and top-K retrieval
- Full RAG pipeline (indexing + query phases)
- Citations feature for grounding

While RAG is not a core CCA domain, it appears in the API course which is part of the certification training path.

### GAP 5: MCP Inspector (LOW)
The MCP Inspector developer tool (npx @modelcontextprotocol/inspector) is covered in Skilljar but not in any topic. It is a practical tool for testing and debugging MCP servers.

### GAP 6: Claude Code Installation & Surfaces (LOW)
Claude Code 101 covers multiple installation methods and surfaces (terminal, VS Code, JetBrains, Desktop app, Web) that are not documented in topics. The `claude doctor` diagnostic command is also missing.

---

## Part 5: VALIDATION-REPORT.md Issues Check

### Status of All 14 Issues

| ID | Issue | Status in Topics |
|---|---|---|
| **H1** | "AgentDefinition" as formal API type, 7 fields | **FIXED** — d1-subagent-config correctly uses "subagent frontmatter," lists 16 fields, requires only name+description |
| **H2** | "Task tool" instead of "Agent tool" | **FIXED** — All topics use "Agent tool" with v2.1.63 rename noted |
| **H3** | Exam guide uses "AgentDefinition" | **ADDRESSED** — Topics use correct terminology while noting it is markdown+YAML |
| **M1** | "HTTP" should be "Streamable HTTP" | **FIXED** — d2-mcp-transports correctly uses "Streamable HTTP" |
| **M2** | @import syntax inconsistency | **FIXED** — d3-claude-md correctly uses @path/to/file syntax with all details |
| **M3** | Commands-to-skills merger not documented | **FIXED** — d3-skills documents the merger, skill takes precedence |
| **M4** | CLAUDE.md hierarchy missing CLAUDE.local.md and managed policy | **FIXED** — d3-claude-md documents all 4 scopes including managed policy and CLAUDE.local.md |
| **M5** | SKILL.md frontmatter fields incomplete | **FIXED** — d3-skills lists 14+ frontmatter fields with full table |
| **M6** | Extended thinking effort level xhigh missing | **FIXED** — d4-adaptive-thinking lists all 5 levels including xhigh (Opus 4.7 only) |
| **L1** | "Hub-and-spoke" vs "orchestrator-workers" | **ADDRESSED** — d1-workflow-patterns uses "Orchestrator-Workers" as primary with hub-and-spoke noted |
| **L2** | "Lost in the middle" vs "context rot" | **ADDRESSED** — d5-context-windows uses "context rot" as official term with clear callout |
| **L3** | stop_reason — only 6 documented | **PARTIALLY FIXED** — All 6 are documented but model_context_window_exceeded and compaction are missing |
| **L4** | Tool use pricing not documented | **ACKNOWLEDGED** — Low priority per exam guide; token overhead table present in d1-tool-categories |
| **L5** | Subagent nesting technical vs architectural | **FIXED** — d1-multi-agent explicitly states "hard architectural constraint" and "Agent tool is simply not available to subagents" |

**Summary**: 12 of 14 issues are fully addressed. L3 is partially fixed (missing 2 stop_reasons). L4 is acknowledged as out-of-scope per the exam guide.

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total topics audited | 38 |
| Topics rated RICH | 35 |
| Topics rated ADEQUATE | 3 (d2-tool-interfaces, d3-rules, d3-claude-md) |
| Topics rated THIN | 0 |
| Contradictions found | 0 |
| VALIDATION-REPORT issues fixed | 12/14 (86%) |
| Critical gaps identified | 6 |
| Research files with >90% coverage | 5/9 |
| Research files with <70% coverage | 2/9 (platform-features-official.md, claude-code-advanced-official.md) |
| Skilljar courses fully reflected | 7/11 |
| Skilljar courses not reflected | 2/11 (AI Fluency, AI Capabilities — foundational, not CCA-specific) |

### Priority Actions

1. **HIGH**: Create a topic for Claude Managed Agents (managed-agents-official.md is essentially uncovered)
2. **MEDIUM**: Add model_context_window_exceeded and compaction to stop_reason documentation
3. **MEDIUM**: Add context editing detailed configuration to d5-context-strategies
4. **MEDIUM**: Incorporate missing claude-code-advanced-official.md content (full tools list, Agent Teams details, Bash tool behavior)
5. **LOW**: Add MCP Inspector, RAG pipeline awareness, installation methods to relevant topics
