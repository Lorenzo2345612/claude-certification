# Documentation Quotes for Questions 1-32

## Q1: Programmatic prerequisite blocks tool ordering
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works
Quote: NO DIRECT DOC FOUND — Concept from exam guide (Task Statement 1.4) but not explicitly in API docs as "programmatic prerequisite gates." The hooks docs say: "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."
Status: PARTIAL — supported by hooks docs principle of deterministic enforcement

## Q2: Coordinator's narrow task decomposition causes coverage gaps
URL: Exam Guide Task Statement 1.2
Quote: NO DIRECT DOC FOUND — This is an exam guide concept: "Risks of overly narrow task decomposition by the coordinator, leading to incomplete coverage of broad research topics."
Status: EXAM GUIDE ONLY

## Q3: stop_reason tool_use continues loop, end_turn terminates
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works
Quote: "The canonical shape is a while loop keyed on stop_reason... while stop_reason == 'tool_use', execute the tools and continue the conversation. The loop exits on any other stop reason ('end_turn', 'max_tokens', 'stop_sequence', or 'refusal'), which means Claude has either produced a final answer or stopped for another reason."
Status: STRONG

## Q4: Scoped verify_fact tool for synthesis agent (least privilege)
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools
Quote: "Consolidate related operations into fewer tools. Rather than creating a separate tool for every action, group them into a single tool with an action parameter. Fewer, more capable tools reduce selection ambiguity."
Status: PARTIAL — principle of tool scoping exists but specific verify_fact pattern is exam guide only

## Q5: PostToolUse hook provides deterministic data normalization
URL: https://code.claude.com/docs/en/hooks
Quote: "PostToolUse hooks are useful for validation, logging, format checking, and providing Claude with contextual information about what occurred during tool execution." and "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."
Status: STRONG

## Q6: Tool descriptions are primary mechanism for tool selection
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools
Quote: "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations. Aim for at least 3-4 sentences per tool description, more if the tool is complex."
Status: STRONG

## Q7: MCP server config in .mcp.json with env var expansion
URL: https://code.claude.com/docs/en/mcp
Quote: "Claude Code supports environment variable expansion in .mcp.json files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys. Supported syntax: ${VAR} - Expands to the value of environment variable VAR. ${VAR:-default} - Expands to VAR if set, otherwise uses default."
Status: STRONG

## Q8: Too many tools (18) degrades selection, restrict per agent
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools
Quote: "Consolidate related operations into fewer tools. Rather than creating a separate tool for every action (create_pr, review_pr, merge_pr), group them into a single tool with an action parameter. Fewer, more capable tools reduce selection ambiguity and make your tool surface easier for Claude to navigate."
Status: PARTIAL — principle established, specific number 18 is from exam guide

## Q9: Structured error response with isError, errorCategory, isRetryable
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls
Quote: "Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.' This gives Claude the context it needs to recover or adapt without guessing."
Status: PARTIAL — is_error documented, errorCategory/isRetryable are application patterns not API fields

## Q10: .claude/commands/ for project-scoped slash commands
URL: https://code.claude.com/docs/en/skills
Quote: "Custom commands have been merged into skills. A file at .claude/commands/deploy.md and a skill at .claude/skills/deploy/SKILL.md both create /deploy and work the same way. Your existing .claude/commands/ files keep working."
Status: STRONG

## Q11: Plan mode for complex architectural decisions
URL: https://code.claude.com/docs/en/common-workflows
Quote: "Plan Mode instructs Claude to create a plan by analyzing the codebase with read-only operations, perfect for exploring codebases, planning complex changes, or reviewing code safely." and "When to use Plan Mode: Multi-step implementation, Code exploration, Interactive development."
Status: STRONG

## Q12: .claude/rules/ with glob patterns for path-specific rules
URL: https://code.claude.com/docs/en/memory
Quote: "Rules can be scoped to specific files using YAML frontmatter with the paths field. These conditional rules only apply when Claude is working with files matching the specified patterns."
Status: STRONG

## Q13: -p flag for non-interactive CI/CD mode
URL: https://code.claude.com/docs/en/cli
Quote: "claude -p 'query' — Query via SDK, then exit" and "--print, -p — Print response without interactive mode"
Status: STRONG

## Q14: User-level CLAUDE.md not shared via version control
URL: https://code.claude.com/docs/en/memory
Quote: "User instructions | ~/.claude/CLAUDE.md | Personal preferences for all projects | Just you (all projects)" vs "Project instructions | ./CLAUDE.md | Team-shared instructions for the project | Team members via source control"
Status: STRONG

