# Skilljar Facts Extraction — Lesson by Lesson

## Course: Building with the Claude API

### Lesson: Making a request
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287725
**Key Facts:**
- `client.messages.create()` requires 3 params: `model`, `max_tokens`, `messages`
- `max_tokens` is a safety limit, not a target — Claude stops if it hits max
- Two message types: `user` (human) and `assistant` (Claude)
- Response text at `message.content[0].text`
- API key via `ANTHROPIC_API_KEY` env var
- Use `python-dotenv` + `.env` file for key management

---

### Lesson: Multi-Turn conversations
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287735
**Key Facts:**
- Claude doesn't store conversation history — each request is independent
- You must manually maintain message list and send complete history with every request
- Two-step pattern: add user message → get response → add assistant message → add follow-up → send all
- Helper functions: `add_user_message()`, `add_assistant_message()`, `chat()`

---

### Lesson: System prompts
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287733
**Key Facts:**
- System prompts customize tone, style, and approach
- Passed as `system` parameter in `client.messages.create()`
- API doesn't accept `system=None` — conditionally include only when provided
- Role prompting (e.g., "You are a patient math tutor") changes response behavior
- Use for: keeping Claude on task, defining persona, setting constraints

---

### Lesson: Temperature
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287728
**Key Facts:**
- Decimal value between 0 and 1 controlling creativity/predictability
- At 0: deterministic (always picks highest probability token)
- At 1: more evenly distributed probabilities (more creative/varied)
- Low (0-0.3): factual, coding, data extraction, moderation
- Medium (0.4-0.7): summarization, educational, problem-solving
- High (0.8-1.0): brainstorming, creative writing, marketing
- Default is 1.0

---

### Lesson: Response streaming
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287734
**Key Facts:**
- Streaming sends text chunk by chunk as Claude generates it
- Enable with `stream=True` in `messages.create()`
- Stream events: MessageStart, ContentBlockStart, ContentBlockDelta, ContentBlockStop, MessageDelta, MessageStop
- ContentBlockDelta contains actual text chunks
- Simplified API: `client.messages.stream()` with `stream.text_stream`
- `stream.get_final_message()` returns complete assembled message after streaming

---

### Lesson: Structured data
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287732
**Key Facts:**
- Problem: Claude adds explanatory text around structured output
- Solution: Assistant message prefilling + stop sequences
- Prefill with ` ```json `, stop on ` ``` ` to get clean JSON
- Works for JSON, Python code, CSV, bulleted lists
- `json.loads(text.strip())` to clean up response

---

### Lesson: Introducing tool use
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287747
**Key Facts:**
- Tools extend Claude beyond training data with real-time info
- 4-step flow: Initial Request → Tool Request → Data Retrieval → Final Response
- You send question + tool instructions → Claude requests specific data → Server fetches → Claude responds with fresh data
- Key benefits: real-time info, external system integration, dynamic responses, structured interaction

---

### Lesson: Tool schemas
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287753
**Key Facts:**
- Tool spec has 3 parts: `name`, `description`, `input_schema`
- Description: 3-4 sentences — what it does, when to use, what it returns
- JSON Schema is standard spec adopted by AI for parameter description
- `ToolParam` type from anthropic library for type safety
- Naming pattern: `function_name` + `function_name_schema`
- Can use Claude itself to generate schemas from function code

---

### Lesson: Handling message blocks
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287757
**Key Facts:**
- With tools, Claude returns multi-block messages (text + tool_use)
- Include `tools` param (list of JSON schemas) in API call
- ToolUse block contains: ID, function name, input params, type "tool_use"
- Must preserve entire content structure (all blocks) in conversation history
- `messages.append({"role": "assistant", "content": response.content})`

---

