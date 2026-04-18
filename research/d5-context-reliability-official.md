# Domain 5: Context Management & Reliability (15% of CCA Exam)

## Official Documentation Sources

| # | Source URL | Key Topics |
|---|-----------|------------|
| 1 | docs.anthropic.com/en/docs/build-with-claude/context-windows | Context window sizes, context rot, context awareness, compaction |
| 2 | docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices | Long context prompting, position effects, XML structuring, agentic systems |
| 3 | code.claude.com/docs/en/sub-agents | Subagent context isolation, delegation, built-in agents |
| 4 | code.claude.com/docs/en/memory | CLAUDE.md hierarchy, auto memory, compaction survival |
| 5 | code.claude.com/docs/en/skills | Custom commands, /compact behavior, skill lifecycle |
| 6 | anthropic.com/engineering/building-effective-agents | Agent patterns, orchestrator-workers, error handling |
| 7 | anthropic.com/engineering/effective-context-engineering-for-ai-agents | Context rot, strategies, sub-agent architectures |
| 8 | anthropic.com/engineering/effective-harnesses-for-long-running-agents | State persistence, crash recovery, scratchpad files |
| 9 | docs.anthropic.com/en/docs/build-with-claude/compaction | Server-side compaction API, configuration, token tracking |

---

## 1. Context Window Sizes

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-windows

### Model Context Windows

| Model | Context Window | Notes |
|-------|---------------|-------|
| Claude Mythos Preview | 1M tokens | Latest preview model |
| Claude Opus 4.7 | 1M tokens | Most capable GA model |
| Claude Opus 4.6 | 1M tokens | |
| Claude Sonnet 4.6 | 1M tokens | |
| Claude Sonnet 4.5 | 200k tokens | Deprecated predecessor |
| Claude Sonnet 4 | 200k tokens | Deprecated |
| Other Claude models | 200k tokens | Default for non-1M models |

### Image/PDF Limits

- **1M-token models**: Up to 600 images or PDF pages per request
- **200k-token models**: Up to 100 images or PDF pages per request
- May hit request size limits before token limits when sending many images/documents

### Context Window Structure

The context window is the **total text** a model can reference when generating, including the response itself. It serves as "working memory" (distinct from training data). Components:

- **Input phase**: System prompt + tools config + images + conversation history + current user message
- **Output phase**: Generated text response (becomes part of future input)
- **Linear growth**: Each turn accumulates; previous turns are preserved completely

### Context Awareness (Claude Sonnet 4.6, Sonnet 4.5, Haiku 4.5)

These models feature **context awareness** -- they track remaining token budget throughout a conversation.

At conversation start, Claude receives:
```xml
<budget:token_budget>1000000</budget:token_budget>
```

After each tool call, Claude receives an update:
```xml
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

**Benefits**:
- Long-running agent sessions requiring sustained focus
- Multi-context-window workflows where state transitions matter
- Complex tasks requiring careful token management
- Claude persists in tasks until the end rather than guessing remaining tokens

**Analogy**: Without context awareness, it is like competing in a cooking show without a clock.

---

## 2. Context Rot

> **Source:** https://platform.claude.com/docs/en/build-with-claude/context-windows — "Context rot"

### Official Definition

> "As token count grows, accuracy and recall degrade, a phenomenon known as **context rot**."

**Key points** (from official docs):
- This is the official Anthropic term -- NOT "lost in the middle"
- More context is NOT automatically better
- **Curating what's in context is just as important as how much space is available**
- Claude achieves state-of-the-art results on long-context benchmarks (MRCR, GraphWalks), but gains depend on **what's in context**, not just how much fits

### Architectural Explanation

From the context engineering guide:
- Transformer architecture creates n-squared pairwise token relationships
- As context grows, models struggle to capture these relationships effectively
- Position encoding interpolation allows longer sequences but introduces degradation
- LLMs possess limited "attention budget" comparable to human working memory
- Each token depletes this budget, necessitating careful curation

---

## 3. Position Effects

> **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

### Long Context Prompting Rules

From official prompting best practices (applies to 20k+ token inputs):

1. **Put longform data at the top**: Place long documents and inputs near the TOP of the prompt, above queries, instructions, and examples

2. **Queries at the end**: Can improve response quality by **up to 30%** in tests, especially with complex, multi-document inputs

3. **Structure with XML tags**: When using multiple documents, wrap each in `<document>` tags with metadata subtags:
```xml
<documents>
  <document index="1">
    <source>annual_report_2023.pdf</source>
    <document_content>
      {{ANNUAL_REPORT}}
    </document_content>
  </document>
  <document index="2">
    <source>competitor_analysis_q2.xlsx</source>
    <document_content>
      {{COMPETITOR_ANALYSIS}}
    </document_content>
  </document>
