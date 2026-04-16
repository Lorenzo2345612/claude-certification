# Documentation Quotes for Questions 305-331

Part 6 — Agentic Architecture (D1) and Prompt Engineering (D4)

---

## Q305: Parallel subagent delegation for independent tasks
```json
{
  "id": 305,
  "source": "Anthropic Docs — Prompting best practices (Optimize parallel tool calling)",
  "quote": "Claude's latest models excel at parallel tool execution. These models will: Run multiple speculative searches during research, Read several files at once to build context faster, Execute bash commands in parallel (which can even bottleneck system performance). This behavior is easily steerable. While the model has a high success rate in parallel tool calling without prompting, you can boost this to ~100% or adjust the aggression level.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```
Supporting: Subagents doc — "For independent investigations, spawn multiple subagents to work simultaneously... Each subagent explores its area independently, then Claude synthesizes the findings. This works best when the research paths don't depend on each other." (https://code.claude.com/docs/en/subagents)

---

## Q306: Iterative refinement loop for coverage gaps
```json
{
  "id": 306,
  "source": "Anthropic Docs — Prompting best practices (Self-correction pattern)",
  "quote": "The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q307: Decompose multi-concern request (refund + replacement)
```json
{
  "id": 307,
  "source": "Exam Guide — Task Statement 1.2 (Task decomposition)",
  "quote": "Decompose multi-part customer requests into distinct, investigable items; investigate each with shared context; synthesize a unified resolution addressing every concern before responding.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q308: Tool call interception hook for $500 refund threshold
```json
{
  "id": 308,
  "source": "Anthropic Docs — Hooks (PreToolUse decision control)",
  "quote": "PreToolUse hooks can control whether a tool call proceeds. Unlike other hooks that use a top-level decision field, PreToolUse returns its decision inside a hookSpecificOutput object. This gives it richer control: four outcomes (allow, deny, ask, or defer) plus the ability to modify tool input before execution.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Q309: Dynamic coordinator routing based on query complexity
```json
{
  "id": 309,
  "source": "Anthropic Docs — Subagents (Choose between subagents and main conversation)",
  "quote": "Use subagents when: The task produces verbose output you don't need in your main context; You want to enforce specific tool restrictions or permissions; The work is self-contained and can return a summary. Use the main conversation when: You're making a quick, targeted change; Latency matters. Subagents start fresh and may need time to gather context.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```

---

## Q310: fork_session for divergent exploration from shared baseline
```json
{
  "id": 310,
  "source": "Anthropic Docs — Agent SDK Sessions (Fork to explore alternatives)",
  "quote": "Forking creates a new session that starts with a copy of the original's history but diverges from that point. The fork gets its own session ID; the original's ID and history stay unchanged. You end up with two independent sessions you can resume separately.",
  "url": "https://code.claude.com/docs/en/agent-sdk/sessions",
  "status": "STRONG"
}
```

---

## Q311: Informing the agent of specific file changes on resume
```json
{
  "id": 311,
  "source": "Anthropic Docs — Agent SDK Sessions (Resume by ID)",
  "quote": "Pass a session ID to resume to return to that specific session. The agent picks up with full context from wherever the session left off. Common reasons to resume: Follow up on a completed task. The agent already analyzed something; now you want it to act on that analysis without re-reading files.",
  "url": "https://code.claude.com/docs/en/agent-sdk/sessions",
  "status": "PARTIAL"
}
```

---

## Q312: Dynamic task decomposition for legacy test-coverage work
```json
{
  "id": 312,
  "source": "Exam Guide — Task Statement 1.2 (Open-ended task decomposition)",
  "quote": "Open-ended engineering tasks (e.g., adding tests to a legacy codebase) require dynamic decomposition: first map the codebase structure, identify high-impact areas, then create a prioritized, adaptive plan that evolves as dependencies and complexities are discovered.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q313: Structured context passing between subagents with metadata
```json
{
  "id": 313,
  "source": "Anthropic Docs — Prompting best practices (Long context prompting)",
  "quote": "Structure document content and metadata with XML tags: When using multiple documents, wrap each document in <document> tags with <document_content> and <source> (and other metadata) subtags for clarity.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q314: Goal-oriented coordinator prompts vs procedural
```json
{
  "id": 314,
  "source": "Anthropic Docs — Prompting best practices (Subagent orchestration)",
  "quote": "Use subagents when tasks can run in parallel, require isolated context, or involve independent workstreams that don't need to share state. For simple tasks, sequential operations, single-file edits, or tasks where you need to maintain context across steps, work directly rather than delegating.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```
Additional support: "Be specific about the desired output format and constraints. Provide instructions as sequential steps using numbered lists or bullet points when the order or completeness of steps matters." — but the exam-guide concept is that goal-oriented prompts enable adaptability (EXAM_GUIDE for the contrast).

---

## Q315: Escalate when policy is ambiguous or silent
```json
{
  "id": 315,
  "source": "Exam Guide — Task Statement 1.3 (Escalation triggers)",
  "quote": "Escalate to a human agent when the governing policy is ambiguous, silent on the customer's specific request, or requires judgment beyond the agent's documented authority. Do not apply tangentially related policies or make unauthorized discretionary decisions.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q316: PostToolUse hook normalizes heterogeneous data formats
```json
{
  "id": 316,
  "source": "Anthropic Docs — Hooks (PostToolUse)",
  "quote": "PostToolUse runs immediately after a tool completes successfully. It receives both the input sent to the tool and the result it returned. PostToolUse hooks can provide feedback to Claude after tool execution.",
  "url": "https://code.claude.com/docs/en/hooks",
  "status": "STRONG"
}
```

---

## Q317: Frustration plus consent to proceed — do not escalate
```json
{
  "id": 317,
  "source": "Exam Guide — Task Statement 1.3 (Escalation triggers)",
  "quote": "Customer sentiment alone is not a reliable escalation trigger. When a customer expresses frustration but gives explicit consent to proceed ('just fix it'), acknowledge the frustration while offering resolution; escalate only when the customer explicitly requests a human or the issue exceeds the agent's documented capability.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q318: Separate cross-file integration pass after per-file analysis
```json
{
  "id": 318,
  "source": "Anthropic Docs — Subagents (Chain subagents)",
  "quote": "For multi-step workflows, ask Claude to use subagents in sequence. Each subagent completes its task and returns results to Claude, which then passes relevant context to the next subagent.",
  "url": "https://code.claude.com/docs/en/subagents",
  "status": "PARTIAL"
}
```
Note: The two-phase (per-file → integration) decomposition pattern is primarily an exam-guide concept (Task Statement 1.2).

---

## Q319: 'other' + detail pattern for open-ended enum categories
```json
{
  "id": 319,
  "source": "Anthropic Docs — Structured Outputs (enum limitations)",
  "quote": "enum (strings, numbers, bools, or nulls only - no complex types). Enum values are limited to primitive types only—complex objects cannot be enum values.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "PARTIAL"
}
```
Note: The specific 'other' + companion detail string extensibility pattern is an exam-guide convention (Task Statement 4.2).

---

## Q320: Retry-with-error-feedback for validation failures
```json
{
  "id": 320,
  "source": "Anthropic Docs — Prompting best practices (Code review harnesses / iteration)",
  "quote": "We recommend iterating on prompts against a subset of your evals or test cases to validate recall or F1 score gains.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```
Supporting (exam guide): Validation retry prompts must include the original input, the failed output, and the specific validation error to enable targeted self-correction. Generic retry prompts lack the information needed.

---

## Q321: Retries cannot create missing source data
```json
{
  "id": 321,
  "source": "Exam Guide — Task Statement 4.2 (Validation retry limits)",
  "quote": "Retries are ineffective when the required information is absent from the provided source. The model cannot extract what does not exist; the remedy is to supply the missing source material or redesign the schema to make the field optional/nullable.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q322: Replace vague review criteria with explicit categorical rules
```json
{
  "id": 322,
  "source": "Anthropic Docs — Prompting best practices (Code review harnesses)",
  "quote": "If you do want the model to self-filter in a single pass, be concrete about where the bar is rather than using qualitative terms like 'important' — for example, 'report any bugs that could cause incorrect behavior, a test failure, or a misleading result; only omit nits like pure style or naming preferences.'",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q323: Explicit severity criteria with concrete examples
```json
{
  "id": 323,
  "source": "Anthropic Docs — Prompting best practices (Use examples effectively)",
  "quote": "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "STRONG"
}
```

---

## Q324: tool_choice 'any' + strict:true for guaranteed structured output
```json
{
  "id": 324,
  "source": "Anthropic Docs — Define tools (Forcing tool use)",
  "quote": "Guaranteed tool calls with strict tools: Combine tool_choice: {\"type\": \"any\"} with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema. Set strict: true on your tool definitions to enable schema validation.",
  "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools",
  "status": "STRONG"
}
```

---

## Q325: Required fields force fabrication — make nullable
```json
{
  "id": 325,
  "source": "Anthropic Docs — Structured Outputs (required vs optional fields)",
  "quote": "required and additionalProperties (must be set to false for objects). All properties not in the required array become optional fields that count toward the 24-parameter complexity limit.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs",
  "status": "PARTIAL"
}
```
Note: The specific "required fields force fabrication when data is absent" insight is primarily exam-guide content (Task Statement 4.2).

---

## Q326: Include prior findings in context to avoid duplicate CI review comments
```json
{
  "id": 326,
  "source": "Exam Guide — Task Statement 4.3 (CI review deduplication)",
  "quote": "When re-running automated code review, include prior review findings in the prompt context and instruct Claude to report only new or still-unaddressed issues. This allows the model to distinguish resolved, persisting, and new issues semantically rather than via text matching.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q327: CLAUDE.md supplies project context to CI-invoked Claude Code
```json
{
  "id": 327,
  "source": "Anthropic Docs — Memory (CLAUDE.md files)",
  "quote": "CLAUDE.md files are markdown files that give Claude persistent instructions for a project, your personal workflow, or your entire organization. You write these files in plain text; Claude reads them at the start of every session. Create this file and add instructions that apply to anyone working on the project: build and test commands, coding standards, architectural decisions, naming conventions, and common workflows.",
  "url": "https://code.claude.com/docs/en/memory",
  "status": "STRONG"
}
```

---

## Q328: Normalization rules in prompt for heterogeneous source formats
```json
{
  "id": 328,
  "source": "Anthropic Docs — Prompting best practices (Be clear and direct)",
  "quote": "Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. If you want 'above and beyond' behavior, explicitly request it rather than relying on the model to infer this from vague prompts.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  "status": "PARTIAL"
}
```
Note: The specific pattern of combining normalization rules in the prompt with a strict output schema is an exam-guide extraction convention.

---

## Q329: Analyze dismissed-finding patterns to refine prompts
```json
{
  "id": 329,
  "source": "Exam Guide — Task Statement 4.3 (Iterative prompt refinement from feedback)",
  "quote": "Structured findings with pattern-level metadata enable systematic analysis of false positives. By identifying which specific detected patterns correlate with dismissals, prompts can be refined to distinguish genuine issues from acceptable patterns rather than applying blanket suppression.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q330: Self-review bias — use independent review instance
```json
{
  "id": 330,
  "source": "Exam Guide — Task Statement 4.4 (Self-review limitations)",
  "quote": "Self-review within the same session suffers from reasoning bias: the model retains its original generation context and is less likely to question its own decisions. Independent review instances without the prior reasoning context are more effective at catching subtle issues.",
  "url": "Claude Certified Architect – Foundations Certification Exam Guide",
  "status": "EXAM_GUIDE"
}
```

---

## Q331: Sample-first prompt refinement before Message Batches submission
```json
{
  "id": 331,
  "source": "Anthropic Docs — Batch processing (Message Batches API)",
  "quote": "The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of Messages requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput.",
  "url": "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
  "status": "PARTIAL"
}
```
Supporting: Prompting best practices — "We recommend iterating on prompts against a subset of your evals or test cases to validate recall or F1 score gains." (https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices) — this sample-first refinement pattern combined with batch processing economics is covered in the exam guide (Task Statement 4.5).

---

# Summary

- STRONG (direct doc support): Q305, Q306, Q308, Q310, Q313, Q316, Q322, Q323, Q324, Q327
- PARTIAL (doc principle + exam-guide specifics): Q309, Q311, Q314, Q318, Q319, Q320, Q325, Q328, Q331
- EXAM_GUIDE only: Q307, Q312, Q315, Q317, Q321, Q326, Q329, Q330
- NO_DOC: (none)

Key source pages used:
- https://code.claude.com/docs/en/subagents (parallel subagents, chain subagents, isolated context)
- https://code.claude.com/docs/en/hooks (PreToolUse deny/allow/ask/defer, PostToolUse feedback)
- https://code.claude.com/docs/en/agent-sdk/sessions (fork_session, resume, continue)
- https://code.claude.com/docs/en/memory (CLAUDE.md project context for CI)
- https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools (tool_choice any/auto/tool/none, strict combination)
- https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs (strict mode, enum primitives, required fields)
- https://docs.anthropic.com/en/docs/build-with-claude/batch-processing (50% cost savings, async)
- https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices (parallel tool calls, self-correction chaining, be specific, examples, code review harness concreteness)
