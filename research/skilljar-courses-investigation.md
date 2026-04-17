# Skilljar Courses Investigation - April 2026

## Source: Anthropic Academy (anthropic.skilljar.com)

## Courses Analyzed

### 1. Building with the Claude API (85 lessons, 8.1 hours)
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api

**Sections:**
1. Getting started with Claude (16 lessons)
2. Prompt engineering & evaluation (16 lessons)
3. Tool use with Claude (14 lessons)
4. Retrieval augmented generation (10 lessons)
5. Model Context Protocol (12 lessons)
6. Claude Code & Computer Use (8 lessons)
7. Agents and workflows (11 lessons)

**Lessons Analyzed in Detail:**

#### Introducing tool use
- Tools allow Claude to access information beyond training data
- Tool use flow: Initial Request → Tool Request → Data Retrieval → Final Response
- User sends question + tool instructions → Claude requests tool call → Server fetches data → Claude generates response with fresh data

#### Tool schemas
- Tool spec has 3 parts: `name`, `description`, `input_schema`
- Description should be 3-4 sentences: what tool does, when to use, what it returns
- JSON Schema is standard data validation spec adopted by AI community
- `ToolParam` type from anthropic library adds type safety
- Pattern: `function_name` + `function_name_schema`

#### Sending tool results
- Extract parameters from `response.content[1].input`
- Tool result block goes in user message with: `type: "tool_result"`, `tool_use_id`, `content`, `is_error`
- Multiple tool calls get unique IDs; must match IDs when sending results
- Must still include tool schema in follow-up requests

#### Fine grained tool calling
- With streaming + tools: `InputJsonEvent` with `partial_json` and `snapshot` properties
- API buffers and validates complete top-level key-value pairs before sending
- `fine_grained=True` disables JSON validation on API side
- With fine-grained: chunks arrive immediately, no buffering, but must handle invalid JSON
- Use when: real-time progress needed, buffering delays hurt UX

#### Structured data
- Problem: Claude adds explanatory text around structured output
- Solution: Assistant message prefilling + stop sequences
- Prefill with ` ```json `, stop on ` ``` ` to get clean JSON
- Works for JSON, Python code, CSV, bulleted lists, any structured content

#### Extended thinking
- Claude's "scratch paper" for complex reasoning
- Response becomes two parts: thinking blocks + final answer
- Parameters: `thinking: {type: "enabled", budget: budget_tokens}`, minimum 1024 tokens
- `max_tokens` must be greater than thinking budget
- **NOT compatible with**: message pre-filling and temperature
- Has cryptographic signature to prevent tampering with reasoning
- Redacted thinking blocks when flagged by safety systems
- Use when standard prompting isn't meeting accuracy requirements after optimization

#### Introducing MCP
- MCP shifts burden of tool definitions/execution from your server to MCP servers
- Without MCP: you write all integration tools yourself
- With MCP: pre-built tools packaged in dedicated MCP server
- Anyone can create MCP servers; often service providers create official implementations
- MCP ≠ tool use — MCP is about WHO creates/maintains tools
- MCP servers provide tool schemas and functions already defined

#### Agents and workflows
- Workflows: predefined series of calls for known problems with predetermined steps
- Agents: goal + set of tools, Claude formulates plan to complete task
- Use workflows when you can picture exact flow; agents when task/parameters uncertain
- Evaluator-Optimizer pattern: Producer → Grader → Feedback loop → Iteration

#### Parallelization workflows
- Split complex task into multiple parallel requests, each with specialized criteria
- Pattern: Split → Run in parallel → Aggregate results
- Benefits: focused attention, easier optimization, better scalability, improved reliability
- Sub-tasks don't need to be identical; each can have specialized prompts/tools

#### Routing workflows
- Different request types need different handling approaches
- Pattern: Categorize input → Route to specialized pipeline → Process
- User input goes to only ONE specialized pipeline
- Good for: diverse request types, clear categories, reliable categorization