</documents>

Analyze the annual report and competitor analysis. Identify strategic 
advantages and recommend Q3 focus areas.
```

4. **Ground responses in quotes**: For long document tasks, ask Claude to quote relevant parts FIRST before carrying out its task. This helps Claude "cut through the noise."

**Quote extraction pattern**:
```xml
Find quotes from the patient records and appointment history that are 
relevant to diagnosing the patient's reported symptoms. Place these in 
<quotes> tags. Then, based on these quotes, list all information that 
would help the doctor diagnose. Place your diagnostic information in 
<info> tags.
```

---

## 4. Context Management Strategies

### Strategy 1: Trim Verbose Tool Outputs

From the context engineering guide:
- **Tool Result Clearing**: Removing raw tool outputs from deep message history is "one of the safest, lightest touch forms of compaction"
- Official API supports this via context editing features

### Strategy 2: Structured Fact Extraction

From prompting best practices:
- Use XML tags to structure document content and metadata
- Use `<document>`, `<document_content>`, and `<source>` subtags
- Nest tags when content has a natural hierarchy

### Strategy 3: Just-In-Time Retrieval

From the context engineering guide:
- Maintain lightweight identifiers (file paths, links) rather than loading everything upfront
- Dynamically load data at runtime using tools
- Hybrid strategies: retrieve some data upfront for speed while enabling autonomous exploration

### Strategy 4: System Prompt Optimization

From the context engineering guide:
- System prompts require "the minimal set of information that fully outlines expected behavior"
- Tools should be self-contained, unambiguous, and minimal in overlap
- Examples should portray canonical behavior patterns rather than exhaustive edge cases

### Strategy 5: Structured Note-Taking

From the context engineering guide:
- Agents maintain persistent external memory (files, to-do lists)
- Pull back into context as needed
- Enables long-horizon coherence across thousands of steps

---

## 5. Progressive Summarization and Its Risks

### How Compaction Summarization Works

Server-side compaction summarizes conversation history when approaching context limits. The default summarization prompt instructs the model to:
- Write a summary with continuity for future contexts
- Document state, next steps, and learnings
- Wrap summary in `<summary></summary>` block

### Risks of Progressive Summarization

**Loss of precision**: Each summarization pass can lose:
- Numerical values and exact figures
- Specific dates and timestamps
- Exact expectations and acceptance criteria
- Precise technical specifications

**From the harnesses guide**: Compaction alone "isn't sufficient." Without structural guidance, agents fail across context windows by:
- Attempting too much simultaneously
- Prematurely declaring projects complete

**Mitigation strategies**:
- Use structured state files (JSON) for precise data that must survive summarization
- Use unstructured text (progress.txt) for general progress notes
- Persist critical facts in external files BEFORE compaction occurs

---

## 6. Compaction

> **Source:** https://platform.claude.com/docs/en/build-with-claude/compaction

### Server-Side Compaction (API)

**Currently in beta** for: Claude Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6

**Required beta header**: `anthropic-beta: compact-2026-01-12`

**Configuration**:
```json
{
  "context_management": {
    "edits": [
      {
        "type": "compact_20260112",
        "trigger": {
          "type": "input_tokens",
          "value": 150000
        }
      }
    ]
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `type` | Required | Must be `"compact_20260112"` |
| `trigger` | 150,000 tokens | When to trigger (minimum 50,000 tokens) |
| `pause_after_compaction` | `false` | Pause after generating summary |
| `instructions` | null | Custom summarization prompt (replaces default entirely) |

**Process flow**:
1. Detects when input tokens exceed trigger threshold
2. Generates summary of current conversation
3. Creates a `compaction` block containing the summary
4. On subsequent requests, API automatically drops all message blocks PRIOR to the compaction block

**Compaction block format**:
```json
{
  "content": [
    {
      "type": "compaction",
      "content": "Summary of the conversation: [summary text]"
    },
    {
      "type": "text",
      "text": "Based on our conversation so far..."
    }
  ]
}
```

**Critical**: You must pass the compaction block back on subsequent requests.

**Token tracking**: Top-level `input_tokens` and `output_tokens` do NOT include compaction costs. Sum across all `usage.iterations`:
```json
{
  "usage": {
    "input_tokens": 23000,
    "output_tokens": 1000,
    "iterations": [
      { "type": "compaction", "input_tokens": 180000, "output_tokens": 3500 },
      { "type": "message", "input_tokens": 23000, "output_tokens": 1000 }
    ]
  }
}
```

**Total billed**: Sum all iterations (180K + 3.5K + 23K + 1K = 207.5K)

### The /compact Command (Claude Code)

In Claude Code, `/compact` triggers context compaction within a session.

**What survives compaction in Claude Code**:
- Project-root CLAUDE.md: re-read from disk and re-injected after /compact
- Nested CLAUDE.md files in subdirectories: NOT re-injected automatically; reload when Claude reads files in that subdirectory
- Invoked skills: re-attached after summary (first 5,000 tokens each, combined budget 25,000 tokens, filled starting from most recently invoked)
- Conversation-only instructions: LOST unless saved to CLAUDE.md

### When to Start Fresh vs. Compact

From official prompting best practices:

> "When a context window is cleared, consider starting with a brand new context window rather than using compaction. Claude's latest models are extremely effective at discovering state from the local filesystem."

**Start fresh when**:
- State is well-persisted in files (progress.txt, tests.json, git logs)
- Compaction has accumulated too many layers of summarization
- Claude can rediscover context from the filesystem

**Use compaction when**:
- Conversation context contains information not persisted elsewhere
- Mid-task continuity is critical
- Starting fresh would lose important conversational context

**Fresh start prescription** (from official docs):
- "Call pwd; you can only read and write files in this directory."
- "Review progress.txt, tests.json, and the git logs."
- "Manually run through a fundamental integration test before moving on to implementing new features."

### Prompt Caching Integration

Compaction works with prompt caching. Add `cache_control` to compaction blocks:
```json
{
  "role": "assistant",
  "content": [
    {
      "type": "compaction",
      "content": "[summary]",
      "cache_control": { "type": "ephemeral" }
    }
  ]
}
```

Best practice: Cache system prompts separately to preserve cache hits across compactions.

---

## 7. Scratchpad Files and State Persistence

> **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices — "Agentic coding best practices"

### The progress.txt Pattern

From official prompting best practices and the harnesses guide:

```text
// Progress notes (progress.txt)
Session 3 progress:
- Fixed authentication token validation
- Updated user model to handle edge cases
- Next: investigate user_management test failures (test #2)
- Note: Do not remove tests as this could lead to missing functionality
```

### Structured State Files (tests.json / feature_list.json)

```json
{
  "tests": [
    { "id": 1, "name": "authentication_flow", "status": "passing" },
    { "id": 2, "name": "user_management", "status": "failing" },
    { "id": 3, "name": "api_endpoints", "status": "not_started" }
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

**Key rule from docs**: "We prompt coding agents to edit this file only by changing the status of a passes field" and "It is unacceptable to remove or edit tests."

### State Management Best Practices (Official)

| Type | Format | Use For |
|------|--------|---------|
| Structured state | JSON (tests.json, feature_list.json) | Test results, task status, schema-bound data |
| Unstructured notes | Text (progress.txt) | General progress, context, next steps |
| Version control | Git commits | Checkpoints, rollback, history of changes |
| Setup scripts | Shell (init.sh) | Eliminating repeated server startup overhead |

### Multi-Context Window Workflow (Official Pattern)

1. **First context window**: Set up framework (write tests, create setup scripts)
2. **Subsequent windows**: Iterate on a todo-list
3. **Have model write tests in structured format**: Create tests before starting work, keep track in structured format (e.g., `tests.json`)
4. **Set up quality of life tools**: Create `init.sh` to start servers, run test suites, linters
5. **Provide verification tools**: Playwright MCP, computer use for testing UIs
6. **Encourage complete usage**: "Continue working systematically until you have completed this task"

### Context Awareness Prompt Pattern (Official)

```text
Your context window will be automatically compacted as it approaches its 
limit, allowing you to continue working indefinitely from where you left 
off. Therefore, do not stop tasks early due to token budget concerns. As 
you approach your token budget limit, save your current progress and state 
to memory before the context window refreshes. Always be as persistent and 
autonomous as possible and complete tasks fully, even if the end of your 
budget is approaching. Never artificially stop any task early regardless 
of the context remaining.
```

---

## 8. Subagent Delegation for Context

> **Source:** https://code.claude.com/docs/en/sub-agents

### Core Concept

> "Use [a subagent] when a side task would flood your main conversation with search results, logs, or file contents you won't reference again: the subagent does that work in its own context and returns only the summary."

Each subagent runs in **its own context window** with:
- Custom system prompt
- Specific tool access
- Independent permissions

### Built-in Subagents

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| **Explore** | Haiku (fast) | Read-only | File discovery, code search, codebase exploration |
| **Plan** | Inherits | Read-only | Codebase research for planning |
| **general-purpose** | Inherits | All tools | Complex research, multi-step operations, code modifications |

**Explore thoroughness levels**: quick, medium, very thorough

**Key constraint**: Subagents cannot spawn other subagents (prevents infinite nesting).

### Context Benefits of Subagents

- **Preserve context**: Exploration and implementation stay out of main conversation
- **Return summaries**: Subagents return condensed results (from context engineering guide: 1,000-2,000 tokens) to the main agent
- **Enforce constraints**: Limit tools to prevent unwanted side effects
- **Control costs**: Route to cheaper/faster models (e.g., Haiku for Explore)

### Subagent Orchestration Guidance (Official)

From prompting best practices:

```text
Use subagents when tasks can run in parallel, require isolated context, 
or involve independent workstreams that don't need to share state. For 
simple tasks, sequential operations, single-file edits, or tasks where 
you need to maintain context across steps, work directly rather than 
delegating.
```

**Warning**: Claude Opus 4.6 has "a strong predilection for subagents and may spawn them in situations where a simpler, direct approach would suffice."

### Subagent Persistent Memory

Subagents can maintain their own auto memory with three scopes:

| Scope | Location | Use When |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings apply across all projects |
| `project` | `.claude/agent-memory/<name>/` | Knowledge is project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, not for version control |

When memory is enabled, the first 200 lines or 25KB of MEMORY.md is loaded at subagent startup.

---

## 9. Crash Recovery and State Persistence

### Two-Agent Architecture (from Harnesses Guide)

1. **Initializer Agent**: First session only, sets up foundation (tests, scripts, framework)
2. **Coding Agent**: Subsequent sessions, makes incremental progress

### Session Startup Sequence (Recovery Pattern)

1. Run `pwd` to confirm working directory
2. Read git logs and progress files
3. Review feature list and select highest-priority incomplete feature
4. Start development server
5. Execute basic end-to-end verification test before new work

**Quote from docs**: "This approach saves Claude some tokens in every session since it doesn't have to figure out how to test."

### Git as Recovery Mechanism

- Agents commit after each feature with descriptive messages
- Enables rollback of failed implementations
- Provides a log of what has been done
- Creates checkpoints that can be restored
- Claude's latest models "perform especially well in using git to track state across multiple sessions"

### State Validation on Recovery

- Sessions begin by running basic functionality tests against the development server
- Identifies and repairs undocumented breakage from prior sessions
- Uses browser automation tools (Puppeteer MCP) to verify features end-to-end

### CLAUDE.md Memory Hierarchy for Recovery

| Scope | Location | Shared With |
|-------|----------|-------------|
| Managed policy | OS-specific system path | All users in organization |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via source control |
| User | `~/.claude/CLAUDE.md` | Just you (all projects) |
| Local | `./CLAUDE.local.md` | Just you (current project) |

Auto memory stored at: `~/.claude/projects/<project>/memory/`
- `MEMORY.md` entrypoint (first 200 lines or 25KB loaded per session)
- Topic files (debugging.md, api-conventions.md, etc.) loaded on demand
- Machine-local; all worktrees within same git repo share one auto memory directory

---

## 10. Escalation Patterns

### Official Agent Architecture (from Building Effective Agents)

Anthropic distinguishes:
- **Workflows**: LLMs and tools orchestrated through **predefined code paths**
- **Agents**: LLMs **dynamically direct** their own processes and tool usage

### When to Use Agents vs. Workflows

**Use agents for**:
- Open-ended problems with unpredictable step counts
- Tasks impossible to hardcode with fixed paths
- Situations requiring model decision-making at scale
- Trusted environments where autonomy adds value

**Avoid agents when**: "For many applications, optimizing single LLM calls with retrieval and in-context examples is usually enough."

### Escalation Criteria (from Official Patterns)

**Explicit criteria-based escalation** (NOT sentiment-based):
- Agent pauses for human feedback at **checkpoints** or **blockers**
- Include **stopping conditions** (maximum iterations) for safety
- Agents obtain "ground truth from the environment at each step"

**Routing pattern**: Classifies inputs and directs to specialized handlers. Enables separation of concerns and specialized prompts.

**Evaluator-Optimizer pattern**: One LLM generates, another provides iterative feedback. Effective when clear evaluation criteria exist.

### Autonomy and Safety Balance (Official)

```text
Consider the reversibility and potential impact of your actions. You are 
encouraged to take local, reversible actions like editing files or running 
tests, but for actions that are hard to reverse, affect shared systems, or 
could be destructive, ask the user before proceeding.

Examples of actions that warrant confirmation:
- Destructive operations: deleting files or branches, dropping database 
  tables, rm -rf
- Hard to reverse operations: git push --force, git reset --hard, 
  amending published commits
- Operations visible to others: pushing code, commenting on PRs/issues, 
  sending messages, modifying shared infrastructure
```

---

## 11. Error Propagation

### Structured Error Context Pattern

When errors occur in agent systems, propagate structured context including:

| Field | Description |
|-------|-------------|
| **Failure type** | Classification of what went wrong |
| **Attempted query** | What the agent was trying to do |
| **Partial results** | Any data retrieved before failure |
| **Recovery action** | What was attempted to fix it |

### Access Failures vs. Valid Empty Results

Critical distinction:
- **Access failure**: Tool could not reach the data source (network error, permission denied, timeout)
- **Valid empty result**: Tool successfully queried but found no matching data

These require different handling: access failures should trigger retry/escalation; valid empty results are legitimate answers.

### Local Recovery Before Escalation

From Building Effective Agents:
- Agents should attempt recovery locally before escalating
- "Poka-yoke" principles: design interfaces to reduce mistake likelihood
- Example: requiring absolute filepaths eliminated relative path errors in SWE-bench
- Extensive testing in sandboxed environments with "appropriate guardrails"
- Potential for "compounding errors" in autonomous systems requires careful design

### Error Handling in Tool Use

From prompting best practices:
- After receiving tool results, "carefully reflect on their quality and determine optimal next steps before proceeding"
- Use thinking to plan and iterate based on new information
- Self-check pattern: "Before you finish, verify your answer against [test criteria]"

---

## 12. Human Review Workflows

### Field-Level Confidence

When Claude extracts structured data, assign confidence at the field level:
- High confidence: directly stated, unambiguous
- Medium confidence: inferred from context, partially stated
- Low confidence: speculative, conflicting sources

### Stratified Random Sampling

For quality assurance of AI outputs:
- Sample from different confidence tiers
- Higher sampling rate for low-confidence outputs
- Lower sampling rate for high-confidence routine extractions

### Accuracy Segmentation

Segment accuracy metrics by:
- **Document type**: Different document formats have different extraction reliability
- **Field type**: Names vs. numbers vs. dates vs. free text
- **Source quality**: OCR quality, formatting consistency

### Code Review Pattern (from Official Docs)

Claude Opus 4.7 has improved bug-finding (11pp better recall on hard bug-finding evals). For review harnesses:

```text
Report every issue you find, including ones you are uncertain about or 
consider low-severity. Do not filter for importance or confidence at this 
stage - a separate verification step will do that. Your goal here is 
coverage: it is better to surface a finding that later gets filtered out 
than to silently drop a real bug. For each finding, include your 
confidence level and an estimated severity so a downstream filter can 
rank them.
```

**Key insight**: Separate the finding step (maximize recall) from the filtering step (maximize precision). Moving confidence filtering out of the finding step often helps.

---

## 13. Information Provenance

### Claim-Source Mappings

When synthesizing information from multiple sources:
- Track which claims come from which sources
- Use XML tags to maintain provenance:
```xml
<documents>
  <document index="1">
    <source>annual_report_2023.pdf</source>
    <document_content>...</document_content>
  </document>
</documents>
```

### Conflicting Statistics Annotation

When sources disagree:
- Note the conflict explicitly
- Report each source's claim with attribution
- Do not silently pick one value

### Temporal Data

Track publication dates and temporal relevance:
- Note when data was published or collected
- Flag potentially outdated information
- Consider recency when synthesizing

### Coverage Gap Reporting

Report what was NOT found as well as what was:
- Identify expected information that is missing from sources
- Flag areas where sources are incomplete
- Distinguish between "not found" and "confirmed absent"

### Research Best Practices (Official)

From prompting best practices:
```text
Search for this information in a structured way. As you gather data, 
develop several competing hypotheses. Track your confidence levels in 
your progress notes to improve calibration. Regularly self-critique 
your approach and plan. Update a hypothesis tree or research notes 
file to persist information and provide transparency. Break down this 
complex research task systematically.
```

### Minimizing Hallucinations (Official)

```xml
<investigate_before_answering>
Never speculate about code you have not opened. If the user references 
a specific file, you MUST read the file before answering. Make sure to 
investigate and read relevant files BEFORE answering questions about the 
codebase. Never make any claims about code before investigating unless 
you are certain of the correct answer - give grounded and 
hallucination-free answers.
</investigate_before_answering>
```

---

## 14. Extended Thinking and Context

### How Thinking Affects Context

- All input and output tokens (including thinking) count toward the context window limit
- **Previous thinking blocks are automatically stripped** from context window calculation by the API
- You do NOT need to strip thinking blocks yourself; the API does it automatically
- Thinking tokens are billed as output tokens only once during generation

**Effective context formula**:
```
context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens
```

### Thinking with Tool Use (Special Case)

When tool use is active:
- Thinking block **must** be returned with corresponding tool results (the only case where you have to return thinking blocks)
- After tool results are passed back, Claude responds with only text (no additional thinking until next user message)
- API returns error if thinking blocks are modified (cryptographic signatures verify authenticity)
- After tool use cycle completes, thinking block can be dropped

### Claude 4 Interleaved Thinking

Claude 4 models support **interleaved thinking**: Claude can think between tool calls, enabling more sophisticated reasoning after receiving tool results. Claude Sonnet 3.7 does NOT support interleaved thinking.

---

## 15. Newer Model Behaviors

### Validation Errors (Not Silent Truncation)

Newer Claude models (starting with Sonnet 3.7) return a **validation error** when prompt and output tokens exceed the context window, rather than silently truncating.

### Token Counting API

Use the token counting API (`/v1/messages/count_tokens`) to estimate token usage before sending messages. Helps plan and stay within limits.

### Prefilled Responses Deprecated

Starting with Claude 4.6 models and Mythos Preview, prefilled responses on the last assistant turn are no longer supported. On Mythos Preview, requests with prefilled assistant messages return a 400 error.

**Migration alternatives**:
- **Format control**: Use Structured Outputs feature
- **Eliminating preambles**: Direct instructions in system prompt
- **Continuations**: Move to user message with context from interrupted response
- **Context hydration**: Inject as user turn or hydrate via tools during compaction

---

## 16. Agent Workflow Patterns (from Building Effective Agents)

### Pattern Reference Table

| Pattern | Description | Best For |
|---------|-------------|----------|
| **Prompt Chaining** | Sequential steps, each processing prior outputs | Fixed subtasks requiring accuracy |
| **Routing** | Classify inputs, direct to specialized handlers | Separation of concerns |
| **Parallelization (Sectioning)** | Break independent subtasks for parallel execution | Independent work streams |
| **Parallelization (Voting)** | Run identical tasks multiple times | Diverse output generation |
| **Orchestrator-Workers** | Central LLM dynamically delegates to worker LLMs | Dynamic task decomposition |
| **Evaluator-Optimizer** | One LLM generates, another provides feedback loops | Iterative refinement with clear criteria |
| **Autonomous Agents** | LLMs dynamically direct their own processes | Open-ended problems |

### Tool Design Principles

From Building Effective Agents:
- Provide adequate tokens for model reasoning before execution
- Keep formats consistent with natural internet text patterns
- Eliminate formatting overhead (counting lines, string escaping)
- Include example usage and edge cases in tool definitions
- Clarify parameter names and descriptions
- Test extensively with multiple inputs
- Apply **Poka-yoke** principles to reduce mistake likelihood

**Real-world example**: During SWE-bench, team "spent more time optimizing tools than the overall prompt." Requiring absolute filepaths eliminated relative path errors.

---

## Quick Reference: Key Numbers for Exam

| Fact | Value |
|------|-------|
| 1M context window models | Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6 |
| 200k context window models | Sonnet 4.5, Sonnet 4, and other older models |
| Position effect improvement | Up to 30% (queries at end of long documents) |
| Images per request (1M models) | 600 |
| Images per request (200k models) | 100 |
| Compaction trigger minimum | 50,000 tokens |
| Compaction trigger default | 150,000 tokens |
| Auto memory loaded per session | First 200 lines or 25KB of MEMORY.md |
| Skill re-attach budget after compaction | 25,000 tokens total, 5,000 per skill |
| CLAUDE.md recommended max | Under 200 lines |
| Skill description character cap | 1,536 characters |
| Opus 4.7 bug-finding improvement | 11pp better recall |
| Context rot definition | Accuracy/recall degrade as token count grows |
| Subagent summary return size | 1,000-2,000 tokens (from context engineering guide) |
| Compaction beta header | `anthropic-beta: compact-2026-01-12` |
| Compaction type string | `compact_20260112` |