## Q15: Semantic errors not caught by JSON schemas, need post-validation
URL: https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs
Quote: "The SDKs automatically: Remove unsupported constraints (e.g., minimum, maximum), Update descriptions with constraint info, Add additionalProperties: false, Validate responses against your original schema (with all constraints)."
Status: PARTIAL — structural compliance documented, semantic validation gap is an inference

## Q16: Disable high false-positive categories to restore trust
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: NO DIRECT DOC FOUND — Concept from exam guide (Task Statement 4.1): "Temporarily disabling high false-positive categories to restore developer trust while improving prompts for those categories."
Status: EXAM GUIDE ONLY

## Q17: Batch API for non-blocking workflows, real-time for blocking
URL: https://docs.anthropic.com/en/docs/build-with-claude/batch-processing
Quote: "The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of Messages requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50%."
Status: STRONG

## Q18: Nullable/optional schema fields prevent fabrication
URL: https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs
Quote: "Required properties appear first, followed by optional properties." — The docs describe nullable types but do NOT explicitly state they prevent fabrication.
Status: PARTIAL — nullable types documented, fabrication prevention is exam guide inference

## Q19: Verbose tool outputs cause context issues, extract case facts
URL: https://docs.anthropic.com/en/docs/build-with-claude/context-windows + tool-use/define-tools
Quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot." and "Design tool responses to return only high-signal information... Bloated responses waste context and make it harder for Claude to extract what matters."
Status: STRONG

## Q20: Explicit escalation criteria with few-shot examples
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure... Include 3-5 examples for best results."
Status: PARTIAL — few-shot documented, escalation criteria specifically is exam guide

## Q21: Structured error context for coordinator recovery
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/handle-tool-calls
Quote: "Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.' This gives Claude the context it needs to recover or adapt without guessing."
Status: STRONG

## Q22: Aggregate accuracy masks poor performance on specific types
URL: N/A
Quote: NO DOC FOUND — This is a general ML/data science concept, not documented in Anthropic docs.
Status: EXAM GUIDE ONLY (Task Statement 5.5)

## Q23: Context degradation in extended sessions, use scratchpad
URL: https://docs.anthropic.com/en/docs/build-with-claude/context-windows
Quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available."
Status: PARTIAL — context rot documented, "scratchpad" term not in API docs (Claude Code best practices mention memory tool)

## Q24: Split reviews into per-file + cross-file passes
URL: Exam Guide Task Statement 1.6
Quote: NO DIRECT DOC FOUND — Exam guide says: "Splitting large code reviews into per-file local analysis passes plus a separate cross-file integration pass to avoid attention dilution." Not in API docs.
Status: EXAM GUIDE ONLY

## Q25: Decompose multi-concern requests, investigate in parallel
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: "Claude's latest models excel at parallel tool execution. These models will: Run multiple speculative searches during research, Read several files at once to build context faster."
Status: PARTIAL — parallel execution documented, multi-concern decomposition is exam guide

## Q26: Grep for incremental codebase exploration
URL: https://code.claude.com/docs/en/hooks (built-in tools list)
Quote: "Built-in tools: Bash, Edit, Write, Read, Glob, Grep, Agent, WebFetch, WebSearch"
Status: PARTIAL — tools listed but "incremental exploration" pattern not explicitly documented as a single paragraph

## Q27: Few-shot examples for varied document formats
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure... make them: Relevant, Diverse: Cover edge cases and vary enough that Claude doesn't pick up unintended patterns. Structured: Wrap in <example> tags."
Status: STRONG

## Q28: Annotate conflicting data with source attribution
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: "Ground responses in quotes: For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task." and document structure with <source> subtags.
Status: PARTIAL — source attribution documented, conflict annotation is exam guide

## Q29: context: fork for isolated skill execution
URL: https://code.claude.com/docs/en/skills
Quote: "Add context: fork to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history."
Status: STRONG

## Q30: Immediate escalation when customer requests human
URL: Exam Guide Task Statement 5.2
Quote: NO DOC FOUND — Exam guide says: "The distinction between escalating immediately when a customer explicitly demands it versus offering to resolve when the issue is straightforward." Not in API docs.
Status: EXAM GUIDE ONLY

## Q31: tool_choice: any guarantees some tool is called
URL: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools
Quote: "any tells Claude that it must use one of the provided tools, but doesn't force a particular tool." and "when you have tool_choice as any or tool, the API prefills the assistant message to force a tool to be used."
Status: STRONG

## Q32: Structured state manifests for crash recovery
URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Quote: "Use structured formats for state data: When tracking structured information (like test results or task status), use JSON or other structured formats." and "Use git for state tracking."
Status: PARTIAL — structured state tracking documented, "crash recovery manifests" specifically is exam guide