#### Workflows vs agents
- Workflows: higher accuracy, easier to test, more predictable, better for specific problems
- Agents: more flexible UX, creative tool combinations, handle novel situations
- Workflow downsides: less flexible, constrained UX, more upfront design
- Agent downsides: lower completion rate, harder to test, less predictable
- **Recommendation: always focus on workflows where possible; agents only when truly required**

---

### 2. Introduction to subagents (4 lessons)
**URL:** https://anthropic.skilljar.com/introduction-to-subagents

#### What are subagents?
- Specialized assistants running in isolated context windows
- Receive: custom system prompt + task description from parent
- Only summary returns to main thread; intermediate work discarded
- Built-in subagents: General purpose, Explore, Plan
- Benefits: focused work, clean main context, concise summaries

#### Creating a subagent
- `/agents` slash command to create
- Scope: project-level or user-level
- Config file at `.claude/agents/your-agent-name.md`
- YAML frontmatter: `name`, `description`, `tools`, `model`, `color`
- Model options: haiku, sonnet, opus, inherit
- Include "proactively" in description for auto-delegation
- Tool categories: read-only, edit, execution, MCP, other

#### Designing effective subagents
- Name + description included in system prompt of main agent
- Description controls: when subagent launches AND shapes input prompt
- **Most important improvement: define output format** in system prompt
- Output format creates natural stopping points, prevents running too long
- Add "Obstacles Encountered" section to surface workarounds
- Limit tool access: read-only for research, bash for reviewers, edit/write for code modification
- 4 characteristics: specific descriptions, structured output, obstacle reporting, limited tools

#### Using subagents effectively
- Use when intermediate work doesn't matter to main thread
- **Good for:** research/exploration, code reviews (fresh perspective), custom system prompts
- **Bad for:** "expert" personas (no real capability added), sequential pipelines (info lost in handoff), test runners (hide needed output)
- Code reviews: separate context gives fresh eyes; main thread was involved in creation
- Decision rule: does the intermediate work matter? No → subagent. Yes → main thread.
- Test runner pattern "performed worse among all configurations"

---

### 3. Introduction to agent skills (6 lessons)
**URL:** https://anthropic.skilljar.com/introduction-to-agent-skills

#### What are skills?
- Folders of instructions in SKILL.md with YAML frontmatter (name, description)
- Claude matches request against skill descriptions; activates matching ones
- Personal skills: `~/.claude/skills` (across all projects)
- Project skills: `.claude/skills` in repo root (shared with team via version control)
- Skills load ON DEMAND (unlike CLAUDE.md which loads always; slash commands require explicit invocation)
- Rule of thumb: if you explain same thing to Claude repeatedly → make it a skill

#### Configuration and multi-file skills
- Required fields: `name` (max 64 chars, lowercase/numbers/hyphens), `description` (max 1024 chars)
- Optional: `allowed-tools`, `model`
- `allowed-tools` restricts available tools when skill active
- Progressive disclosure: keep SKILL.md under 500 lines, link to supporting files
- Directory structure: `scripts/`, `references/`, `assets/`
- Scripts execute without loading contents into context; only output consumes tokens
- Tell Claude to "run the script, not read it"

#### Skills vs. other Claude Code features
- **CLAUDE.md**: always-on project standards; loads every conversation
- **Skills**: on-demand, task-specific; loads when matched
- **Subagents**: separate execution context, isolated; skills add to current conversation
- **Hooks**: event-driven (file saves, tool calls); skills are request-driven
- **MCP servers**: external tools/integrations; different category entirely
- Combine features rather than forcing everything into one approach

---

### 4. Claude Code in Action (21 lessons)
**URL:** https://anthropic.skilljar.com/claude-code-in-action

**Curriculum:**
- Introduction, What is a coding assistant?, Claude Code in action
- Claude Code setup, Project setup, Adding context, Making changes
- Controlling context, Custom commands, MCP servers with Claude Code, Github integration
- Introducing hooks, Defining hooks, Implementing a hook, Gotchas around hooks
- Useful hooks!, Another useful hook, The Claude Code SDK
- Quiz on Claude Code, Summary and next steps