### Lesson: Sending tool results
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752
**Key Facts:**
- Tool result block in user message: `type: "tool_result"`, `tool_use_id`, `content`, `is_error`
- Extract params from `response.content[1].input`
- Use `**response.content[1].input` to unpack as kwargs
- Multiple tool calls get unique IDs — must match when sending results
- Must still include tool schema in follow-up requests
- Complete history must be sent: original user msg, assistant tool_use, user tool_result

---

### Lesson: Multi-turn conversations with tools
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287750
**Key Facts:**
- Claude may need multiple sequential tool calls for one question
- Need conversation loop that continues until Claude stops requesting tools
- Check `stop_reason` — loop while `tool_use`, break on `end_turn`
- `text_from_message()` helper extracts text from multi-block messages
- Return full message objects (not just text) to preserve all blocks

---

### Lesson: Fine grained tool calling
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/313160
**Key Facts:**
- Streaming with tools: `InputJsonEvent` with `partial_json` and `snapshot`
- API buffers and validates complete top-level key-value pairs before sending
- `fine_grained=True` disables JSON validation — chunks arrive immediately
- Must handle invalid JSON yourself when fine-grained enabled
- Use when: real-time progress needed, buffering delays hurt UX

---

### Lesson: Prompt caching
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287772
**Key Facts:**
- Saves preprocessing work (tokenization, embeddings, context) for reuse
- Faster responses + lower costs for cached portions
- Cache lives for 1 hour only
- Only beneficial when repeatedly sending same content
- Best for: document analysis, iterative editing, same base content

---

### Lesson: Rules of prompt caching
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287770
**Key Facts:**
- Must manually add cache breakpoints with `cache_control: {"type": "ephemeral"}`
- Use longhand text block format (not shorthand) to add cache_control
- Content must be IDENTICAL up to breakpoint for cache hit
- Even adding "please" invalidates cache
- Can cache: system prompts, tool definitions, image blocks, tool use/result blocks
- Processing order: tools first → system prompt → messages
- Max 4 cache breakpoints
- Minimum 1024 tokens to be cacheable
- System prompts and tool definitions are best candidates (rarely change)

---

### Lesson: Extended thinking
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287773
**Key Facts:**
- "Scratch paper" for complex reasoning — shows thinking process
- Response becomes: thinking blocks + final answer
- `thinking: {"type": "enabled", "budget": budget_tokens}`, min 1024 tokens
- `max_tokens` must be greater than thinking budget
- NOT compatible with: message pre-filling and temperature
- Cryptographic signature prevents tampering with reasoning
- Redacted thinking blocks when flagged by safety systems
- Use when standard prompting doesn't meet accuracy after optimization

---

### Lesson: Being clear and direct
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287744
**Key Facts:**
- First line of prompt is most important
- Use simple language, no ambiguity
- Use instructions not questions — "Write X" not "Can you tell me about X?"
- Lead with direct action verbs: Write, Create, Generate
- Improved eval scores from 2.32 to 3.92 just from restructuring

---

### Lesson: Being specific
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287740
**Key Facts:**
- Two types of guidelines: output quality guidelines + process steps
- Output guidelines: length, structure, format, attributes, tone
- Process steps: step-by-step reasoning for complex problems
- Adding guidelines improved eval from 3.92 to 7.86 (doubled quality)
- Always use output guidelines; add process steps for complex problems

---

### Lesson: Structure with XML tags
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287741
**Key Facts:**
- XML tags create clear delimiters between instructions and data
- Use custom descriptive names: `<sales_records>`, `<my_code>`, `<docs>`
- Most useful when: large amounts of context, mixing content types, complex prompts
- Tags separate data from instructions so Claude doesn't confuse them

---

### Lesson: Providing examples
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287746
**Key Facts:**
- "One-shot" (1 example) or "multi-shot" (multiple examples) prompting
- Wrap examples in XML: `<sample_input>`, `<ideal_output>`
- Great for: corner cases, complex output formats, style/tone, ambiguous inputs
- Find best examples from eval results (highest scores)
- Add context explaining WHY example output is good
- "Show rather than tell" — demonstrates requirements directly

