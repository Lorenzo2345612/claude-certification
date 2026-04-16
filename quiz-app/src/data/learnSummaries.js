// ============================================================
// Learn Topic Summaries — Quick Summary & Key Concepts per topic
// ============================================================

export const learnSummaries = {
  // ===== DOMAIN 1: Agentic Architecture & Orchestration =====
  "d1-agentic-loop": {
    summary: "The agentic loop is the core execution cycle: send a request to Claude, inspect stop_reason, execute tools if needed, append results, and repeat. The loop continues on 'tool_use' and terminates on 'end_turn'. There are 6 possible stop_reason values. Anti-patterns include parsing natural language for completion, arbitrary iteration caps as the primary stop, and checking for text content as a completion indicator.",
    keyConcepts: ["stop_reason", "tool_use vs end_turn", "pause_turn", "refusal", "max_tokens", "stop_sequence", "tool_result matching", "loop termination"]
  },
  "d1-tool-use-contract": {
    summary: "Tool results must immediately follow the assistant's tool_use message with no intermediate messages. Within the user message, tool_result blocks must come FIRST before any text. Each tool_result must reference the exact tool_use_id from the request. Tools can return strings, text blocks, images (base64), and documents. Error results use is_error: true with instructive messages to enable Claude's self-correction.",
    keyConcepts: ["tool_result ordering", "tool_use_id matching", "is_error flag", "content types", "no intermediate messages", "error recovery"]
  },
  "d1-multi-agent": {
    summary: "Multi-agent systems use a hub-and-spoke architecture where a coordinator manages all inter-subagent communication. Subagents operate with isolated context — they do NOT inherit the coordinator's conversation history. The coordinator handles task decomposition, delegation, result aggregation, and decides which subagents to invoke based on query complexity. Overly narrow decomposition leads to coverage gaps.",
    keyConcepts: ["hub-and-spoke", "coordinator pattern", "isolated context", "task decomposition", "result aggregation", "iterative refinement", "coverage gaps"]
  },
  "d1-hooks": {
    summary: "Agent SDK hooks intercept tool calls and results for transformation or enforcement. PostToolUse hooks normalize data (timestamps, status codes) before the model processes them. PreToolUse hooks can block policy-violating actions. Hooks provide deterministic guarantees unlike prompt-based enforcement. The priority rule is deny > ask > allow. Hook matchers filter by tool name only (regex), not arguments.",
    keyConcepts: ["PreToolUse", "PostToolUse", "deterministic enforcement", "deny > ask > allow", "tool name matcher", "permissionDecision", "updatedInput", "data normalization"]
  },
  "d1-subagent-config": {
    summary: "Subagents are spawned via the Agent tool (formerly 'Task'). AgentDefinition has 7 fields with only description and prompt required. The prompt string is the ONLY communication channel from parent to subagent. Subagents cannot create other subagents. They do NOT inherit parent permissions. Parallel subagents are spawned by emitting multiple Agent tool calls in a single coordinator response.",
    keyConcepts: ["Agent tool", "AgentDefinition", "isolated context", "no nested subagents", "parallel spawning", "permission isolation", "prompt as only channel"]
  },
  "d1-sessions": {
    summary: "Sessions can be resumed with --resume <session-name> or forked with fork_session for parallel exploration. Starting fresh with a structured summary is more reliable than resuming with stale tool results. When resuming after code modifications, inform the agent about specific file changes for targeted re-analysis rather than requiring full re-exploration.",
    keyConcepts: ["--resume", "fork_session", "named sessions", "stale context", "structured summaries", "targeted re-analysis"]
  },
  "d1-task-decomposition": {
    summary: "Choose between fixed sequential pipelines (prompt chaining) for predictable multi-aspect reviews, and dynamic adaptive decomposition for open-ended investigation. Split large code reviews into per-file local analysis plus a separate cross-file integration pass to avoid attention dilution. For open-ended tasks, first map structure, identify high-impact areas, then create a prioritized adaptive plan.",
    keyConcepts: ["prompt chaining", "dynamic decomposition", "per-file analysis", "cross-file integration", "attention dilution", "adaptive investigation"]
  },
  "d1-programmatic-enforcement": {
    summary: "When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate. Use programmatic prerequisites that block downstream tool calls until prerequisite steps complete. Structured handoff protocols for escalation should include customer ID, root cause, refund amount, and recommended action.",
    keyConcepts: ["programmatic prerequisites", "deterministic vs probabilistic", "workflow ordering", "handoff protocols", "prerequisite gates", "compliance enforcement"]
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration =====
  "d2-tool-interfaces": {
    summary: "Tool descriptions are the primary mechanism LLMs use for tool selection. Minimal descriptions lead to unreliable selection among similar tools. Descriptions should include input formats, example queries, edge cases, and boundary explanations. Ambiguous or overlapping descriptions cause misrouting. Split generic tools into purpose-specific tools with defined input/output contracts.",
    keyConcepts: ["tool descriptions", "input formats", "edge cases", "boundary explanations", "tool misrouting", "splitting generic tools", "renaming for clarity"]
  },
  "d2-tool-choice": {
    summary: "tool_choice has 4 options: 'auto' (Claude decides, default), 'any' (must call a tool), 'tool' (forces specific tool), and 'none' (prevents tool use). With 'any' or 'tool', the API prefills the assistant message — Claude will NOT emit text before tool_use blocks. With extended thinking, only 'auto' and 'none' are compatible. Changing tool_choice invalidates cached message blocks.",
    keyConcepts: ["auto", "any", "tool (forced)", "none", "assistant prefilling", "extended thinking restriction", "cache invalidation"]
  },
  "d2-strict-tool-use": {
    summary: "strict: true uses grammar-constrained sampling to guarantee tool inputs comply with the JSON Schema — no post-generation validation needed. Combine with additionalProperties: false. Schemas are cached for up to 24 hours. PHI must NOT be in schema definitions (property names, enum values, const, regex) due to caching. Compatible with extended thinking only using tool_choice auto or none.",
    keyConcepts: ["grammar-constrained sampling", "additionalProperties: false", "24h schema cache", "HIPAA/PHI restrictions", "extended thinking compatibility"]
  },
  "d2-error-responses": {
    summary: "MCP tools should return structured error metadata including errorCategory (transient/validation/permission), isRetryable boolean, and human-readable descriptions. Distinguish between transient errors (timeouts), validation errors (invalid input), business errors (policy violations), and permission errors. Generic 'Operation failed' errors prevent intelligent recovery. Silent error suppression is an anti-pattern.",
    keyConcepts: ["isError flag", "errorCategory", "isRetryable", "transient vs permanent", "structured metadata", "local recovery", "error suppression anti-pattern"]
  },
  "d2-mcp-architecture": {
    summary: "MCP has 3 primitives: Tools (model-controlled — LLM decides when to call), Resources (application-controlled — app decides when to load), and Prompts (user-controlled — user selects). MCP uses inputSchema (camelCase) vs the Claude API's input_schema (snake_case). Two resource discovery patterns: Direct Resources (fixed URIs) and Resource Templates (parameterized URIs).",
    keyConcepts: ["Tools/Resources/Prompts", "model vs app vs user controlled", "inputSchema vs input_schema", "Direct Resources", "Resource Templates", "tools/list", "resources/list"]
  },
  "d2-mcp-config": {
    summary: "MCP servers have 5 scopes with precedence: Local > Project > User > Plugin > Connectors. Project-scoped servers go in .mcp.json (shared via version control). User-scoped in ~/.claude.json. Environment variables use ${VAR} or ${VAR:-default} syntax. Three transports: HTTP (recommended), SSE (deprecated), stdio (local). MCP_TIMEOUT sets startup timeout, MAX_MCP_OUTPUT_TOKENS limits output.",
    keyConcepts: [".mcp.json", "~/.claude.json", "${VAR} expansion", "Local > Project > User scope", "HTTP/SSE/stdio transports", "MCP_TIMEOUT", "headersHelper"]
  },
  "d2-builtin-tools": {
    summary: "Built-in tools: Grep for content search (finding function callers, error messages), Glob for file path pattern matching (finding files by extension), Read/Write for full file operations, Edit for targeted modifications using unique text matching. Build understanding incrementally: Grep to find entry points, then Read to trace flows. For function tracing across wrappers, identify all exports first, then search each name.",
    keyConcepts: ["Grep vs Glob", "Read/Write vs Edit", "incremental exploration", "function tracing", "entry point discovery", "content search vs file matching"]
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows =====
  "d3-claude-md": {
    summary: "CLAUDE.md hierarchy: user-level (~/.claude/CLAUDE.md), project-level (root CLAUDE.md or .claude/CLAUDE.md), and directory-level (subdirectory files). User-level is NOT shared via version control. Use @import for modular organization (5 hop max depth). CLAUDE.local.md is for personal per-project preferences (add to .gitignore). Content is delivered as a user message, NOT as system prompt. Root CLAUDE.md survives compaction; nested ones do not.",
    keyConcepts: ["user/project/directory hierarchy", "@import syntax", "CLAUDE.local.md", ".claude/rules/", "compaction survival", "user message delivery", "5 hop depth limit"]
  },
  "d3-rules": {
    summary: ".claude/rules/ files with YAML frontmatter 'paths' fields containing glob patterns enable conditional rule activation. Path-scoped rules load only when editing matching files, reducing irrelevant context. Use glob patterns (e.g., **/*.test.tsx) instead of directory-level CLAUDE.md when conventions span multiple directories. This is the most maintainable approach for scattered test files.",
    keyConcepts: ["YAML frontmatter", "paths glob patterns", "conditional loading", "cross-directory conventions", "token reduction", "**/*.test.tsx pattern"]
  },
  "d3-skills": {
    summary: "Skills live in .claude/skills/ with SKILL.md files supporting 15 frontmatter fields. context: fork runs the skill in an isolated sub-agent. allowed-tools restricts tool access. disable-model-invocation removes the skill from Claude's context entirely. Skills use shell-style argument parsing ($0, $1). Dynamic injection with !`command` syntax is preprocessing. After compaction, each invoked skill retains up to 5,000 tokens (25,000 total).",
    keyConcepts: ["context: fork", "allowed-tools", "disable-model-invocation", "argument-hint", "$ARGUMENTS", "!`command` preprocessing", "15 frontmatter fields", "5K/25K compaction budget"]
  },
  "d3-plan-mode": {
    summary: "Plan mode is for complex tasks: large-scale changes, multiple valid approaches, architectural decisions, multi-file modifications. Direct execution is for simple, well-scoped changes. The Explore subagent isolates verbose discovery output and returns summaries. Combine plan mode for investigation with direct execution for implementation. 6 permission modes: default, acceptEdits, plan, auto, dontAsk, bypassPermissions.",
    keyConcepts: ["plan mode vs direct execution", "Explore subagent", "complexity assessment", "architectural decisions", "permission modes", "safe codebase exploration"]
  },
  "d3-cli": {
    summary: "-p (--print) flag runs Claude Code non-interactively for CI/CD. --output-format json with --json-schema enforces structured output. --bare omits hooks, skills, plugins, MCP, auto memory, and CLAUDE.md. --max-turns limits agentic turns (exits with error on limit). --max-budget-usd controls API spend (print mode only). --system-prompt replaces the default; --append-system-prompt adds to it.",
    keyConcepts: ["-p/--print", "--output-format json", "--json-schema", "--bare mode", "--max-turns", "--max-budget-usd", "--resume + --fork-session", "--system-prompt vs --append"]
  },
  "d3-cicd": {
    summary: "Run Claude Code in CI with -p flag to prevent interactive hangs. Use --output-format json with --json-schema for machine-parseable PR comments. Include prior review findings in context to report only new issues. Session context isolation: the same session that generated code is less effective at reviewing it — use an independent review instance. Document testing standards in CLAUDE.md.",
    keyConcepts: ["-p for CI", "structured output for PR comments", "incremental review", "session isolation", "CLAUDE.md for CI context", "test generation quality"]
  },
  "d3-context-window": {
    summary: "Claude Code's context is 200K tokens. 7 items load at startup (~7,850 tokens). Compaction produces ~12% of original token count. After compaction, root CLAUDE.md is re-injected but nested ones are not. Skill descriptions listing is lost after compaction — only invoked skills are preserved. Use /compact to manually reduce context during verbose exploration.",
    keyConcepts: ["200K context", "7 startup items", "~7,850 initial tokens", "~12% compaction ratio", "persistent vs non-persistent items", "/compact command"]
  },

  "d3-iterative-refinement": {
    summary: "When prose descriptions produce inconsistent results, use 2-3 concrete input/output examples to communicate expected transformations. Test-driven iteration writes tests first and shares failures to guide fixes. The interview pattern has Claude ask questions before implementing to surface design considerations. Batch interacting issues in one message; sequence independent issues.",
    keyConcepts: ["input/output examples", "test-driven iteration", "interview pattern", "batch vs sequential issues", "progressive improvement", "edge case handling"]
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output =====
  "d4-prompting-best-practices": {
    summary: "Use explicit criteria over vague instructions (e.g., 'flag comments only when claimed behavior contradicts code' vs 'check comments are accurate'). General instructions like 'be conservative' fail to improve precision. High false-positive categories undermine trust in all categories. Use XML tags (<examples>, <example>) for structured prompts. Place long documents at TOP, queries at BOTTOM for up to 30% quality improvement.",
    keyConcepts: ["explicit criteria", "category-specific rules", "false positive management", "XML structure", "document ordering (top) / query (bottom)", "developer trust"]
  },
  "d4-few-shot": {
    summary: "Few-shot examples are the most effective technique for consistent output when instructions alone produce inconsistent results. Include 2-4 targeted examples for ambiguous scenarios showing reasoning for choices. Examples enable generalization to novel patterns beyond pre-specified cases. Effective for reducing hallucination in extraction tasks. Use <examples>/<example> XML tags with diverse, structurally distinct examples.",
    keyConcepts: ["2-4 targeted examples", "ambiguous scenario handling", "format consistency", "generalization", "hallucination reduction", "<examples> XML tags", "diverse examples"]
  },
  "d4-structured-output": {
    summary: "tool_use with JSON schemas is the most reliable approach for guaranteed structured output — eliminates JSON syntax errors. Strict schemas prevent syntax errors but NOT semantic errors (sums that don't match, values in wrong fields). Design optional/nullable fields when source may lack data to prevent fabrication. Use enum with 'other' + detail string for extensible categories. output_config.format controls Claude's direct JSON response.",
    keyConcepts: ["tool_use + JSON schemas", "tool_choice: any/auto/tool/none", "syntax vs semantic errors", "nullable fields", "enum + other pattern", "output_config.format", "Pydantic (Python) / Zod (TypeScript)"]
  },
  "d4-batch-processing": {
    summary: "Message Batches API offers 50% cost savings with up to 24-hour processing (no latency SLA). Appropriate for non-blocking workloads (overnight reports, weekly audits) but NOT for blocking pre-merge checks. Max 100,000 requests or 256MB per batch. Results available for 29 days. Only 'succeeded' results are billed. Batch API does NOT support multi-turn tool calling. Use custom_id to correlate request/response pairs.",
    keyConcepts: ["50% cost savings", "24h processing window", "custom_id correlation", "100K/256MB limits", "29-day result retention", "no multi-turn tool calling", "succeeded/errored/canceled/expired"]
  },
  "d4-multi-instance-review": {
    summary: "Self-review is limited: the model retains reasoning context making it less likely to question its own decisions. Use independent Claude instances (without prior context) for more effective review. Split large reviews into per-file local analysis plus cross-file integration passes. Run verification passes with self-reported confidence for calibrated review routing.",
    keyConcepts: ["self-review limitation", "independent instances", "reasoning context bias", "per-file + cross-file passes", "attention dilution", "confidence-based routing"]
  },
  "d4-adaptive-thinking": {
    summary: "Adaptive thinking uses thinking: {type: 'adaptive'} with output_config: {effort: 'high'}. Claude dynamically decides when and how much to think. 4 effort levels: low, medium, high, max (max is Opus 4.6 exclusive). Prefilled responses in the last assistant turn are deprecated in Claude 4.6 — migrate to Structured Outputs. Use <use_parallel_tool_calls> tags for near-100% parallel tool call success.",
    keyConcepts: ["thinking: {type: 'adaptive'}", "effort levels (low/medium/high/max)", "max = Opus 4.6 only", "prefill deprecation", "<use_parallel_tool_calls>", "output_config"]
  },

  // ===== DOMAIN 5: Context Management & Reliability =====
  "d5-context-windows": {
    summary: "Progressive summarization risks losing numerical values, dates, and expectations. The 'lost in the middle' effect means models process start and end of long inputs reliably but may miss middle sections. Tool results with 40+ fields consume tokens disproportionately. Extract transactional facts into a persistent 'case facts' block. Trim verbose tool outputs to relevant fields. Place key summaries at input start.",
    keyConcepts: ["progressive summarization risks", "lost in the middle", "case facts block", "verbose tool output trimming", "position-aware ordering", "structured context layers"]
  },
  "d5-escalation": {
    summary: "Escalation triggers: customer requests for a human (honor immediately), policy exceptions/gaps, inability to progress. Sentiment-based escalation and self-reported confidence scores are unreliable proxies. Add explicit escalation criteria with few-shot examples. When the customer explicitly demands a human, escalate immediately without attempting investigation. Multiple customer matches require clarification, not heuristic selection.",
    keyConcepts: ["explicit escalation criteria", "honor customer requests", "sentiment unreliability", "confidence score unreliability", "policy gap escalation", "ambiguity resolution", "few-shot examples for calibration"]
  },
  "d5-error-propagation": {
    summary: "Return structured error context (failure type, attempted query, partial results, alternatives) to enable coordinator recovery. Distinguish access failures (timeouts needing retry) from valid empty results (successful queries with no matches). Generic error statuses hide valuable context. Silently suppressing errors OR terminating entire workflows on single failures are both anti-patterns. Subagents should implement local recovery for transient failures.",
    keyConcepts: ["structured error context", "access failures vs empty results", "local recovery first", "partial results", "coverage annotations", "anti-patterns (suppress/terminate)"]
  },
  "d5-large-codebase": {
    summary: "Context degradation in extended sessions causes models to reference 'typical patterns' instead of specific discoveries. Use scratchpad files to persist key findings across context boundaries. Delegate verbose exploration to subagents while the main agent coordinates. Design crash recovery using structured state exports (manifests). Use /compact when context fills with verbose output.",
    keyConcepts: ["context degradation", "scratchpad files", "subagent delegation", "crash recovery manifests", "/compact", "summarize before spawning"]
  },
  "d5-human-review": {
    summary: "Aggregate accuracy (e.g., 97%) may mask poor performance on specific document types or fields. Use stratified random sampling for error rate measurement. Calibrate field-level confidence scores using labeled validation sets. Validate accuracy by document type AND field before automating. Route low-confidence or ambiguous extractions to human review, prioritizing limited reviewer capacity.",
    keyConcepts: ["stratified sampling", "field-level confidence", "accuracy by document type", "accuracy by field", "calibration with labeled data", "review routing", "aggregate metric risk"]
  },
  "d5-provenance": {
    summary: "Source attribution is lost during summarization when findings compress without preserving claim-source mappings. Require structured claim-source mappings (source URLs, document names, excerpts). Handle conflicting statistics by annotating conflicts with source attribution, not arbitrarily selecting one. Include publication/collection dates to prevent temporal misinterpretation. Render different content types appropriately (tables, prose, structured lists).",
    keyConcepts: ["claim-source mappings", "source attribution preservation", "conflicting data annotation", "temporal data (dates)", "well-established vs contested", "content-type rendering"]
  },
  "d5-hooks-settings": {
    summary: "Hooks in settings.json have 4 handler types: command, http, prompt, agent. Exit code 2 on PreToolUse blocks the tool call entirely. additionalContext has a 10,000-character cap (overflow saved to file). asyncRewake: true runs in background and wakes Claude on exit code 2 with stderr as system reminder. Hooks execute in array order. Multiple hooks resolve with deny > ask > allow priority.",
    keyConcepts: ["command/http/prompt/agent handlers", "exit code 2 = block", "10K char cap", "asyncRewake", "array order execution", "deny > ask > allow priority"]
  },
}
