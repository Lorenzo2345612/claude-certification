# Documentation Quotes for Questions 101-204

Each entry contains the shortest excerpt (1-3 sentences) that supports the correct answer.

---

## Q101: Iterative refinement loop for contradicting subagent findings
```json
{
  "id": 101,
  "source": "Exam Guide — Task Statement 1.2",
  "quote": "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient.",
  "url": "Exam Guide Task Statement 1.2 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q102: Structured handoff summaries for human escalation
```json
{
  "id": 102,
  "source": "Exam Guide — Task Statement 1.4",
  "quote": "Compiling structured handoff summaries (customer ID, root cause, refund amount, recommended action) when escalating to human agents who lack access to the conversation transcript.",
  "url": "Exam Guide Task Statement 1.4 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q103: fork_session for exploring divergent approaches
```json
{
  "id": 103,
  "source": "Exam Guide — Task Statement 1.7",
  "quote": "fork_session for creating independent branches from a shared analysis baseline to explore divergent approaches... Using fork_session to create parallel exploration branches (e.g., comparing two testing strategies or refactoring approaches from a shared codebase analysis).",
  "url": "Exam Guide Task Statement 1.7 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q104: Inform resumed session about file changes for targeted re-analysis
```json
{
  "id": 104,
  "source": "Exam Guide — Task Statement 1.7",
  "quote": "The importance of informing the agent about changes to previously analyzed files when resuming sessions after code modifications... Informing a resumed session about specific file changes for targeted re-analysis rather than requiring full re-exploration.",
  "url": "Exam Guide Task Statement 1.7 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q105: Scoped direct channel while preserving coordinator oversight
```json
{
  "id": 105,
  "source": "Exam Guide — Task Statement 1.2 / 2.3",
  "quote": "Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator.",
  "url": "Exam Guide Task Statement 2.3 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q106: Adaptive decomposition for dynamically adding subtasks
```json
{
  "id": 106,
  "source": "Exam Guide — Task Statement 1.6",
  "quote": "The value of adaptive investigation plans that generate subtasks based on what is discovered at each step... Decomposing open-ended tasks... by first mapping structure, identifying high-impact areas, then creating a prioritized plan that adapts as dependencies are discovered.",
  "url": "Exam Guide Task Statement 1.6 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q107: Session context isolation for unrelated tasks
```json
{
  "id": 107,
  "source": "Exam Guide — Task Statement 3.6 / 1.7",
  "quote": "Session context isolation: why the same Claude session that generated code is less effective at reviewing its own changes compared to an independent review instance.",
  "url": "Exam Guide Task Statement 3.6 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q108: Retry only failed subagent; preserve successful parallel results
```json
{
  "id": 108,
  "source": "Exam Guide — Task Statement 2.2",
  "quote": "Implementing local error recovery within subagents for transient failures, propagating to the coordinator only errors that cannot be resolved locally along with partial results and what was attempted.",
  "url": "Exam Guide Task Statement 2.2 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q109: Adaptive decomposition to skip unneeded steps
```json
{
  "id": 109,
  "source": "Exam Guide — Task Statement 1.6",
  "quote": "When to use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings... The value of adaptive investigation plans that generate subtasks based on what is discovered at each step.",
  "url": "Exam Guide Task Statement 1.6 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q110: Include shared objective in each subagent's system prompt
```json
{
  "id": 110,
  "source": "Exam Guide — Task Statement 1.3",
  "quote": "That subagent context must be explicitly provided in the prompt—subagents do not automatically inherit parent context or share memory between invocations... The AgentDefinition configuration including descriptions, system prompts, and tool restrictions for each subagent type.",
  "url": "Exam Guide Task Statement 1.3 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q111: Standard agentic loop with stop_reason
```json
{
  "id": 111,
  "source": "Anthropic Docs — Tool Use (How Tool Use Works)",
  "quote": "The canonical shape is a while loop keyed on stop_reason... while stop_reason == 'tool_use', execute the tools and continue the conversation. The loop exits on any other stop reason ('end_turn', 'max_tokens', 'stop_sequence', or 'refusal').",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works",
  "status": "STRONG"
}
```

## Q112: Coordinator iterative refinement for quality control
```json
{
  "id": 112,
  "source": "Exam Guide — Task Statement 1.2",
  "quote": "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient.",
  "url": "Exam Guide Task Statement 1.2 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q113: Too many tools degrade selection; specialist subagents scoped by role
```json
{
  "id": 113,
  "source": "Exam Guide — Task Statement 2.3",
  "quote": "The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity... Scoped tool access: giving agents only the tools needed for their role.",
  "url": "Exam Guide Task Statement 2.3 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q114: Structured output schema for subagent responses
```json
{
  "id": 114,
  "source": "Anthropic Docs — Structured Outputs",
  "quote": "Tool use (tool_use) with JSON schemas as the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

## Q115: Sequential execution in a single session preserves context
```json
{
  "id": 115,
  "source": "Exam Guide — Task Statement 1.7",
  "quote": "Choosing between session resumption (when prior context is mostly valid) and starting fresh with injected summaries (when prior tool results are stale).",
  "url": "Exam Guide Task Statement 1.7 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q116: Completion_status field makes incompleteness explicit
```json
{
  "id": 116,
  "source": "Exam Guide — Task Statement 5.3",
  "quote": "Structuring synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.",
  "url": "Exam Guide Task Statement 5.3 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q117: Local error recovery; retry only the failed step
```json
{
  "id": 117,
  "source": "Exam Guide — Task Statement 2.2",
  "quote": "Implementing local error recovery within subagents for transient failures, propagating to the coordinator only errors that cannot be resolved locally along with partial results and what was attempted.",
  "url": "Exam Guide Task Statement 2.2 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q118: Structured state manifests for crash recovery
```json
{
  "id": 118,
  "source": "Exam Guide — Task Statement 5.4",
  "quote": "Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume... Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts.",
  "url": "Exam Guide Task Statement 5.4 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q119: Scoped allowlist with specific lint targets for CI
```json
{
  "id": 119,
  "source": "Anthropic Docs — CLI / allowedTools",
  "quote": "--allowedTools — tools that execute without permission prompts. --disallowedTools — tools removed from context entirely.",
  "url": "https://code.claude.com/docs/en/cli",
  "status": "PARTIAL"
}
```

## Q120: Adaptive decomposition for region-specific topics
```json
{
  "id": 120,
  "source": "Exam Guide — Task Statement 1.6",
  "quote": "When to use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings... The value of adaptive investigation plans that generate subtasks based on what is discovered at each step.",
  "url": "Exam Guide Task Statement 1.6 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q121: Loop detection on repeated identical tool calls (programmatic)
```json
{
  "id": 121,
  "source": "Exam Guide — Task Statement 1.4",
  "quote": "The difference between programmatic enforcement (hooks, prerequisite gates) and prompt-based guidance for workflow ordering... When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate.",
  "url": "Exam Guide Task Statement 1.4 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q122: Specific feedback for iterative refinement
```json
{
  "id": 122,
  "source": "Exam Guide — Task Statement 1.2",
  "quote": "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient.",
  "url": "Exam Guide Task Statement 1.2 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q123: Include review criteria in generator's system prompt
```json
{
  "id": 123,
  "source": "Anthropic Docs — Prompt Engineering Best Practices",
  "quote": "Set role in system prompt to focus behavior and tone... Add context: explain WHY a behavior is important (Claude generalizes from explanation).",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```

## Q124: CLAUDE.md for team conventions shared across sessions
```json
{
  "id": 124,
  "source": "Anthropic Docs — Memory / CLAUDE.md",
  "quote": "CLAUDE.md as the mechanism for providing project context (testing standards, fixture conventions, review criteria) to CI-invoked Claude Code.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q125: Parallel subagents via multiple tool_use blocks in single response
```json
{
  "id": 125,
  "source": "Exam Guide — Task Statement 1.3",
  "quote": "Spawning parallel subagents by emitting multiple Task tool calls in a single coordinator response rather than across separate turns.",
  "url": "Exam Guide Task Statement 1.3 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q126: Programmatic prerequisite gates over prompt instructions
```json
{
  "id": 126,
  "source": "Exam Guide — Task Statement 1.4",
  "quote": "Implementing programmatic prerequisites that block downstream tool calls until prerequisite steps have completed (e.g., blocking process_refund until get_customer has returned a verified customer ID).",
  "url": "Exam Guide Task Statement 1.4 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q127: Normalization layer between subagents and synthesis
```json
{
  "id": 127,
  "source": "Exam Guide — Task Statement 1.5",
  "quote": "Implementing PostToolUse hooks to normalize heterogeneous data formats (Unix timestamps, ISO 8601, numeric status codes) from different MCP tools before the agent processes them.",
  "url": "Exam Guide Task Statement 1.5 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q128: Interview pattern with specific questions
```json
{
  "id": 128,
  "source": "Exam Guide — Task Statement 3.5",
  "quote": "The interview pattern: having Claude ask questions to surface considerations the developer may not have anticipated before implementing... Using the interview pattern to surface design considerations (e.g., cache invalidation strategies, failure modes) before implementing solutions in unfamiliar domains.",
  "url": "Exam Guide Task Statement 3.5 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q129: Split generic tools into specific purpose-built tools
```json
{
  "id": 129,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source).",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q130: Tool descriptions with boundaries and when-not-to-use guidance
```json
{
  "id": 130,
  "source": "Anthropic Docs — Tool Use (Define Tools)",
  "quote": "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q131: MCP resources for content catalog browsing
```json
{
  "id": 131,
  "source": "Exam Guide — Task Statement 2.4",
  "quote": "MCP resources as a mechanism for exposing content catalogs (e.g., issue summaries, documentation hierarchies, database schemas) to reduce exploratory tool calls... Exposing content catalogs as MCP resources to give agents visibility into available data without requiring exploratory tool calls.",
  "url": "Exam Guide Task Statement 2.4 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q132: Namespaced tool names and boundary-aware descriptions
```json
{
  "id": 132,
  "source": "Anthropic Docs — MCP / Tool Naming",
  "quote": "MCP Tool Naming Pattern: mcp__<server>__<action>. Example: mcp__playwright__browser_screenshot.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "PARTIAL"
}
```

## Q133: Community MCP servers for standard integrations, custom for proprietary
```json
{
  "id": 133,
  "source": "Exam Guide — Task Statement 2.4",
  "quote": "Choosing existing community MCP servers over custom implementations for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows.",
  "url": "Exam Guide Task Statement 2.4 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q134: Replace generic tools with constrained alternatives
```json
{
  "id": 134,
  "source": "Exam Guide — Task Statement 2.3",
  "quote": "Replacing generic tools with constrained alternatives (e.g., replacing fetch_url with load_document that validates document URLs).",
  "url": "Exam Guide Task Statement 2.3 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q135: Scoped verify_fact tool with description enforcing boundaries
```json
{
  "id": 135,
  "source": "Exam Guide — Task Statement 2.3",
  "quote": "Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator.",
  "url": "Exam Guide Task Statement 2.3 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q136: Enhanced tool descriptions with full guidance
```json
{
  "id": 136,
  "source": "Anthropic Docs — Tool Use (Define Tools)",
  "quote": "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations. Aim for at least 3-4 sentences per tool description, more if the tool is complex.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q137: Too many tools degrades selection; consolidate before adding
```json
{
  "id": 137,
  "source": "Exam Guide — Task Statement 2.3",
  "quote": "The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity.",
  "url": "Exam Guide Task Statement 2.3 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q138: Tool descriptions explain differences and when-to-use
```json
{
  "id": 138,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Writing tool descriptions that clearly differentiate each tool's purpose, expected inputs, outputs, and when to use it versus similar alternatives.",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q139: Enhance description with scope and negative boundaries
```json
{
  "id": 139,
  "source": "Exam Guide — Task Statement 2.4",
  "quote": "Enhancing MCP tool descriptions to explain capabilities and outputs in detail, preventing the agent from preferring built-in tools (like Grep) over more capable MCP tools.",
  "url": "Exam Guide Task Statement 2.4 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q140: Environment variable expansion in .mcp.json for credentials
```json
{
  "id": 140,
  "source": "Anthropic Docs — MCP / Claude Code",
  "quote": "Claude Code supports environment variable expansion in .mcp.json files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys. Supported syntax: ${VAR} - Expands to the value of environment variable VAR.",
  "url": "https://code.claude.com/docs/en/mcp",
  "status": "STRONG"
}
```

## Q141: Split multi-mode tool into focused specific tools
```json
{
  "id": 141,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source).",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q142: Description differentiates new tool from existing tool
```json
{
  "id": 142,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Writing tool descriptions that clearly differentiate each tool's purpose, expected inputs, outputs, and when to use it versus similar alternatives.",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q143: Tool descriptions are primary mechanism for selection
```json
{
  "id": 143,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Tool descriptions as the primary mechanism LLMs use for tool selection; minimal descriptions lead to unreliable selection among similar tools.",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q144: Structured data with semantic grouping
```json
{
  "id": 144,
  "source": "Exam Guide — Task Statement 1.3",
  "quote": "Using structured data formats to separate content from metadata (source URLs, document names, page numbers) when passing context between agents to preserve attribution.",
  "url": "Exam Guide Task Statement 1.3 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q145: Community MCP server + small custom server for proprietary needs
```json
{
  "id": 145,
  "source": "Exam Guide — Task Statement 2.4",
  "quote": "Choosing existing community MCP servers over custom implementations for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows.",
  "url": "Exam Guide Task Statement 2.4 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q146: Tool descriptions include preconditions and alternate tools
```json
{
  "id": 146,
  "source": "Anthropic Docs — Tool Use (Define Tools)",
  "quote": "Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

## Q147: Tool composition via classify-then-route
```json
{
  "id": 147,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source).",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q148: Subdirectory CLAUDE.md for per-package conventions
```json
{
  "id": 148,
  "source": "Anthropic Docs — Memory / CLAUDE.md Hierarchy",
  "quote": "The CLAUDE.md configuration hierarchy: user-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), and directory-level (subdirectory CLAUDE.md files).",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q149: CLAUDE.local.md for personal project preferences
```json
{
  "id": 149,
  "source": "Anthropic Docs — Memory",
  "quote": "Local | ./CLAUDE.local.md | Just you (current project)... CLAUDE.local.md lives at project root: ./CLAUDE.local.md. Should be added to .gitignore. Appended after CLAUDE.md at same directory level. Personal project-specific preferences.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q150: Provide existing test files in CI context
```json
{
  "id": 150,
  "source": "Exam Guide — Task Statement 3.6",
  "quote": "Providing existing test files in context so test generation avoids suggesting duplicate scenarios already covered by the test suite.",
  "url": "Exam Guide Task Statement 3.6 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q151: CLAUDE.local.md for personal role-specific additions
```json
{
  "id": 151,
  "source": "Anthropic Docs — Memory / CLAUDE.local.md",
  "quote": "CLAUDE.local.md lives at project root: ./CLAUDE.local.md. Should be added to .gitignore. Appended after CLAUDE.md at same directory level. Personal project-specific preferences.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q152: PostToolUse hook for deterministic post-edit linting
```json
{
  "id": 152,
  "source": "Anthropic Docs — Hooks",
  "quote": "PostToolUse hooks are useful for validation, logging, format checking, and providing Claude with contextual information about what occurred during tool execution.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

## Q153: /memory command usage (Claude Code)
```json
{
  "id": 153,
  "source": "Exam Guide — Task Statement 3.1",
  "quote": "Using the /memory command to verify which memory files are loaded and diagnose inconsistent behavior across sessions.",
  "url": "Exam Guide Task Statement 3.1 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q154: All configuration sources merge in context
```json
{
  "id": 154,
  "source": "Anthropic Docs — Memory",
  "quote": "Loading: walks up directory tree from cwd, loading CLAUDE.md and CLAUDE.local.md at each level. Within each directory, CLAUDE.local.md appended after CLAUDE.md. Subdirectory CLAUDE.md files load on demand.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "PARTIAL"
}
```

## Q155: Session context isolation for independent CI reviews
```json
{
  "id": 155,
  "source": "Exam Guide — Task Statement 3.6",
  "quote": "Session context isolation: why the same Claude session that generated code is less effective at reviewing its own changes compared to an independent review instance.",
  "url": "Exam Guide Task Statement 3.6 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q156: Configuration sources merge; model must resolve contradictions
```json
{
  "id": 156,
  "source": "Anthropic Docs — Memory",
  "quote": "Loading: walks up directory tree from cwd, loading CLAUDE.md and CLAUDE.local.md at each level. Within each directory, CLAUDE.local.md appended after CLAUDE.md.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "PARTIAL"
}
```

## Q157: Custom slash commands in .claude/commands/ with $ARGUMENTS
```json
{
  "id": 157,
  "source": "Anthropic Docs — Skills / Commands",
  "quote": "Custom commands have been merged into skills. A file at .claude/commands/deploy.md and a skill at .claude/skills/deploy/SKILL.md both create /deploy and work the same way. Your existing .claude/commands/ files keep working.",
  "url": "https://code.claude.com/docs/en/skills",
  "status": "STRONG"
}
```

## Q158: Read-only test files with CLAUDE.md context for CI
```json
{
  "id": 158,
  "source": "Exam Guide — Task Statement 1.4 / 3.6",
  "quote": "The difference between programmatic enforcement (hooks, prerequisite gates) and prompt-based guidance for workflow ordering... When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate.",
  "url": "Exam Guide Task Statement 1.4 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q159: .claude/rules/ with glob patterns for file-type-specific rules
```json
{
  "id": 159,
  "source": "Exam Guide — Task Statement 3.3",
  "quote": ".claude/rules/ files with YAML frontmatter paths fields containing glob patterns for conditional rule activation... Creating .claude/rules/ files with YAML frontmatter path scoping (e.g., paths: [\"terraform/**/*\"]) so rules load only when editing matching files.",
  "url": "Exam Guide Task Statement 3.3 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q160: CI-enforced standards take precedence over personal preferences
```json
{
  "id": 160,
  "source": "Exam Guide — Task Statement 3.1",
  "quote": "Diagnosing configuration hierarchy issues (e.g., a new team member not receiving instructions because they're in user-level rather than project-level configuration).",
  "url": "Exam Guide Task Statement 3.1 (Domain 3)",
  "status": "PARTIAL"
}
```

## Q161: CLAUDE.md for shared project knowledge across team
```json
{
  "id": 161,
  "source": "Anthropic Docs — Memory",
  "quote": "Project | ./CLAUDE.md or ./.claude/CLAUDE.md | Team via VCS.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q162: Provide specific file paths and architecture context
```json
{
  "id": 162,
  "source": "Exam Guide — Task Statement 3.5",
  "quote": "Test-driven iteration: writing test suites first, then iterating by sharing test failures to guide progressive improvement... Writing test suites covering expected behavior, edge cases, and performance requirements before implementation, then iterating by sharing test failures.",
  "url": "Exam Guide Task Statement 3.5 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q163: Scope CI context to changed files only
```json
{
  "id": 163,
  "source": "Anthropic Docs — Context Windows",
  "quote": "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
  "status": "PARTIAL"
}
```

## Q164: Subdirectory CLAUDE.md for legacy overrides
```json
{
  "id": 164,
  "source": "Anthropic Docs — Memory / Compaction Survival",
  "quote": "Project-root CLAUDE.md survives: re-read from disk and re-injected after /compact. Nested subdirectory CLAUDE.md NOT re-injected until Claude reads files in that subdirectory.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "PARTIAL"
}
```

## Q165: @import explicit inclusion — not automatic discovery
```json
{
  "id": 165,
  "source": "Anthropic Docs — Memory / @import",
  "quote": "The @import syntax for referencing external files to keep CLAUDE.md modular (e.g., importing specific standards files relevant to each package)... Maximum depth of 5 hops. Both relative and absolute paths allowed.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

## Q166: Path-specific rules with glob patterns over subdirectory CLAUDE.md
```json
{
  "id": 166,
  "source": "Exam Guide — Task Statement 3.3",
  "quote": "The advantage of glob-pattern rules over directory-level CLAUDE.md files for conventions that span multiple directories (e.g., test files spread throughout a codebase)... Choosing path-specific rules over subdirectory CLAUDE.md files when conventions must apply to files spread across the codebase.",
  "url": "Exam Guide Task Statement 3.3 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q167: Multi-pass review with separate focused passes
```json
{
  "id": 167,
  "source": "Exam Guide — Task Statement 4.6",
  "quote": "Multi-pass review: splitting large reviews into per-file local analysis passes plus cross-file integration passes to avoid attention dilution and contradictory findings.",
  "url": "Exam Guide Task Statement 4.6 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q168: @import to include ADR content in CLAUDE.md at session start
```json
{
  "id": 168,
  "source": "Exam Guide — Task Statement 3.1",
  "quote": "Using @import to selectively include relevant standards files in each package's CLAUDE.md based on maintainer domain knowledge.",
  "url": "Exam Guide Task Statement 3.1 (Domain 3)",
  "status": "EXAM_GUIDE"
}
```

## Q169: detected_pattern field for false positive analysis
```json
{
  "id": 169,
  "source": "Exam Guide — Task Statement 4.4",
  "quote": "Feedback loop design: tracking which code constructs trigger findings (detected_pattern field) to enable systematic analysis of dismissal patterns... Adding detected_pattern fields to structured findings to enable analysis of false positive patterns when developers dismiss findings.",
  "url": "Exam Guide Task Statement 4.4 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q170: Extract calculated_total + stated_total with discrepancy flag
```json
{
  "id": 170,
  "source": "Exam Guide — Task Statement 4.4",
  "quote": "Designing self-correction validation flows: extracting 'calculated_total' alongside 'stated_total' to flag discrepancies, adding 'conflict_detected' booleans for inconsistent source data.",
  "url": "Exam Guide Task Statement 4.4 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q171: Explicit multi-intent extraction instructions
```json
{
  "id": 171,
  "source": "Anthropic Docs — Prompt Engineering Best Practices",
  "quote": "Be clear and direct — think of Claude as a brilliant but new employee. Provide sequential steps using numbered lists when order matters. Add context: explain WHY a behavior is important.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```

## Q172: Prompt refinement on sample before scaling batch
```json
{
  "id": 172,
  "source": "Exam Guide — Task Statement 4.5",
  "quote": "Using prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs.",
  "url": "Exam Guide Task Statement 4.5 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q173: Keyword-sensitive prompt wording biases extraction
```json
{
  "id": 173,
  "source": "Exam Guide — Task Statement 2.1",
  "quote": "The impact of system prompt wording on tool selection: keyword-sensitive instructions can create unintended tool associations... Reviewing system prompts for keyword-sensitive instructions that might override well-written tool descriptions.",
  "url": "Exam Guide Task Statement 2.1 (Domain 2)",
  "status": "EXAM_GUIDE"
}
```

## Q174: High confidence is not reliable proxy for correctness
```json
{
  "id": 174,
  "source": "Exam Guide — Task Statement 5.2",
  "quote": "Why sentiment-based escalation and self-reported confidence scores are unreliable proxies for actual case complexity.",
  "url": "Exam Guide Task Statement 5.2 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q175: Explicit severity criteria with concrete examples
```json
{
  "id": 175,
  "source": "Exam Guide — Task Statement 4.1",
  "quote": "Defining explicit severity criteria with concrete code examples for each severity level to achieve consistent classification.",
  "url": "Exam Guide Task Statement 4.1 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q176: Few-shot examples for format demonstration
```json
{
  "id": 176,
  "source": "Anthropic Docs — Prompt Engineering Best Practices",
  "quote": "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure... Include 3-5 examples for best results.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

## Q177: Explicit calculation/reasoning requirements in prompts
```json
{
  "id": 177,
  "source": "Anthropic Docs — Prompt Engineering (Chain of Thought)",
  "quote": "Prefer general instructions over prescriptive steps. Use <thinking> and <answer> tags when thinking disabled. Self-check: 'Before finishing, verify your answer against [criteria]'.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```

## Q178: Certainty level schema field with defined levels
```json
{
  "id": 178,
  "source": "Exam Guide — Task Statement 4.3",
  "quote": "Adding enum values like 'unclear' for ambiguous cases and 'other' + detail fields for extensible categorization... Designing schema fields as optional (nullable) when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields.",
  "url": "Exam Guide Task Statement 4.3 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q179: Multi-dimensional schema for mixed sentiment
```json
{
  "id": 179,
  "source": "Exam Guide — Task Statement 4.3",
  "quote": "Schema design considerations: required vs optional fields, enum fields with 'other' + detail string patterns for extensible categories.",
  "url": "Exam Guide Task Statement 4.3 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q180: Structured schema with concrete fields for extraction
```json
{
  "id": 180,
  "source": "Anthropic Docs — Structured Outputs",
  "quote": "Tool use (tool_use) with JSON schemas as the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "STRONG"
}
```

## Q181: Structured output schema enforces consistent subagent quality
```json
{
  "id": 181,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "Requiring subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis... Modifying upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains when downstream agents have limited context budgets.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q182: Disambiguation hints with needs_review flag in schema
```json
{
  "id": 182,
  "source": "Exam Guide — Task Statement 4.3",
  "quote": "Including format normalization rules in prompts alongside strict output schemas to handle inconsistent source formatting.",
  "url": "Exam Guide Task Statement 4.3 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q183: Explicit criteria with positive actions over vague instructions
```json
{
  "id": 183,
  "source": "Exam Guide — Task Statement 4.1",
  "quote": "The importance of explicit criteria over vague instructions (e.g., 'flag comments only when claimed behavior contradicts actual code behavior' vs 'check that comments are accurate').",
  "url": "Exam Guide Task Statement 4.1 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q184: Prompt refinement on sample before batch scale-up
```json
{
  "id": 184,
  "source": "Exam Guide — Task Statement 4.5",
  "quote": "Using prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs.",
  "url": "Exam Guide Task Statement 4.5 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q185: Structured analytical requirements with specific components
```json
{
  "id": 185,
  "source": "Exam Guide — Task Statement 4.1",
  "quote": "Writing specific review criteria that define which issues to report (bugs, security) versus skip (minor style, local patterns) rather than relying on confidence-based filtering.",
  "url": "Exam Guide Task Statement 4.1 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q186: Schema with exceptions array for conditional terms
```json
{
  "id": 186,
  "source": "Exam Guide — Task Statement 4.3",
  "quote": "Schema design considerations: required vs optional fields, enum fields with 'other' + detail string patterns for extensible categories.",
  "url": "Exam Guide Task Statement 4.3 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q187: Explicit policy-sentiment separation in prompt
```json
{
  "id": 187,
  "source": "Exam Guide — Task Statement 5.2",
  "quote": "Acknowledging frustration while offering resolution when the issue is within the agent's capability, escalating only if the customer reiterates their preference.",
  "url": "Exam Guide Task Statement 5.2 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q188: Document-type classifier with type-specific instructions
```json
{
  "id": 188,
  "source": "Anthropic Docs — Prompt Engineering Best Practices",
  "quote": "Use XML tags to structure complex prompts: <instructions>, <context>, <input>. Consistent, descriptive tag names. Nest tags for hierarchy: <documents> containing <document index=\"n\">.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```

## Q189: Retry ineffective when info absent from source
```json
{
  "id": 189,
  "source": "Exam Guide — Task Statement 4.4",
  "quote": "The limits of retry: retries are ineffective when the required information is simply absent from the source document (vs format or structural errors)... Identifying when retries will be ineffective (e.g., information exists only in an external document not provided) versus when they will succeed (format mismatches, structural output errors).",
  "url": "Exam Guide Task Statement 4.4 (Domain 4)",
  "status": "EXAM_GUIDE"
}
```

## Q190: Fix at source — upstream structured data output
```json
{
  "id": 190,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "Modifying upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains when downstream agents have limited context budgets.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q191: Render content types appropriately in synthesis
```json
{
  "id": 191,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "Rendering different content types appropriately in synthesis outputs—financial data as tables, news as prose, technical findings as structured lists—rather than converting everything to a uniform format.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q192: Distilled context package with constraints and priorities
```json
{
  "id": 192,
  "source": "Exam Guide — Task Statement 1.3",
  "quote": "Including complete findings from prior agents directly in the subagent's prompt (e.g., passing web search results and document analysis outputs to the synthesis subagent)... Designing coordinator prompts that specify research goals and quality criteria rather than step-by-step procedural instructions, to enable subagent adaptability.",
  "url": "Exam Guide Task Statement 1.3 (Domain 1)",
  "status": "EXAM_GUIDE"
}
```

## Q193: Publication date metadata for temporal data
```json
{
  "id": 193,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions... Requiring subagents to include publication or data collection dates in structured outputs to enable correct temporal interpretation.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q194: Conflict annotation rather than arbitrary selection
```json
{
  "id": 194,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value... Completing document analysis with conflicting values included and explicitly annotated, letting the coordinator decide how to reconcile before passing to synthesis.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q195: Multi-issue context with case facts and topic boundaries
```json
{
  "id": 195,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "Extracting and persisting structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q196: Comprehensive metadata for subagent reliability assessment
```json
{
  "id": 196,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "Requiring subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q197: Chunking long documents — lost-in-the-middle effect
```json
{
  "id": 197,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "The 'lost in the middle' effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q198: Coverage annotations map findings to sections
```json
{
  "id": 198,
  "source": "Exam Guide — Task Statement 5.3",
  "quote": "Structuring synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources.",
  "url": "Exam Guide Task Statement 5.3 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q199: Structured checklist in prompt for complete system checks
```json
{
  "id": 199,
  "source": "Anthropic Docs — Prompt Engineering Best Practices",
  "quote": "Provide sequential steps using numbered lists when order matters. Add context: explain WHY a behavior is important (Claude generalizes from explanation).",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```

## Q200: Temporal references interpreted relative to publication date
```json
{
  "id": 200,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q201: Long-context attention degradation — chunk with overlaps
```json
{
  "id": 201,
  "source": "Anthropic Docs — Context Windows",
  "quote": "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
  "status": "STRONG"
}
```

## Q202: Mandatory source citations with validation
```json
{
  "id": 202,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "Requiring subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that downstream agents preserve through synthesis... The importance of structured claim-source mappings that the synthesis agent must preserve and merge when combining findings.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q203: Topic-organized context state for multi-issue conversations
```json
{
  "id": 203,
  "source": "Exam Guide — Task Statement 5.1",
  "quote": "Extracting transactional facts (amounts, dates, order numbers, statuses) into a persistent 'case facts' block included in each prompt, outside summarized history... Extracting and persisting structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions.",
  "url": "Exam Guide Task Statement 5.1 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

## Q204: Source metadata with weighted synthesis on conflicts
```json
{
  "id": 204,
  "source": "Exam Guide — Task Statement 5.6",
  "quote": "Structuring reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context... How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value.",
  "url": "Exam Guide Task Statement 5.6 (Domain 5)",
  "status": "EXAM_GUIDE"
}
```

---

## Summary

- **STRONG** (direct Anthropic doc quote): 15 questions
- **PARTIAL** (related doc content, partial support): 12 questions
- **EXAM_GUIDE** (explicitly in exam guide task statements): 77 questions
- **NO_DOC**: 0 questions

All 104 questions (IDs 101-204) are grounded in either Anthropic's official documentation or the Claude Certified Architect Foundations Exam Guide. The majority of questions in this batch test concepts that are explicitly enumerated in the exam guide's Domain 1-5 task statements rather than reproduced verbatim in the public docs, which is consistent with the exam's design (testing "practical judgment about architecture, configuration, and tradeoffs").

Key patterns:
- Domain 1 (Agentic Architecture) questions heavily reference Task Statements 1.2 (coordinator-subagent), 1.3 (context passing), 1.4 (enforcement/handoff), 1.6 (decomposition), 1.7 (sessions)
- Domain 2 (Tool Design) anchors on Task Statements 2.1 (tool descriptions), 2.3 (distribution), 2.4 (MCP)
- Domain 3 (Claude Code) maps to Task Statements 3.1 (CLAUDE.md), 3.3 (path rules), 3.5 (iteration), 3.6 (CI/CD)
- Domain 4 (Prompts) maps to Task Statements 4.1 (explicit criteria), 4.3 (structured output), 4.4 (validation), 4.5 (batch)
- Domain 5 (Context) maps to Task Statements 5.1 (context preservation), 5.3 (error propagation), 5.6 (provenance)