---

### Lesson: Agents and workflows
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287796
**Key Facts:**
- Workflows: predefined steps for known problems
- Agents: goal + tools, Claude formulates plan
- Use workflows when you can picture exact flow
- Use agents when task/parameters uncertain
- Evaluator-Optimizer pattern: Producer → Grader → Feedback loop → Iteration

---

### Lesson: Parallelization workflows
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287804
**Key Facts:**
- Split task into multiple parallel requests with specialized criteria
- Pattern: Split → Run in parallel → Aggregate results
- Sub-tasks don't need to be identical — each can have specialized prompts/tools
- Benefits: focused attention, easier optimization, scalability, reliability
- Use when: complex decision with independent evaluations

---

### Lesson: Chaining workflows
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287800
**Key Facts:**
- Break large task into sequential subtasks that build on each other
- Key benefit: focus — one specific task at a time
- Solves "long prompt problem" — Claude ignores some constraints in massive prompts
- Two-step chain: generate content → revise with targeted fix instructions
- Use when: complex tasks, Claude ignores constraints, need validation between steps

---

### Lesson: Routing workflows
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287801
**Key Facts:**
- Different request types need different handling
- Pattern: Categorize input → Route to ONE specialized pipeline
- User input goes to only one pipeline, not all
- Use when: diverse request types, clear categories, reliable categorization
- Example: content genre classification → genre-specific prompt template

---

### Lesson: Agents and tools
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287803
**Key Facts:**
- Power of agents: combining simple tools in unexpected ways
- Tools should be abstract/generic, not hyper-specialized
- Claude Code example: bash, read, write, edit, glob, grep (no "refactor code" tool)
- Abstract tools enable handling countless unplanned scenarios
- Design combinable tools that can work together creatively

---

### Lesson: Workflows vs agents
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287794
**Key Facts:**
- Workflows: higher accuracy, easier to test, more predictable, better for specific problems
- Agents: more flexible UX, creative tool combos, handle novel situations
- Workflow downsides: less flexible, constrained UX, more upfront design
- Agent downsides: lower completion rate, harder to test, less predictable
- **Recommendation: always focus on workflows where possible; agents only when truly required**

---

### Lesson: Introducing MCP
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287780
**Key Facts:**
- MCP shifts tool definitions/execution from your server to MCP servers
- Without MCP: you write all tools yourself
- MCP server = wrapper around service functionality with pre-built tools
- Anyone can create MCP servers — often service providers make official ones
- MCP ≠ tool use — MCP is about WHO creates/maintains tools

---

### Lesson: MCP clients
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287775
**Key Facts:**
- MCP client = bridge between your server and MCP servers
- Transport agnostic: stdio (local), HTTP, WebSockets
- Message types: ListToolsRequest/Result, CallToolRequest/Result
- Flow: user query → list tools → send to Claude → tool use → call tool → result → final response
- Client abstracts away server communication complexity

---

### Lesson: Defining tools with MCP
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287797
**Key Facts:**
- Python SDK: `FastMCP("name")` for server init
- `@mcp.tool()` decorator with name and description
- Parameters via Pydantic `Field(description="...")`
- SDK auto-generates JSON schema from Python type hints
- Error handling: raise `ValueError` for invalid inputs
- Benefits: auto schema gen, clean code, built-in validation, type safety

---

### Lesson: Defining resources
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287782
**Key Facts:**
- Resources expose data (like GET endpoints); tools perform actions
- Two types: Direct Resources (static URIs) and Templated Resources (parameterized)
- `@mcp.resource("docs://documents")` for direct
- `@mcp.resource("docs://documents/{doc_id}")` for templated
- `mime_type` hints data format (application/json, text/plain)
- SDK auto-serializes return values
- Test with MCP Inspector: `uv run mcp dev mcp_server.py`

