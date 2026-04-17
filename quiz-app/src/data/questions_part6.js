// ===== ADDITIONAL QUESTIONS: Balancing D1 (Agentic Architecture) and D4 (Prompt Engineering) =====

export const questionsPart6 = [
  // ===== DOMAIN 1: Agentic Architecture — 14 new questions (IDs 305-318) =====
  {
    id: 305,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator delegates to 4 subagents in sequence, one at a time. Each waits for the previous to finish. The web search and document analysis subagents have no dependencies on each other. How can you improve latency?",
    options: [
      { id: "a", text: "Spawn the web search and document analysis subagents in parallel by emitting multiple Agent tool calls in a single coordinator response.", correct: true },
      { id: "b", text: "Increase the max_tokens limit for each subagent to allow them to process faster.", correct: false },
      { id: "c", text: "Have the coordinator pre-compute the queries for all subagents before delegating.", correct: false },
      { id: "d", text: "Use a message queue between subagents so they can communicate directly without the coordinator.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Independent subagents should be spawned in parallel by emitting multiple Agent tool calls in a single coordinator response. This eliminates unnecessary sequential waiting for subagents that have no dependencies on each other.",
    whyOthersWrong: {
      b: "max_tokens controls response length, not processing speed. Parallel execution is the correct optimization for independent tasks.",
      c: "Pre-computing queries doesn't address the sequential execution problem. The subagents still wait for each other.",
      d: "In the hub-and-spoke architecture, all communication flows through the coordinator. Direct subagent communication is not supported."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Parallelization workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287804" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Optimize parallel tool calling)",
        quote: "Claude's latest models excel at parallel tool execution. These models will: Run multiple speculative searches during research, Read several files at once to build context faster, Execute bash commands in parallel (which can even bottleneck system performance). This behavior is easily steerable. While the model has a high success rate in parallel tool calling without prompting, you can boost this to ~100% or adjust the aggression level."
      }
  },
  {
    id: 306,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator evaluates the synthesis agent's output and finds gaps in coverage. What is the correct pattern to address this?",
    options: [
      { id: "a", text: "Ask the synthesis agent to fill in the gaps using its own knowledge since it has already analyzed the sources.", correct: false },
      { id: "b", text: "Implement an iterative refinement loop: the coordinator evaluates synthesis output for gaps, re-delegates to search/analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient.", correct: true },
      { id: "c", text: "Add more sources to the initial search query and restart the entire pipeline from the beginning.", correct: false },
      { id: "d", text: "Have the synthesis agent flag gaps and include them as caveats in the final report.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Iterative refinement loops allow the coordinator to evaluate output quality, identify gaps, and re-delegate targeted queries to fill them. This is more efficient than restarting and more reliable than asking the synthesis agent to fabricate missing information.",
    whyOthersWrong: {
      a: "The synthesis agent should synthesize from provided findings, not fabricate new information. This would introduce hallucination.",
      c: "Restarting the entire pipeline wastes the work already done. Targeted re-delegation to fill specific gaps is more efficient.",
      d: "Flagging gaps is useful for transparency but does not actively address the coverage problem. Iterative refinement resolves gaps."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Chaining workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287800" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Self-correction pattern)",
        quote: "The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point."
      }
  },
  {
    id: 307,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent handles a frustrated customer whose order was damaged. The customer says 'This is ridiculous, I want my money back and a replacement'. How should the agent decompose this request?",
    options: [
      { id: "a", text: "Address only the refund request since it is the most urgent financial concern.", correct: false },
      { id: "b", text: "Escalate immediately because the customer is frustrated, indicating high complexity.", correct: false },
      { id: "c", text: "Decompose into two distinct items (refund + replacement), investigate each using shared context, and synthesize a unified resolution addressing both.", correct: true },
      { id: "d", text: "Ask the customer to choose between a refund or a replacement since both are not possible simultaneously.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Multi-concern requests should be decomposed into distinct items, investigated in parallel with shared context, and synthesized into a unified response. Both a refund and replacement can be valid and should be investigated as separate items.",
    whyOthersWrong: {
      a: "Ignoring the replacement request would leave the customer's full concern unaddressed. Both items should be investigated.",
      b: "Frustration alone is not an escalation trigger. Both issues (refund + replacement) are standard support operations the agent can handle.",
      d: "Assuming both are impossible without checking is premature. Many policies allow both for damaged items. Investigate first."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 1.2 (Task decomposition)",
        quote: "Decompose multi-part customer requests into distinct, investigable items; investigate each with shared context; synthesize a unified resolution addressing every concern before responding."
      }
  },
  {
    id: 308,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent needs to enforce that refunds over $500 require human approval. What is the most reliable approach?",
    options: [
      { id: "a", text: "Add instructions to the system prompt stating that refunds over $500 must be escalated to a human.", correct: false },
      { id: "b", text: "Add few-shot examples showing the agent escalating for amounts over $500.", correct: false },
      { id: "c", text: "Implement a tool call interception hook that blocks process_refund when the amount exceeds $500 and redirects to human escalation.", correct: true },
      { id: "d", text: "Have the process_refund tool return an error when the amount exceeds $500.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Tool call interception hooks provide deterministic enforcement of business rules. When guaranteed compliance is required (financial thresholds), hooks block the action and redirect to the alternative workflow before the tool executes.",
    whyOthersWrong: {
      a: "Prompt instructions are probabilistic. For a financial compliance rule with potential legal/business consequences, deterministic enforcement is required.",
      b: "Few-shot examples improve probability but do not guarantee compliance. A business rule with a specific dollar threshold needs deterministic enforcement.",
      d: "The tool should not be called at all for amounts over $500. The hook intercepts BEFORE execution, which is safer than executing the tool and having it fail."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Claude Code in Action", lesson: "Introducing hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312000" },
      docReference: {
        source: "Anthropic Docs — Hooks (PreToolUse decision control)",
        quote: "PreToolUse hooks can control whether a tool call proceeds. Unlike other hooks that use a top-level decision field, PreToolUse returns its decision inside a hookSpecificOutput object. This gives it richer control: four outcomes (allow, deny, ask, or defer) plus the ability to modify tool input before execution."
      }
  },
  {
    id: 309,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your research system routes all queries through the full pipeline: web search → document analysis → synthesis → report generation. Simple factual queries ('When was Python created?') take the same time as complex research queries. What should you change?",
    options: [
      { id: "a", text: "Add a caching layer that stores previous answers to avoid re-processing identical queries.", correct: false },
      { id: "b", text: "Design the coordinator to analyze query requirements and dynamically select which subagents to invoke, rather than always routing through the full pipeline.", correct: true },
      { id: "c", text: "Optimize each subagent to run faster by reducing the quality of their output.", correct: false },
      { id: "d", text: "Add a timeout to the pipeline that terminates early when a 'good enough' answer is found.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The coordinator should analyze query complexity and dynamically select which subagents to invoke. Simple queries may only need web search, while complex topics need the full pipeline. This is a key coordinator responsibility.",
    whyOthersWrong: {
      a: "Caching helps for repeated queries but doesn't address the fundamental problem of over-processing simple queries through the full pipeline.",
      c: "Reducing output quality is not the correct optimization. The issue is invoking unnecessary subagents, not the speed of each one.",
      d: "Arbitrary timeouts may terminate useful research prematurely. The correct approach is to not start unnecessary subagent work in the first place."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Building with the Claude API", lesson: "Agents and workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287796" },
      docReference: {
        source: "Anthropic Docs — Subagents (Choose between subagents and main conversation)",
        quote: "Use subagents when: The task produces verbose output you don't need in your main context; You want to enforce specific tool restrictions or permissions; The work is self-contained and can return a summary. Use the main conversation when: You're making a quick, targeted change; Latency matters. Subagents start fresh and may need time to gather context."
      }
  },
  {
    id: 310,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "You want to compare two different refactoring approaches from a shared analysis baseline. What session management technique should you use?",
    options: [
      { id: "a", text: "Start two completely new sessions and re-analyze the codebase in each.", correct: false },
      { id: "b", text: "Use fork_session to create two independent branches from the shared analysis baseline to explore each approach.", correct: true },
      { id: "c", text: "Use one session for both approaches, switching between them with explicit instructions.", correct: false },
      { id: "d", text: "Save the analysis to a file and start new sessions that read the file.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "fork_session creates independent branches from a shared analysis baseline, ideal for comparing divergent approaches. Both forks inherit the analysis context without duplicating effort, and modifications in one do not affect the other.",
    whyOthersWrong: {
      a: "Re-analyzing from scratch wastes the work already done in the baseline analysis. fork_session avoids this duplication.",
      c: "Using one session for both approaches creates confusion as both sets of changes mix in context. fork_session provides clean isolation.",
      d: "While saving analysis helps, fork_session is the built-in mechanism designed exactly for this scenario with full context preservation."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Sessions", url: "https://code.claude.com/docs/en/agent-sdk/sessions" },
      docReference: {
        source: "Anthropic Docs — Agent SDK Sessions (Fork to explore alternatives)",
        quote: "Forking creates a new session that starts with a copy of the original's history but diverges from that point. The fork gets its own session ID; the original's ID and history stay unchanged. You end up with two independent sessions you can resume separately."
      }
  },
  {
    id: 311,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "You resume a session after making significant code changes to files the agent previously analyzed. What should you do?",
    options: [
      { id: "a", text: "Let the agent continue normally — it will detect the file changes automatically.", correct: false },
      { id: "b", text: "Start a completely new session to avoid any stale context.", correct: false },
      { id: "c", text: "Inform the agent about specific file changes for targeted re-analysis rather than requiring full re-exploration.", correct: true },
      { id: "d", text: "Use /compact before continuing to clear the stale context.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "When resuming sessions after code modifications, inform the agent about specific file changes. This enables targeted re-analysis of only the modified files rather than requiring full re-exploration, which is more efficient.",
    whyOthersWrong: {
      a: "The agent does not automatically detect external file changes. Its context contains the old analysis which may now be stale.",
      b: "Starting fresh loses all prior analysis context. When the changes are targeted, resumption with change information is more efficient.",
      d: "/compact reduces context size but doesn't update the stale analysis. Informing the agent about specific changes is the correct approach."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Sessions", url: "https://code.claude.com/docs/en/agent-sdk/sessions" },
      docReference: {
        source: "Anthropic Docs — Agent SDK Sessions (Resume by ID)",
        quote: "Pass a session ID to resume to return to that specific session. The agent picks up with full context from wherever the session left off. Common reasons to resume: Follow up on a completed task. The agent already analyzed something; now you want it to act on that analysis without re-reading files."
      }
  },
  {
    id: 312,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "Your agent needs to add comprehensive tests to a legacy codebase with no existing tests. What is the correct task decomposition approach?",
    options: [
      { id: "a", text: "Generate tests for all files alphabetically, moving through the codebase systematically.", correct: false },
      { id: "b", text: "First map the codebase structure, identify high-impact areas, then create a prioritized plan that adapts as dependencies are discovered.", correct: true },
      { id: "c", text: "Ask Claude to generate all tests in a single prompt with comprehensive instructions.", correct: false },
      { id: "d", text: "Start with unit tests for all utility functions, then integration tests, then end-to-end tests.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Open-ended tasks like adding tests to a legacy codebase require dynamic decomposition: first map the structure to understand what exists, identify the highest-impact areas, then create a prioritized plan that adapts as you discover dependencies and complexities.",
    whyOthersWrong: {
      a: "Alphabetical order has no correlation with importance or impact. A prioritized, adaptive approach is more effective.",
      c: "A single prompt cannot handle the complexity of a full codebase. This task requires incremental exploration and adaptive planning.",
      d: "A fixed test-type ordering ignores the actual structure. High-impact areas should be prioritized regardless of test type."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 1.2 (Open-ended task decomposition)",
        quote: "Open-ended engineering tasks (e.g., adding tests to a legacy codebase) require dynamic decomposition: first map the codebase structure, identify high-impact areas, then create a prioritized, adaptive plan that evolves as dependencies and complexities are discovered."
      }
  },
  {
    id: 313,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "When passing context from the web search subagent's results to the synthesis subagent, what format should you use?",
    options: [
      { id: "a", text: "Pass the raw search results as plain text for the synthesis agent to interpret.", correct: false },
      { id: "b", text: "Use structured data formats that separate content from metadata (source URLs, document names, page numbers) to preserve attribution.", correct: true },
      { id: "c", text: "Summarize the search results into a brief paragraph to save tokens in the synthesis agent's context.", correct: false },
      { id: "d", text: "Pass only the most relevant search result to keep the synthesis agent focused.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Structured data formats that separate content from metadata enable the synthesis agent to preserve source attribution throughout the synthesis process. This is critical for producing reports with verifiable citations.",
    whyOthersWrong: {
      a: "Raw text lacks structured metadata. The synthesis agent needs explicit source URLs, document names, and page numbers to maintain attribution.",
      c: "Over-summarization loses the metadata needed for attribution. Structured formats preserve both content and provenance efficiently.",
      d: "Passing only one result limits the synthesis agent's ability to produce comprehensive, multi-source reports."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Structure with XML tags", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287741" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Long context prompting)",
        quote: "Structure document content and metadata with XML tags: When using multiple documents, wrap each document in <document> tags with <document_content> and <source> (and other metadata) subtags for clarity."
      }
  },
  {
    id: 314,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator prompt says: 'Step 1: Search for articles. Step 2: Analyze each article. Step 3: Synthesize findings. Step 4: Generate report.' This works but produces rigid, unimaginative research. How should you improve the coordinator prompt?",
    options: [
      { id: "a", text: "Add more detailed step-by-step instructions for each phase of the research.", correct: false },
      { id: "b", text: "Specify research goals and quality criteria rather than step-by-step procedural instructions, to enable subagent adaptability.", correct: true },
      { id: "c", text: "Remove the prompt entirely and let the coordinator decide the approach based on the query.", correct: false },
      { id: "d", text: "Add conditional logic to the prompt: 'If topic is simple, skip step 2. If complex, add step 2.5.'", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Coordinator prompts should specify research goals and quality criteria rather than step-by-step procedures. Goal-oriented prompts enable subagent adaptability — the coordinator can adjust its approach based on what it discovers during research.",
    whyOthersWrong: {
      a: "More detailed procedures make the approach even more rigid. The problem is procedural rigidity, not insufficient detail.",
      c: "Removing the prompt entirely provides no guidance. The coordinator needs goals and quality criteria, not no guidance at all.",
      d: "Conditional logic in prompts is fragile and anticipates specific scenarios. Goal-oriented prompts handle novel scenarios naturally."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Subagent orchestration)",
        quote: "Use subagents when tasks can run in parallel, require isolated context, or involve independent workstreams that don't need to share state. For simple tasks, sequential operations, single-file edits, or tasks where you need to maintain context across steps, work directly rather than delegating."
      }
  },
  {
    id: 315,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your customer asks about a competitor's price matching policy. Your support policy documentation only covers own-site price adjustments. What should the agent do?",
    options: [
      { id: "a", text: "Apply the own-site price adjustment policy since it is the closest available policy.", correct: false },
      { id: "b", text: "Tell the customer that competitor price matching is not available.", correct: false },
      { id: "c", text: "Escalate to a human agent because the policy is ambiguous or silent on the customer's specific request.", correct: true },
      { id: "d", text: "Ask the customer for the competitor's price and apply a discretionary discount.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "When policy is ambiguous or silent on the customer's specific request, the agent should escalate to a human who can make a judgment call. The agent should not make up policies or apply tangentially related ones.",
    whyOthersWrong: {
      a: "Applying an unrelated policy is incorrect. Own-site adjustments and competitor price matching are different business decisions.",
      b: "The agent doesn't actually know if competitor price matching is unavailable — the policy simply doesn't address it. A human should decide.",
      d: "The agent should not make unauthorized financial decisions outside documented policy. Discretionary discounts require human authority."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 1.3 (Escalation triggers)",
        quote: "Escalate to a human agent when the governing policy is ambiguous, silent on the customer's specific request, or requires judgment beyond the agent's documented authority. Do not apply tangentially related policies or make unauthorized discretionary decisions."
      }
  },
  {
    id: 316,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your PostToolUse hook receives order data from lookup_order with status code 2 (meaning 'shipped') and a Unix timestamp 1710523200. What should the hook do before the agent processes this data?",
    options: [
      { id: "a", text: "Pass the data through unchanged — Claude can interpret status codes and timestamps.", correct: false },
      { id: "b", text: "Normalize the data: convert status 2 to 'shipped' and Unix timestamp to ISO 8601 format before the agent processes it.", correct: true },
      { id: "c", text: "Only convert the timestamp; leave the status code as-is since Claude knows common status code conventions.", correct: false },
      { id: "d", text: "Add a text explanation alongside the raw data for Claude to reference.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "PostToolUse hooks should normalize heterogeneous data formats before the agent processes them. Converting numeric status codes to readable names and Unix timestamps to ISO 8601 provides deterministic, consistent data transformation.",
    whyOthersWrong: {
      a: "Relying on Claude to interpret raw status codes is probabilistic. A hook provides guaranteed deterministic normalization.",
      c: "Both the status code and timestamp should be normalized. Leaving ambiguous numeric codes creates potential misinterpretation.",
      d: "Adding text explanations is less reliable than normalizing the data itself. The hook should transform the data, not just annotate it."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Claude Code in Action", lesson: "Introducing hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312000" },
      docReference: {
        source: "Anthropic Docs — Hooks (PostToolUse)",
        quote: "PostToolUse runs immediately after a tool completes successfully. It receives both the input sent to the tool and the result it returned. PostToolUse hooks can provide feedback to Claude after tool execution."
      }
  },
  {
    id: 317,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "When the customer says 'I'm furious about this, but fine, just fix it already', your agent considers escalation. What is the correct approach?",
    options: [
      { id: "a", text: "Escalate immediately because the customer expressed strong negative sentiment.", correct: false },
      { id: "b", text: "Acknowledge the frustration while offering to resolve the issue, since the customer gave consent to proceed ('just fix it').", correct: true },
      { id: "c", text: "Run sentiment analysis to determine the exact frustration level before deciding.", correct: false },
      { id: "d", text: "Ask the customer if they want to speak with a human agent before proceeding.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The customer expressed frustration but also gave consent to proceed ('just fix it'). The agent should acknowledge frustration while offering resolution. Escalation is appropriate only if the customer explicitly requests a human or the issue is beyond the agent's capability.",
    whyOthersWrong: {
      a: "Sentiment alone is not a reliable escalation trigger. The customer said 'just fix it' — they want resolution, not escalation.",
      c: "Sentiment analysis is an unreliable proxy for actual case complexity. The customer's words are clear: they want the issue fixed.",
      d: "Proactively suggesting human escalation when the customer said 'just fix it' ignores their expressed preference and adds unnecessary friction."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 1.3 (Escalation triggers)",
        quote: "Customer sentiment alone is not a reliable escalation trigger. When a customer expresses frustration but gives explicit consent to proceed ('just fix it'), acknowledge the frustration while offering resolution; escalate only when the customer explicitly requests a human or the issue exceeds the agent's documented capability."
      }
  },
  {
    id: 318,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "Your agent is exploring a large codebase using prompt chaining. The first pass analyzes each file individually. What should happen next?",
    options: [
      { id: "a", text: "Combine all individual file analyses into a single comprehensive report.", correct: false },
      { id: "b", text: "Run a separate cross-file integration pass examining data flow, shared dependencies, and interaction patterns between files.", correct: true },
      { id: "c", text: "Re-analyze each file with the context of all other file analyses.", correct: false },
      { id: "d", text: "Present the per-file analyses to the user for manual integration.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "After per-file local analysis, a separate cross-file integration pass examines data flow and interactions. This two-phase approach avoids attention dilution while still catching cross-file issues that individual analysis misses.",
    whyOthersWrong: {
      a: "Simply combining analyses misses cross-file issues. A dedicated integration pass looks for patterns across files.",
      c: "Re-analyzing every file with full context is the attention dilution problem you're trying to avoid. The integration pass is focused specifically on cross-file concerns.",
      d: "Manual integration defeats the purpose of automation. The agent should perform both the local and integration passes."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Building with the Claude API", lesson: "Chaining workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287800" },
      docReference: {
        source: "Anthropic Docs — Subagents (Chain subagents)",
        quote: "For multi-step workflows, ask Claude to use subagents in sequence. Each subagent completes its task and returns results to Claude, which then passes relevant context to the next subagent."
      }
  },

  // ===== DOMAIN 4: Prompt Engineering — 13 new questions (IDs 319-331) =====
  {
    id: 319,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction schema has a 'category' field with enum values ['invoice', 'receipt', 'contract']. Some documents don't fit any category. The model forces them into 'receipt' incorrectly. How do you fix this?",
    options: [
      { id: "a", text: "Add more enum values to cover every possible document type.", correct: false },
      { id: "b", text: "Add an 'other' enum value paired with a 'category_detail' string field for extensible categorization.", correct: true },
      { id: "c", text: "Remove the enum constraint and use a free-text string field instead.", correct: false },
      { id: "d", text: "Add instructions telling the model to leave the field empty if no category matches.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 'other' + detail string pattern provides extensible categorization. The model can select 'other' for unusual documents and provide specifics in the detail field, preventing forced misclassification while maintaining structured output.",
    whyOthersWrong: {
      a: "You cannot anticipate every document type. The 'other' + detail pattern handles the unknown gracefully.",
      c: "Free-text strings lose the benefits of structured categorization. The enum + 'other' pattern preserves structure while allowing flexibility.",
      d: "An empty enum value is not valid. The 'other' value with a detail field is the documented pattern for handling this case."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Anthropic Docs — Structured Outputs (enum limitations)",
        quote: "enum (strings, numbers, bools, or nulls only - no complex types). Enum values are limited to primitive types only—complex objects cannot be enum values."
      }
  },
  {
    id: 320,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction validation detects that extracted line items don't sum to the declared total. You retry by sending the document again with just 'Please fix the totals'. The retry fails again. Why, and what should you do differently?",
    options: [
      { id: "a", text: "The model cannot do arithmetic. Switch to a model with better math capabilities.", correct: false },
      { id: "b", text: "The retry lacks specific validation errors. Send the document, the failed extraction, AND the specific validation error (e.g., 'Line items sum to $147.50 but stated total is $157.50') for guided self-correction.", correct: true },
      { id: "c", text: "Retries are ineffective for numerical errors. Implement programmatic post-processing instead.", correct: false },
      { id: "d", text: "The document itself has conflicting information. Mark the extraction as failed and move on.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Retry-with-error-feedback is the correct pattern: include the original document, the failed extraction, AND the specific validation errors. Generic retry prompts lack the information needed for targeted correction.",
    whyOthersWrong: {
      a: "The model can likely fix the error with proper feedback. The problem is the retry prompt lacks specific error information, not model capability.",
      c: "Retries with specific error feedback are effective for format and structural errors. Programmatic post-processing complements but doesn't replace retry.",
      d: "Assuming the document has conflicting data without investigating is premature. The specific error feedback would help the model locate and correct the issue."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Code review harnesses / iteration)",
        quote: "We recommend iterating on prompts against a subset of your evals or test cases to validate recall or F1 score gains."
      }
  },
  {
    id: 321,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction retries keep failing for a specific document. The required 'methodology' field is always null. Investigation reveals the methodology is described in a separate appendix document that was not provided. What should you conclude?",
    options: [
      { id: "a", text: "Retry with stronger instructions emphasizing the importance of the methodology field.", correct: false },
      { id: "b", text: "The information does not exist in the provided source document. Retries will not help — you need to either provide the appendix or make the field optional.", correct: true },
      { id: "c", text: "Use a model with a larger context window to process more of the document.", correct: false },
      { id: "d", text: "Add few-shot examples showing how to extract methodology from different formats.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Retries are ineffective when the required information is simply absent from the source document. The model cannot extract what doesn't exist. The solution is to either provide the missing source or redesign the schema with optional fields.",
    whyOthersWrong: {
      a: "Stronger instructions cannot overcome absent data. If the information is in a separate document not provided, no amount of prompting will extract it.",
      c: "Context window size is irrelevant when the information is in a different document entirely. The source material is the issue.",
      d: "Few-shot examples help with format variety, not with missing data. The methodology data simply isn't in the provided document."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 4.2 (Validation retry limits)",
        quote: "Retries are ineffective when the required information is absent from the provided source. The model cannot extract what does not exist; the remedy is to supply the missing source material or redesign the schema to make the field optional/nullable."
      }
  },
  {
    id: 322,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI review prompt says 'Check that comments are accurate'. The review produces many false positives flagging legitimate code patterns as 'inaccurate comments'. How do you improve precision?",
    options: [
      { id: "a", text: "Add 'only flag high-confidence issues' to the prompt.", correct: false },
      { id: "b", text: "Replace the vague instruction with explicit criteria: 'Flag comments only when the claimed behavior contradicts the actual code behavior. Acceptable: comments describing intent or future plans.'", correct: true },
      { id: "c", text: "Remove comment checking entirely from the review.", correct: false },
      { id: "d", text: "Add a confidence threshold filter that suppresses findings below 80% confidence.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Explicit criteria defining exactly what constitutes a problem are more effective than vague instructions. Specifying 'flag only when claimed behavior contradicts actual code' and explicitly noting acceptable patterns dramatically improves precision.",
    whyOthersWrong: {
      a: "General instructions like 'only flag high-confidence' fail to improve precision. The model needs specific categorical criteria, not confidence-based filtering.",
      c: "Removing comment checking entirely loses value. The correct approach is to improve the criteria for that category.",
      d: "Confidence thresholds are unreliable — the model may be highly confident about a false positive. Explicit criteria address the root cause."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Prompt engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Code review harnesses)",
        quote: "If you do want the model to self-filter in a single pass, be concrete about where the bar is rather than using qualitative terms like 'important' — for example, 'report any bugs that could cause incorrect behavior, a test failure, or a misleading result; only omit nits like pure style or naming preferences.'"
      }
  },
  {
    id: 323,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "You want to define severity levels for your automated code review. Currently, severity is inconsistent — similar issues get different severities across reviews. What is the most effective fix?",
    options: [
      { id: "a", text: "Add a sentence saying 'Be consistent with severity ratings across all findings'.", correct: false },
      { id: "b", text: "Define explicit severity criteria with concrete code examples for each severity level (e.g., 'critical: SQL injection example, medium: missing null check example').", correct: true },
      { id: "c", text: "Remove severity levels and treat all findings equally.", correct: false },
      { id: "d", text: "Use a post-processing step that normalizes severities based on keyword matching.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Explicit severity criteria with concrete code examples for each level achieve consistent classification. Examples ground the abstract severity levels in specific patterns the model can reference and generalize from.",
    whyOthersWrong: {
      a: "Asking for consistency without defining what consistent means is ineffective. The model needs concrete examples of what each severity looks like.",
      c: "Removing severity loses valuable triage information. Developers need to know which findings to address first.",
      d: "Keyword matching is brittle and cannot capture the nuanced judgment needed for severity classification."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Providing examples", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287746" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Use examples effectively)",
        quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency."
      }
  },
  {
    id: 324,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You want to guarantee that Claude ALWAYS produces structured output and that the output follows a specific schema. What is the optimal configuration?",
    options: [
      { id: "a", text: "tool_choice: 'auto' with strict: true — Claude can decide when to use the tool and strict ensures valid inputs.", correct: false },
      { id: "b", text: "tool_choice: 'any' with strict: true — 'any' guarantees a tool will be called, and strict guarantees schema-compliant inputs.", correct: true },
      { id: "c", text: "tool_choice: 'none' with detailed JSON instructions in the system prompt.", correct: false },
      { id: "d", text: "tool_choice: 'tool' with strict: false — forcing the specific tool is sufficient since inputs are usually correct.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "tool_choice: 'any' guarantees a tool will be called (not text), and strict: true guarantees the inputs comply with the schema via grammar-constrained sampling. This combination provides end-to-end structured output guarantees.",
    whyOthersWrong: {
      a: "tool_choice: 'auto' allows Claude to respond with text instead of calling a tool. There's no guarantee of structured output.",
      c: "tool_choice: 'none' prevents all tool use. Prompt instructions cannot guarantee valid JSON — they're probabilistic.",
      d: "strict: false doesn't guarantee schema compliance. '99% correct' is not 100% — you need strict: true for guarantees."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools (Forcing tool use)",
        quote: "Guaranteed tool calls with strict tools: Combine tool_choice: {\"type\": \"any\"} with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema. Set strict: true on your tool definitions to enable schema validation."
      }
  },
  {
    id: 325,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction schema has a 'document_date' field marked as required. Some source documents genuinely do not contain any date information. The model invents plausible dates to satisfy the required field constraint. What is the root cause and fix?",
    options: [
      { id: "a", text: "The model needs better instructions to not hallucinate. Add 'never fabricate dates' to the prompt.", correct: false },
      { id: "b", text: "The field should be designed as optional/nullable so the model can return null when the date doesn't exist in the source.", correct: true },
      { id: "c", text: "Add validation that checks if the extracted date appears verbatim in the source document.", correct: false },
      { id: "d", text: "Use a smaller, more conservative model that is less likely to generate fabricated dates.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When a field is 'required', the model is obligated to produce a value — creating tension between the schema constraint and the instruction not to fabricate. Making it nullable/optional removes this tension and allows honest null returns.",
    whyOthersWrong: {
      a: "Prompt instructions can't override a required field constraint. The schema forces the model to produce a value regardless of instructions.",
      c: "Post-validation catches the problem but doesn't prevent it. Better schema design (nullable fields) prevents fabrication at the source.",
      d: "Model capability is not the issue. Any model will fabricate values if the schema forces a required field that has no source data."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" },
      docReference: {
        source: "Anthropic Docs — Structured Outputs (required vs optional fields)",
        quote: "required and additionalProperties (must be set to false for objects). All properties not in the required array become optional fields that count toward the 24-parameter complexity limit."
      }
  },
  {
    id: 326,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "You re-run your CI review after a developer pushes fixes. The review produces the same comments as before, plus new ones. Developers complain about duplicate findings. How should you address this?",
    options: [
      { id: "a", text: "Clear all previous comments before posting new review results.", correct: false },
      { id: "b", text: "Include prior review findings in context and instruct Claude to report only new or still-unaddressed issues, avoiding duplicate comments.", correct: true },
      { id: "c", text: "Implement a deduplication filter that compares new findings against previous comments by text similarity.", correct: false },
      { id: "d", text: "Only run the review on files changed since the last review.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Including prior findings in context and instructing Claude to report only new or still-unaddressed issues is the documented approach. This gives Claude the context to distinguish between resolved, persisting, and new issues.",
    whyOthersWrong: {
      a: "Clearing all comments loses the history. Developers need to see which issues persisted and which are new.",
      c: "Text similarity matching is brittle. Claude can understand semantic equivalence better than text matching when given prior findings in context.",
      d: "Only reviewing changed files misses issues in unchanged files that may be affected by the changes (cross-file impacts)."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 4.3 (CI review deduplication)",
        quote: "When re-running automated code review, include prior review findings in the prompt context and instruct Claude to report only new or still-unaddressed issues. This allows the model to distinguish resolved, persisting, and new issues semantically rather than via text matching."
      }
  },
  {
    id: 327,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI test generation produces many low-value tests (testing getters/setters, obvious wrappers). How can you improve test quality?",
    options: [
      { id: "a", text: "Add 'generate only high-value tests' to the prompt.", correct: false },
      { id: "b", text: "Document testing standards, valuable test criteria, and available fixtures in CLAUDE.md so test generation uses project-specific context.", correct: true },
      { id: "c", text: "Limit the number of tests generated to force Claude to prioritize.", correct: false },
      { id: "d", text: "Use a post-generation filter that removes tests shorter than 10 lines.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "CLAUDE.md is the mechanism for providing project context to CI-invoked Claude Code. Documenting testing standards, what constitutes a valuable test, and available fixtures improves test generation quality with project-specific guidance.",
    whyOthersWrong: {
      a: "Vague instructions like 'high-value' don't define what that means for your project. CLAUDE.md with specific criteria gives Claude the context needed.",
      c: "Limiting count doesn't improve quality — Claude might still generate low-value tests, just fewer of them.",
      d: "Test length is a poor proxy for value. A 3-line test of a critical edge case is more valuable than a 20-line boilerplate test."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Memory / CLAUDE.md", url: "https://code.claude.com/docs/en/memory" },
      docReference: {
        source: "Anthropic Docs — Memory (CLAUDE.md files)",
        quote: "CLAUDE.md files are markdown files that give Claude persistent instructions for a project, your personal workflow, or your entire organization. You write these files in plain text; Claude reads them at the start of every session. Create this file and add instructions that apply to anyone working on the project: build and test commands, coding standards, architectural decisions, naming conventions, and common workflows."
      }
  },
  {
    id: 328,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You need to extract data from documents with inconsistent source formatting: some use 'approx. 15 lbs', others use '15.2 pounds', others use '6.9 kg'. How should you handle this?",
    options: [
      { id: "a", text: "Standardize all measurements to metric in a preprocessing step before extraction.", correct: false },
      { id: "b", text: "Include format normalization rules in the prompt alongside the strict output schema (e.g., 'normalize all weights to kilograms as decimal numbers').", correct: true },
      { id: "c", text: "Create separate extraction schemas for each measurement format.", correct: false },
      { id: "d", text: "Extract raw values as strings and normalize programmatically after extraction.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Including format normalization rules in the prompt alongside the output schema handles inconsistent source formatting. The model can interpret informal measurements ('approx. 15 lbs') and normalize to a consistent format during extraction.",
    whyOthersWrong: {
      a: "Preprocessing cannot reliably handle all the varied natural language formats. The LLM is better at interpreting 'approx. 15 lbs' than a preprocessor.",
      c: "Separate schemas for each format is impractical given the variety. One schema with normalization rules covers all formats.",
      d: "Programmatic normalization is harder for informal formats like 'approx. 15 lbs'. The LLM handles natural language interpretation better."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Prompt engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering" },
      docReference: {
        source: "Anthropic Docs — Prompting best practices (Be clear and direct)",
        quote: "Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. If you want 'above and beyond' behavior, explicitly request it rather than relying on the model to infer this from vague prompts."
      }
  },
  {
    id: 329,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your structured findings from code review include a 'detected_pattern' field. Developers frequently dismiss findings in the 'unused import' category. How can you use this data to improve?",
    options: [
      { id: "a", text: "Automatically remove all 'unused import' findings since developers dismiss them.", correct: false },
      { id: "b", text: "Analyze the detected_pattern data from dismissed findings to identify which specific patterns trigger false positives, then refine prompts for those patterns.", correct: true },
      { id: "c", text: "Lower the severity of all 'unused import' findings to reduce noise.", correct: false },
      { id: "d", text: "Require developers to provide a reason when dismissing findings.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The detected_pattern field enables systematic analysis of dismissal patterns. By understanding which specific code constructs trigger false positives, you can refine the review prompts to distinguish between genuine issues and acceptable patterns.",
    whyOthersWrong: {
      a: "Blanket removal may miss genuine unused imports that should be cleaned up. Analysis of patterns allows targeted improvement.",
      c: "Lowering severity doesn't address the false positive rate. The findings are still noise that developers must evaluate.",
      d: "Requiring reasons adds friction. The detected_pattern data already provides the information needed for analysis."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 4.3 (Iterative prompt refinement from feedback)",
        quote: "Structured findings with pattern-level metadata enable systematic analysis of false positives. By identifying which specific detected patterns correlate with dismissals, prompts can be refined to distinguish genuine issues from acceptable patterns rather than applying blanket suppression."
      }
  },
  {
    id: 330,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "You generated code with Claude and want it reviewed for quality. You ask Claude to 'review your previous output for bugs' in the same session. The review finds no issues, but a colleague later finds a subtle bug. Why did the review miss it?",
    options: [
      { id: "a", text: "The context window was too full of generated code to properly analyze it.", correct: false },
      { id: "b", text: "Self-review is limited: Claude retains reasoning context from generation, making it less likely to question its own decisions. Use an independent review instance without the prior reasoning context.", correct: true },
      { id: "c", text: "The bug was too subtle for Claude to detect regardless of the review approach.", correct: false },
      { id: "d", text: "The review prompt was too vague. More specific review instructions would have caught it.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Self-review in the same session suffers from confirmation bias — Claude retains its original reasoning context and is less likely to question its own decisions. Independent review instances without prior reasoning context are more effective at catching subtle issues.",
    whyOthersWrong: {
      a: "Context window size is not the primary issue. The problem is the reasoning bias from the generation context.",
      c: "Subtle bugs can be caught by independent reviewers. The limitation is the self-review bias, not Claude's capability.",
      d: "Even with specific instructions, self-review within the same session is inherently limited by reasoning context retention."
    },
      docStatus: "EXAM_GUIDE",
      skilljarRef: { course: "Exam Guide", lesson: "Certification Exam Guide", url: "https://anthropic.skilljar.com/certification-exam-guide" },
      docReference: {
        source: "Exam Guide — Task Statement 4.4 (Self-review limitations)",
        quote: "Self-review within the same session suffers from reasoning bias: the model retains its original generation context and is less likely to question its own decisions. Independent review instances without the prior reasoning context are more effective at catching subtle issues."
      }
  },
  {
    id: 331,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You want to process 500 documents overnight using the Message Batches API. Before submitting, how should you prepare to maximize first-pass success?",
    options: [
      { id: "a", text: "Submit all 500 documents immediately to finish as quickly as possible.", correct: false },
      { id: "b", text: "Run prompt refinement on a small sample set (10-20 documents) first, then batch-process the remaining documents with the refined prompt.", correct: true },
      { id: "c", text: "Split into 5 batches of 100 and submit them one after another.", correct: false },
      { id: "d", text: "Use the synchronous API for all 500 to get real-time error feedback.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Testing on a sample set before batch processing maximizes first-pass success rates. Refinement on 10-20 documents reveals prompt issues, format variations, and edge cases that would otherwise cause batch failures requiring costly resubmission.",
    whyOthersWrong: {
      a: "Submitting untested prompts risks high failure rates. A prompt issue affecting 80% of documents would require resubmitting 400 documents.",
      c: "Splitting into smaller batches doesn't improve quality — the same prompt issues affect all batches. Sample testing before batch is the key step.",
      d: "Synchronous processing of 500 documents is twice the cost (no batch discount) and unnecessary when overnight latency is acceptable."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Batch processing", url: "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing" },
      docReference: {
        source: "Anthropic Docs — Batch processing (Message Batches API)",
        quote: "The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of Messages requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput."
      }
  },
]