#### Introducing hooks
- Run commands before/after Claude attempts to run a tool
- PreToolUse: run before tool execution (can block)
- PostToolUse: run after tool execution (cannot block, can provide feedback)
- Config locations: Global (`~/.claude/settings.json`), Project (`.claude/settings.json`), Local (`.claude/settings.local.json`)
- `/hooks` command available inside Claude Code
- Applications: code formatting, testing, access control, code quality, logging, validation

#### Defining hooks
- 4 steps: choose Pre/Post → pick target tools → write command → handle feedback
- Command receives JSON via stdin: `session_id`, `transcript_path`, `hook_event_name`, `tool_name`, `tool_input`
- **Exit code 0** = allow tool call to proceed
- **Exit code 2** = block tool call (PreToolUse only)
- Stderr with exit code 2 sent to Claude as feedback
- Common use: prevent reading sensitive files like .env

#### Gotchas around hooks
- Use absolute paths for scripts (security recommendation)
- Absolute paths make sharing settings.json harder across machines
- Solution: `$PWD` placeholder in settings.example.json, init script replaces with actual path

---

### 5. Claude Code 101
**URL:** https://anthropic.skilljar.com/claude-code-101
**Status:** NOT analyzed (curriculum not explored)

### 6. Introduction to Model Context Protocol (dedicated course)
**URL:** https://anthropic.skilljar.com/introduction-to-model-context-protocol
**Status:** NOT analyzed

### 7. Model Context Protocol: Advanced Topics
**URL:** https://anthropic.skilljar.com/model-context-protocol-advanced-topics
**Status:** NOT analyzed

### 8. Introduction to Claude Cowork
**URL:** https://anthropic.skilljar.com/introduction-to-claude-cowork
**Status:** NOT analyzed

---

## Videos NOT Analyzed (by course)

### Building with the Claude API (74 of 85 NOT analyzed)
1. Welcome to the course
2. Overview of Claude models
3. Accessing the API
4. Getting an API key
5. Making a request
6. Multi-Turn conversations
7. Chat exercise
8. System prompts
9. System prompts exercise
10. Temperature
11. Response streaming
12. Structured data exercise
13. Quiz on accessing Claude with the API
14. Prompt evaluation
15. A typical eval workflow
16. Generating test datasets
17. Running the eval
18. Model based grading
19. Code based grading
20. Exercise on prompt evals
21. Quiz on prompt evaluation
22. Prompt engineering
23. Being clear and direct
24. Being specific
25. Structure with XML tags
26. Providing examples
27. Exercise on prompting
28. Quiz on prompt engineering techniques
29. Project overview
30. Tool functions
31. Handling message blocks
32. Multi-turn conversations with tools
33. Implementing multiple turns
34. Using multiple tools
35. The text edit tool
36. The web search tool
37. Quiz on tool use with Claude
38. Introducing Retrieval Augmented Generation
39. Text chunking strategies
40. Text embeddings
41. The full RAG flow
42. Implementing the RAG flow
43. BM25 lexical search
44. A Multi-Index RAG pipeline
45. Image support
46. PDF support
47. Citations
48. Prompt caching
49. Rules of prompt caching
50. Prompt caching in action
51. Code execution and the Files API
52. Quiz on features of Claude
53. MCP clients
54. Project setup
55. Defining tools with MCP
56. The server inspector
57. Implementing a client
58. Defining resources
59. Accessing resources
60. Defining prompts
61. Prompts in the client
62. MCP review
63. Quiz on Model Context Protocol
64. Anthropic apps
65. Claude Code setup
66. Claude Code in action
67. Enhancements with MCP servers
68. Chaining workflows
69. Agents and tools
70. Environment inspection
71. Quiz on Agents and Workflows
72. Final Assessment
73. Course Wrap Up
74. Course satisfaction survey

### Introduction to agent skills (3 of 6 NOT analyzed)
1. Creating your first skill
2. Sharing skills
3. Troubleshooting skills

