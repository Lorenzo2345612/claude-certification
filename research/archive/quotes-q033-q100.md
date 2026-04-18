[
  {
    "id": 33,
    "source": "Exam Guide — Task Statement 1.3",
    "quote": "Spawning parallel subagents by emitting multiple Task tool calls in a single coordinator response rather than across separate turns",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 34,
    "source": "Exam Guide — Task Statement 1.5",
    "quote": "Implementing tool call interception hooks that block policy-violating actions (e.g., refunds exceeding $500) and redirect to alternative workflows (e.g., human escalation)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 35,
    "source": "Anthropic Docs — Create custom subagents",
    "quote": "Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions. When Claude encounters a task that matches a subagent's description, it delegates to that subagent, which works independently and returns results.",
    "url": "https://code.claude.com/docs/en/subagents",
    "status": "STRONG"
  },
  {
    "id": 36,
    "source": "Exam Guide — Task Statement 5.4 + 5.1",
    "quote": "Context degradation in extended sessions: models start giving inconsistent answers and referencing \"typical patterns\" rather than specific classes discovered earlier… The \"lost in the middle\" effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 37,
    "source": "Exam Guide — Task Statement 5.4",
    "quote": "Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume… Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 38,
    "source": "Exam Guide — Task Statement 1.2",
    "quote": "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 39,
    "source": "Anthropic Docs — Hooks Reference",
    "quote": "This example runs a linting script only when Claude writes or edits a file:\n```json\n{\n  \"hooks\": {\n    \"PostToolUse\": [\n      {\n        \"matcher\": \"Edit|Write\",\n        \"hooks\": [\n          {\n            \"type\": \"command\",\n            \"command\": \"/path/to/lint-check.sh\"\n          }\n        ]\n      }\n    ]\n  }\n}\n```",
    "url": "https://code.claude.com/docs/en/hooks",
    "status": "STRONG"
  },
  {
    "id": 40,
    "source": "Anthropic Docs — Create custom subagents",
    "quote": "Subagents help you: Preserve context by keeping exploration and implementation out of your main conversation; Enforce constraints by limiting which tools a subagent can use; … Specialize behavior with focused system prompts for specific domains",
    "url": "https://code.claude.com/docs/en/subagents",
    "status": "STRONG"
  },
  {
    "id": 41,
    "source": "Anthropic Docs — Handle tool calls",
    "quote": "If Claude's attempted use of a tool is invalid (for example, missing required parameters), it usually means that there wasn't enough information for Claude to use the tool correctly… However, you can also continue the conversation forward with a `tool_result` that indicates the error, and Claude will try to use the tool again with the missing information filled in",
    "url": "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/handle-tool-calls",
    "status": "STRONG"
  },
  {
    "id": 42,
    "source": "Anthropic Docs — Common workflows",
    "quote": "You can switch into Plan Mode during a session using **Shift+Tab** to cycle through permission modes. If you are in Normal Mode, **Shift+Tab** first switches into Auto-Accept Mode, indicated by `⏵⏵ accept edits on` at the bottom of the terminal. A subsequent **Shift+Tab** will switch into Plan Mode",
    "url": "https://code.claude.com/docs/en/common-workflows",
    "status": "STRONG"
  },
  {
    "id": 43,
    "source": "Exam Guide — Task Statement 5.3",
    "quote": "Structured error context (failure type, attempted query, partial results, alternative approaches) as enabling intelligent coordinator recovery decisions… Having subagents implement local recovery for transient failures and only propagate errors they cannot resolve, including what was attempted and partial results",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 44,
    "source": "Anthropic Docs — Hooks Reference",
    "quote": "`PostToolUse` hooks can provide feedback to Claude after tool execution.",
    "url": "https://code.claude.com/docs/en/hooks",
    "status": "PARTIAL"
  },
  {
    "id": 45,
    "source": "Anthropic Docs — Create custom subagents",
    "quote": "A fast, read-only agent optimized for searching and analyzing codebases. … Claude delegates to Explore when it needs to search or understand a codebase without making changes. This keeps exploration results out of your main conversation context.",
    "url": "https://code.claude.com/docs/en/subagents",
    "status": "STRONG"
  },
  {
    "id": 46,
    "source": "Exam Guide — Task Statement 1.4",
    "quote": "Implementing programmatic prerequisites that block downstream tool calls until prerequisite steps have completed (e.g., blocking process_refund until get_customer has returned a verified customer ID)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 47,
    "source": "Exam Guide — Task Statement 1.3",
    "quote": "Fork-based session management for exploring divergent approaches from a shared analysis baseline… Using fork_session to create parallel exploration branches (e.g., comparing two testing strategies or refactoring approaches from a shared codebase analysis)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 48,
    "source": "Anthropic Docs — Best practices for Claude Code",
    "quote": "Give Claude a way to verify its work… Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do.",
    "url": "https://code.claude.com/docs/en/best-practices",
    "status": "PARTIAL"
  },
  {
    "id": 49,
    "source": "Anthropic Docs — Hooks Reference",
    "quote": "`async`       | no       | If `true`, runs in the background without blocking. See [Run hooks in the background](#run-hooks-in-the-background)",
    "url": "https://code.claude.com/docs/en/hooks",
    "status": "STRONG"
  },
  {
    "id": 50,
    "source": "Anthropic Docs — Create custom subagents",
    "quote": "This prevents infinite nesting (subagents cannot spawn other subagents) while still gathering necessary context.",
    "url": "https://code.claude.com/docs/en/subagents",
    "status": "STRONG"
  },
  {
    "id": 51,
    "source": "Exam Guide — Task Statement 5.1",
    "quote": "The \"lost in the middle\" effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections… Placing key findings summaries at the beginning of aggregated inputs and organizing detailed results with explicit section headers to mitigate position effects",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 52,
    "source": "Anthropic Docs — Connect Claude Code to tools via MCP",
    "quote": "| [Local](#local-scope)     | Current project only | No                       | `~/.claude.json`            |\n| [Project](#project-scope) | Current project only | Yes, via version control | `.mcp.json` in project root |\n| [User](#user-scope)       | All your projects    | No                       | `~/.claude.json`            |",
    "url": "https://code.claude.com/docs/en/mcp",
    "status": "STRONG"
  },
  {
    "id": 53,
    "source": "Exam Guide — Task Statement 2.3",
    "quote": "The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 54,
    "source": "Exam Guide — Task Statement 2.2",
    "quote": "Returning structured error metadata including errorCategory (transient/validation/permission), isRetryable boolean, and human-readable descriptions",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 55,
    "source": "Anthropic Docs — Connect Claude Code to tools via MCP",
    "quote": "Claude Code supports environment variable expansion in `.mcp.json` files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys. … `${VAR}` - Expands to the value of environment variable `VAR`",
    "url": "https://code.claude.com/docs/en/mcp",
    "status": "STRONG"
  },
  {
    "id": 56,
    "source": "Anthropic Docs — Define tools",
    "quote": "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does; When it should be used (and when it shouldn't)",
    "url": "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/define-tools",
    "status": "STRONG"
  },
  {
    "id": 57,
    "source": "Anthropic Docs — Hooks Reference",
    "quote": "The script inspects the full command and finds `rm -rf`, so it prints a decision to stdout:\n```json\n{\n  \"hookSpecificOutput\": {\n    \"hookEventName\": \"PreToolUse\",\n    \"permissionDecision\": \"deny\",\n    \"permissionDecisionReason\": \"Destructive command blocked by hook\"\n  }\n}\n```",
    "url": "https://code.claude.com/docs/en/hooks",
    "status": "STRONG"
  },
  {
    "id": 58,
    "source": "Exam Guide — Task Statement 2.1",
    "quote": "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "PARTIAL"
  },
  {
    "id": 59,
    "source": "Exam Guide — Task Statement 2.2",
    "quote": "Why uniform error responses (generic \"Operation failed\") prevent the agent from making appropriate recovery decisions",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "PARTIAL"
  },
  {
    "id": 60,
    "source": "Anthropic Docs — Connect Claude Code to tools via MCP",
    "quote": "Project-scoped servers enable team collaboration by storing configurations in a `.mcp.json` file at your project's root directory. This file is designed to be checked into version control, ensuring all team members have access to the same MCP tools and services. … User-scoped servers are stored in `~/.claude.json` and provide cross-project accessibility, making them available across all projects on your machine while remaining private to your user account.",
    "url": "https://code.claude.com/docs/en/mcp",
    "status": "STRONG"
  },
  {
    "id": 61,
    "source": "Exam Guide — Task Statement 2.5",
    "quote": "Grep for content search (searching file contents for patterns like function names, error messages, or import statements)… Selecting Grep for searching code content across a codebase (e.g., finding all callers of a function, locating error messages)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 62,
    "source": "Anthropic Docs — Define tools",
    "quote": "In some cases, you may want Claude to use a specific tool to answer the user's question, even if Claude would otherwise answer directly without calling a tool. You can do this by specifying the tool in the `tool_choice` field like so: `tool_choice = {\"type\": \"tool\", \"name\": \"get_weather\"}`",
    "url": "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/define-tools",
    "status": "STRONG"
  },
  {
    "id": 63,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "All discovered files are concatenated into context rather than overriding each other. Within each directory, `CLAUDE.local.md` is appended after `CLAUDE.md`, so when instructions conflict, your personal notes are the last thing Claude reads at that level.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 64,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "CLAUDE.md files are loaded into the context window at the start of every session, consuming tokens alongside your conversation. … **Size**: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 65,
    "source": "Anthropic Docs — CLI reference",
    "quote": "`--json-schema` | Get validated JSON output matching a JSON Schema after agent completes its workflow (print mode only, see [structured outputs](/en/agent-sdk/structured-outputs))",
    "url": "https://code.claude.com/docs/en/cli",
    "status": "STRONG"
  },
  {
    "id": 66,
    "source": "Anthropic Docs — Best practices for Claude Code",
    "quote": "Claude Code automatically compacts conversation history when you approach context limits, which preserves important code and decisions while freeing space. … For more control, run `/compact <instructions>`, like `/compact Focus on the API changes`",
    "url": "https://code.claude.com/docs/en/best-practices",
    "status": "STRONG"
  },
  {
    "id": 67,
    "source": "Anthropic Docs — Best practices for Claude Code",
    "quote": "For large migrations or analyses, you can distribute work across many parallel Claude invocations: … ```for file in $(cat files.txt); do\n      claude -p \"Migrate $file from React to Vue. Return OK or FAIL.\" \\\n        --allowedTools \"Edit,Bash(git commit *)\"\n    done```",
    "url": "https://code.claude.com/docs/en/best-practices",
    "status": "PARTIAL"
  },
  {
    "id": 68,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "Rules can be scoped to specific files using YAML frontmatter with the `paths` field. These conditional rules only apply when Claude is working with files matching the specified patterns. … Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 69,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "**Size**: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence. If your instructions are growing large, split them using [imports](#import-additional-files) or [`.claude/rules/`](#organize-rules-with-claude/rules/) files.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 70,
    "source": "Anthropic Docs — CLI reference",
    "quote": "`--output-format` | Specify output format for print mode (options: `text`, `json`, `stream-json`)",
    "url": "https://code.claude.com/docs/en/cli",
    "status": "PARTIAL"
  },
  {
    "id": 71,
    "source": "Anthropic Docs — Extend Claude with skills",
    "quote": "| Personal   | `~/.claude/skills/<skill-name>/SKILL.md`            | All your projects              |\n| Project    | `.claude/skills/<skill-name>/SKILL.md`              | This project only              |",
    "url": "https://code.claude.com/docs/en/skills",
    "status": "STRONG"
  },
  {
    "id": 72,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "**Project instructions** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared instructions for the project | Project architecture, coding standards, common workflows | Team members via source control",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 73,
    "source": "Anthropic Docs — Extend Claude with skills",
    "quote": "Add `context: fork` to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history.",
    "url": "https://code.claude.com/docs/en/skills",
    "status": "STRONG"
  },
  {
    "id": 74,
    "source": "Exam Guide — Task Statement 3.6",
    "quote": "Using --output-format json with --json-schema to produce machine-parseable structured findings for automated posting as inline PR comments",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 75,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` files in subdirectories under your current working directory. Instead of loading them at launch, they are included when Claude reads files in those subdirectories.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 76,
    "source": "Anthropic Docs — How Claude remembers your project",
    "quote": "Run `/init` to generate a starting CLAUDE.md automatically. Claude analyzes your codebase and creates a file with build commands, test instructions, and project conventions it discovers.",
    "url": "https://code.claude.com/docs/en/memory",
    "status": "STRONG"
  },
  {
    "id": 77,
    "source": "Anthropic Docs — Prompting best practices",
    "quote": "Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. If you want \"above and beyond\" behavior, explicitly request it rather than relying on the model to infer this from vague prompts.",
    "url": "https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    "status": "STRONG"
  },
  {
    "id": 78,
    "source": "Anthropic Docs — Batch processing",
    "quote": "A unique `custom_id` for identifying the Messages request. Must be 1 to 64 characters and contain only alphanumeric characters, hyphens, and underscores (matching `^[a-zA-Z0-9_-]{1,64}$`).",
    "url": "https://platform.claude.com/docs/en/docs/build-with-claude/batch-processing",
    "status": "STRONG"
  },
  {
    "id": 79,
    "source": "Exam Guide — Task Statement 5.5",
    "quote": "Field-level confidence scores calibrated using labeled validation sets for routing review attention… Having models output field-level confidence scores, then calibrating review thresholds using labeled validation sets",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 80,
    "source": "Anthropic Docs — Strict tool use",
    "quote": "Strict tool use guarantees type-safe parameters: Functions receive correctly-typed arguments every time… For example, suppose a booking system needs `passengers: int`. Without strict mode, Claude might provide `passengers: \"two\"` or `passengers: \"2\"`. With `strict: true`, the response will always contain `passengers: 2`.",
    "url": "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/strict-tool-use",
    "status": "STRONG"
  },
  {
    "id": 81,
    "source": "Anthropic Docs — Prompting best practices",
    "quote": "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency.",
    "url": "https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    "status": "STRONG"
  },
  {
    "id": 82,
    "source": "Exam Guide — Task Statement 4.4",
    "quote": "Implementing follow-up requests that include the original document, the failed extraction, and specific validation errors for model self-correction",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 83,
    "source": "Anthropic Docs — Batch processing",
    "quote": "The system processes each batch as fast as possible, with most batches completing within 1 hour. You can access batch results when all messages have completed or after 24 hours, whichever comes first. Batches expire if processing does not complete within 24 hours. … Since each request in the batch is processed independently",
    "url": "https://platform.claude.com/docs/en/docs/build-with-claude/batch-processing",
    "status": "STRONG"
  },
  {
    "id": 84,
    "source": "Exam Guide — Task Statement 4.6",
    "quote": "Self-review limitations: a model retains reasoning context from generation, making it less likely to question its own decisions in the same session… Independent review instances (without prior reasoning context) are more effective at catching subtle issues than self-review instructions or extended thinking",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 85,
    "source": "Anthropic Docs — Prompting best practices",
    "quote": "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency.",
    "url": "https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    "status": "STRONG"
  },
  {
    "id": 86,
    "source": "Anthropic Docs — Define tools",
    "quote": "`tool` forces Claude to always use a particular tool. … `tool_choice = {\"type\": \"tool\", \"name\": \"get_weather\"}`",
    "url": "https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/define-tools",
    "status": "STRONG"
  },
  {
    "id": 87,
    "source": "Exam Guide — Task Statement 5.6",
    "quote": "Requiring subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that downstream agents preserve through synthesis",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 88,
    "source": "Exam Guide — Task Statement 4.6",
    "quote": "Multi-pass review: splitting large reviews into per-file local analysis passes plus cross-file integration passes to avoid attention dilution and contradictory findings",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 89,
    "source": "Exam Guide — Task Statement 4.3",
    "quote": "Designing schema fields as optional (nullable) when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields… Adding enum values like \"unclear\" for ambiguous cases and \"other\" + detail fields for extensible categorization",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 90,
    "source": "Exam Guide — Task Statement 5.6",
    "quote": "Structuring reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 91,
    "source": "Exam Guide — Task Statement 5.1",
    "quote": "Extracting transactional facts (amounts, dates, order numbers, statuses) into a persistent \"case facts\" block included in each prompt, outside summarized history",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 92,
    "source": "Exam Guide — Task Statement 5.1",
    "quote": "The \"lost in the middle\" effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 93,
    "source": "Exam Guide — Task Statement 5.4",
    "quote": "The role of scratchpad files for persisting key findings across context boundaries… Having agents maintain scratchpad files recording key findings, referencing them for subsequent questions to counteract context degradation",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 94,
    "source": "Exam Guide — Task Statement 5.2",
    "quote": "Why sentiment-based escalation and self-reported confidence scores are unreliable proxies for actual case complexity",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 95,
    "source": "Exam Guide — Task Statement 5.6",
    "quote": "Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions… Requiring subagents to include publication or data collection dates in structured outputs to enable correct temporal interpretation",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "PARTIAL"
  },
  {
    "id": 96,
    "source": "Exam Guide — Out-of-Scope / Task Statement 4.2",
    "quote": "The effectiveness of few-shot examples for reducing hallucination in extraction tasks (e.g., handling informal measurements, varied document structures)",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "NO_DOC"
  },
  {
    "id": 97,
    "source": "Exam Guide — Task Statement 5.4 + 1.7",
    "quote": "Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume… Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 98,
    "source": "Exam Guide — Task Statement 5.4",
    "quote": "The role of scratchpad files for persisting key findings across context boundaries… Summarizing key findings from one exploration phase before spawning sub-agents for the next phase, injecting summaries into initial context",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 99,
    "source": "Exam Guide — Task Statement 4.4",
    "quote": "Retry-with-error-feedback: appending specific validation errors to the prompt on retry to guide the model toward correction… Implementing follow-up requests that include the original document, the failed extraction, and specific validation errors for model self-correction",
    "url": "C:/dev/claude-certifications/instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf",
    "status": "EXAM_GUIDE"
  },
  {
    "id": 100,
    "source": "Anthropic Docs — Extend Claude with skills",
    "quote": "Add `context: fork` to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history.",
    "url": "https://code.claude.com/docs/en/skills",
    "status": "STRONG"
  }
]
