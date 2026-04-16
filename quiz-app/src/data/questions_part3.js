export const questionsPart3 = [
  // ===== DOMAIN 1: Agentic Architecture & Orchestration (27%) — Questions 101-128 =====
  {
    id: 101,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator decomposes a research topic into 5 subtasks and delegates them to subagents. Subagent #3 returns findings that contradict subagent #1's conclusions. The coordinator currently passes all findings directly to the synthesis agent without review. What architectural change best addresses this?",
    options: [
      { id: "a", text: "Add a validation subagent that checks all findings for internal consistency before synthesis begins.", correct: false },
      { id: "b", text: "Have the coordinator perform an iterative refinement loop: detect contradictions in returned findings and re-delegate to the conflicting subagents with each other's conclusions for reconciliation.", correct: true },
      { id: "c", text: "Instruct the synthesis agent to flag contradictions in its output and let the human reviewer resolve them.", correct: false },
      { id: "d", text: "Run all subagents sequentially so each one can see the previous agent's findings and avoid contradictions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "An iterative refinement loop where the coordinator detects contradictions and re-delegates to conflicting subagents allows the system to self-correct. The coordinator re-invokes the subagents with the contradicting evidence, letting them reconcile or clarify their positions before synthesis.",
    whyOthersWrong: {
      a: "Adding a separate validation subagent increases complexity without leveraging the domain expertise of the original subagents who produced the findings. The agents who did the research are best positioned to reconcile their own contradictions.",
      c: "Deferring contradiction resolution to synthesis or human review is reactive, not proactive. The synthesis agent lacks the research context to resolve factual contradictions, and human review defeats the purpose of automation.",
      d: "Sequential execution eliminates parallelism (a key benefit of multi-agent systems) and introduces ordering bias. Earlier agents' conclusions unduly influence later ones rather than allowing independent analysis."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.2",
        quote: "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient."
      }
  },
  {
    id: 102,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent handles escalations to human agents. Currently it dumps the entire conversation history into a handoff note. Human agents report spending 3-4 minutes reading through irrelevant turns before understanding the issue. What is the best approach for handoff summaries?",
    options: [
      { id: "a", text: "Limit the handoff note to the last 5 turns of conversation to reduce reading time.", correct: false },
      { id: "b", text: "Generate a structured handoff summary containing: customer identity, verified issue, steps already taken, current blocker, and recommended next action.", correct: true },
      { id: "c", text: "Include the full conversation but add bold formatting to the most important messages so human agents can skim.", correct: false },
      { id: "d", text: "Have the agent ask the customer to re-explain their issue in a single message that becomes the handoff note.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Structured handoff summaries distill the conversation into actionable fields that a human agent can scan in seconds. This preserves all critical context (identity, issue, attempted resolutions, blocker) without forcing the human to reconstruct it from raw conversation.",
    whyOthersWrong: {
      a: "Truncating to the last 5 turns loses critical early context like customer verification, initial problem description, and early troubleshooting steps that were already attempted.",
      c: "Formatting the full conversation still requires the human agent to read through it. The problem is volume, not presentation. A structured summary eliminates irrelevant content entirely.",
      d: "Asking the customer to re-explain their issue is a poor experience. The customer already explained the issue and expects the handoff to preserve that context. This also loses the agent's diagnostic work."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.4",
        quote: "Compiling structured handoff summaries (customer ID, root cause, refund amount, recommended action) when escalating to human agents who lack access to the conversation transcript."
      }
  },
  {
    id: 103,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "You need to compare three different analytical approaches for a market research task. Each approach requires different tool configurations and system prompts. Using Claude Code, what is the most efficient architecture?",
    options: [
      { id: "a", text: "Run three sequential sessions, each with a different configuration, and manually compare outputs at the end.", correct: false },
      { id: "b", text: "Use fork_session to spawn three parallel subagents from the same starting context, each configured for a different analytical approach, then compare their results.", correct: true },
      { id: "c", text: "Create a single agent with all three configurations and instruct it to try each approach one at a time within the same conversation.", correct: false },
      { id: "d", text: "Use tool_choice to force the agent through each analytical approach in a predetermined sequence within one session.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "fork_session creates parallel subagents from the same starting context, which is ideal for comparing approaches. Each fork gets the same baseline but can diverge independently, and results can be compared by the parent session.",
    whyOthersWrong: {
      a: "Sequential sessions lose the shared starting context and require manual orchestration. fork_session provides automatic parallelism and a natural comparison point from the same baseline.",
      c: "A single agent trying three approaches sequentially suffers from context contamination — the first approach's reasoning influences the second and third, preventing truly independent analysis.",
      d: "tool_choice forces specific tool selection but doesn't address the need for independent analytical approaches. Each approach requires different reasoning, not just different tools."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.7",
        quote: "fork_session for creating independent branches from a shared analysis baseline to explore divergent approaches... Using fork_session to create parallel exploration branches (e.g., comparing two testing strategies or refactoring approaches from a shared codebase analysis)."
      }
  },
  {
    id: 104,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "You resume a Claude Code session that was paused 2 hours ago. During the pause, a teammate merged a PR that refactored the authentication module you were working on. The resumed session's context still references the old file structure. What is the best practice?",
    options: [
      { id: "a", text: "Start a completely new session to avoid any stale context from the old session.", correct: false },
      { id: "b", text: "Resume the session and immediately inform Claude about the specific files that changed, asking it to re-read the affected files before continuing work.", correct: true },
      { id: "c", text: "Resume the session and trust that Claude Code will automatically detect file changes when it tries to edit them.", correct: false },
      { id: "d", text: "Run git pull in a separate terminal and then resume the session without any additional context, since Claude Code monitors the filesystem.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When resuming a session after external changes, you should explicitly inform the agent about what changed and have it re-read affected files. This updates the agent's context with current file state while preserving the valuable conversation history from the original session.",
    whyOthersWrong: {
      a: "Starting a new session discards all the context, decisions, and progress from the original session. Resuming with updated information preserves that valuable context.",
      c: "Claude Code does not automatically detect file changes between sessions. It will work with its cached understanding of the files, potentially generating patches against stale content that fail to apply.",
      d: "Running git pull updates local files but does not update the agent's in-context understanding. Without explicitly telling the agent what changed, it will still reason based on its stale mental model of the codebase."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.7",
        quote: "The importance of informing the agent about changes to previously analyzed files when resuming sessions after code modifications... Informing a resumed session about specific file changes for targeted re-analysis rather than requiring full re-exploration."
      }
  },
  {
    id: 105,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your research system uses a hub-and-spoke architecture where the coordinator delegates all tasks. You notice that the search agent and the analysis agent frequently need to exchange intermediate results, but every exchange requires a round-trip through the coordinator, adding 40% latency. What should you do?",
    options: [
      { id: "a", text: "Switch to a fully peer-to-peer architecture where all agents communicate directly without a coordinator.", correct: false },
      { id: "b", text: "Keep the hub-and-spoke architecture but allow a scoped direct channel between the search and analysis agents for intermediate data exchange, while the coordinator retains oversight of task delegation.", correct: true },
      { id: "c", text: "Merge the search and analysis agents into a single agent to eliminate the communication overhead entirely.", correct: false },
      { id: "d", text: "Add a message queue between all agents so communication is asynchronous and the coordinator doesn't bottleneck.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A hybrid approach adds a scoped direct channel between the two frequently-communicating agents while preserving the coordinator's oversight role. This eliminates unnecessary round-trips without losing the architectural benefits of centralized coordination.",
    whyOthersWrong: {
      a: "A fully peer-to-peer architecture removes centralized oversight entirely, making it harder to track progress, handle failures, and ensure task completion. The coordinator provides valuable orchestration that shouldn't be discarded.",
      c: "Merging agents eliminates separation of concerns. The search and analysis agents have different tool sets and specializations. Combining them creates a bloated agent with too many tools, degrading selection accuracy.",
      d: "An asynchronous message queue adds infrastructure complexity and doesn't solve the fundamental problem — the coordinator is still in the communication path. The issue is the routing topology, not the communication mechanism."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.2 / 2.3",
        quote: "Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator."
      }
  },
  {
    id: 106,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent uses adaptive decomposition to break customer issues into subtasks. For a complex billing dispute involving 3 accounts, the agent initially creates 2 subtasks but mid-execution discovers a 4th linked account. What should the adaptive decomposition strategy do?",
    options: [
      { id: "a", text: "Complete the current 2 subtasks, then start a new decomposition from scratch incorporating the 4th account.", correct: false },
      { id: "b", text: "Pause execution, re-decompose the entire problem with the new information, and restart all subtasks including already-completed ones.", correct: false },
      { id: "c", text: "Allow the coordinator to dynamically add a new subtask for the 4th account while the existing subtasks continue, then reconcile all results at synthesis.", correct: true },
      { id: "d", text: "Flag the discovery to the human operator and wait for manual re-decomposition before proceeding.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Adaptive decomposition means the coordinator can modify the task plan mid-execution. When new information surfaces, the coordinator should dynamically add subtasks without discarding completed work. This is the key advantage of adaptive over fixed decomposition.",
    whyOthersWrong: {
      a: "Waiting for current subtasks to finish before addressing the new account introduces unnecessary delay. Adaptive decomposition should act on new information immediately.",
      b: "Restarting already-completed subtasks wastes compute and time. The existing results are still valid; only additional work is needed for the newly discovered account.",
      d: "Deferring to a human operator defeats the purpose of adaptive decomposition. The system should handle routine plan modifications autonomously; human escalation should be reserved for ambiguous situations."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.6",
        quote: "The value of adaptive investigation plans that generate subtasks based on what is discovered at each step... Decomposing open-ended tasks... by first mapping structure, identifying high-impact areas, then creating a prioritized plan that adapts as dependencies are discovered."
      }
  },
  {
    id: 107,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "You have a long-running code refactoring session in Claude Code. After 45 minutes, you need to switch to a bug fix on another branch. The refactoring is 60% complete. Should you use a new session or resume the current one later?",
    options: [
      { id: "a", text: "Use a new session for the bug fix because context from the refactoring would confuse the bug fix work. Resume the refactoring session afterward.", correct: true },
      { id: "b", text: "Continue in the same session and ask Claude to switch context to the bug fix, since it already understands the codebase.", correct: false },
      { id: "c", text: "Start a new session for both the bug fix and the remaining refactoring, since 45 minutes of context is too stale to be useful.", correct: false },
      { id: "d", text: "Pause and export the refactoring session state to a file, start a new session for the bug fix, then import the state into a third session.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Session context isolation is important: the refactoring context (partially modified files, architectural decisions in progress) would pollute the bug fix session. A new session provides a clean context. The refactoring session can be resumed afterward with its full history intact.",
    whyOthersWrong: {
      b: "Continuing in the same session mixes two unrelated tasks. The refactoring context (60% done modifications, pending changes) creates noise for the bug fix and increases the chance of errors in both tasks.",
      c: "The 45-minute refactoring session contains valuable context: decisions made, files already modified, the plan for remaining work. Discarding it forces re-derivation of all that context. Session resume preserves it.",
      d: "Claude Code supports native session resume — there's no need to manually export and import state. This adds unnecessary complexity and risks losing context that session resume handles automatically."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.6 / 1.7",
        quote: "Session context isolation: why the same Claude session that generated code is less effective at reviewing its own changes compared to an independent review instance."
      }
  },
  {
    id: 108,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator spawns 4 parallel subagents in a single API response using parallel tool calls. One subagent fails due to a rate limit error. The other 3 complete successfully. What is the best recovery strategy?",
    options: [
      { id: "a", text: "Re-invoke all 4 subagents to ensure consistency, since partial results from different execution times may be incompatible.", correct: false },
      { id: "b", text: "Retry only the failed subagent with exponential backoff, then merge its results with the 3 successful results at synthesis.", correct: true },
      { id: "c", text: "Proceed with synthesis using only the 3 successful results and note the gap in the final output.", correct: false },
      { id: "d", text: "Spawn a replacement subagent with expanded scope to cover both the failed task and additional verification of the 3 successful results.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Rate limit errors are transient. The correct recovery is to retry only the failed subagent (not waste successful work) with backoff, then merge all results. The 3 successful results are independent and valid regardless of when the 4th completes.",
    whyOthersWrong: {
      a: "Re-invoking all 4 wastes the successful work of 3 subagents. Since each subagent operates on an independent subtask, there is no consistency dependency requiring simultaneous execution.",
      c: "Proceeding with incomplete results when recovery is straightforward (transient error with retry) produces a knowingly incomplete output. The missing subtask was part of the plan for a reason.",
      d: "Expanding the replacement subagent's scope beyond the failed task adds unnecessary complexity. The 3 successful results don't need verification — they completed normally. Keep the retry scoped to exactly what failed."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.2",
        quote: "Implementing local error recovery within subagents for transient failures, propagating to the coordinator only errors that cannot be resolved locally along with partial results and what was attempted."
      }
  },
  {
    id: 109,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent currently uses fixed decomposition: every billing inquiry follows the same 4-step sequence regardless of complexity. Simple balance checks (60% of tickets) complete all 4 steps in 8 seconds, but only need steps 1 and 3. What architectural pattern best optimizes this?",
    options: [
      { id: "a", text: "Add a complexity classifier that routes simple queries to a lightweight agent with only 2 tools, and complex queries to the full 4-step agent.", correct: false },
      { id: "b", text: "Switch to adaptive decomposition where the agent evaluates the query and dynamically determines which steps are needed, skipping unnecessary ones.", correct: true },
      { id: "c", text: "Pre-compute responses for common balance check queries and return cached results without invoking the agent.", correct: false },
      { id: "d", text: "Parallelize all 4 steps so they execute simultaneously, reducing total latency regardless of which steps are actually needed.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Adaptive decomposition lets the agent reason about which steps are needed for each specific query. For simple balance checks, it would determine that only steps 1 and 3 are relevant, cutting execution time and cost. For complex queries, all 4 steps remain available.",
    whyOthersWrong: {
      a: "A complexity classifier adds a separate classification step and creates two distinct code paths to maintain. Adaptive decomposition achieves the same result within a single agent architecture by letting the LLM reason about what's needed.",
      c: "Pre-computed responses are brittle and only work for exact matches. Customer queries vary in phrasing and context. This also doesn't help with the 40% of tickets that are not simple balance checks.",
      d: "Parallelizing all 4 steps means executing unnecessary steps (2 and 4 for simple queries), wasting compute. It also introduces complexity for steps with data dependencies where step N needs step N-1's output."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.6",
        quote: "When to use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings... The value of adaptive investigation plans that generate subtasks based on what is discovered at each step."
      }
  },
  {
    id: 110,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your multi-agent system uses a coordinator that delegates to 3 specialist subagents. You observe that the coordinator spends 35% of its token budget re-explaining the original research objective to each subagent. What is the most effective optimization?",
    options: [
      { id: "a", text: "Shorten the research objective description in the coordinator's prompt to reduce tokens.", correct: false },
      { id: "b", text: "Include the research objective in each subagent's system prompt so the coordinator doesn't need to repeat it in each delegation message.", correct: true },
      { id: "c", text: "Have the coordinator delegate all 3 tasks in a single tool call with one shared context block instead of 3 separate calls.", correct: false },
      { id: "d", text: "Store the research objective in an MCP resource that subagents can fetch independently, removing it from the coordinator's context entirely.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "By placing the shared research objective in each subagent's system prompt (which is set once at initialization), the coordinator only needs to provide task-specific delegation instructions. This eliminates redundant repetition of the objective in each delegation message.",
    whyOthersWrong: {
      a: "Shortening the objective risks losing critical context that subagents need to do their work correctly. The problem isn't the length of the objective — it's the repetition across delegation calls.",
      c: "Subagents are typically invoked as separate API calls or tool uses, each requiring their own context. Combining into a single tool call changes the architecture and may not be supported by the orchestration framework.",
      d: "Having subagents fetch the objective via MCP adds an extra tool call per subagent and doesn't actually save tokens — the objective still enters each subagent's context. It just adds latency from the fetch."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.3",
        quote: "That subagent context must be explicitly provided in the prompt—subagents do not automatically inherit parent context or share memory between invocations... The AgentDefinition configuration including descriptions, system prompts, and tool restrictions for each subagent type."
      }
  },
  {
    id: 111,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "Your Claude Code session is generating a complex microservice. After producing the initial implementation, you want Claude to iteratively refine the code by running tests, identifying failures, fixing them, and re-running tests. What orchestration pattern best describes this?",
    options: [
      { id: "a", text: "A coordinator-subagent pattern where separate agents handle test execution and code fixing.", correct: false },
      { id: "b", text: "A standard agentic loop where Claude uses stop_reason to determine whether to continue (tool_use) or stop (end_turn) after each test-fix cycle.", correct: true },
      { id: "c", text: "A pipeline pattern where test results are passed through a chain of specialized fix agents in sequence.", correct: false },
      { id: "d", text: "A fan-out pattern where multiple fix attempts run in parallel and the best result is selected.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Test-driven iteration in Claude Code is a natural agentic loop: Claude runs tests (tool_use), reads results, fixes code (tool_use), re-runs tests, and continues until tests pass (end_turn). The stop_reason drives the loop — no multi-agent complexity is needed.",
    whyOthersWrong: {
      a: "A coordinator-subagent pattern is over-engineered for this use case. A single Claude Code session with access to test and edit tools handles the iterative cycle naturally within one agentic loop.",
      c: "A pipeline pattern implies a linear chain where each stage hands off to the next. Test-driven iteration is cyclical (test -> fix -> test -> fix) and doesn't fit a linear pipeline model.",
      d: "Running multiple fix attempts in parallel is wasteful because each test failure typically has a specific cause that needs targeted fixing. Parallel guessing is less reliable than Claude's sequential reasoning about what went wrong."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Tool Use (How Tool Use Works)",
        quote: "The canonical shape is a while loop keyed on stop_reason... while stop_reason == 'tool_use', execute the tools and continue the conversation. The loop exits on any other stop reason ('end_turn', 'max_tokens', 'stop_sequence', or 'refusal')."
      }
  },
  {
    id: 112,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your research system's synthesis agent receives findings from 5 subagents but produces a report that simply concatenates their sections without identifying cross-cutting themes. The coordinator does not review the synthesis output. What is the root cause?",
    options: [
      { id: "a", text: "The synthesis agent's prompt lacks explicit instructions to identify cross-cutting themes and integrate findings rather than concatenate them.", correct: false },
      { id: "b", text: "The coordinator should implement an iterative refinement loop that reviews the synthesis output and re-delegates to the synthesis agent with specific instructions to improve integration when the output is merely concatenated.", correct: true },
      { id: "c", text: "The subagents should tag their findings with theme labels so the synthesis agent can group them automatically.", correct: false },
      { id: "d", text: "The synthesis agent needs access to the original research objective so it can understand how to weave findings together.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The root cause is that the coordinator does no quality review of synthesis output. An iterative refinement loop where the coordinator evaluates synthesis quality and re-delegates with specific improvement instructions ensures the output meets standards before being returned.",
    whyOthersWrong: {
      a: "Better prompting for the synthesis agent may help, but without the coordinator checking output quality, there's no guarantee the agent follows those instructions. The architectural gap is the missing feedback loop, not just the prompt.",
      c: "Theme tagging by subagents shifts the integration burden to the wrong place. Subagents research independently and cannot predict which themes will cut across all findings. Integration is inherently the synthesis agent's job.",
      d: "Access to the research objective is necessary but not sufficient. The problem isn't missing information — it's missing quality control. Even with the objective, the synthesis agent might still concatenate without the coordinator enforcing quality standards."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.2",
        quote: "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient."
      }
  },
  {
    id: 113,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support system handles 3 product lines with different escalation policies. Currently a single coordinator agent handles all products. Escalation accuracy is 92% for Product A (simple policy), 78% for Product B (moderate policy), and 61% for Product C (complex policy with exceptions). What architectural change best addresses this?",
    options: [
      { id: "a", text: "Add more few-shot examples for Product C escalation scenarios to the coordinator's prompt.", correct: false },
      { id: "b", text: "Create separate specialist subagents for each product's escalation logic, with the coordinator routing based on product type.", correct: true },
      { id: "c", text: "Increase the coordinator's context window to fit all three escalation policies simultaneously with full detail.", correct: false },
      { id: "d", text: "Implement a decision tree that handles escalation logic programmatically, removing it from the LLM entirely.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The accuracy degradation correlates with policy complexity, suggesting the single agent is overloaded with too many rules. Specialist subagents each focus on one product's escalation policy, reducing per-agent complexity and improving accuracy for all products, especially the complex ones.",
    whyOthersWrong: {
      a: "Few-shot examples for Product C may help incrementally but don't address the fundamental issue that a single agent is managing three different policy sets. As policies evolve, the problem will recur.",
      c: "More context window doesn't improve reasoning accuracy. The issue isn't that policies are truncated — it's that the agent must reason across three different policy frameworks simultaneously, which increases decision complexity.",
      d: "A programmatic decision tree works for simple, deterministic rules but cannot handle the nuanced exception-based logic in Product C's complex policy. LLM reasoning is needed for judgment calls in exceptions."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.3",
        quote: "The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity... Scoped tool access: giving agents only the tools needed for their role."
      }
  },
  {
    id: 114,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator spawns subagents for parallel research on 4 industries. Each subagent should return structured data: a summary, 3-5 key findings, and source citations. Currently, subagents return free-form text that the synthesis agent struggles to parse. How should you fix this?",
    options: [
      { id: "a", text: "Add a post-processing step that uses regex to extract structured data from the free-form text output.", correct: false },
      { id: "b", text: "Define a structured output schema for subagent responses and include it in each subagent's system prompt, validating the response against the schema before passing to synthesis.", correct: true },
      { id: "c", text: "Train the synthesis agent to handle both structured and unstructured inputs gracefully.", correct: false },
      { id: "d", text: "Have the coordinator summarize each subagent's free-form output into structured format before passing to synthesis.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Defining a structured output schema at the subagent level ensures consistent, parseable data. Validation catches malformed responses early. This is better than trying to impose structure after the fact on free-form text.",
    whyOthersWrong: {
      a: "Regex parsing of free-form LLM text is fragile and error-prone. The LLM output format varies between calls. The fix should be at the source (structured output) not at the consumer (parsing).",
      c: "Making the synthesis agent handle unstructured input works around the problem rather than solving it. The synthesis agent's job is integration and analysis, not data normalization.",
      d: "Using the coordinator as an intermediate structuring step adds latency and token cost. The coordinator makes an extra LLM call per subagent just for formatting. Structure should be enforced at the source."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured Outputs",
        quote: "Tool use (tool_use) with JSON schemas as the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors."
      }
  },
  {
    id: 115,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "You're using Claude Code to implement a feature that touches both the frontend React app and the backend API. The frontend work depends on API contracts that the backend work will define. What is the most effective way to structure this with Claude Code?",
    options: [
      { id: "a", text: "Use a single session to implement backend first, then frontend, maintaining full context of API contracts throughout.", correct: true },
      { id: "b", text: "Spawn two parallel subagents — one for backend and one for frontend — with a shared API contract document that both reference.", correct: false },
      { id: "c", text: "Implement the frontend with mock API responses first, then implement the backend API to match the mocks.", correct: false },
      { id: "d", text: "Use fork_session to create two branches from the same starting context, one for each layer, and merge the results.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "When there's a dependency between tasks (frontend depends on backend API contracts), sequential execution in a single session is most effective. The session maintains full context of the API contracts defined during backend work, which directly informs the frontend implementation.",
    whyOthersWrong: {
      b: "Parallel subagents can't work here because the frontend depends on API contracts defined during backend implementation. The frontend subagent would need to wait for or guess the contracts, defeating parallelism.",
      c: "Frontend-first with mocks risks misalignment — the mocks may not match what the backend naturally produces, creating rework. Backend-first ensures the frontend is built against real contracts.",
      d: "fork_session creates independent branches from the same starting point. The frontend fork doesn't benefit from backend fork's decisions about API contracts. There's no mechanism for one fork to consume the other's output."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.7",
        quote: "Choosing between session resumption (when prior context is mostly valid) and starting fresh with injected summaries (when prior tool results are stale)."
      }
  },
  {
    id: 116,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator delegates a task to a subagent. The subagent completes 80% of the work but returns partial results because it hit a context window limit. The coordinator receives the partial results with no indication they are incomplete. What architectural safeguard prevents this?",
    options: [
      { id: "a", text: "Set a higher max_tokens value for subagent API calls to prevent truncation.", correct: false },
      { id: "b", text: "Require subagents to include a completion_status field in their response schema indicating whether results are complete or partial, with a reason if partial.", correct: true },
      { id: "c", text: "Have the coordinator check the token count of each subagent response and flag responses below an expected minimum length.", correct: false },
      { id: "d", text: "Implement a watchdog timer that restarts subagents if they haven't produced output within an expected timeframe.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A required completion_status field in the subagent response schema is a metadata requirement that makes incompleteness explicit. The coordinator can then decide whether to accept partial results, retry, or re-delegate with a narrower scope.",
    whyOthersWrong: {
      a: "Increasing max_tokens may help in some cases but doesn't guarantee completeness. The subagent might still hit limits with very large tasks, and there's no signal when it does. The architectural fix is to make incompleteness visible, not to hope limits aren't hit.",
      c: "Token count is a poor proxy for completeness. A subagent might produce a short but complete response for a simple subtask, or a long but still incomplete response for a complex one. Content-aware signals are more reliable than length-based heuristics.",
      d: "A watchdog timer addresses subagent hangs, not partial completion. The subagent completed and returned results — it just didn't indicate they were incomplete. Timing doesn't help detect content gaps."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.3",
        quote: "Structuring synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources."
      }
  },
  {
    id: 117,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent needs to process a refund that requires sequential approval from two different backend systems: first the order system, then the payment system. The payment system call occasionally times out. Currently, the agent retries the entire sequence (order + payment) on any failure. What is wrong with this approach?",
    options: [
      { id: "a", text: "The retry should use exponential backoff instead of immediate retry to avoid overwhelming the backend systems.", correct: false },
      { id: "b", text: "The agent should retry only the failed payment system call, not the already-successful order system call, to avoid duplicate order approvals and wasted API calls.", correct: true },
      { id: "c", text: "The agent should switch to parallel execution of both system calls to reduce total latency.", correct: false },
      { id: "d", text: "The agent should escalate to a human agent after the first timeout instead of retrying, since timeouts indicate system instability.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Retrying the full sequence when only the payment step failed causes unnecessary duplicate calls to the order system and potentially creates duplicate approval records. Targeted retry of only the failed step is more efficient and avoids side effects.",
    whyOthersWrong: {
      a: "Exponential backoff is a good practice for retries but doesn't address the core problem of retrying already-successful steps. Even with backoff, retrying the order system call is wasteful and potentially harmful.",
      c: "Parallel execution of sequential dependencies is not possible — the payment call requires the order approval result as input. The dependency is inherent to the business process.",
      d: "A single timeout is a transient error that typically resolves on retry. Escalating on first failure would dramatically increase human agent workload for issues that self-resolve in seconds."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.2",
        quote: "Implementing local error recovery within subagents for transient failures, propagating to the coordinator only errors that cannot be resolved locally along with partial results and what was attempted."
      }
  },
  {
    id: 118,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your system has 6 subagents organized in a hub-and-spoke topology. You notice that when the coordinator fails (e.g., context window overflow), the entire system halts even though subagents are mid-execution. What architectural improvement addresses this single point of failure?",
    options: [
      { id: "a", text: "Switch to peer-to-peer topology so agents can continue communicating without the coordinator.", correct: false },
      { id: "b", text: "Add a secondary coordinator that monitors the primary and takes over if it fails, using the same structured state manifest that subagents report to.", correct: true },
      { id: "c", text: "Give each subagent the ability to become coordinator if the primary goes down, using a leader election algorithm.", correct: false },
      { id: "d", text: "Reduce the coordinator's workload by eliminating its review loop so it stays within context limits.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A secondary coordinator with access to the same state manifest provides fault tolerance without changing the architecture. Subagents continue reporting to the same interface; the secondary takes over using the manifest to understand current state.",
    whyOthersWrong: {
      a: "Peer-to-peer eliminates the architectural benefits of centralized orchestration (progress tracking, task allocation, quality review). It solves the single point of failure but introduces coordination chaos.",
      c: "Leader election in LLM-based agents is impractical. LLM agents don't have the infrastructure for consensus protocols, and subagents lack the coordinator's broad context of the overall research plan.",
      d: "Reducing functionality to prevent failure is a workaround, not a solution. The review loop exists for quality control. Removing it to save tokens degrades output quality and doesn't truly eliminate the failure mode."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.4",
        quote: "Structured state persistence for crash recovery: each agent exports state to a known location, and the coordinator loads a manifest on resume... Designing crash recovery using structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts."
      }
  },
  {
    id: 119,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "You're using Claude Code in a CI pipeline to auto-fix linting errors. The pipeline runs Claude Code in headless mode with a prompt to fix lint issues and commit. Sometimes Claude Code also refactors surrounding code 'while it's there', causing unrelated test failures. What is the best approach?",
    options: [
      { id: "a", text: "Add 'Do not modify any code beyond what is required to fix the lint errors' to the system prompt.", correct: false },
      { id: "b", text: "Provide the specific lint errors and affected file paths in the prompt, and use a scoped allowlist that only permits editing files with lint errors.", correct: true },
      { id: "c", text: "Run the linting tool after Claude's changes and reject any commits that introduce new issues.", correct: false },
      { id: "d", text: "Use temperature 0 to make Claude's responses more deterministic and less likely to add unsolicited changes.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Providing specific errors and constraining which files can be edited through a scoped allowlist is a programmatic guardrail that prevents scope creep. The prompt provides focus, and the allowlist provides enforcement — the agent physically cannot edit unaffected files.",
    whyOthersWrong: {
      a: "Prompt instructions alone are probabilistic. In CI automation where unattended execution is the norm, you need deterministic constraints. The agent may still 'helpfully' refactor despite the instruction.",
      c: "Post-hoc rejection catches the problem but doesn't prevent it. The CI pipeline still wastes time running Claude, running tests, and detecting failures. Prevention is better than detection in automated pipelines.",
      d: "Temperature affects sampling randomness, not the tendency to add unrequested changes. Even at temperature 0, Claude may still decide that refactoring is helpful based on its reasoning, not randomness."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — CLI / allowedTools",
        quote: "--allowedTools — tools that execute without permission prompts. --disallowedTools — tools removed from context entirely."
      }
  },
  {
    id: 120,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your research system needs to produce a report on 'renewable energy trends in Southeast Asia'. The coordinator must decide how to decompose this. It could use fixed decomposition (predefined subtasks: solar, wind, hydro, policy, investment) or adaptive decomposition (let the coordinator reason about what subtasks are needed). Given that renewable energy landscapes vary significantly by country and technology maturity, which approach is better and why?",
    options: [
      { id: "a", text: "Fixed decomposition, because the 5 predefined categories comprehensively cover the renewable energy domain and ensure consistent report structure.", correct: false },
      { id: "b", text: "Adaptive decomposition, because the coordinator can tailor subtasks to the specific regional context (e.g., geothermal in Indonesia, tidal in Philippines) that fixed categories might miss.", correct: true },
      { id: "c", text: "Fixed decomposition with a post-hoc 'gaps' phase where the coordinator identifies missing topics after initial subtasks complete.", correct: false },
      { id: "d", text: "A hybrid where fixed decomposition handles the known categories and adaptive decomposition adds region-specific ones in parallel.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Adaptive decomposition is superior here because Southeast Asia's renewable landscape includes region-specific technologies (geothermal in Indonesia, tidal energy in the Philippines) that generic fixed categories would miss. The coordinator should reason about the specific topic to create relevant subtasks.",
    whyOthersWrong: {
      a: "Fixed categories like 'solar, wind, hydro' are Western-centric and miss region-specific technologies. They also impose a technology-centric structure when a country-by-country or maturity-based structure might be more appropriate for the region.",
      c: "A gaps phase adds an extra round of execution after all initial subtasks complete. Adaptive decomposition identifies the right subtasks upfront, avoiding the latency of discovering gaps after the fact.",
      d: "A hybrid approach adds complexity without clear benefit over pure adaptive. If adaptive decomposition is capable of identifying the right subtasks (it is), adding fixed categories alongside risks redundancy and coordination overhead."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.6",
        quote: "When to use fixed sequential pipelines (prompt chaining) versus dynamic adaptive decomposition based on intermediate findings... The value of adaptive investigation plans that generate subtasks based on what is discovered at each step."
      }
  },
  {
    id: 121,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent operates in an agentic loop. Logs show that for 15% of tickets, the agent enters a cycle where it calls get_order_status, receives 'processing', waits, calls get_order_status again, and repeats this 8-10 times before the loop's safety cap terminates it. Customers get no resolution. What is the best fix?",
    options: [
      { id: "a", text: "Reduce the safety cap from 10 iterations to 3 to terminate the unproductive loop faster.", correct: false },
      { id: "b", text: "Add a loop-detection mechanism that identifies when the same tool is called with the same parameters 3+ times and triggers an alternative action (e.g., escalate or inform the customer of the delay).", correct: true },
      { id: "c", text: "Remove get_order_status from the tool set and replace it with an async notification system that alerts the agent when order status changes.", correct: false },
      { id: "d", text: "Add a prompt instruction telling the agent not to check order status more than twice.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Loop detection on repeated identical tool calls is a programmatic guardrail that identifies unproductive cycles and triggers meaningful alternative actions. After 3 identical calls, the system can escalate, provide a status update to the customer, or schedule a follow-up.",
    whyOthersWrong: {
      a: "A lower safety cap terminates the loop faster but still doesn't resolve the customer's issue. The customer still gets no meaningful response — just a faster non-resolution. The fix should redirect to productive action, not just stop sooner.",
      c: "Removing get_order_status is too aggressive — it's needed for the 85% of cases where a single status check is sufficient. The problem is the loop behavior on 'processing' status, not the tool itself.",
      d: "Prompt instructions are probabilistic. For a pattern that occurs in 15% of tickets and has a measurable negative impact, programmatic enforcement is needed. The agent may not reliably count its own tool calls."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.4",
        quote: "The difference between programmatic enforcement (hooks, prerequisite gates) and prompt-based guidance for workflow ordering... When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate."
      }
  },
  {
    id: 122,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator delegates to a subagent that performs web research. The subagent returns a summary but the coordinator needs to verify the quality before passing it to synthesis. The coordinator re-reads the summary and decides it lacks depth. Using an iterative refinement pattern, what should the coordinator do next?",
    options: [
      { id: "a", text: "Re-delegate to the same subagent with the original task description plus a note saying 'provide more depth'.", correct: false },
      { id: "b", text: "Re-delegate to the same subagent with specific feedback: which sections lack depth, what additional aspects to cover, and examples of the depth expected.", correct: true },
      { id: "c", text: "Delegate to a different, more capable subagent to redo the research from scratch.", correct: false },
      { id: "d", text: "Have the coordinator enhance the summary itself using its own knowledge rather than re-delegating.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Effective iterative refinement requires specific, actionable feedback. Generic instructions like 'more depth' give the subagent no clear direction. Pointing out specific gaps and expectations guides the subagent to produce a meaningfully improved result.",
    whyOthersWrong: {
      a: "Vague feedback like 'provide more depth' is the most common anti-pattern in iterative refinement. The subagent may produce similarly shallow content on different subtopics, or pad with verbose text without adding substance.",
      c: "Switching to a different subagent discards the original subagent's research context and sources. Refinement of existing work is more efficient than restart, and the original subagent already has domain context.",
      d: "The coordinator acting as a researcher violates separation of concerns. The coordinator's role is orchestration and quality control, not content generation. It may also lack the research tools that the subagent has."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.2",
        quote: "Implementing iterative refinement loops where the coordinator evaluates synthesis output for gaps, re-delegates to search and analysis subagents with targeted queries, and re-invokes synthesis until coverage is sufficient."
      }
  },
  {
    id: 123,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Developer Productivity",
    question: "You're building a multi-agent system where Agent A generates code and Agent B reviews it. Agent A needs to know about Agent B's review standards. Currently Agent A generates code blind to review criteria, causing 60% rejection rate. How should you share context between these agents?",
    options: [
      { id: "a", text: "Include Agent B's review criteria in Agent A's system prompt so it generates code that meets the standards from the start.", correct: true },
      { id: "b", text: "Let Agent A and Agent B communicate directly via shared memory so Agent B can coach Agent A in real-time.", correct: false },
      { id: "c", text: "Have the coordinator pass Agent B's rejection reasons back to Agent A for each iteration until the code passes.", correct: false },
      { id: "d", text: "Train Agent A on examples of code that passed Agent B's review to implicitly learn the standards.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The simplest and most effective approach is to include the review criteria in Agent A's system prompt. This lets Agent A generate code that meets standards on the first attempt, reducing the rejection rate without adding architectural complexity or iteration overhead.",
    whyOthersWrong: {
      b: "Real-time coaching via shared memory adds significant architectural complexity. The review criteria are static and known in advance — they should be provided upfront, not discovered through runtime communication.",
      c: "Iterative rejection-and-fix cycles work but are expensive and slow. If the criteria are known upfront, giving them to Agent A at the start eliminates most rejections, making the iteration loop a fallback rather than the primary mechanism.",
      d: "Implicit learning from examples is unreliable for LLMs (they don't 'learn' across sessions). Explicit criteria are more reliable and maintainable than hoping the model infers standards from examples."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering Best Practices",
        quote: "Set role in system prompt to focus behavior and tone... Add context: explain WHY a behavior is important (Claude generalizes from explanation)."
      }
  },
  {
    id: 124,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline uses Claude Code to review PRs. Each review session starts fresh with no knowledge of previous reviews on the same repository. Reviewers notice that Claude keeps flagging the same accepted patterns as issues (e.g., the team's convention of using abbreviations in test helper names). How should you address this?",
    options: [
      { id: "a", text: "Add specific exceptions to the CI linting rules so those patterns don't trigger warnings.", correct: false },
      { id: "b", text: "Use CLAUDE.md to document team conventions and accepted patterns, which the CI review session will read at startup.", correct: true },
      { id: "c", text: "Have the CI pipeline filter out known false-positive comments from Claude's review output before posting.", correct: false },
      { id: "d", text: "Switch to a fine-tuned model that has been trained on the team's coding conventions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "CLAUDE.md is the canonical mechanism for providing project-level context to Claude Code sessions. Documenting team conventions there ensures every CI review session inherits that knowledge, preventing repeated false-positive flags on accepted patterns.",
    whyOthersWrong: {
      a: "Linting rules and Claude Code reviews are different systems. Claude's review comments come from LLM reasoning, not linting rules. Adding linting exceptions doesn't affect Claude's analysis.",
      c: "Post-hoc filtering is fragile — you'd need to maintain a growing list of patterns to filter, and the filter might incorrectly suppress legitimate issues that resemble known false positives.",
      d: "Fine-tuning is extreme overkill for team conventions that can be documented in a few lines. It's also inflexible — conventions change regularly and would require re-tuning."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory / CLAUDE.md",
        quote: "CLAUDE.md as the mechanism for providing project context (testing standards, fixture conventions, review criteria) to CI-invoked Claude Code."
      }
  },
  {
    id: 125,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator needs to spawn parallel subagents for 4 independent research topics within a single Claude API response. How should this be implemented?",
    options: [
      { id: "a", text: "Make 4 sequential API calls, one per subagent, within the coordinator's tool execution handler.", correct: false },
      { id: "b", text: "Use Claude's native parallel tool calls — define a 'spawn_subagent' tool and let Claude return 4 tool_use blocks in a single response, which the orchestrator executes concurrently.", correct: true },
      { id: "c", text: "Create a single 'spawn_batch' tool that accepts an array of 4 task descriptions and internally creates all subagents.", correct: false },
      { id: "d", text: "Use 4 separate coordinator instances, each managing one subagent, coordinated by a meta-coordinator.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Claude can return multiple tool_use blocks in a single response. By defining a spawn_subagent tool, the coordinator naturally expresses parallel delegation as 4 tool calls in one response. The orchestration layer then executes these concurrently.",
    whyOthersWrong: {
      a: "Sequential API calls within the tool handler miss the opportunity for parallel execution. The coordinator should express parallelism declaratively (via multiple tool calls) and let the orchestrator handle concurrent execution.",
      c: "A batch tool hides the parallelism from Claude's reasoning. With individual tool calls, Claude can provide specific parameters and context for each subagent independently, which produces better delegation.",
      d: "A meta-coordinator adds an unnecessary layer. One coordinator managing multiple parallel subagents is the standard pattern — adding a meta-coordinator level increases latency and complexity without benefit."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.3",
        quote: "Spawning parallel subagents by emitting multiple Task tool calls in a single coordinator response rather than across separate turns."
      }
  },
  {
    id: 126,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent handles a complex case where it has gathered diagnostic info and is ready to process a resolution. At this point, the customer asks an unrelated question about their subscription. The agent abandons the resolution workflow to answer the subscription question. What pattern prevents this?",
    options: [
      { id: "a", text: "Use tool_choice to force the agent to call the resolution tool on the next turn.", correct: false },
      { id: "b", text: "Implement a state machine that tracks workflow progress and constrains available actions based on current state, preventing the agent from diverting before completing the resolution step.", correct: true },
      { id: "c", text: "Add a system prompt instruction: 'Always complete the current workflow before addressing new questions.'", correct: false },
      { id: "d", text: "Queue the subscription question and present it to the agent only after the resolution workflow completes.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A state machine provides programmatic enforcement of workflow sequencing. When the agent is in the 'ready to resolve' state, only resolution-related tools are available. The subscription question is acknowledged but deferred until the resolution state transitions to complete.",
    whyOthersWrong: {
      a: "Forcing a specific tool on the next turn is too rigid. The agent might need to ask the customer a clarifying question before resolving. tool_choice doesn't account for the natural flow of conversation within a workflow step.",
      c: "Prompt instructions are probabilistic. When a customer directly asks a question, the LLM's conversational tendencies may override the workflow instruction, which is exactly what's happening here.",
      d: "Queuing the question hides it from the agent entirely, which may confuse the customer ('Why won't you answer my question?'). The agent should acknowledge the question and explain it will be addressed after the current workflow completes."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.4",
        quote: "Implementing programmatic prerequisites that block downstream tool calls until prerequisite steps have completed (e.g., blocking process_refund until get_customer has returned a verified customer ID)."
      }
  },
  {
    id: 127,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent needs to merge findings from 5 subagents. Three subagents returned structured JSON responses as requested, but two returned free-form narrative text. The synthesis agent currently fails when it tries to parse the narratives as JSON. What is the best immediate fix?",
    options: [
      { id: "a", text: "Add a normalization layer between subagents and synthesis that converts all responses to the expected structured format before passing them on.", correct: true },
      { id: "b", text: "Have the synthesis agent use try-catch logic to handle both formats, parsing JSON when possible and extracting key information from narratives when not.", correct: false },
      { id: "c", text: "Re-run the two non-compliant subagents with stricter schema enforcement in their prompts.", correct: false },
      { id: "d", text: "Modify the synthesis agent to work with free-form text only, since it's more flexible and handles both cases.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "A normalization layer provides a consistent interface to the synthesis agent regardless of upstream variability. It converts all responses to the expected schema, insulating the synthesis agent from format inconsistencies. This is a clean architectural boundary.",
    whyOthersWrong: {
      b: "Making the synthesis agent handle multiple formats adds complexity to the wrong component. The synthesis agent should focus on integration and analysis, not format negotiation. Format normalization is a separate concern.",
      c: "Re-running subagents is wasteful — their research results are valid, only the format is wrong. Also, re-running doesn't guarantee compliance; the same subagents might produce free-form text again.",
      d: "Switching to free-form-only discards the structured data that 3 subagents already provide. Structured data is more reliable for programmatic processing. Moving backward in structure quality is the wrong direction."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.5",
        quote: "Implementing PostToolUse hooks to normalize heterogeneous data formats (Unix timestamps, ISO 8601, numeric status codes) from different MCP tools before the agent processes them."
      }
  },
  {
    id: 128,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "You want Claude Code to implement a feature using an interview pattern: asking you clarifying questions before writing code. You've added 'Ask me clarifying questions before implementing' to CLAUDE.md. However, Claude keeps immediately writing code without asking questions. Why?",
    options: [
      { id: "a", text: "The interview pattern instruction needs to be in the system prompt, not CLAUDE.md, to have higher priority.", correct: false },
      { id: "b", text: "CLAUDE.md instructions compete with Claude's default bias toward action. The instruction should be more specific: list the exact questions to ask (e.g., 'Before implementing, ask about: target framework, error handling strategy, test requirements').", correct: true },
      { id: "c", text: "Claude Code doesn't support interview patterns — it's designed for direct code generation only.", correct: false },
      { id: "d", text: "The instruction should be in .claude/settings.json as a behavioral configuration, not in CLAUDE.md which is for project documentation.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Claude has a strong action bias — when given a task, it tends to start implementing immediately. A vague 'ask clarifying questions' instruction competes with this bias. Making the instruction specific (listing exact questions to ask) gives Claude a concrete action plan that overrides the default behavior.",
    whyOthersWrong: {
      a: "CLAUDE.md content is incorporated into the system prompt context. It has appropriate priority for workflow instructions. The issue is specificity, not placement.",
      c: "Claude Code fully supports interactive patterns including clarifying questions. The interview pattern is a documented and recommended workflow for complex feature requests.",
      d: "settings.json configures permissions, MCP servers, and environment settings. Behavioral workflow patterns like the interview pattern belong in CLAUDE.md as project-level instructions."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.5",
        quote: "The interview pattern: having Claude ask questions to surface considerations the developer may not have anticipated before implementing... Using the interview pattern to surface design considerations (e.g., cache invalidation strategies, failure modes) before implementing solutions in unfamiliar domains."
      }
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration (18%) — Questions 129-147 =====
  {
    id: 129,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your agent has a generic analyze_document tool that handles PDFs, spreadsheets, images, and HTML pages. Logs show 23% tool selection errors — the agent often calls analyze_document with wrong parameters for the document type (e.g., passing page_range for a spreadsheet). What is the best refactoring?",
    options: [
      { id: "a", text: "Add detailed parameter documentation to analyze_document explaining which parameters apply to each document type.", correct: false },
      { id: "b", text: "Split analyze_document into specific tools: extract_pdf_text, parse_spreadsheet, analyze_image, parse_html — each with parameters appropriate to its document type.", correct: true },
      { id: "c", text: "Add a pre-processing step that detects document type and automatically fills in the correct parameters before calling analyze_document.", correct: false },
      { id: "d", text: "Keep analyze_document but add a required document_type parameter that triggers different validation logic for each type.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Splitting a generic tool into specific tools eliminates parameter confusion by ensuring each tool only has parameters relevant to its document type. The model selects the right tool based on its description, and the parameters it sees all apply to that specific use case.",
    whyOthersWrong: {
      a: "More documentation on a tool with 15+ parameters across 4 document types adds to the model's cognitive load. The model must still reason about which parameters apply, which is the source of the 23% error rate.",
      c: "A pre-processing step that auto-fills parameters works around the model's confusion rather than solving it. It also creates a fragile dependency on document type detection accuracy.",
      d: "A discriminated union via document_type parameter still requires the model to correctly match types to parameters. It's marginally better than the current approach but doesn't eliminate the parameter confusion that specific tools solve."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source)."
      }
  },
  {
    id: 130,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has both search_orders and search_returns tools. Logs show it frequently calls search_orders when customers mention 'return' because search_orders' description says 'Search for customer orders and related transactions.' The agent interprets 'returns' as 'related transactions.' How should you fix the tool descriptions?",
    options: [
      { id: "a", text: "Add 'Do NOT use this tool for returns' to search_orders' description.", correct: false },
      { id: "b", text: "Rename the tools to order_lookup and return_lookup for clearer differentiation.", correct: false },
      { id: "c", text: "Update search_orders' description to explicitly exclude returns ('Search for purchase orders. Does NOT handle returns or refund requests — use search_returns for those.') and update search_returns to claim its domain ('Search for return/refund requests. Use this when a customer mentions returns, exchanges, or refund status.').", correct: true },
      { id: "d", text: "Merge both tools into a single search_transactions tool with a type parameter to avoid the selection ambiguity.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Effective tool descriptions include both what the tool does AND when to use it versus similar alternatives. Explicitly stating boundaries ('Does NOT handle returns') and claiming domains ('Use this when customer mentions returns') reduces ambiguity that causes misselection.",
    whyOthersWrong: {
      a: "A negative instruction alone is incomplete. It tells the model what NOT to do but doesn't guide it toward the correct alternative. The model needs positive guidance about when to use each tool.",
      b: "Renaming helps slightly but doesn't address the root cause — the ambiguous description. The model selects tools primarily based on descriptions, not names. The description 'related transactions' is the actual problem.",
      d: "Merging tools hides the distinction instead of clarifying it. The tools likely have different parameters, return schemas, and backend logic. A single tool with a type parameter is less self-documenting than two well-described specific tools."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Tool Use (Define Tools)",
        quote: "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations."
      }
  },
  {
    id: 131,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your research system uses an MCP server that provides access to a company knowledge base. You want the synthesis agent to browse a catalog of available internal reports before requesting specific ones. Which MCP primitive is best suited for this catalog browsing use case?",
    options: [
      { id: "a", text: "Define an MCP tool called list_reports that returns the full catalog when called.", correct: false },
      { id: "b", text: "Use MCP resources to expose the report catalog as a browseable content collection that the agent can read without executing a tool call.", correct: true },
      { id: "c", text: "Add the full report catalog to the MCP server's description field so the agent knows what's available.", correct: false },
      { id: "d", text: "Create an MCP prompt template that pre-populates the agent's context with the catalog contents.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "MCP resources are designed for exposing content collections that agents can browse and read. Unlike tools (which perform actions), resources provide data access — making them the appropriate primitive for a catalog browsing use case.",
    whyOthersWrong: {
      a: "A tool call is an action invocation. While list_reports would work functionally, it uses the wrong semantic primitive. Resources are cheaper, don't count as tool use turns, and are the intended MCP mechanism for content access.",
      c: "Embedding a full catalog in the server description wastes tokens on every interaction, even when the agent doesn't need the catalog. It also has size limitations and mixes metadata with content.",
      d: "MCP prompt templates are for structuring agent interactions, not for data access. They define conversation patterns, not content catalogs. Using them for catalog data conflates two different concerns."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.4",
        quote: "MCP resources as a mechanism for exposing content catalogs (e.g., issue summaries, documentation hierarchies, database schemas) to reduce exploratory tool calls... Exposing content catalogs as MCP resources to give agents visibility into available data without requiring exploratory tool calls."
      }
  },
  {
    id: 132,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your team uses 3 MCP servers simultaneously: GitHub, Jira, and an internal documentation server. The agent sometimes calls the wrong server's tool (e.g., github_search when it should use docs_search for internal documentation). How do you reduce cross-server tool confusion?",
    options: [
      { id: "a", text: "Reduce to 1 MCP server at a time and switch between them based on the task type.", correct: false },
      { id: "b", text: "Ensure each server's tool names and descriptions clearly indicate their scope and use namespaced prefixes (e.g., 'github_', 'jira_', 'docs_') with descriptions that state 'Use this ONLY for [specific domain]' and mention the alternatives by name.", correct: true },
      { id: "c", text: "Add a routing prompt that tells the agent which server to prefer for each type of query.", correct: false },
      { id: "d", text: "Consolidate all three servers into a single unified MCP server to eliminate confusion.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When multiple MCP servers are active simultaneously, clear namespacing and boundary-aware descriptions are essential. Each tool should state its specific domain and reference alternatives so the model understands the complete tool landscape.",
    whyOthersWrong: {
      a: "Reducing to one server at a time eliminates the ability to perform cross-system tasks (e.g., linking a GitHub PR to a Jira ticket). Multi-server access is a feature, not a problem — the fix is better descriptions, not fewer servers.",
      c: "A routing prompt helps but is secondary to well-described tools. The model's primary selection mechanism is tool descriptions. Prompt instructions add a backup signal but don't fix the root cause of ambiguous descriptions.",
      d: "Consolidating independent services into a single server creates a maintenance nightmare. Each server has its own auth, versioning, and lifecycle. The solution is better tool descriptions, not architectural merging."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — MCP / Tool Naming",
        quote: "MCP Tool Naming Pattern: mcp__<server>__<action>. Example: mcp__playwright__browser_screenshot."
      }
  },
  {
    id: 133,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "You need to add a data validation tool to your extraction pipeline. You're choosing between using an existing community MCP server for JSON Schema validation versus building a custom MCP server. The community server covers 80% of your validation needs. The remaining 20% involves proprietary business rules. What should you do?",
    options: [
      { id: "a", text: "Build a fully custom MCP server that covers all 100% of validation needs, since the community server can't handle everything.", correct: false },
      { id: "b", text: "Use the community MCP server for standard JSON Schema validation and build a small custom MCP server for only the proprietary business rule validation.", correct: true },
      { id: "c", text: "Fork the community MCP server and add the proprietary rules to your fork.", correct: false },
      { id: "d", text: "Use the community server and encode the proprietary business rules as prompt instructions instead of tool logic.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Leveraging the community server for standard validation (80%) and building custom only for proprietary rules (20%) minimizes development effort while covering all needs. Multi-server access is a core MCP capability designed for exactly this composition pattern.",
    whyOthersWrong: {
      a: "Building 100% custom reimplements standard JSON Schema validation that the community server already handles well. This is unnecessary duplication of effort for the 80% overlap.",
      c: "Forking creates a maintenance burden — you must track upstream updates and merge them with your changes. Using two separate servers avoids this coupling while providing the same functionality.",
      d: "Encoding business rules as prompt instructions makes validation probabilistic rather than deterministic. Business rule validation requires consistent, repeatable logic that tool execution provides but prompt instructions cannot guarantee."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.4",
        quote: "Choosing existing community MCP servers over custom implementations for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows."
      }
  },
  {
    id: 134,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent uses a lookup_customer tool that accepts either email or customer_id. Logs show the agent sometimes passes a phone number as the email parameter, causing backend errors. What is the best tool design fix?",
    options: [
      { id: "a", text: "Add input validation in the tool handler that checks email format before making the backend call, returning a helpful error if invalid.", correct: false },
      { id: "b", text: "Replace lookup_customer with two constrained tools: lookup_customer_by_email (validates email format) and lookup_customer_by_id (validates ID format), eliminating the ambiguity of which identifier to use.", correct: true },
      { id: "c", text: "Update the tool description to include: 'The email parameter must be a valid email address (user@domain.com). Do not pass phone numbers.'", correct: false },
      { id: "d", text: "Add a phone_number parameter to the tool so the agent has an appropriate field for phone lookups.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Replacing one ambiguous multi-purpose tool with two constrained, specific tools is the 'replace generic tools with constrained alternatives' pattern. Each tool accepts only one identifier type, has appropriate validation, and its name makes the expected input unambiguous.",
    whyOthersWrong: {
      a: "Input validation catches the error after the model has already made the wrong decision. It's better to prevent the error by making the tool interface unambiguous. Validation is a backup, not a primary fix.",
      c: "Description improvements help the model make better choices but don't prevent mistakes. The model might still pass a phone number despite the instruction. Constrained tools make the wrong input structurally impossible.",
      d: "Adding a phone_number parameter increases tool complexity and may not match backend capabilities. If the backend can look up by phone, it should be a separate constrained tool, not a parameter added to an already ambiguous tool."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.3",
        quote: "Replacing generic tools with constrained alternatives (e.g., replacing fetch_url with load_document that validates document URLs)."
      }
  },
  {
    id: 135,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent has a verify_fact tool scoped to check claims against the research database. The agent sometimes uses this tool to make new web searches beyond its intended scope. How should the verify_fact tool be constrained?",
    options: [
      { id: "a", text: "Add a rate limit to the tool to prevent excessive use.", correct: false },
      { id: "b", text: "Scope the tool to only access the pre-collected research database. Remove any web search capability from its implementation. Make the description explicit: 'Verifies factual claims against already-collected research sources only. Cannot perform new web searches.'", correct: true },
      { id: "c", text: "Log all verify_fact calls and review them manually for misuse.", correct: false },
      { id: "d", text: "Rename the tool to check_existing_sources to hint at its intended scope.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The verify_fact tool should be scoped at both the implementation level (no web search capability) and the description level (explicitly states it only checks existing sources). This is the scoped tool pattern — constraining both capability and description to prevent scope creep.",
    whyOthersWrong: {
      a: "Rate limiting controls volume, not scope. A rate-limited tool that can still do web searches will still be misused, just less frequently.",
      c: "Manual review is reactive and doesn't prevent misuse in real-time. For a tool used in automated research pipelines, the constraint must be enforced at the tool level, not through after-the-fact auditing.",
      d: "Renaming provides a hint but the model selects tools based on descriptions and capabilities, not just names. If the tool can still do web searches, renaming won't prevent the agent from using that capability."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.3",
        quote: "Providing scoped cross-role tools for high-frequency needs (e.g., a verify_fact tool for the synthesis agent) while routing complex cases through the coordinator."
      }
  },
  {
    id: 136,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "You're enhancing an MCP server's tool descriptions for better model comprehension. The current description for a database query tool is: 'Runs SQL queries.' What should the enhanced description include?",
    options: [
      { id: "a", text: "The full database schema so the model knows what tables exist.", correct: false },
      { id: "b", text: "A comprehensive description including: what it does, supported query types (SELECT only / read-only), database scope, example queries, constraints (max rows returned, timeout), and when to use this vs other data access tools.", correct: true },
      { id: "c", text: "Links to the database documentation for the model to reference.", correct: false },
      { id: "d", text: "The SQL dialect and version number so the model generates compatible queries.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Enhanced tool descriptions should be a complete guide for the model: what the tool does, input constraints, output format, usage examples, limitations, and differentiation from similar tools. This provides all the context needed for accurate tool selection and parameter construction.",
    whyOthersWrong: {
      a: "The full schema belongs in a resource or a separate schema tool, not in the description. Embedding large schemas in descriptions bloats every API call and is impractical for large databases.",
      c: "LLMs cannot follow links to external documentation during inference. Tool descriptions must be self-contained since they are the only information the model has when deciding to use a tool.",
      d: "SQL dialect is one small piece of the needed information. It helps with query syntax but doesn't address the more impactful gaps: when to use the tool, what's allowed, output format, and boundaries with other tools."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Tool Use (Define Tools)",
        quote: "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations. Aim for at least 3-4 sentences per tool description, more if the tool is complex."
      }
  },
  {
    id: 137,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your extraction agent has 12 tools. You want to add a new 'validate_extraction' tool but worry about crossing the threshold where tool selection accuracy degrades. Benchmarks show your model's accuracy drops significantly above 12-15 tools. What is the best approach?",
    options: [
      { id: "a", text: "Add the tool and increase the model's temperature to explore more tool selection options.", correct: false },
      { id: "b", text: "Audit the existing 12 tools for overlaps and consolidate 2-3 similar tools into one before adding validate_extraction, keeping the total at or below the effective threshold.", correct: true },
      { id: "c", text: "Add the tool but implement a tool recommender system that suggests the top 3 most relevant tools for each query.", correct: false },
      { id: "d", text: "Add the tool and mitigate selection degradation by including a tool selection guide in the system prompt.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When near the tool count threshold, the correct approach is to audit and consolidate before adding. If 2-3 tools have overlapping functionality, merging them frees slots for new tools while keeping the total in the accuracy sweet spot.",
    whyOthersWrong: {
      a: "Higher temperature increases randomness in sampling, not the quality of tool selection reasoning. It would likely decrease selection accuracy, not improve it.",
      c: "A tool recommender adds infrastructure complexity and introduces another potential point of failure. The simpler solution is to stay within the effective tool count by consolidating redundant tools.",
      d: "System prompt guides help marginally but don't overcome the fundamental degradation that occurs with too many tools. The model's reasoning becomes less reliable as option count increases regardless of prompt instructions."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.3",
        quote: "The principle that giving an agent access to too many tools (e.g., 18 instead of 4-5) degrades tool selection reliability by increasing decision complexity."
      }
  },
  {
    id: 138,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent has both a process_refund tool and an apply_credit tool. Both tools can reduce a customer's balance, but process_refund reverses a charge while apply_credit adds store credit. The agent often uses them interchangeably, causing accounting discrepancies. How should the tools be named and described to reduce ambiguity?",
    options: [
      { id: "a", text: "Rename them to money_back_refund and store_credit_apply and update descriptions to emphasize the accounting difference.", correct: false },
      { id: "b", text: "Keep current names but add descriptions that explain the financial mechanism: process_refund returns money to the original payment method and creates a reversal entry; apply_credit adds store-only credit with no payment reversal. Each description should state when to use it and when NOT to use it.", correct: true },
      { id: "c", text: "Merge them into a single adjust_balance tool with a type parameter ('refund' or 'credit') since the agent confuses them anyway.", correct: false },
      { id: "d", text: "Add a confirmation step where the agent must explain why it chose the specific tool before executing it.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The key is descriptions that explain the distinct financial mechanisms and include explicit guidance on when to use each tool versus the other. Tool naming alone is insufficient — the descriptions must make the semantic and operational differences crystal clear.",
    whyOthersWrong: {
      a: "Renaming alone doesn't provide enough context for the model to understand the operational difference. The model needs to understand the accounting impact (reversal vs credit) to choose correctly, which requires descriptive text.",
      c: "Merging tools with fundamentally different accounting impacts into one tool increases error risk. A wrong type parameter value causes the same accounting discrepancy. Separate tools with clear descriptions are safer.",
      d: "Adding a confirmation step increases latency for every transaction and requires another LLM evaluation. The fix should prevent the wrong selection, not add a post-selection review that may also err."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Writing tool descriptions that clearly differentiate each tool's purpose, expected inputs, outputs, and when to use it versus similar alternatives."
      }
  },
  {
    id: 139,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your MCP server exposes a search_academic_papers tool. The community-provided description says 'Searches academic papers.' Your agents use it for all document searches, including patents, news articles, and blog posts, causing low-quality results. How should you enhance the description?",
    options: [
      { id: "a", text: "Update to: 'Searches academic papers in peer-reviewed journals and conference proceedings. Returns scholarly articles with citations. NOT suitable for patents, news, blogs, or general web content — use web_search for those.'", correct: true },
      { id: "b", text: "Add a supported_types parameter that restricts search to specific document types.", correct: false },
      { id: "c", text: "Add input validation that rejects queries containing keywords like 'news', 'blog', or 'patent'.", correct: false },
      { id: "d", text: "Rename the tool to search_scholarly_only to make its scope clearer.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Enhancing the MCP tool description with explicit scope (peer-reviewed journals), output characteristics (scholarly articles with citations), and negative boundaries (NOT for patents, news, blogs) gives the model complete information for accurate tool selection.",
    whyOthersWrong: {
      b: "A parameter to restrict types addresses what the tool searches within its domain, not whether it should be selected at all. The model needs to know the tool's scope before calling it, which is the description's job.",
      c: "Keyword-based rejection is brittle and creates poor user experience. An agent asking about 'news coverage of a research paper' would be incorrectly blocked. The fix should guide selection, not reject valid queries post-selection.",
      d: "Renaming provides a weak signal. The model relies on descriptions for tool selection. 'search_scholarly_only' is better than 'search_academic_papers' but still doesn't convey what types of non-scholarly content to avoid."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.4",
        quote: "Enhancing MCP tool descriptions to explain capabilities and outputs in detail, preventing the agent from preferring built-in tools (like Grep) over more capable MCP tools."
      }
  },
  {
    id: 140,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "You want your Claude Code setup to access both a GitHub MCP server and a custom internal API MCP server simultaneously. The GitHub server needs a personal access token, and the internal API needs an API key. Both are configured in .mcp.json. How should credentials be handled?",
    options: [
      { id: "a", text: "Store both tokens directly in .mcp.json since it's a local configuration file.", correct: false },
      { id: "b", text: "Use environment variable expansion in .mcp.json: ${GITHUB_TOKEN} for GitHub and ${INTERNAL_API_KEY} for the internal API, with actual values stored in environment variables or .env files excluded from version control.", correct: true },
      { id: "c", text: "Create a separate credentials.json file and reference it from .mcp.json.", correct: false },
      { id: "d", text: "Encode the tokens in base64 in .mcp.json to obscure them from casual viewing.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Environment variable expansion (${VARIABLE_NAME}) in .mcp.json is the standard MCP credential pattern. It allows .mcp.json to be version-controlled (shared team config) while keeping actual secrets in environment variables or .env files that are gitignored.",
    whyOthersWrong: {
      a: "Storing tokens directly in .mcp.json is a security risk if the file is version-controlled (which it typically is for team sharing). Secrets should never be in files that might be committed.",
      c: "A separate credentials.json is a custom solution that MCP doesn't natively support. Environment variable expansion is the built-in mechanism that .mcp.json already supports.",
      d: "Base64 encoding is not security — it's trivially reversible and provides no actual protection. It creates a false sense of security while the tokens remain easily extractable."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — MCP / Claude Code",
        quote: "Claude Code supports environment variable expansion in .mcp.json files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys. Supported syntax: ${VAR} - Expands to the value of environment variable VAR."
      }
  },
  {
    id: 141,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline uses an MCP server with a tool called process_data that accepts a 'mode' parameter with 6 possible values: 'extract', 'validate', 'transform', 'clean', 'merge', and 'export'. The agent frequently uses wrong modes. What refactoring best addresses this?",
    options: [
      { id: "a", text: "Add enum validation so the model sees the 6 valid values and their meanings in the tool schema.", correct: false },
      { id: "b", text: "Split process_data into 6 separate tools (extract_data, validate_data, transform_data, clean_data, merge_data, export_data) each with focused parameters and descriptions.", correct: true },
      { id: "c", text: "Add a mode_description parameter where the agent must explain why it chose that mode, enabling self-checking.", correct: false },
      { id: "d", text: "Group the 6 modes into 2 tools: process_data_input (extract, clean, validate) and process_data_output (transform, merge, export).", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Six separate tools with focused descriptions are easier for the model to select correctly than one tool with a 6-way mode parameter. Each tool's name and description clearly conveys its purpose, and its parameters are specific to that operation.",
    whyOthersWrong: {
      a: "Enum validation ensures the mode value is one of the 6 options but doesn't help the model choose the RIGHT mode. The model might correctly pick from the enum but still choose the wrong operation for the task.",
      c: "Requiring the agent to explain its mode choice adds token overhead without preventing errors. The model can rationalize any choice convincingly even when wrong. Structural clarity is more reliable than self-explanation.",
      d: "Grouping by input/output is arbitrary and doesn't match how the model reasons about operations. The model thinks in terms of 'I need to clean this data' not 'I need an input-phase operation.' Individual tools map directly to intent."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source)."
      }
  },
  {
    id: 142,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent uses an MCP server that provides customer data tools. You need to add a new 'get_customer_preferences' tool. The existing 'get_customer_profile' already returns basic preferences in its response. Should the new tool be added?",
    options: [
      { id: "a", text: "Yes, add it with a clear description that differentiates it from get_customer_profile: 'Returns detailed customer preferences including notification settings, communication channels, and product interest categories. Use when you need granular preference data beyond what get_customer_profile returns.'", correct: true },
      { id: "b", text: "No, extend get_customer_profile with an include_preferences boolean parameter to avoid adding another tool.", correct: false },
      { id: "c", text: "Yes, add it and remove preferences from get_customer_profile to avoid data overlap.", correct: false },
      { id: "d", text: "No, instruct the agent via prompt to use get_customer_profile when it needs preferences.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Adding a separate tool is appropriate when the new tool provides materially different depth (granular vs basic preferences). The key is a description that explicitly differentiates it from the existing tool, explaining when to use each one.",
    whyOthersWrong: {
      b: "A boolean parameter adds complexity to an existing tool and forces the model to reason about parameter combinations. A separate, well-described tool is cleaner and more discoverable.",
      c: "Removing basic preferences from get_customer_profile breaks backward compatibility and forces an extra tool call when agents only need basic preferences. The overlap of basic preferences in both tools is acceptable.",
      d: "Relying solely on prompt instructions to guide tool selection is weaker than having a properly described tool. The prompt instruction may be ignored, while a well-described tool is always visible in the tool schema."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Writing tool descriptions that clearly differentiate each tool's purpose, expected inputs, outputs, and when to use it versus similar alternatives."
      }
  },
  {
    id: 143,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "Your research system connects to 4 MCP servers providing different data sources. During a single research task, the coordinator needs to call tools from all 4 servers in one session. However, the agent only uses tools from the first 2 servers, ignoring the others. What is the most likely cause?",
    options: [
      { id: "a", text: "There's a connection limit that prevents more than 2 simultaneous MCP server connections.", correct: false },
      { id: "b", text: "The tools from servers 3 and 4 have weak descriptions that don't clearly indicate their relevance, so the model doesn't consider them when planning its research approach.", correct: true },
      { id: "c", text: "The agent's context window is full after loading tools from the first 2 servers, leaving no room for the others.", correct: false },
      { id: "d", text: "MCP servers are loaded in order and the agent preferentially selects earlier tools due to position bias.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When an agent ignores certain tools, the most common cause is inadequate descriptions. Tools with weak descriptions don't signal their relevance to the model's task planning. The model doesn't know when to use them because the descriptions don't make a clear case.",
    whyOthersWrong: {
      a: "MCP supports multiple simultaneous server connections without a hard limit of 2. If there were a connection error, it would manifest as an error message, not silent omission.",
      c: "Tool definitions are relatively small in the context window. Four MCP servers' worth of tool definitions won't exhaust a modern context window. This would only be a factor with hundreds of tools.",
      d: "While position bias exists in some LLM tasks, tool selection is primarily driven by description relevance, not tool ordering. A highly relevant tool described well will be selected regardless of its position in the tool list."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Tool descriptions as the primary mechanism LLMs use for tool selection; minimal descriptions lead to unreliable selection among similar tools."
      }
  },
  {
    id: 144,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your extraction tool returns results in a flat JSON format: {field1: value, field2: value, ...field30: value}. The agent struggles to reason about relationships between fields because they're all at the same level. What structural improvement helps most?",
    options: [
      { id: "a", text: "Return results alphabetically sorted so the agent can find fields more easily.", correct: false },
      { id: "b", text: "Restructure the return schema into nested groups that reflect semantic relationships: {identity: {name, id, email}, financial: {balance, credit_limit, payment_method}, preferences: {language, timezone, notifications}}.", correct: true },
      { id: "c", text: "Add a metadata field that lists which fields are related to each other.", correct: false },
      { id: "d", text: "Reduce the number of returned fields to only the 10 most commonly used ones.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Nested grouping by semantic domain makes field relationships explicit in the data structure. The model can reason about groups of related fields (e.g., all financial fields together) rather than parsing 30 flat fields to find relationships.",
    whyOthersWrong: {
      a: "Alphabetical ordering doesn't convey semantic relationships. 'balance' and 'credit_limit' would be separated alphabetically despite being financially related.",
      c: "A metadata field describing relationships adds complexity without restructuring the data. The model must first read the metadata, then map it to the flat fields. Nested structure makes relationships implicit in the data shape.",
      d: "Reducing fields loses potentially important data. The issue isn't the number of fields but their flat organization. Grouping preserves all data while improving comprehensibility."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.3",
        quote: "Using structured data formats to separate content from metadata (source URLs, document names, page numbers) when passing context between agents to preserve attribution."
      }
  },
  {
    id: 145,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "You're deciding whether to use a community MCP server for Slack integration or build your own. The community server has: 5K GitHub stars, monthly updates, comprehensive tool descriptions, and covers sending messages, reading channels, and managing reactions. Your team also needs a custom 'create_incident_channel' workflow. What should you do?",
    options: [
      { id: "a", text: "Build a fully custom Slack MCP server since you need custom functionality.", correct: false },
      { id: "b", text: "Fork the community server and add create_incident_channel to your fork.", correct: false },
      { id: "c", text: "Use the community server for standard Slack operations and build a small custom MCP server that only provides the create_incident_channel tool.", correct: true },
      { id: "d", text: "Use the community server and implement create_incident_channel as a sequence of standard Slack API calls orchestrated by the agent.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The community server handles standard operations well (5K stars, monthly updates). Building a custom server for only the proprietary workflow lets you benefit from community maintenance for standard features while owning only the custom part. Multiple MCP servers can be used simultaneously.",
    whyOthersWrong: {
      a: "Building a fully custom server reimplements standard Slack operations that the community server already handles well. This is unnecessary work and you lose the benefit of community maintenance and updates.",
      b: "Forking creates a maintenance burden — you must track upstream updates and resolve merge conflicts. The community server updates monthly, so your fork will quickly diverge.",
      d: "Having the agent orchestrate raw Slack API calls for a complex workflow (create channel, set topic, invite members, post initial message) is error-prone. A dedicated tool encapsulates this logic deterministically."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.4",
        quote: "Choosing existing community MCP servers over custom implementations for standard integrations (e.g., Jira), reserving custom servers for team-specific workflows."
      }
  },
  {
    id: 146,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your MCP server's cancel_subscription tool has a description that says: 'Cancels a customer subscription.' The agent sometimes calls it for subscriptions that are already cancelled, causing backend errors. What description improvement prevents this?",
    options: [
      { id: "a", text: "Add error handling in the tool to return a friendly message when the subscription is already cancelled.", correct: false },
      { id: "b", text: "Update the description to include preconditions: 'Cancels an active customer subscription. Requires subscription_id for a currently ACTIVE subscription. Will fail if subscription is already cancelled, expired, or in a pending state. Check subscription status with get_subscription_details first if unsure.'", correct: true },
      { id: "c", text: "Add an auto_check parameter that makes the tool automatically verify subscription status before attempting cancellation.", correct: false },
      { id: "d", text: "Create a separate can_cancel_subscription tool the agent should call first.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Including preconditions in the tool description guides the model to verify state before calling the tool. Mentioning the alternative tool (get_subscription_details) for checking status creates a clear workflow in the model's reasoning.",
    whyOthersWrong: {
      a: "Error handling in the tool is good practice but reactive. The agent still wastes a tool call on an invalid action. Better descriptions prevent the invalid call in the first place.",
      c: "An auto_check parameter is a backend implementation detail. The tool should have clear preconditions in its description so the model doesn't call it unnecessarily. Auto-check hides the need for the model to reason about state.",
      d: "A separate validation tool adds another tool to the tool set (increasing total count) and creates a mandatory two-call pattern. The simpler solution is clear preconditions that tell the model to check status using an existing tool."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Tool Use (Define Tools)",
        quote: "Your descriptions should explain every detail about the tool, including: What the tool does, When it should be used (and when it shouldn't), What each parameter means and how it affects the tool's behavior, Any important caveats or limitations."
      }
  },
  {
    id: 147,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "You have an MCP tool that extracts data from invoices. It works well for standard invoices but fails on invoices with non-standard layouts. You want to improve it using tool composition. What approach is best?",
    options: [
      { id: "a", text: "Build a more robust single extraction tool that handles all layouts through comprehensive template matching.", correct: false },
      { id: "b", text: "Compose two tools: first, a classify_invoice_layout tool that identifies the layout type, then route to layout-specific extraction tools (extract_standard_invoice, extract_freeform_invoice) based on the classification result.", correct: true },
      { id: "c", text: "Add an 'attempt_all_layouts' mode that tries every known layout pattern and returns the best match.", correct: false },
      { id: "d", text: "Have the agent convert all invoices to a standard format first using an image-to-standard-layout tool, then use the existing extraction tool.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Tool composition through classify-then-extract separates concerns: classification handles the layout variance, and specialized extraction tools handle the data extraction for each layout type. This is more maintainable and accurate than a monolithic approach.",
    whyOthersWrong: {
      a: "A monolithic tool handling all layouts becomes increasingly complex and brittle as new layouts are encountered. Separation of concerns through composition is more maintainable.",
      c: "Trying all layouts is computationally wasteful and may produce ambiguous results when multiple patterns partially match. Classification first narrows the search to one appropriate extraction path.",
      d: "Converting non-standard invoices to a standard format is itself a complex extraction task. It doesn't eliminate the problem — it moves it to a different tool. Direct extraction from the actual layout is more reliable."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "Splitting generic tools into purpose-specific tools with defined input/output contracts (e.g., splitting a generic analyze_document into extract_data_points, summarize_content, and verify_claim_against_source)."
      }
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows (20%) — Questions 148-168 =====
  {
    id: 148,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your monorepo has packages with different coding standards: the frontend uses ESLint + Prettier with semicolons, while the backend uses Go with gofmt. You want Claude Code to automatically follow the correct standard for each package. How should you configure this?",
    options: [
      { id: "a", text: "Put all standards in the root CLAUDE.md and trust Claude to apply the right ones based on file paths.", correct: false },
      { id: "b", text: "Use @import in the root CLAUDE.md to selectively include package-specific standards files (e.g., @import ./frontend/CLAUDE.md for frontend conventions, @import ./backend/CLAUDE.md for backend conventions).", correct: false },
      { id: "c", text: "Place a CLAUDE.md file in each package directory (frontend/CLAUDE.md, backend/CLAUDE.md) with that package's specific standards. Claude Code automatically applies the nearest CLAUDE.md when editing files in that subtree.", correct: true },
      { id: "d", text: "Configure the standards in .claude/settings.json with per-path rules mapping file globs to coding standards.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Subdirectory CLAUDE.md files are automatically applied when Claude edits files within that directory subtree. This is the cleanest approach for per-package standards — each package's CLAUDE.md contains only its standards, and Claude Code applies them contextually.",
    whyOthersWrong: {
      a: "Putting all standards in root CLAUDE.md and relying on Claude to apply them conditionally is error-prone. The model must always reason about which standards apply, which is unnecessary cognitive load when subdirectory CLAUDE.md provides automatic scoping.",
      b: "@import includes content into the root CLAUDE.md, making all standards always visible. This doesn't provide selective application based on which package you're editing — both frontend and backend standards would always be in context.",
      d: ".claude/settings.json handles permissions, environment variables, and MCP server configuration — not coding standards. Coding conventions belong in CLAUDE.md files."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory / CLAUDE.md Hierarchy",
        quote: "The CLAUDE.md configuration hierarchy: user-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), and directory-level (subdirectory CLAUDE.md files)."
      }
  },
  {
    id: 149,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You notice Claude Code keeps forgetting a debugging technique you frequently use (a specific logging pattern). You want it to remember this across all your projects but not affect your teammates. Where should you store this preference?",
    options: [
      { id: "a", text: "In the project's CLAUDE.md file with a comment indicating it's your personal preference.", correct: false },
      { id: "b", text: "In CLAUDE.local.md which is gitignored and provides personal preferences that override project-level CLAUDE.md without affecting teammates.", correct: true },
      { id: "c", text: "In ~/.claude/CLAUDE.md as a global personal configuration file.", correct: false },
      { id: "d", text: "Use the /memory command to tell Claude Code to remember the pattern permanently.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "CLAUDE.local.md is the designated mechanism for personal preferences. It's gitignored (not shared with the team), applies per-project, and its contents supplement/override the project CLAUDE.md for just your sessions.",
    whyOthersWrong: {
      a: "Putting personal preferences in the shared CLAUDE.md imposes your debugging patterns on all teammates. Even with a comment, it clutters the shared configuration with individual preferences.",
      c: "~/.claude/CLAUDE.md is for global personal preferences that apply to ALL projects. The question asks about preferences for a specific project, so CLAUDE.local.md within the project is the correct choice.",
      d: "The /memory command stores information in Claude's memory for the current session or future sessions, but it's less reliable and structured than CLAUDE.local.md for persistent, project-scoped personal preferences."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory",
        quote: "Local | ./CLAUDE.local.md | Just you (current project)... CLAUDE.local.md lives at project root: ./CLAUDE.local.md. Should be added to .gitignore. Appended after CLAUDE.md at same directory level. Personal project-specific preferences."
      }
  },
  {
    id: 150,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline runs Claude Code to generate tests for new PRs. The pipeline provides the PR diff but not the existing test files. Claude generates tests that duplicate existing test utilities and use inconsistent patterns compared to the existing test suite. What is the best fix?",
    options: [
      { id: "a", text: "Add test style guidelines to CLAUDE.md to ensure consistent patterns.", correct: false },
      { id: "b", text: "Include the existing test helper files and a representative sample of existing tests in the Claude Code CI context, so it can match existing patterns and reuse utilities.", correct: true },
      { id: "c", text: "Post-process the generated tests with a formatter to enforce consistent style.", correct: false },
      { id: "d", text: "Have Claude Code search the repository for existing tests before generating new ones.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Providing existing test files in the CI context gives Claude Code concrete examples of the team's test patterns and available utilities. It can match the style and reuse existing helpers rather than inventing new ones, producing tests that fit seamlessly into the existing suite.",
    whyOthersWrong: {
      a: "Style guidelines in CLAUDE.md help with conventions but don't tell Claude about existing test utilities it should reuse. Without seeing actual test files, Claude can't know about custom matchers, fixtures, or helper functions.",
      c: "Post-processing can fix formatting but can't make tests reuse existing utilities or match semantic testing patterns. If Claude duplicated a test helper, a formatter can't replace it with a reference to the existing one.",
      d: "In CI contexts, Claude Code typically runs in headless mode with constrained permissions. Searching the repository adds latency and tool calls to every CI run. Providing the needed files upfront in the context is more efficient and deterministic."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.6",
        quote: "Providing existing test files in context so test generation avoids suggesting duplicate scenarios already covered by the test suite."
      }
  },
  {
    id: 151,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "Your project has complex deployment conventions that vary by environment. You want different team members to see different deployment instructions based on their role (frontend dev vs DevOps vs QA). What is the best configuration approach?",
    options: [
      { id: "a", text: "Create role-specific CLAUDE.md files (CLAUDE.frontend.md, CLAUDE.devops.md) and instruct team members to rename the appropriate one to CLAUDE.md.", correct: false },
      { id: "b", text: "Put all role-specific instructions in CLAUDE.md with clear section headers for each role.", correct: false },
      { id: "c", text: "Put shared conventions in CLAUDE.md and have each team member add their role-specific instructions in their personal CLAUDE.local.md file.", correct: true },
      { id: "d", text: "Use .claude/rules/ directory with rule files that are conditionally loaded based on an environment variable indicating the user's role.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "CLAUDE.md holds shared project conventions, and each team member's CLAUDE.local.md adds role-specific context. This separates shared from personal configuration cleanly, and CLAUDE.local.md is gitignored so it doesn't clutter the repository.",
    whyOthersWrong: {
      a: "Renaming files is error-prone and doesn't work with version control — CLAUDE.md changes would show up as diffs, and team members might accidentally commit the wrong version.",
      b: "Putting all role-specific instructions in one file wastes context tokens on irrelevant information. A frontend dev doesn't need DevOps deployment procedures cluttering their Claude Code context.",
      d: ".claude/rules/ files are loaded based on file glob patterns, not environment variables or user roles. They're designed for file-type-specific rules, not role-based conditional loading."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory / CLAUDE.local.md",
        quote: "CLAUDE.local.md lives at project root: ./CLAUDE.local.md. Should be added to .gitignore. Appended after CLAUDE.md at same directory level. Personal project-specific preferences."
      }
  },
  {
    id: 152,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want Claude Code to run your project's linter automatically after every file edit. What is the correct configuration approach?",
    options: [
      { id: "a", text: "Add 'Always run the linter after editing files' to CLAUDE.md.", correct: false },
      { id: "b", text: "Configure a PostToolUse hook in settings.json that triggers the linter when the Edit or Write tool is used, so linting runs automatically after every file modification.", correct: true },
      { id: "c", text: "Create a custom slash command /lint that team members can invoke after edits.", correct: false },
      { id: "d", text: "Set up a file watcher outside of Claude Code that triggers linting on any file change.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "PostToolUse hooks execute code after specific tool invocations. Configuring one that triggers on Edit/Write tool use provides deterministic, automatic linting after every file modification without relying on Claude remembering to lint.",
    whyOthersWrong: {
      a: "CLAUDE.md instructions are probabilistic — Claude may forget to run the linter, especially in complex multi-step operations. Hooks provide deterministic execution that doesn't depend on model compliance.",
      c: "A manual slash command requires someone to remember to invoke it. The requirement is automatic linting after every edit, which only a hook can guarantee.",
      d: "An external file watcher runs outside Claude Code's context. Its output wouldn't automatically feed back into Claude's conversation, so Claude wouldn't see lint errors and couldn't fix them as part of its workflow."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Hooks",
        quote: "PostToolUse hooks are useful for validation, logging, format checking, and providing Claude with contextual information about what occurred during tool execution."
      }
  },
  {
    id: 153,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You're using the /memory command during a debugging session and discover a subtle race condition in your async code. You want to persist this discovery for future sessions. What is the appropriate use of /memory here?",
    options: [
      { id: "a", text: "Use /memory to save a note about the race condition: its location, trigger conditions, and the fix applied. This persists across sessions and helps Claude Code recall the context if the issue resurfaces.", correct: true },
      { id: "b", text: "Add the race condition details to CLAUDE.md as a known issue, since /memory is only for personal preferences.", correct: false },
      { id: "c", text: "Use /memory to save the entire debugging conversation so Claude can replay the investigation.", correct: false },
      { id: "d", text: "Use /memory only if the fix is incomplete. For resolved issues, the git commit message is sufficient documentation.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The /memory command is ideal for persisting session discoveries across future sessions. Saving the race condition details (location, trigger, fix) means that if a related issue arises later, Claude Code can recall the prior investigation context.",
    whyOthersWrong: {
      b: "CLAUDE.md is for project-level instructions and conventions, not debugging logs. While known issues can go there, /memory is specifically designed for capturing session-level discoveries for future recall. Both have valid use cases, but for quick debugging notes, /memory is more appropriate.",
      c: "Saving the entire conversation is too verbose. /memory should capture a concise summary of the discovery, not a transcript. Token-efficient summaries are more useful for future recall than complete conversations.",
      d: "Git commit messages document what changed, not the investigation process that led to the fix. The debugging context (how the race condition was identified, what symptoms it caused) is valuable for future sessions and isn't captured in commits."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.1",
        quote: "Using the /memory command to verify which memory files are loaded and diagnose inconsistent behavior across sessions."
      }
  },
  {
    id: 154,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project has global rules in .claude/rules/ directory and a subdirectory CLAUDE.md in src/api/. When Claude edits a file at src/api/handler.ts, which configurations are active?",
    options: [
      { id: "a", text: "Only the subdirectory CLAUDE.md at src/api/CLAUDE.md, since it's the closest.", correct: false },
      { id: "b", text: "Only .claude/rules/ files, since they take precedence over CLAUDE.md files.", correct: false },
      { id: "c", text: "Both the root CLAUDE.md, the .claude/rules/ files (if their glob patterns match), and the subdirectory src/api/CLAUDE.md — all are merged.", correct: true },
      { id: "d", text: "The root CLAUDE.md and subdirectory CLAUDE.md are merged, but .claude/rules/ files are applied separately as a post-processing step.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Claude Code merges configuration from all applicable sources: root CLAUDE.md, .claude/rules/ files whose glob patterns match the edited file, and subdirectory CLAUDE.md files in the path hierarchy. All contribute to the active context simultaneously.",
    whyOthersWrong: {
      a: "Subdirectory CLAUDE.md supplements the root configuration, it doesn't replace it. Claude Code walks up the directory hierarchy and includes all CLAUDE.md files from the current directory to the project root.",
      b: ".claude/rules/ files don't override CLAUDE.md files — they complement them. Both systems serve different purposes and coexist. Rules files provide file-type-specific instructions while CLAUDE.md provides project/directory-level context.",
      d: ".claude/rules/ files are included in the same context as CLAUDE.md, not applied as a separate post-processing step. All configuration sources are merged into the active context for Claude's reasoning."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Memory",
        quote: "Loading: walks up directory tree from cwd, loading CLAUDE.md and CLAUDE.local.md at each level. Within each directory, CLAUDE.local.md appended after CLAUDE.md. Subdirectory CLAUDE.md files load on demand."
      }
  },
  {
    id: 155,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline needs Claude Code to review PRs in isolated sessions — each review should have no memory of previous reviews to prevent cross-PR context contamination. How should you configure this?",
    options: [
      { id: "a", text: "Clear Claude Code's cache directory between CI runs.", correct: false },
      { id: "b", text: "Run each review in a fresh Claude Code session with --no-memory or equivalent isolation flags, ensuring no session resume or memory persistence carries over from previous runs.", correct: true },
      { id: "c", text: "Use a different CLAUDE.md for each PR review to ensure context separation.", correct: false },
      { id: "d", text: "Run Claude Code in Docker containers that are destroyed after each review.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Session context isolation in CI requires explicit configuration to prevent session resume and memory from leaking context between reviews. Using isolation flags ensures each review session starts completely fresh with only the current PR's context.",
    whyOthersWrong: {
      a: "Cache clearing is incomplete — session memory and conversation history may persist in other locations. Explicit session isolation flags are the designed mechanism for this use case.",
      c: "CLAUDE.md content should be the same for all reviews (project conventions). Different CLAUDE.md per PR conflates project configuration with session isolation, and doesn't prevent memory leakage.",
      d: "Docker containers provide filesystem isolation but are overkill for session isolation. Claude Code has built-in mechanisms for session isolation that are more efficient and simpler to configure than container orchestration."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.6",
        quote: "Session context isolation: why the same Claude session that generated code is less effective at reviewing its own changes compared to an independent review instance."
      }
  },
  {
    id: 156,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You have a .claude/rules/ directory with a file typescript.md that contains 'Use strict TypeScript with no any types.' You also have a CLAUDE.md in the root that says 'Use any types liberally for prototyping speed.' When Claude edits a .ts file, which instruction takes effect?",
    options: [
      { id: "a", text: "The .claude/rules/typescript.md instruction wins because rules files have higher precedence than CLAUDE.md.", correct: false },
      { id: "b", text: "The root CLAUDE.md instruction wins because it's the primary configuration file.", correct: false },
      { id: "c", text: "Both instructions are merged into the context, creating a contradiction that Claude must resolve through its own judgment, which produces inconsistent behavior.", correct: true },
      { id: "d", text: "Claude Code detects the conflict and prompts the user to choose which instruction to follow.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Claude Code merges all configuration sources without explicit precedence resolution. Contradictory instructions from different sources both enter the context, and the model must reconcile them — leading to inconsistent behavior depending on which instruction the model weights more in a given interaction.",
    whyOthersWrong: {
      a: "There is no formal precedence hierarchy where rules files override CLAUDE.md. Both are included in context and the model sees both instructions.",
      b: "CLAUDE.md is not prioritized over .claude/rules/ files. Both contribute to the context equally. The model doesn't have a formal mechanism to know which source should take precedence.",
      d: "Claude Code does not detect or surface contradictions between configuration sources. It silently merges them all and leaves resolution to the model's inference."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Memory",
        quote: "Loading: walks up directory tree from cwd, loading CLAUDE.md and CLAUDE.local.md at each level. Within each directory, CLAUDE.local.md appended after CLAUDE.md."
      }
  },
  {
    id: 157,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want to use the interview pattern for complex feature requests: Claude asks clarifying questions, then generates a plan, then implements. You want this as a reusable workflow. What is the best implementation?",
    options: [
      { id: "a", text: "Add the interview pattern steps to CLAUDE.md as a standard workflow instruction.", correct: false },
      { id: "b", text: "Create a custom slash command (e.g., .claude/commands/implement-feature.md) that contains the interview pattern prompt template with $ARGUMENTS for the feature description.", correct: true },
      { id: "c", text: "Create a shell script that runs Claude Code multiple times — once for questions, once for planning, once for implementation.", correct: false },
      { id: "d", text: "Configure a PreToolUse hook that intercepts the first Edit call and prompts for clarification.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Custom slash commands in .claude/commands/ are the designed mechanism for reusable workflow templates. The command file can define the interview flow, and $ARGUMENTS lets the user provide the feature description. Team members invoke it with /implement-feature <description>.",
    whyOthersWrong: {
      a: "CLAUDE.md instructions apply to all interactions, not just feature implementation. The interview pattern would trigger even for simple tasks where it's unnecessary, slowing down quick edits.",
      c: "Multiple separate Claude Code invocations lose conversation context between stages. The clarifying questions in step 1 wouldn't be available in step 3. A single session with a slash command maintains full context.",
      d: "A PreToolUse hook on Edit is a fragile trigger point. Not all implementations start with Edit, and the hook would fire on every edit in every context, not just feature implementation workflows."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills / Commands",
        quote: "Custom commands have been merged into skills. A file at .claude/commands/deploy.md and a skill at .claude/skills/deploy/SKILL.md both create /deploy and work the same way. Your existing .claude/commands/ files keep working."
      }
  },
  {
    id: 158,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline runs Claude Code to fix failing tests. The pipeline provides the test output and source files. Sometimes Claude Code fixes the tests by weakening assertions (e.g., changing assertEquals to assertTrue(result != null)) instead of fixing the actual code. How should you prevent this?",
    options: [
      { id: "a", text: "Add to the CI prompt: 'Do not modify test files. Only modify source code to make tests pass.'", correct: false },
      { id: "b", text: "Configure file permissions in the CI context that make test files read-only, preventing Claude Code from editing them, and include a CLAUDE.md instruction explaining that test assertions are the spec — source code must be fixed to satisfy them.", correct: true },
      { id: "c", text: "Review Claude Code's changes after execution and reject commits that modified test files.", correct: false },
      { id: "d", text: "Run the original failing tests again after Claude's fix to verify they pass with their original assertions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Combining programmatic enforcement (read-only test files) with clear instructions (tests are the spec) prevents the undesired behavior. The permission constraint is deterministic, and the instruction explains the reasoning so Claude focuses on fixing source code.",
    whyOthersWrong: {
      a: "Prompt-only instructions are probabilistic. Claude may still modify tests if it judges that's the easier fix. Without programmatic enforcement, there's no guarantee of compliance, especially in complex scenarios.",
      c: "Post-hoc rejection catches the problem but wastes the entire CI pipeline execution. Prevention is more efficient than detection in automated workflows.",
      d: "Re-running original tests validates the fix but doesn't prevent the weakening behavior. If Claude weakened the assertions, the re-run would use the weakened versions and pass. You'd need to compare test file checksums, which is complex."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.4 / 3.6",
        quote: "The difference between programmatic enforcement (hooks, prerequisite gates) and prompt-based guidance for workflow ordering... When deterministic compliance is required (e.g., identity verification before financial operations), prompt instructions alone have a non-zero failure rate."
      }
  },
  {
    id: 159,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You want Claude Code to apply different linting rules for different file types: ESLint for .ts/.tsx files and Pylint for .py files. What is the most maintainable approach?",
    options: [
      { id: "a", text: "Add both linting configurations to CLAUDE.md with file extension conditions.", correct: false },
      { id: "b", text: "Create files in .claude/rules/ with glob-based matching: typescript-lint.md (applies to **/*.ts, **/*.tsx) with ESLint rules, and python-lint.md (applies to **/*.py) with Pylint rules.", correct: true },
      { id: "c", text: "Configure PostToolUse hooks for each file type that run the appropriate linter.", correct: false },
      { id: "d", text: "Create subdirectory CLAUDE.md files in each source directory specifying the appropriate linter.", correct: false }
    ],
    correctAnswer: "b",
    explanation: ".claude/rules/ files with glob patterns are designed for file-type-specific instructions. Each rule file specifies which files it applies to, and Claude Code automatically includes the relevant rules when editing matching files.",
    whyOthersWrong: {
      a: "CLAUDE.md doesn't support conditional application based on file types. All content is always in context. Glob-based rules in .claude/rules/ provide the file-type scoping that CLAUDE.md lacks.",
      c: "PostToolUse hooks that run linters automatically are useful for automated linting but are separate from giving Claude instructions about which standards to follow. The rules tell Claude what to write; hooks verify it after the fact. Both can complement each other, but the rules are the primary answer.",
      d: "Subdirectory CLAUDE.md files scope by directory, not file type. If Python and TypeScript files coexist in the same directory, subdirectory CLAUDE.md can't differentiate between them."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.3",
        quote: ".claude/rules/ files with YAML frontmatter paths fields containing glob patterns for conditional rule activation... Creating .claude/rules/ files with YAML frontmatter path scoping (e.g., paths: [\"terraform/**/*\"]) so rules load only when editing matching files."
      }
  },
  {
    id: 160,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You're setting up Claude Code for a new team member. They have personal coding preferences (2-space indentation, trailing commas) that differ from the project settings (4-space indentation, no trailing commas). The project settings must be preserved for CI checks. Where should the team member's preferences be configured?",
    options: [
      { id: "a", text: "In their editor settings, not in Claude Code configuration, since formatting is an editor concern.", correct: false },
      { id: "b", text: "Nowhere — they should follow the project's coding standards since those are enforced by CI.", correct: true },
      { id: "c", text: "In CLAUDE.local.md, which lets them use personal preferences locally while the CI uses the project CLAUDE.md.", correct: false },
      { id: "d", text: "In ~/.claude/settings.json as a global formatting preference.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When project settings are enforced by CI, personal formatting preferences that conflict with project standards should not be configured in Claude Code at all. The team member should follow project standards to avoid CI failures. CLAUDE.local.md is for non-conflicting personal preferences.",
    whyOthersWrong: {
      a: "Editor settings affect manual editing but not Claude Code's output. Claude Code follows its own configuration (CLAUDE.md, rules), not editor settings. This doesn't solve the problem.",
      c: "While CLAUDE.local.md supports personal preferences, using it for formatting that contradicts CI-enforced standards means every PR will fail linting. Personal preferences should not conflict with project-enforced standards.",
      d: "~/.claude/settings.json configures permissions and MCP servers, not formatting preferences. Even if it could, per-project CI-enforced standards should take precedence over global personal preferences."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Exam Guide — Task Statement 3.1",
        quote: "Diagnosing configuration hierarchy issues (e.g., a new team member not receiving instructions because they're in user-level rather than project-level configuration)."
      }
  },
  {
    id: 161,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You notice Claude Code suggests using a deprecated API from your internal SDK. The deprecation was announced last week. How should you ensure Claude Code knows about this deprecation across all team sessions?",
    options: [
      { id: "a", text: "Update CLAUDE.md: 'The v1 Auth API is deprecated. Use v2 AuthClient instead. See migration guide at docs/auth-migration.md.'", correct: true },
      { id: "b", text: "Tell Claude Code about the deprecation during your session and hope the memory feature propagates it to other sessions.", correct: false },
      { id: "c", text: "Update the SDK to remove the deprecated API so Claude Code can't find it in the codebase.", correct: false },
      { id: "d", text: "Add a PreToolUse hook that searches Claude's output for the deprecated API name and blocks the tool call.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "CLAUDE.md is the shared project-level knowledge base that all team members' Claude Code sessions read. Adding the deprecation notice there ensures every session, current and future, knows about the change immediately.",
    whyOthersWrong: {
      b: "Memory is session-scoped or personal. It doesn't propagate across team members' sessions. Only shared configuration files like CLAUDE.md reach the entire team.",
      c: "Removing the deprecated API from the codebase may not be immediately possible — existing code still uses it and needs to be migrated. Also, Claude might still suggest the old API from its training data even if removed from the codebase.",
      d: "A hook that blocks tool calls containing deprecated API names is overly aggressive. It would block Claude from reading or discussing the deprecated code during migration work. The fix should guide Claude to suggest the new API, not block interaction with the old one."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory",
        quote: "Project | ./CLAUDE.md or ./.claude/CLAUDE.md | Team via VCS."
      }
  },
  {
    id: 162,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You use test-driven development with Claude Code. You've written failing tests and want Claude to implement the code to make them pass. What is the most effective prompt approach?",
    options: [
      { id: "a", text: "Ask Claude to 'make the tests pass' without further context, trusting it to read the test files.", correct: false },
      { id: "b", text: "Provide the specific test file path, explain the feature being tested, and ask Claude to implement the minimum code to make all tests pass while following the project's architecture patterns.", correct: true },
      { id: "c", text: "Ask Claude to first analyze the tests, then propose an implementation plan, then implement — in three separate prompts.", correct: false },
      { id: "d", text: "Copy-paste the test code directly into the prompt so Claude can see it without reading files.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Providing the test file path, feature context, and architecture constraints gives Claude Code the complete picture: what to implement (from tests), why (feature context), and how (architecture patterns). This produces accurate implementations that fit the codebase.",
    whyOthersWrong: {
      a: "A bare 'make the tests pass' instruction lacks context about which tests, what feature they test, and what architectural patterns to follow. Claude may find the tests but produce an implementation that doesn't fit the codebase architecture.",
      c: "Three separate prompts fragment the workflow unnecessarily. Claude Code's agentic loop naturally handles analysis, planning, and implementation within a single prompt. Breaking it up loses momentum and may cause context fragmentation.",
      d: "Copy-pasting test code into the prompt is unnecessary since Claude Code can read files directly. It wastes prompt tokens and may lose important context like import statements and neighboring test files that Claude would discover by reading the file system."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.5",
        quote: "Test-driven iteration: writing test suites first, then iterating by sharing test failures to guide progressive improvement... Writing test suites covering expected behavior, edge cases, and performance requirements before implementation, then iterating by sharing test failures."
      }
  },
  {
    id: 163,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI runs Claude Code to auto-fix certain code quality issues before merging. The pipeline currently provides the full repository to Claude Code. Review times average 90 seconds per PR. How can you reduce this?",
    options: [
      { id: "a", text: "Upgrade to a faster model for CI runs.", correct: false },
      { id: "b", text: "Scope the CI context to only the changed files (from the PR diff) and their direct dependencies, reducing the amount of code Claude needs to process.", correct: true },
      { id: "c", text: "Cache Claude Code sessions between CI runs to reuse context.", correct: false },
      { id: "d", text: "Run Claude Code in parallel on different files from the PR.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Scoping the CI context to only changed files and their dependencies dramatically reduces the code Claude needs to process. Less context means faster analysis. The PR diff naturally defines the scope of relevant code.",
    whyOthersWrong: {
      a: "A faster model may be less capable at code analysis. The bottleneck is context size (processing the full repository), not model speed. Reducing context is more effective than switching models.",
      c: "Session caching between CI runs risks context contamination (one PR's context leaking into another's review). Each PR review should start fresh for accuracy.",
      d: "Parallel execution on different files can help but adds orchestration complexity and may miss cross-file issues. Scoping the input context is simpler and addresses the root cause of slow processing."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Context Windows",
        quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available."
      }
  },
  {
    id: 164,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "Your team has conventions documented in .claude/rules/ that work well for most files. However, for files in the legacy/ directory, many rules don't apply because the legacy code uses different patterns. How should you handle this?",
    options: [
      { id: "a", text: "Add exceptions to each rule file: 'Does not apply to files in legacy/ directory.'", correct: false },
      { id: "b", text: "Create a legacy/CLAUDE.md that explicitly overrides the relevant rules: 'This directory contains legacy code. The following project rules do not apply here: [list]. Instead, follow these legacy-specific patterns: [patterns].'", correct: true },
      { id: "c", text: "Move legacy code to a separate repository with its own Claude Code configuration.", correct: false },
      { id: "d", text: "Set the .claude/rules/ glob patterns to exclude legacy/ directory files.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A subdirectory CLAUDE.md in legacy/ provides context about why rules differ and what patterns to follow instead. It works with the existing rules system by adding context that helps Claude reason about the legacy directory's unique requirements.",
    whyOthersWrong: {
      a: "Adding exceptions to every rule file is unmaintainable. As rules grow, each needs a legacy exception. A single legacy/CLAUDE.md is a cleaner, centralized place for legacy-specific guidance.",
      c: "Moving legacy code to a separate repo is a major architectural decision that shouldn't be driven by Claude Code configuration. The legacy code likely shares dependencies and deployment with the main codebase.",
      d: "Excluding legacy files from all rules means Claude has no guidance at all when editing legacy code. The legacy code still needs conventions — just different ones from the main codebase."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Memory / Compaction Survival",
        quote: "Project-root CLAUDE.md survives: re-read from disk and re-injected after /compact. Nested subdirectory CLAUDE.md NOT re-injected until Claude reads files in that subdirectory."
      }
  },
  {
    id: 165,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You're using @import in your root CLAUDE.md to include standards from shared configuration files. Your CLAUDE.md contains: '@import ./standards/api-guidelines.md' and '@import ./standards/security-checklist.md'. A teammate adds a new file standards/testing-standards.md but doesn't update CLAUDE.md. What happens?",
    options: [
      { id: "a", text: "Claude Code automatically detects new files in the standards/ directory and includes them.", correct: false },
      { id: "b", text: "The new testing-standards.md is not included in Claude's context. An @import directive must be explicitly added to CLAUDE.md for it to be loaded.", correct: true },
      { id: "c", text: "Claude Code throws an error about the unimported file in the standards directory.", correct: false },
      { id: "d", text: "The file is included if Claude happens to read the standards/ directory during its work.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "@import is explicit inclusion — only files specifically referenced are loaded into context. New files in the same directory are not automatically discovered. The teammate must add @import ./standards/testing-standards.md to CLAUDE.md for it to take effect.",
    whyOthersWrong: {
      a: "@import is not a directory-watch mechanism. It imports specific files by path. There is no automatic discovery of new files in directories that contain imported files.",
      c: "Claude Code doesn't validate that all files in a directory are imported. Unimported files are simply not included — no error is generated.",
      d: "Even if Claude reads the standards/ directory during file exploration, that's different from the file being part of the persistent CLAUDE.md context. @import content is loaded at session start as part of the project configuration."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory / @import",
        quote: "The @import syntax for referencing external files to keep CLAUDE.md modular (e.g., importing specific standards files relevant to each package)... Maximum depth of 5 hops. Both relative and absolute paths allowed."
      }
  },
  {
    id: 166,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You need Claude Code to enforce that all database queries in your project use parameterized statements (no string concatenation). This rule should apply whenever Claude creates or modifies files matching **/db/**/*.ts. Where should this rule be configured?",
    options: [
      { id: "a", text: "In CLAUDE.md as a general project instruction.", correct: false },
      { id: "b", text: "In .claude/rules/ with a rule file that specifies the glob pattern **/db/**/*.ts and contains the parameterized query requirement.", correct: true },
      { id: "c", text: "In a PostToolUse hook that scans for string concatenation in SQL queries after each edit.", correct: false },
      { id: "d", text: "In db/CLAUDE.md as a subdirectory-specific instruction.", correct: false }
    ],
    correctAnswer: "b",
    explanation: ".claude/rules/ files with glob patterns are designed for file-scoped instructions. A rule file matching **/db/**/*.ts ensures the parameterized query requirement is included in context precisely when Claude edits database-related TypeScript files.",
    whyOthersWrong: {
      a: "CLAUDE.md applies to all file edits. The parameterized query rule is only relevant for database files. Putting it in CLAUDE.md wastes tokens and adds irrelevant instructions when editing non-database files.",
      c: "A PostToolUse hook can detect violations after they happen but doesn't guide Claude to write correct code in the first place. Prevention through rules is better than detection through hooks.",
      d: "db/CLAUDE.md would work if database files are only in the db/ directory, but the glob pattern **/db/**/*.ts suggests database directories may exist at multiple levels (e.g., src/services/db/, tests/db/). Rules with glob patterns cover all matching locations."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.3",
        quote: "The advantage of glob-pattern rules over directory-level CLAUDE.md files for conventions that span multiple directories (e.g., test files spread throughout a codebase)... Choosing path-specific rules over subdirectory CLAUDE.md files when conventions must apply to files spread across the codebase."
      }
  },
  {
    id: 167,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "Your CI pipeline runs Claude Code for PR review. The review should check: 1) code quality, 2) security vulnerabilities, 3) test coverage gaps. Currently it runs all three checks in one Claude Code prompt. Reviews are slow (3 minutes) and sometimes miss security issues. What structural improvement helps?",
    options: [
      { id: "a", text: "Split into 3 sequential Claude Code invocations, each focused on one concern, with results aggregated at the end.", correct: false },
      { id: "b", text: "Split into 3 parallel Claude Code sessions, each with a focused system prompt for one concern (quality, security, coverage), running concurrently and aggregating results.", correct: true },
      { id: "c", text: "Keep one invocation but use a more detailed prompt that explicitly prioritizes security checks.", correct: false },
      { id: "d", text: "Use a single invocation with temperature 0 for more deterministic and thorough analysis.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Parallel focused sessions address both problems: each session has a narrow focus (improving quality of analysis) and they run concurrently (reducing total wall-clock time). A security-focused session with security-specific instructions is less likely to miss vulnerabilities.",
    whyOthersWrong: {
      a: "Sequential invocations improve focus but triple the wall-clock time (3 * current time). Parallel execution achieves the same focus benefit while keeping total time close to one invocation.",
      c: "A single prompt handling 3 different concerns still divides the model's attention. The model may prioritize security as instructed but at the cost of quality or coverage analysis. Separation of concerns applies to LLM tasks too.",
      d: "Temperature 0 affects token sampling, not analytical thoroughness. The root cause of missed security issues is divided attention across 3 concerns, not randomness in token selection."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.6",
        quote: "Multi-pass review: splitting large reviews into per-file local analysis passes plus cross-file integration passes to avoid attention dilution and contradictory findings."
      }
  },
  {
    id: 168,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "You want to configure Claude Code so that whenever a team member starts a session in your repository, Claude automatically reads a set of architecture decision records (ADRs) stored in docs/adr/. What is the best approach?",
    options: [
      { id: "a", text: "List every ADR file path in CLAUDE.md with instructions to read them at session start.", correct: false },
      { id: "b", text: "Use @import in CLAUDE.md to include a summary of key ADRs, keeping the most important architectural decisions always in context without requiring file reads.", correct: true },
      { id: "c", text: "Create a custom /setup slash command that reads all ADR files.", correct: false },
      { id: "d", text: "Configure a session startup hook in settings.json that reads ADR files automatically.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "@import in CLAUDE.md directly includes the ADR summary content into the session context at startup. This ensures every session starts with key architectural decisions already loaded, without requiring manual commands or tool calls.",
    whyOthersWrong: {
      a: "Listing file paths and instructing Claude to read them requires multiple file-read tool calls at every session start, adding latency. @import loads the content directly into context without tool calls.",
      c: "A slash command must be manually invoked — team members might forget. Automatic inclusion via @import in CLAUDE.md requires no action from the developer.",
      d: "Session startup hooks aren't a standard Claude Code feature for loading context. @import in CLAUDE.md is the designed mechanism for automatically including reference material in every session."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 3.1",
        quote: "Using @import to selectively include relevant standards files in each package's CLAUDE.md based on maintainer domain knowledge."
      }
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output (20%) — Questions 169-189 =====
  {
    id: 169,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction prompt processes financial documents and outputs a JSON object. The model extracts 'revenue: $5.2M' from the text, but the actual text says 'revenue: $5.2B'. Your prompt says 'Extract all financial figures.' Adding a detected_pattern field for false positive analysis, what should this field capture?",
    options: [
      { id: "a", text: "The regex pattern used to match the financial figure.", correct: false },
      { id: "b", text: "The exact text snippet from the source document that the extracted value was derived from, enabling automated comparison between the source and extracted value to catch transcription errors.", correct: true },
      { id: "c", text: "A confidence score from 0-1 indicating how certain the model is about the extraction.", correct: false },
      { id: "d", text: "The page number and line number where the figure was found.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A detected_pattern field that captures the exact source text enables automated false positive analysis. By comparing the source snippet ('$5.2B') with the extracted value ('$5.2M'), an automated check can flag discrepancies like unit mismatches (M vs B) for human review.",
    whyOthersWrong: {
      a: "LLMs don't use regex internally. A regex pattern doesn't reflect how the model actually extracted the value and wouldn't help identify transcription errors.",
      c: "Confidence scores are useful but don't help diagnose WHY an extraction was wrong. The source text comparison directly reveals the error type (B vs M), while a confidence score only says 'something might be off.'",
      d: "Location information helps find the source but doesn't enable automated comparison. You'd still need to read the document at that location to discover the discrepancy. The source snippet provides the comparison directly."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.4",
        quote: "Feedback loop design: tracking which code constructs trigger findings (detected_pattern field) to enable systematic analysis of dismissal patterns... Adding detected_pattern fields to structured findings to enable analysis of false positive patterns when developers dismiss findings."
      }
  },
  {
    id: 170,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction model returns calculated_total: 4,850 for an invoice where the stated_total is 5,100. The individual line items sum to 4,850. Should the extraction output 4,850 or 5,100?",
    options: [
      { id: "a", text: "Output 5,100 because the stated total on the document is authoritative.", correct: false },
      { id: "b", text: "Output 4,850 because the calculated sum is mathematically correct.", correct: false },
      { id: "c", text: "Output both: stated_total: 5,100, calculated_total: 4,850, and a discrepancy_flag: true, letting the downstream system or human decide.", correct: true },
      { id: "d", text: "Output the average of both values (4,975) as the best estimate.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "When stated and calculated totals disagree, the extraction system should report both values and flag the discrepancy. The extraction model's job is to accurately capture document data, not to resolve accounting discrepancies. A discrepancy_flag enables downstream validation workflows.",
    whyOthersWrong: {
      a: "Blindly trusting the stated total ignores a potential error in the document. The discrepancy might indicate a missing line item or a typo in the total. Suppressing the calculated total hides valuable information.",
      b: "The calculated total may be wrong if a line item was missed in extraction. Without reporting the stated total, there's no way to know the extraction might be incomplete.",
      d: "Averaging financial figures is nonsensical. The discrepancy indicates an error somewhere — averaging doesn't resolve it and produces a number that exists in neither the document nor reality."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.4",
        quote: "Designing self-correction validation flows: extracting 'calculated_total' alongside 'stated_total' to flag discrepancies, adding 'conflict_detected' booleans for inconsistent source data."
      }
  },
  {
    id: 171,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent extracts customer intent from messages. For the message 'I've been charged twice and I want my money back NOW', the model correctly identifies 'refund_request' intent but misses 'duplicate_charge' as a secondary intent. Retry with the same prompt produces the same result. What should you change?",
    options: [
      { id: "a", text: "Increase temperature to get more diverse intent extraction results.", correct: false },
      { id: "b", text: "Retry the extraction 3 times and take the union of all detected intents.", correct: false },
      { id: "c", text: "Modify the prompt to explicitly instruct multi-intent extraction: 'Messages may contain multiple intents. Extract ALL intents as an array, including primary action requests and underlying issue descriptions.'", correct: true },
      { id: "d", text: "Add 'duplicate_charge' to a list of common intents in the prompt so the model is primed to look for it.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The model defaults to extracting the most prominent intent. Explicitly instructing multi-intent extraction with guidance on what constitutes separate intents (action requests vs issue descriptions) changes the model's extraction behavior to capture the full intent spectrum.",
    whyOthersWrong: {
      a: "Higher temperature adds randomness but doesn't change the extraction strategy. The model still looks for the primary intent — it just might express it differently.",
      b: "Retrying when the info IS present in the source but the prompt doesn't ask for it is ineffective. The same prompt will consistently extract the same primary intent. This is a prompt design issue, not a sampling issue.",
      d: "Hard-coding specific intents makes the system brittle. It would catch 'duplicate_charge' but miss the next unexpected secondary intent. The fix should be structural (multi-intent extraction) not case-specific."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering Best Practices",
        quote: "Be clear and direct — think of Claude as a brilliant but new employee. Provide sequential steps using numbered lists when order matters. Add context: explain WHY a behavior is important."
      }
  },
  {
    id: 172,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your batch processing system submits 10,000 extraction requests per hour. Each request costs ~$0.002. Before scaling to 100,000 requests/hour, you want to optimize the prompt. You discover that 30% of requests are near-duplicates with minor variations. What is the most cost-effective optimization?",
    options: [
      { id: "a", text: "Switch to a cheaper model to reduce per-request cost.", correct: false },
      { id: "b", text: "Implement a deduplication layer that detects near-duplicate requests and returns cached results, then refine the prompt for the remaining 70% of unique requests before scaling.", correct: true },
      { id: "c", text: "Batch all requests into a single API call with 10,000 items to get bulk pricing.", correct: false },
      { id: "d", text: "Reduce prompt length to minimize token cost per request.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Prompt refinement before batch processing ensures you're not scaling inefficiencies. Deduplication eliminates 30% of redundant API calls outright. Refining the prompt for the remaining requests optimizes accuracy and cost. This should happen BEFORE scaling to 100K.",
    whyOthersWrong: {
      a: "A cheaper model may reduce accuracy, creating more errors that require expensive manual correction. Cost optimization should start with eliminating waste (deduplication) and refining prompts, not degrading capability.",
      c: "API batching doesn't work by putting 10,000 items in one call. The Anthropic Batch API processes requests concurrently but each is still a separate request. Also, batching doesn't address the 30% redundancy.",
      d: "Prompt length is a minor cost factor compared to the 30% redundancy in requests. Eliminating 30,000 unnecessary requests per hour at 100K scale saves far more than trimming a few tokens per request."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.5",
        quote: "Using prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs."
      }
  },
  {
    id: 173,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction prompt asks the model to extract 'employee termination reason' from HR documents. For a document that states 'Employee resigned to pursue educational opportunities,' the model outputs 'termination_reason: fired'. The document never mentions firing. What type of prompt issue is this?",
    options: [
      { id: "a", text: "The model is hallucinating because its training data associates 'termination' with 'fired'. The prompt should use domain-neutral language like 'reason for departure' instead of 'termination reason.'", correct: true },
      { id: "b", text: "The extraction schema needs more enum values to distinguish between 'fired', 'resigned', and 'laid off'.", correct: false },
      { id: "c", text: "The model needs more context about the employee to correctly classify the reason.", correct: false },
      { id: "d", text: "Retry the extraction — this is a random error that won't repeat consistently.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The term 'termination' in the field name biases the model toward involuntary departure interpretations. This is a semantic priming issue — the prompt's terminology influences the model's extraction. Using neutral language like 'reason for departure' reduces this bias.",
    whyOthersWrong: {
      b: "Adding enum values addresses the output format but not the semantic bias. Even with 'resigned' as an option, the 'termination_reason' field name still primes the model toward involuntary associations. The field name itself is the problem.",
      c: "The document clearly states the reason ('resigned to pursue educational opportunities'). The model has sufficient context. The issue is that the prompt's framing biases interpretation, not that information is missing.",
      d: "This is a systematic bias from the field name, not a random sampling error. Retrying with the same prompt will likely produce the same biased result."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 2.1",
        quote: "The impact of system prompt wording on tool selection: keyword-sensitive instructions can create unintended tool associations... Reviewing system prompts for keyword-sensitive instructions that might override well-written tool descriptions."
      }
  },
  {
    id: 174,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent uses confidence-based routing: messages with confidence > 0.8 are auto-resolved, 0.5-0.8 are queued for senior agent review, and < 0.5 are escalated immediately. You find that 25% of auto-resolved tickets are actually complex issues that were misclassified with high confidence. How should you adjust the system?",
    options: [
      { id: "a", text: "Lower the auto-resolve threshold to 0.95 to catch more misclassifications.", correct: false },
      { id: "b", text: "Add a secondary validation step for auto-resolve candidates: check if the issue type matches a known simple issue pattern. Route to review if the confidence is high but the issue type is outside known simple patterns.", correct: true },
      { id: "c", text: "Retrain the confidence model on the misclassified tickets.", correct: false },
      { id: "d", text: "Remove auto-resolve entirely and route all tickets through human review.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "High confidence alone is insufficient for auto-resolution because the model can be confidently wrong. Adding a secondary check — whether the issue matches known simple patterns — creates a two-factor filter: high confidence AND known simple issue type. This catches complex issues that the model confidently misclassifies.",
    whyOthersWrong: {
      a: "Raising the threshold reduces auto-resolution volume but doesn't address the root cause — confidently wrong classifications. An issue misclassified at 0.85 confidence might also appear at 0.96 confidence.",
      c: "You can't 'retrain' Claude's confidence model. Prompt engineering and system design are the available levers. Even with a fine-tuned model, high-confidence misclassification is a fundamental LLM limitation that requires system-level mitigation.",
      d: "Removing auto-resolve throws away the 75% that work correctly, dramatically increasing human workload. The fix should preserve auto-resolve for genuinely simple cases while catching misclassified complex ones."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.2",
        quote: "Why sentiment-based escalation and self-reported confidence scores are unreliable proxies for actual case complexity."
      }
  },
  {
    id: 175,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You're building a prompt to extract severity levels from security incident reports. The prompt defines: Critical = 'system down', High = 'data breach', Medium = 'unauthorized access attempt', Low = 'policy violation'. A report describes 'an unauthorized access attempt that resulted in a partial data breach'. What severity should be extracted and why does the prompt need improvement?",
    options: [
      { id: "a", text: "Medium. The prompt is fine — the first matching criterion should be used.", correct: false },
      { id: "b", text: "High. The prompt needs improvement because severity criteria should include guidance on multi-criterion scenarios: 'When an incident matches multiple severity levels, assign the highest applicable level.'", correct: true },
      { id: "c", text: "Both Medium and High should be extracted as an array, since both criteria match.", correct: false },
      { id: "d", text: "The prompt should ask the model to calculate a composite severity score based on all matching criteria.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The incident matches both Medium (unauthorized access attempt) and High (data breach). Without explicit guidance on multi-criterion scenarios, the model might pick either. The prompt should state that the highest applicable level takes precedence, ensuring consistent escalation.",
    whyOthersWrong: {
      a: "First-match ordering is arbitrary and not a sound severity assessment principle. An incident with both 'unauthorized access' and 'data breach' is clearly more severe than just 'unauthorized access.'",
      c: "Severity is a single classification, not an array. Reporting multiple levels doesn't help downstream systems that need to route or prioritize based on a single severity. The correct approach is to select the highest applicable level.",
      d: "Composite scoring adds unnecessary complexity. Security severity levels are ordinal (Critical > High > Medium > Low), and the standard practice is to assign the highest matching level, not compute scores."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.1",
        quote: "Defining explicit severity criteria with concrete code examples for each severity level to achieve consistent classification."
      }
  },
  {
    id: 176,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline processes insurance claims. The prompt includes severity criteria with text descriptions. Adding code examples to the criteria (showing what the JSON output should look like for each severity level) improves accuracy from 82% to 94%. Why does this work?",
    options: [
      { id: "a", text: "The code examples serve as few-shot examples, showing the model the exact output format expected for each severity level, reducing ambiguity in the criteria definitions.", correct: true },
      { id: "b", text: "The code examples are processed faster by the model than natural language descriptions.", correct: false },
      { id: "c", text: "The code examples activate a different reasoning pathway in the model that is more precise.", correct: false },
      { id: "d", text: "The code examples reduce the model's temperature for the extraction task.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Code examples in severity criteria serve as few-shot demonstrations that ground abstract severity definitions in concrete output. The model sees exactly what a 'Critical' classification looks like in JSON, removing interpretation ambiguity from text-only descriptions.",
    whyOthersWrong: {
      b: "LLMs don't process code 'faster' than natural language. Both are tokenized and processed through the same architecture. The benefit is in clarity of communication, not processing speed.",
      c: "There isn't a separate 'code reasoning pathway' in LLMs. The model processes code and text through the same transformer layers. The improvement comes from reduced ambiguity, not different processing.",
      d: "Code examples don't affect temperature. Temperature is a sampling parameter set by the API caller. Examples improve output quality through clearer specification, not through parameter changes."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering Best Practices",
        quote: "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure... Include 3-5 examples for best results."
      }
  },
  {
    id: 177,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent asks the model to determine batch submission frequency for a customer's usage pattern. The customer processes 500 items per day. The model recommends 'submit a batch every hour' without calculating. What prompt change improves this?",
    options: [
      { id: "a", text: "Add 'Think carefully about the frequency' to the prompt.", correct: false },
      { id: "b", text: "Add explicit calculation requirements: 'Calculate the optimal batch frequency. Show your work: items_per_day / batches_per_day = items_per_batch. Ensure each batch is large enough for efficiency (>50 items) but frequent enough for freshness (<100 items).'", correct: true },
      { id: "c", text: "Provide a lookup table of recommended frequencies for different volume tiers.", correct: false },
      { id: "d", text: "Ask the model to use a calculator tool for the frequency calculation.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Explicit calculation requirements force the model to show its reasoning with specific formulas and constraints. Instead of guessing 'every hour,' the model must calculate: 500/24 = ~21 items per hourly batch (too small per the >50 minimum), so it would reason toward fewer, larger batches.",
    whyOthersWrong: {
      a: "'Think carefully' is a vague instruction that doesn't change the model's calculation behavior. Without specific formulas or constraints, the model may still produce a plausible-sounding but ungrounded recommendation.",
      c: "A lookup table removes the model's ability to reason about edge cases and specific customer contexts. It also requires maintaining the table as optimal thresholds change.",
      d: "A calculator tool is unnecessary for simple division. The prompt should guide the model's reasoning with explicit formulas. The issue is not mathematical capability but lack of structured reasoning requirements."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering (Chain of Thought)",
        quote: "Prefer general instructions over prescriptive steps. Use <thinking> and <answer> tags when thinking disabled. Self-check: 'Before finishing, verify your answer against [criteria]'."
      }
  },
  {
    id: 178,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction model processes medical records. The prompt says 'Extract the patient diagnosis.' For a record that mentions 'patient presented with symptoms consistent with early-stage diabetes, further testing recommended,' the model outputs 'diagnosis: diabetes.' How should the prompt be refined?",
    options: [
      { id: "a", text: "Add 'Only extract confirmed diagnoses' to the prompt.", correct: false },
      { id: "b", text: "Refine the schema to include a certainty_level field: 'Extract the diagnosis with its certainty level. Use: confirmed (definitive diagnosis), suspected (symptoms consistent with, further testing needed), ruled_out (excluded by testing). Include the exact qualifying language from the source.'", correct: true },
      { id: "c", text: "Add a disclaimer field for the model to note any uncertainty.", correct: false },
      { id: "d", text: "Instruct the model to only extract diagnoses that use the exact word 'diagnosed' in the source text.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A certainty_level field with defined levels captures the nuance between confirmed and suspected diagnoses. Including the qualifying language from the source ('symptoms consistent with,' 'further testing recommended') provides an audit trail and prevents loss of clinically important uncertainty information.",
    whyOthersWrong: {
      a: "'Only extract confirmed diagnoses' would miss suspected conditions that are clinically important. The goal should be to capture ALL diagnoses with appropriate certainty markers, not to filter out uncertain ones.",
      c: "A free-form disclaimer field is unstructured and hard to process programmatically. Defined certainty levels (confirmed/suspected/ruled_out) are actionable by downstream systems.",
      d: "Requiring the exact word 'diagnosed' is too restrictive. Medical records use varied language ('presented with,' 'findings consistent with,' 'treated for'). A flexible certainty schema captures the range of medical language."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.3",
        quote: "Adding enum values like 'unclear' for ambiguous cases and 'other' + detail fields for extensible categorization... Designing schema fields as optional (nullable) when source documents may not contain the information, preventing the model from fabricating values to satisfy required fields."
      }
  },
  {
    id: 179,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent extracts customer sentiment and routes angry customers to senior agents. The model classifies 'I appreciate your help but this has been really frustrating' as 'positive' because of 'appreciate' and 'help.' What prompt refinement fixes this?",
    options: [
      { id: "a", text: "Add more sentiment examples covering mixed-sentiment messages.", correct: false },
      { id: "b", text: "Change the classification to a multi-dimensional schema: {politeness: 'polite', satisfaction: 'frustrated', urgency: 'moderate'} rather than a single sentiment label, and route based on the satisfaction dimension.", correct: true },
      { id: "c", text: "Instruct the model to weight negative words more heavily than positive words in sentiment analysis.", correct: false },
      { id: "d", text: "Add a rule: 'If the message contains any negative words, classify as negative.'", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A multi-dimensional schema captures the complexity of the message: the customer is being polite (appreciation) while expressing frustration (dissatisfaction). Routing on the satisfaction dimension correctly identifies this as needing senior attention, while preserving the nuance that single-label classification loses.",
    whyOthersWrong: {
      a: "More examples might help edge cases but don't change the fundamental limitation of single-label classification for mixed-sentiment messages. The architecture (single label) is the constraint, not the training data.",
      c: "Weighting negative words more heavily creates a bias that would misclassify genuinely positive messages containing casual negative language. The fix should capture multiple dimensions, not skew one dimension.",
      d: "An any-negative-word rule would flag 'No problem, happy to help!' as negative because of 'No' and 'problem.' Keyword rules are too crude for nuanced sentiment analysis."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.3",
        quote: "Schema design considerations: required vs optional fields, enum fields with 'other' + detail string patterns for extensible categories."
      }
  },
  {
    id: 180,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You're designing a prompt for extracting meeting action items from transcripts. Your initial prompt produces generic action items like 'follow up on project.' The transcripts contain specific details (who, what, when). What prompt structure produces the most actionable extraction?",
    options: [
      { id: "a", text: "Ask for action items in a simple list format.", correct: false },
      { id: "b", text: "Define a structured schema: {assignee: string, action: string, deadline: string|null, dependencies: string[], verbatim_commitment: string} and instruct the model to only include action items where at least assignee and action can be extracted from the transcript.", correct: true },
      { id: "c", text: "Ask the model to summarize the meeting and then extract action items from its own summary.", correct: false },
      { id: "d", text: "Provide 10 example action items and ask the model to extract similar ones.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A structured schema with specific fields (assignee, action, deadline, dependencies) forces the model to extract concrete details. The verbatim_commitment field anchors each action item to the transcript. The minimum-field requirement prevents generic items that lack specificity.",
    whyOthersWrong: {
      a: "A simple list format doesn't guide the model toward specificity. Without structured fields, the model defaults to generic summarization rather than detailed extraction.",
      c: "Summarizing first then extracting from the summary is a lossy two-step process. Specific details (names, dates, exact commitments) are often lost in summarization. Direct extraction from the transcript preserves details.",
      d: "Few-shot examples help format but don't address the specificity problem. The model might produce well-formatted but still generic items if the schema doesn't demand specific fields."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured Outputs",
        quote: "Tool use (tool_use) with JSON schemas as the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors."
      }
  },
  {
    id: 181,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Multi-Agent Research System",
    question: "Your research system's prompt asks agents to 'summarize findings.' The synthesis agent receives 5 summaries of varying quality — some are detailed with citations, others are vague. The final report inherits the quality inconsistency. What prompt change at the subagent level fixes this?",
    options: [
      { id: "a", text: "Tell subagents to write longer summaries for more thorough coverage.", correct: false },
      { id: "b", text: "Define a structured output schema for summaries: {key_findings: [{finding: string, evidence: string, source_citation: string, confidence: 'high'|'medium'|'low'}], coverage_gaps: string[], methodology_notes: string}. Validate all summaries against this schema before passing to synthesis.", correct: true },
      { id: "c", text: "Have the synthesis agent request rewrites from subagents that produced low-quality summaries.", correct: false },
      { id: "d", text: "Rank summaries by quality and weight them accordingly in the synthesis.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A structured output schema enforces consistent quality by requiring each finding to include evidence and citations. The coverage_gaps field ensures subagents explicitly acknowledge what they didn't cover. Schema validation catches non-compliant responses before they reach synthesis.",
    whyOthersWrong: {
      a: "Length doesn't equal quality. A vague summary doesn't become specific by being longer — it just becomes a longer vague summary. Structure, not length, drives quality.",
      c: "Requesting rewrites is reactive and adds latency. The fix should ensure quality at the source through schema requirements, not through post-hoc correction cycles.",
      d: "Quality-weighted synthesis is sophisticated but doesn't fix the root problem — inconsistent input quality. The synthesis agent shouldn't need to compensate for subagent quality variance. Fix the source."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "Requiring subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis... Modifying upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains when downstream agents have limited context budgets."
      }
  },
  {
    id: 182,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your prompt extracts product specifications from manufacturer datasheets. The model consistently confuses 'operating temperature range' with 'storage temperature range' because both appear in similar table formats. What prompt refinement specifically addresses this?",
    options: [
      { id: "a", text: "Add 'Be careful to distinguish between operating and storage temperatures' to the prompt.", correct: false },
      { id: "b", text: "Separate the extraction into two passes: first extract operating specs, then extract storage specs.", correct: false },
      { id: "c", text: "Include explicit disambiguation in the schema with extraction hints: 'operating_temp_range: Extract from rows labeled Operating, Working, or Active temperature. storage_temp_range: Extract from rows labeled Storage, Shelf, or Non-operating temperature. If ambiguous, set needs_review: true.'", correct: true },
      { id: "d", text: "Pre-process the datasheets to highlight operating vs storage sections before extraction.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Embedding disambiguation hints directly in the schema fields tells the model exactly which source labels correspond to each output field. The needs_review flag handles ambiguous cases where the model cannot confidently determine the correct mapping, preventing silent errors.",
    whyOthersWrong: {
      a: "Generic 'be careful' instructions don't provide actionable disambiguation criteria. The model needs specific label mappings ('Operating' -> operating_temp_range) to differentiate consistently.",
      b: "Two extraction passes double the API cost and don't help with disambiguation. If the model confuses the labels in one pass, it will likely confuse them in two passes without better guidance.",
      d: "Pre-processing datasheets to highlight sections adds a complex preprocessing step. The simpler fix is better extraction hints in the prompt that teach the model which labels to look for."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.3",
        quote: "Including format normalization rules in prompts alongside strict output schemas to handle inconsistent source formatting."
      }
  },
  {
    id: 183,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your prompt tells the agent: 'If the customer's issue cannot be resolved, apologize and close the ticket.' An agent using this prompt closes tickets for issues it could resolve with more investigation. The problem is that the agent interprets 'cannot be resolved' as 'I don't immediately know the answer.' How do you fix the prompt?",
    options: [
      { id: "a", text: "Change to 'If the customer's issue cannot be resolved after exhausting all available tools and escalation paths, apologize and close the ticket. Do not close tickets prematurely — always attempt resolution using available tools before concluding an issue cannot be resolved.'", correct: true },
      { id: "b", text: "Remove the closure instruction and only allow human agents to close tickets.", correct: false },
      { id: "c", text: "Add a minimum number of tool calls (at least 3) before allowing ticket closure.", correct: false },
      { id: "d", text: "Change 'cannot be resolved' to 'is impossible to resolve' for stronger language.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The original prompt is ambiguous about what 'cannot be resolved' means. The refined prompt explicitly defines the threshold: all available tools and escalation paths must be exhausted first. It also includes a direct instruction against premature closure, addressing the observed behavior.",
    whyOthersWrong: {
      b: "Removing agent closure capability eliminates the problem but also eliminates the ability to close truly unresolvable tickets (discontinued products, etc.), increasing human agent workload unnecessarily.",
      c: "A minimum tool call count is arbitrary. Some issues genuinely can't be resolved in 3 calls (complex bugs), while others might be unresolvable after 1 call (wrong company). The criteria should be semantic, not numeric.",
      d: "Stronger language ('impossible') doesn't clarify the criteria. The model still needs to know what steps to take before concluding impossibility. Specificity beats intensity in prompt engineering."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.1",
        quote: "The importance of explicit criteria over vague instructions (e.g., 'flag comments only when claimed behavior contradicts actual code behavior' vs 'check that comments are accurate')."
      }
  },
  {
    id: 184,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You process 50,000 invoices/month through an extraction pipeline. Before switching to the Anthropic Batch API for cost savings, what prompt optimization should you perform first?",
    options: [
      { id: "a", text: "Shorten the prompt to minimize token costs in batch processing.", correct: false },
      { id: "b", text: "Run a representative sample (500-1000 invoices) through the current prompt, analyze error patterns, refine the prompt until accuracy meets your threshold, then switch to batch processing with the optimized prompt.", correct: true },
      { id: "c", text: "Switch to batch immediately and iterate on the prompt using batch results.", correct: false },
      { id: "d", text: "Test the prompt on 5 invoices manually, confirm it works, then scale to batch.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Prompt refinement before batch processing is critical because batch processing amplifies prompt issues at scale. A 2% error rate in a refined prompt means 1,000 errors/month at 50K volume. A representative sample (500-1000) reveals statistical error patterns that 5 manual tests would miss.",
    whyOthersWrong: {
      a: "Shortening the prompt risks reducing extraction accuracy. The primary optimization should be accuracy, not prompt length. A longer, more accurate prompt is more cost-effective than a shorter, error-prone one when considering error correction costs.",
      c: "Iterating on batch results is expensive and slow. Each batch iteration processes 50K invoices. Refining on a sample first is orders of magnitude cheaper and faster for prompt development.",
      d: "Five invoices is far too small a sample. It won't reveal edge cases, format variations, or statistical error patterns. A 500-1000 sample provides statistical significance for accuracy measurement."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.5",
        quote: "Using prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs."
      }
  },
  {
    id: 185,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Multi-Agent Research System",
    question: "Your research agent's prompt says 'Analyze the data and provide insights.' The agent consistently produces surface-level observations ('Revenue increased by 15%') rather than analytical insights ('Revenue increase of 15% was driven primarily by expansion in APAC markets, despite a 3% decline in North America'). What prompt change produces deeper analysis?",
    options: [
      { id: "a", text: "Add 'Provide deep insights' to make the depth expectation explicit.", correct: false },
      { id: "b", text: "Replace 'provide insights' with structured analytical requirements: 'For each metric, provide: the observed change, the primary driver(s) of the change, any counter-trends that contextualize the top-line number, and what the trend implies for the next period.'", correct: true },
      { id: "c", text: "Ask the model to think step-by-step before providing insights.", correct: false },
      { id: "d", text: "Increase the max_tokens to give the model more room for detailed analysis.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Structured analytical requirements decompose 'insight' into specific components: observed change, drivers, counter-trends, and implications. Each component forces the model beyond surface-level observation into the kind of analysis that constitutes a genuine insight.",
    whyOthersWrong: {
      a: "'Provide deep insights' is no more actionable than 'provide insights.' Without defining what constitutes depth (drivers, counter-trends, implications), the model has no guidance on how to be deeper.",
      c: "Step-by-step thinking helps with logical reasoning tasks but doesn't define what analytical depth means for this domain. The model might think step-by-step and still produce surface observations if the target analysis structure isn't specified.",
      d: "More tokens give room for longer output but don't improve analytical depth. The model might produce more surface-level observations rather than fewer, deeper insights. Quality is a prompt issue, not a length issue."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.1",
        quote: "Writing specific review criteria that define which issues to report (bugs, security) versus skip (minor style, local patterns) rather than relying on confidence-based filtering."
      }
  },
  {
    id: 186,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction system processes legal contracts. The model extracts 'termination_notice_period: 30 days' from a contract that says 'either party may terminate with 30 days written notice, except in cases of material breach where immediate termination is permitted.' The extraction misses the exception clause. How do you fix the prompt?",
    options: [
      { id: "a", text: "Add 'Include all exceptions and conditions' to the prompt.", correct: false },
      { id: "b", text: "Restructure the schema to include conditions: {termination_notice_period: {standard: '30 days', exceptions: [{condition: 'material breach', notice_period: 'immediate'}], full_clause_text: 'either party may...'}}.", correct: true },
      { id: "c", text: "Have the model extract the full termination clause text without any structuring.", correct: false },
      { id: "d", text: "Run extraction twice — once for standard terms and once for exceptions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A schema that explicitly includes an 'exceptions' array alongside the standard term forces the model to look for and capture conditional variations. The full_clause_text field provides an audit trail. This makes the extraction schema match the complexity of legal language.",
    whyOthersWrong: {
      a: "'Include all exceptions' is vague. The model might add a free-text note or might interpret 'all exceptions' differently each time. A structured exceptions array in the schema makes the requirement explicit and parseable.",
      c: "Extracting raw clause text doesn't provide structured data. Downstream systems need programmatic access to the notice period and its exceptions, not a text blob they'd need to parse themselves.",
      d: "Two extraction passes double the cost and still require schema design for exceptions. A single pass with a comprehensive schema is more efficient and produces more consistent results."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.3",
        quote: "Schema design considerations: required vs optional fields, enum fields with 'other' + detail string patterns for extensible categories."
      }
  },
  {
    id: 187,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Customer Support Resolution Agent",
    question: "Your support agent handles refund requests. The prompt includes a decision matrix but the agent sometimes approves refunds outside of policy. Analysis shows the agent correctly identifies policy constraints but then overrides them when the customer expresses frustration. How should the prompt be refined?",
    options: [
      { id: "a", text: "Remove all empathetic language from the prompt to make the agent more rigid.", correct: false },
      { id: "b", text: "Add to the prompt: 'Policy constraints are absolute and cannot be overridden by customer sentiment. If a refund request falls outside policy: 1) Acknowledge the customer's frustration empathetically, 2) Explain the specific policy constraint, 3) Offer alternatives within policy (store credit, exchange). Never approve a refund that violates policy regardless of the customer's emotional state.'", correct: true },
      { id: "c", text: "Implement a post-decision validation that checks refund approvals against policy before processing.", correct: false },
      { id: "d", text: "Lower the model's temperature to reduce creative interpretation of policies.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The prompt must explicitly state that policy constraints override customer sentiment, while providing an alternative workflow (empathize, explain, offer alternatives) that addresses the customer's frustration without violating policy. This gives the agent a path that satisfies both constraints.",
    whyOthersWrong: {
      a: "Removing empathy creates a poor customer experience. The goal is to maintain empathy while enforcing policy. The agent should acknowledge frustration — it just shouldn't let frustration override policy decisions.",
      c: "Post-decision validation is a useful safety net but doesn't fix the prompt behavior. The agent still makes wrong decisions that get caught and rejected, creating inconsistency in the customer interaction.",
      d: "Temperature affects sampling randomness, not the model's tendency to empathize. The override behavior comes from the model's reasoning about customer satisfaction, not from random token sampling."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.2",
        quote: "Acknowledging frustration while offering resolution when the issue is within the agent's capability, escalating only if the customer reiterates their preference."
      }
  },
  {
    id: 188,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "You need to extract structured data from both tabular financial reports and narrative market analysis documents using the same prompt template. The financial data needs precise numeric extraction while the narrative needs thematic extraction. What prompt design handles both?",
    options: [
      { id: "a", text: "Use one generic prompt that handles both formats.", correct: false },
      { id: "b", text: "Create completely separate prompts with no shared structure.", correct: false },
      { id: "c", text: "Use a shared base prompt with a document_type classifier that activates type-specific extraction instructions: for tabular data, activate precise numeric extraction with validation fields; for narrative, activate thematic extraction with evidence citation fields.", correct: true },
      { id: "d", text: "Pre-process all documents into a standard format before extraction.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "A shared base prompt with type-specific activated instructions provides consistency in the overall extraction framework while adapting to each document type's needs. The classifier routes to the appropriate instruction set, ensuring numeric precision for tables and thematic richness for narratives.",
    whyOthersWrong: {
      a: "A generic prompt can't optimize for both precise numeric extraction and thematic analysis. These require fundamentally different extraction strategies that a single generic prompt cannot specify.",
      b: "Completely separate prompts create maintenance burden and inconsistency in shared aspects (error handling, output format, metadata fields). A shared base with type-specific activation is more maintainable.",
      d: "Pre-processing tables into narrative format loses their structured nature, and converting narratives to tables loses nuance. Each format should be processed with its native structure preserved."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering Best Practices",
        quote: "Use XML tags to structure complex prompts: <instructions>, <context>, <input>. Consistent, descriptive tag names. Nest tags for hierarchy: <documents> containing <document index=\"n\">."
      }
  },
  {
    id: 189,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline runs on 10,000 documents daily. You want to retry failed extractions but find that retrying the same prompt on the same document usually produces the same error. When is retry ineffective and what should you do instead?",
    options: [
      { id: "a", text: "Retry is always effective if you increase temperature to get different outputs.", correct: false },
      { id: "b", text: "Retry is ineffective when the error is caused by missing information in the source document. Instead of retrying, flag these documents with the specific missing fields and route them to a manual review queue.", correct: true },
      { id: "c", text: "Retry is ineffective after 3 attempts. Discard these documents from the pipeline.", correct: false },
      { id: "d", text: "Retry with a completely different prompt each time to approach the extraction from a new angle.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When the information the prompt asks for simply doesn't exist in the source document, no amount of retrying will produce a correct extraction. The model will either leave the field empty (correct) or hallucinate a value (wrong). The appropriate action is to identify the specific missing fields and route to human review.",
    whyOthersWrong: {
      a: "Higher temperature generates different token sequences but cannot create information that isn't in the source document. If a field value doesn't exist in the document, temperature variation just produces different hallucinations.",
      c: "Discarding documents loses potentially valuable data. The failure diagnosis should determine the action: missing source info -> manual review, prompt issue -> fix prompt, format issue -> pre-process. Blanket discard is too aggressive.",
      d: "Different prompts can help if the original prompt was poorly designed, but they can't extract information that doesn't exist in the source. The diagnostic should first determine whether the information is present before changing the prompt."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 4.4",
        quote: "The limits of retry: retries are ineffective when the required information is simply absent from the source document (vs format or structural errors)... Identifying when retries will be ineffective (e.g., information exists only in an external document not provided) versus when they will succeed (format mismatches, structural output errors)."
      }
  },

  // ===== DOMAIN 5: Context Management & Reliability (15%) — Questions 190-204 =====
  {
    id: 190,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent receives data from subagents in different formats: the finance subagent returns JSON with nested objects, the news subagent returns markdown prose, and the social media subagent returns flat key-value pairs. The synthesis agent produces inconsistent reports because it handles each format differently each time. What is the best architectural fix?",
    options: [
      { id: "a", text: "Instruct the synthesis agent to normalize all inputs before processing.", correct: false },
      { id: "b", text: "Modify the upstream subagents to return structured data in a consistent schema, so the synthesis agent receives uniform inputs regardless of the data source.", correct: true },
      { id: "c", text: "Create a separate normalization agent that sits between subagents and the synthesis agent.", correct: false },
      { id: "d", text: "Give the synthesis agent format-specific parsing instructions for each subagent's output format.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Modifying upstream agents to return consistent structured data fixes the problem at the source. The synthesis agent should focus on synthesis, not format normalization. Consistent schemas from all subagents ensure reliable, reproducible synthesis every time.",
    whyOthersWrong: {
      a: "Asking the synthesis agent to normalize adds complexity to the wrong component. Normalization is an LLM task with probabilistic outcomes — it may normalize differently each time, which is the current problem.",
      c: "A normalization agent adds latency and another point of failure. If the source agents return consistent data, the normalization layer is unnecessary. Fix the source, not the pipeline.",
      d: "Format-specific parsing instructions increase the synthesis agent's prompt complexity and still rely on the LLM to correctly identify and apply the right parsing logic each time."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "Modifying upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains when downstream agents have limited context budgets."
      }
  },
  {
    id: 191,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent renders all information the same way — as plain text paragraphs. When presenting a billing summary with 5 charges, the customer struggles to parse it. When presenting a policy explanation, the dense text is hard to follow. How should you handle content-type-appropriate rendering?",
    options: [
      { id: "a", text: "Always render output as markdown tables for consistency.", correct: false },
      { id: "b", text: "Instruct the agent to select rendering format based on content type: financial data as tables with aligned columns, policy information as numbered lists with headers, narrative updates as concise prose paragraphs.", correct: true },
      { id: "c", text: "Let the model choose the best format based on its judgment for each message.", correct: false },
      { id: "d", text: "Render all structured data as JSON so customers can use their own tools to view it.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Content-type-appropriate rendering matches format to content: tables for financial data (easy comparison), numbered lists for policies (clear sequence), and prose for narratives (natural reading). Explicit instructions ensure consistent formatting decisions across all agent interactions.",
    whyOthersWrong: {
      a: "Tables are optimal for financial data but poor for narrative explanations. A one-size-fits-all format reduces readability for content types that don't suit tables.",
      c: "Leaving format choice to model judgment produces inconsistency. Different sessions may format the same content type differently. Explicit format-to-content-type mapping ensures consistency.",
      d: "JSON is a data interchange format, not a customer-facing presentation format. Customers expect human-readable output, not raw data structures."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "Rendering different content types appropriately in synthesis outputs—financial data as tables, news as prose, technical findings as structured lists—rather than converting everything to a uniform format."
      }
  },
  {
    id: 192,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your coordinator passes only the research question to subagents but not the conversation history showing how the question evolved through clarification with the user. Subagents produce technically correct but contextually inappropriate results because they miss the user's underlying intent. What should be passed to subagents?",
    options: [
      { id: "a", text: "The full conversation history so subagents have complete context.", correct: false },
      { id: "b", text: "A distilled context package containing: the refined research question, key constraints from the conversation, the user's stated priorities, and any explicitly excluded topics.", correct: true },
      { id: "c", text: "Only the final research question, since subagents should work with clear specifications.", correct: false },
      { id: "d", text: "The last 5 messages of conversation history as a compromise between context and efficiency.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A distilled context package provides subagents with the essential context (intent, constraints, priorities, exclusions) without overwhelming them with the full conversation. This captures the 'why' behind the research question that the question alone doesn't convey.",
    whyOthersWrong: {
      a: "Full conversation history wastes subagent context window on irrelevant exchanges (greetings, clarification loops, tangents). Subagents need refined context, not raw conversation.",
      c: "The final question alone is what's currently failing. The question 'Analyze renewable energy trends' doesn't convey that the user specifically cares about cost competitiveness with fossil fuels, which emerged through conversation.",
      d: "An arbitrary message count doesn't guarantee relevant context. The key constraint might have been mentioned 15 messages ago. A distilled package captures important context regardless of when it was stated."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 1.3",
        quote: "Including complete findings from prior agents directly in the subagent's prompt (e.g., passing web search results and document analysis outputs to the synthesis subagent)... Designing coordinator prompts that specify research goals and quality criteria rather than step-by-step procedural instructions, to enable subagent adaptability."
      }
  },
  {
    id: 193,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline outputs a document summary. A downstream consumer complains that the summary includes a statistic from 2019 presented as current ('The market is valued at $4.2B') when the document is from 2019 but the consumer is making 2024 decisions. How should you fix this?",
    options: [
      { id: "a", text: "Add a disclaimer to all summaries: 'Data may not reflect current market conditions.'", correct: false },
      { id: "b", text: "Include publication_date as a required metadata field in all extractions and instruct the model: 'When summarizing temporal data (statistics, projections, market values), always include the source year. Present as: [value] (as of [year]) so readers can assess currency.'", correct: true },
      { id: "c", text: "Filter out documents older than 2 years from the extraction pipeline.", correct: false },
      { id: "d", text: "Let the downstream consumer check publication dates themselves.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Publication dates as required metadata, combined with temporal annotation of statistics, ensures that all temporal data carries its date context. This lets consumers assess information currency without separate lookup and prevents misinterpretation of dated statistics as current.",
    whyOthersWrong: {
      a: "A generic disclaimer doesn't help consumers assess specific statistics. Knowing that '$4.2B' is from 2019 is much more useful than a blanket 'data may be outdated' warning.",
      c: "Filtering old documents loses valuable historical data. A 2019 baseline can be useful for trend analysis — the issue is not the age but the lack of date context in the presentation.",
      d: "Pushing date checking to consumers creates inconsistent behavior and extra work. The extraction system has the date information and should include it at extraction time for all consumers."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions... Requiring subagents to include publication or data collection dates in structured outputs to enable correct temporal interpretation."
      }
  },
  {
    id: 194,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent combines findings from 5 subagents into a report. Two subagents researched overlapping aspects of the topic and reached opposite conclusions. The synthesis agent uses subagent A's conclusion and silently drops subagent B's contradicting conclusion. How should the synthesis be improved?",
    options: [
      { id: "a", text: "Always prefer the conclusion from the subagent with higher confidence.", correct: false },
      { id: "b", text: "Require the synthesis agent to include a conflict_detected boolean. When true, the report must present both perspectives with their supporting evidence and explicitly note the contradiction for the reader.", correct: true },
      { id: "c", text: "Have the coordinator re-run both subagents with instructions to reconcile their views.", correct: false },
      { id: "d", text: "Average or merge the contradicting conclusions into a balanced middle-ground statement.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A conflict_detected boolean pattern forces the synthesis agent to identify and surface contradictions rather than silently resolving them. When conflicts are detected, both perspectives with their evidence are presented, making the report transparent about disagreements and letting readers evaluate them.",
    whyOthersWrong: {
      a: "Confidence scores don't determine factual accuracy. A subagent can be highly confident but wrong. Automatically preferring higher confidence creates a hidden bias and suppresses potentially correct minority conclusions.",
      c: "Re-running subagents to reconcile is expensive and may not resolve genuine analytical disagreements. Sometimes experts legitimately disagree. The synthesis should surface the disagreement, not force artificial consensus.",
      d: "Averaging contradictions produces a meaningless middle ground. If one subagent says 'the market is growing' and another says 'the market is shrinking,' the middle ground 'the market is stable' is likely wrong. Presenting both with evidence is more honest and useful."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value... Completing document analysis with conflicting values included and explicitly annotated, letting the coordinator decide how to reconcile before passing to synthesis."
      }
  },
  {
    id: 195,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent maintains conversation context across a multi-turn support interaction. After turn 8, the context window is 60% full. The customer introduces a new issue unrelated to the original. Should the agent manage context for the new issue within the same session or start fresh?",
    options: [
      { id: "a", text: "Start a new session to avoid contaminating the new issue with old context.", correct: false },
      { id: "b", text: "Continue in the same session since the customer identity and account context are already established, but create a clear context boundary: summarize the resolution of the first issue and explicitly note the transition to a new topic.", correct: true },
      { id: "c", text: "Continue in the same session without any changes — the model can handle multiple topics.", correct: false },
      { id: "d", text: "Ask the customer to create a new support ticket for the new issue.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Continuing in the same session preserves valuable established context (customer identity, account details) while a clear context boundary prevents the old issue's details from confusing analysis of the new one. This balances context reuse with context clarity.",
    whyOthersWrong: {
      a: "Starting fresh loses the established customer context (identity, account, preferences) that required multiple tool calls to build. Re-establishing this context wastes time and creates a poor customer experience.",
      c: "Continuing without context management risks the model conflating details from both issues. At 60% context utilization, old issue details may influence reasoning about the new issue.",
      d: "Asking the customer to create a new ticket is a poor experience when they're already in conversation with an agent. From the customer's perspective, they should be able to ask about anything in one interaction."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "Extracting and persisting structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions."
      }
  },
  {
    id: 196,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your subagents return results that the synthesis agent must merge. Currently, subagent results include only the findings. The synthesis agent struggles to assess reliability because it doesn't know which subagent produced which finding, what methods were used, or how confident the subagent was. What metadata should subagent responses include?",
    options: [
      { id: "a", text: "A unique ID for each subagent so findings can be traced.", correct: false },
      { id: "b", text: "Comprehensive metadata: {agent_id, domain_expertise, search_methodology, sources_consulted: number, source_quality_assessment, confidence_level, known_limitations, coverage_completeness_percentage}.", correct: true },
      { id: "c", text: "Just the confidence level (high/medium/low) for each finding.", correct: false },
      { id: "d", text: "The full tool call history showing exactly what the subagent did.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Comprehensive metadata gives the synthesis agent everything it needs to assess reliability: who produced the finding, how they researched it, how many and what quality sources were used, how confident they are, and what they know they didn't cover. This enables informed synthesis decisions.",
    whyOthersWrong: {
      a: "An agent ID enables tracing but provides no information about reliability. Knowing that 'Agent 3' produced a finding doesn't help assess whether that finding is well-supported.",
      c: "Confidence alone is insufficient. Two agents with 'medium' confidence may have very different levels of research depth. Confidence without methodology and source information is hard to interpret.",
      d: "The full tool call history is too verbose and shifts analysis burden to the synthesis agent. Structured metadata distills the relevant quality indicators without requiring the synthesis agent to parse raw execution logs."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "Requiring subagents to include metadata (dates, source locations, methodological context) in structured outputs to support accurate downstream synthesis."
      }
  },
  {
    id: 197,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline processes documents of varying length. Short documents (1-2 pages) extract accurately but long documents (50+ pages) show degraded accuracy in later sections. What context management strategy addresses this?",
    options: [
      { id: "a", text: "Truncate long documents to the first 10 pages since that's where accuracy is highest.", correct: false },
      { id: "b", text: "Split long documents into overlapping chunks, extract from each chunk independently, then merge results with deduplication for overlapping sections.", correct: true },
      { id: "c", text: "Use a model with a larger context window to fit the entire document.", correct: false },
      { id: "d", text: "Summarize the document first, then extract from the summary.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Chunking with overlap ensures each section gets full attention from the model. Overlapping boundaries prevent data loss at chunk edges. Deduplication handles fields extracted from the overlap region. This maintains accuracy across the entire document regardless of length.",
    whyOthersWrong: {
      a: "Truncating loses data from later sections entirely. Important information (signatures, totals, appendices) is often at the end of documents. This trades accuracy for incompleteness.",
      c: "Larger context windows still exhibit attention degradation over long inputs. Even with a 200K token window, attention to details in later sections may be lower. Chunking addresses the fundamental attention distribution issue.",
      d: "Summarization before extraction is lossy. Specific details (exact values, dates, clause numbers) that extraction targets are often omitted in summaries. Direct extraction from source text is more accurate."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "The 'lost in the middle' effect: models reliably process information at the beginning and end of long inputs but may omit findings from middle sections."
      }
  },
  {
    id: 198,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent produces a final report from 5 subagent findings. The report covers 4 of the 5 subagent findings comprehensively but completely omits the 5th subagent's market sizing data. The coordinator doesn't catch this gap. How should coverage tracking be implemented?",
    options: [
      { id: "a", text: "Count the number of sections in the report and compare to the number of subagent findings.", correct: false },
      { id: "b", text: "Require the synthesis agent to include a coverage_annotations section that maps each subagent's findings to where they appear in the report. If a subagent's findings have no mapping, the annotation flags the gap.", correct: true },
      { id: "c", text: "Have each subagent add a 'must include' tag to their most important finding.", correct: false },
      { id: "d", text: "Use word count analysis to verify all topics are covered proportionally.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Coverage annotations create an explicit mapping between source findings and report sections. If any subagent's findings don't appear in the mapping, the gap is immediately visible. This makes coverage verification systematic rather than relying on manual or heuristic checking.",
    whyOthersWrong: {
      a: "Section count doesn't verify content coverage. A report could have 5 sections but still omit market sizing data if one section covers a different topic. The mapping between inputs and outputs is what matters.",
      c: "'Must include' tags address priority but not systematic coverage. Even with tags, the synthesis agent might still omit tagged content. Coverage annotations verify what was actually included, not what was tagged.",
      d: "Word count is a poor proxy for coverage. A topic might receive 50 words of accurate coverage or 500 words that miss the key finding. Semantic mapping (which findings appear where) is more reliable than word-count proportionality."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.3",
        quote: "Structuring synthesis output with coverage annotations indicating which findings are well-supported versus which topic areas have gaps due to unavailable sources."
      }
  },
  {
    id: 199,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent provides troubleshooting guidance. When the customer's issue requires checking 3 backend systems, the agent sometimes forgets to check the 3rd system because the context is filled with results from the first 2 systems. How do you ensure complete system checks?",
    options: [
      { id: "a", text: "Increase the context window size to fit more system check results.", correct: false },
      { id: "b", text: "Provide a structured checklist in the prompt: 'For connectivity issues, check ALL of the following systems: 1) Auth service status, 2) Network connectivity, 3) CDN cache state. Mark each as checked before proceeding to resolution.'", correct: true },
      { id: "c", text: "Have the agent check systems in parallel rather than sequentially so it doesn't lose track.", correct: false },
      { id: "d", text: "Set max_tokens higher so the agent has more output space to include all checks.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A structured checklist in the prompt creates an explicit tracking mechanism. The agent must address each item and mark it as checked, making it structurally difficult to skip items. This compensates for the model's tendency to lose track of multi-step procedures in long contexts.",
    whyOthersWrong: {
      a: "Context window size isn't the issue — the model has room for all 3 system checks. The problem is attention and task tracking, which a checklist addresses. A larger window doesn't improve attention to specific items.",
      c: "Parallel checking is a performance optimization but doesn't address the tracking issue. If the agent forgets to initiate the 3rd check, parallelism doesn't help. The checklist ensures all checks are planned and tracked.",
      d: "Output token limits affect response length, not the agent's ability to track which systems to check. The agent stops checking the 3rd system because it loses track, not because it runs out of output space."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt Engineering Best Practices",
        quote: "Provide sequential steps using numbered lists when order matters. Add context: explain WHY a behavior is important (Claude generalizes from explanation)."
      }
  },
  {
    id: 200,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research system analyzes news articles that reference events at different time periods. An article from March 2024 says 'The regulation was passed last year.' The model interprets this as 2024 (the current year) instead of 2023 (the year before the article's publication). How should temporal references be handled?",
    options: [
      { id: "a", text: "Pre-process all articles to replace relative time references ('last year') with absolute dates before extraction.", correct: false },
      { id: "b", text: "Include the publication_date in the extraction context and instruct: 'Interpret all relative temporal references (last year, recently, next quarter) relative to the document's publication date, NOT the current date. The publication date for this document is: [date].'", correct: true },
      { id: "c", text: "Exclude articles with relative time references from the pipeline.", correct: false },
      { id: "d", text: "Always interpret relative references as relative to the current date for consistency.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Providing the publication date and explicitly instructing temporal interpretation relative to it ensures correct resolution of relative references. 'Last year' in a March 2024 article correctly resolves to 2023 when the model is anchored to the publication date.",
    whyOthersWrong: {
      a: "Pre-processing relative references requires NLP to resolve them, which is itself error-prone and adds pipeline complexity. Instructing the model with the publication date leverages its natural language understanding more effectively.",
      c: "Excluding articles with relative references would remove a large proportion of news articles. Relative temporal language is extremely common in journalism and shouldn't be a disqualifier.",
      d: "Interpreting relative to the current date is exactly the error being described. An article from 2024 saying 'last year' means 2023, not whatever the current year is when the model processes it."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "Temporal data: requiring publication/collection dates in structured outputs to prevent temporal differences from being misinterpreted as contradictions."
      }
  },
  {
    id: 201,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "Your extraction pipeline processes a 100-page technical manual. The model's extraction from pages 1-30 is 97% accurate, pages 31-60 is 89% accurate, and pages 61-100 is 72% accurate. What does this degradation pattern indicate and how should you address it?",
    options: [
      { id: "a", text: "The manual's later sections are more complex. Use a more capable model for those sections.", correct: false },
      { id: "b", text: "This is the classic long-context attention degradation pattern. Split the document into 30-page chunks with 5-page overlaps, process each chunk independently, and merge results with deduplication.", correct: true },
      { id: "c", text: "Reverse the document order so the currently-degraded sections are processed first.", correct: false },
      { id: "d", text: "Increase the model's context window to give it more room for the full document.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The steady accuracy degradation from 97% to 72% across the document's length is the signature pattern of long-context attention degradation — the model pays less attention to content further from the beginning. Chunking with overlaps ensures each section gets the same attention quality.",
    whyOthersWrong: {
      a: "While section complexity could contribute, the linear degradation pattern (97% -> 89% -> 72%) correlates with position, not content complexity. This is a known LLM limitation with long contexts, not a content difficulty issue.",
      c: "Reversing order would shift the degradation to the currently-accurate sections, not eliminate it. The degradation is position-dependent, so the same sections processed later would still suffer.",
      d: "A larger context window doesn't fix attention distribution. Even with unlimited context, models tend to attend less to middle and later content. The solution is to ensure each section appears in a position where it receives adequate attention."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Context Windows",
        quote: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available."
      }
  },
  {
    id: 202,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your synthesis agent produces a report with a section that says 'According to our research, the market will reach $50B by 2025.' However, no subagent produced this projection — it appears to be hallucinated. How do you prevent unsourced claims in synthesis?",
    options: [
      { id: "a", text: "Add 'Do not include any information not provided by subagents' to the synthesis prompt.", correct: false },
      { id: "b", text: "Require every claim in the synthesis to include a source_agent_id citation. Add a validation step that checks each citation against actual subagent outputs. Flag claims with no valid source as potentially hallucinated.", correct: true },
      { id: "c", text: "Reduce the synthesis agent's temperature to 0 to minimize hallucination.", correct: false },
      { id: "d", text: "Have a human review all synthesis output for unsourced claims.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Mandatory source citations with automated validation create a verifiable chain of evidence. Every claim must trace back to a specific subagent's output, and an automated check confirms the citation is valid. Claims without valid sources are flagged, catching hallucinations systematically.",
    whyOthersWrong: {
      a: "Prompt instructions are probabilistic. The model may still introduce unsourced information despite the instruction. Without a validation mechanism, there's no way to detect non-compliance.",
      c: "Temperature 0 reduces sampling randomness but doesn't eliminate hallucination. LLMs can produce hallucinated content even at temperature 0 if the model's reasoning leads there.",
      d: "Human review doesn't scale. For a system producing multiple reports, human review of every claim is expensive and slow. Automated citation validation catches the most detectable hallucinations instantly."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "Requiring subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that downstream agents preserve through synthesis... The importance of structured claim-source mappings that the synthesis agent must preserve and merge when combining findings."
      }
  },
  {
    id: 203,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Customer Support Resolution Agent",
    question: "Your agent handles a conversation where the customer first asks about billing (turn 1-4), then about a technical issue (turn 5-8), then asks a follow-up about the billing issue from earlier (turn 9). The agent gives a contradictory billing answer at turn 9 because it lost track of the turn 1-4 context buried under the technical issue discussion. What context management pattern prevents this?",
    options: [
      { id: "a", text: "Limit conversations to one topic to prevent context interleaving.", correct: false },
      { id: "b", text: "Maintain a structured context state that tracks each topic separately: {billing: {status, last_discussed_turn, key_facts}, technical: {status, last_discussed_turn, key_facts}}. Reference the relevant topic's state when the customer returns to it.", correct: true },
      { id: "c", text: "Summarize the conversation after every 4 turns to compress old context.", correct: false },
      { id: "d", text: "Use a larger context window so all turns fit without compression.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "A structured context state organized by topic preserves key facts for each discussion thread. When the customer returns to billing at turn 9, the agent can reference the billing topic's key_facts to maintain consistency with its earlier statements.",
    whyOthersWrong: {
      a: "Limiting to one topic per conversation is a poor customer experience. Customers naturally raise multiple concerns in one interaction. The system should handle this gracefully.",
      c: "Periodic summarization may lose specific details that matter when the customer returns to a topic. A topic-organized state preserves key facts with full fidelity, not summarized versions.",
      d: "A larger context window helps with total capacity but doesn't solve the attention problem. The model may still pay less attention to turns 1-4 when processing turn 9, especially if turns 5-8 dominate the recent context."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.1",
        quote: "Extracting transactional facts (amounts, dates, order numbers, statuses) into a persistent 'case facts' block included in each prompt, outside summarized history... Extracting and persisting structured issue data (order IDs, amounts, statuses) into a separate context layer for multi-issue sessions."
      }
  },
  {
    id: 204,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Multi-Agent Research System",
    question: "Your research system produces reports that cite sources. A reader flags that two cited sources make contradictory claims but the report treats both as equally authoritative. Source A is a 2024 peer-reviewed study; Source B is a 2020 industry blog post. How should source reliability be handled in the synthesis?",
    options: [
      { id: "a", text: "Automatically exclude non-peer-reviewed sources from the synthesis.", correct: false },
      { id: "b", text: "Include source metadata (publication_date, source_type, peer_reviewed: boolean) in subagent outputs. Instruct the synthesis agent: 'When sources conflict, weight peer-reviewed and recent sources higher. Note the conflict and source quality difference in the report.'", correct: true },
      { id: "c", text: "Present all sources equally and let the reader assess reliability.", correct: false },
      { id: "d", text: "Only cite the most recent source when there are conflicts.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Source metadata enables informed synthesis. When conflicts arise, the synthesis agent can weight sources by reliability indicators (peer review, recency) and transparently note the conflict and source quality difference. This produces authoritative but honest reports.",
    whyOthersWrong: {
      a: "Excluding non-peer-reviewed sources loses valuable industry perspectives. Blog posts, white papers, and industry reports provide practical insights that academic papers may miss. The fix is weighting, not exclusion.",
      c: "Presenting conflicting sources equally without noting their quality difference misleads readers. The 2024 peer-reviewed study and 2020 blog post are not equally authoritative — the report should acknowledge this difference.",
      d: "Recency alone doesn't determine reliability. A well-conducted 2020 study may be more reliable than a 2024 blog post. Both recency and source quality should factor into weighting."
    },
      docStatus: "EXAM_GUIDE",
      docReference: {
        source: "Exam Guide — Task Statement 5.6",
        quote: "Structuring reports with explicit sections distinguishing well-established findings from contested ones, preserving original source characterizations and methodological context... How to handle conflicting statistics from credible sources: annotating conflicts with source attribution rather than arbitrarily selecting one value."
      }
  }
];