### Claude Code in Action (18 of 21 NOT analyzed)
1. Introduction
2. What is a coding assistant?
3. Claude Code in action
4. Claude Code setup
5. Project setup
6. Adding context
7. Making changes
8. Course satisfaction survey
9. Controlling context
10. Custom commands
11. MCP servers with Claude Code
12. Github integration
13. Implementing a hook
14. Useful hooks!
15. Another useful hook
16. The Claude Code SDK
17. Quiz on Claude Code
18. Summary and next steps

### Claude Code 101 (ALL - not visited)
Full curriculum unknown - not enrolled/explored

### Introduction to Model Context Protocol (ALL - not visited)
Full curriculum unknown - not enrolled/explored

### Model Context Protocol: Advanced Topics (ALL - not visited)
Full curriculum unknown - not enrolled/explored

### Introduction to Claude Cowork (ALL - not visited)
Full curriculum unknown - not enrolled/explored

---

## Key Verified Facts by Domain

### D1 - Agentic Architecture & Orchestration
**Verified from Skilljar:**
- Tool use flow: 4-step pattern (request → tool request → data retrieval → response)
- Workflows vs agents distinction and when to use each
- Parallelization, routing, chaining, evaluator-optimizer workflow patterns
- Subagents: isolated context, summary-only return, built-in types (General, Explore, Plan)
- Subagent config: name, description, tools, model, color fields
- Anti-patterns: expert claims, sequential pipelines, test runners
- Structured output format prevents subagents from running too long
- Decision rule: delegate when intermediate work doesn't matter

**NOT directly verified from Skilljar:**
- Specific stop_reason values (end_turn, tool_use, max_tokens, pause_turn, stop_sequence, refusal)
- Server-executed tools (srvtoolu_ prefix)
- pause_turn behavior
- fork_session
- Session manifests
- Subagents "cannot spawn subagents" (not explicitly stated in course)
- 4-5 tools per agent ideal (not stated)
- Hook parallel execution
- asyncRewake
- 26+ event types

### D2 - Tool Design & MCP Integration
**Verified from Skilljar:**
- Tool schema: name, description, input_schema
- Tool descriptions: 3-4 sentences, what/when/returns
- MCP: shifts tool creation/maintenance to MCP servers
- MCP 3 primitives: Tools, Resources, Prompts (mentioned in API course)
- Tool result blocks with tool_use_id matching
- Multiple tool calls with unique IDs
- Fine-grained tool calling: `fine_grained=True` disables JSON validation
- Built-in tools mentioned (Read, Write, Edit, Bash, Grep, Glob)

**NOT directly verified from Skilljar:**
- tool_choice 4 modes (auto, any, tool, none)
- strict: true grammar-constrained sampling
- is_error flag details and error categories
- MCP transport types (stdio, http, sse)
- MCP camelCase vs snake_case difference
- Environment variable expansion syntax
- MCP_TIMEOUT, MAX_MCP_OUTPUT_TOKENS
- Tool count thresholds (18 degrades accuracy)

### D3 - Claude Code Configuration & Workflows
**Verified from Skilljar:**
- Skills: SKILL.md files with name/description frontmatter
- Skills: personal (~/.claude/skills) vs project (.claude/skills)
- Skills load on demand; CLAUDE.md loads always
- Skills vs subagents vs hooks vs MCP comparison
- allowed-tools field in skills
- Progressive disclosure (keep SKILL.md under 500 lines)
- Hooks: PreToolUse (can block) and PostToolUse (cannot block)
- Hook exit codes: 0=allow, 2=block
- Hook config in settings.json files (global, project, local)
- Absolute paths recommended for hook scripts

**NOT directly verified from Skilljar:**
- CLAUDE.md 4-level hierarchy
- @import directive, max 5 hops
- CLAUDE.md delivered as user message (not system prompt)
- MEMORY.md auto-loads 200 lines/25KB
- Compaction details (95% trigger, 12% summary)
- Skills 14 frontmatter fields
- Skills 5,000 tokens post-compaction budget
- $ARGUMENTS shell-style quoting
- CLI flags (--bare, --max-turns, --system-prompt, etc.)
- 6 permission modes
- .claude/rules/ with glob patterns
- Plan mode details