---

### Lesson: Defining prompts
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287784
**Key Facts:**
- Prompts = pre-built, tested instruction templates for clients
- `@mcp.prompt()` decorator with name and description
- Return list of `base.Message` objects (UserMessage, etc.)
- Parameters via Pydantic `Field(description="...")`
- Should be high quality, well-tested, relevant to server's purpose
- Better results than user-written prompts due to careful testing

---

## Course: Introduction to subagents

### Lesson: What are subagents?
**URL:** https://anthropic.skilljar.com/introduction-to-subagents/450698
**Key Facts:**
- Subagents: isolated context windows for delegated tasks
- Receive: custom system prompt + task description from parent
- Only summary returns to main thread; intermediate work discarded
- Built-in subagents: General purpose, Explore, Plan
- Benefit: keep main context clean, focused summaries

---

### Lesson: Creating a subagent
**URL:** https://anthropic.skilljar.com/introduction-to-subagents/450699
**Key Facts:**
- `/agents` slash command to create
- Scope: project-level or user-level
- Config at `.claude/agents/your-agent-name.md`
- YAML frontmatter: `name`, `description`, `tools`, `model`, `color`
- Model options: haiku, sonnet, opus, inherit
- "proactively" in description → auto-delegation
- Tool categories: read-only, edit, execution, MCP, other

---

### Lesson: Designing effective subagents
**URL:** https://anthropic.skilljar.com/introduction-to-subagents/450700
**Key Facts:**
- Name + description included in main agent's system prompt
- Description shapes both WHEN subagent launches AND input prompt content
- **Most important: define output format** — creates stopping points, prevents running too long
- Add "Obstacles Encountered" section for workarounds/quirks
- Limit tool access: read-only for research, bash for reviewers, edit for modifiers
- 4 characteristics: specific descriptions, structured output, obstacle reporting, limited tools

---

### Lesson: Using subagents effectively
**URL:** https://anthropic.skilljar.com/introduction-to-subagents/450701
**Key Facts:**
- Use when intermediate work doesn't matter to main thread
- **Good for:** research, code reviews (fresh perspective), custom system prompts
- **Bad for:** "expert" personas, sequential pipelines, test runners
- Code reviews in separate context = fresh eyes (no creation bias)
- Test runner pattern "performed worse among all configurations"
- Decision rule: does intermediate work matter? No → subagent. Yes → main thread

---

## Course: Introduction to agent skills

### Lesson: What are skills?
**URL:** https://anthropic.skilljar.com/introduction-to-agent-skills/434525
**Key Facts:**
- SKILL.md files with name/description in YAML frontmatter
- Claude matches request against skill descriptions, activates matching ones
- Personal: `~/.claude/skills`; Project: `.claude/skills`
- Load on demand (unlike CLAUDE.md which loads always)
- Rule: if you explain same thing repeatedly → make a skill

---

### Lesson: Configuration and multi-file skills
**URL:** https://anthropic.skilljar.com/introduction-to-agent-skills/434526
**Key Facts:**
- Required fields: `name` (max 64 chars, lowercase/numbers/hyphens), `description` (max 1024 chars)
- Optional: `allowed-tools`, `model`
- `allowed-tools` restricts available tools when skill active
- Progressive disclosure: keep SKILL.md under 500 lines
- Directory structure: `scripts/`, `references/`, `assets/`
- Scripts execute without loading contents into context — only output uses tokens

---

### Lesson: Skills vs. other Claude Code features
**URL:** https://anthropic.skilljar.com/introduction-to-agent-skills/434528
**Key Facts:**
- CLAUDE.md: always-on, every conversation; Skills: on-demand when matched
- Subagents: separate execution context; Skills: add to current conversation
- Hooks: event-driven; Skills: request-driven
- MCP servers: external tools; different category entirely
- Combine features rather than forcing everything into one approach

---

## Course: Claude Code in Action

