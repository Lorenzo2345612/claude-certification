export const questionsPart2 = [
  // ===== DOMAIN 1: Agentic Architecture & Orchestration (27%) — Questions 33-50 =====
  {
    id: 33,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator decomposes 'Analyze the regulatory impact of AI on fintech' into 8 subtasks. Subagents take 45 seconds each sequentially (6 min total). Four subtasks are independent (EU, US, Asia, Latam regulation) and four depend on those (comparison, gaps, recommendations, synthesis). How do you optimize?",
    options: [
      { id: "a", text: "Execute all 8 subtasks in parallel using Promise.all() since subagents can resolve dependencies internally by consulting partial results.", correct: false },
      { id: "b", text: "Execute the 4 regional subtasks in parallel, wait for all to complete, then execute the 4 dependent ones in parallel feeding them the regional results.", correct: true },
      { id: "c", text: "Keep sequential execution but reduce each subagent's prompt so each takes less time.", correct: false },
      { id: "d", text: "Use a single subagent with a comprehensive prompt covering all 8 subtasks in one long pass.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Parallel execution respects the dependency graph: the 4 regional tasks are independent and can run in parallel, then the 4 dependent ones run in parallel once their inputs are available. This reduces from 6 min to ~1.5 min.",
    whyOthersWrong: {
      a: "The dependent subtasks (comparison, gaps) need the regional results as input. Running them in parallel with their dependencies produces incomplete or fabricated results because the data does not exist yet.",
      c: "Reducing prompts does not fundamentally change the inefficient architecture. Reducing 45s to 30s per subtask still yields 4 min sequential vs ~1.5 min parallel.",
      d: "A single subagent with 8 subtasks suffers from severe attention dilution. The quality of each regional analysis would degrade significantly as they compete for the model's attention."
    }
  },
  {
    id: 34,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has a PreToolUse hook configured on process_refund that verifies the amount does not exceed $500. A customer requests a legitimate refund of $1,200 (approved by policy for premium products). The hook blocks the operation. What is the design problem?",
    options: [
      { id: "a", text: "The hook should verify against the product type policy instead of using a fixed threshold, or escalate to a human for amounts that exceed the threshold instead of blocking silently.", correct: true },
      { id: "b", text: "A PreToolUse hook is not the right place for business rule validation. All validation logic should be in the agent's prompt.", correct: false },
      { id: "c", text: "The $500 threshold is correct but should be overridable by the agent when it detects the product is premium.", correct: false },
      { id: "d", text: "The hook should be PostToolUse instead of PreToolUse so the refund is processed and then audited afterward.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Programmatic hooks must reflect actual business rules, not simplifications. A fixed threshold ignores that different products have different policies. The hook should check the applicable policy or escalate when exceeding a threshold.",
    whyOthersWrong: {
      b: "PreToolUse hooks are exactly the right place for enforcement of critical business rules. Moving validation to the prompt makes it probabilistic. The problem is that the implemented rule is incorrect, not the mechanism.",
      c: "Allowing the agent to override a programmatic guardrail defeats the purpose of the guardrail. If the LLM can decide to ignore the control, it is no longer a deterministic control.",
      d: "Processing an incorrect refund and auditing it afterward is worse than preventing it. Refunds are irreversible in many systems — validation must be pre-execution."
    }
  },
  {
    id: 35,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "The coordinator uses the Task tool to spawn subagents. A financial analysis subagent needs access to a proprietary database. How should this be configured?",
    options: [
      { id: "a", text: "Give the coordinator access to the database and have it pass relevant data to the subagent as part of the task prompt.", correct: false },
      { id: "b", text: "Include the database credentials in the Task tool prompt so the subagent can connect directly.", correct: false },
      { id: "c", text: "Configure the subagent with a scoped tool set that includes only the financial database query tool, in addition to the necessary analysis tools.", correct: true },
      { id: "d", text: "Create a dedicated MCP server for the database and give it as a shared resource to all subagents in the system.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The Task tool allows specifying the tool set for each subagent. The financial subagent receives only the tools necessary for its role: database query + analysis tools. This follows the principle of least privilege.",
    whyOthersWrong: {
      a: "The coordinator should not pre-fetch data for subagents because it does not know what specific queries the analysis will need. This limits the subagent's autonomy and creates a bottleneck.",
      b: "Including credentials in prompts is a severe security anti-pattern. Credentials can appear in logs, be cached, or be exposed in error messages.",
      d: "Giving all subagents access to the financial database violates least privilege. Only the financial analysis subagent needs that access."
    }
  },
  {
    id: 36,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "Your code generation agent is in a loop where it generates code, runs tests, sees failures, modifies code, and repeats. After 15 iterations, the changes become erratic: it reverts previous fixes and introduces regressions. What is causing this?",
    options: [
      { id: "a", text: "The model is not capable enough for the debugging task. A more powerful model is needed.", correct: false },
      { id: "b", text: "The agentic loop has accumulated so much context from previous iterations that the model suffers from the lost-in-the-middle effect, losing track of which changes were successful and which were not.", correct: true },
      { id: "c", text: "The tests are flaky and produce inconsistent results that confuse the agent.", correct: false },
      { id: "d", text: "The agent needs a maximum iteration timeout configured to 5 to avoid prolonged loops.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "After many iterations, the history of tool calls, test outputs, and code changes accumulates in the context. The lost-in-the-middle effect causes the model to lose access to information from early iterations, causing regressions.",
    whyOthersWrong: {
      a: "The model generated correct fixes in early iterations, demonstrating sufficient capability. The problem is context degradation, not model capability.",
      c: "There is no evidence of flaky tests in the scenario. The failures are consistent and the regression pattern points to a context problem, not a test problem.",
      d: "An arbitrary cap of 5 iterations would prematurely terminate legitimate tasks. The correct solution is to manage the context (e.g., summarize previous iterations, use a scratchpad), not to limit arbitrarily."
    }
  },
  {
    id: 37,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent needs to handle sessions that are interrupted (browser crash, network timeout). The customer returns expecting to continue where they left off. How should you implement session resumption?",
    options: [
      { id: "a", text: "Save the complete message history and re-inject it into a new session when the customer returns.", correct: false },
      { id: "b", text: "Export a structured state manifest (issue identified, steps completed, data collected, next action) that is loaded when resuming the session.", correct: true },
      { id: "c", text: "Keep the model connection open indefinitely until the customer returns.", correct: false },
      { id: "d", text: "Ask the customer to repeat their problem when they return, since the previous context is not recoverable.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A structured state manifest captures the relevant state in a compact form and is injected into the new session's prompt, enabling continuity without reprocessing the entire history.",
    whyOthersWrong: {
      a: "Re-injecting the complete history consumes excessive tokens and may include irrelevant or redundant information. A structured manifest is more efficient and focused.",
      c: "Keeping connections open indefinitely is impractical and unsustainable. Models do not maintain state between calls — each request is independent.",
      d: "Asking the customer to repeat their problem is a terrible experience. The information was already collected and should be persisted for continuity."
    }
  },
  {
    id: 38,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your multi-agent system has a coordinator that delegates to search, analysis, and synthesis subagents. The coordinator receives results from the search subagent and must decide whether they are sufficient or if more investigation is needed. How should it make this decision?",
    options: [
      { id: "a", text: "Define a minimum number of sources (e.g., 10) and always request more search if the minimum is not reached.", correct: false },
      { id: "b", text: "The coordinator evaluates results against coverage criteria defined in its prompt, identifying specific gaps that require additional search.", correct: true },
      { id: "c", text: "Always do exactly two rounds of search: one broad and one focused, regardless of the results.", correct: false },
      { id: "d", text: "Let the search subagent self-determine whether its results are sufficient and only return when it is satisfied.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The coordinator should evaluate results against explicit coverage criteria, not arbitrary metrics. This enables informed decisions about whether additional search is needed and in what specific areas.",
    whyOthersWrong: {
      a: "A minimum number of sources is a vanity metric. 10 sources saying the same thing contribute less than 3 diverse sources. Quality and coverage matter more than quantity.",
      c: "A fixed number of rounds ignores task variability. Some need one round, others need five. The decision should be based on results, not a predetermined number.",
      d: "The search subagent does not have visibility into the complete research objective. Only the coordinator can evaluate whether the results cover all aspects of the research goal."
    }
  },
  {
    id: 39,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "Your team wants Claude Code to automatically run a linter after every file edit. If the linter reports errors, Claude should see the errors and fix the code. What is the correct implementation?",
    options: [
      { id: "a", text: "Add instructions in CLAUDE.md asking Claude to manually run the linter after each edit.", correct: false },
      { id: "b", text: "Configure a PostToolUse hook on the Edit/Write tool that runs the linter and returns the errors as hook output for Claude to see and fix.", correct: true },
      { id: "c", text: "Create a custom slash command /lint that the developer runs manually after each edit.", correct: false },
      { id: "d", text: "Configure a PreToolUse hook on the Edit tool that pre-validates the code before it is written to the file.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A PostToolUse hook on Edit/Write automatically runs the linter after each edit. The errors are returned to the model as hook output, enabling automatic correction without manual intervention.",
    whyOthersWrong: {
      a: "Instructions in CLAUDE.md are probabilistic enforcement. Claude might forget to run the linter on some edits. A hook guarantees deterministic execution.",
      c: "A slash command requires manual developer intervention for each edit. The hook completely automates the process without the need for human input.",
      d: "PreToolUse executes before the edit, when the new code does not yet exist in the file. You cannot lint code that has not been written yet."
    }
  },
  {
    id: 40,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator needs to decide between using a single versatile subagent or three specialized subagents for a research task on climate change policy. The topic has scientific, economic, and legal components. What is the most effective approach?",
    options: [
      { id: "a", text: "A single subagent with a comprehensive prompt covering science, economics, and law, giving it access to all available tools.", correct: false },
      { id: "b", text: "Three specialized subagents but each with access to all tools in the system for flexibility.", correct: false },
      { id: "c", text: "Three specialized subagents, each with a prompt focused on its domain and a tool set scoped to its specialization.", correct: true },
      { id: "d", text: "A single subagent that executes three sequential passes, switching its prompt between passes to focus on each domain.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Specialization improves quality: each subagent has focused prompts and tools relevant to its domain. This reduces confusion in tool selection and allows each agent to focus deeply on its area.",
    whyOthersWrong: {
      a: "A single versatile agent with many tools suffers from attention dilution and poor tool selection. Deep investigation of each domain benefits from specialization.",
      b: "Giving all subagents access to all tools violates least privilege and degrades tool selection reliability. The scientific subagent does not need legal tools.",
      d: "Sequential passes are slower than parallel execution of specialized subagents, and each pass loses context from previous ones as the history grows."
    }
  },
  {
    id: 41,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "The support agent receives a stop_reason 'tool_use' but the specified tool call is for a tool that was removed from the system a week ago. What is the correct orchestrator response?",
    options: [
      { id: "a", text: "Ignore the tool call and send an empty message to the model so it generates a different response.", correct: false },
      { id: "b", text: "Return a tool_result with isError: true informing that the tool does not exist, allowing the model to choose an alternative.", correct: true },
      { id: "c", text: "Terminate the session with an error since the model is in an inconsistent state.", correct: false },
      { id: "d", text: "Execute a similarly named tool that might fulfill the same function.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The orchestrator should return a tool_result informing of the error. This maintains the communication protocol intact and allows the model to adapt by choosing an alternative tool or responding to the user directly.",
    whyOthersWrong: {
      a: "Sending an empty message breaks the protocol expected by the model. After a stop_reason 'tool_use', the model expects to receive a tool_result, not an empty turn.",
      c: "Terminating the session for a missing tool is a disproportionate reaction. The model can adapt if it receives adequate feedback about the error.",
      d: "Executing a different tool without the model's consent can produce unexpected results. The model should decide what to do with the information that the tool does not exist."
    }
  },
  {
    id: 42,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "Your team wants to implement a workflow where Claude Code first plans complex changes and then implements them. During the planning phase, it should not modify files. What is the best way to implement this?",
    options: [
      { id: "a", text: "Add instructions in the prompt: 'In the first phase only analyze and plan, do not make code changes'.", correct: false },
      { id: "b", text: "Use plan mode (shift+tab) which restricts Claude from making edits, allowing only reading and analysis before switching to direct execution.", correct: true },
      { id: "c", text: "Create two separate sessions: a read-only one for planning and another with full permissions for implementation.", correct: false },
      { id: "d", text: "Configure allowed-tools to exclude Write and Edit during the planning phase, then reconfigure to include them.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Plan mode is the built-in functionality designed exactly for this case: it restricts the model to only reading and reasoning, without allowing file modifications, until the user switches to direct execution.",
    whyOthersWrong: {
      a: "Prompt instructions are probabilistic enforcement. The model might decide to make 'minor' edits if it believes they are necessary for the analysis.",
      c: "Two separate sessions lose the planning context when moving to implementation. Plan mode keeps everything in the same session with a seamless transition.",
      d: "Reconfiguring allowed-tools between phases is a more complex manual workaround than using plan mode, which is designed exactly for this workflow."
    }
  },
  {
    id: 43,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator delegates a research task to a subagent. The subagent returns partial results along with a note indicating it could not access two important sources due to timeout errors. How should the coordinator respond?",
    options: [
      { id: "a", text: "Accept the partial results and proceed to the synthesis phase, mentioning the gaps at the end of the report.", correct: false },
      { id: "b", text: "Discard the partial results and re-execute the subagent from scratch with a longer timeout.", correct: false },
      { id: "c", text: "Evaluate whether the partial results are sufficient for the research goal. If the missing sources are critical, spawn a new subagent focused only on those sources. If they are not critical, proceed with annotation.", correct: true },
      { id: "d", text: "Escalate to the human user to decide whether the partial results are acceptable.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The coordinator should make informed decisions based on the criticality of the missing information. This preserves completed work while ensuring critical gaps are addressed with targeted actions.",
    whyOthersWrong: {
      a: "Proceeding without evaluating the criticality of the missing sources can result in a report with significant gaps. Some sources may be fundamental to the conclusions.",
      b: "Discarding valid partial results is wasteful. The results already obtained are useful — only the missing sources need a retry.",
      d: "Escalating routine operational decisions to the user disrupts the workflow. The coordinator should be able to evaluate gap criticality and act autonomously."
    }
  },
  {
    id: 44,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has access to process_refund, apply_credit, and escalate_to_human. A bug in apply_credit causes it to apply duplicate credits 2% of the time. While the bug is being fixed, what is the best mitigation?",
    options: [
      { id: "a", text: "Remove apply_credit from the agent's tool set and add instructions for it to offer a direct refund as an alternative.", correct: false },
      { id: "b", text: "Add a PostToolUse hook on apply_credit that checks for duplicates and automatically reverts them if detected.", correct: true },
      { id: "c", text: "Add instructions to the prompt telling the agent not to use apply_credit until further notice.", correct: false },
      { id: "d", text: "Reduce the priority of apply_credit in the tool descriptions so the agent uses it less frequently.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A PostToolUse hook that checks and reverts duplicates is the most effective mitigation: it keeps the functionality available while deterministically preventing the bug's impact.",
    whyOthersWrong: {
      a: "Removing the tool eliminates a legitimate functionality that works correctly 98% of the time. It is a disproportionate reaction when the 2% of failures can be mitigated.",
      c: "Prompt instructions are probabilistic enforcement. The agent might use apply_credit anyway, especially if the customer specifically requests a credit.",
      d: "Reducing 'priority' in descriptions is not a reliable mechanism. There is no guarantee that the model will use it less, and when it does, the bug will still be present."
    }
  },
  {
    id: 45,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "Claude Code needs to explore an unfamiliar codebase of 500+ files to understand the architecture before making changes. What is the most efficient approach?",
    options: [
      { id: "a", text: "Use Read to read each project file sequentially, building a mental map of the architecture.", correct: false },
      { id: "b", text: "Ask the user to provide architectural documentation or a diagram before starting the exploration.", correct: false },
      { id: "c", text: "Use the Explore subagent (Task tool) which navigates the codebase in isolation, returning an architecture summary without polluting the main session context.", correct: true },
      { id: "d", text: "Use Glob to list all files and then Grep to search for key patterns like 'export class' and 'import from' to map dependencies.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The Explore subagent uses the Task tool to navigate the codebase in an isolated context. It can read many files without consuming tokens in the main session, returning only a structured architecture summary.",
    whyOthersWrong: {
      a: "Reading 500+ files sequentially would consume a massive amount of tokens in the main session context, causing context degradation before the real work even begins.",
      b: "Depending on external documentation delays the work and the documentation may be outdated. Claude Code has built-in tools for autonomous exploration.",
      d: "Although Glob+Grep is useful for specific searches, it is not efficient for understanding complete architecture. The results from many searches accumulate tokens in the main context."
    }
  },
  {
    id: 46,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent handles an identity verification flow with three steps: (1) ask for email, (2) send verification code, (3) validate entered code. The agent sometimes jumps to step 3 without completing step 2. What is the most robust solution?",
    options: [
      { id: "a", text: "Add detailed instructions to the prompt describing the three sequential steps with emphasis on not skipping steps.", correct: false },
      { id: "b", text: "Implement the flow as a programmatic state machine where each tool verifies that the previous step was completed before executing.", correct: true },
      { id: "c", text: "Add few-shot examples showing the correct 3-step flow in different scenarios.", correct: false },
      { id: "d", text: "Have each step return a state token that the next step requires as a mandatory parameter.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A programmatic state machine provides deterministic enforcement of the sequence. Each tool verifies preconditions before executing, making it impossible to skip steps regardless of what the model decides.",
    whyOthersWrong: {
      a: "Prompt instructions are probabilistic enforcement. For security flows like identity verification, deterministic enforcement is needed.",
      c: "Few-shot examples improve probability but do not guarantee it. In security flows, probability is not enough — you need guarantees.",
      d: "State tokens are a good idea but insufficient on their own. The model could fabricate or reuse a previous token. A programmatic state machine validates the complete state, not just a token."
    }
  },
  {
    id: 47,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator needs to fork a research session: the base research is identical, but you need to explore two conflicting hypotheses in parallel without them contaminating each other. How should you implement this?",
    options: [
      { id: "a", text: "Use a single subagent that explores both hypotheses sequentially, clearly separating them in its output.", correct: false },
      { id: "b", text: "Spawn two independent subagents with the same base context but divergent instructions for each hypothesis, then compare results.", correct: true },
      { id: "c", text: "Create a single long session where the agent explores the first hypothesis, then uses /compact and explores the second.", correct: false },
      { id: "d", text: "Give both hypotheses to a subagent and ask it to maintain 'separate tracks' in its reasoning.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Spawning two independent subagents with shared base context but divergent instructions ensures total isolation between hypotheses. Each investigates without bias from the other, and results are compared at the end.",
    whyOthersWrong: {
      a: "A single sequential subagent introduces bias: the exploration of the second hypothesis is influenced by the findings of the first, contaminating the results.",
      c: "/compact loses details from the first hypothesis. When exploring the second, the agent lacks the complete context for a fair comparison.",
      d: "Asking a model to maintain 'separate tracks' does not work in practice. Reasoning about one hypothesis inevitably influences the analysis of the other."
    }
  },
  {
    id: 48,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "Your development agent is implementing a feature that involves changes across 3 microservices. Each microservice has its own test suite. How should it orchestrate implementation and testing?",
    options: [
      { id: "a", text: "Implement all changes in the 3 services first, then run all test suites at the end.", correct: false },
      { id: "b", text: "Implement and test each microservice completely before moving to the next, in dependency order.", correct: false },
      { id: "c", text: "Use parallel subagents to implement changes in all 3 services simultaneously, with an integration testing step that runs after all complete.", correct: false },
      { id: "d", text: "Implement and test each microservice incrementally, running unit tests after each change and integration tests after all 3 are complete.", correct: true }
    ],
    correctAnswer: "d",
    explanation: "Incremental testing (unit tests after each change) detects errors early before they propagate, while integration tests at the end verify that the 3 services interact correctly.",
    whyOthersWrong: {
      a: "Implementing everything first and testing at the end is waterfall testing. Errors detected late are more costly to fix because you do not know which change caused them.",
      b: "Completing one service before starting the next is inefficient when the changes are interdependent. It may require rework in 'completed' services when you discover requirements in the third.",
      c: "Implementing all 3 in parallel without intermediate tests can result in 3 incorrect implementations that are only discovered in integration testing, multiplying the debugging effort."
    }
  },
  {
    id: 49,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has a PreToolUse hook that logs each tool call to an audit system. The hook takes 200ms to complete the HTTP call to the logging service. In a typical session with 15 tool calls, this adds 3 seconds of latency. How can you optimize?",
    options: [
      { id: "a", text: "Remove the logging hook to improve latency. System logs are sufficient.", correct: false },
      { id: "b", text: "Change the hook to PostToolUse so the logging does not block tool execution.", correct: false },
      { id: "c", text: "Have the hook send logs asynchronously (fire-and-forget) so it does not block execution.", correct: true },
      { id: "d", text: "Reduce logging to only critical tools (process_refund, escalate) instead of all tools.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Asynchronous logging (fire-and-forget) eliminates the 200ms of latency per tool call without losing the audit functionality. The hook sends the HTTP request without waiting for a response.",
    whyOthersWrong: {
      a: "Audit logging is a compliance/security requirement, not optional. Removing it for latency optimization sacrifices a necessary functionality.",
      b: "Switching to PostToolUse does not reduce latency — the hook still blocks for 200ms, just at a different point. The session still accumulates 3 extra seconds.",
      d: "Reducing logging to only critical tools partially improves latency but loses audit trail for tools that could be relevant in incident investigations."
    }
  },
  {
    id: 50,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your research system has a coordinator with access to the Task tool. You want an analysis subagent to have the ability to spawn its own sub-subagents for fact-checking tasks. Is this advisable?",
    options: [
      { id: "a", text: "Yes, giving the Task tool to the subagent allows recursive decomposition that improves the quality of the analysis.", correct: false },
      { id: "b", text: "No, only the coordinator should have the Task tool. If the subagent needs fact-checking, it should return the claims to the coordinator so it can delegate to a verification subagent.", correct: true },
      { id: "c", text: "Yes, but limit recursion depth to 2 levels to avoid infinite loops.", correct: false },
      { id: "d", text: "No, because the Task tool cannot be used by subagents — it only works in the main context.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The coordinator should be the only point of orchestration. If subagents spawn sub-subagents, visibility and control of the workflow are lost. The coordinator centralizes delegation decisions.",
    whyOthersWrong: {
      a: "Recursive decomposition without centralized control creates execution trees that are difficult to monitor, debug, and recover from in case of failures. Centralized coordination is more maintainable.",
      c: "Limiting depth mitigates but does not solve the fundamental problem: loss of coordinator visibility over what is being executed and why.",
      d: "Technically the Task tool can be given to subagents, but it should not be for architectural design reasons, not because of technical limitations."
    }
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration (18%) — Questions 51-62 =====
  {
    id: 51,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your PDF extraction tool returns content from 200+ pages as a single string. The agent frequently ignores information from the middle pages when answering questions. What is the cause and the solution?",
    options: [
      { id: "a", text: "The model has a character limit on tool results. Paginate the tool output returning only pages relevant to the query.", correct: false },
      { id: "b", text: "The lost-in-the-middle effect causes the model to pay less attention to central content of long inputs. Restructure the tool to return relevant sections first or implement semantic search within the document.", correct: true },
      { id: "c", text: "The problem is that the model does not read all the text. Add instructions to the prompt asking it to read all content carefully.", correct: false },
      { id: "d", text: "The tool should return a summary of the document instead of the full text to reduce the model's cognitive load.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The lost-in-the-middle effect is a well-documented phenomenon where models pay more attention to the beginning and end of long inputs. Restructuring the output to prioritize relevant content or adding semantic search mitigates this effect.",
    whyOthersWrong: {
      a: "There is no fixed character limit, but the model does have attention issues with long content. Pagination is partially correct but does not address the root cause without relevance prioritization.",
      c: "Instructions to 'read carefully' do not mitigate the lost-in-the-middle effect. It is a phenomenon of the model's architecture, not a lack of diligence.",
      d: "A summary loses specific details that may be needed. The correct solution is to return relevant sections, not general summaries."
    }
  },
  {
    id: 52,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your personal notes MCP server is configured in ~/.claude.json. A colleague clones your repo and reports that Claude Code gives an error when trying to use the notes server. What is the cause?",
    options: [
      { id: "a", text: "The colleague needs to install the MCP server dependencies locally.", correct: false },
      { id: "b", text: "MCP servers in ~/.claude.json are user-scoped and are not shared via the repository. The notes server only exists on your machine.", correct: true },
      { id: "c", text: "The MCP server needs to be registered in a central registry before other users can access it.", correct: false },
      { id: "d", text: "The colleague needs to add explicit permissions in their configuration to allow third-party MCP servers.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "~/.claude.json is user-scoped configuration: it only exists on your machine and is not version-controlled. To share MCP servers with a team, the configuration should go in .mcp.json (project-scoped) which is version-controlled.",
    whyOthersWrong: {
      a: "Although dependencies are necessary, the fundamental problem is that the server configuration does not exist on the colleague's machine. It is not a dependency issue but a scope issue.",
      c: "There is no central registry for MCP servers. Servers are configured locally via .mcp.json (project) or ~/.claude.json (user).",
      d: "There is no permission system for 'third-party MCP servers'. The problem is that the configuration is not present on the colleague's machine."
    }
  },
  {
    id: 53,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has 12 available tools but 70% of interactions only require 3 tools (get_customer, lookup_order, send_response). Tool selection is slow and occasionally incorrect for the other 9 tools. How can you improve this?",
    options: [
      { id: "a", text: "Use forced tool_choice to always call get_customer first, reducing the initial decision.", correct: false },
      { id: "b", text: "Improve the descriptions of all 12 tools to make them clearer and more differentiated.", correct: false },
      { id: "c", text: "Implement dynamic tool routing: start with the 3 core tools available and only add additional tools when the conversation context indicates they are needed.", correct: true },
      { id: "d", text: "Create a super-tool 'customer_action' that consolidates all 12 tools into one with an 'action_type' parameter.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Dynamic tool routing reduces selection complexity by keeping only the most-used tools available by default. Specialized tools are added conditionally when the context requires it, improving accuracy without losing functionality.",
    whyOthersWrong: {
      a: "Forced tool_choice eliminates the model's ability to reason. Not all flows begin with get_customer — some may be inquiries about policies or products.",
      b: "Better descriptions help but do not solve the fundamental problem of decision complexity with 12 options. Reducing the visible options is more effective.",
      d: "A super-tool with 12 action types is equally complex as 12 separate tools. Additionally, it loses the specific parameter structure of each tool."
    }
  },
  {
    id: 54,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your API tool returns an error in the following format: { error: 'Connection refused', code: 'ECONNREFUSED' }. The agent interprets this as an authentication problem and requests new credentials from the user. How can you improve the tool response?",
    options: [
      { id: "a", text: "Add instructions to the prompt explaining what each API error code means.", correct: false },
      { id: "b", text: "Return isError: true with structured metadata: { errorCategory: 'network', isRetryable: true, description: 'Server unreachable - connection refused', suggestedAction: 'retry_after_delay' }.", correct: true },
      { id: "c", text: "Wrap the error in a human-readable message: 'Could not connect to the server. This is not a credentials issue.'", correct: false },
      { id: "d", text: "Return a fallback result with cached data from the last successful call.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Structured metadata with errorCategory, isRetryable, and suggestedAction allows the model to make correct recovery decisions without needing to interpret low-level error codes.",
    whyOthersWrong: {
      a: "Documenting every error code in the prompt is token-inefficient and fragile. Possible errors change with the APIs. Structured metadata is self-descriptive.",
      c: "A human-readable message is better than the raw error but lacks structure. The model cannot programmatically distinguish between error categories based on free text.",
      d: "Returning cached data as if it were current is dishonest and can cause incorrect decisions. The agent must know that the data is not fresh."
    }
  },
  {
    id: 55,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "You need your database MCP server to use a different token per environment (dev/staging/prod). The configuration is in the project's .mcp.json. What is the correct way to handle this?",
    options: [
      { id: "a", text: "Create three separate .mcp.json files (.mcp.dev.json, .mcp.staging.json, .mcp.prod.json) and symlink the correct one.", correct: false },
      { id: "b", text: "Use environment variable expansion in .mcp.json: ${DB_TOKEN} that each environment defines with its appropriate value.", correct: true },
      { id: "c", text: "Hardcode the dev token in .mcp.json and manually override for other environments.", correct: false },
      { id: "d", text: "Configure the MCP server to read the token from a .env file that is not committed to the repository.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Environment variable expansion (${DB_TOKEN}) in .mcp.json is the mechanism designed for handling per-environment credentials. Each environment defines the variable with its value without modifying the configuration file.",
    whyOthersWrong: {
      a: "Multiple configuration files add complexity and risk of desynchronization. Environment variables are the standard mechanism for per-environment configuration.",
      c: "Hardcoding tokens in committed files is a security risk. Additionally, manual override is error-prone and not reproducible.",
      d: "Although .env is a valid practice in many frameworks, .mcp.json has native support for environment variable expansion, which is more direct and does not require additional configuration."
    }
  },
  {
    id: 56,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your MCP server exposes both tools (search_web, fetch_page) and resources (cached_articles, research_templates). The agent frequently calls search_web when the information is already available in cached_articles. How can you improve this?",
    options: [
      { id: "a", text: "Remove the resources and convert them into tools so the model uses them in the same way.", correct: false },
      { id: "b", text: "Add to the description of the search_web tool: 'Before searching, check whether the information exists in the available resources (cached_articles)'.", correct: true },
      { id: "c", text: "Implement middleware that intercepts calls to search_web and first queries cached_articles.", correct: false },
      { id: "d", text: "Use forced tool_choice so the model always consults resources before using tools.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Tool descriptions are the primary mechanism for guiding tool selection. Mentioning the existence of alternative resources in the description helps the model consider more efficient options.",
    whyOthersWrong: {
      a: "Resources and tools have different semantics. Resources are static data included in the context; converting them to tools loses the advantage of having pre-loaded data.",
      c: "Transparent middleware hides the agent's behavior. If cached_articles does not have the current information, the agent would not know the search was intercepted and could act on stale data.",
      d: "Forced tool_choice cannot force reading resources — it only controls tool selection. Additionally, not all queries need to check the cache first."
    }
  },
  {
    id: 57,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Code Generation with Claude Code",
    question: "A developer wants Claude Code to be able to run tests but not deploy. Currently both operations are executed via Bash. What is the correct configuration?",
    options: [
      { id: "a", text: "Add instructions in CLAUDE.md: 'Never execute deploy commands. Only execute test commands.'", correct: false },
      { id: "b", text: "Configure allowed-tools to permit Bash only with specific commands like 'npm test' and 'pytest', blocking others.", correct: false },
      { id: "c", text: "Configure allowed-tools to permit Bash and use a PreToolUse hook that inspects each command and blocks deploy patterns (e.g., 'deploy', 'kubectl apply', 'aws ecs').", correct: true },
      { id: "d", text: "Remove Bash from available tools and create a dedicated 'run_tests' tool that can only execute test commands.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "A PreToolUse hook on Bash allows inspecting each command before execution and blocking dangerous patterns like deploy commands, while maintaining Bash flexibility for legitimate commands like tests.",
    whyOthersWrong: {
      a: "Instructions in CLAUDE.md are probabilistic enforcement. The model might execute a deploy if it believes it is necessary to complete a task.",
      b: "allowed-tools does not have granularity to filter Bash arguments. It allows or blocks the complete tool, not specific commands within Bash.",
      d: "Removing Bash eliminates too much functionality. The developer might need Bash for many legitimate tasks beyond tests (installing dependencies, linting, etc.)."
    }
  },
  {
    id: 58,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your extraction system needs to process documents in 5 languages. You have an extract_document tool that accepts a language parameter. The model frequently sends the wrong language. How can you improve this?",
    options: [
      { id: "a", text: "Have the tool detect the language automatically within its implementation, ignoring the language parameter from the model.", correct: true },
      { id: "b", text: "Add few-shot examples showing correct language detection for each of the 5 languages.", correct: false },
      { id: "c", text: "Have the model first call a detect_language tool before calling extract_document.", correct: false },
      { id: "d", text: "Limit the language parameter to an enum of the 5 supported languages in the JSON schema.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "If the tool can detect the language automatically, eliminating the dependency on the model for this decision is the most robust solution. It reduces the error surface by moving detection to deterministic code.",
    whyOthersWrong: {
      b: "Few-shot examples improve probability but do not guarantee correct detection, especially in documents with multilingual content or similar languages.",
      c: "Adding a separate tool to detect language introduces an extra step that can fail and adds latency. If detection can be internal to the tool, it is simpler and more reliable.",
      d: "The enum limits options but does not prevent the model from selecting the wrong language from the enum. The selection is still probabilistic."
    }
  },
  {
    id: 59,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent needs to access a legacy system that returns XML. The tool wrapper converts XML to JSON before returning to the model. But the wrapper fails with malformed XML from the legacy system (5% of cases). How should you handle this?",
    options: [
      { id: "a", text: "Return the raw XML when parsing fails and let the model interpret it directly.", correct: false },
      { id: "b", text: "Return isError: true with the raw XML, errorCategory 'parse_error', isRetryable: false, and a description of the parsing error.", correct: false },
      { id: "c", text: "Implement a more tolerant XML parser that handles the common malformed XML cases from the legacy system.", correct: true },
      { id: "d", text: "Return an empty successful result when the XML is malformed to avoid confusing the model.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "If the 5% of malformed XML follows known patterns from the legacy system, a tolerant parser that handles those patterns is the most robust solution. It prevents both the error and the need for the model to interpret raw XML.",
    whyOthersWrong: {
      a: "Returning raw XML to the model is token-inefficient and the model may misinterpret malformed XML. The wrapper should handle the conversion robustly.",
      b: "Marking as non-retryable is correct for the current error, but the 5% failure rate is high enough to justify fixing the parser instead of propagating errors.",
      d: "Returning an empty successful result is an explicitly listed anti-pattern. It hides the error and produces decisions based on incomplete data."
    }
  },
  {
    id: 60,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your team has a Jira MCP server configured in .mcp.json. A developer also needs a personal Notion MCP server for their private notes. Where should the Notion server be configured?",
    options: [
      { id: "a", text: "In .mcp.json alongside the Jira server so both are in the same configuration file.", correct: false },
      { id: "b", text: "In ~/.claude.json since it is a personal server that should not be shared with the team.", correct: true },
      { id: "c", text: "In a separate .mcp.personal.json file that is added to .gitignore.", correct: false },
      { id: "d", text: "In the developer's personal CLAUDE.md (~/.claude/CLAUDE.md) with connection instructions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "~/.claude.json is for user-scoped configuration: personal and experimental MCP servers that should not be shared. .mcp.json is for team/project servers.",
    whyOthersWrong: {
      a: "Adding a personal server to .mcp.json would expose it to the entire team via version control. The Notion notes are private to the developer.",
      c: ".mcp.personal.json is not a mechanism that exists in Claude Code. The distinction is between .mcp.json (project) and ~/.claude.json (user).",
      d: "CLAUDE.md is for instructions and context, not for MCP server configuration. It has no mechanism for defining servers."
    }
  },
  {
    id: 61,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Code Generation with Claude Code",
    question: "Claude Code has built-in tools: Read, Write, Edit, Bash, Grep, and Glob. Your agent needs to find all functions that import a specific module in a 2000-file TypeScript project. What is the most efficient combination?",
    options: [
      { id: "a", text: "Glob('**/*.ts') to list files, then Read each one looking for the import.", correct: false },
      { id: "b", text: "Bash('grep -r \"import.*moduleName\" --include=\"*.ts\"') to search across all files.", correct: false },
      { id: "c", text: "Grep with the pattern 'import.*moduleName' filtered to *.ts files, which returns matches directly.", correct: true },
      { id: "d", text: "Read package.json to find dependencies, then Grep in the files that use them.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Grep is the built-in tool optimized for content search in files. With a regex pattern and file type filter, it finds all imports in a single efficient operation.",
    whyOthersWrong: {
      a: "Glob + Read of 2000 files would consume an enormous amount of tokens and would be extremely slow. Grep does the search server-side without loading complete files.",
      b: "Although Bash with grep would work, built-in tools are preferable for efficiency and safety. Grep is optimized for content search in Claude Code.",
      d: "package.json lists external dependencies, not internal imports. Additionally, reading package.json does not indicate which files import the specific module."
    }
  },
  {
    id: 62,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your extract_invoice tool needs a 'format' parameter that accepts 'pdf', 'image', or 'html'. You want the model to ALWAYS call this specific tool (not another) when it receives a document to extract. What tool_choice configuration should you use?",
    options: [
      { id: "a", text: "tool_choice: { type: 'auto' } to let the model decide when to use the tool.", correct: false },
      { id: "b", text: "tool_choice: { type: 'any' } to force a tool call but let the model choose which one.", correct: false },
      { id: "c", text: "tool_choice: { type: 'tool', name: 'extract_invoice' } to force the model to always use this specific tool.", correct: true },
      { id: "d", text: "tool_choice: { type: 'required', tool: 'extract_invoice' } to mark the tool as mandatory.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "tool_choice with type 'tool' and the specific tool name forces the model to call exactly that tool. It is ideal when you know the output should always be a structured extraction.",
    whyOthersWrong: {
      a: "'auto' allows the model to respond with text instead of calling a tool, which does not guarantee structured extraction on each request.",
      b: "'any' guarantees a tool call but not which tool. If there are multiple tools available, the model could choose a different one.",
      d: "{ type: 'required', tool: 'extract_invoice' } is not the correct syntax for the Anthropic API. The correct form is { type: 'tool', name: 'extract_invoice' }."
    }
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows (20%) — Questions 63-76 =====
  {
    id: 63,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project has a CLAUDE.md at the root, another at ~/.claude/CLAUDE.md (user-level), and files in .claude/rules/. During a session, Claude seems to ignore instructions from the root CLAUDE.md. Upon investigating, you discover that the user-level CLAUDE.md instructions contradict the project ones. What takes precedence?",
    options: [
      { id: "a", text: "The project-level CLAUDE.md always takes precedence over the user-level one.", correct: false },
      { id: "b", text: "The user-level CLAUDE.md always takes precedence over the project-level one.", correct: false },
      { id: "c", text: "Both are loaded and included in the context. There is no formal precedence — contradictions cause inconsistent behavior as the model interprets both sets of instructions.", correct: true },
      { id: "d", text: "Only the first CLAUDE.md found in the hierarchy is loaded, ignoring the rest.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "CLAUDE.md files from different levels (user, project, directory) are concatenated and included in the context. If there are contradictions, the model must interpret conflicting instructions, causing inconsistent behavior.",
    whyOthersWrong: {
      a: "There is no formal precedence system in CLAUDE.md. All files are included in the context without explicit override.",
      b: "The user-level does not have formal precedence. Both files are injected into the context and the model tries to follow both.",
      d: "Claude Code loads ALL applicable CLAUDE.md files from the hierarchy, not just the first one. This allows composition of instructions in complex projects."
    }
  },
  {
    id: 64,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project CLAUDE.md has 500 lines and references 3 detailed external documents with @import. Claude is having trouble following instructions that are in the second half of the file. What is happening?",
    options: [
      { id: "a", text: "The @imports are resolved at the start of the session and their content replaces the directive in the CLAUDE.md.", correct: false },
      { id: "b", text: "The CLAUDE.md and its imports are included in the system prompt. With 500+ lines plus 3 imported documents, the total volume causes the model to pay less attention to instructions in the middle (lost-in-the-middle effect).", correct: true },
      { id: "c", text: "The @imports have a size limit and the documents are being silently truncated.", correct: false },
      { id: "d", text: "Claude Code only processes the first 200 lines of CLAUDE.md for token efficiency.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The CLAUDE.md and its @imports are included in the context. An excessive volume of instructions causes the lost-in-the-middle effect where central instructions receive less attention from the model.",
    whyOthersWrong: {
      a: "The @imports are resolved and included, but that does not explain why instructions in the second half are ignored. The problem is the total volume, not the import mechanism.",
      c: "There is no evidence of a size limit that causes silent truncation. The problem is the model's attention with voluminous content.",
      d: "Claude Code does not have a 200-line limit. All content is included, but more content means more attention dilution."
    }
  },
  {
    id: 65,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline executes `claude -p 'Review this PR' --output-format json`. The JSON output contains additional fields you do not need and varies in structure between executions. How can you get consistent and predictable JSON output?",
    options: [
      { id: "a", text: "Parse the JSON output and filter the necessary fields in a post-processing script.", correct: false },
      { id: "b", text: "Use --output-format json together with --json-schema to define exactly the expected output structure.", correct: true },
      { id: "c", text: "Add instructions in the prompt requesting that the output be JSON with specific fields.", correct: false },
      { id: "d", text: "Use --output-format json-strict which forces JSON output without additional fields.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "--json-schema allows defining the exact structure of the JSON output. Combined with --output-format json, it guarantees that the output has exactly the fields defined in the schema.",
    whyOthersWrong: {
      a: "Post-processing is a fragile workaround. If the structure changes between executions, the filtering script can break. It is better to define the structure upfront.",
      c: "Prompt instructions produce JSON with variable structure. There is no guarantee that the model will include exactly the requested fields in the exact format.",
      d: "--output-format json-strict does not exist. The correct way to constrain the structure is with --json-schema."
    }
  },
  {
    id: 66,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your Claude Code session has been running for 2 hours working on a complex refactor. Responses are getting slower and less precise. The context is full of previous tool call history. What is the correct action?",
    options: [
      { id: "a", text: "Close the session and start a new one, losing all accumulated context.", correct: false },
      { id: "b", text: "Use /compact to compress the conversation history, preserving key points while freeing context space.", correct: true },
      { id: "c", text: "Continue working since Claude Code automatically manages context without user intervention.", correct: false },
      { id: "d", text: "Copy key instructions to a file and restart the session, loading the file at the beginning.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "/compact compresses the conversation history while preserving key information. This frees context space without losing accumulated work, restoring the speed and precision of responses.",
    whyOthersWrong: {
      a: "Closing the session loses all context accumulated over 2 hours of work. /compact preserves key points without needing to start from scratch.",
      c: "Although Claude Code has context management, the reported degradation indicates that the user should intervene with /compact to optimize context usage.",
      d: "Manually copying instructions is an unnecessary workaround when /compact is designed exactly for this use case."
    }
  },
  {
    id: 67,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline needs to run 3 different Claude Code analyses on a PR: security review, style check, and test coverage analysis. All 3 are independent. How can you optimize execution?",
    options: [
      { id: "a", text: "Run all 3 sequentially in a single CI job with claude -p for each one.", correct: false },
      { id: "b", text: "Run all 3 as a single Claude invocation with a prompt requesting all three analyses.", correct: false },
      { id: "c", text: "Run all 3 in parallel as independent CI jobs, each with its own claude -p invocation and a focused prompt.", correct: true },
      { id: "d", text: "Run only the security review in CI and leave style check and coverage for manual review.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Independent parallel CI jobs maximize throughput. Each invocation has a prompt focused on a specific task, improving the quality of each analysis without attention dilution.",
    whyOthersWrong: {
      a: "Sequential execution wastes time when all 3 analyses are independent. Running in parallel significantly reduces wall-clock time.",
      b: "A single prompt with 3 different tasks causes attention dilution. The quality of each analysis degrades when they compete for the model's attention.",
      d: "Automating only the security review misses the opportunity to automate style check and coverage, which are equally repetitive and benefit from CI."
    }
  },
  {
    id: 68,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project has strict conventions for test files: always use describe/it blocks, mock with vi.mock(), and assert with expect().toBe(). You want Claude Code to apply these conventions automatically when working with test files. Where should you configure this?",
    options: [
      { id: "a", text: "In the project CLAUDE.md under a '## Testing Conventions' header.", correct: false },
      { id: "b", text: "In .claude/rules/ with a file that has YAML frontmatter with a glob pattern '**/*.test.ts' or '**/*.spec.ts'.", correct: true },
      { id: "c", text: "In a CLAUDE.md inside the __tests__/ or tests/ directory.", correct: false },
      { id: "d", text: "In .claude/skills/testing/SKILL.md with the conventions documented.", correct: false }
    ],
    correctAnswer: "b",
    explanation: ".claude/rules/ with glob patterns in the frontmatter applies rules automatically when Claude works with files that match the pattern. For test files scattered across the codebase, this is more robust than a directory CLAUDE.md.",
    whyOthersWrong: {
      a: "The project CLAUDE.md is always loaded, wasting context when not working with tests. Rules with glob patterns activate conditionally.",
      c: "A CLAUDE.md in __tests__/ only applies to files in that directory. If tests are co-located with the source code (*.test.ts alongside *.ts), it would not apply to those files.",
      d: "Skills require manual invocation or activation. Rules with glob patterns are applied automatically without user intervention."
    }
  },
  {
    id: 69,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "Your project CLAUDE.md includes an @import for internal API documentation. The imported file has 2000 lines. Developers report that Claude does not follow the general instructions in the CLAUDE.md that come before the @import. What should be done?",
    options: [
      { id: "a", text: "Move the @import to the end of the CLAUDE.md so the general instructions are read first.", correct: false },
      { id: "b", text: "Replace the 2000-line @import with a concise API summary, and add instructions for Claude to consult the full file with Read when it needs specific details.", correct: true },
      { id: "c", text: "Split the @import into 10 smaller files of 200 lines each.", correct: false },
      { id: "d", text: "Add a second @import that repeats the general instructions at the end of the CLAUDE.md.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A 2000-line @import dominates the context and dilutes the general instructions. Replacing it with a concise summary keeps the context lean, and Claude can Read the full file when it needs specific details.",
    whyOthersWrong: {
      a: "Moving the @import does not reduce the total volume of content in the context. The 2000 lines still dilute attention regardless of their position.",
      c: "Splitting into 10 files does not reduce the total volume: 10 x 200 = 2000 lines. The problem is the volume, not the fragmentation.",
      d: "Repeating instructions is a fragile workaround that adds even more tokens to an already saturated context."
    }
  },
  {
    id: 70,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI job executes `claude -p 'Analyze test failures' --output-format json` and processes the JSON output. Occasionally, the output includes non-JSON text before the JSON (warnings, status messages). How can you make the pipeline more robust?",
    options: [
      { id: "a", text: "Add a regex pre-processor that extracts the JSON from the complete output.", correct: false },
      { id: "b", text: "Use --output-format stream-json to receive the output as streaming JSON that separates metadata from content.", correct: false },
      { id: "c", text: "Redirect stderr to /dev/null to eliminate warnings and capture only stdout which contains the JSON.", correct: true },
      { id: "d", text: "Wrap the invocation in a try-catch that re-executes if JSON parsing fails.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Warnings and status messages are sent to stderr while the JSON output goes to stdout. Redirecting stderr to /dev/null isolates the clean JSON on stdout for reliable processing.",
    whyOthersWrong: {
      a: "A regex pre-processor is fragile and can fail with complex JSON that contains strings with special characters. Separating stderr from stdout is more robust.",
      b: "--output-format stream-json is not a documented option for Claude Code. The valid options are json and text (and json with --json-schema).",
      d: "Re-executing is costly and unnecessary. The problem is cleanly solved by separating stderr from stdout without re-invocation."
    }
  },
  {
    id: 71,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your team has a custom /deploy command that executes a sequence of steps. A new developer runs /deploy but Claude cannot find the command. Other developers use it without issues. What is the most likely cause?",
    options: [
      { id: "a", text: "The new developer does not have the correct permissions configured in allowed-tools.", correct: false },
      { id: "b", text: "The command is defined in ~/.claude/commands/ of the other developers, not in .claude/commands/ of the project.", correct: true },
      { id: "c", text: "The new developer needs to run /init to activate the project's custom commands.", correct: false },
      { id: "d", text: "The command file has a syntax error that only affects certain operating systems.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "If the command is in ~/.claude/commands/ (user-level), it only exists on the machines of the developers who created it. For it to be available to the whole team, it must be in .claude/commands/ (project-level) within the repository.",
    whyOthersWrong: {
      a: "allowed-tools controls which tools Claude can use, not the availability of custom commands. Custom commands are a separate mechanism.",
      c: "/init generates an initial CLAUDE.md but has no relation to activating custom commands. Commands in .claude/commands/ are detected automatically.",
      d: "Custom commands are plain text files (Markdown) that have no operating system dependencies. There are no syntax errors that would only affect certain OSes."
    }
  },
  {
    id: 72,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You want Claude Code to always use strict TypeScript when generating code, but ONLY in your team's projects, not in your personal projects. Where should you configure this preference?",
    options: [
      { id: "a", text: "In ~/.claude/CLAUDE.md with the instruction 'Always use strict TypeScript'.", correct: false },
      { id: "b", text: "In the CLAUDE.md of each team project's repository.", correct: true },
      { id: "c", text: "In .claude/settings.json with a typescript.strict: true configuration.", correct: false },
      { id: "d", text: "In a rule file in .claude/rules/ without glob pattern frontmatter so it applies to all project files.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The project CLAUDE.md is the correct place for conventions that apply to a specific project. It is versioned with the repository and all team developers share it automatically.",
    whyOthersWrong: {
      a: "~/.claude/CLAUDE.md is user-level and applies to ALL of the user's projects, including personal ones where strict TypeScript is not wanted.",
      c: ".claude/settings.json does not accept language configurations like typescript.strict. It is for Claude Code configuration, not code conventions.",
      d: "A rule file without a glob pattern also works but is less appropriate for a general project instruction. CLAUDE.md is the standard place for general project conventions."
    }
  },
  {
    id: 73,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your team wants to create a skill that auto-generates API documentation based on the code. The skill needs to read multiple files and generate extensive output. What is the correct skill configuration?",
    options: [
      { id: "a", text: "Create .claude/skills/api-docs/SKILL.md with the instructions and use context: fork to execute in an isolated subagent.", correct: true },
      { id: "b", text: "Create .claude/commands/api-docs.md as a custom command that includes all the generation instructions.", correct: false },
      { id: "c", text: "Create a bash script that generates the documentation and reference it from CLAUDE.md.", correct: false },
      { id: "d", text: "Add the instructions directly in CLAUDE.md under a '## API Documentation Generation' header.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "A skill with context: fork is ideal for tasks that generate extensive output: the isolated subagent processes the files without polluting the main session context, returning only the final result.",
    whyOthersWrong: {
      b: "A custom command executes in the main context, without isolation. The extensive output from documentation generation would pollute the conversation.",
      c: "A bash script does not leverage Claude's capabilities for understanding and documenting code. It is a completely different approach that requires manual implementation.",
      d: "Instructions in CLAUDE.md are always loaded, even when documentation is not being generated. A skill is invoked only when needed."
    }
  },
  {
    id: 74,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline needs Claude Code to analyze a PR and fail the build if it finds critical security issues. The current script uses claude -p but cannot programmatically determine whether issues were found. How can you solve this?",
    options: [
      { id: "a", text: "Parse Claude's text output looking for words like 'critical' or 'security issue'.", correct: false },
      { id: "b", text: "Use --output-format json with --json-schema that includes a 'has_critical_issues: boolean' field, and evaluate that field in the CI script.", correct: true },
      { id: "c", text: "Configure Claude to return exit code 1 if it finds issues and exit code 0 if it does not.", correct: false },
      { id: "d", text: "Run Claude twice: once for analysis and once to evaluate whether the first output contains critical issues.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "--json-schema allows defining boolean fields like 'has_critical_issues' that the CI script can evaluate programmatically. This converts natural language output into structured processable data.",
    whyOthersWrong: {
      a: "Parsing natural text is fragile. Claude can express 'critical issue' in many different ways. A structured boolean field is deterministic.",
      c: "Claude Code does not have a mechanism to configure custom exit codes based on the analysis content. Exit codes reflect Claude's execution status, not the analysis result.",
      d: "Running Claude twice doubles the cost. --json-schema allows obtaining the structured result in a single invocation."
    }
  },
  {
    id: 75,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project has a monorepo structure with packages/frontend, packages/backend, and packages/shared. Each package has different conventions. What is the most effective way to configure Claude Code?",
    options: [
      { id: "a", text: "A single CLAUDE.md at the monorepo root with all conventions separated by headers.", correct: false },
      { id: "b", text: "A CLAUDE.md at the root with general conventions, and additional CLAUDE.md files in each package with specific conventions. The subdirectory CLAUDE.md files are loaded additionally when Claude works in those paths.", correct: true },
      { id: "c", text: "Only CLAUDE.md files in each package without one at the root, since each package is independent.", correct: false },
      { id: "d", text: "A CLAUDE.md at the root with @import of the conventions from each package.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The CLAUDE.md hierarchy allows general conventions at the root (shared conventions) and specific ones in each package. Subdirectory CLAUDE.md files are loaded additionally when working in those paths.",
    whyOthersWrong: {
      a: "A single CLAUDE.md with all conventions is voluminous and loads irrelevant conventions. When working in frontend, you do not need backend conventions.",
      c: "Without a CLAUDE.md at the root, shared conventions (naming, git workflow, CI) would have to be duplicated in each package.",
      d: "Importing all conventions via @import into the root CLAUDE.md loads all content always, eliminating the benefit of conditional loading per directory."
    }
  },
  {
    id: 76,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "Your team has just adopted Claude Code. You want Claude to have context about the project architecture, code conventions, and deployment workflows. What is the most effective first step?",
    options: [
      { id: "a", text: "Run /init so Claude analyzes the codebase and generates an initial CLAUDE.md with project information.", correct: true },
      { id: "b", text: "Manually write a detailed 500+ line CLAUDE.md covering every aspect of the project.", correct: false },
      { id: "c", text: "Create a .claude/rules/ directory with files for each project convention.", correct: false },
      { id: "d", text: "Create skills for each team workflow before starting to use Claude Code.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "/init automatically analyzes the codebase and generates an initial CLAUDE.md with project structure, technologies used, and detected conventions. It is the most efficient starting point that is then refined over time.",
    whyOthersWrong: {
      b: "Manually writing 500+ lines is excessive investment as a first step. /init generates a base that is iterated and refined with use, leveraging automatic codebase analysis.",
      c: "Rules are useful for specific file conventions, but without a base CLAUDE.md that establishes the general project context, Claude lacks the big-picture view.",
      d: "Skills are for specialized workflows. Creating skills before having the basic project context established is premature."
    }
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output (20%) — Questions 77-90 =====
  {
    id: 77,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction prompt says: 'Extract the contract information completely and accurately'. The results are inconsistent: some fields are extracted correctly, others are omitted. What is the main problem?",
    options: [
      { id: "a", text: "The model is not capable of extracting complex contracts. Fine-tuning is needed.", correct: false },
      { id: "b", text: "The instruction is vague and does not specify which fields to extract or what constitutes 'complete and accurate'. Explicit per-field criteria are needed.", correct: true },
      { id: "c", text: "The contract format varies too much between documents. Pre-normalization is needed.", correct: false },
      { id: "d", text: "The context window is not sufficient for long contracts. A model with greater capacity is needed.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Vague instructions like 'complete and accurate' do not give actionable criteria. The model needs to know exactly which fields to extract, what format to use, and what to do when a field does not exist in the document.",
    whyOthersWrong: {
      a: "The model has extraction capability — the inconsistency indicates an instruction problem, not a capability problem. With clear criteria, the model extracts correctly.",
      c: "Format variability is a factor but not the main cause of inconsistency. A prompt with explicit criteria handles variability much better than a vague one.",
      d: "Field omission is not due to lack of space but lack of specification. Contracts that fit in the context still produce incomplete extractions."
    }
  },
  {
    id: 78,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your automated review system uses the Message Batches API to analyze 200 PRs overnight. You need to correlate each result with its original PR. How do you do this?",
    options: [
      { id: "a", text: "Process results in the same order the requests were sent, assuming they return in order.", correct: false },
      { id: "b", text: "Include the PR number in the prompt and extract it from the response text of each result.", correct: false },
      { id: "c", text: "Use the custom_id field of each batch request, setting it to the PR identifier (e.g., 'pr-1234'), and match in the results.", correct: true },
      { id: "d", text: "Send each PR as a separate batch of a single request to simplify correlation.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The custom_id field of the Message Batches API is designed exactly for correlating requests with responses. It is set on each request and returned in the corresponding result.",
    whyOthersWrong: {
      a: "The Message Batches API does not guarantee return order. Results can complete in any order. Assuming sequential order would cause mismatches.",
      b: "Extracting identifiers from response text is fragile. The model might not repeat the number exactly, or might modify its format. custom_id is deterministic.",
      d: "Sending 200 batches of 1 request each loses the benefits of batching and adds overhead of 200 API calls for batch management."
    }
  },
  {
    id: 79,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction schema has a 'confidence' field where you want the model to self-report its confidence (1-10) in each extraction. Is this reliable?",
    options: [
      { id: "a", text: "Yes, LLMs have good internal calibration and the confidence score is a useful metric for filtering low-quality extractions.", correct: false },
      { id: "b", text: "No, LLMs are poorly calibrated for self-reported confidence. Implement field-level confidence based on external signals like source presence and cross-field consistency.", correct: true },
      { id: "c", text: "Yes, but only if you add an instruction explaining how to calculate the confidence score.", correct: false },
      { id: "d", text: "No, the concept of confidence should be completely eliminated and all extractions treated as equally valid.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "LLMs have poor calibration for self-reported confidence: they tend to report high confidence even in incorrect extractions. External signals (source presence, consistency between fields) are more reliable indicators.",
    whyOthersWrong: {
      a: "Studies show that LLMs are poorly calibrated for self-reported confidence. A model can report 9/10 confidence in an incorrect extraction.",
      c: "Calculation instructions do not improve the model's fundamental calibration. The problem is inherent to self-evaluation, not a lack of instructions.",
      d: "The concept of confidence is useful — but it must be based on observable external signals, not on the model's self-report."
    }
  },
  {
    id: 80,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your system uses tool_use with strict: true in the JSON schema. The model occasionally returns an 'amount' field as a string ('$1,234.56') instead of a number (1234.56). How do you fix this?",
    options: [
      { id: "a", text: "Add instructions to the prompt specifying that amounts must be numeric without currency symbols.", correct: false },
      { id: "b", text: "strict: true should already enforce the correct type. Verify that the schema defines 'amount' as { type: 'number' } and not as { type: 'string' }.", correct: true },
      { id: "c", text: "Add post-processing that parses currency strings to numbers.", correct: false },
      { id: "d", text: "Use a union type { type: ['number', 'string'] } to accept both formats.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "With strict: true, the schema defines types deterministically. If 'amount' returns as a string, the schema probably defines the type as 'string'. Correcting the schema to { type: 'number' } will force numeric output.",
    whyOthersWrong: {
      a: "Prompt instructions should not be necessary if the schema is correct with strict: true. The schema is the deterministic mechanism — instructions are redundant.",
      c: "Post-processing is a workaround for a poorly defined schema. Correcting the schema at the source is more robust and eliminates the need for transformation.",
      d: "Accepting both formats moves the problem downstream. Every consumer of the output would need to handle both types, multiplying complexity."
    }
  },
  {
    id: 81,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent produces responses that are technically correct but with a robotic and generic tone. Customers report feeling 'processed by a machine'. The prompt says 'Be friendly and professional'. How can you improve this?",
    options: [
      { id: "a", text: "Add more emphatic instructions: 'Be VERY friendly and empathetic. Show that you care about the customer.'", correct: false },
      { id: "b", text: "Provide few-shot examples showing the exact desired tone: acknowledgment of the customer's specific problem, use of their name, reference to case details.", correct: true },
      { id: "c", text: "Switch to a larger model that has better capability for generating natural and empathetic language.", correct: false },
      { id: "d", text: "Implement a post-processor that rewrites responses in a warmer tone.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Vague instructions like 'be friendly' do not specify what friendliness looks like. Few-shot examples demonstrate the exact tone: acknowledge the specific problem, use the name, reference details, showing concrete patterns to emulate.",
    whyOthersWrong: {
      a: "More emphatic but equally vague instructions do not change the behavior. 'VERY friendly' is no more actionable than 'friendly'. The model needs concrete examples.",
      c: "Tone is not a model capability problem but a prompt specification issue. The current model can produce empathetic responses with the right examples.",
      d: "A post-processor adds latency and can introduce inconsistencies. The model should generate the correct tone directly with the right prompt."
    }
  },
  {
    id: 82,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline processes invoices in 3 steps: (1) raw extraction, (2) validation, (3) correction. In step 2, the validation detects that line_items do not sum to the total. In step 3, the model 'corrects' by changing the total to match, when the real error is a duplicate line item. How can you improve step 3?",
    options: [
      { id: "a", text: "Give the model the original document image/text along with the extraction and the failed validation, so it can verify against the source before correcting.", correct: true },
      { id: "b", text: "Implement programmatic correction rules instead of using the model for corrections.", correct: false },
      { id: "c", text: "Eliminate the correction step and simply reject extractions with failed validation.", correct: false },
      { id: "d", text: "Add instructions to the step 3 prompt: 'Never change the total, only correct the line items'.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The model needs access to the source document to make informed corrections. Without the source, it can only guess what to change. With the source, it can verify which value is incorrect and make the right correction.",
    whyOthersWrong: {
      b: "Programmatic rules cannot handle the variety of possible errors (duplicates, omissions, transpositions). The model with source access can reason about complex corrections.",
      c: "Rejecting failed extractions wastes work and reduces throughput. Most errors are correctable if the model has the right information.",
      d: "This instruction assumes the total is always correct and the line items are wrong. In reality, the error could be in any field. The model needs the source to determine which."
    }
  },
  {
    id: 83,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your team wants to use the Message Batches API to process 500 code analyses. What are the key limitations they should consider?",
    options: [
      { id: "a", text: "The batch has a limit of 100 requests and results are returned in strict order.", correct: false },
      { id: "b", text: "There are no significant limitations beyond the standard API cost.", correct: false },
      { id: "c", text: "Batches do not support multi-turn conversations, have a processing window of up to 24 hours, and each request is independent without access to results of other requests in the same batch.", correct: true },
      { id: "d", text: "Batches require all requests to use the same model and the same tools.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The Message Batches API processes independent requests (not multi-turn), has a window of up to 24 hours with no latency SLA, and each request is isolated. These limitations are key to designing the workflow correctly.",
    whyOthersWrong: {
      a: "There is no 100-request limit per batch, and results are not returned in strict order — they complete independently. custom_id is used for correlation.",
      b: "The limitations are significant: no multi-turn, up to 24h processing, 50% cost discount. Ignoring these limitations leads to incorrect designs.",
      d: "Requests within a batch can use different models and configurations. Each request is independent and fully configurable."
    }
  },
  {
    id: 84,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent produces a report with conclusions that the coordinator wants to verify before publishing. The coordinator uses the same model to self-review the report. What is the main limitation of this approach?",
    options: [
      { id: "a", text: "Self-review is perfect for verifying factual errors since the model can compare its conclusions with its sources.", correct: false },
      { id: "b", text: "The model tends to confirm its own conclusions (self-confirmation bias), making self-review insufficient for detecting systematic errors. A verification step with external sources is needed.", correct: true },
      { id: "c", text: "Self-review doubles the cost without benefit since the model always produces the same result.", correct: false },
      { id: "d", text: "Self-review only works if a different model is used for the review.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "LLMs tend to confirm their own conclusions in self-review (self-confirmation bias). The model is prone to finding its outputs 'correct' rather than detecting errors. Verification against external sources or ground-truth data is needed.",
    whyOthersWrong: {
      a: "The model does NOT compare against sources — it compares against its own prior reasoning. If the original reasoning had an error, the self-review tends to confirm the same error.",
      c: "Self-review does not always produce the same result — it can detect some errors. But its effectiveness is limited by self-confirmation bias; it is neither completely useless nor completely reliable.",
      d: "Using a different model can help but is not strictly necessary. What is needed is verification against external sources, not simply a different model."
    }
  },
  {
    id: 85,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your contract extraction needs to handle dates in varied formats ('January 15, 2024', '15/01/2024', '2024-01-15', 'the fifteenth day of January'). The schema defines date as a string with format 'date' (ISO 8601). The model frequently returns the original document format. How can you improve this?",
    options: [
      { id: "a", text: "Add instructions: 'Always convert dates to ISO 8601 format (YYYY-MM-DD)'.", correct: false },
      { id: "b", text: "Add few-shot examples showing conversion from each varied format to ISO 8601, in addition to the format instruction.", correct: true },
      { id: "c", text: "Implement post-processing with a date parsing library to normalize any date format.", correct: false },
      { id: "d", text: "Change the schema to accept any string instead of format 'date', and normalize afterward.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Format instructions combined with few-shot examples showing conversion from varied formats are the most effective strategy. The examples teach the model the specific conversion patterns it should apply.",
    whyOthersWrong: {
      a: "The instruction alone is insufficient when input formats are highly varied. 'The fifteenth day of January' requires an explicit example for the model to understand the conversion.",
      c: "Post-processing with date parsing is a valid fallback but should not be the primary strategy. The model can perform the conversion correctly with adequate examples.",
      d: "Accepting any string loses format validation. It is better to train the model to return the correct format from the start."
    }
  },
  {
    id: 86,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent uses tool_use to generate structured responses. The schema includes fields: 'greeting', 'issue_summary', 'resolution', 'next_steps'. You want the model to ALWAYS generate a structured response and never respond with free text. What configuration should you use?",
    options: [
      { id: "a", text: "tool_choice: { type: 'auto' } with instructions in the prompt asking it to always use the tool.", correct: false },
      { id: "b", text: "tool_choice: { type: 'tool', name: 'generate_response' } to force the use of the response tool on every turn.", correct: true },
      { id: "c", text: "tool_choice: { type: 'any' } to force a tool call, with only the response tool available.", correct: false },
      { id: "d", text: "Define the schema as 'required' in the tools configuration.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "tool_choice with type 'tool' and the specific name forces the model to call exactly that tool, guaranteeing structured output in every response without the possibility of free text.",
    whyOthersWrong: {
      a: "tool_choice 'auto' allows the model to choose between using the tool or responding with free text. Instructions do not guarantee it will always use the tool.",
      c: "'any' with a single available tool works but is less explicit than forcing the tool by name. If another tool is added in the future, 'any' could select the wrong one.",
      d: "'required' is not a valid option for tool schemas. Tools are marked as available, and tool_choice controls whether their use is forced."
    }
  },
  {
    id: 87,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your pipeline needs to extract data and also map each extracted datum to its location in the source document (for auditing). How should you implement claim-source mappings?",
    options: [
      { id: "a", text: "Add a 'source_page' field to each extracted field in the schema so the model indicates which page each datum came from.", correct: false },
      { id: "b", text: "Design the schema with paired fields: for each extracted datum, include a companion field that contains the exact textual quote from the source document.", correct: true },
      { id: "c", text: "Run the extraction first, then a second pass that searches for each extracted value in the original document.", correct: false },
      { id: "d", text: "Add instructions asking the model to include citations in free-text fields.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Companion fields with exact textual quotes allow verifying each extraction against the source document. This is more precise than page numbers and more structured than free text.",
    whyOthersWrong: {
      a: "A page number is insufficient for auditing: it does not allow rapid verification of the exact value. A textual quote allows direct comparison.",
      c: "A second search pass is costly and can fail if the extracted value was normalized (e.g., date converted to ISO). The quote in the same pass is more reliable.",
      d: "Citations in free text have no structure for programmatic processing. Structured companion fields allow automating the verification."
    }
  },
  {
    id: 88,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "Your automated PR review has a multi-pass pipeline: Pass 1 reviews bugs, Pass 2 reviews security, Pass 3 reviews style. But Pass 3 frequently contradicts corrections suggested by Pass 1. How can you resolve this?",
    options: [
      { id: "a", text: "Execute all passes in parallel so they do not influence each other.", correct: false },
      { id: "b", text: "Have each subsequent pass receive the findings from previous passes as context, with instructions not to contradict findings of higher priority.", correct: true },
      { id: "c", text: "Consolidate all 3 passes into a single pass to avoid contradictions.", correct: false },
      { id: "d", text: "Add a Pass 4 for reconciliation that resolves contradictions between the 3 previous passes.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Subsequent passes should receive previous findings as context with explicit prioritization. This prevents contradictions while maintaining the benefit of focused attention from each pass.",
    whyOthersWrong: {
      a: "Parallel passes WITHOUT coordination maximize contradictions. Each pass operates without knowledge of the others, producing conflicting recommendations.",
      c: "Consolidating into a single pass loses the benefit of focused attention. The reason for multi-pass is that each pass concentrates deeply on a specific aspect.",
      d: "A reconciliation pass adds cost and complexity. It is better to prevent contradictions upstream than to resolve them downstream."
    }
  },
  {
    id: 89,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction schema has an 'effective_date' field. Some documents have absolute dates ('March 15, 2024') and others have relative dates ('30 days after signing'). How should you handle both cases?",
    options: [
      { id: "a", text: "Define effective_date as a string and let the model return the text as it appears in the document.", correct: false },
      { id: "b", text: "Define effective_date as an object with fields: { absolute_date: string|null, relative_expression: string|null, is_relative: boolean } that captures both semantics.", correct: true },
      { id: "c", text: "Ask the model to always calculate and return an absolute date, estimating the signing date for relative references.", correct: false },
      { id: "d", text: "Define two separate fields: 'absolute_date' and 'relative_date', and leave only one populated.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "An object that captures both semantics preserves complete information without fabrication. The is_relative flag tells the consumer which type of date it has, and both nullable fields allow representing any case.",
    whyOthersWrong: {
      a: "Returning raw text loses structure. Downstream consumers would need to parse the text to determine whether it is relative or absolute, duplicating logic.",
      c: "Estimating the signing date to calculate an absolute date is data fabrication. The model does not know when the contract was signed and would produce an invented date.",
      d: "Two separate fields without a type indicator require the consumer to infer which is populated. An object with is_relative is more explicit and self-documenting."
    }
  },
  {
    id: 90,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Multi-Agent Research System",
    question: "Your research agent needs to generate a report with findings and their evidence level. You want to prevent the model from presenting speculation as established facts. How should you design the output schema?",
    options: [
      { id: "a", text: "Add instructions asking the model to use hedge words ('possibly', 'might') for unverified claims.", correct: false },
      { id: "b", text: "Define a schema with fields: { claim: string, evidence_level: enum['established','contested','speculative'], sources: string[], methodology_notes: string|null } for each finding.", correct: true },
      { id: "c", text: "Limit the output to only established facts, omitting any claim with insufficient evidence.", correct: false },
      { id: "d", text: "Ask the model to assign a confidence percentage (0-100%) to each finding.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A schema with evidence_level as an enum forces the model to explicitly categorize each claim. Consumers can filter by evidence level, and the structure prevents speculation from being presented as fact.",
    whyOthersWrong: {
      a: "Hedge words in free text are inconsistent and difficult to process programmatically. A structured enum is more reliable and processable.",
      c: "Omitting claims with insufficient evidence loses valuable information. A 'contested' or 'speculative' finding can be relevant if presented with the appropriate context.",
      d: "Self-reported confidence percentages from LLMs are poorly calibrated. A categorical enum is more useful and less prone to false precision."
    }
  },

  // ===== DOMAIN 5: Context Management & Reliability (15%) — Questions 91-100 =====
  {
    id: 91,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent handles a conversation where the customer first reports a duplicate charge, then asks about shipping on another order, and finally returns to the duplicate charge topic referencing a detail they mentioned at the beginning. The agent does not remember the detail. What is the most appropriate context management technique?",
    options: [
      { id: "a", text: "Increase the context window so the entire conversation fits without compression.", correct: false },
      { id: "b", text: "Maintain a persistent 'case facts' block that is updated with key data from each issue and injected at the beginning of each prompt.", correct: true },
      { id: "c", text: "Ask the customer to repeat the relevant information when they change topics.", correct: false },
      { id: "d", text: "Use progressive summarization to condense the conversation and maintain the most recent details.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A persistent 'case facts' block extracts and structures key transactional data from each issue. By being injected at the beginning of each prompt, it remains visible regardless of how much the conversation grows.",
    whyOthersWrong: {
      a: "A larger context window does not prevent the lost-in-the-middle effect. Early details can still be lost in a long conversation, regardless of the window size.",
      c: "Asking the customer to repeat information is a terrible user experience and demonstrates agent incompetence.",
      d: "Progressive summarization is exactly what causes the loss of numeric and transactional details. Condensing 'duplicate charge of $47.50 from March 3' to 'customer reported duplicate charge' loses critical information."
    }
  },
  {
    id: 92,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research agent is processing a 50-page academic paper. The key findings are on pages 5, 23, and 47. The agent's conclusions only reflect information from pages 5 and 47. What phenomenon causes this?",
    options: [
      { id: "a", text: "The model has a bug that causes skipping of intermediate pages.", correct: false },
      { id: "b", text: "The lost-in-the-middle effect causes the model to pay less attention to content in the middle zone of long inputs, losing the findings from page 23.", correct: true },
      { id: "c", text: "The context window is not sufficient for 50 pages and the middle content is truncated.", correct: false },
      { id: "d", text: "The model processes documents from start to finish and attention fatigue causes gradual degradation toward the end.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The lost-in-the-middle effect is a documented phenomenon where transformers pay more attention to the beginning and end of long inputs. Content in the middle zone receives less attention, explaining the loss of page 23.",
    whyOthersWrong: {
      a: "It is not a bug but a known phenomenon of transformer architecture. It is predictable and mitigable with proper context design.",
      c: "If content were truncated, page 47 (the end) would also be lost. The fact that pages 5 and 47 are captured correctly indicates the window is sufficient.",
      d: "If it were linear fatigue, page 47 would be the most affected, not page 23. The U-shaped pattern (good attention at beginning and end, poor in the middle) is the signature of the lost-in-the-middle effect."
    }
  },
  {
    id: 93,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "Your development agent works on a refactor that requires tracking 15 modified files and their interdependencies. After the session, another developer needs to continue the work. What is the best handoff strategy?",
    options: [
      { id: "a", text: "Export the complete Claude Code session history so the second developer can import it.", correct: false },
      { id: "b", text: "Have the agent write a scratchpad file with the current refactor state: modified files, pending changes, decisions made, and next steps.", correct: true },
      { id: "c", text: "The second developer can simply continue where it left off using git log to understand the changes.", correct: false },
      { id: "d", text: "Create a branch with the partial changes and add a draft PR with a detailed description.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A scratchpad file persists the refactor state in a structured way: modified files, decisions, pending items. The second developer loads it into their session and Claude has immediate context to continue.",
    whyOthersWrong: {
      a: "The complete session history is voluminous and contains a lot of noise (exploration, dead ends). A summarized scratchpad is much more efficient.",
      c: "Git log shows WHAT changed but not WHY or WHAT IS LEFT. The architectural decisions and pending work plan are not in git.",
      d: "A draft PR is useful for review but not for continuing work. It does not capture the internal refactor decisions or the next steps that Claude needs to know."
    }
  },
  {
    id: 94,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has escalation criteria based on sentiment analysis: escalate if sentiment_score < 0.3. The agent does not escalate a case where the customer uses sarcastic colloquial language ('Wow, that is fantastic, another extra charge, just what I needed') with sentiment_score = 0.7. The sarcasm is not detected. What is the fundamental problem?",
    options: [
      { id: "a", text: "The sentiment analysis model needs fine-tuning to detect sarcasm.", correct: false },
      { id: "b", text: "Sentiment analysis is an unreliable proxy for escalation decisions. Criteria based on objective case factors (amount, number of previous interactions, issue type) are needed in addition to sentiment signals.", correct: true },
      { id: "c", text: "The 0.3 threshold is too low. It should be raised to 0.5 to capture more cases.", correct: false },
      { id: "d", text: "A separate sarcasm detection module should be added before the sentiment analysis.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Sentiment analysis is an unreliable proxy for escalation because it fails with sarcasm, indirect communication, and cultural variations. Escalation criteria should be based on objective case factors, not just sentiment.",
    whyOthersWrong: {
      a: "Even with fine-tuning, sentiment analysis will still fail with subtle forms of communication. The fundamental problem is depending on an unreliable proxy, not improving the proxy.",
      c: "Adjusting the threshold does not solve the sarcasm problem. At 0.5, other genuinely positive texts would be escalated unnecessarily while sarcasm would still go undetected.",
      d: "Adding sarcasm detection is additional complexity that does not address the fundamental problem: sentiment is not the right criterion for escalation."
    }
  },
  {
    id: 95,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research pipeline processes temporal data: economic statistics, current regulations, and market projections. A report generated 3 months ago cites a regulation that has since been modified. How can you prevent stale data in reports?",
    options: [
      { id: "a", text: "Add timestamps to each datum and implement time-to-live (TTL) policies that mark data as potentially stale after a configurable period.", correct: true },
      { id: "b", text: "Re-execute the entire research pipeline every time someone accesses a report to ensure freshness.", correct: false },
      { id: "c", text: "Add a disclaimer at the beginning of the report indicating the generation date.", correct: false },
      { id: "d", text: "Cache the sources permanently since regulatory data changes infrequently.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "TTL policies with timestamps allow managing data freshness at a granular level. Regulatory data might have a 30-day TTL while economic data has a 7-day TTL, proactively marking which sections need updating.",
    whyOthersWrong: {
      b: "Re-executing the entire pipeline is extremely costly and slow. Only data with expired TTLs needs a refresh, not the entire research.",
      c: "A disclaimer informs the reader but does not prevent the use of stale data. The system should proactively detect and flag stale data, not just warn that it might exist.",
      d: "Regulations change frequently enough to cause significant errors. Permanent caching is the opposite of what is needed for regulatory data."
    }
  },
  {
    id: 96,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your extraction system needs to handle documents where the same entity appears with different names ('IBM', 'International Business Machines', 'Big Blue'). Without entity resolution, the extracted data creates duplicate records. What is the most robust approach?",
    options: [
      { id: "a", text: "Add instructions to the prompt asking the model to normalize entity names to a canonical form.", correct: false },
      { id: "b", text: "Implement entity resolution post-extraction with a lookup table of known aliases plus fuzzy matching for unlisted variations.", correct: true },
      { id: "c", text: "Give the model a list of all known entities and their aliases in the prompt so it normalizes during extraction.", correct: false },
      { id: "d", text: "Accept the duplicates and resolve them manually in a later review.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Entity resolution post-extraction with lookup tables and fuzzy matching is deterministic and maintainable. It captures known aliases and unexpected variations without depending on the model for probabilistic normalization.",
    whyOthersWrong: {
      a: "Probabilistic normalization by the model is inconsistent. 'Big Blue' might not resolve to 'IBM' without explicit context, and the model might normalize inconsistently across documents.",
      c: "An entity list in the prompt consumes significant tokens and does not scale. With thousands of entities and aliases, the prompt becomes unmanageable.",
      d: "Manual resolution does not scale and is prone to human error. Post-extraction automation handles the volume more reliably."
    }
  },
  {
    id: 97,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent operates 24/7 and the process occasionally restarts (deploys, crashes). A customer in the middle of a conversation returns and the agent has no context. The crash recovery state manifest shows: issue_type: 'billing_dispute', customer_id: 'C-1234', amount: '$89.99', step: 'awaiting_documentation'. What is the correct way to resume the session?",
    options: [
      { id: "a", text: "Inject the state manifest into the new session's system prompt and continue from the 'awaiting_documentation' step without mentioning the interruption to the customer.", correct: false },
      { id: "b", text: "Inject the state manifest into the system prompt, acknowledge to the customer that there was an interruption, confirm the case data, and resume from the pending step.", correct: true },
      { id: "c", text: "Ask the customer to repeat their problem from the beginning to ensure accuracy.", correct: false },
      { id: "d", text: "Reload the entire message history from the previous session to restore complete context.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The state manifest provides sufficient context to continue. Acknowledging the interruption and confirming data with the customer demonstrates transparency and allows correcting any stale data before proceeding.",
    whyOthersWrong: {
      a: "Continuing without acknowledging the interruption can confuse the customer if they notice a change in tone or style. Transparency builds trust.",
      c: "Asking them to repeat everything is a poor experience when we already have the data in the manifest. We only need to confirm, not re-collect.",
      d: "Reloading the entire history consumes excessive tokens and may contain obsolete information. The state manifest is a more efficient and up-to-date summary."
    }
  },
  {
    id: 98,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research system produces a 20-page report. At the end, the conclusions do not reflect key findings that the agent discovered at the beginning of the research (they are in the first tool results of the history). How can you prevent this loss?",
    options: [
      { id: "a", text: "Have the agent write conclusions incrementally, updating a conclusions draft after each research phase.", correct: false },
      { id: "b", text: "Use a scratchpad file where the agent records key findings as it discovers them. When generating conclusions, read the scratchpad instead of depending on the conversation history.", correct: true },
      { id: "c", text: "Use /compact periodically to keep the context manageable.", correct: false },
      { id: "d", text: "Run a second conclusions generation pass with all findings re-injected into the context.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A scratchpad file persists key findings outside the conversation history. When generating conclusions, the agent reads the scratchpad fresh, ensuring all findings are equally accessible regardless of when they were discovered.",
    whyOthersWrong: {
      a: "Incremental conclusions are subject to the same problem: early draft versions get lost in the history as the research progresses.",
      c: "/compact compresses the history but compression loses specific details. Numeric findings and textual citations are the first to be lost in compression.",
      d: "Re-injecting all findings in a second pass is costly in tokens and duplicates the work. A scratchpad maintained during research is more efficient."
    }
  },
  {
    id: 99,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline has a validation step that rejects 15% of extractions due to inconsistencies. 80% of these rejections are for a specific field ('tax_amount') that frequently does not match the subtotal and tax rate. What is the most effective strategy?",
    options: [
      { id: "a", text: "Add a computed 'expected_tax' field to the schema that the model must calculate and compare with the extracted tax_amount.", correct: false },
      { id: "b", text: "Implement a validation-retry loop specific to tax_amount: when validation fails, re-execute the extraction of the problematic field with the specific error as context.", correct: true },
      { id: "c", text: "Remove tax_amount from the schema and calculate it programmatically from the subtotal and tax rate.", correct: false },
      { id: "d", text: "Increase the tolerance threshold for the tax_amount validation (e.g., accept 5% difference).", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A validation-retry loop focused on the problematic field is efficient: it only reprocesses the field that failed, with the specific error as context so the model can correct its extraction.",
    whyOthersWrong: {
      a: "Asking the model to calculate and compare does not solve the problem: if the model extracts tax_amount incorrectly, it will also incorrectly calculate expected_tax using the same wrong data.",
      c: "Calculating tax_amount programmatically assumes it is always subtotal x rate, but in reality taxes can include exceptions, discounts, and variable per-item rates.",
      d: "Increasing the tolerance threshold accepts real errors. A 5% difference on a $100,000 subtotal means $5,000 of error — unacceptable for financial data."
    }
  },
  {
    id: 100,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "Your development agent is in a long session and you need it to analyze a specific component without losing the general project context it already has. The component analysis is verbose (2000+ lines of code). What is the best strategy?",
    options: [
      { id: "a", text: "Use Read to load the complete component into the current session and analyze it directly.", correct: false },
      { id: "b", text: "Use context:fork to delegate the component analysis to an isolated subagent that returns only a summary, preserving the lean context of the main session.", correct: true },
      { id: "c", text: "Use /compact before loading the component to make space in the context.", correct: false },
      { id: "d", text: "Split the component into small sections and analyze each one separately in the current session.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "context:fork delegates the verbose analysis to an isolated subagent. The subagent reads and analyzes the 2000+ lines without polluting the main session, returning only a concise summary that preserves the general project context.",
    whyOthersWrong: {
      a: "Loading 2000+ lines into the current session displaces general project context the agent already accumulated. The verbose analysis would pollute the main session.",
      c: "/compact compresses the history but sacrifices details. It is better to preserve the current context intact and delegate the verbose analysis to a subagent.",
      d: "Analyzing sections separately still consumes tokens from the main session and the agent loses the holistic view of the complete component."
    }
  }
];
