// ============================================================
// Learn Topic Summaries — Quick Summary & Key Concepts per topic
// Each keyConcept has a term and a definition (shown on hover)
// ============================================================

export const learnSummaries = {
  // ===== DOMAIN 1: Agentic Architecture & Orchestration =====
  "d1-agentic-loop": {
    summary: "The agentic loop is the core execution cycle: send a request to Claude, inspect stop_reason, execute tools if needed, append results, and repeat. The loop continues on 'tool_use' and terminates on 'end_turn'. There are 6 possible stop_reason values. Anti-patterns include parsing natural language for completion, arbitrary iteration caps as the primary stop, and checking for text content as a completion indicator.",
    keyConcepts: [
      { term: "stop_reason", definition: "Field in every API response indicating why Claude stopped generating. The primary decision point in the agentic loop." },
      { term: "tool_use vs end_turn", definition: "tool_use means Claude wants to call tools (continue loop); end_turn means Claude is done (terminate loop)." },
      { term: "pause_turn", definition: "Indicates server-side tool loop (web_search, code_execution) hit its iteration limit. Re-send conversation including the paused response to continue." },
      { term: "refusal", definition: "Distinct stop_reason indicating Claude declined a request for safety reasons. Must be handled separately from end_turn." },
      { term: "max_tokens", definition: "Response hit the configured token limit. Decide whether to continue generation or truncate." },
      { term: "stop_sequence", definition: "A custom stop sequence was matched in the output, triggering an early stop." },
      { term: "tool_result matching", definition: "Each tool_result must reference the exact tool_use_id from the assistant's request. Mismatched IDs cause failures." },
      { term: "loop termination", definition: "Terminate on end_turn; never parse natural language or use arbitrary iteration caps as primary stopping logic." }
    ]
  },
  "d1-tool-use-contract": {
    summary: "Tool results must immediately follow the assistant's tool_use message with no intermediate messages. Within the user message, tool_result blocks must come FIRST before any text. Each tool_result must reference the exact tool_use_id from the request. Tools can return strings, text blocks, images (base64), and documents. Error results use is_error: true with instructive messages to enable Claude's self-correction.",
    keyConcepts: [
      { term: "tool_result ordering", definition: "In the user message, tool_result blocks must come FIRST in the content array before any text blocks." },
      { term: "tool_use_id matching", definition: "Every tool_result must reference the exact ID from the corresponding tool_use block in the assistant's response." },
      { term: "is_error flag", definition: "Set to true in tool_result to signal a tool failure. Claude retries 2-3 times with corrections before giving up." },
      { term: "content types", definition: "tool_result supports 4 types: simple strings, text blocks, image blocks (base64), and document blocks." },
      { term: "no intermediate messages", definition: "No messages of any kind (user, system) can be inserted between the assistant's tool_use and the user's tool_result." },
      { term: "error recovery", definition: "Error messages should be instructive: describe what went wrong AND what to try next (e.g., 'Rate limit exceeded. Retry after 60s')." }
    ]
  },
  "d1-multi-agent": {
    summary: "Multi-agent systems use a hub-and-spoke architecture where a coordinator manages all inter-subagent communication. Subagents operate with isolated context — they do NOT inherit the coordinator's conversation history. The coordinator handles task decomposition, delegation, result aggregation, and decides which subagents to invoke based on query complexity. Overly narrow decomposition leads to coverage gaps.",
    keyConcepts: [
      { term: "hub-and-spoke", definition: "Architecture where a central coordinator manages all communication between subagents. Subagents never communicate directly." },
      { term: "coordinator pattern", definition: "The coordinator decomposes tasks, delegates to subagents, evaluates results, and manages iterative refinement." },
      { term: "isolated context", definition: "Subagents do NOT receive the coordinator's conversation history. They only see their own system prompt and the Agent tool prompt." },
      { term: "task decomposition", definition: "Breaking a complex query into subtasks for subagents. Overly narrow decomposition causes coverage gaps." },
      { term: "result aggregation", definition: "The coordinator collects, evaluates, and merges subagent results into a coherent response." },
      { term: "iterative refinement", definition: "Coordinator evaluates output quality, identifies gaps, and re-delegates targeted queries until coverage is sufficient." },
      { term: "coverage gaps", definition: "When task decomposition is too narrow, entire relevant subtopics get missed. Logs reveal this in the decomposition step." }
    ]
  },
  "d1-hooks": {
    summary: "Agent SDK hooks intercept tool calls and results for transformation or enforcement. PostToolUse hooks normalize data (timestamps, status codes) before the model processes them. PreToolUse hooks can block policy-violating actions. Hooks provide deterministic guarantees unlike prompt-based enforcement. The priority rule is deny > ask > allow. Hook matchers filter by tool name only (regex), not arguments.",
    keyConcepts: [
      { term: "PreToolUse", definition: "Hook that fires BEFORE a tool executes. Can block (deny), allow, modify inputs (updatedInput), or observe ({})." },
      { term: "PostToolUse", definition: "Hook that fires AFTER a tool executes. Used to normalize/transform data before the model processes it." },
      { term: "deterministic enforcement", definition: "Hooks guarantee consistent behavior unlike prompt-based instructions which are probabilistic." },
      { term: "deny > ask > allow", definition: "Priority rule when multiple hooks conflict: any deny overrides all, ask overrides allow. Ensures security hooks can't be bypassed." },
      { term: "tool name matcher", definition: "Hook matchers are regex evaluated ONLY against the tool name (e.g., 'Write|Edit'). File paths must be checked in callback logic." },
      { term: "permissionDecision", definition: "Hook return field: 'allow', 'deny', or 'ask'. Required alongside updatedInput for input modifications to take effect." },
      { term: "updatedInput", definition: "Hook return field to modify tool inputs. Must be inside hookSpecificOutput and paired with permissionDecision: 'allow'." },
      { term: "data normalization", definition: "Converting heterogeneous formats (Unix timestamps → ISO 8601, status codes → readable names) deterministically via hooks." }
    ]
  },
  "d1-subagent-config": {
    summary: "Subagents are spawned via the Agent tool (formerly 'Task'). AgentDefinition has 7 fields with only description and prompt required. The prompt string is the ONLY communication channel from parent to subagent. Subagents cannot create other subagents. They do NOT inherit parent permissions. Parallel subagents are spawned by emitting multiple Agent tool calls in a single coordinator response.",
    keyConcepts: [
      { term: "Agent tool", definition: "The tool used to invoke subagents. Renamed from 'Task' in Claude Code v2.1.63." },
      { term: "AgentDefinition", definition: "7 fields: description (req), prompt (req), tools, model, skills, memory (Python only), mcpServers. All optional fields inherit from parent." },
      { term: "isolated context", definition: "Subagents don't receive parent's history, system prompt, or tool results. The prompt string is the ONLY input channel." },
      { term: "no nested subagents", definition: "Subagents CANNOT create their own subagents. Never include 'Agent' in a subagent's tools array." },
      { term: "parallel spawning", definition: "Emit multiple Agent tool_use blocks in a single coordinator response to spawn subagents in parallel." },
      { term: "permission isolation", definition: "Subagents do NOT inherit parent permissions. Use PreToolUse hooks to auto-approve trusted subagent operations." },
      { term: "prompt as only channel", definition: "All context (file paths, errors, decisions) must be included directly in the Agent tool's prompt string." }
    ]
  },
  "d1-sessions": {
    summary: "Sessions can be resumed with --resume <session-name> or forked with fork_session for parallel exploration. Starting fresh with a structured summary is more reliable than resuming with stale tool results. When resuming after code modifications, inform the agent about specific file changes for targeted re-analysis rather than requiring full re-exploration.",
    keyConcepts: [
      { term: "--resume", definition: "CLI flag to resume a previous session by name or ID. Restores conversation context from the stored session." },
      { term: "fork_session", definition: "Creates an independent branch from a session, allowing parallel exploration without modifying the original." },
      { term: "named sessions", definition: "Sessions can be named for easier reference when resuming or forking later." },
      { term: "stale context", definition: "Resumed sessions may contain outdated tool results if code changed externally. Fresh starts with summaries can be more reliable." },
      { term: "structured summaries", definition: "When starting fresh is better than resuming, carry forward key findings as structured summaries rather than raw conversation." },
      { term: "targeted re-analysis", definition: "After code changes, inform the agent about specific file modifications instead of requiring full re-exploration." }
    ]
  },
  "d1-task-decomposition": {
    summary: "Choose between fixed sequential pipelines (prompt chaining) for predictable multi-aspect reviews, and dynamic adaptive decomposition for open-ended investigation. Split large code reviews into per-file local analysis plus a separate cross-file integration pass to avoid attention dilution. For open-ended tasks, first map structure, identify high-impact areas, then create a prioritized adaptive plan.",
    keyConcepts: [
      { term: "prompt chaining", definition: "Fixed sequential pipeline where each step's output feeds the next. Best for predictable, repeatable multi-aspect reviews." },
      { term: "dynamic decomposition", definition: "Adaptive planning where the next step depends on what was discovered. Best for open-ended investigation." },
      { term: "per-file analysis", definition: "Analyzing each file individually for local issues. Ensures consistent depth of review across all files." },
      { term: "cross-file integration", definition: "Separate pass examining data flow, shared dependencies, and interaction patterns between files." },
      { term: "attention dilution", definition: "Processing too many files in a single pass degrades quality — detailed for some, superficial for others." },
      { term: "adaptive investigation", definition: "Map structure first, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered." }
    ]
  },
  "d1-programmatic-enforcement": {
    summary: "When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate. Use programmatic prerequisites that block downstream tool calls until prerequisite steps complete. Structured handoff protocols for escalation should include customer ID, root cause, refund amount, and recommended action.",
    keyConcepts: [
      { term: "programmatic prerequisites", definition: "Code-level gates that block downstream tool calls until prerequisite steps complete. Guarantees correct ordering." },
      { term: "deterministic vs probabilistic", definition: "Programmatic enforcement is deterministic (always works). Prompt instructions are probabilistic (may fail ~12% of cases)." },
      { term: "workflow ordering", definition: "Enforcing that tools execute in a required sequence (e.g., verify identity → lookup order → process refund)." },
      { term: "handoff protocols", definition: "Structured data passed during escalation: customer ID, issue summary, root cause, attempted actions, recommended resolution." },
      { term: "prerequisite gates", definition: "Logic that blocks tool_use calls until required preconditions are met (e.g., verified customer ID exists)." },
      { term: "compliance enforcement", definition: "Using code, not prompts, to guarantee adherence to business rules with financial or legal consequences." }
    ]
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration =====
  "d2-tool-interfaces": {
    summary: "Tool descriptions are the primary mechanism LLMs use for tool selection. Minimal descriptions lead to unreliable selection among similar tools. Descriptions should include input formats, example queries, edge cases, and boundary explanations. Ambiguous or overlapping descriptions cause misrouting. Split generic tools into purpose-specific tools with defined input/output contracts.",
    keyConcepts: [
      { term: "tool descriptions", definition: "The primary mechanism LLMs use for deciding which tool to call. Descriptions must differentiate similar tools clearly." },
      { term: "input formats", definition: "Include expected input formats in descriptions (e.g., 'Accepts order ID as integer' vs 'Accepts customer name as string')." },
      { term: "edge cases", definition: "Document tool behavior in unusual scenarios to help the model make correct selection decisions." },
      { term: "boundary explanations", definition: "Explicitly explain WHEN to use this tool vs similar alternatives (e.g., 'Use for orders, NOT for customer lookups')." },
      { term: "tool misrouting", definition: "When the model calls the wrong tool because descriptions are too minimal or overlap with another tool's scope." },
      { term: "splitting generic tools", definition: "Breaking a single broad tool into purpose-specific tools with clear boundaries improves selection reliability." },
      { term: "renaming for clarity", definition: "Using descriptive tool names that indicate their specific purpose (get_order_by_id vs lookup_entity)." }
    ]
  },
  "d2-tool-choice": {
    summary: "tool_choice has 4 options: 'auto' (Claude decides, default), 'any' (must call a tool), 'tool' (forces specific tool), and 'none' (prevents tool use). With 'any' or 'tool', the API prefills the assistant message — Claude will NOT emit text before tool_use blocks. With extended thinking, only 'auto' and 'none' are compatible. Changing tool_choice invalidates cached message blocks.",
    keyConcepts: [
      { term: "auto", definition: "Default tool_choice. Claude decides whether to call a tool or respond with text. No guarantee of tool use." },
      { term: "any", definition: "Forces Claude to call SOME tool but lets it choose which one. Guarantees structured output when combined with strict." },
      { term: "tool (forced)", definition: "Forces Claude to call a SPECIFIC named tool. Use {type: 'tool', name: 'tool_name'}." },
      { term: "none", definition: "Prevents Claude from using any tools. Useful for temporarily disabling tools without removing definitions." },
      { term: "assistant prefilling", definition: "With 'any' or 'tool', the API prefills the response to force tool use. Claude will NOT emit text before tool_use blocks." },
      { term: "extended thinking restriction", definition: "With extended thinking enabled, only tool_choice 'auto' and 'none' work. 'any' and 'tool' return an API error." },
      { term: "cache invalidation", definition: "Changing tool_choice between requests invalidates cached message blocks (but tool definitions and system prompts remain cached)." }
    ]
  },
  "d2-strict-tool-use": {
    summary: "strict: true uses grammar-constrained sampling to guarantee tool inputs comply with the JSON Schema — no post-generation validation needed. Combine with additionalProperties: false. Schemas are cached for up to 24 hours. PHI must NOT be in schema definitions (property names, enum values, const, regex) due to caching. Compatible with extended thinking only using tool_choice auto or none.",
    keyConcepts: [
      { term: "grammar-constrained sampling", definition: "Compiles the JSON Schema into a grammar that restricts token generation at each step, making invalid outputs impossible." },
      { term: "additionalProperties: false", definition: "Recommended alongside strict: true. Prevents the model from generating extra properties not in the schema." },
      { term: "24h schema cache", definition: "Compiled tool schemas are cached up to 24 hours. Prompts and responses are NOT retained beyond the API response." },
      { term: "HIPAA/PHI restrictions", definition: "PHI must NOT be in schema definitions (property names, enums, const, regex) because schemas are cached for up to 24h." },
      { term: "extended thinking compatibility", definition: "strict: true works with extended thinking, but only with tool_choice 'auto' or 'none'. 'any'/'tool' return an error." }
    ]
  },
  "d2-error-responses": {
    summary: "MCP tools should return structured error metadata including errorCategory (transient/validation/permission), isRetryable boolean, and human-readable descriptions. Distinguish between transient errors (timeouts), validation errors (invalid input), business errors (policy violations), and permission errors. Generic 'Operation failed' errors prevent intelligent recovery. Silent error suppression is an anti-pattern.",
    keyConcepts: [
      { term: "isError flag", definition: "Set to true in MCP tool responses to indicate failure. Allows the agent to distinguish errors from empty successful results." },
      { term: "errorCategory", definition: "Categorize errors: 'transient' (retry), 'validation' (fix input), 'business' (policy violation), 'permission' (access denied)." },
      { term: "isRetryable", definition: "Boolean indicating whether the error is transient and the operation can be retried with the same or modified parameters." },
      { term: "transient vs permanent", definition: "Transient errors (timeouts, rate limits) are retryable. Permanent errors (invalid input, permission denied) need different strategies." },
      { term: "structured metadata", definition: "Error responses should include category, retryability, description, and attempted query to enable intelligent recovery." },
      { term: "local recovery", definition: "Subagents should attempt local recovery for transient failures (retry, alternative query) before escalating to the coordinator." },
      { term: "error suppression anti-pattern", definition: "Returning empty results marked as 'successful' to hide errors. Prevents recovery and risks incomplete results without notice." }
    ]
  },
  "d2-mcp-architecture": {
    summary: "MCP has 3 primitives: Tools (model-controlled — LLM decides when to call), Resources (application-controlled — app decides when to load), and Prompts (user-controlled — user selects). MCP uses inputSchema (camelCase) vs the Claude API's input_schema (snake_case). Two resource discovery patterns: Direct Resources (fixed URIs) and Resource Templates (parameterized URIs).",
    keyConcepts: [
      { term: "Tools/Resources/Prompts", definition: "The 3 MCP primitives. Tools: model-controlled actions. Resources: app-controlled data. Prompts: user-selected templates." },
      { term: "model vs app vs user controlled", definition: "Tools: LLM decides when to call. Resources: application decides when to load. Prompts: user selects from available templates." },
      { term: "inputSchema vs input_schema", definition: "MCP uses camelCase 'inputSchema'; Claude API uses snake_case 'input_schema'. Same JSON Schema content, different field name." },
      { term: "Direct Resources", definition: "Fixed URIs pointing to specific data (resources/list). E.g., calendar://events/2024." },
      { term: "Resource Templates", definition: "Parameterized URIs with placeholders (resources/templates/list). E.g., weather://forecast/{city}/{date}." },
      { term: "tools/list", definition: "MCP endpoint that returns available tools from the server, including their names and inputSchemas." },
      { term: "resources/list", definition: "MCP endpoint that returns available direct resources with fixed URIs." }
    ]
  },
  "d2-mcp-config": {
    summary: "MCP servers have 5 scopes with precedence: Local > Project > User > Plugin > Connectors. Project-scoped servers go in .mcp.json (shared via version control). User-scoped in ~/.claude.json. Environment variables use ${VAR} or ${VAR:-default} syntax. Three transports: HTTP (recommended), SSE (deprecated), stdio (local). MCP_TIMEOUT sets startup timeout, MAX_MCP_OUTPUT_TOKENS limits output.",
    keyConcepts: [
      { term: ".mcp.json", definition: "Project-scoped MCP config file. Shared via version control. Use ${VAR} for credentials to avoid committing secrets." },
      { term: "~/.claude.json", definition: "User home directory config. Stores 'local' scope MCP servers under the projects section for the current project." },
      { term: "${VAR} expansion", definition: "Environment variable syntax in .mcp.json. ${VAR} for direct expansion, ${VAR:-default} for expansion with a fallback default." },
      { term: "Local > Project > User scope", definition: "MCP server precedence order (highest to lowest): Local, Project, User, Plugin-provided, claude.ai connectors." },
      { term: "HTTP/SSE/stdio transports", definition: "HTTP (recommended for remote), SSE (deprecated — use HTTP), stdio (for local processes on your machine)." },
      { term: "MCP_TIMEOUT", definition: "Environment variable that configures the MCP server startup timeout in ms (e.g., MCP_TIMEOUT=10000 for 10 seconds)." },
      { term: "headersHelper", definition: "Script that outputs JSON key-value pairs to stdout for dynamic auth headers. 10s timeout, runs fresh on each connection." }
    ]
  },
  "d2-builtin-tools": {
    summary: "Built-in tools: Grep for content search (finding function callers, error messages), Glob for file path pattern matching (finding files by extension), Read/Write for full file operations, Edit for targeted modifications using unique text matching. Build understanding incrementally: Grep to find entry points, then Read to trace flows. For function tracing across wrappers, identify all exports first, then search each name.",
    keyConcepts: [
      { term: "Grep vs Glob", definition: "Grep searches file CONTENTS by regex pattern. Glob matches file PATHS by name patterns (e.g., **/*.tsx)." },
      { term: "Read/Write vs Edit", definition: "Read loads entire files; Write creates/overwrites files. Edit makes targeted changes using unique text matching — more token-efficient." },
      { term: "incremental exploration", definition: "Start with Grep to find entry points, then Read to trace specific flows. Avoids loading all files at once." },
      { term: "function tracing", definition: "Use Grep to find all exports from a module, then Grep each exported name to trace usage across the codebase." },
      { term: "entry point discovery", definition: "First Grep for exports/definitions, then follow references outward to build a dependency map incrementally." },
      { term: "content search vs file matching", definition: "Grep for 'what's inside files'; Glob for 'which files exist matching a pattern'. Choose based on what you know." }
    ]
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows =====
  "d3-claude-md": {
    summary: "CLAUDE.md hierarchy: user-level (~/.claude/CLAUDE.md), project-level (root CLAUDE.md or .claude/CLAUDE.md), and directory-level (subdirectory files). User-level is NOT shared via version control. Use @import for modular organization (5 hop max depth). CLAUDE.local.md is for personal per-project preferences (add to .gitignore). Content is delivered as a user message, NOT as system prompt. Root CLAUDE.md survives compaction; nested ones do not.",
    keyConcepts: [
      { term: "user/project/directory hierarchy", definition: "Three levels: ~/.claude/CLAUDE.md (personal, all projects), root CLAUDE.md (project-wide), subdirectory CLAUDE.md (directory-specific)." },
      { term: "@import syntax", definition: "Include other files in CLAUDE.md using @import. Maximum 5 hops of nesting depth to prevent infinite chains." },
      { term: "CLAUDE.local.md", definition: "Per-project personal preferences file. Loaded after CLAUDE.md in the same directory. Add to .gitignore." },
      { term: ".claude/rules/", definition: "Directory for rule files with YAML frontmatter. Paths field with glob patterns enables conditional activation based on file paths." },
      { term: "compaction survival", definition: "Root CLAUDE.md survives compaction and is re-injected automatically. Nested subdirectory files are NOT re-injected." },
      { term: "user message delivery", definition: "CLAUDE.md content is delivered as a USER message after the system prompt, NOT as part of the system prompt itself." },
      { term: "5 hop depth limit", definition: "Maximum depth for @import chains. File A → B → C → D → E → F is the deepest allowed nesting." }
    ]
  },
  "d3-rules": {
    summary: ".claude/rules/ files with YAML frontmatter 'paths' fields containing glob patterns enable conditional rule activation. Path-scoped rules load only when editing matching files, reducing irrelevant context. Use glob patterns (e.g., **/*.test.tsx) instead of directory-level CLAUDE.md when conventions span multiple directories. This is the most maintainable approach for scattered test files.",
    keyConcepts: [
      { term: "YAML frontmatter", definition: "Metadata at the top of rule files specifying when the rule should activate. Key field: 'paths' with glob patterns." },
      { term: "paths glob patterns", definition: "Glob patterns in rule frontmatter (e.g., **/*.test.tsx) that determine which files trigger the rule's activation." },
      { term: "conditional loading", definition: "Rules with path patterns only load into context when Claude is editing files that match, saving tokens for irrelevant contexts." },
      { term: "cross-directory conventions", definition: "Rules with glob patterns handle conventions spanning multiple directories better than per-directory CLAUDE.md files." },
      { term: "token reduction", definition: "Path-scoped rules reduce context token usage by loading only when relevant, unlike always-loaded CLAUDE.md files." },
      { term: "**/*.test.tsx pattern", definition: "Example glob that matches all test files regardless of directory depth. Ideal for scattered test conventions." }
    ]
  },
  "d3-skills": {
    summary: "Skills live in .claude/skills/ with SKILL.md files supporting 15 frontmatter fields. context: fork runs the skill in an isolated sub-agent. allowed-tools restricts tool access. disable-model-invocation removes the skill from Claude's context entirely. Skills use shell-style argument parsing ($0, $1). Dynamic injection with !`command` syntax is preprocessing. After compaction, each invoked skill retains up to 5,000 tokens (25,000 total).",
    keyConcepts: [
      { term: "context: fork", definition: "Runs the skill in an isolated sub-agent context. Prevents verbose output from polluting the main conversation." },
      { term: "allowed-tools", definition: "Frontmatter field restricting which tools the skill can use during execution." },
      { term: "disable-model-invocation", definition: "When true, the skill's description is COMPLETELY REMOVED from Claude's context. Only user can invoke it with /name." },
      { term: "argument-hint", definition: "Frontmatter field providing a hint for expected arguments shown in autocomplete (e.g., '<file-path>')." },
      { term: "$ARGUMENTS", definition: "Array of arguments passed to the skill. $0 is first arg, $1 second. Shell-style quoting groups words." },
      { term: "!`command` preprocessing", definition: "Dynamic injection syntax. The command runs BEFORE Claude sees the skill. Output replaces the placeholder." },
      { term: "15 frontmatter fields", definition: "name, description, when_to_use, argument-hint, disable-model-invocation, user-invocable, allowed-tools, model, effort, context, agent, hooks, paths, shell." },
      { term: "5K/25K compaction budget", definition: "After compaction, each invoked skill retains up to 5,000 tokens. Total combined budget for all re-attached skills is 25,000 tokens." }
    ]
  },
  "d3-plan-mode": {
    summary: "Plan mode is for complex tasks: large-scale changes, multiple valid approaches, architectural decisions, multi-file modifications. Direct execution is for simple, well-scoped changes. The Explore subagent isolates verbose discovery output and returns summaries. Combine plan mode for investigation with direct execution for implementation. 6 permission modes: default, acceptEdits, plan, auto, dontAsk, bypassPermissions.",
    keyConcepts: [
      { term: "plan mode vs direct execution", definition: "Plan mode: read-only investigation for complex tasks. Direct execution: immediate changes for simple, well-scoped tasks." },
      { term: "Explore subagent", definition: "Built-in subagent that isolates verbose codebase discovery. Returns a summary to the main context, keeping it clean." },
      { term: "complexity assessment", definition: "Large-scale changes, multiple valid approaches, or architectural decisions warrant plan mode before implementation." },
      { term: "architectural decisions", definition: "Service boundaries, database schema design, API contracts — decisions requiring exploration before commitment." },
      { term: "permission modes", definition: "6 modes: default (ask for dangerous), acceptEdits (auto-approve edits), plan (read-only), auto, dontAsk, bypassPermissions." },
      { term: "safe codebase exploration", definition: "Using plan mode or Explore subagent to investigate code without risk of accidental modifications." }
    ]
  },
  "d3-cli": {
    summary: "-p (--print) flag runs Claude Code non-interactively for CI/CD. --output-format json with --json-schema enforces structured output. --bare omits hooks, skills, plugins, MCP, auto memory, and CLAUDE.md. --max-turns limits agentic turns (exits with error on limit). --max-budget-usd controls API spend (print mode only). --system-prompt replaces the default; --append-system-prompt adds to it.",
    keyConcepts: [
      { term: "-p/--print", definition: "Runs Claude Code non-interactively. Processes prompt, prints result to stdout, exits. Essential for CI/CD." },
      { term: "--output-format json", definition: "Returns structured JSON with metadata instead of plain text. Combine with --json-schema for schema-constrained output." },
      { term: "--json-schema", definition: "Constrains the output to match a specific JSON schema. Ensures machine-parseable structured responses." },
      { term: "--bare mode", definition: "Minimal mode: omits hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md. Only Bash/Read/Edit remain." },
      { term: "--max-turns", definition: "Caps agentic loop iterations in print mode. Exits with ERROR (not graceful summary) when limit is reached." },
      { term: "--max-budget-usd", definition: "Sets maximum dollar amount for API calls. Only works in print mode (-p). Designed for automated cost control." },
      { term: "--resume + --fork-session", definition: "Resume a specific session by ID/name, and optionally fork it into a new session to explore without modifying the original." },
      { term: "--system-prompt vs --append", definition: "--system-prompt REPLACES the default prompt entirely. --append-system-prompt ADDS to the end of the default." }
    ]
  },
  "d3-cicd": {
    summary: "Run Claude Code in CI with -p flag to prevent interactive hangs. Use --output-format json with --json-schema for machine-parseable PR comments. Include prior review findings in context to report only new issues. Session context isolation: the same session that generated code is less effective at reviewing it — use an independent review instance. Document testing standards in CLAUDE.md.",
    keyConcepts: [
      { term: "-p for CI", definition: "The -p (--print) flag prevents interactive hangs in CI pipelines. Without it, Claude Code waits for user input." },
      { term: "structured output for PR comments", definition: "Use --output-format json with --json-schema to produce machine-parseable review results for automated PR commenting." },
      { term: "incremental review", definition: "Include prior review findings in context so Claude reports only new or still-unaddressed issues, avoiding duplicate comments." },
      { term: "session isolation", definition: "The session that generated code is biased when reviewing it. Use an independent instance for more effective review." },
      { term: "CLAUDE.md for CI context", definition: "Document testing standards, available fixtures, and quality criteria in CLAUDE.md to improve CI-invoked generation quality." },
      { term: "test generation quality", definition: "Improved by documenting what constitutes a valuable test, available fixtures, and project-specific testing patterns in CLAUDE.md." }
    ]
  },
  "d3-context-window": {
    summary: "Claude Code's context is 200K tokens. 7 items load at startup (~7,850 tokens). Compaction produces ~12% of original token count. After compaction, root CLAUDE.md is re-injected but nested ones are not. Skill descriptions listing is lost after compaction — only invoked skills are preserved. Use /compact to manually reduce context during verbose exploration.",
    keyConcepts: [
      { term: "200K context", definition: "Claude Code's context window is 200,000 tokens. Compaction triggers automatically as the context fills." },
      { term: "7 startup items", definition: "System prompt, auto memory, environment info, MCP tools (deferred), skill descriptions, ~/.claude/CLAUDE.md, project CLAUDE.md." },
      { term: "~7,850 initial tokens", definition: "Approximate token consumption of the 7 startup items before the user's first prompt." },
      { term: "~12% compaction ratio", definition: "Compaction summary represents ~12% of original tokens. Preserves user intent, concepts, files, errors, and pending tasks." },
      { term: "persistent vs non-persistent items", definition: "Persistent (survive compaction): system prompt, auto memory, env info, MCP tools, root CLAUDE.md. Non-persistent: skill descriptions, nested CLAUDE.md." },
      { term: "/compact command", definition: "Manually trigger context compaction. Useful when verbose exploration output fills the context window." }
    ]
  },
  "d3-iterative-refinement": {
    summary: "When prose descriptions produce inconsistent results, use 2-3 concrete input/output examples to communicate expected transformations. Test-driven iteration writes tests first and shares failures to guide fixes. The interview pattern has Claude ask questions before implementing to surface design considerations. Batch interacting issues in one message; sequence independent issues.",
    keyConcepts: [
      { term: "input/output examples", definition: "2-3 concrete examples of input and expected output. More effective than prose descriptions for communicating transformations." },
      { term: "test-driven iteration", definition: "Write tests first, share failure output with Claude. Each failure message guides exactly what to fix, creating a convergent feedback loop." },
      { term: "interview pattern", definition: "Have Claude ask questions before implementing. Surfaces design considerations (cache invalidation, failure modes, concurrency)." },
      { term: "batch vs sequential issues", definition: "Batch interacting issues in one message (e.g., API changes). Sequence independent issues for focused, non-overwhelming fixes." },
      { term: "progressive improvement", definition: "Iterate in cycles: implement → test → share failures → fix → retest. Each cycle narrows the gap." },
      { term: "edge case handling", definition: "Include specific test cases with example input and expected output for boundary conditions and unusual inputs." }
    ]
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output =====
  "d4-prompting-best-practices": {
    summary: "Use explicit criteria over vague instructions (e.g., 'flag comments only when claimed behavior contradicts code' vs 'check comments are accurate'). General instructions like 'be conservative' fail to improve precision. High false-positive categories undermine trust in all categories. Use XML tags (<examples>, <example>) for structured prompts. Place long documents at TOP, queries at BOTTOM for up to 30% quality improvement.",
    keyConcepts: [
      { term: "explicit criteria", definition: "Specific rules defining exactly what to flag (e.g., 'flag only when claimed behavior contradicts code'). Beats vague 'be accurate'." },
      { term: "category-specific rules", definition: "Define precision criteria per review category. One noisy category can undermine trust in all accurate categories." },
      { term: "false positive management", definition: "Temporarily disable high-false-positive categories to restore trust, then improve their criteria before re-enabling." },
      { term: "XML structure", definition: "Use <examples>/<example> tags for few-shot prompts. XML tags help Claude parse prompt structure clearly." },
      { term: "document ordering (top) / query (bottom)", definition: "Place long documents at the TOP, queries/instructions at the BOTTOM. Improves response quality by up to 30%." },
      { term: "developer trust", definition: "High false-positive rates destroy trust in legitimate findings. Precision in each category protects overall system credibility." }
    ]
  },
  "d4-few-shot": {
    summary: "Few-shot examples are the most effective technique for consistent output when instructions alone produce inconsistent results. Include 2-4 targeted examples for ambiguous scenarios showing reasoning for choices. Examples enable generalization to novel patterns beyond pre-specified cases. Effective for reducing hallucination in extraction tasks. Use <examples>/<example> XML tags with diverse, structurally distinct examples.",
    keyConcepts: [
      { term: "2-4 targeted examples", definition: "Optimal number of examples for most tasks. Focus on ambiguous scenarios that instructions alone handle inconsistently." },
      { term: "ambiguous scenario handling", definition: "Examples are most valuable for cases where the correct action isn't obvious from instructions alone." },
      { term: "format consistency", definition: "Few-shot examples train the model to produce output in a consistent format across diverse inputs." },
      { term: "generalization", definition: "Good examples enable the model to handle novel patterns not explicitly covered, beyond just matching the examples." },
      { term: "hallucination reduction", definition: "Examples showing correct extraction from varied document formats reduce fabrication of values." },
      { term: "<examples> XML tags", definition: "Wrap each example in <example> tags, all inside a container <examples> tag. Recommended structure for few-shot prompts." },
      { term: "diverse examples", definition: "Examples should be relevant, structurally distinct, and cover different edge cases — not variations of the same pattern." }
    ]
  },
  "d4-structured-output": {
    summary: "tool_use with JSON schemas is the most reliable approach for guaranteed structured output — eliminates JSON syntax errors. Strict schemas prevent syntax errors but NOT semantic errors (sums that don't match, values in wrong fields). Design optional/nullable fields when source may lack data to prevent fabrication. Use enum with 'other' + detail string for extensible categories. output_config.format controls Claude's direct JSON response.",
    keyConcepts: [
      { term: "tool_use + JSON schemas", definition: "Most reliable structured output: define tool input_schema with JSON Schema. Eliminates JSON syntax errors entirely." },
      { term: "tool_choice: any/auto/tool/none", definition: "Controls tool selection: auto (model decides), any (must call one), tool (forces specific), none (prevents all)." },
      { term: "syntax vs semantic errors", definition: "Strict schemas eliminate syntax errors (invalid JSON). Semantic errors (wrong values, bad arithmetic) need programmatic validation." },
      { term: "nullable fields", definition: "Make fields optional/nullable when source may not have the info. Prevents model from fabricating values to satisfy 'required'." },
      { term: "enum + other pattern", definition: "Add 'other' to enum values with a companion detail string field. Handles unexpected categories without forced misclassification." },
      { term: "output_config.format", definition: "Controls Claude's direct response format as JSON. Use {type: 'json_schema', schema: {...}} for schema-validated direct output." },
      { term: "Pydantic (Python) / Zod (TypeScript)", definition: "SDK helpers for defining structured output schemas. Use with client.messages.parse() for typed, validated responses." }
    ]
  },
  "d4-batch-processing": {
    summary: "Message Batches API offers 50% cost savings with up to 24-hour processing (no latency SLA). Appropriate for non-blocking workloads (overnight reports, weekly audits) but NOT for blocking pre-merge checks. Max 100,000 requests or 256MB per batch. Results available for 29 days. Only 'succeeded' results are billed. Batch API does NOT support multi-turn tool calling. Use custom_id to correlate request/response pairs.",
    keyConcepts: [
      { term: "50% cost savings", definition: "Batch API charges half the standard price for both input and output tokens." },
      { term: "24h processing window", definition: "Batches process within 24 hours with no latency SLA. Most complete within 1 hour. Not suitable for blocking workflows." },
      { term: "custom_id correlation", definition: "Each request includes a custom_id (alphanumeric + underscore/hyphen, 1-64 chars) to match requests with their results." },
      { term: "100K/256MB limits", definition: "Each batch: max 100,000 requests OR 256MB total size, whichever is reached first." },
      { term: "29-day result retention", definition: "Batch results are downloadable for 29 days after creation. After that, the batch is visible but results can't be downloaded." },
      { term: "no multi-turn tool calling", definition: "Batch API processes single-turn requests only. It cannot handle multi-turn agentic tool-calling workflows." },
      { term: "succeeded/errored/canceled/expired", definition: "4 result types per request. Only 'succeeded' is billed. Errored, canceled, and expired are NOT billed." }
    ]
  },
  "d4-multi-instance-review": {
    summary: "Self-review is limited: the model retains reasoning context making it less likely to question its own decisions. Use independent Claude instances (without prior context) for more effective review. Split large reviews into per-file local analysis plus cross-file integration passes. Run verification passes with self-reported confidence for calibrated review routing.",
    keyConcepts: [
      { term: "self-review limitation", definition: "Claude retains reasoning context from generation, creating confirmation bias when reviewing its own work in the same session." },
      { term: "independent instances", definition: "Start a new Claude session (without the generation context) for more objective code review." },
      { term: "reasoning context bias", definition: "The model tends to confirm its original decisions rather than critically evaluate them when the reasoning history is present." },
      { term: "per-file + cross-file passes", definition: "Split reviews: per-file for local issues (consistent depth), then cross-file for data flow and dependency issues." },
      { term: "attention dilution", definition: "Processing too many files at once degrades review quality. Some files get detailed feedback, others get superficial or none." },
      { term: "confidence-based routing", definition: "Route findings based on confidence scores: high-confidence to automated posting, low-confidence to human review." }
    ]
  },
  "d4-adaptive-thinking": {
    summary: "Adaptive thinking uses thinking: {type: 'adaptive'} with output_config: {effort: 'high'}. Claude dynamically decides when and how much to think. 4 effort levels: low, medium, high, max (max is Opus 4.6 exclusive). Prefilled responses in the last assistant turn are deprecated in Claude 4.6 — migrate to Structured Outputs. Use <use_parallel_tool_calls> tags for near-100% parallel tool call success.",
    keyConcepts: [
      { term: "thinking: {type: 'adaptive'}", definition: "Enables adaptive thinking where Claude dynamically decides when and how much to think based on query complexity." },
      { term: "effort levels (low/medium/high/max)", definition: "4 levels calibrating thinking depth. Low for simple tasks, high for complex. Max is Opus 4.6 exclusive." },
      { term: "max = Opus 4.6 only", definition: "The 'max' effort level activates significantly more upfront exploration. Only available on Claude Opus 4.6." },
      { term: "prefill deprecation", definition: "Prefilled responses in the last assistant turn are deprecated in Claude 4.6. Migrate to Structured Outputs (output_config.format)." },
      { term: "<use_parallel_tool_calls>", definition: "XML wrapper tag in prompt that achieves near-100% success rate for parallel tool calls in Claude 4.6." },
      { term: "output_config", definition: "API parameter containing format (for structured output) and effort (for thinking calibration). Replaces older parameters." }
    ]
  },

  // ===== DOMAIN 5: Context Management & Reliability =====
  "d5-context-windows": {
    summary: "Progressive summarization risks losing numerical values, dates, and expectations. The 'lost in the middle' effect means models process start and end of long inputs reliably but may miss middle sections. Tool results with 40+ fields consume tokens disproportionately. Extract transactional facts into a persistent 'case facts' block. Trim verbose tool outputs to relevant fields. Place key summaries at input start.",
    keyConcepts: [
      { term: "progressive summarization risks", definition: "As context compresses, specific numerical values, dates, and customer expectations are lost in vague summaries." },
      { term: "lost in the middle", definition: "Models reliably process the start and end of long inputs but may miss or de-prioritize middle sections." },
      { term: "case facts block", definition: "A persistent structured block holding key transactional data (amounts, dates, IDs) included in every prompt to prevent loss." },
      { term: "verbose tool output trimming", definition: "Tool results with 40+ fields should be trimmed to relevant fields before adding to context to conserve tokens." },
      { term: "position-aware ordering", definition: "Place critical summaries at the start of input. Instructions and queries at the end. Large data in between." },
      { term: "structured context layers", definition: "Separate volatile conversation history from stable reference data (case facts, customer profile) for better retention." }
    ]
  },
  "d5-escalation": {
    summary: "Escalation triggers: customer requests for a human (honor immediately), policy exceptions/gaps, inability to progress. Sentiment-based escalation and self-reported confidence scores are unreliable proxies. Add explicit escalation criteria with few-shot examples. When the customer explicitly demands a human, escalate immediately without attempting investigation. Multiple customer matches require clarification, not heuristic selection.",
    keyConcepts: [
      { term: "explicit escalation criteria", definition: "Define specific, documented conditions for escalation (policy gaps, amount thresholds, explicit human requests)." },
      { term: "honor customer requests", definition: "When a customer explicitly asks for a human agent, escalate IMMEDIATELY. Do not attempt to resolve first." },
      { term: "sentiment unreliability", definition: "Customer sentiment doesn't correlate with case complexity. Frustrated customers may have simple issues; calm ones may have complex ones." },
      { term: "confidence score unreliability", definition: "LLM self-reported confidence is poorly calibrated. The agent may be confident about hard cases and uncertain about easy ones." },
      { term: "policy gap escalation", definition: "When policy is ambiguous or silent on the customer's specific request, escalate to a human for judgment." },
      { term: "ambiguity resolution", definition: "When multiple customer records match, ask for clarification rather than guessing based on heuristics." },
      { term: "few-shot examples for calibration", definition: "Include examples showing correct escalation decisions to calibrate the boundary between resolve and escalate." }
    ]
  },
  "d5-error-propagation": {
    summary: "Return structured error context (failure type, attempted query, partial results, alternatives) to enable coordinator recovery. Distinguish access failures (timeouts needing retry) from valid empty results (successful queries with no matches). Generic error statuses hide valuable context. Silently suppressing errors OR terminating entire workflows on single failures are both anti-patterns. Subagents should implement local recovery for transient failures.",
    keyConcepts: [
      { term: "structured error context", definition: "Include failure type, attempted query, partial results, and alternative approaches in error responses to enable informed recovery." },
      { term: "access failures vs empty results", definition: "A timeout (access failure) needs retry. A successful query returning no matches (empty result) is valid data." },
      { term: "local recovery first", definition: "Subagents should attempt to recover from transient errors locally (retry, modified query) before escalating to the coordinator." },
      { term: "partial results", definition: "When some data is available, include it alongside error context. The coordinator may proceed with partial information." },
      { term: "coverage annotations", definition: "Report what was successfully covered and what gaps remain, so the coordinator can make informed decisions." },
      { term: "anti-patterns (suppress/terminate)", definition: "Silently suppressing errors (empty success) or terminating entire workflows on single failures are both anti-patterns." }
    ]
  },
  "d5-large-codebase": {
    summary: "Context degradation in extended sessions causes models to reference 'typical patterns' instead of specific discoveries. Use scratchpad files to persist key findings across context boundaries. Delegate verbose exploration to subagents while the main agent coordinates. Design crash recovery using structured state exports (manifests). Use /compact when context fills with verbose output.",
    keyConcepts: [
      { term: "context degradation", definition: "In extended sessions, early discoveries get compressed away. The model falls back to general knowledge instead of specific findings." },
      { term: "scratchpad files", definition: "Persist key findings to files during exploration. The agent can re-read them after compaction to restore specific knowledge." },
      { term: "subagent delegation", definition: "Delegate verbose exploration to subagents that return concise summaries, keeping the main context clean." },
      { term: "crash recovery manifests", definition: "Structured state exports listing completed tasks, pending work, and key findings. The coordinator loads these on restart." },
      { term: "/compact", definition: "Manually trigger context compaction when verbose tool output fills the window. Reduces to ~12% of original tokens." },
      { term: "summarize before spawning", definition: "Condense findings into a structured summary before spawning subagents, since they only receive the prompt string as context." }
    ]
  },
  "d5-human-review": {
    summary: "Aggregate accuracy (e.g., 97%) may mask poor performance on specific document types or fields. Use stratified random sampling for error rate measurement. Calibrate field-level confidence scores using labeled validation sets. Validate accuracy by document type AND field before automating. Route low-confidence or ambiguous extractions to human review, prioritizing limited reviewer capacity.",
    keyConcepts: [
      { term: "stratified sampling", definition: "Sample across document types and difficulty levels proportionally. Ensures error measurement isn't biased by easy cases." },
      { term: "field-level confidence", definition: "Confidence scores for each extracted field, not just the document overall. Enables targeted human review of uncertain fields." },
      { term: "accuracy by document type", definition: "Break down accuracy per document type. A 97% global rate may hide 30% error on one rare-but-important document type." },
      { term: "accuracy by field", definition: "Some fields (names, dates) may extract perfectly while others (amounts, legal terms) have high error rates." },
      { term: "calibration with labeled data", definition: "Use labeled validation sets to calibrate confidence scores. Raw confidence often doesn't correlate with actual accuracy." },
      { term: "review routing", definition: "Direct low-confidence and ambiguous extractions to human review. High-confidence extractions proceed automatically." },
      { term: "aggregate metric risk", definition: "A single global accuracy number can mask concentrated errors in specific categories. Always segment before deciding." }
    ]
  },
  "d5-provenance": {
    summary: "Source attribution is lost during summarization when findings compress without preserving claim-source mappings. Require structured claim-source mappings (source URLs, document names, excerpts). Handle conflicting statistics by annotating conflicts with source attribution, not arbitrarily selecting one. Include publication/collection dates to prevent temporal misinterpretation. Render different content types appropriately (tables, prose, structured lists).",
    keyConcepts: [
      { term: "claim-source mappings", definition: "Structured links between each claim/finding and its source (URL, document name, page, excerpt). Enables verification." },
      { term: "source attribution preservation", definition: "Maintain claim-source links throughout summarization. Progressive summarization naturally drops these mappings." },
      { term: "conflicting data annotation", definition: "When sources disagree, present both values with attribution rather than averaging or arbitrarily selecting one." },
      { term: "temporal data (dates)", definition: "Include publication/collection dates with findings. A 2020 statistic means something different than a 2024 one." },
      { term: "well-established vs contested", definition: "Distinguish between findings all sources agree on and those where sources provide conflicting data." },
      { term: "content-type rendering", definition: "Render data appropriately: tables for comparisons, prose for narratives, structured lists for enumerations." }
    ]
  },
  "d5-hooks-settings": {
    summary: "Hooks in settings.json have 4 handler types: command, http, prompt, agent. Exit code 2 on PreToolUse blocks the tool call entirely. additionalContext has a 10,000-character cap (overflow saved to file). asyncRewake: true runs in background and wakes Claude on exit code 2 with stderr as system reminder. Hooks execute in array order. Multiple hooks resolve with deny > ask > allow priority.",
    keyConcepts: [
      { term: "command/http/prompt/agent handlers", definition: "4 hook handler types: command (shell script), http (URL request), prompt (LLM evaluation), agent (complex verification)." },
      { term: "exit code 2 = block", definition: "On PreToolUse, exit code 2 BLOCKS the tool call entirely. The action is not executed. JSON in stdout is ignored." },
      { term: "10K char cap", definition: "additionalContext, systemMessage, and updatedMCPToolOutput have a 10,000-character limit. Overflow is saved to file with a preview." },
      { term: "asyncRewake", definition: "Implies async: true. Runs in background, wakes Claude when finished with exit code 2. Stderr shown as system reminder." },
      { term: "array order execution", definition: "Multiple hooks in an array execute sequentially in the order they appear. Allows intentional pipeline design." },
      { term: "deny > ask > allow priority", definition: "When multiple hooks conflict: any 'deny' blocks (highest), 'ask' overrides 'allow', 'allow' is lowest priority." }
    ]
  },
}