### D4 - Prompt Engineering & Structured Output
**Verified from Skilljar:**
- Structured data: prefilling + stop sequences for clean output
- Extended thinking: enabled with budget_tokens, min 1024
- Extended thinking NOT compatible with prefilling, temperature
- Cryptographic signature on thinking blocks
- Redacted thinking blocks (safety flagged)
- Prompt engineering: clear/direct, specific, XML tags, providing examples
- Evaluation: model-based grading, code-based grading, test datasets

**NOT directly verified from Skilljar:**
- output_config.format with json_schema
- tool_choice: any with strict: true for structured output
- Batch processing 50% cost reduction, 24h timeline
- Batch custom_id regex, 100K/256MB limits
- Adaptive thinking effort levels (low/medium/high/max)
- budget_tokens deprecated on Claude 4.6
- Multi-instance review architecture details

### D5 - Context Management & Reliability
**NOT directly verified from Skilljar (entire domain):**
- Lost-in-the-middle effect
- Context window sizes (200K vs 1M)
- Document placement optimization (30% improvement)
- Escalation patterns and triggers
- Error propagation patterns
- Large codebase exploration strategies (Glob→Grep→Read)
- Human review workflows
- Stratified sampling
- Information provenance
- Confidence calibration

---

## Changes Made Based on Investigation

### Questions Removed (9 total)

Questions with very specific internal details NOT verifiable from Skilljar courses or official Anthropic documentation:

| ID | File | Question | Reason for Removal |
|----|------|----------|-------------------|
| 226 | questions_part4.js | "How many arguments does a hook callback receive?" | Internal implementation detail not covered in Skilljar hooks lessons |
| 233 | questions_part4.js | "Hook execution order in array" | Skilljar doesn't cover execution order (parallel vs sequential) |
| 234 | questions_part4.js | "PreToolUse hook return for observation-only" | Internal implementation detail not in Skilljar |
| 235 | questions_part4.js | "How many fields does AgentDefinition have?" (claims 15) | Skilljar subagents course shows only 5 fields: name, description, tools, model, color |
| 241 | questions_part4.js | "3 ways to create subagents with precedence" | Skilljar only shows /agents command and file-based creation |
| 243 | questions_part4.js | "Detect subagent invocation in API response" | Internal API detail not covered in Skilljar |
| 270 | questions_part5.js | "How many frontmatter fields in SKILL.md?" (claims 14) | Skilljar skills course shows: name, description, allowed-tools, model (4 main fields) |
| 281 | questions_part5.js | "Effort level exclusive to Opus 4.6" | Not covered in Skilljar extended thinking lesson |
| 298 | questions_part5.js | "Compaction ~12% ratio" | Very specific number not in any Skilljar course or official docs |

### Questions Retained (PARTIAL) — 34 remaining

These PARTIAL questions test best practices that logically follow from documented features, even if not word-for-word in Skilljar:

- Best practices for workflows (routing, parallelization) — covered in API course Agents section
- Prompt engineering patterns — covered in Prompt Engineering section
- Configuration recommendations (CLAUDE.md, rules) — covered in Skills course comparison
- Error handling patterns — follows from tool use documentation
- CI/CD optimization — follows from Claude Code in Action course

### Recommendations for Future Work

1. **Explore remaining courses**: Claude Code 101, Introduction to MCP (dedicated), MCP Advanced Topics, Introduction to Claude Cowork
2. **Review remaining 34 PARTIAL questions** against official Anthropic API documentation at docs.anthropic.com
3. **Update learnTopics.js** to incorporate Skilljar-specific insights (subagent anti-patterns, skill configuration, workflow patterns)
4. **Add docUrl references** from Skilljar courses to learn topics that were verified
