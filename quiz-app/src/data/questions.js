export const questions = [
  // ===== DOMAIN 1: Agentic Architecture & Orchestration (27%) =====
  {
    id: 1,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent skips get_customer in 12% of cases and calls lookup_order directly with the customer's name, causing incorrect refunds. What change would be most effective?",
    options: [
      { id: "a", text: "Add a programmatic prerequisite that blocks lookup_order and process_refund until get_customer returns a verified customer ID.", correct: true },
      { id: "b", text: "Improve the system prompt indicating that verification via get_customer is mandatory before any order operation.", correct: false },
      { id: "c", text: "Add few-shot examples showing the agent always calling get_customer first, even when customers offer order details.", correct: false },
      { id: "d", text: "Implement a routing classifier that analyzes each request and enables only the appropriate subset of tools for that request type.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "When a specific tool sequence is required for critical business logic (like verifying identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot.",
    whyOthersWrong: {
      b: "Prompt instructions depend on probabilistic LLM compliance, which is insufficient when errors have financial consequences. A 12% failure rate already demonstrates that the prompt is not enough.",
      c: "Few-shot examples improve probability but do not guarantee it. For critical business logic with financial impact, you need deterministic enforcement, not probabilistic.",
      d: "A routing classifier addresses tool availability, not tool ordering, which is the real problem. The agent has the correct tools but uses them in the wrong order."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 1.4",
      quote: "Implementing programmatic prerequisites that block downstream tool calls until prerequisite steps have completed (e.g., blocking process_refund until get_customer has returned a verified customer ID). When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate."
    }
  },
  {
    id: 2,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your multi-agent system on 'impact of AI on creative industries' produces reports that only cover visual arts, omitting music, writing, and film. The coordinator logs show it decomposed the topic into: 'AI in digital art', 'AI in graphic design', and 'AI in photography'. What is the most likely root cause?",
    options: [
      { id: "a", text: "The synthesis agent lacks instructions to identify coverage gaps in the findings it receives.", correct: false },
      { id: "b", text: "The coordinator's task decomposition is too narrow, resulting in subagent assignments that do not cover all relevant domains of the topic.", correct: true },
      { id: "c", text: "The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.", correct: false },
      { id: "d", text: "The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The coordinator logs reveal the root cause directly: it decomposed 'creative industries' only into visual arts subtasks. The subagents executed their assigned tasks correctly — the problem is what they were assigned.",
    whyOthersWrong: {
      a: "The synthesis agent works correctly with the data it receives. It cannot identify gaps in topics that were never investigated because the coordinator never delegated them.",
      c: "The web search agent executed correct queries within the scope it was assigned. The problem is upstream in the decomposition, not in the search.",
      d: "There is no evidence of filtering in the analysis agent. The downstream subagents work correctly within their assigned scope."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 1.2",
      quote: "Risks of overly narrow task decomposition by the coordinator, leading to incomplete coverage of broad research topics. The coordinator is responsible for task decomposition, delegation, result aggregation, and deciding which subagents to invoke based on query complexity."
    }
  },
  {
    id: 3,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "What is the correct way to determine when an agentic loop should terminate?",
    options: [
      { id: "a", text: "Parse the model's response looking for phrases like 'I have completed the task' or 'The final answer is' to detect when it has finished.", correct: false },
      { id: "b", text: "Set a maximum of 10 iterations and automatically terminate upon reaching it, regardless of the task state.", correct: false },
      { id: "c", text: "Continue when stop_reason is 'tool_use' and terminate when stop_reason is 'end_turn'.", correct: true },
      { id: "d", text: "Check whether the assistant's response contains text blocks (not tool_use) as an indicator that the task is complete.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The correct agentic loop inspects stop_reason: 'tool_use' indicates the model wants to execute tools and the loop should continue, while 'end_turn' indicates the model has finished its reasoning.",
    whyOthersWrong: {
      a: "Parsing natural language to determine loop termination is an explicitly listed anti-pattern. The model may generate text that sounds like a conclusion while still needing to execute more tools.",
      b: "Setting arbitrary iteration caps as the primary stopping mechanism is an anti-pattern. It may prematurely terminate legitimate tasks or execute unnecessary iterations.",
      d: "Checking assistant text content as a completeness indicator is another explicitly listed anti-pattern. The model may generate intermediate text before making more tool calls."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — How Tool Use Works",
      quote: "While stop_reason == 'tool_use', execute the tools and continue the conversation. The loop exits on any other stop reason ('end_turn', 'max_tokens', 'stop_sequence', or 'refusal'), which means Claude has either produced a final answer or stopped for another reason that your application should handle."
    }
  },
  {
    id: 4,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "The synthesis agent frequently needs to verify specific claims. Currently it goes back to the coordinator, which invokes the search agent, and then re-invokes synthesis. This adds 2-3 round trips and increases latency by 40%. 85% are simple fact-checks. How can you reduce overhead while maintaining reliability?",
    options: [
      { id: "a", text: "Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue to be delegated to the search agent via the coordinator.", correct: true },
      { id: "b", text: "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass.", correct: false },
      { id: "c", text: "Give the synthesis agent access to all web search tools so it can handle any verification need directly.", correct: false },
      { id: "d", text: "Have the search agent proactively cache extra context around each source during the initial investigation.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Apply the principle of least privilege by giving the synthesis agent only what it needs for the 85% of common cases (simple fact verification) while preserving the existing coordination pattern for complex cases.",
    whyOthersWrong: {
      b: "Batching creates blocking dependencies since synthesis steps may depend on previously verified facts. It cannot synthesize correctly without verifying intermediate claims.",
      c: "Over-provisioning the synthesis agent with all search tools violates separation of concerns and degrades tool selection reliability by giving it too many options.",
      d: "Speculative caching cannot reliably predict what the synthesis agent will need to verify. It is a waste of resources and does not solve the problem."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 2.3",
      quote: "Scoped tool access: giving agents only the tools needed for their role, with limited cross-role tools for specific high-frequency needs. Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator."
    }
  },
  {
    id: 5,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "You implemented a PostToolUse hook that normalizes timestamps from different backend APIs. The hook converts Unix timestamps to ISO 8601 and numeric status codes to readable names. What primary benefit does this approach provide versus including normalization instructions in the prompt?",
    options: [
      { id: "a", text: "The hook reduces token consumption by processing data before it enters the model's context.", correct: false },
      { id: "b", text: "The hook provides guaranteed deterministic normalization that does not depend on the model's probabilistic interpretation.", correct: true },
      { id: "c", text: "The hook allows running normalization in parallel with model calls, reducing total latency.", correct: false },
      { id: "d", text: "The hook eliminates the need to document data formats from each backend API in tool descriptions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Hooks provide deterministic data transformation guarantees. Unlike prompt instructions, a hook always performs normalization in the same way, without probabilistic variation.",
    whyOthersWrong: {
      a: "PostToolUse hooks process data after tool execution but the normalized data still enters the context. There is no significant token reduction.",
      c: "PostToolUse hooks execute sequentially after each tool call, not in parallel with model calls. They do not reduce latency.",
      d: "Tool descriptions are still necessary for the model to understand what each tool does. The hook normalizes output, it does not replace documentation."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Hooks",
      quote: "PostToolUse hooks are useful for validation, logging, format checking, and providing Claude with contextual information about what occurred during tool execution. Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."
    }
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration (18%) =====
  {
    id: 6,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Logs show the agent calls get_customer when users ask about orders ('check my order #12345'). Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details'). What is the most effective first step?",
    options: [
      { id: "a", text: "Add few-shot examples to the system prompt demonstrating correct tool selection patterns with 5-8 examples.", correct: false },
      { id: "b", text: "Expand each tool's description to include input formats, example queries, edge cases, and limits explaining when to use it versus similar alternatives.", correct: true },
      { id: "c", text: "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on keywords.", correct: false },
      { id: "d", text: "Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, the model lacks the context to differentiate between similar tools.",
    whyOthersWrong: {
      a: "Few-shot examples add token overhead without fixing the underlying problem. The root cause is inadequate descriptions, not lack of examples.",
      c: "A routing layer is over-engineering and bypasses the LLM's natural language comprehension capability. It is too much effort for a problem that is solved with better descriptions.",
      d: "Consolidating tools is a valid architectural decision but requires more effort than a 'first step' justifies when the immediate problem is inadequate descriptions."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Tool Use / Define Tools",
      quote: "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: what the tool does, when it should be used (and when it shouldn't), what each parameter means, and any important caveats or limitations. Aim for at least 3-4 sentences per tool description."
    }
  },
  {
    id: 7,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your team needs to configure a GitHub MCP server for the entire project team. Credentials vary per developer. Where should the configuration go?",
    options: [
      { id: "a", text: "In each developer's ~/.claude.json with their tokens hardcoded.", correct: false },
      { id: "b", text: "In .mcp.json in the project repository with environment variable expansion for authentication tokens.", correct: true },
      { id: "c", text: "In the project's CLAUDE.md with instructions for Claude to configure the server at the start of each session.", correct: false },
      { id: "d", text: "In a .env file in the project root that is committed to the repository with all team tokens.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Shared team MCP servers go in .mcp.json (project-scoped) with environment variable expansion (${GITHUB_TOKEN}) to handle credentials without committing secrets.",
    whyOthersWrong: {
      a: "~/.claude.json is for personal/experimental servers. It is not shared via version control, so each developer would have to configure it manually.",
      c: "CLAUDE.md is for project instructions and context, not for MCP server configuration. It has no mechanism for defining servers.",
      d: "Committing tokens to the repository is a serious security vulnerability. Environment variables in .mcp.json solve this with ${VARIABLE_NAME}."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — MCP",
      quote: "Claude Code supports environment variable expansion in .mcp.json files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys. Supported syntax: ${VAR} and ${VAR:-default}."
    }
  },
  {
    id: 8,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator has 18 available tools and tool selection is erratic. Subagents use tools outside their specialization (the synthesis agent tries to do web searches). How can you improve reliability?",
    options: [
      { id: "a", text: "Add detailed instructions to the coordinator's prompt explaining when to use each of the 18 tools.", correct: false },
      { id: "b", text: "Implement a scoring system that evaluates each tool call before execution and rejects those that do not match the agent's specialization.", correct: false },
      { id: "c", text: "Restrict each subagent's tool set to only the tools relevant for its role, preventing cross-specialization misuse.", correct: true },
      { id: "d", text: "Use forced tool_choice for each turn, always pre-selecting the tool the coordinator should use next.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Giving access to too many tools (18 vs 4-5) degrades selection reliability. Each subagent should receive only the tools necessary for its specific role.",
    whyOthersWrong: {
      a: "Adding more instructions to the prompt does not compensate for the decision complexity effect caused by having 18 available tools. The model gets confused with too many options.",
      b: "A pre-execution scoring system is over-engineering. The correct approach is to prevent the problem upstream by restricting available tools per role.",
      d: "Forced tool_choice for each turn eliminates the model's ability to reason about which tool to use, which is fundamental for agentic behavior."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Tool Use / Define Tools",
      quote: "Consolidate related operations into fewer tools. Rather than creating a separate tool for every action, group them into a single tool with an action parameter. Fewer, more capable tools reduce selection ambiguity and make your tool surface easier for Claude to navigate."
    }
  },
  {
    id: 9,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your MCP database tool returns a timeout error. What is the best structure for the error response?",
    options: [
      { id: "a", text: "Return isError: true with a generic string 'Operation failed. Please try again.'", correct: false },
      { id: "b", text: "Throw an exception that terminates the agent workflow and notifies the user of the error.", correct: false },
      { id: "c", text: "Return an empty result marked as successful so the agent can continue without interruptions.", correct: false },
      { id: "d", text: "Return isError: true with structured metadata: errorCategory 'transient', isRetryable true, timeout description, and attempted query.", correct: true }
    ],
    correctAnswer: "d",
    explanation: "Structured error responses with category, retryability, and context allow the agent to make intelligent recovery decisions. Generic errors do not provide enough information to decide.",
    whyOthersWrong: {
      a: "A generic 'Operation failed' error hides valuable context. The agent cannot distinguish between transient errors (retry) and permanent ones (seek alternative).",
      b: "Terminating the entire workflow for a single timeout is an anti-pattern. The agent could retry or use an alternative strategy if it receives sufficient information.",
      c: "Silently suppressing errors (returning empty as success) is an explicitly listed anti-pattern. It prevents any recovery and risks incomplete results without notice."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Handle Tool Calls",
      quote: "If the tool itself throws an error during execution (for example, a network error when fetching weather data), you can return the error message in the content along with 'is_error': true. Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next."
    }
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows (20%) =====
  {
    id: 10,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want to create a custom /review slash command for your team's standard code review checklist. It should be available to every developer upon cloning or pulling the repository. Where should you create it?",
    options: [
      { id: "a", text: "In the .claude/commands/ directory of the project repository.", correct: true },
      { id: "b", text: "In ~/.claude/commands/ in each developer's home directory.", correct: false },
      { id: "c", text: "In the CLAUDE.md file at the project root.", correct: false },
      { id: "d", text: "In a .claude/config.json file with a commands array.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Project-scoped slash commands go in .claude/commands/ within the repository. They are versioned and automatically available to everyone upon cloning or pulling.",
    whyOthersWrong: {
      b: "~/.claude/commands/ is for personal commands that are NOT shared via version control. Each developer would have to configure it manually.",
      c: "CLAUDE.md is for project instructions and context, not for command definitions. Commands have their own mechanism.",
      d: ".claude/config.json with a commands array is a mechanism that does NOT exist in Claude Code."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Skills",
      quote: "Custom commands have been merged into skills. A file at .claude/commands/deploy.md and a skill at .claude/skills/deploy/SKILL.md both create /deploy and work the same way. Your existing .claude/commands/ files keep working."
    }
  },
  {
    id: 11,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You have been assigned to restructure your team's monolith into microservices. It will involve changes in dozens of files and requires decisions about service boundaries. What approach should you take?",
    options: [
      { id: "a", text: "Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.", correct: true },
      { id: "b", text: "Start with direct execution and make changes incrementally, letting the implementation reveal natural service boundaries.", correct: false },
      { id: "c", text: "Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.", correct: false },
      { id: "d", text: "Start in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Plan mode is designed for complex tasks with large-scale changes, multiple valid approaches, and architectural decisions — exactly what restructuring a monolith requires.",
    whyOthersWrong: {
      b: "Risks costly rework when dependencies are discovered late. In monolith restructuring, you need to understand the complete structure before cutting.",
      c: "Assumes you already know the correct structure without exploring the code. In a complex restructuring, upfront instructions cannot anticipate all dependencies.",
      d: "Ignores that the complexity is already declared in the requirements, not something that might emerge later. Restructuring a monolith is inherently complex."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Common Workflows",
      quote: "Plan Mode instructs Claude to create a plan by analyzing the codebase with read-only operations, perfect for exploring codebases, planning complex changes, or reviewing code safely. When to use Plan Mode: multi-step implementation, code exploration, interactive development."
    }
  },
  {
    id: 12,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your codebase has distinct conventions: React components (functional/hooks), API handlers (async/await), and database models (repository pattern). Test files are scattered throughout the codebase alongside the code they test. You want all tests to follow the same conventions regardless of location. What is the most maintainable way?",
    options: [
      { id: "a", text: "Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to apply conventions conditionally based on file paths.", correct: true },
      { id: "b", text: "Consolidate all conventions in the root CLAUDE.md under headers for each area, trusting Claude to infer which section applies.", correct: false },
      { id: "c", text: "Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files.", correct: false },
      { id: "d", text: "Place a separate CLAUDE.md in each subdirectory with the specific conventions for that area.", correct: false }
    ],
    correctAnswer: "a",
    explanation: ".claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows applying conventions automatically based on file paths regardless of directory location — essential for scattered test files.",
    whyOthersWrong: {
      b: "Relying on inference instead of explicit matching is unreliable. Claude could apply API conventions to a React component if there is no deterministic matching.",
      c: "Skills require manual invocation or depend on Claude loading them. They do not provide automatic deterministic application based on file paths.",
      d: "Directory CLAUDE.md files do not handle files scattered across many directories well. You would need to create a CLAUDE.md in every directory that has tests."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Memory",
      quote: "Rules can be scoped to specific files using YAML frontmatter with the paths field. These conditional rules only apply when Claude is working with files matching the specified patterns."
    }
  },
  {
    id: 13,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your pipeline script runs `claude \"Analyze this PR for security issues\"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What is the correct approach?",
    options: [
      { id: "a", text: "Add the -p flag: claude -p \"Analyze this pull request for security issues\"", correct: true },
      { id: "b", text: "Set the environment variable CLAUDE_HEADLESS=true before running the command.", correct: false },
      { id: "c", text: "Redirect stdin from /dev/null: claude \"Analyze...\" < /dev/null", correct: false },
      { id: "d", text: "Add the --batch flag: claude --batch \"Analyze this pull request for security issues\"", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The -p (--print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, prints the result to stdout, and exits without waiting for user input.",
    whyOthersWrong: {
      b: "CLAUDE_HEADLESS is not an environment variable that exists in Claude Code. It is an invented feature.",
      c: "Redirecting stdin from /dev/null is a Unix workaround that does not correctly address Claude Code's command syntax.",
      d: "The --batch flag does not exist in Claude Code. It is an invented feature."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — CLI Reference",
      quote: "--print, -p: Print response without interactive mode. Used for programmatic usage. Example: 'claude -p \"explain this function\"' queries via SDK then exits."
    }
  },
  {
    id: 14,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "A new team member reports that Claude Code does not follow the coding conventions that other developers see. The team has defined instructions. What is the most likely cause?",
    options: [
      { id: "a", text: "The instructions are in another developer's user-level CLAUDE.md (~/.claude/CLAUDE.md) instead of the project-level.", correct: true },
      { id: "b", text: "Claude Code has a bug that does not load CLAUDE.md in new sessions.", correct: false },
      { id: "c", text: "The new member needs to run /init to activate the project instructions.", correct: false },
      { id: "d", text: "The instructions exceed the allowed token limit in CLAUDE.md and are truncated.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Instructions in ~/.claude/CLAUDE.md (user-level) only apply to that user. They are not shared via version control. If the team instructions are there, other developers will not see them.",
    whyOthersWrong: {
      b: "CLAUDE.md loads automatically at the start of each session. A bug of this nature would be detected immediately by all users.",
      c: "/init generates an initial CLAUDE.md but is not a prerequisite for existing CLAUDE.md files to load. They load automatically.",
      d: "Although very large CLAUDE.md files can reduce adherence, the described problem (one member does not see instructions that others do) clearly points to a scope issue, not a size issue."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Memory",
      quote: "User instructions (~/.claude/CLAUDE.md): Personal preferences for all projects. Shared with: Just you (all projects). Project instructions (./CLAUDE.md): Team-shared instructions for the project. Shared with: Team members via source control."
    }
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output (20%) =====
  {
    id: 15,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your data extraction system uses tool_use with JSON schemas and achieves 0% JSON syntax errors. However, extracted invoices show line items that do not add up to the declared total. What type of error is this and how should you address it?",
    options: [
      { id: "a", text: "It is a schema error. Add stricter validation to the JSON schema with mathematical consistency checks.", correct: false },
      { id: "b", text: "It is a semantic error. Strict JSON schemas eliminate syntax errors but do not prevent value errors. Implement post-extraction validation that compares calculated_total with stated_total.", correct: true },
      { id: "c", text: "It is a model error. Switch to a more capable model that can do arithmetic correctly during extraction.", correct: false },
      { id: "d", text: "It is a prompt error. Add explicit instructions asking the model to verify arithmetic before returning.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Strict JSON schemas via tool_use eliminate syntax errors but do NOT prevent semantic errors (values in wrong fields, sums that do not add up). Programmatic post-extraction validation is needed.",
    whyOthersWrong: {
      a: "JSON schemas define structure and types, not mathematical relationships between fields. You cannot express 'sum(line_items) == total' in a JSON schema.",
      c: "The problem is not model capability but that schemas do not validate semantics. Any model can produce values that do not sum correctly without external validation.",
      d: "Prompt instructions improve probabilistically but do not guarantee arithmetic consistency. Programmatic validation is the correct approach."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Structured Outputs",
      quote: "The SDKs automatically: Remove unsupported constraints, Update descriptions with constraint info, Add additionalProperties: false to all objects, Validate responses against your original schema (with all constraints). This means Claude receives a simplified schema, but your code still enforces all constraints through validation."
    }
  },
  {
    id: 16,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your automated PR review generates too many false positives in the 'outdated comments' category, undermining developer trust in legitimate security findings. How should you address this?",
    options: [
      { id: "a", text: "Add 'be more conservative' and 'only report high-confidence findings' to the review prompt.", correct: false },
      { id: "b", text: "Implement a voting system where 3 independent instances must agree to report a finding.", correct: false },
      { id: "c", text: "Temporarily disable the outdated comments category to restore trust while improving the prompts for that category.", correct: true },
      { id: "d", text: "Reduce the total number of review categories to only security and bugs, permanently eliminating style categories.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "High false-positive rates in one category destroy trust in accurate categories. Temporarily disabling the problematic category restores trust while working on improving the prompts.",
    whyOthersWrong: {
      a: "General instructions like 'be conservative' or 'only report high-confidence findings' do NOT improve precision compared to specific categorical criteria. The instruction is too vague.",
      b: "A 3-instance voting system would triple the API cost without addressing the root cause (unclear criteria for that category). It would also suppress findings that are only detected intermittently.",
      d: "Permanently eliminating useful categories is an overreaction. The correct approach is to temporarily disable while improving the specific prompts for that category."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 4.1",
      quote: "Temporarily disabling high false-positive categories to restore developer trust while improving prompts for those categories. The impact of false positive rates on developer trust: high false positive categories undermine confidence in accurate categories."
    }
  },
  {
    id: 17,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your team wants to reduce API costs. They have two workflows: (1) a blocking pre-merge check and (2) an overnight tech debt report. Your manager proposes switching both to the Message Batches API (50% savings). How should you evaluate this proposal?",
    options: [
      { id: "a", text: "Use batch processing only for tech debt reports; keep real-time calls for pre-merge checks.", correct: true },
      { id: "b", text: "Switch both workflows to batch processing with status polling to verify completion.", correct: false },
      { id: "c", text: "Keep real-time calls for both workflows to avoid batch result ordering issues.", correct: false },
      { id: "d", text: "Switch both to batch processing with fallback to real-time if batches take too long.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The Message Batches API offers 50% savings but has processing times of up to 24 hours with no latency SLA. This makes it inappropriate for blocking pre-merge checks but ideal for overnight jobs.",
    whyOthersWrong: {
      b: "Depending on the batch completing 'generally faster' is not acceptable for blocking workflows where developers wait for results to merge.",
      c: "Reflects a misconception. Batch results can be correlated using custom_id fields. There is no ordering problem.",
      d: "Adds unnecessary complexity when the simplest solution is to match each API with its appropriate use case."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Batch Processing",
      quote: "The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of Messages requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50%."
    }
  },
  {
    id: 18,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline processes documents of diverse formats. Some documents do not contain certain fields required by your schema, and the model fabricates values to fill them. How do you prevent this?",
    options: [
      { id: "a", text: "Add instructions to the prompt saying 'do not invent data that does not exist in the source document'.", correct: false },
      { id: "b", text: "Use a larger model with better instruction-following capability to reduce hallucinations.", correct: false },
      { id: "c", text: "Design schema fields as optional (nullable) when the source may not have the info, preventing the model from fabricating values to satisfy required fields.", correct: true },
      { id: "d", text: "Implement post-processing that detects and removes values that appear fabricated based on statistical patterns.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "When fields are 'required' in the schema, the model is obligated to produce some value. Making them nullable/optional allows the model to return null when information does not exist, preventing fabrication.",
    whyOthersWrong: {
      a: "Prompt instructions help but cannot overcome the schema obligation. If a field is required, the model must produce a value, creating tension between instruction and constraint.",
      b: "The problem is not model capability but schema design. Even advanced models will fabricate values if the schema forces them to fill fields that have no source.",
      d: "Detecting fabrication after the fact is harder and less reliable than preventing fabrication with correct schema design."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 4.3",
      quote: "Designing schema fields as optional (nullable) when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields. Schema design considerations: required vs optional fields, enum fields with 'other' + detail string patterns for extensible categories."
    }
  },

  // ===== DOMAIN 5: Context Management & Reliability (15%) =====
  {
    id: 19,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent handles sessions with multiple issues. After resolving the first two issues, the agent incorrectly cites the refund amount from the first issue when summarizing. Tool outputs include 40+ fields per order lookup. What is causing the information loss?",
    options: [
      { id: "a", text: "The model has a bug in its long-term memory handling that causes loss of numerical data.", correct: false },
      { id: "b", text: "Verbose tool outputs accumulate tokens disproportionately, and progressive summarization condenses critical numerical values into vague summaries. You need to extract transactional data to a persistent 'case facts' block.", correct: true },
      { id: "c", text: "The context window is too small to handle multiple issues. A model with a larger context window is needed.", correct: false },
      { id: "d", text: "The agent needs explicit instructions to memorize each amount before proceeding to the next issue.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Tool outputs with 40+ fields consume tokens disproportionately. Progressive summarization loses numerical values, dates, and customer expectations. The solution is to extract transactional 'case facts' to a persistent block included in each prompt.",
    whyOthersWrong: {
      a: "This is not a model bug. It is a known context design problem: progressive summarization naturally compresses and loses specific details.",
      c: "A larger context window does not solve the problem if tool outputs remain verbose. The 40+ fields per lookup will continue to consume tokens unnecessarily.",
      d: "'Memorize' instructions are probabilistic enforcement. The correct approach is context design: extracting critical data to a structured layer separate from history."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Context Windows + Define Tools",
      quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. Design tool responses to return only high-signal information. Bloated responses waste context and make it harder for Claude to extract what matters."
    }
  },
  {
    id: 20,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent achieves 55% first-contact resolution (target: 80%). Logs show it escalates straightforward cases (standard replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. How can you improve escalation calibration?",
    options: [
      { id: "a", text: "Add explicit escalation criteria to the system prompt with few-shot examples demonstrating when to escalate vs resolve autonomously.", correct: true },
      { id: "b", text: "Have the agent self-report a confidence score (1-10) and automatically escalate when confidence is low.", correct: false },
      { id: "c", text: "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation.", correct: false },
      { id: "d", text: "Implement sentiment analysis to detect customer frustration and automatically escalate when negative sentiment exceeds a threshold.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Explicit escalation criteria with few-shot examples address the root cause: unclear decision boundaries. It is the proportional response before adding additional infrastructure.",
    whyOthersWrong: {
      b: "Self-reported confidence scores from LLMs are poorly calibrated. The agent is already incorrectly confident in difficult cases and insecure in simple cases. The score would reflect this poor calibration.",
      c: "Over-engineering that requires labeled data and ML infrastructure when prompt optimization has not even been attempted. It is the correct approach only if prompt optimization fails first.",
      d: "Solves a different problem. Customer sentiment does not correlate with case complexity, which is the real issue. A customer can be frustrated about a simple issue."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Prompting Best Practices",
      quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples can dramatically improve accuracy and consistency. Include 3-5 examples for best results."
    }
  },
  {
    id: 21,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "The web search subagent suffers a timeout. What error propagation approach best enables intelligent recovery by the coordinator?",
    options: [
      { id: "a", text: "Return structured error context to the coordinator including failure type, attempted query, partial results, and potential alternative approaches.", correct: true },
      { id: "b", text: "Implement automatic retry with exponential backoff within the subagent, returning a generic 'search unavailable' status only after exhausting all retries.", correct: false },
      { id: "c", text: "Catch the timeout within the subagent and return an empty result set marked as successful.", correct: false },
      { id: "d", text: "Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Structured error context gives the coordinator the information it needs to make intelligent recovery decisions: retry with modified query, alternative approach, or proceed with partial results.",
    whyOthersWrong: {
      b: "A generic 'search unavailable' status hides valuable context from the coordinator, preventing informed decisions. The coordinator needs to know what was attempted and what partial results exist.",
      c: "Suppressing the error by marking failure as success prevents any recovery and risks incomplete research outputs without any gap annotation.",
      d: "Terminating the entire workflow unnecessarily when recovery strategies could succeed. A timeout from one subagent should not eliminate the entire research."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Handle Tool Calls",
      quote: "Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.' This gives Claude the context it needs to recover or adapt without guessing."
    }
  },
  {
    id: 22,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your system reports 97% global accuracy in extraction. Why might this be misleading, and what should be done?",
    options: [
      { id: "a", text: "97% is sufficient for production. Reduce human review and scale processing volume.", correct: false },
      { id: "b", text: "Aggregate metrics can hide poor performance on specific document types. Analyze accuracy by document type and field, and implement stratified random sampling of high-confidence extractions.", correct: true },
      { id: "c", text: "The 3% error could be concentrated in non-critical fields. Ignore those errors and focus on improving pipeline throughput.", correct: false },
      { id: "d", text: "Implement a second model that verifies 100% of extractions to reach 99%+ accuracy.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "97% global accuracy can hide very poor performance on specific document types or fields. Stratified random sampling and segmented analysis are needed before reducing human review.",
    whyOthersWrong: {
      a: "Without segmented analysis, the 3% error could be concentrated in one document type (e.g., 30% error rate on legal contracts) which would be unacceptable.",
      c: "Assuming errors are in non-critical fields without data is irresponsible. Errors could be concentrated in critical financial or regulatory fields.",
      d: "Verifying 100% with a second model is costly and unnecessary. The correct approach is stratified sampling to find where the problems are and improve the pipeline in those areas."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 5.5",
      quote: "The risk that aggregate accuracy metrics (e.g., 97% overall) may mask poor performance on specific document types or fields. Stratified random sampling for measuring error rates in high-confidence extractions and detecting novel error patterns."
    }
  },
  {
    id: 23,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "Your productivity agent has been exploring a large codebase during an extended session. Responses become inconsistent, referencing 'typical patterns' instead of the specific classes it discovered earlier. What is happening and how do you resolve it?",
    options: [
      { id: "a", text: "The model is hallucinating due to the codebase complexity. A model with better reasoning capabilities is needed.", correct: false },
      { id: "b", text: "It is context degradation in extended sessions. Use scratchpad files to persist key findings and subagent delegation to isolate verbose exploration outputs.", correct: true },
      { id: "c", text: "The codebase is too large for an LLM to analyze. Pre-indexing the code with static analysis tools is needed.", correct: false },
      { id: "d", text: "Inconsistent responses indicate the model forgot the system prompt instructions. Instructions need to be repeated in each turn.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Context degradation is a known phenomenon in extended sessions where the model loses access to information discovered early on. Scratchpad files persist key findings and subagents isolate verbose output.",
    whyOthersWrong: {
      a: "This is not hallucination but context degradation. The model reasoned correctly at the beginning but lost access to those findings as the context filled with new information.",
      c: "LLMs can analyze large codebases effectively with good context management. The problem is not capability but how information is managed during long sessions.",
      d: "The system prompt is maintained throughout the session. The problem is that exploration findings (not instructions) are lost when the context compacts."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Context Windows",
      quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available."
    }
  },

  // ===== ADDITIONAL QUESTIONS TO COMPLETE THE BANK =====
  {
    id: 24,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "A PR modifies 14 files. Your single-pass review produces inconsistent results: detailed feedback for some files but superficial for others, obvious bugs missed, and contradictory feedback. How should you restructure?",
    options: [
      { id: "a", text: "Split into focused passes: analyze each file individually for local issues, then run a separate integration pass examining cross-file data flow.", correct: true },
      { id: "b", text: "Require developers to split large PRs into 3-4 file submissions before the automated review runs.", correct: false },
      { id: "c", text: "Switch to a higher-tier model with a larger context window to give adequate attention to all 14 files in a single pass.", correct: false },
      { id: "d", text: "Run three independent review passes over the full PR and only flag issues that appear in at least two of the three.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Splitting reviews into focused passes addresses the root cause: attention dilution when processing many files at once. Per-file analysis ensures consistent depth, and an integration pass captures cross-file issues.",
    whyOthersWrong: {
      b: "Transfers the burden to developers without improving the system. Developers should not have to adapt their workflow to limitations of the automated review.",
      c: "Larger context windows do not solve attention quality problems. The model may have room for all files but still lose focus distributed across 14 files.",
      d: "Consensus voting (2/3) would suppress detection of real bugs that are only detected intermittently. A real bug found in only 1 of 3 runs would be discarded."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 1.6",
      quote: "Splitting large code reviews into per-file local analysis passes plus a separate cross-file integration pass to avoid attention dilution. Prompt chaining patterns that break reviews into sequential steps."
    }
  },
  {
    id: 25,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "A customer sends a message with three problems: a duplicate charge of $47.50, a damaged item that needs replacement, and a question about their subscription. How should the agent handle this?",
    options: [
      { id: "a", text: "Address all three problems sequentially in order of financial priority, completing each before moving to the next.", correct: false },
      { id: "b", text: "Decompose the request into three distinct items, investigate each in parallel using shared context, and synthesize a unified resolution.", correct: true },
      { id: "c", text: "Escalate immediately to a human agent because multi-concern requests are too complex for automated resolution.", correct: false },
      { id: "d", text: "Ask the customer to send each issue in a separate message for cleaner processing.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Multi-concern customer requests should be decomposed into distinct items, investigated in parallel with shared context, and synthesized into a unified response for maximum efficiency.",
    whyOthersWrong: {
      a: "Sequential processing is unnecessarily slower. All three issues can be investigated in parallel (different tools/data) and the shared context allows a coherent resolution.",
      c: "All three issues are standard support types (billing, returns, subscription info). They do not require human escalation just for being multiple.",
      d: "Asking the customer to reformat their request is a terrible user experience. The agent should be able to handle messages with multiple concerns."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 1.4",
      quote: "Decomposing multi-concern customer requests into distinct items, then investigating each in parallel using shared context before synthesizing a unified resolution."
    }
  },
  {
    id: 26,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your agent needs to trace the usage of a function through wrapper modules. The original function is exported with different names in different files. What is the correct approach with built-in tools?",
    options: [
      { id: "a", text: "Use Read to load all project files at once and search for the function in the loaded content.", correct: false },
      { id: "b", text: "Use Glob to find all .ts/.js files and then Read each one searching for the function.", correct: false },
      { id: "c", text: "First use Grep to identify all exported names from the original module, then search each name with Grep across the codebase.", correct: true },
      { id: "d", text: "Use Bash to run a dependency analysis with an external tool like dependency-cruiser.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The correct pattern is incremental exploration: use Grep to find entry points (exports), then Grep again to trace each exported name across the codebase. It is token-efficient and accurate.",
    whyOthersWrong: {
      a: "Loading all files at once consumes massive tokens and is unnecessary. Incremental exploration is much more efficient.",
      b: "Glob + Read of all files is a brute-force approach that consumes too much context. Grep is the correct tool for content search.",
      d: "Depending on external tools when built-in tools are sufficient is unnecessary. Grep can trace function usages effectively."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 2.5",
      quote: "Building codebase understanding incrementally: starting with Grep to find entry points, then using Read to follow imports and trace flows, rather than reading all files upfront. Tracing function usage across wrapper modules by first identifying all exported names, then searching for each name across the codebase."
    }
  },
  {
    id: 27,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction of varied documents produces empty/null fields for required fields in documents with unusual formats (inline citations vs bibliographies, tables vs narrative). The documents DO contain the information but in unexpected formats. How do you resolve this?",
    options: [
      { id: "a", text: "Add a preprocessing step that normalizes all documents to a standard format before extraction.", correct: false },
      { id: "b", text: "Add few-shot examples showing correct extraction from documents with varied formats (inline citations vs bibliographies, narrative descriptions vs structured tables).", correct: true },
      { id: "c", text: "Implement automatic retry for each failed extraction with more detailed instructions about where to look.", correct: false },
      { id: "d", text: "Create a separate schema for each detected document format.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Few-shot examples are the most effective technique for handling document format variety, allowing the model to generalize to new formats based on the demonstrated patterns.",
    whyOthersWrong: {
      a: "Normalizing all documents is costly and brittle. Real-world document formats are extremely varied and a preprocessor cannot anticipate all variations.",
      c: "Retry without changing the available information does not help if the model does not know how to interpret the format. Few-shot examples teach the model to recognize different formats.",
      d: "Creating separate schemas is impractical when formats are diverse and unpredictable. The model needs to learn to extract the same schema from varied formats."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Prompting Best Practices",
      quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. Make them relevant, diverse (cover edge cases), and structured (wrap in <example> tags). Include 3-5 examples for best results."
    }
  },
  {
    id: 28,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research system finds conflicting statistics from two credible sources: a government study says 15% and an academic paper says 23% for the same metric. How should the final report handle this?",
    options: [
      { id: "a", text: "Use the average of both values (19%) as the best estimate.", correct: false },
      { id: "b", text: "Select the government study as the more authoritative source.", correct: false },
      { id: "c", text: "Annotate both values with source attribution instead of selecting one arbitrarily, and distinguish in the report between well-established and contested findings.", correct: true },
      { id: "d", text: "Omit the conflicting statistic from the report to avoid confusing the reader.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Conflicting data from credible sources should be preserved with source attribution. The report should explicitly distinguish between well-established and contested findings, preserving methodological context.",
    whyOthersWrong: {
      a: "Averaging conflicting values produces a number supported by neither source. It is not statistically valid and loses the context of why they differ.",
      b: "Arbitrarily selecting one source as 'more authoritative' loses valuable information. Both sources may have valid methodologies that explain the difference.",
      d: "Omitting conflicting data from the report is dishonest and loses valuable information for the reader. The conflicts themselves can be informative."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 5.6",
      quote: "How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value. Structuring reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context."
    }
  },
  {
    id: 29,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want to create a skill that analyzes your codebase and generates an extensive report. The output is very verbose and you do not want it to pollute the context of your main conversation. How should you configure the skill?",
    options: [
      { id: "a", text: "Add instructions in the SKILL.md asking the model to summarize its output before returning.", correct: false },
      { id: "b", text: "Use context: fork in the SKILL.md frontmatter to execute the skill in an isolated sub-agent.", correct: true },
      { id: "c", text: "Save the output to a file and add a link to the file in the conversation.", correct: false },
      { id: "d", text: "Split the skill into multiple smaller skills that each generate a part of the report.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "context: fork executes the skill in an isolated sub-agent context, preventing verbose outputs from polluting the main conversation. The sub-agent returns only a summary.",
    whyOthersWrong: {
      a: "Summarization instructions are probabilistic and the verbose output is still generated and consumes tokens in the main context before being summarized.",
      c: "Saving to a file is a manual workaround that does not leverage the built-in skill functionality for context isolation.",
      d: "Splitting into multiple skills does not solve the context pollution problem; each skill would still add output to the main conversation."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Claude Code Docs — Skills",
      quote: "Add context: fork to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history."
    }
  },
  {
    id: 30,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "The customer explicitly says: 'I want to talk to a real person, not a bot'. The customer's issue is a standard damaged product replacement that the agent can resolve in 30 seconds. What should the agent do?",
    options: [
      { id: "a", text: "Attempt to resolve the issue first demonstrating competence, and if the customer insists, then escalate.", correct: false },
      { id: "b", text: "Escalate immediately honoring the customer's explicit request for a human agent.", correct: true },
      { id: "c", text: "Explain that it is an AI system and offer to resolve the issue, mentioning that the wait for a human is 15 minutes.", correct: false },
      { id: "d", text: "Evaluate the customer's sentiment score and only escalate if negativity exceeds a predefined threshold.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When a customer explicitly requests a human agent, it must be honored immediately without first attempting to investigate or resolve. The explicit customer request is a priority escalation trigger.",
    whyOthersWrong: {
      a: "Attempting to resolve when the customer explicitly asked for a human ignores the customer's preference and can increase frustration. Only if the customer does NOT explicitly ask for a human but the issue is simple can you offer resolution.",
      c: "Attempting to dissuade the customer by mentioning wait times is manipulative. The customer made a clear request that must be honored.",
      d: "Sentiment analysis is an unreliable proxy. The customer already communicated their preference explicitly and clearly — no analysis is needed."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 5.2",
      quote: "Honoring explicit customer requests for human agents immediately without first attempting investigation. Appropriate escalation triggers: customer requests for a human, policy exceptions/gaps (not just complex cases), and inability to make meaningful progress."
    }
  },
  {
    id: 31,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your pipeline has an unknown document type that could be an invoice, receipt, or contract. You have separate extraction schemas for each type. How do you guarantee that some schema is applied?",
    options: [
      { id: "a", text: "Use tool_choice: 'auto' so the model decides which schema to use based on the document content.", correct: false },
      { id: "b", text: "Use tool_choice: 'any' to guarantee the model calls some extraction tool, letting it choose which schema to apply.", correct: true },
      { id: "c", text: "Implement a prior classifier that determines the document type before extraction.", correct: false },
      { id: "d", text: "Send the document to all three schemas in parallel and select the result with the highest completeness.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "tool_choice: 'any' guarantees the model calls some extraction tool but lets it choose which one, ideal when the document type is unknown and there are multiple possible schemas.",
    whyOthersWrong: {
      a: "tool_choice: 'auto' allows the model to respond with text instead of calling a tool. There is no guarantee it will extract structured data.",
      c: "A prior classifier adds latency and complexity. The model can determine the document type as part of tool selection without an extra step.",
      d: "Running all three schemas in parallel triples the cost and may produce conflicting results that need additional reconciliation."
    },
    docStatus: "STRONG",
    docReference: {
      source: "Anthropic Docs — Define Tools",
      quote: "'any' tells Claude that it must use one of the provided tools, but doesn't force a particular tool. Note that when you have tool_choice as 'any' or 'tool', the API prefills the assistant message to force a tool to be used."
    }
  },
  {
    id: 32,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research pipeline needs to handle crash recovery. The coordinator delegated to 5 subagents, 3 completed successfully, and the process crashed. When restarting, how do you recover the state?",
    options: [
      { id: "a", text: "Re-execute the entire pipeline from the beginning to guarantee consistency.", correct: false },
      { id: "b", text: "Use the stored conversation history to resume the original session and continue.", correct: false },
      { id: "c", text: "Design crash recovery using structured state exports (manifests) that the coordinator loads on resume and injects into agent prompts.", correct: true },
      { id: "d", text: "Implement an automatic checkpointing system every 30 seconds that saves the complete model state.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Structured state persistence with manifests allows efficient crash recovery. Each agent exports its state to a known location, and the coordinator loads the manifest on restart to continue only the incomplete work.",
    whyOthersWrong: {
      a: "Re-executing everything wastes the work of the 3 subagents that already completed successfully. It is inefficient and costly.",
      b: "Tool results in the conversation history may be stale and the history may be very long. Structured manifests are more reliable than resuming conversations.",
      d: "You cannot save the 'complete model state' since there is no persistent internal state. You can only persist structured data that informs the next actions."
    },
    docStatus: "EXAM_GUIDE",
    docReference: {
      source: "Exam Guide — Task Statement 5.4",
      quote: "Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume. Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts."
    }
  }
];