### Lesson: Introducing hooks
**URL:** https://anthropic.skilljar.com/claude-code-in-action/312000
**Key Facts:**
- Run commands before/after tool execution
- PreToolUse (can block) and PostToolUse (cannot block, can provide feedback)
- Config: Global `~/.claude/settings.json`, Project `.claude/settings.json`, Local `.claude/settings.local.json`
- Applications: formatting, testing, access control, quality, logging, validation

---

### Lesson: Defining hooks
**URL:** https://anthropic.skilljar.com/claude-code-in-action/312002
**Key Facts:**
- Command receives JSON via stdin: `session_id`, `transcript_path`, `hook_event_name`, `tool_name`, `tool_input`
- **Exit code 0** = allow
- **Exit code 2** = block (PreToolUse only)
- Stderr with exit code 2 → sent to Claude as feedback
- Common use: prevent reading sensitive files (.env)

---

### Lesson: Gotchas around hooks
**URL:** https://anthropic.skilljar.com/claude-code-in-action/312423
**Key Facts:**
- Use absolute paths for scripts (security recommendation)
- Absolute paths make sharing settings.json harder
- Solution: `$PWD` placeholder in settings.example.json → init script replaces

---

### Lesson: Useful hooks! (Claude Code in Action)
**URL:** https://anthropic.skilljar.com/claude-code-in-action/312004
**Key Facts:**
- TypeScript type checking hook: runs `tsc --noEmit` after every edit, feeds errors back
- Query duplication hook: launches separate Claude instance to review for duplicates
- Uses Claude TypeScript SDK programmatically for hook workflows
- Only monitor critical directories to minimize overhead

---

### Lesson: The Claude Code SDK
**URL:** https://anthropic.skilljar.com/claude-code-in-action/312001
**Key Facts:**
- Run Claude Code programmatically from TypeScript, Python, or CLI
- `import { query } from "@anthropic-ai/claude-code"`
- Read-only permissions by default; enable write with `allowedTools: ["Edit"]`
- Inherits all settings from same directory
- Use for: git hooks, build scripts, CI/CD, documentation

---

### Lesson: Citations
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287771
**Key Facts:**
- Enable with `citations: {"enabled": True}` in document block
- Citation: cited_text, document_index, document_title, start/end_page_number
- Works with PDFs (page numbers) and plain text (character positions)

---

### Lesson: Controlling context (Claude Code in Action)
**URL:** https://anthropic.skilljar.com/claude-code-in-action/303237
**Key Facts:**
- Escape stops Claude mid-response; `#` adds memory
- Double Escape to rewind conversation
- `/compact` summarizes preserving key knowledge
- `/clear` removes all history (fresh start)

---

### Lesson: Custom commands (Claude Code in Action)
**URL:** https://anthropic.skilljar.com/claude-code-in-action/303234
**Key Facts:**
- `.claude/commands/` directory with markdown files
- Filename = command name (audit.md → /audit)
- `$ARGUMENTS` placeholder for input
- Must restart after creating new commands

---

### Lesson: MCP servers with Claude Code
**URL:** https://anthropic.skilljar.com/claude-code-in-action/303239
**Key Facts:**
- `claude mcp add <name> <command>` to install
- Permission pre-approval: `mcp__<name>` (double underscore) in settings
- MCP servers run locally or remotely

---

### Lesson: Creating your first skill
**URL:** https://anthropic.skilljar.com/introduction-to-agent-skills/434527
**Key Facts:**
- Skill = directory + SKILL.md (frontmatter + instructions)
- Claude loads names/descriptions at startup → semantic matching → confirmation
- **Priority: Enterprise → Personal → Project → Plugins**
- Restart required after changes

---

### Lesson: Prompt evaluation
**URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287731
**Key Facts:**
- 3 paths: test once (risky), test few times (better), evaluation pipeline (best)
- Data-driven approach catches problems before production

---

