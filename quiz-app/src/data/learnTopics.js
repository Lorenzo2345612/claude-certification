// ============================================================
// Learn Topics — Rich content for the documentation browser
// ============================================================

export const learnTopics = [
  // ===== DOMAIN 1: Agentic Architecture & Orchestration (27%) — 8 topics =====
  {
    id: "d1-agentic-loop",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "The Agentic Loop",
    icon: "",
    content: `
      <h3>Understanding the Agentic Loop</h3>
      <p>The agentic loop is the fundamental execution cycle that powers Claude's autonomous tool use. It is model-agnostic infrastructure code — your application sends messages, Claude decides whether to call tools, and your code executes those tools and feeds results back. The loop continues until Claude signals it is done.</p>
      <p>Every response from the Messages API includes a <code>stop_reason</code> field that tells your code <strong>why</strong> Claude stopped generating. This field is the key decision point in every iteration of the loop. There are six possible values, each requiring different handling in your orchestration layer.</p>
      <p>The loop pattern is intentionally simple: send a request, inspect the stop reason, act accordingly, and repeat. This simplicity makes it composable — you can wrap it with retry logic, token budgets, safety checks, and observability without changing the core pattern.</p>

      <div class="diagram">
        <div class="diagram-title">The 5-Step Agentic Loop</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">1. Send Messages</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">2. Claude Responds</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">3. Check stop_reason</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">4. Execute Tool</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">5. Append tool_result</span>
        </div>
        <div class="diagram-caption">Loop back to step 1 if stop_reason is "tool_use". Terminate if "end_turn".</div>
      </div>

      <h4>The Six stop_reason Values</h4>
      <table>
        <thead><tr><th>stop_reason</th><th>Meaning</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td><code>end_turn</code></td><td>Claude is done; no more tool calls needed</td><td>Return the final response to the user</td></tr>
          <tr><td><code>tool_use</code></td><td>Claude wants to call one or more tools</td><td>Execute the tool(s), append tool_result, loop again</td></tr>
          <tr><td><code>max_tokens</code></td><td>Response hit the max_tokens limit</td><td>Decide whether to continue (send back for more) or truncate</td></tr>
          <tr><td><code>pause_turn</code></td><td>Server-side loop hit its iteration limit for server-executed tools</td><td>Re-send the conversation including the paused response so Claude can continue</td></tr>
          <tr><td><code>stop_sequence</code></td><td>A custom stop sequence was matched</td><td>Handle based on which sequence triggered</td></tr>
          <tr><td><code>refusal</code></td><td>Claude declined to respond (safety)</td><td>Log and handle gracefully; do not retry</td></tr>
        </tbody>
      </table>

      <h4>Server-Executed Tools</h4>
      <p>Some tools are executed by Anthropic on its infrastructure rather than by your client code. These are: <code>web_search</code>, <code>web_fetch</code>, <code>code_execution</code>, and <code>tool_search</code>. When Claude uses these tools, the response contains <code>server_tool_use</code> blocks (with IDs prefixed by <code>srvtoolu_</code>) instead of regular <code>tool_use</code> blocks. Results appear in the same assistant turn.</p>
      <p><strong>You NEVER construct a <code>tool_result</code> for server-executed tools.</strong> Anthropic handles execution and returns results automatically. The server runs its own internal loop and may trigger several searches or executions before responding. This server-side loop can hit its internal iteration limit, which is what generates a <code>pause_turn</code> stop reason.</p>

      <h4>Tool Result Matching</h4>
      <p>When Claude requests a tool call, the response contains a <code>tool_use</code> content block with a unique <code>id</code>. Your tool result must reference this exact ID in the <code>tool_use_id</code> field of the <code>tool_result</code> block. Mismatched IDs cause the loop to fail.</p>

<pre><code>// Pseudocode for the agentic loop
while (true) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    messages: conversationHistory,
    tools: toolDefinitions,
  });

  // Append assistant response to history
  conversationHistory.push({ role: "assistant", content: response.content });

  if (response.stop_reason === "end_turn") {
    return response; // Done — Claude finished the task
  }

  if (response.stop_reason === "tool_use") {
    const toolResults = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await executeTool(block.name, block.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }
    conversationHistory.push({ role: "user", content: toolResults });
  }
}</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li><code>stop_reason</code> is the single decision point — always check it before proceeding</li>
          <li>The loop terminates on <code>end_turn</code>; it continues on <code>tool_use</code></li>
          <li>Always cap max iterations to prevent runaway loops in production</li>
          <li>Tool results must match by <code>tool_use_id</code> — never skip or reorder them</li>
          <li>The agentic loop is infrastructure code — Claude decides when to use tools, your code executes them</li>
          <li>The loop should also continue on <code>pause_turn</code> — re-send the conversation including the paused response</li>
          <li>Server-executed tools return <code>server_tool_use</code> blocks — you never send <code>tool_result</code> for these</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works#the-agentic-loop",
    docLabel: "Agentic Loop Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Introducing tool use", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287747" },
      { course: "Building with the Claude API", lesson: "Multi-turn conversations with tools", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287750" },
      { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" }
    ],
    relatedTopics: ["d1-tool-use-contract", "d1-multi-agent", "d1-programmatic-enforcement"],
  },
  {
    id: "d1-tool-use-contract",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Tool Use Contract",
    icon: "",
    content: `
      <h3>The Tool Use Contract</h3>
      <p>Tool use in Claude follows a strict contract between the client (your application) and the server (the Claude API). Understanding this contract is essential for building reliable agentic systems. The contract defines three execution buckets and two message block types that form the backbone of every tool interaction.</p>
      <p>Tools are divided into <strong>client-side tools</strong> (executed by your code) and <strong>server-side tools</strong> (executed by Anthropic's infrastructure). Client-side tools give you full control over execution, error handling, and security. Server-side tools like code execution sandboxes are managed by Anthropic.</p>
      <p>The three execution buckets determine how and where tools run: <strong>synchronous</strong> (inline execution, blocking), <strong>asynchronous</strong> (fire-and-forget with later retrieval), and <strong>human-in-the-loop</strong> (pause for user approval before executing). Choosing the right bucket affects latency, safety, and user experience.</p>

      <div class="diagram">
        <div class="diagram-title">Tool Use Message Flow</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">User Message</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Claude: tool_use block</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Client Executes</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">tool_result block</span>
        </div>
      </div>

      <h4>The Two Block Types</h4>
      <table>
        <thead><tr><th>Block</th><th>Source</th><th>Contains</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td><code>tool_use</code></td><td>Claude (assistant)</td><td>tool name, unique id, input parameters</td><td>Request to execute a tool</td></tr>
          <tr><td><code>tool_result</code></td><td>Your code (user)</td><td>tool_use_id, content (string or array), is_error flag</td><td>Response with execution result</td></tr>
        </tbody>
      </table>

      <h4>Three Execution Buckets</h4>
      <table>
        <thead><tr><th>Bucket</th><th>Use Case</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>Synchronous</strong></td><td>Tool completes immediately; result fed back inline</td><td>Database lookup, API call, calculation</td></tr>
          <tr><td><strong>Asynchronous</strong></td><td>Tool takes time; result retrieved later</td><td>Long-running jobs, email sending, file processing</td></tr>
          <tr><td><strong>Human-in-the-loop</strong></td><td>Requires user confirmation before executing</td><td>Financial transactions, data deletion, sending messages</td></tr>
        </tbody>
      </table>

<pre><code>// tool_use block from Claude's response
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA" }
}

// tool_result block you send back
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "Current weather: 67°F, partly cloudy"
}</code></pre>

      <h4>tool_result Formatting Rules</h4>
      <p>The <code>tool_result</code> block supports four valid content types:</p>
      <ul>
        <li><strong>Plain string</strong>: <code>"content": "15 degrees"</code></li>
        <li><strong>Text block</strong>: <code>{"type": "text", "text": "15 degrees"}</code></li>
        <li><strong>Image block (base64)</strong>: <code>{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}</code></li>
        <li><strong>Document block</strong>: <code>{"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "..."}}</code></li>
      </ul>
      <p><strong>CRITICAL ordering rules:</strong></p>
      <ul>
        <li><strong>No intermediate messages</strong>: You cannot include any messages between the assistant's <code>tool_use</code> message and the user's <code>tool_result</code> message.</li>
        <li><strong>tool_result blocks must come FIRST</strong>: In the user message containing tool results, all <code>tool_result</code> blocks must appear before any <code>text</code> content. Violating this causes a <strong>400 error</strong>.</li>
      </ul>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Every <code>tool_use</code> block must be answered with a matching <code>tool_result</code> — never skip one</li>
          <li>Client-side tools give you full control; server-side tools are managed by Anthropic</li>
          <li>Choose the execution bucket (sync/async/HITL) based on latency and safety requirements</li>
          <li>The <code>tool_use_id</code> is the binding contract — mismatches break the loop</li>
          <li>Multiple tool_use blocks can appear in a single response (parallel tool calls)</li>
          <li><code>tool_result</code> supports 4 content types: strings, text, images (base64), documents</li>
          <li><code>tool_result</code> blocks must come FIRST in the content array — text after all results</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works",
    docLabel: "Tool Use Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      { course: "Building with the Claude API", lesson: "Handling message blocks", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287757" }
    ],
    relatedTopics: ["d1-agentic-loop", "d2-tool-interfaces", "d2-error-responses"],
  },
  {
    id: "d1-multi-agent",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Multi-Agent Orchestration",
    icon: "",
    content: `
      <h3>Multi-Agent Orchestration Patterns</h3>
      <p>Complex tasks often exceed what a single agent can handle effectively. Multi-agent orchestration divides work among specialized agents, each with their own tools, instructions, and context boundaries. The dominant pattern is the <strong>coordinator-subagent (hub-and-spoke)</strong> architecture, where a central coordinator decomposes tasks and delegates to focused subagents.</p>
      <p>Each subagent is exposed to the coordinator as a callable tool. When the coordinator invokes a subagent, it provides a task description. The subagent executes autonomously — with its own tool set and system prompt — and returns a result. Critically, the coordinator sees only the subagent's final output, not its intermediate reasoning or tool calls. This context isolation is by design: it keeps each agent's context clean and focused.</p>
      <p>Subagents <strong>cannot spawn their own subagents</strong>. This single-level delegation constraint prevents unbounded recursion and keeps the system architecture predictable. If you need deeper delegation, restructure the coordinator to handle additional subagent types.</p>

      <div class="diagram">
        <div class="diagram-title">Hub-and-Spoke Architecture</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">User Task</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Coordinator Agent</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Subagent A</span>
        </div>
        <div class="diagram-flow" style="margin-top: 0.5rem;">
          <span class="diagram-node" style="visibility:hidden">User Task</span>
          <span class="diagram-arrow" style="visibility:hidden">→</span>
          <span class="diagram-node node-decision">Coordinator Agent</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Subagent B</span>
        </div>
        <div class="diagram-flow" style="margin-top: 0.5rem;">
          <span class="diagram-node" style="visibility:hidden">User Task</span>
          <span class="diagram-arrow" style="visibility:hidden">→</span>
          <span class="diagram-node node-decision">Coordinator Agent</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Subagent C</span>
        </div>
        <div class="diagram-caption">Coordinator delegates to specialized subagents. Each subagent has isolated context.</div>
      </div>

      <h4>When to Use Multi-Agent vs Single Agent</h4>
      <table>
        <thead><tr><th>Scenario</th><th>Approach</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Different subtasks need different tool sets</td><td>Multi-agent</td><td>Keeps each agent's tool set focused (4-5 tools ideal)</td></tr>
          <tr><td>Subtasks need different system prompts / expertise</td><td>Multi-agent</td><td>Each subagent can be specialized</td></tr>
          <tr><td>Independent subtasks can run in parallel</td><td>Multi-agent</td><td>Parallel spawning improves throughput</td></tr>
          <tr><td>Task is focused with a single concern</td><td>Single agent</td><td>Overhead of coordination is unnecessary</td></tr>
          <tr><td>Context sharing between steps is critical</td><td>Single agent</td><td>Subagents have isolated context</td></tr>
        </tbody>
      </table>

<pre><code>// Coordinator sees subagents as tools
const agents = [
  {
    name: "code_reviewer",
    description: "Reviews code for bugs, security issues, and style",
    allowedTools: ["read_file", "grep", "glob"],
  },
  {
    name: "test_writer",
    description: "Writes unit tests for the specified code",
    allowedTools: ["read_file", "write_file", "run_tests"],
  },
];

// Coordinator delegates — subagent results are opaque
const result = await coordinator.delegate("code_reviewer", {
  task: "Review the auth module for security issues"
});
// result contains only the final output, not intermediate steps</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Use the coordinator-subagent (hub-and-spoke) pattern for complex multi-concern tasks</li>
          <li>Subagents have isolated context — the coordinator sees only final results</li>
          <li>Subagents <strong>cannot</strong> spawn their own subagents — delegation is single-level only</li>
          <li>Parallel spawning of independent subagents improves throughput significantly</li>
          <li>Keep each subagent focused with 4-5 tools for best selection accuracy</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/agent-sdk/subagents",
    docLabel: "Subagents Docs",
    skilljarRefs: [
      { course: "Introduction to subagents", lesson: "What are subagents?", url: "https://anthropic.skilljar.com/introduction-to-subagents/450698" },
      { course: "Introduction to subagents", lesson: "Using subagents effectively", url: "https://anthropic.skilljar.com/introduction-to-subagents/450701" }
    ],
    relatedTopics: ["d1-subagent-config", "d1-task-decomposition", "d5-error-propagation"],
  },
  {
    id: "d1-hooks",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Agent SDK Hooks",
    icon: "",
    content: `
      <h3>Agent SDK Hooks</h3>
      <p>Hooks are interception points in the agent execution lifecycle that let you validate, modify, or block tool calls before or after they execute. The two primary hook types are <strong>PreToolUse</strong> (fires before a tool runs) and <strong>PostToolUse</strong> (fires after a tool completes). Hooks provide programmatic control that goes beyond what prompt instructions can achieve.</p>
      <p>Each hook handler receives the tool call details and returns a <strong>permissionDecision</strong>: <code>allow</code>, <code>deny</code>, or <code>ask</code> (prompt the user). The priority order is strict: <strong>deny > ask > allow</strong>. If any hook in the chain returns deny, the tool call is blocked regardless of what other hooks say. This gives security-critical hooks veto power.</p>
      <p>Hook handlers can be implemented as shell commands, HTTP webhooks, LLM-evaluated prompts, or subagent handlers. Shell command handlers use exit codes: <strong>exit 0 = allow</strong> (parses stdout as JSON), <strong>exit 2 = BLOCK</strong> (ignores stdout; stderr shown to Claude), and <strong>any other exit code (including 1) = non-blocking error</strong> (execution continues; stderr logged to transcript). Critically, exit code 1 does NOT block — only exit code 2 blocks.</p>

      <div class="diagram">
        <div class="diagram-title">Hook Execution Flow</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Tool Call Requested</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">PreToolUse Hooks</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Tool Executes</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">PostToolUse Hooks</span>
        </div>
        <div class="diagram-caption">PreToolUse can block execution. PostToolUse can log, normalize, or trigger follow-ups.</div>
      </div>

      <h4>Hook Handler Callback Signature</h4>
<pre><code>// PreToolUse hook handler receives:
{
  tool_name: string,      // Name of the tool being called
  tool_input: object,     // Parameters Claude is passing
  session_id: string,     // Current session identifier
}

// Handler returns:
{
  decision: "allow" | "deny" | "ask",
  reason?: string,        // Optional explanation
  modified_input?: object // Optional modified parameters (PreToolUse only)
}</code></pre>

      <h4>Shell Exit Codes</h4>
      <table>
        <thead><tr><th>Exit Code</th><th>Meaning</th><th>JSON Processing</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td><code>0</code></td><td>Success</td><td>YES (parses stdout)</td><td>Allow action, proceed normally</td></tr>
          <tr><td><code>2</code></td><td>Blocking error</td><td>NO (ignores stdout)</td><td><strong>Block action</strong>; stderr shown to Claude</td></tr>
          <tr><td>Any other (1, 3+)</td><td>Non-blocking error</td><td>NO</td><td>Execution continues; stderr in transcript</td></tr>
        </tbody>
      </table>
      <p><strong>CRITICAL</strong>: Exit code 1 does NOT block. Only exit code 2 blocks.</p>

      <h4>Permission Decision Priority</h4>
      <table>
        <thead><tr><th>Priority</th><th>Decision</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td>1 (highest)</td><td><code>deny</code></td><td>Block the tool call entirely</td></tr>
          <tr><td>2</td><td><code>defer</code></td><td>Pause for calling process (SDK/headless)</td></tr>
          <tr><td>3</td><td><code>ask</code></td><td>Prompt the user for approval</td></tr>
          <tr><td>4 (lowest)</td><td><code>allow</code></td><td>Permit the tool call</td></tr>
        </tbody>
      </table>

      <h4>Hook Event Types</h4>
      <p>There are <strong>26+ event types</strong> available for hooks, including: <code>PreToolUse</code>, <code>PostToolUse</code>, <code>SubagentStart</code>, <code>SubagentStop</code>, <code>SessionStart</code>, <code>SessionEnd</code>, <code>Stop</code>, <code>Notification</code>, <code>UserPromptSubmit</code>, <code>PermissionRequest</code>, <code>PermissionDenied</code>, <code>FileChanged</code>, <code>PreCompact</code>, <code>PostCompact</code>, and more. Hook event names are <strong>case-sensitive PascalCase</strong> (e.g., <code>PreToolUse</code>, not <code>pretooluse</code>).</p>

      <h4>Important Hook Behaviors</h4>
      <ul>
        <li><strong>Matcher regex</strong>: The matcher regex is evaluated against the <strong>tool name only</strong>. To filter by file path or other input properties, check <code>tool_input</code> inside the hook callback.</li>
        <li><strong>Parallel execution</strong>: All matching hooks run <strong>in parallel</strong> (not sequentially). Conflicting decisions are resolved by precedence: deny > defer > ask > allow.</li>
        <li><strong>Observation-only hooks</strong>: Return an empty object <code>{}</code> for hooks that only observe/log without affecting the decision.</li>
        <li><strong>asyncRewake</strong>: When <code>asyncRewake: true</code>, the hook runs in the background. If it exits with code 2, it <strong>wakes Claude</strong> and stderr (or stdout if stderr empty) is shown as a system reminder.</li>
        <li><strong>Character cap</strong>: <code>additionalContext</code>, <code>systemMessage</code>, and <code>updatedMCPToolOutput</code> are capped at <strong>10,000 characters</strong>. When exceeded, content is saved to a file and replaced with a preview + file path.</li>
      </ul>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>PreToolUse hooks fire before execution and can allow, deny, ask, or defer</li>
          <li>PostToolUse hooks fire after execution — useful for logging, normalization, and follow-up actions</li>
          <li>Priority order is <strong>deny > defer > ask > allow</strong> — any deny in the chain vetoes the call</li>
          <li>Shell exit codes: <strong>0 = allow</strong> (parses stdout), <strong>2 = BLOCK</strong> (ignores stdout), <strong>any other = non-blocking error</strong>. Exit 1 does NOT block.</li>
          <li>26+ event types available; names are case-sensitive PascalCase</li>
          <li>Hooks execute in parallel; matcher regex matches tool name only</li>
          <li>Hook output (additionalContext, systemMessage, updatedMCPToolOutput) capped at 10,000 characters</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/agent-sdk/hooks",
    docLabel: "Hooks Docs",
    skilljarRefs: [
      { course: "Claude Code in Action", lesson: "Introducing hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312000" },
      { course: "Claude Code in Action", lesson: "Defining hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312002" },
      { course: "Claude Code in Action", lesson: "Useful hooks!", url: "https://anthropic.skilljar.com/claude-code-in-action/312004" }
    ],
    relatedTopics: ["d1-programmatic-enforcement", "d5-hooks-settings", "d1-subagent-config"],
  },
  {
    id: "d1-subagent-config",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Subagent Configuration",
    icon: "",
    content: `
      <h3>Configuring Subagents with AgentDefinition</h3>
      <p>Subagents in the Claude Agent SDK are configured using the <strong>AgentDefinition</strong> object, which specifies everything a subagent needs to operate: its name, instructions, tools, model, and behavioral constraints. The AgentDefinition was formerly called "Task" but has been renamed to "Agent" to better reflect that subagents are autonomous actors, not passive task runners.</p>
      <p>The AgentDefinition has 15 fields (only <code>name</code> and <code>description</code> are required). The <code>tools</code> field controls which tools the subagent can access — if omitted, the subagent <strong>inherits ALL parent tools</strong>. Use <code>disallowedTools</code> to deny specific tools from the inherited set, enabling the principle of least privilege. The Task tool was renamed to <strong>Agent</strong> in version 2.1.63 (existing Task references still work as aliases).</p>
      <p>A critical constraint: subagents <strong>cannot nest</strong> — a subagent cannot spawn its own subagents. The prompt string of the Agent tool is the <strong>ONLY communication channel</strong> from parent to subagent. The subagent does NOT receive the parent's conversation history, tool results, or system prompt — it works independently with only its own system prompt and basic environment details.</p>

      <h4>AgentDefinition — 15 Fields (2 required)</h4>
      <table>
        <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>name</code></td><td><strong>Yes</strong></td><td>Unique identifier, lowercase letters and hyphens</td></tr>
          <tr><td><code>description</code></td><td><strong>Yes</strong></td><td>When Claude should delegate to this subagent</td></tr>
          <tr><td><code>tools</code></td><td>No</td><td>Tools subagent can use; <strong>inherits all if omitted</strong></td></tr>
          <tr><td><code>disallowedTools</code></td><td>No</td><td>Tools to deny from inherited/specified list</td></tr>
          <tr><td><code>model</code></td><td>No</td><td>sonnet, opus, haiku, full ID, or <code>inherit</code> (default)</td></tr>
          <tr><td><code>permissionMode</code></td><td>No</td><td>default, acceptEdits, auto, dontAsk, bypassPermissions, plan</td></tr>
          <tr><td><code>maxTurns</code></td><td>No</td><td>Max agentic turns before stop</td></tr>
          <tr><td><code>skills</code></td><td>No</td><td>Skills preloaded into subagent context</td></tr>
          <tr><td><code>mcpServers</code></td><td>No</td><td>MCP servers (references or inline)</td></tr>
          <tr><td><code>hooks</code></td><td>No</td><td>Lifecycle hooks scoped to subagent</td></tr>
          <tr><td><code>memory</code></td><td>No</td><td>Persistent memory scope: user, project, local</td></tr>
          <tr><td><code>background</code></td><td>No</td><td><code>true</code> for background task; default false</td></tr>
          <tr><td><code>effort</code></td><td>No</td><td>low, medium, high, max</td></tr>
          <tr><td><code>isolation</code></td><td>No</td><td><code>worktree</code> for isolated git worktree</td></tr>
          <tr><td><code>color</code></td><td>No</td><td>Display color for the subagent</td></tr>
        </tbody>
      </table>

      <h4>3 Creation Methods</h4>
      <ul>
        <li><strong>File-based</strong>: Place agent definitions in <code>.claude/agents/</code> (project) or <code>~/.claude/agents/</code> (user) or via managed settings</li>
        <li><strong>CLI flag</strong> (<code>--agents</code>): Pass JSON when launching; session-only</li>
        <li><strong>Interactive</strong> (<code>/agents</code> command): Guided setup within a session</li>
      </ul>

      <h4>Permission Inheritance</h4>
      <p>Subagents inherit permission context from the main conversation but can override via the <code>permissionMode</code> field. Exception: <code>bypassPermissions</code> in the parent takes precedence and cannot be overridden. Background subagents have permissions pre-approved before launch.</p>

<pre><code>// Example: Defining a security review subagent
const securityReviewer = {
  name: "security-reviewer",
  description: "Analyzes code for security vulnerabilities, injection risks, and auth issues",
  tools: ["Read", "Grep", "Glob"],  // Read-only access
  disallowedTools: ["Edit", "Write", "Bash"],
  model: "sonnet",
  maxTurns: 15,
  effort: "high",
};</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>AgentDefinition has 15 fields; only <code>name</code> and <code>description</code> are required</li>
          <li>Task tool was renamed to <strong>Agent</strong> in v2.1.63 (Task still works as alias)</li>
          <li>When <code>tools</code> is omitted, subagent inherits <strong>all</strong> parent tools</li>
          <li>The Agent tool prompt is the ONLY communication channel — subagent does NOT get parent context</li>
          <li>Subagents <strong>cannot nest</strong> — no subagent can spawn its own subagents</li>
          <li>3 creation methods: file-based (<code>.claude/agents/</code>), CLI flag (<code>--agents</code>), interactive (<code>/agents</code>)</li>
          <li>Subagents inherit permissions but can override via <code>permissionMode</code></li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/agent-sdk/subagents",
    docLabel: "Subagents Docs",
    skilljarRefs: [
      { course: "Introduction to subagents", lesson: "Creating a subagent", url: "https://anthropic.skilljar.com/introduction-to-subagents/450699" },
      { course: "Introduction to subagents", lesson: "Designing effective subagents", url: "https://anthropic.skilljar.com/introduction-to-subagents/450700" }
    ],
    relatedTopics: ["d1-multi-agent", "d1-hooks", "d1-sessions"],
  },
  {
    id: "d1-sessions",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Session Management",
    icon: "",
    content: `
      <h3>Session Management</h3>
      <p>Sessions track the full conversation and tool-use history of an agent interaction. Every Claude Code session has a unique session ID that persists across interruptions. If your session is interrupted — by a crash, network failure, or manual stop — you can resume it using the <code>--resume</code> flag with the session ID.</p>
      <p>The <code>fork_session</code> capability creates a new session that branches from an existing one, sharing all prior context up to the fork point. This is powerful for exploring multiple approaches from the same starting point without polluting the original session. Each fork becomes an independent session with its own subsequent history.</p>
      <p>Named sessions provide a way to tag sessions with human-readable names for easier retrieval. Instead of remembering cryptic session IDs, you can name a session and resume it by name later. This is especially useful in CI/CD workflows where sessions may span multiple pipeline stages.</p>

      <div class="diagram">
        <div class="diagram-title">Session Lifecycle</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">New Session</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Active Work</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Interrupted?</span>
        </div>
        <div class="diagram-flow" style="margin-top:0.5rem">
          <span class="diagram-node node-end">--resume → Continue</span>
          <span class="diagram-arrow" style="margin:0 1rem">|</span>
          <span class="diagram-node node-process">fork_session → New Branch</span>
        </div>
        <div class="diagram-caption">Sessions persist through interruptions. Forks create independent branches.</div>
      </div>

      <h4>When to Resume vs Start Fresh</h4>
      <table>
        <thead><tr><th>Scenario</th><th>Action</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Crash during a multi-step task</td><td>Resume</td><td>Preserves progress and context</td></tr>
          <tr><td>Trying a different approach</td><td>Fork</td><td>Keeps original session intact</td></tr>
          <tr><td>Task completed, new unrelated task</td><td>Start fresh</td><td>Clean context for new work</td></tr>
          <tr><td>Context is heavily degraded</td><td>Start fresh</td><td>Compaction may have lost critical details</td></tr>
          <tr><td>CI/CD review of same PR after updates</td><td>Resume (or new with prior findings)</td><td>Builds on previous analysis</td></tr>
        </tbody>
      </table>

<pre><code># Resume an interrupted session
claude --resume session_abc123

# Resume by session name
claude --resume "auth-refactor"

# Fork from current session to try an alternative approach
# (programmatic API)
const forked = await session.fork_session();
// forked has all prior context but independent going forward</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Every session has a unique ID; use <code>--resume</code> to continue interrupted sessions</li>
          <li><code>fork_session</code> creates a branch sharing prior context but independent going forward</li>
          <li>Named sessions make retrieval easier — especially useful in CI/CD</li>
          <li>Start fresh when context is degraded or the task is unrelated to the previous session</li>
          <li>Session manifests enable full recovery of interaction state</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/agent-sdk/sessions",
    docLabel: "Sessions Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/agent-sdk/sessions",
    relatedTopics: ["d1-agentic-loop", "d3-cicd", "d5-context-claude-code"],
  },
  {
    id: "d1-task-decomposition",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Task Decomposition",
    icon: "",
    content: `
      <h3>Task Decomposition Strategies</h3>
      <p>Breaking complex tasks into smaller subtasks is fundamental to building effective agentic systems. The two primary approaches are <strong>prompt chaining</strong> (fixed sequential pipelines) and <strong>adaptive decomposition</strong> (dynamic step selection based on intermediate results). Choosing the right approach depends on how predictable the task structure is.</p>
      <p>Prompt chaining works best when steps have strict dependencies and the workflow is well-understood. For example, a code migration pipeline might always follow: analyze → plan → transform → validate → test. Each step's output feeds directly into the next. The structure is rigid but predictable and easy to debug.</p>
      <p>Adaptive decomposition is more flexible — the agent examines intermediate results and decides what to do next. This is essential for tasks like code review, where the agent might discover issues in one file that require investigating related files. The tradeoff is less predictability and harder debugging.</p>

      <div class="diagram">
        <div class="diagram-title">Prompt Chaining vs Adaptive Decomposition</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Prompt Chaining</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Step 1</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Step 2</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Step 3</span>
        </div>
        <div class="diagram-flow" style="margin-top: 1rem;">
          <span class="diagram-node node-start">Adaptive</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Evaluate</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Choose Next</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Evaluate...</span>
        </div>
        <div class="diagram-caption">Chaining is fixed and predictable. Adaptive adjusts based on intermediate results.</div>
      </div>

      <h4>Multi-Pass Review: A Decomposition Case Study</h4>
      <p>Code review is a perfect example of why decomposition matters. A single-pass review of a large PR suffers from attention dilution — the reviewer tries to check everything at once and misses issues. The decomposed approach uses:</p>
      <table>
        <thead><tr><th>Pass</th><th>Focus</th><th>Scope</th></tr></thead>
        <tbody>
          <tr><td>Per-file pass</td><td>Bugs, logic errors, style</td><td>Each changed file individually</td></tr>
          <tr><td>Cross-file pass</td><td>Consistency, API contracts, imports</td><td>All changed files together</td></tr>
          <tr><td>Security pass</td><td>Injection, auth, data exposure</td><td>Security-sensitive files</td></tr>
          <tr><td>Aggregation pass</td><td>Dedup, prioritize, format</td><td>All findings from prior passes</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Prompt chaining: fixed sequence, predictable, best when dependencies are strict</li>
          <li>Adaptive decomposition: dynamic, flexible, best when the path depends on intermediate results</li>
          <li>Multi-concern tasks (e.g., "review this PR") need explicit decomposition to avoid narrow coverage</li>
          <li>Per-file + cross-file passes catch both local and systemic issues</li>
          <li>Coordinator decomposition quality directly determines subagent output coverage</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#chain-complex-prompts",
    docLabel: "Prompt Chaining Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Parallelization workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287804" },
      { course: "Building with the Claude API", lesson: "Chaining workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287800" },
      { course: "Building with the Claude API", lesson: "Routing workflows", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287801" }
    ],
    relatedTopics: ["d1-multi-agent", "d4-multi-instance-review", "d1-programmatic-enforcement"],
  },
  {
    id: "d1-programmatic-enforcement",
    domainId: 1,
    domain: "Agentic Architecture & Orchestration",
    title: "Programmatic Enforcement",
    icon: "",
    content: `
      <h3>Programmatic Enforcement vs Prompt Instructions</h3>
      <p>A common mistake in agentic systems is relying on prompt instructions for critical business logic. While prompts can guide model behavior probabilistically, they cannot <strong>guarantee</strong> compliance. Programmatic enforcement uses code-level gates that deterministically block or allow actions, providing the reliability that safety-critical workflows demand.</p>
      <p>The distinction is clear: prompt instructions are <strong>probabilistic</strong> — Claude will usually follow them but might not in edge cases. Programmatic enforcement is <strong>deterministic</strong> — code either allows or blocks the action, with no ambiguity. For anything involving financial transactions, identity verification, data deletion, or regulatory compliance, use programmatic enforcement.</p>
      <p>The best approach combines both: prompt instructions for general behavior, tone, and approach (where occasional deviation is acceptable), and programmatic hooks for critical invariants (where any deviation is unacceptable). Hooks provide the programmatic layer — a PreToolUse hook can verify prerequisites before allowing a sensitive tool to execute.</p>

      <div class="diagram">
        <div class="diagram-title">Enforcement Spectrum</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Prompt Instructions</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Probabilistic</span>
          <span class="diagram-arrow" style="font-size:1.5rem">···</span>
          <span class="diagram-node node-decision">Deterministic</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Programmatic Hooks</span>
        </div>
        <div class="diagram-caption">"Usually follows" vs "Always enforced" — choose based on consequence of failure.</div>
      </div>

      <h4>When to Use Each Approach</h4>
      <table>
        <thead><tr><th>Approach</th><th>Use For</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>Prompt instructions</strong></td><td>Tone, formatting, general approach, non-critical preferences</td><td>"Always be polite", "Use markdown for formatting"</td></tr>
          <tr><td><strong>Programmatic enforcement</strong></td><td>Financial transactions, identity verification, data deletion, compliance</td><td>Block transfer_funds unless verify_identity returned success</td></tr>
          <tr><td><strong>Both combined</strong></td><td>Complex workflows with both soft and hard requirements</td><td>Prompt: "Verify identity first". Hook: Block if not verified.</td></tr>
        </tbody>
      </table>

<pre><code>// Prerequisite gate: Block fund transfer unless identity is verified
const preToolUseHook = async (toolCall) => {
  if (toolCall.name === "transfer_funds") {
    const identityVerified = await checkPrerequisite("verify_identity");
    if (!identityVerified) {
      return {
        decision: "deny",
        reason: "Identity must be verified before transferring funds"
      };
    }
  }
  return { decision: "allow" };
};</code></pre>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Prompt instructions are probabilistic — Claude usually follows them but might not</li>
          <li>Programmatic enforcement (hooks/code gates) is deterministic — it always works</li>
          <li>Use programmatic enforcement for: financial, identity, deletion, compliance, safety</li>
          <li>Use prompt instructions for: tone, format, general approach, non-critical preferences</li>
          <li>Combine both: prompts for guidance, hooks for critical invariants</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works",
    docLabel: "Tool Use Docs",
    skilljarRefs: [
      { course: "Claude Code in Action", lesson: "Defining hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312002" }
    ],
    relatedTopics: ["d1-hooks", "d1-agentic-loop", "d5-hooks-settings"],
  },

  // ===== DOMAIN 2: Tool Design & MCP Integration (18%) — 7 topics =====
  {
    id: "d2-tool-interfaces",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "Tool Interface Design",
    icon: "",
    content: `
      <h3>Designing Effective Tool Interfaces</h3>
      <p>Tool interface design directly affects how reliably Claude selects and parameterizes tools. A well-designed tool interface has a clear description (3-4 sentences explaining what it does, when to use it, and what each parameter means), intuitive naming, and appropriate granularity. Poor tool design leads to incorrect selections, hallucinated parameters, and wasted loop iterations.</p>
      <p>Naming should be verb-based and specific: <code>get_customer_by_email</code> is better than <code>process</code> or <code>handle_data</code>. When a tool does too many things, split it into focused single-purpose tools. But don't over-split — having 18+ tools degrades selection quality because Claude has to evaluate too many options. The sweet spot is 4-8 tools per agent context.</p>
      <p>The <code>input_examples</code> field provides concrete usage examples that help Claude understand non-obvious parameter formats. This is especially useful for fields with specific formatting requirements (dates, IDs, query syntax). While optional, input examples significantly reduce parameter hallucination for complex schemas.</p>

      <h4>Tool Description Anatomy</h4>
<pre><code>{
  "name": "search_customers",
  "description": "Searches the customer database by name, email, or account ID. Use this tool when you need to find customer records for support queries, account lookups, or verification. Returns up to 10 matching results sorted by relevance. Pass null for fields you don't want to filter on.",
  "input_schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string", "description": "Full or partial customer name" },
      "email": { "type": "string", "description": "Exact email address" },
      "account_id": { "type": "string", "description": "6-digit account ID (e.g., '482910')" }
    },
    "required": []
  }
}</code></pre>

      <h4>Splitting vs Consolidating Tools</h4>
      <table>
        <thead><tr><th>Problem</th><th>Solution</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Tool does 5 different things via a "mode" parameter</td><td>Split into 5 focused tools</td><td><code>manage_user</code> → <code>create_user</code>, <code>delete_user</code>, etc.</td></tr>
          <tr><td>Agent has 20+ tools, selection is unreliable</td><td>Scope tools to current task</td><td>Only provide tools relevant to the current workflow</td></tr>
          <tr><td>Two tools always called together</td><td>Consolidate into one</td><td><code>fetch_data</code> + <code>parse_data</code> → <code>fetch_and_parse</code></td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Descriptions should be 3-4 sentences: what it does, when to use it, parameter details</li>
          <li>Use verb-based, specific names: <code>get_customer_by_email</code> not <code>process</code></li>
          <li>Split multi-purpose tools into focused tools; consolidate always-paired tools</li>
          <li>Keep tools per agent to 4-8; above 18 degrades selection accuracy significantly</li>
          <li>Use <code>input_examples</code> for non-obvious parameter formats to reduce hallucination</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#best-practices-for-tool-definitions",
    docLabel: "Define Tools Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Tool schemas", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287753" }
    ],
    relatedTopics: ["d2-tool-choice", "d2-strict-tool-use", "d1-tool-use-contract"],
  },
  {
    id: "d2-tool-choice",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "tool_choice Configuration",
    icon: "",
    content: `
      <h3>Controlling Tool Selection with tool_choice</h3>
      <p>The <code>tool_choice</code> parameter gives you fine-grained control over how Claude selects tools. It ranges from fully autonomous selection (<code>auto</code>) to forcing a specific tool. This parameter applies per API call, so you can change it between iterations of the agentic loop to guide behavior at different stages of a workflow.</p>
      <p>Understanding the four modes is critical for building predictable pipelines. <code>auto</code> (the default) lets Claude decide freely — it may or may not use a tool. <code>any</code> forces at least one tool call but lets Claude choose which. <code>tool</code> with a specific name forces that exact tool. <code>none</code> disables all tools, useful when you want a text-only response from a model that has tools defined.</p>
      <p>Important limitation: forcing a tool does <strong>not</strong> guarantee correct parameters. Even with <code>tool_choice: { type: "tool", name: "get_weather" }</code>, Claude might pass incorrect inputs. Always validate parameters regardless of the tool_choice setting. For guaranteed schema compliance, combine with <code>strict: true</code>.</p>

      <h4>The Four Modes</h4>
      <table>
        <thead><tr><th>Mode</th><th>Syntax</th><th>Behavior</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td><code>auto</code></td><td><code>{ type: "auto" }</code></td><td>Claude decides whether and which tool to use</td><td>General agentic use</td></tr>
          <tr><td><code>any</code></td><td><code>{ type: "any" }</code></td><td>Must use at least one tool, Claude picks which</td><td>When a tool call is always needed</td></tr>
          <tr><td><code>tool</code></td><td><code>{ type: "tool", name: "fn_name" }</code></td><td>Forces a specific tool</td><td>Pipeline steps, structured output extraction</td></tr>
          <tr><td><code>none</code></td><td><code>{ type: "none" }</code></td><td>Cannot use any tools</td><td>Text-only response, summarization steps</td></tr>
        </tbody>
      </table>

<pre><code>// Force a specific tool for structured output extraction
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  messages: [{ role: "user", content: "Extract the invoice data from..." }],
  tools: [invoiceExtractionTool],
  tool_choice: { type: "tool", name: "extract_invoice" },
});

// Disable tools for a summarization step
const summary = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  messages: conversationHistory,
  tools: toolDefinitions,  // Tools are defined but...
  tool_choice: { type: "none" },  // ...Claude cannot use them
});</code></pre>

      <h4>Extended Thinking Restrictions</h4>
      <p>When using extended thinking, only <code>tool_choice: auto</code> and <code>tool_choice: none</code> are supported. Using <code>tool_choice: any</code> or <code>tool_choice: tool</code> with extended thinking will return an error. This is an important constraint when building agents that combine chain-of-thought reasoning with tool use.</p>

      <h4>Prefilling Behavior</h4>
      <p>When <code>tool_choice</code> is set to <code>any</code> or <code>tool</code>, the API prefills the assistant message to force tool use. This means Claude will <strong>NOT</strong> emit natural language before <code>tool_use</code> blocks, even if explicitly asked to explain its reasoning first. If you need both natural language and a specific tool call, use <code>auto</code> with explicit instructions in the user message instead of forcing with <code>any</code> or <code>tool</code>.</p>

      <h4>Caching Impact</h4>
      <p>Changes to <code>tool_choice</code> invalidate cached message blocks. However, tool definitions and system prompts remain cached even when <code>tool_choice</code> changes. This means you can switch between modes across iterations without losing the cache benefit on your tool definitions — only the message-level cache is affected.</p>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li><code>auto</code> (default) — Claude decides freely; best for general agentic use</li>
          <li><code>any</code> — must use a tool, Claude picks which; good when you always need an action</li>
          <li><code>tool</code> with name — forces a specific tool; ideal for pipeline steps</li>
          <li><code>none</code> — no tools allowed; useful for text-only responses</li>
          <li>Forcing a tool does NOT guarantee correct parameters — always validate inputs</li>
          <li>With extended thinking, only <code>auto</code> and <code>none</code> work — <code>any</code>/<code>tool</code> return errors</li>
          <li><code>tool_choice</code> <code>any</code>/<code>tool</code> prefills the response — no natural language before <code>tool_use</code></li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#controlling-claudes-output",
    docLabel: "Tool Choice Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#controlling-claudes-output",
    relatedTopics: ["d2-tool-interfaces", "d2-strict-tool-use", "d4-structured-output"],
  },
  {
    id: "d2-strict-tool-use",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "Strict Tool Use",
    icon: "",
    content: `
      <h3>Strict Tool Use: Grammar-Constrained Sampling</h3>
      <p>Strict mode (<code>strict: true</code>) applies grammar-constrained decoding to guarantee that tool call arguments exactly match your input schema. Without strict mode, Claude generates JSON that <em>usually</em> matches the schema but may occasionally include extra fields, wrong types, or missing required properties. Strict mode eliminates these violations entirely.</p>
      <p>The tradeoff is that strict mode requires very precise schema definitions. All properties in the schema must be listed in the <code>required</code> array — there are no truly optional fields. Instead, use nullable types (<code>"type": ["string", "null"]</code>) for fields that might not have a value. Additionally, <code>additionalProperties</code> must be set to <code>false</code> at every object level in the schema, including nested objects.</p>
      <p>Use strict mode when schema compliance is critical and the consequences of malformed data are high. Healthcare systems subject to HIPAA, financial transaction processing, database write operations, and any system where malformed JSON could cause downstream failures all benefit from strict mode.</p>

      <h4>Schema Requirements for Strict Mode</h4>
      <table>
        <thead><tr><th>Requirement</th><th>Why</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>All properties in <code>required</code></td><td>Grammar must know all fields to constrain</td><td><code>"required": ["name", "email", "phone"]</code></td></tr>
          <tr><td>Nullable for optional values</td><td>Replaces optional fields</td><td><code>"type": ["string", "null"]</code></td></tr>
          <tr><td><code>additionalProperties: false</code></td><td>Prevents extra fields at every level</td><td>Must be set on every nested object too</td></tr>
          <tr><td>No unsupported keywords</td><td>Grammar constraints are strict</td><td>Avoid <code>oneOf</code>, <code>anyOf</code> in some contexts</td></tr>
        </tbody>
      </table>

<pre><code>// Strict mode tool definition
{
  "name": "create_patient_record",
  "description": "Creates a new patient record in the HIPAA-compliant system",
  "strict": true,
  "input_schema": {
    "type": "object",
    "required": ["patient_name", "dob", "ssn", "insurance_id"],
    "additionalProperties": false,
    "properties": {
      "patient_name": { "type": "string" },
      "dob": { "type": "string", "description": "Date of birth in YYYY-MM-DD format" },
      "ssn": { "type": "string", "description": "9-digit SSN without dashes" },
      "insurance_id": { "type": ["string", "null"], "description": "Insurance ID, null if uninsured" }
    }
  }
}</code></pre>

      <h4>Schema Caching</h4>
      <p>Compiled grammars from strict schemas are cached for <strong>up to 24 hours</strong> since last use. Importantly, prompts and responses are <strong>NOT</strong> retained beyond the API response. Changing the JSON schema structure invalidates the cache, but changing only the tool <code>name</code> or <code>description</code> does <strong>NOT</strong> invalidate it — the cache key is based on the schema structure alone.</p>

      <h4>PHI Restrictions</h4>
      <p>Strict tool use is HIPAA-eligible, but <strong>PHI must NOT be included in tool schema definitions</strong>. Because schemas are cached (up to 24 hours), they do not receive the same PHI protections as prompts and responses. Specifically, do NOT include PHI in: <code>input_schema</code> property names, <code>enum</code> values, <code>const</code> values, or <code>pattern</code> regular expressions. PHI should only appear in message content (prompts and responses), never in the schema itself.</p>

      <h4>Extended Thinking</h4>
      <p><code>strict: true</code> works with extended thinking, but only when combined with <code>tool_choice: auto</code> or <code>tool_choice: none</code>. Using <code>tool_choice: any</code> or <code>tool_choice: tool</code> with extended thinking returns an error, regardless of whether strict mode is enabled.</p>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li><code>strict: true</code> guarantees exact schema compliance via grammar-constrained sampling</li>
          <li>All properties must be in <code>required</code> — use nullable types for optional values</li>
          <li><code>additionalProperties: false</code> must be set at every object level, including nested</li>
          <li>Use strict mode for: HIPAA, financial transactions, database writes, safety-critical systems</li>
          <li>Strict mode prevents hallucinated or malformed parameters but requires precise schemas</li>
          <li>Compiled schemas cached up to 24h — prompts/responses NOT retained</li>
          <li>PHI must NOT be in schema definitions (property names, enum/const values, patterns) due to caching</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use",
    docLabel: "Strict Tool Use Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use",
    relatedTopics: ["d2-tool-choice", "d2-tool-interfaces", "d4-structured-output"],
  },
  {
    id: "d2-error-responses",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "Error Handling in Tool Use",
    icon: "",
    content: `
      <h3>Structured Error Responses for Tools</h3>
      <p>When a tool execution fails, the error response you send back in the <code>tool_result</code> determines how effectively Claude can recover. Setting <code>is_error: true</code> tells Claude the call failed. But a bare error flag is not enough — structured error context with category, retryability, and actionable details enables intelligent recovery.</p>
      <p>Claude will typically retry a tool call 2-3 times when it fails, especially if the error appears transient. Including an <code>isRetryable</code> flag helps Claude decide whether to retry (for transient errors like rate limits or timeouts) or try an alternative approach (for permanent errors like invalid IDs or insufficient permissions).</p>
      <p>A critical anti-pattern: returning empty results when a tool fails due to access issues. If a database query fails because of a permissions error, returning an empty array says "no data found" — which is <strong>misleading</strong>. The correct response is a structured error explaining the access failure, so Claude (and the user) know the data might exist but couldn't be accessed.</p>

      <h4>Structured Error Response Format</h4>
<pre><code>// Good: Structured error with actionable context
{
  "type": "tool_result",
  "tool_use_id": "toolu_abc123",
  "is_error": true,
  "content": JSON.stringify({
    "error": "Rate limit exceeded",
    "errorCategory": "rate_limit",
    "isRetryable": true,
    "retryAfter": 30,
    "context": "GitHub API rate limit: 60/hour. Resets at 14:30 UTC."
  })
}

// Bad: Masking an access failure as empty results
{
  "type": "tool_result",
  "tool_use_id": "toolu_abc123",
  "content": "[]"  // This implies "no data" but really access was denied!
}</code></pre>

      <h4>Error Categories and Retry Behavior</h4>
      <table>
        <thead><tr><th>Category</th><th>Retryable?</th><th>Claude's Behavior</th></tr></thead>
        <tbody>
          <tr><td><code>rate_limit</code></td><td>Yes (after delay)</td><td>Waits and retries 2-3 times</td></tr>
          <tr><td><code>timeout</code></td><td>Yes</td><td>Retries immediately, up to 2-3 attempts</td></tr>
          <tr><td><code>not_found</code></td><td>No</td><td>Tries alternative parameters or different tool</td></tr>
          <tr><td><code>authentication</code></td><td>No</td><td>Reports auth issue to user</td></tr>
          <tr><td><code>validation</code></td><td>Depends</td><td>May fix parameters and retry</td></tr>
          <tr><td><code>server_error</code></td><td>Yes</td><td>Retries, then falls back to alternative approach</td></tr>
        </tbody>
      </table>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Set <code>is_error: true</code> in tool_result to signal failure</li>
          <li>Include <code>errorCategory</code> and <code>isRetryable</code> for intelligent recovery</li>
          <li>Claude retries 2-3 times for transient errors (rate limits, timeouts)</li>
          <li>Never return empty results for access failures — always surface the error explicitly</li>
          <li>Provide actionable context: what failed, why, and what alternatives exist</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls#handling-errors-with-is_error",
    docLabel: "Handle Tool Calls Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" }
    ],
    relatedTopics: ["d1-tool-use-contract", "d5-error-propagation", "d1-agentic-loop"],
  },
  {
    id: "d2-mcp-architecture",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "MCP Architecture",
    icon: "",
    content: `
      <h3>Model Context Protocol Architecture</h3>
      <p>The Model Context Protocol (MCP) standardizes how AI applications connect to external tools and data sources. Rather than building custom integrations for each tool, MCP provides a universal protocol with three primitives — <strong>tools</strong>, <strong>resources</strong>, and <strong>prompts</strong> — each with different control semantics that determine who decides when they are used.</p>
      <p>MCP uses JSON-RPC 2.0 for communication between clients and servers. The client (your AI application) discovers capabilities from the server using list methods (<code>tools/list</code>, <code>resources/list</code>, <code>prompts/list</code>) and invokes them with call methods (<code>tools/call</code>, <code>resources/read</code>, <code>prompts/get</code>). The lifecycle follows: initialize → discover capabilities → use capabilities → shutdown.</p>
      <p>An important detail for the certification: MCP uses <strong>camelCase</strong> for <code>inputSchema</code>, while the Anthropic Messages API uses <strong>snake_case</strong> <code>input_schema</code>. This is a common source of bugs when bridging between the two.</p>

      <div class="diagram">
        <div class="diagram-title">MCP Three Primitives</div>
        <div class="diagram-flow">
          <span class="diagram-node node-process">Tools</span>
          <span class="diagram-node node-decision">Resources</span>
          <span class="diagram-node node-end">Prompts</span>
        </div>
        <div class="diagram-flow" style="margin-top: 0.25rem;">
          <span class="diagram-node node-start" style="font-size:0.7rem">Model-controlled</span>
          <span class="diagram-node node-start" style="font-size:0.7rem">App-controlled</span>
          <span class="diagram-node node-start" style="font-size:0.7rem">User-controlled</span>
        </div>
        <div class="diagram-caption">Who decides when to use each primitive defines the control model.</div>
      </div>

      <h4>Three Primitives Deep Dive</h4>
      <table>
        <thead><tr><th>Primitive</th><th>Control</th><th>Key Methods</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>Tools</strong></td><td>Model-controlled (LLM decides)</td><td><code>tools/list</code>, <code>tools/call</code></td><td>Execute SQL query, send email, call API</td></tr>
          <tr><td><strong>Resources</strong></td><td>Application-controlled (host decides)</td><td><code>resources/list</code>, <code>resources/read</code></td><td>File contents, database schemas, config files</td></tr>
          <tr><td><strong>Prompts</strong></td><td>User-controlled (user selects)</td><td><code>prompts/list</code>, <code>prompts/get</code></td><td>Code review template, summarization template</td></tr>
        </tbody>
      </table>

      <h4>Direct Resources vs Resource Templates</h4>
      <p><strong>Direct Resources</strong> have fixed URIs and are discovered via <code>resources/list</code>. Each resource has a concrete <code>uri</code> (e.g., <code>file:///project/src/main.rs</code>) along with required fields <code>name</code> and optional fields like <code>description</code>, <code>mimeType</code>, and <code>size</code>.</p>
      <p><strong>Resource Templates</strong> have parameterized URIs with placeholders (e.g., <code>weather://{city}/current</code>) and are discovered via <code>resources/templates/list</code>. Templates follow RFC 6570 URI Template syntax. The required field is <code>uriTemplate</code> instead of <code>uri</code>. Arguments may be auto-completed via the completion API.</p>
      <table>
        <thead><tr><th>Type</th><th>Discovery Method</th><th>URI Field</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Direct Resource</td><td><code>resources/list</code></td><td><code>uri</code> (fixed)</td><td><code>file:///project/src/main.rs</code></td></tr>
          <tr><td>Resource Template</td><td><code>resources/templates/list</code></td><td><code>uriTemplate</code> (parameterized)</td><td><code>weather://{city}/current</code></td></tr>
        </tbody>
      </table>

      <h4>Transport Types</h4>
      <table>
        <thead><tr><th>Transport</th><th>Description</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td><code>stdio</code></td><td>Local process communication via stdin/stdout</td><td>Standard for local tools</td></tr>
          <tr><td><code>HTTP</code> / Streamable HTTP</td><td>HTTP POST/GET with session management via <code>Mcp-Session-Id</code></td><td><strong>Recommended</strong> for remote</td></tr>
          <tr><td><code>SSE</code> (HTTP+SSE)</td><td>Server-Sent Events transport</td><td><strong>DEPRECATED</strong> — use HTTP instead</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Three primitives: Tools (model-controlled), Resources (app-controlled), Prompts (user-controlled)</li>
          <li>MCP uses JSON-RPC 2.0 for client-server communication</li>
          <li>MCP uses camelCase <code>inputSchema</code>; Anthropic API uses snake_case <code>input_schema</code></li>
          <li>Lifecycle: initialize → discover capabilities → use capabilities → shutdown</li>
          <li>Direct Resources have fixed URIs (<code>resources/list</code>); Resource Templates have parameterized URIs (<code>resources/templates/list</code>, RFC 6570)</li>
          <li>Transport: stdio (local), HTTP/Streamable HTTP (recommended for remote), SSE (DEPRECATED)</li>
        </ul>
      </div>
    `,
    docUrl: "https://modelcontextprotocol.io/docs/learn/architecture",
    docLabel: "MCP Architecture Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Introducing MCP", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287780" },
      { course: "Building with the Claude API", lesson: "Defining resources", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287782" },
      { course: "Building with the Claude API", lesson: "Defining prompts", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287784" }
    ],
    relatedTopics: ["d2-mcp-config", "d2-tool-interfaces", "d2-builtin-tools"],
  },
  {
    id: "d2-mcp-config",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "MCP Configuration",
    icon: "",
    content: `
      <h3>Configuring MCP Servers</h3>
      <p>MCP servers are configured through JSON files at three different scopes. The <code>.mcp.json</code> file in the project root defines project-level MCP servers. The <code>~/.claude.json</code> file defines user-level servers available across all projects. And managed policy configurations define organization-level servers that cannot be overridden by individual users.</p>
      <p>Environment variable expansion is a key feature of MCP configuration. You can reference environment variables in config values using <code>\${VAR}</code> syntax, with default values supported via <code>\${VAR:-default}</code>. This is essential for secrets management — API tokens and credentials should never be hardcoded in configuration files.</p>
      <p>For remote MCP servers that require authentication, the <code>headersHelper</code> field allows you to specify a command that dynamically generates auth tokens. This is more secure than static tokens because the helper can refresh expired credentials automatically.</p>

      <h4>Scope Precedence</h4>
      <p>MCP scopes have a strict precedence order: <strong>Local</strong> (highest) > <strong>Project</strong> > <strong>User</strong> > <strong>Plugin-provided</strong> > <strong>claude.ai connectors</strong> (lowest). When duplicate servers exist, named scopes match by <strong>name</strong>, while plugins and connectors match by <strong>endpoint</strong>.</p>
      <table>
        <thead><tr><th>Scope</th><th>File</th><th>Shared</th><th>Applies To</th></tr></thead>
        <tbody>
          <tr><td>Local (default, highest)</td><td><code>~/.claude.json</code> (under project path)</td><td>No</td><td>Current project only</td></tr>
          <tr><td>Project</td><td><code>.mcp.json</code> (project root)</td><td>Yes, via VCS</td><td>Current project only</td></tr>
          <tr><td>User</td><td><code>~/.claude.json</code></td><td>No</td><td>All projects for this user</td></tr>
          <tr><td>Plugin-provided</td><td>Plugin config</td><td>Varies</td><td>Plugin-defined scope</td></tr>
          <tr><td>claude.ai connectors (lowest)</td><td>claude.ai settings</td><td>N/A</td><td>claude.ai web interface</td></tr>
        </tbody>
      </table>

<pre><code>// .mcp.json — Project-level MCP configuration
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    },
    "database": {
      "command": "node",
      "args": ["./mcp-servers/db-server.js"],
      "env": {
        "DB_URL": "\${DATABASE_URL:-postgresql://localhost:5432/dev}"
      }
    },
    "remote-api": {
      "url": "https://mcp.example.com/v1",
      "headersHelper": "node ./scripts/get-auth-token.js"
    }
  }
}</code></pre>

      <h4>Environment Variable Expansion</h4>
      <p>Env vars can be expanded in <strong>5 locations</strong>: <code>command</code>, <code>args</code>, <code>env</code>, <code>url</code>, and <code>headers</code>. If a required variable is not set and has no default, Claude Code fails to parse the config.</p>
      <table>
        <thead><tr><th>Syntax</th><th>Meaning</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>\${VAR}</code></td><td>Required — fails if not set</td><td><code>\${GITHUB_TOKEN}</code></td></tr>
          <tr><td><code>\${VAR:-default}</code></td><td>Uses default if VAR is not set</td><td><code>\${DB_URL:-localhost:5432}</code></td></tr>
        </tbody>
      </table>

      <h4>headersHelper</h4>
      <p>The <code>headersHelper</code> runs a command that outputs JSON key-value pairs to stdout, used for dynamic authentication tokens. It has a <strong>10-second timeout</strong>, runs fresh on <strong>each connection</strong> (no caching), and dynamic headers override static headers with the same name.</p>

      <h4>Environment Variables for MCP</h4>
      <table>
        <thead><tr><th>Variable</th><th>Purpose</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>MCP_TIMEOUT</code></td><td>Server startup timeout in milliseconds</td><td><code>MCP_TIMEOUT=10000 claude</code> (10s)</td></tr>
          <tr><td><code>MAX_MCP_OUTPUT_TOKENS</code></td><td>Warning threshold for output size (default: 10,000 tokens)</td><td><code>MAX_MCP_OUTPUT_TOKENS=50000</code></td></tr>
        </tbody>
      </table>

      <h4>MCP Tool Naming &amp; Transport Types</h4>
      <p>MCP tools follow the naming pattern <code>mcp__&lt;server&gt;__&lt;action&gt;</code> (e.g., <code>mcp__playwright__browser_screenshot</code>). Four transport types are supported:</p>
      <table>
        <thead><tr><th>Transport</th><th>Config Key</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>stdio</td><td><code>command</code> + <code>args</code></td><td>Standard for local</td></tr>
          <tr><td>http (streamable-http)</td><td><code>url</code></td><td><strong>Recommended</strong> for remote</td></tr>
          <tr><td>sse</td><td><code>url</code></td><td><strong>Deprecated</strong> — use http</td></tr>
          <tr><td>ws (WebSocket)</td><td>inline definition</td><td>For inline definitions</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Scope precedence: Local > Project > User > Plugin-provided > claude.ai connectors</li>
          <li>Local scope in <code>~/.claude.json</code> (under project path), Project in <code>.mcp.json</code>, User in <code>~/.claude.json</code></li>
          <li>Env vars expanded in 5 locations: <code>command</code>, <code>args</code>, <code>env</code>, <code>url</code>, <code>headers</code></li>
          <li><code>headersHelper</code>: 10s timeout, runs fresh each connection, dynamic overrides static headers</li>
          <li><code>MCP_TIMEOUT</code> sets startup timeout (ms); <code>MAX_MCP_OUTPUT_TOKENS</code> warns at 10k tokens</li>
          <li>Tool naming: <code>mcp__&lt;server&gt;__&lt;action&gt;</code></li>
          <li>4 transports: stdio, http (recommended), sse (deprecated), ws (inline)</li>
          <li>Never hardcode secrets — always use environment variable expansion</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/mcp",
    docLabel: "MCP Config Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/mcp",
    relatedTopics: ["d2-mcp-architecture", "d3-claude-md", "d2-builtin-tools"],
  },
  {
    id: "d2-builtin-tools",
    domainId: 2,
    domain: "Tool Design & MCP Integration",
    title: "Built-in Tools",
    icon: "",
    content: `
      <h3>Claude Code Built-in Tools</h3>
      <p>Claude Code provides six built-in tools for file operations and code exploration: <strong>Read</strong>, <strong>Write</strong>, <strong>Edit</strong>, <strong>Bash</strong>, <strong>Grep</strong>, and <strong>Glob</strong>. Understanding when to use each tool is essential for efficient codebase exploration. The key principle is <strong>incremental exploration</strong>: start broad (Glob to find files), narrow down (Grep to find relevant content), then read specific sections (Read with line ranges).</p>
      <p>A common mistake is reading entire files when only a few lines are needed, or using Bash to run <code>grep</code> when the built-in Grep tool is optimized for the task. Each tool is designed for a specific purpose, and using the right tool for each step keeps context usage efficient and operations fast.</p>
      <p>The Edit tool deserves special attention: it performs targeted string replacements and is <strong>always preferred over Write</strong> for modifying existing files. Write overwrites the entire file, which is wasteful and error-prone for small changes. Edit sends only the diff, preserving the rest of the file exactly as-is.</p>

      <h4>Tool Reference</h4>
      <table>
        <thead><tr><th>Tool</th><th>Purpose</th><th>When to Use</th></tr></thead>
        <tbody>
          <tr><td><strong>Read</strong></td><td>Read file contents (supports line ranges, images, PDFs)</td><td>When you know which file and want its contents</td></tr>
          <tr><td><strong>Write</strong></td><td>Create new files or fully overwrite existing</td><td>Only for new files or complete rewrites</td></tr>
          <tr><td><strong>Edit</strong></td><td>Targeted string replacement in existing files</td><td>Any modification to existing files (preferred over Write)</td></tr>
          <tr><td><strong>Bash</strong></td><td>Execute shell commands</td><td>Build, test, git operations, complex commands</td></tr>
          <tr><td><strong>Grep</strong></td><td>Search file contents by regex</td><td>Finding specific patterns, references, usages</td></tr>
          <tr><td><strong>Glob</strong></td><td>Find files by name pattern</td><td>Locating files by name, extension, or path pattern</td></tr>
        </tbody>
      </table>

      <div class="diagram">
        <div class="diagram-title">Incremental Exploration Pattern</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Glob: Find files</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Grep: Search content</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Read: View specific lines</span>
        </div>
        <div class="diagram-caption">Start broad, narrow down, then read precisely. Minimizes context usage.</div>
      </div>

<pre><code>// Incremental exploration example:
// 1. Find all TypeScript files in the auth module
Glob("src/auth/**/*.ts")

// 2. Search for JWT-related code in those files
Grep("jwt|token|bearer", { path: "src/auth/", type: "ts" })

// 3. Read the specific file and line range
Read("src/auth/middleware.ts", { offset: 45, limit: 20 })

// 4. Make a targeted edit (NOT a full write)
Edit("src/auth/middleware.ts", {
  old_string: "const token = req.headers.auth",
  new_string: "const token = req.headers.authorization"
})</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Six built-in tools: Read, Write, Edit, Bash, Grep, Glob</li>
          <li>Always prefer Edit over Write for modifying existing files — Edit sends only the diff</li>
          <li>Follow the incremental exploration pattern: Glob → Grep → Read</li>
          <li>Use Grep for content search (not Bash + grep) — it is optimized and permission-safe</li>
          <li>Use Glob for file discovery, Grep for content discovery, Read for targeted viewing</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/agent-sdk/overview#built-in-tools",
    docLabel: "Built-in Tools Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/agent-sdk/overview#built-in-tools",
    relatedTopics: ["d2-tool-interfaces", "d5-large-codebase", "d3-claude-md"],
  },

  // ===== DOMAIN 3: Claude Code Configuration & Workflows (20%) — 7 topics =====
  {
    id: "d3-claude-md",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "CLAUDE.md Hierarchy",
    icon: "",
    content: `
      <h3>CLAUDE.md Configuration Hierarchy</h3>
      <p>CLAUDE.md files are persistent instruction files that Claude reads at the start of every session. They follow a four-level hierarchy, with each level serving a different purpose. Understanding the hierarchy and loading order is essential for structuring instructions effectively.</p>
      <p>The four levels, from broadest to most specific: <strong>Managed policies</strong> (organization-level, enforced, cannot be overridden), <strong>Project CLAUDE.md</strong> (in the repository root, shared with the team), <strong>User-level CLAUDE.md</strong> (<code>~/.claude/CLAUDE.md</code>, personal preferences), and <strong>Local CLAUDE.md</strong> (subdirectory-specific or <code>CLAUDE.local.md</code> for uncommitted preferences).</p>
      <p>The <code>@import</code> directive allows CLAUDE.md files to include content from other files or URLs. Imports are resolved transitively up to a maximum of 5 hops. This enables modular configuration where common instructions are defined once and imported where needed.</p>

      <h4>The Four Levels</h4>
      <table>
        <thead><tr><th>Level</th><th>File</th><th>Purpose</th><th>Can Override?</th></tr></thead>
        <tbody>
          <tr><td>Managed</td><td>Organization policy</td><td>Enforced org-wide rules</td><td>No — always applied</td></tr>
          <tr><td>Project</td><td><code>CLAUDE.md</code> (project root)</td><td>Team-shared project conventions</td><td>Additive only</td></tr>
          <tr><td>User</td><td><code>~/.claude/CLAUDE.md</code></td><td>Personal preferences across all projects</td><td>By local files</td></tr>
          <tr><td>Local</td><td><code>CLAUDE.local.md</code> / subdirectory CLAUDE.md</td><td>Personal or path-specific overrides</td><td>Most specific wins</td></tr>
        </tbody>
      </table>

<pre><code># CLAUDE.md (project root)

@import ./docs/coding-standards.md
@import ./docs/architecture.md

## Project Conventions
- Use TypeScript strict mode
- All API endpoints must have OpenAPI schemas
- Run \`npm test\` before committing

## Architecture
- Monorepo with packages in /packages
- Shared types in /packages/common
- API in /packages/api, UI in /packages/web</code></pre>

      <h4>Managed Policy Paths</h4>
      <p>Managed policies are organization-enforced CLAUDE.md files placed at system-level paths. These are always loaded and <strong>cannot be excluded</strong> via <code>claudeMdExcludes</code>.</p>
      <table>
        <thead><tr><th>Platform</th><th>Path</th></tr></thead>
        <tbody>
          <tr><td>Windows</td><td><code>C:\\Program Files\\ClaudeCode\\CLAUDE.md</code></td></tr>
          <tr><td>Linux / WSL</td><td><code>/etc/claude-code/CLAUDE.md</code></td></tr>
          <tr><td>macOS</td><td><code>/Library/Application Support/ClaudeCode/CLAUDE.md</code></td></tr>
        </tbody>
      </table>

      <h4>MEMORY.md (Auto Memory)</h4>
      <p>Auto Memory (<code>MEMORY.md</code>) is loaded at session start with limits: the first <strong>200 lines</strong> or first <strong>25 KB</strong>, whichever comes first. Content beyond that threshold is <strong>NOT automatically loaded</strong> into context.</p>

      <h4>HTML Comment Handling</h4>
      <p>Block-level HTML comments (<code>&lt;!-- ... --&gt;</code>) are <strong>stripped before injection</strong> into context, saving tokens. However, comments inside <strong>code blocks are preserved</strong>. When opening a CLAUDE.md file with the Read tool, comments remain visible in the raw file.</p>

      <h4>Delivery Mechanism</h4>
      <p>CLAUDE.md content is delivered as a <strong>user message after the system prompt</strong>, NOT as part of the system prompt itself. If you need instructions at the system prompt level, use <code>--append-system-prompt</code> instead.</p>

      <h4>claudeMdExcludes</h4>
      <p>Patterns in <code>claudeMdExcludes</code> are evaluated against <strong>absolute file paths</strong> using glob syntax. Arrays <strong>merge across settings layers</strong>. Managed policy CLAUDE.md files cannot be excluded regardless of pattern.</p>

      <h4>What Survives Compaction</h4>
      <p>When context is compacted, CLAUDE.md content survives because it is re-injected at the start of each compacted context. This makes CLAUDE.md the right place for critical instructions that must persist throughout long sessions. Put volatile or session-specific notes in a scratchpad file instead.</p>
      <p>Specifically, the <strong>project-root CLAUDE.md survives</strong> compaction and is re-read from disk and re-injected. However, <strong>nested subdirectory CLAUDE.md files are NOT re-injected</strong> after compaction until Claude reads files in that subdirectory again.</p>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>4 levels: Managed (org) > Project root > User (~/.claude/) > Local (subdirectory/CLAUDE.local.md)</li>
          <li><code>@import</code> includes other files — max 5 hops for transitive imports</li>
          <li>CLAUDE.md delivered as a <strong>user message</strong> after the system prompt, not part of the system prompt</li>
          <li>Managed policy paths are platform-specific and <strong>cannot be excluded</strong> via claudeMdExcludes</li>
          <li>MEMORY.md auto-loads first 200 lines or 25 KB (whichever first); beyond that is not loaded</li>
          <li>HTML comments stripped before injection (saves tokens); comments in code blocks preserved</li>
          <li>Project-root CLAUDE.md survives compaction; nested subdirectory CLAUDE.md files do NOT</li>
          <li><code>claudeMdExcludes</code> patterns evaluated against absolute paths using glob syntax; arrays merge across layers</li>
          <li><code>CLAUDE.local.md</code> is for personal preferences that should NOT be committed to version control</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/memory",
    docLabel: "Memory Docs",
    skilljarRefs: [
      { course: "Introduction to agent skills", lesson: "Skills vs. other Claude Code features", url: "https://anthropic.skilljar.com/introduction-to-agent-skills/434528" }
    ],
    relatedTopics: ["d3-rules", "d3-skills", "d5-context-claude-code"],
  },
  {
    id: "d3-rules",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "Path-Specific Rules",
    icon: "",
    content: `
      <h3>Path-Specific Rules</h3>
      <p>The <code>.claude/rules/</code> directory contains rule files that apply only when Claude works with specific file paths or patterns. Each rule file has YAML frontmatter that defines glob patterns for matching. When Claude reads or modifies a file matching those patterns, the corresponding rules are automatically loaded into context.</p>
      <p>Rules are more granular than CLAUDE.md — they let you provide framework-specific, language-specific, or directory-specific instructions without cluttering the main CLAUDE.md with conditional logic. For example, you might have different rules for React components vs. API routes vs. database migrations.</p>
      <p>There is an important distinction between <code>.claude/rules/</code> files and subdirectory CLAUDE.md files. Rules use glob patterns and can match files anywhere in the project. Subdirectory CLAUDE.md files apply to everything within that directory. Rules are generally preferred because they are more precise and do not require creating CLAUDE.md files throughout the directory tree.</p>

      <h4>Rule File Format</h4>
<pre><code># .claude/rules/react-components.md
---
globs:
  - "src/components/**/*.tsx"
  - "src/components/**/*.jsx"
---

## React Component Rules
- Use functional components with hooks, never class components
- Props interfaces must be exported and named {Component}Props
- Use React.memo() for components receiving object/array props
- Always include displayName for components used with React.lazy</code></pre>

<pre><code># .claude/rules/api-routes.md
---
globs:
  - "src/api/**/*.ts"
  - "src/routes/**/*.ts"
---

## API Route Rules
- All endpoints must validate input with Zod schemas
- Return standardized error responses with status codes
- Include rate limiting middleware on public endpoints
- Log all requests with correlation IDs</code></pre>

      <h4>Rules vs Subdirectory CLAUDE.md</h4>
      <table>
        <thead><tr><th>Feature</th><th>.claude/rules/</th><th>Subdirectory CLAUDE.md</th></tr></thead>
        <tbody>
          <tr><td>Matching</td><td>Glob patterns (flexible)</td><td>Directory containment (rigid)</td></tr>
          <tr><td>Location</td><td>Centralized in .claude/rules/</td><td>Scattered throughout directories</td></tr>
          <tr><td>Cross-directory</td><td>Yes — globs can match anywhere</td><td>No — only within that directory</td></tr>
          <tr><td>Best for</td><td>Framework/language-specific rules</td><td>Directory-specific context</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Rules live in <code>.claude/rules/</code> with YAML frontmatter containing glob patterns</li>
          <li>Automatically loaded when Claude works with files matching the glob patterns</li>
          <li>More flexible than subdirectory CLAUDE.md — can match files across directories</li>
          <li>Use rules for framework-specific, language-specific, or pattern-specific instructions</li>
          <li>Managed policies can enforce organizational rules that users cannot override</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/memory",
    docLabel: "Memory Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/memory#rules",
    relatedTopics: ["d3-claude-md", "d3-skills", "d1-programmatic-enforcement"],
  },
  {
    id: "d3-skills",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "Skills & Commands",
    icon: "",
    content: `
      <h3>Custom Skills & Commands</h3>
      <p>Skills (formerly slash commands) are reusable, parameterized workflows defined in <code>.claude/skills/</code> or <code>.claude/commands/</code>. They let teams standardize common operations — code reviews, deployment procedures, migration patterns — as invokable templates that any team member can use consistently.</p>
      <p>Each skill is a SKILL.md (or command.md) file with YAML frontmatter containing up to <strong>14 configuration fields</strong>. The most important are <code>allowed-tools</code> (restricting which tools the skill can use), <code>context:fork</code> (running in isolated context), <code>disable-model-invocation</code> (hidden from context until user invokes), and <code>argument-hint</code> (help text for the <code>$ARGUMENTS</code> placeholder). Only a SKILL.md file is required; all frontmatter fields are optional.</p>
      <p>The <code>$ARGUMENTS</code> placeholder in the skill body is replaced with whatever the user passes after the command name. For example, <code>/review auth-module</code> would replace <code>$ARGUMENTS</code> with "auth-module" in the skill's instructions. Skills can also inject shell command output into their body using <code>!\`command\`</code> syntax.</p>

      <h4>14 Frontmatter Fields</h4>
      <p>The <code>description</code> + <code>when_to_use</code> combined are truncated at <strong>1,536 characters</strong>. The <code>name</code> defaults to the directory name if not specified (max 64 chars).</p>
      <table>
        <thead><tr><th>Field</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>name</code></td><td>Display name. Max <strong>64 chars</strong>, lowercase letters/numbers/hyphens</td></tr>
          <tr><td><code>description</code></td><td>What the skill does. Combined with <code>when_to_use</code>, truncated at 1,536 chars</td></tr>
          <tr><td><code>when_to_use</code></td><td>Additional trigger context. Appended to description, counts toward 1,536 cap</td></tr>
          <tr><td><code>argument-hint</code></td><td>Hint shown during autocomplete (e.g., <code>[issue-number]</code>)</td></tr>
          <tr><td><code>disable-model-invocation</code></td><td><code>true</code> = description <strong>completely removed</strong> from context; zero tokens until user invokes</td></tr>
          <tr><td><code>user-invocable</code></td><td><code>false</code> hides from / menu but Claude can still invoke</td></tr>
          <tr><td><code>allowed-tools</code></td><td>Tools without permission prompts. Space-separated or YAML list</td></tr>
          <tr><td><code>model</code></td><td>Model to use when skill is active</td></tr>
          <tr><td><code>effort</code></td><td>Effort level: low, medium, high, max</td></tr>
          <tr><td><code>context</code></td><td>Set to <code>fork</code> to run in forked subagent</td></tr>
          <tr><td><code>agent</code></td><td>Subagent type when context:fork (Explore, Plan, general-purpose, custom)</td></tr>
          <tr><td><code>hooks</code></td><td>Hooks scoped to skill lifecycle</td></tr>
          <tr><td><code>paths</code></td><td>Glob patterns limiting when skill activates</td></tr>
          <tr><td><code>shell</code></td><td>Shell for <code>!\`command\`</code> blocks: bash (default) or powershell</td></tr>
        </tbody>
      </table>

      <h4>$ARGUMENTS Parsing</h4>
      <p><code>$ARGUMENTS</code> uses <strong>shell-style quoting</strong>: <code>"hello world"</code> is treated as a single argument. Indexed access via <code>$ARGUMENTS[N]</code> (0-based) or shorthand <code>$0</code>, <code>$1</code>, etc. Other substitutions include <code>\${CLAUDE_SESSION_ID}</code> and <code>\${CLAUDE_SKILL_DIR}</code>.</p>

      <h4>Shell Preprocessing &amp; Security</h4>
      <p>The <code>!\`command\`</code> syntax runs shell commands <strong>before</strong> content is sent to Claude (preprocessing). The setting <code>disableSkillShellExecution: true</code> prevents <code>!\`command\`</code> execution in project and personal skills. Bundled and managed skills are NOT affected by this setting.</p>

      <h4>Compaction Behavior</h4>
      <p>After compaction, each invoked skill retains up to <strong>5,000 tokens</strong>. The total combined budget across all skills is <strong>25,000 tokens</strong>. Slots are filled from the most recently invoked skill; older skills may be dropped if the budget is exceeded. Skill <em>descriptions</em> (non-invoked) do NOT survive compaction.</p>

<pre><code># .claude/skills/review.md
---
description: Run a comprehensive code review on a file or directory
allowed-tools:
  - Read
  - Grep
  - Glob
argument-hint: "file or directory path to review"
context: fork
---

Review the code at $ARGUMENTS for:
1. Security vulnerabilities (injection, auth, data exposure)
2. Logic errors and edge cases
3. Performance anti-patterns
4. Style consistency with project conventions

Current git diff for context:
!\`git diff --cached --stat\`

Report findings organized by severity (critical/high/medium/low).</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>14 frontmatter fields, all optional. Only a SKILL.md file is required; <code>name</code> defaults to directory name</li>
          <li><code>description</code> + <code>when_to_use</code> combined truncated at <strong>1,536 characters</strong></li>
          <li><code>$ARGUMENTS</code> uses shell-style quoting; <code>$0</code>/<code>$1</code> for indexed access</li>
          <li><code>disable-model-invocation: true</code> completely removes description from context (zero tokens)</li>
          <li><code>disableSkillShellExecution: true</code> prevents <code>!\`command\`</code> execution in skills</li>
          <li>Compaction: each invoked skill retains up to 5,000 tokens; 25,000 total budget across all skills</li>
          <li><code>context: fork</code> runs the skill in isolated context (prevents polluting main conversation)</li>
          <li>Skills can be project-scoped (<code>.claude/skills/</code>) or user-scoped (<code>~/.claude/skills/</code>)</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/skills",
    docLabel: "Skills Docs",
    skilljarRefs: [
      { course: "Introduction to agent skills", lesson: "What are skills?", url: "https://anthropic.skilljar.com/introduction-to-agent-skills/434525" },
      { course: "Introduction to agent skills", lesson: "Configuration and multi-file skills", url: "https://anthropic.skilljar.com/introduction-to-agent-skills/434526" },
      { course: "Introduction to agent skills", lesson: "Creating your first skill", url: "https://anthropic.skilljar.com/introduction-to-agent-skills/434527" }
    ],
    relatedTopics: ["d3-claude-md", "d3-cli", "d3-plan-mode"],
  },
  {
    id: "d3-plan-mode",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "Plan Mode",
    icon: "",
    content: `
      <h3>Plan Mode vs Direct Execution</h3>
      <p>Claude Code operates in two primary modes: <strong>plan mode</strong> (analysis and proposal without executing changes) and <strong>direct execution</strong> (implementing changes immediately). The choice between them depends on the scope, risk, and certainty of the task at hand.</p>
      <p>Plan mode is ideal for large-scale decisions where you want to explore options before committing. A microservice restructuring, database schema migration, or architectural refactor all benefit from planning first. Claude analyzes the codebase, proposes changes, and explains the tradeoffs — without actually modifying any files.</p>
      <p>The <strong>Explore subagent</strong> pattern combines both modes: first, an exploration subagent gathers information about the codebase (using read-only tools), then the main agent uses that information to plan or execute. This prevents the main agent from making changes based on incomplete understanding of the codebase.</p>

      <h4>When to Use Each Mode</h4>
      <table>
        <thead><tr><th>Mode</th><th>Best For</th><th>Risk Level</th></tr></thead>
        <tbody>
          <tr><td><strong>Plan</strong></td><td>Architectural refactors, multi-file restructuring, exploring options, unknown codebases</td><td>High-risk, large-scope</td></tr>
          <tr><td><strong>Direct</strong></td><td>Bug fixes, feature additions with clear specs, routine changes, test writing</td><td>Low-risk, well-understood</td></tr>
          <tr><td><strong>Plan + Direct</strong></td><td>Medium-scope changes where you want to review the plan before execution</td><td>Medium-risk</td></tr>
        </tbody>
      </table>

      <div class="diagram">
        <div class="diagram-title">Explore Subagent Pattern</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Explore Agent</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Gather Context</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Plan</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Execute</span>
        </div>
        <div class="diagram-caption">Explore first (read-only), then plan, then execute. Reduces risk of uninformed changes.</div>
      </div>

<pre><code># Use plan mode for a large refactor
claude --permission-mode plan "Analyze the auth module and propose
  how to migrate from JWT to session-based authentication.
  Consider backward compatibility, performance, and security."

# Direct execution for a focused bug fix
claude "Fix the null pointer exception in src/api/users.ts line 45
  where user.email is accessed without checking if user exists"

# Combine: plan first, then execute
claude "First explain what changes are needed to add rate limiting
  to all public API endpoints, then implement them"</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Plan mode: analyze and propose without executing — ideal for large-scope decisions</li>
          <li>Direct execution: implement immediately — best for well-understood, focused tasks</li>
          <li>The Explore subagent gathers codebase context before planning or execution</li>
          <li>Combine plan + direct for medium-risk tasks: review the plan, then green-light execution</li>
          <li>Plan mode reduces risk of unintended changes in complex or unfamiliar codebases</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/best-practices",
    docLabel: "Best Practices Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/best-practices#plan-before-you-build",
    relatedTopics: ["d3-cli", "d3-skills", "d1-task-decomposition"],
  },
  {
    id: "d3-cli",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "CLI for Automation",
    icon: "",
    content: `
      <h3>Claude Code CLI for Automation</h3>
      <p>Claude Code's CLI supports non-interactive usage for automation, scripting, and pipeline integration. The <code>-p</code> (or <code>--print</code>) flag is the cornerstone: it runs Claude with a single prompt in non-interactive mode, outputting the result to stdout. This makes Claude composable with other CLI tools via pipes and redirects.</p>
      <p>Output format control is essential for automation. <code>--output-format text</code> (default) returns plain text, <code>--output-format json</code> returns structured JSON with metadata, and <code>--output-format stream-json</code> streams JSON objects for real-time processing. The <code>--json-schema</code> flag constrains output to match a specific schema, and <code>--bare</code> omits hooks, skills, plugins, MCP, auto memory, and CLAUDE.md (also sets <code>CLAUDE_CODE_SIMPLE</code>).</p>
      <p>Resource limits protect against runaway agents: <code>--max-turns</code> caps the number of agentic loop iterations (print mode only; <strong>exits with error</strong> when reached, not a graceful summary), and <code>--max-budget-usd</code> sets a dollar ceiling (print mode only). The <code>--permission-mode</code> flag controls what actions Claude can take without asking.</p>

      <h4>Key CLI Flags</h4>
      <table>
        <thead><tr><th>Flag</th><th>Purpose</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>-p</code> / <code>--print</code></td><td>Non-interactive mode, single prompt</td><td><code>claude -p "explain this code"</code></td></tr>
          <tr><td><code>--output-format</code></td><td>Response format: text, json, stream-json</td><td><code>--output-format json</code></td></tr>
          <tr><td><code>--json-schema</code></td><td>Constrain output to a JSON schema</td><td><code>--json-schema '{"type":"object",...}'</code></td></tr>
          <tr><td><code>--bare</code></td><td>Suppress all formatting/status output</td><td>Clean pipeline integration</td></tr>
          <tr><td><code>--max-turns</code></td><td>Cap agentic loop iterations</td><td><code>--max-turns 10</code></td></tr>
          <tr><td><code>--permission-mode</code></td><td>Permission level (plan, auto-edit)</td><td><code>--permission-mode plan</code></td></tr>
          <tr><td><code>--append-system-prompt</code></td><td>Inject additional system instructions</td><td>Add context for CI/CD runs</td></tr>
        </tbody>
      </table>

<pre><code># Non-interactive analysis with JSON output
claude -p "Analyze the test coverage of src/auth/" \\
  --output-format json \\
  --max-turns 5

# Pipeline: generate structured data
claude -p "List all TODO comments in the codebase" \\
  --output-format json \\
  --json-schema '{"type":"array","items":{"type":"object","properties":{"file":{"type":"string"},"line":{"type":"integer"},"text":{"type":"string"}}}}' \\
  --bare

# CI/CD: read-only review with budget cap
claude -p "Review this PR for security issues" \\
  --permission-mode plan \\
  --max-turns 15 \\
  --max-budget 0.50</code></pre>

      <h4>Session Management Flags</h4>
      <table>
        <thead><tr><th>Flag</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td><code>--resume &lt;id/name&gt;</code></td><td>Resume a session by ID or name</td></tr>
          <tr><td><code>--fork-session</code></td><td>Used with <code>--resume</code> or <code>--continue</code>: creates a new session from an existing one (original unchanged)</td></tr>
          <tr><td><code>-c</code> / <code>--continue</code></td><td>Load the most recent conversation</td></tr>
        </tbody>
      </table>

      <h4>System Prompt Flags</h4>
      <p><code>--system-prompt</code> <strong>replaces</strong> the entire default system prompt. <code>--append-system-prompt</code> <strong>appends</strong> to it. <code>--system-prompt</code> and <code>--system-prompt-file</code> are mutually exclusive with each other, but append flags (<code>--append-system-prompt</code>, <code>--append-system-prompt-file</code>) CAN be combined with either replacement flag.</p>
      <p><code>--exclude-dynamic-system-prompt-sections</code> moves per-machine sections (working dir, env info, memory paths, git status) to the first user message, improving prompt-cache reuse across executions.</p>

      <h4>6 Permission Modes</h4>
      <table>
        <thead><tr><th>Mode</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td><code>default</code></td><td>Standard permission checking with prompts</td></tr>
          <tr><td><code>acceptEdits</code></td><td>Auto-accept file edits and common filesystem commands</td></tr>
          <tr><td><code>plan</code></td><td>Plan mode — <strong>read-only</strong> exploration</td></tr>
          <tr><td><code>auto</code></td><td>Background classifier reviews commands</td></tr>
          <tr><td><code>dontAsk</code></td><td>Auto-deny permission prompts (explicitly allowed tools still work)</td></tr>
          <tr><td><code>bypassPermissions</code></td><td>Skip permission prompts entirely</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li><code>-p</code> (--print) runs Claude non-interactively with a single prompt to stdout</li>
          <li><code>--bare</code> omits hooks, skills, plugins, MCP, auto memory, CLAUDE.md; sets CLAUDE_CODE_SIMPLE</li>
          <li><code>--max-turns</code> exits with <strong>error</strong> when limit reached (print mode only); <code>--max-budget-usd</code> also print mode only</li>
          <li><code>--system-prompt</code> replaces; <code>--append-system-prompt</code> appends. Append flags can combine with replacement flags</li>
          <li>6 permission modes: default, acceptEdits, plan (read-only), auto, dontAsk, bypassPermissions</li>
          <li>Session flags: <code>--resume</code>, <code>--continue</code>, <code>--fork-session</code> for session management</li>
          <li><code>--exclude-dynamic-system-prompt-sections</code> improves prompt-cache reuse</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/cli-reference",
    docLabel: "CLI Reference Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/cli",
    relatedTopics: ["d3-cicd", "d3-plan-mode", "d3-skills"],
  },
  {
    id: "d3-cicd",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "CI/CD Integration",
    icon: "",
    content: `
      <h3>CI/CD Integration with GitHub Actions</h3>
      <p>Claude Code integrates with CI/CD pipelines to automate code review, generate inline PR comments, and perform pre-merge analysis. The primary integration point is GitHub Actions, where Claude runs as a step in your workflow, analyzing changes and posting findings directly on the pull request.</p>
      <p>For CI/CD, Claude typically runs in non-interactive mode with <code>-p</code>, using <code>--permission-mode plan</code> to restrict to read-only operations. Session isolation ensures each CI run has a clean context. You can also include findings from prior runs to build on previous analysis rather than starting from scratch.</p>
      <p>The key design pattern for CI/CD review is: fetch the diff, provide it as context, and instruct Claude to analyze specific aspects (security, logic, performance, style). Output as structured JSON for programmatic processing, or use the GitHub Actions integration to post inline comments directly on the PR.</p>

      <div class="diagram">
        <div class="diagram-title">CI/CD Review Pipeline</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">PR Opened</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Fetch Diff</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Claude Reviews</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Post Comments</span>
        </div>
        <div class="diagram-caption">Automated review runs on every PR. Comments are posted inline on changed lines.</div>
      </div>

<pre><code># .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Claude Review
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main...HEAD > /tmp/diff.txt
          claude -p "Review this diff for security issues, bugs, and style problems. Output as JSON with file, line, severity, and message fields." \\
            --output-format json \\
            --permission-mode plan \\
            --max-turns 20 \\
            < /tmp/diff.txt</code></pre>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Use GitHub Actions to run Claude as an automated PR reviewer</li>
          <li>Always use <code>--permission-mode plan</code> in CI — read-only is safest</li>
          <li>Session isolation ensures each CI run starts with clean context</li>
          <li>Include prior findings when re-reviewing after updates to build on previous analysis</li>
          <li>Configure minimal write access — CI agents should review, not modify code</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/github-actions",
    docLabel: "GitHub Actions Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/github-actions",
    relatedTopics: ["d3-cli", "d1-sessions", "d4-multi-instance-review"],
  },
  {
    id: "d3-context-window",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "Context Window in Claude Code",
    icon: "",
    content: `
      <h3>Context Window Management in Claude Code</h3>
      <p>Claude Code manages its own context window, which includes everything from startup items to conversation history to tool outputs. The context window is <strong>200K tokens</strong> with older models, or <strong>1M tokens</strong> with newer models like Opus 4.6 and Sonnet 4.6. Understanding what consumes context at startup — and how compaction works — helps you structure information for maximum effectiveness across long sessions.</p>
      <p>At startup, seven items are loaded into context: CLAUDE.md files (all levels), matched rules from <code>.claude/rules/</code>, MCP tool definitions, system prompt, conversation history (if resuming), recent git context, and environment metadata. These items consume context before any user interaction, so keeping CLAUDE.md lean is important.</p>
      <p>When context fills up (around 95% capacity), Claude Code triggers <strong>compaction</strong>. The conversation is summarized to approximately 12% of its original size. CLAUDE.md content survives compaction because it is re-injected after summarization. However, detailed intermediate reasoning, specific tool outputs, and nuanced discussion details are often lost. The <code>/compact</code> command lets you trigger compaction manually with an optional focus topic.</p>

      <h4>Seven Startup Items</h4>
      <table>
        <thead><tr><th>#</th><th>Item</th><th>Source</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>CLAUDE.md files</td><td>All 4 levels of the hierarchy</td></tr>
          <tr><td>2</td><td>Matched rules</td><td><code>.claude/rules/</code> files matching current context</td></tr>
          <tr><td>3</td><td>MCP tool definitions</td><td>All configured MCP server tool schemas</td></tr>
          <tr><td>4</td><td>System prompt</td><td>Claude Code's built-in instructions</td></tr>
          <tr><td>5</td><td>Conversation history</td><td>Resumed session context (if applicable)</td></tr>
          <tr><td>6</td><td>Git context</td><td>Recent changes, branch info</td></tr>
          <tr><td>7</td><td>Environment metadata</td><td>OS, shell, working directory, etc.</td></tr>
        </tbody>
      </table>

      <h4>What Survives Compaction (Persistent Items)</h4>
      <table>
        <thead><tr><th>Survives (Re-injected)</th><th>Lost or Degraded</th></tr></thead>
        <tbody>
          <tr><td>System prompt</td><td>Detailed intermediate reasoning</td></tr>
          <tr><td>Auto memory (MEMORY.md)</td><td>Specific tool output details</td></tr>
          <tr><td>Environment info</td><td>Nuanced discussion context</td></tr>
          <tr><td>MCP tools (deferred definitions)</td><td>Exact code snippets from earlier in session</td></tr>
          <tr><td><code>~/.claude/CLAUDE.md</code> (user-level)</td><td>Skill descriptions (non-invoked skills)</td></tr>
          <tr><td>Project-root CLAUDE.md</td><td>Nested subdirectory CLAUDE.md files</td></tr>
          <tr><td>Invoked skills (5,000 tokens each, 25,000 total)</td><td>Non-invoked skill descriptions removed</td></tr>
        </tbody>
      </table>
      <p>Compaction produces a summary of approximately <strong>~12% of original size</strong>. Skill descriptions do NOT survive compaction — only invoked skills are preserved (up to 5,000 tokens each, 25,000 total budget, filled from most recently invoked).</p>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Context window: <strong>200K tokens</strong> (older models) or <strong>1M tokens</strong> (Opus 4.6, Sonnet 4.6)</li>
          <li>7 items load at startup: CLAUDE.md, rules, MCP tools, system prompt, history, git context, env</li>
          <li>Compaction summarizes to ~12% of original size when context fills (~95%)</li>
          <li>Persistent items: system prompt, auto memory, env info, MCP tools, ~/.claude/CLAUDE.md, project CLAUDE.md</li>
          <li>Skill descriptions do NOT survive compaction; only invoked skills preserved (5,000 tokens each, 25,000 total)</li>
          <li>Use scratchpad files to persist structured notes across compaction boundaries</li>
          <li><code>/compact</code> triggers manual compaction with an optional focus topic</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/context-window",
    docLabel: "Context Window Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/context-window",
    relatedTopics: ["d3-claude-md", "d5-context-windows", "d5-large-codebase"],
  },

  {
    id: "d3-iterative-refinement",
    domainId: 3,
    domain: "Claude Code Configuration & Workflows",
    title: "Iterative Refinement Techniques",
    icon: "",
    content: `
      <h3>Iterative Refinement Techniques</h3>
      <p>When prose descriptions produce inconsistent results, concrete <strong>input/output examples</strong> are the most effective way to communicate expected transformations. Instead of describing what you want in words, show 2-3 concrete examples of input and the exact output you expect. This is the single most powerful technique for aligning Claude's output with your expectations.</p>

      <h4>Test-Driven Iteration</h4>
      <p>Write test suites <strong>before</strong> implementation, covering expected behavior, edge cases, and performance requirements. Then iterate by sharing test failures with Claude to guide progressive improvement. Each failure message tells Claude exactly what went wrong and what to fix, creating a feedback loop that converges on the correct solution.</p>

      <h4>The Interview Pattern</h4>
      <p>For unfamiliar domains, have Claude <strong>ask questions first</strong> before implementing. This surfaces design considerations the developer may not have anticipated — cache invalidation strategies, failure modes, concurrency issues. The interview pattern is particularly valuable when building in domains where you lack expertise.</p>

      <h4>When to Batch vs Sequence Issues</h4>
      <p>Provide all issues in a <strong>single message</strong> when fixes interact with each other (e.g., changing an API interface affects both the handler and the client). Fix issues <strong>sequentially</strong> when problems are independent — this prevents Claude from getting overwhelmed and allows focused fixes.</p>

      <table>
        <thead><tr><th>Technique</th><th>When to Use</th><th>Best For</th></tr></thead>
        <tbody>
          <tr><td>Input/Output Examples</td><td>When prose descriptions are interpreted inconsistently</td><td>Data transformations, formatting, extraction</td></tr>
          <tr><td>Test-Driven Iteration</td><td>When you can define expected behavior programmatically</td><td>Functions, APIs, algorithms</td></tr>
          <tr><td>Interview Pattern</td><td>When building in unfamiliar domains</td><td>Architecture decisions, complex features</td></tr>
          <tr><td>Batch Issues</td><td>When fixes interact with each other</td><td>Refactoring, API changes</td></tr>
          <tr><td>Sequential Issues</td><td>When problems are independent</td><td>Bug fixes, unrelated improvements</td></tr>
        </tbody>
      </table>

<pre><code>// Example: Test-driven iteration workflow
// Step 1: Write the test first
test("parseDate handles ISO, US, and EU formats", () => {
  expect(parseDate("2024-03-15")).toBe("2024-03-15");
  expect(parseDate("03/15/2024")).toBe("2024-03-15");
  expect(parseDate("15.03.2024")).toBe("2024-03-15");
  expect(parseDate("March 15, 2024")).toBe("2024-03-15");
  expect(parseDate("invalid")).toBeNull();
});

// Step 2: Share failure output with Claude
// "Test failed: parseDate('15.03.2024') returned '2024-15-03'
//  Expected: '2024-03-15'"

// Step 3: Claude fixes the EU date parsing logic
// Step 4: Re-run tests, share any remaining failures</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>2-3 concrete input/output examples beat lengthy prose descriptions every time</li>
          <li>Test-driven iteration creates a precise feedback loop for progressive improvement</li>
          <li>The interview pattern surfaces considerations you haven't thought of</li>
          <li>Batch interacting issues in one message; sequence independent issues</li>
          <li>Include specific test cases with example input and expected output for edge cases</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/best-practices",
    docLabel: "Best Practices Docs",
    anthropicDocsRef: "https://code.claude.com/docs/en/best-practices",
    relatedTopics: ["d3-plan-mode", "d4-few-shot", "d4-prompting-best-practices"],
  },

  // ===== DOMAIN 4: Prompt Engineering & Structured Output (20%) — 6 topics =====
  {
    id: "d4-prompting-best-practices",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Prompting Best Practices",
    icon: "",
    content: `
      <h3>Prompting Best Practices</h3>
      <p>Effective prompting is about clear communication with Claude. The core principles are: be explicit about what you want, use structured formatting to organize complex prompts, provide specific evaluation criteria, and iterate systematically. Vague prompts produce vague outputs — precision in instructions directly correlates with output quality.</p>
      <p>XML tags are a powerful structuring tool for Claude. Wrapping different parts of a prompt in tags like <code>&lt;instructions&gt;</code>, <code>&lt;context&gt;</code>, and <code>&lt;examples&gt;</code> helps Claude distinguish between meta-instructions and data. This separation is especially important when the data being processed might be confused with instructions (e.g., processing emails that contain imperative language).</p>
      <p>Role prompting — giving Claude a specific persona — can improve performance on domain-specific tasks. "You are an expert security auditor" activates more relevant knowledge than generic instructions. However, the role should be authentic and specific rather than fictional or gimmicky.</p>

      <h4>Prompt Structure Template</h4>
<pre><code>&lt;system&gt;
You are an expert code reviewer specializing in Python security.
&lt;/system&gt;

&lt;instructions&gt;
Review the code below for security vulnerabilities.
For each finding:
1. State the vulnerability type (e.g., SQL injection, XSS)
2. Quote the exact problematic code
3. Explain why it is dangerous
4. Provide the corrected code
&lt;/instructions&gt;

&lt;context&gt;
This is a Django web application handling user authentication.
The application processes sensitive medical data under HIPAA.
&lt;/context&gt;

&lt;code&gt;
{user_code_here}
&lt;/code&gt;</code></pre>

      <h4>Key Principles</h4>
      <table>
        <thead><tr><th>Principle</th><th>Good</th><th>Bad</th></tr></thead>
        <tbody>
          <tr><td>Be explicit</td><td>"Return exactly 5 bullet points"</td><td>"Give me some ideas"</td></tr>
          <tr><td>Positive instructions</td><td>"Always validate input before processing"</td><td>"Don't forget to validate"</td></tr>
          <tr><td>Separate data from instructions</td><td>Use XML tags to wrap each section</td><td>Mix instructions and data in one paragraph</td></tr>
          <tr><td>Specify format</td><td>"Return JSON with fields: name, severity, fix"</td><td>"Tell me about the issues"</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Be explicit: specify format, length, style, and evaluation criteria</li>
          <li>Use XML tags (<code>&lt;instructions&gt;</code>, <code>&lt;context&gt;</code>, <code>&lt;examples&gt;</code>) to structure complex prompts</li>
          <li>Positive instructions outperform negative ones — say what to do, not what to avoid</li>
          <li>Role prompting activates domain-specific knowledge — keep it authentic and specific</li>
          <li>Test-driven iteration: define expected outputs first, then refine prompts</li>
        </ul>
      </div>

      <h4>Document Placement for Long Context</h4>
      <p>When working with long-form documents (20k+ tokens), place the document content at the <strong>top</strong> of the prompt and put your query/instructions at the <strong>bottom</strong>. This ordering improves response quality by up to 30% in tests. Structure documents with XML tags for clarity:</p>
<pre><code>&lt;documents&gt;
  &lt;document index="1"&gt;
    &lt;source&gt;annual_report_2025.pdf&lt;/source&gt;
    &lt;document_content&gt;
      {long document text here}
    &lt;/document_content&gt;
  &lt;/document&gt;
&lt;/documents&gt;

&lt;instructions&gt;
Based on the document above, extract all revenue figures by quarter.
&lt;/instructions&gt;</code></pre>
      <p>To ground responses in the source material, ask Claude to quote relevant parts first using <code>&lt;quotes&gt;</code> tags before answering.</p>

      <h4>Parallel Tool Calls</h4>
      <p>To instruct Claude to execute multiple tool calls in parallel, wrap the tool usage instructions in <code>&lt;use_parallel_tool_calls&gt;</code> tags. With Claude 4.6, this achieves a near-100% success rate for parallel tool execution when explicitly prompted:</p>
<pre><code>&lt;use_parallel_tool_calls&gt;
When you need to fetch data from multiple independent sources,
call all relevant tools simultaneously rather than sequentially.
&lt;/use_parallel_tool_calls&gt;</code></pre>

      <h4>Deprecation: Prefilled Responses</h4>
      <p>Starting with Claude 4.6 models, <strong>prefilled responses on the last assistant turn are no longer supported</strong>. On Mythos Preview, attempting to prefill returns a 400 error. Migrate to Structured Outputs (<code>output_config.format</code>) or direct instructions instead of relying on assistant prefills to steer output format.</p>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways (Updated)</div>
        <ul>
          <li>Be explicit: specify format, length, style, and evaluation criteria</li>
          <li>Use XML tags (<code>&lt;instructions&gt;</code>, <code>&lt;context&gt;</code>, <code>&lt;examples&gt;</code>) to structure complex prompts</li>
          <li>Positive instructions outperform negative ones — say what to do, not what to avoid</li>
          <li>Role prompting activates domain-specific knowledge — keep it authentic and specific</li>
          <li>For long context (20k+ tokens): documents at the TOP, query at the BOTTOM — up to 30% quality improvement</li>
          <li>Use <code>&lt;use_parallel_tool_calls&gt;</code> tags for near-100% parallel tool execution success on Claude 4.6</li>
          <li>Prefilled responses on last assistant turn are deprecated starting with Claude 4.6 (400 error on Mythos Preview)</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    docLabel: "Prompting Best Practices",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Being clear and direct", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287744" },
      { course: "Building with the Claude API", lesson: "Being specific", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287740" },
      { course: "Building with the Claude API", lesson: "Structure with XML tags", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287741" }
    ],
    relatedTopics: ["d4-few-shot", "d4-structured-output", "d4-adaptive-thinking"],
  },
  {
    id: "d4-few-shot",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Few-Shot Prompting",
    icon: "",
    content: `
      <h3>Few-Shot Prompting</h3>
      <p>Few-shot prompting provides Claude with 2-4 input-output examples that demonstrate the desired behavior. Well-chosen examples are often more effective than lengthy instructions, especially for tasks involving ambiguous formatting, nuanced classification, or domain-specific reasoning. The examples teach by demonstration rather than description.</p>
      <p>The key to effective few-shot prompting is <strong>diversity and coverage</strong>. Include at least one typical case, one edge case, and one example of each output category (for classification tasks). Examples should demonstrate the exact output format you expect — Claude will naturally mirror the structure it sees in examples.</p>
      <p>Place examples inside <code>&lt;example&gt;</code> tags after the instructions but before the actual input. This creates a clear separation between "what to do" (instructions), "what it looks like" (examples), and "do it now" (actual input). Using consistent formatting between examples and the actual task further improves generalization.</p>

<pre><code>&lt;instructions&gt;
Classify the customer message as: billing, technical, account, or general.
Include a confidence score (high/medium/low) and a one-sentence summary.
&lt;/instructions&gt;

&lt;example&gt;
Input: "I was charged twice for my subscription this month"
Output: {"category": "billing", "confidence": "high", "summary": "Customer reports duplicate subscription charge"}
&lt;/example&gt;

&lt;example&gt;
Input: "The app crashes when I try to upload files larger than 10MB"
Output: {"category": "technical", "confidence": "high", "summary": "File upload crashes on files exceeding 10MB"}
&lt;/example&gt;

&lt;example&gt;
Input: "Can I change my username? Also the page is loading slowly"
Output: {"category": "account", "confidence": "medium", "summary": "Username change request with secondary performance complaint"}
&lt;/example&gt;

Input: "{actual_customer_message}"</code></pre>

      <h4>Few-Shot Best Practices</h4>
      <table>
        <thead><tr><th>Practice</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Use 2-4 examples (not too many)</td><td>More examples waste context; too few miss edge cases</td></tr>
          <tr><td>Include at least one edge case</td><td>Shows how exceptions should be handled</td></tr>
          <tr><td>Match the exact output format</td><td>Claude mirrors the structure of examples</td></tr>
          <tr><td>Cover all output categories</td><td>For classification, show at least one of each category</td></tr>
          <tr><td>Use consistent formatting</td><td>Inconsistency between examples confuses the model</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>2-4 diverse examples are more effective than lengthy instructions for ambiguous tasks</li>
          <li>Include typical cases, edge cases, and all output categories</li>
          <li>Place examples in <code>&lt;example&gt;</code> tags after instructions, before actual input</li>
          <li>Claude mirrors the structure of examples — demonstrate exact output format</li>
          <li>Consistent formatting between examples improves generalization</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    docLabel: "Prompting Best Practices",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Providing examples", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287746" }
    ],
    relatedTopics: ["d4-prompting-best-practices", "d4-structured-output", "d4-batch-processing"],
  },
  {
    id: "d4-structured-output",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Structured Output",
    icon: "",
    content: `
      <h3>Structured Output via Tool Use and output_config</h3>
      <p>Claude can produce structured JSON output through two primary mechanisms: using tool_use with a schema-matching "extraction" tool (the established approach), and using <code>output_config</code> with <code>format: "json_schema"</code> (the newer, direct approach). Both provide schema validation, but output_config is cleaner for pure extraction tasks.</p>
      <p>The tool_use approach works by defining a "dummy" tool whose input_schema matches your desired output structure, then forcing Claude to call it with <code>tool_choice: { type: "tool", name: "extract_data" }</code>. Claude fills in the tool parameters as its output. This approach works with all Claude models and is battle-tested.</p>
      <p>For schema design, use <strong>nullable fields</strong> (<code>"type": ["string", "null"]</code>) for data that may not be present in the source document. Include <strong>confidence fields</strong> to enable downstream quality filtering. When you need a field that is mostly one of several known values but occasionally something else, use the <strong>enum + other</strong> pattern with an additional free-text field.</p>

      <h4>Two Approaches Compared</h4>
      <table>
        <thead><tr><th>Feature</th><th>tool_use Approach</th><th>output_config Approach</th></tr></thead>
        <tbody>
          <tr><td>How it works</td><td>Define extraction tool, force with tool_choice</td><td>Set <code>output_config.format</code> to json_schema</td></tr>
          <tr><td>Schema compliance</td><td>Good (better with strict:true)</td><td>Guaranteed by design</td></tr>
          <tr><td>Model support</td><td>All models with tool use</td><td>Newer models</td></tr>
          <tr><td>Best for</td><td>Complex workflows with multiple tools</td><td>Pure extraction/classification tasks</td></tr>
        </tbody>
      </table>

<pre><code>// Tool-use approach for structured extraction
const extractionTool = {
  name: "extract_invoice",
  description: "Extract structured data from invoice text",
  input_schema: {
    type: "object",
    required: ["vendor_name", "total", "line_items", "confidence"],
    properties: {
      vendor_name: { type: "string" },
      invoice_date: { type: ["string", "null"], description: "ISO date or null if not found" },
      total: { type: "number" },
      stated_total: { type: ["number", "null"], description: "Total as stated on invoice" },
      calculated_total: { type: "number", description: "Sum of line items" },
      line_items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            amount: { type: "number" },
            category: {
              type: "string",
              enum: ["labor", "materials", "shipping", "tax", "other"]
            },
            category_detail: { type: ["string", "null"] }  // Free-text when "other"
          }
        }
      },
      confidence: { type: "string", enum: ["high", "medium", "low"] }
    }
  }
};

// Force the extraction tool
const response = await client.messages.create({
  tools: [extractionTool],
  tool_choice: { type: "tool", name: "extract_invoice" },
  // ...
});</code></pre>

      <h4>output_config.format (Direct JSON Output)</h4>
      <p>The newer approach uses <code>output_config: {format: {type: "json_schema", schema: {...}}}</code> to get guaranteed-valid JSON output directly from Claude. The old <code>output_format</code> parameter was renamed to <code>output_config.format</code> (old parameter still works during the transition period). Response data is in <code>response.content[0].text</code>.</p>
<pre><code>// Direct JSON output via output_config.format
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  output_config: {
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          vendor_name: { type: "string" },
          total: { type: "number" },
          line_items: { type: "array", items: { type: "object" } }
        },
        required: ["vendor_name", "total"],
        additionalProperties: false
      }
    }
  },
  messages: [{ role: "user", content: "Extract invoice data..." }]
});</code></pre>

      <h4>SDK Helpers</h4>
      <p><strong>Python:</strong> Use Pydantic models with <code>client.messages.parse()</code>. Pass <code>output_format=MyModel</code> as a convenience parameter.</p>
      <p><strong>TypeScript (Zod):</strong> Import <code>zodOutputFormat</code> from <code>@anthropic-ai/sdk/helpers/zod</code>. Use <code>output_config: { format: zodOutputFormat(ContactInfo) }</code>. The <code>parse()</code> method returns <code>parsed_output</code> with inferred types.</p>
      <p><strong>TypeScript (JSON Schema without Zod):</strong> Import <code>jsonSchemaOutputFormat</code> from <code>@anthropic-ai/sdk/helpers/json-schema</code>. <strong>Important:</strong> <code>as const</code> is required for type inference — without it, the inferred type collapses to <code>unknown</code>. Only works with literal expressions.</p>

      <h4>Difference from Strict Tool Use</h4>
      <p><strong>output_config.format</strong> controls Claude's <em>response format</em> (what Claude says). <strong>strict: true</strong> validates <em>tool parameters</em> (how Claude calls functions). They solve different problems and can be used independently or together. Both share the same grammar-constrained sampling pipeline.</p>

      <h4>Validation-Retry Pattern</h4>
      <p>When extraction fails validation, send a follow-up message containing: the original document, the failed extraction, and the <strong>specific validation errors</strong>. Generic "please fix" messages are ineffective — include exact errors like "Line items sum to $147.50 but stated total is $157.50".</p>
      <p><strong>Important:</strong> Retries are ineffective when the information is simply absent from the source document. Make fields nullable or optional (<code>"type": ["string", "null"]</code>) if the data may not exist in the source.</p>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways (Updated)</div>
        <ul>
          <li>Two approaches: tool_use with forced tool_choice, or output_config.format with json_schema</li>
          <li><code>output_config.format</code> (newer) gives guaranteed-valid JSON; old <code>output_format</code> param renamed but still works</li>
          <li>Python SDK: <code>client.messages.parse()</code> with Pydantic; TypeScript: <code>zodOutputFormat()</code> or <code>jsonSchemaOutputFormat()</code></li>
          <li>TypeScript: <code>as const</code> required on schema literals — without it, type collapses to <code>unknown</code></li>
          <li><code>output_config.format</code> controls response format; <code>strict: true</code> validates tool params — different problems, can combine</li>
          <li>Validation-retry: include original doc + failed extraction + <strong>exact</strong> errors (not generic "please fix")</li>
          <li>Make fields nullable/optional if data may not exist — retries won't help when info is absent from source</li>
          <li>Use nullable fields (<code>["string", "null"]</code>) for data that might not exist in the source</li>
          <li>Include confidence fields for downstream quality filtering</li>
          <li>Use enum + other pattern: known values in enum, free-text in companion field for edge cases</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
    docLabel: "Structured Outputs Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Structured data", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287732" }
    ],
    relatedTopics: ["d2-tool-choice", "d2-strict-tool-use", "d4-batch-processing"],
  },
  {
    id: "d4-batch-processing",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Batch Processing",
    icon: "",
    content: `
      <h3>Message Batches API</h3>
      <p>The Message Batches API lets you send large volumes of requests at <strong>50% reduced cost</strong>, with results available within 24 hours. This is ideal for non-time-sensitive workloads like nightly reports, weekly audits, bulk document extraction, and large-scale classification. The tradeoff is latency — batches are not suitable for interactive applications.</p>
      <p>Each request in a batch is identified by a <code>custom_id</code> that you assign. When results come back, you match them to the original requests using this ID. The batch itself has a <code>processing_status</code> that tracks progress: <code>in_progress</code>, <code>ended</code>, <code>canceled</code>, or <code>expired</code>.</p>
      <p>Results come in four types: <code>succeeded</code> (the request completed successfully), <code>errored</code> (the request failed), <code>canceled</code> (you canceled the batch), and <code>expired</code> (24-hour window elapsed). Your code must handle all four types, especially distinguishing between succeeded and errored to ensure data integrity.</p>

      <h4>Batch Processing Flow</h4>
      <div class="diagram">
        <div class="diagram-title">Batch API Lifecycle</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Create Batch</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Processing (up to 24h)</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Poll Status</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Retrieve Results</span>
        </div>
      </div>

      <h4>Result Types</h4>
      <table>
        <thead><tr><th>Type</th><th>Meaning</th><th>Handling</th></tr></thead>
        <tbody>
          <tr><td><code>succeeded</code></td><td>Request completed successfully</td><td>Process the result</td></tr>
          <tr><td><code>errored</code></td><td>Request failed (invalid input, model error)</td><td>Log error, maybe retry individually</td></tr>
          <tr><td><code>canceled</code></td><td>Batch was canceled before this request processed</td><td>Resubmit in a new batch</td></tr>
          <tr><td><code>expired</code></td><td>24-hour processing window elapsed</td><td>Resubmit in a new batch</td></tr>
        </tbody>
      </table>

<pre><code>// Create a batch of document extraction requests
const batch = await client.batches.create({
  requests: documents.map((doc, i) => ({
    custom_id: \`doc-\${doc.id}\`,
    params: {
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: \`Extract invoice data: \${doc.text}\` }],
      tools: [extractionTool],
      tool_choice: { type: "tool", name: "extract_invoice" },
    }
  }))
});

// Poll for completion
const result = await client.batches.retrieve(batch.id);
if (result.processing_status === "ended") {
  for (const item of result.results) {
    if (item.result.type === "succeeded") {
      processResult(item.custom_id, item.result.message);
    } else {
      handleError(item.custom_id, item.result);
    }
  }
}</code></pre>

      <h4>custom_id Rules</h4>
      <p>The <code>custom_id</code> field must match the regex <code>^[a-zA-Z0-9_-]{1,64}$</code>. Only alphanumeric characters, hyphens, and underscores are allowed (1-64 characters). Each <code>custom_id</code> must be <strong>unique within a batch</strong>.</p>

      <h4>processing_status</h4>
      <p>There are only <strong>2 operational status values</strong>: <code>in_progress</code> (batch is being processed, initial state) and <code>ended</code> (all requests finished, results ready). During cancellation, the status is <code>canceling</code> until finalized.</p>

      <h4>Result Types and Billing</h4>
      <table>
        <thead><tr><th>Result Type</th><th>Description</th><th>Billed?</th></tr></thead>
        <tbody>
          <tr><td><code>succeeded</code></td><td>Request completed successfully</td><td><strong>Yes</strong></td></tr>
          <tr><td><code>errored</code></td><td>Request failed (invalid input or server error)</td><td><strong>No</strong></td></tr>
          <tr><td><code>canceled</code></td><td>Batch canceled before this request processed</td><td><strong>No</strong></td></tr>
          <tr><td><code>expired</code></td><td>24h expiration reached before processing</td><td><strong>No</strong></td></tr>
        </tbody>
      </table>
      <p>Only <code>succeeded</code> results are billed. Errored, canceled, and expired results incur no charges.</p>

      <h4>Limits and Retention</h4>
      <ul>
        <li><strong>Max limits per batch:</strong> 100,000 requests OR 256 MB total size (whichever comes first)</li>
        <li><strong>Result retention:</strong> Results are available for <strong>29 days</strong> after batch creation. After that, metadata is viewable but results are not downloadable.</li>
        <li><strong>Async parameter validation:</strong> Parameter validation occurs <strong>during processing</strong>, not at batch creation time. Invalid parameters appear as <code>errored</code> results with <code>invalid_request_error</code>. Tip: verify request shape with the synchronous API first.</li>
      </ul>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways (Updated)</div>
        <ul>
          <li>50% cost reduction vs individual API calls — significant at scale</li>
          <li>Results within 24 hours — not suitable for interactive/real-time use</li>
          <li><code>custom_id</code> must match <code>^[a-zA-Z0-9_-]{1,64}$</code> and be unique within a batch</li>
          <li>Only 2 operational statuses: <code>in_progress</code> and <code>ended</code> (plus <code>canceling</code> during cancellation)</li>
          <li>Only <code>succeeded</code> results are billed — errored, canceled, and expired are NOT billed</li>
          <li>Max: 100,000 requests OR 256 MB per batch</li>
          <li>Results available for 29 days after batch creation</li>
          <li>Parameter validation is asynchronous — occurs during processing, not at batch creation</li>
          <li>4 result types: succeeded, errored, canceled, expired — handle all four</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/batch-processing",
    docLabel: "Batch Processing Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/api/batch-processing",
    relatedTopics: ["d4-structured-output", "d4-few-shot", "d3-cli"],
  },
  {
    id: "d4-multi-instance-review",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Multi-Instance Review",
    icon: "",
    content: `
      <h3>Multi-Instance Review Architecture</h3>
      <p>A single Claude instance reviewing a large codebase or document set suffers from <strong>attention dilution</strong> — as content length grows, the probability of missing important details increases. The multi-instance review pattern addresses this by deploying multiple independent Claude instances, each focused on a specific scope or concern.</p>
      <p>Self-review (asking the same instance to review its own work) has fundamental limitations. The same biases that led to an error in the first pass are likely to cause it to be missed in the review pass. <strong>Independent review instances</strong> with different prompts and perspectives catch different issues, leading to more comprehensive coverage when findings are aggregated.</p>
      <p>The recommended architecture combines per-file passes with cross-file passes. Per-file reviewers focus on local correctness (bugs, security, style) for individual files. Cross-file reviewers check consistency across files (API contract compliance, import correctness, naming conventions). An aggregation pass then deduplicates, prioritizes, and formats the combined findings.</p>

      <div class="diagram">
        <div class="diagram-title">Multi-Pass Review Architecture</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Per-File Pass</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Cross-File Pass</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Aggregate Findings</span>
        </div>
        <div class="diagram-flow" style="margin-top: 0.5rem; font-size:0.8rem; color: var(--text-muted);">
          <span>File A review</span>
          <span style="margin:0 1.5rem">Consistency check</span>
          <span>Deduplicate & prioritize</span>
        </div>
        <div class="diagram-flow" style="font-size:0.8rem; color: var(--text-muted);">
          <span>File B review</span>
          <span style="margin:0 1.5rem">API contract check</span>
          <span>Format report</span>
        </div>
      </div>

      <h4>Single vs Multi-Instance Review</h4>
      <table>
        <thead><tr><th>Aspect</th><th>Single Instance</th><th>Multi-Instance</th></tr></thead>
        <tbody>
          <tr><td>Coverage</td><td>May miss issues in long content (attention dilution)</td><td>Each instance focuses on narrow scope</td></tr>
          <tr><td>Bias</td><td>Same biases in both generation and review</td><td>Independent instances catch different issues</td></tr>
          <tr><td>Cost</td><td>Lower (single API call)</td><td>Higher (multiple calls) but catches more issues</td></tr>
          <tr><td>Speed</td><td>Faster (one pass)</td><td>Can parallelize per-file passes</td></tr>
          <tr><td>Consistency</td><td>May miss cross-file issues</td><td>Dedicated cross-file pass catches consistency issues</td></tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Single-pass review suffers from attention dilution on large content</li>
          <li>Self-review has fundamental limitations — independent instances catch more issues</li>
          <li>Combine per-file passes (local correctness) with cross-file passes (consistency)</li>
          <li>Aggregation pass deduplicates and prioritizes findings from all reviewers</li>
          <li>Higher cost but significantly better coverage on complex codebases</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#chain-complex-prompts",
    docLabel: "Prompt Chaining Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#chain-complex-prompts",
    relatedTopics: ["d1-task-decomposition", "d3-cicd", "d1-multi-agent"],
  },
  {
    id: "d4-adaptive-thinking",
    domainId: 4,
    domain: "Prompt Engineering & Structured Output",
    title: "Adaptive Thinking",
    icon: "",
    content: `
      <h3>Adaptive Thinking & Effort Control</h3>
      <p>Claude supports extended thinking — internal step-by-step reasoning before producing a response. The newer <strong>adaptive thinking</strong> approach uses <code>type: "adaptive"</code> with an <code>effort</code> parameter (low, medium, high, max) instead of the older <code>budget_tokens</code> approach. This replaces the need to guess optimal token budgets with a simpler, more intuitive control.</p>
      <p>Higher effort levels produce better results on complex reasoning tasks (math, logic, multi-step analysis) but increase latency and cost. Low effort is suitable for simple classification or formatting tasks. High or max effort is appropriate for complex architectural decisions, deep code analysis, or multi-step problem solving.</p>
      <p>The older <code>budget_tokens</code> parameter set an explicit cap on thinking tokens. While it still works, the <code>effort</code> parameter is preferred because it lets Claude allocate thinking resources dynamically based on task complexity. Prefill-based thinking approaches (where you tried to inject thinking in the assistant prefill) are deprecated.</p>

      <h4>Effort Levels</h4>
      <table>
        <thead><tr><th>Level</th><th>Thinking Depth</th><th>Use Case</th><th>Cost/Latency</th></tr></thead>
        <tbody>
          <tr><td><code>low</code></td><td>Minimal reasoning</td><td>Simple classification, formatting, extraction</td><td>Lowest</td></tr>
          <tr><td><code>medium</code></td><td>Moderate reasoning</td><td>Standard analysis, code review, summarization</td><td>Moderate</td></tr>
          <tr><td><code>high</code></td><td>Deep reasoning</td><td>Complex debugging, architectural analysis</td><td>Higher</td></tr>
          <tr><td><code>max</code></td><td>Maximum reasoning</td><td>Multi-step proofs, deep research, novel problems</td><td>Highest</td></tr>
        </tbody>
      </table>

<pre><code>// Adaptive thinking with effort parameter
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 16000,
  thinking: {
    type: "adaptive"
  },
  output_config: {
    effort: "high"  // low | medium | high | max
  },
  messages: [{ role: "user", content: complexAnalysisTask }],
});

// Thinking content is returned in thinking blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log("Reasoning:", block.thinking);  // Internal reasoning (debugging)
  } else if (block.type === "text") {
    console.log("Response:", block.text);  // Final output
  }
}

// Older approach (deprecated on Claude 4.6, NOT supported on Opus 4.7+)
const response2 = await client.messages.create({
  thinking: {
    type: "enabled",
    budget_tokens: 10000  // Explicit token budget — legacy
  },
  // ...
});</code></pre>

      <h4>Important Compatibility Notes</h4>
      <ul>
        <li><strong>Effort in output_config:</strong> The <code>effort</code> parameter belongs in <code>output_config</code>, NOT inside the <code>thinking</code> object. Correct: <code>thinking: {type: "adaptive"}</code> + <code>output_config: {effort: "high"}</code>.</li>
        <li><strong>'max' effort level:</strong> Supported on all models that support adaptive thinking (Opus 4.7, Opus 4.6, Sonnet 4.6) — not exclusive to any single model.</li>
        <li><strong>Manual extended thinking (budget_tokens):</strong> Deprecated on Claude 4.6. NOT supported on Opus 4.7+ (returns 400 error). Must use adaptive thinking instead.</li>
        <li><strong>Prefilled responses:</strong> Deprecated in Claude 4.6/Mythos — migrate to Structured Outputs (<code>output_config.format</code>) or direct instructions.</li>
        <li><strong>Tool choice restrictions:</strong> With extended thinking enabled, only <code>tool_choice: auto</code> and <code>tool_choice: none</code> work. Using <code>any</code> or <code>tool</code> (specific tool name) returns errors.</li>
      </ul>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways (Updated)</div>
        <ul>
          <li>Use <code>thinking: {type: "adaptive"}</code> with <code>output_config: {effort: "high"}</code> — effort is in output_config, NOT in thinking</li>
          <li>Effort levels: low, medium, high, max — all supported across all adaptive-thinking-capable models</li>
          <li>Higher effort = better quality on complex tasks, but more latency and cost</li>
          <li>Manual <code>budget_tokens</code> is deprecated on Claude 4.6 and unsupported on Opus 4.7+</li>
          <li>Prefilled responses deprecated in Claude 4.6/Mythos — use Structured Outputs or direct instructions</li>
          <li>With extended thinking: only <code>tool_choice: auto</code> and <code>none</code> work — <code>any</code> and <code>tool</code> return errors</li>
          <li>Thinking blocks contain internal reasoning — useful for debugging, not user output</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking",
    docLabel: "Adaptive Thinking Docs",
    skilljarRefs: [
      { course: "Building with the Claude API", lesson: "Extended thinking", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287773" }
    ],
    relatedTopics: ["d4-prompting-best-practices", "d4-structured-output", "d5-context-windows"],
  },

  // ===== DOMAIN 5: Context Management & Reliability (15%) — 7 topics =====
  {
    id: "d5-context-windows",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Context Window Management",
    icon: "",
    content: `
      <h3>Context Window Management</h3>
      <p>Claude's context window has a finite token capacity that must be managed carefully to maintain output quality. The <strong>lost-in-the-middle</strong> effect is a well-documented phenomenon: information placed at the beginning and end of the context is recalled more accurately than information buried in the middle. This has direct implications for how you structure long prompts.</p>
      <p><strong>Progressive summarization</strong> is a common strategy for managing long conversations: earlier turns are condensed into summaries while recent turns are kept in full detail. However, this carries risks — summaries inevitably lose nuance, and critical details from earlier in the conversation may be lost. For tasks involving legal documents, medical records, or financial data, extract key facts into a structured "case facts" section that stays at the beginning of the context.</p>
      <p>Token budget planning is essential: reserve tokens for the response (output), system instructions, and the most relevant context. Trim verbose tool outputs to include only the data Claude needs for the next step. If a tool returns a 50KB JSON response but Claude only needs three fields, extract those fields before injecting into context.</p>

      <div class="diagram">
        <div class="diagram-title">Lost-in-the-Middle Effect</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start" style="background:rgba(16,185,129,0.15); border-color:#10b981">Start: HIGH recall</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision" style="background:rgba(239,68,68,0.15); border-color:#ef4444">Middle: LOW recall</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end" style="background:rgba(16,185,129,0.15); border-color:#10b981">End: HIGH recall</span>
        </div>
        <div class="diagram-caption">Place critical information at the start or end of context — avoid the middle.</div>
      </div>

      <h4>Context Window Sizes</h4>
      <table>
        <thead><tr><th>Context Size</th><th>Models</th><th>Max Images/PDFs</th></tr></thead>
        <tbody>
          <tr><td><strong>1M tokens</strong></td><td>Claude Opus 4.7, Opus 4.6, Sonnet 4.6</td><td>Up to 600 images or PDF pages</td></tr>
          <tr><td><strong>200K tokens</strong></td><td>Sonnet 4.5, Sonnet 4 (deprecated), older models</td><td>Up to 100 images or PDF pages</td></tr>
        </tbody>
      </table>

      <h4>Document Placement Strategy</h4>
      <p>For long-context prompts (20k+ tokens), <strong>place longform data at the TOP</strong> of the prompt, with queries and instructions at the BOTTOM. This document-first ordering improves response quality by <strong>up to 30%</strong> in tests. Structure documents with XML tags for clarity:</p>
<pre><code>&lt;documents&gt;
  &lt;document index="1"&gt;
    &lt;source&gt;quarterly_report_q3.pdf&lt;/source&gt;
    &lt;document_content&gt;
      ... full document text ...
    &lt;/document_content&gt;
  &lt;/document&gt;
  &lt;document index="2"&gt;
    &lt;source&gt;market_analysis.pdf&lt;/source&gt;
    &lt;document_content&gt;
      ... full document text ...
    &lt;/document_content&gt;
  &lt;/document&gt;
&lt;/documents&gt;

[Your query/instructions go here at the bottom]</code></pre>
      <p><strong>Ground responses in quotes:</strong> Ask Claude to extract relevant quotes first (in <code>&lt;quotes&gt;</code> tags) before performing the task. This forces Claude to locate and verify the source material before reasoning, reducing hallucination and improving accuracy on long documents.</p>

      <h4>Context Management Strategies</h4>
      <table>
        <thead><tr><th>Strategy</th><th>How</th><th>Risk</th></tr></thead>
        <tbody>
          <tr><td>Progressive summarization</td><td>Condense older turns, keep recent ones detailed</td><td>May lose critical details from earlier turns</td></tr>
          <tr><td>Case facts extraction</td><td>Extract key facts into a structured section at context start</td><td>Extraction might miss important nuances</td></tr>
          <tr><td>Tool output trimming</td><td>Strip verbose tool outputs to essential fields</td><td>Might remove context Claude needs later</td></tr>
          <tr><td>Strategic placement</td><td>Put critical info at start/end, not middle</td><td>May not always be practical</td></tr>
          <tr><td>Token budgeting</td><td>Reserve tokens for output, instructions, key context</td><td>Requires upfront planning</td></tr>
          <tr><td>Document-first ordering</td><td>Longform data at top, queries at bottom</td><td>Requires restructuring existing prompts</td></tr>
          <tr><td>Quote grounding</td><td>Ask Claude to extract relevant quotes before answering</td><td>Uses additional output tokens</td></tr>
        </tbody>
      </table>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Context window sizes: 1M tokens (Opus 4.7, Opus 4.6, Sonnet 4.6) vs 200K tokens (older models)</li>
          <li>Lost-in-the-middle: information at start and end is recalled better than the middle</li>
          <li>Document placement: put longform data at TOP, queries at BOTTOM — improves quality by up to 30%</li>
          <li>Structure documents with XML tags: <code>&lt;documents&gt;</code> &gt; <code>&lt;document index="n"&gt;</code> &gt; <code>&lt;source&gt;</code> + <code>&lt;document_content&gt;</code></li>
          <li>Ground responses in quotes: ask Claude to extract relevant quotes in <code>&lt;quotes&gt;</code> tags before answering</li>
          <li>Progressive summarization risks losing critical details — use case facts extraction for important data</li>
          <li>Trim verbose tool outputs to only the fields Claude needs for the next step</li>
          <li>Plan token budgets: reserve for output + instructions + most relevant context</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/context-windows",
    docLabel: "Context Windows Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/model/context-windows",
    relatedTopics: ["d3-context-window", "d5-large-codebase", "d5-provenance"],
  },
  {
    id: "d5-escalation",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Escalation Patterns",
    icon: "",
    content: `
      <h3>Escalation & Ambiguity Resolution</h3>
      <p>Well-designed agents know when to stop and ask for help. Defining clear escalation criteria prevents agents from making costly mistakes on edge cases. The key principle: when confidence is low or the situation falls outside defined guidelines, <strong>escalate to a human</strong> rather than guess.</p>
      <p>A common anti-pattern is using <strong>sentiment-based escalation</strong> as the primary trigger. While detecting frustrated customers can be useful, it leads to false positives (sarcastic but satisfied customers) and misses cases where the customer is calm but the issue genuinely requires human expertise (complex policy questions, multi-account issues). Better triggers include: policy gaps, conflicting information, multi-step decisions with high stakes, and explicit customer requests for a human.</p>
      <p>When escalating, the agent should provide a <strong>context summary</strong> to the human handler so they don't start from scratch. This summary should include: what was attempted, what information was gathered, why escalation was triggered, and any partial results. Good handoff protocols significantly reduce resolution time.</p>

      <h4>Escalation Triggers (Best to Worst)</h4>
      <table>
        <thead><tr><th>Trigger</th><th>Quality</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Explicit customer request for human</td><td>Best</td><td>Honors user autonomy — always respect this</td></tr>
          <tr><td>Policy gap detected</td><td>Good</td><td>Request falls outside defined guidelines</td></tr>
          <tr><td>Conflicting information</td><td>Good</td><td>Agent can't resolve contradiction safely</td></tr>
          <tr><td>Low confidence on high-stakes decision</td><td>Good</td><td>Risk of costly error exceeds benefit of automation</td></tr>
          <tr><td>Negative sentiment detection</td><td>Poor (alone)</td><td>Prone to false positives/negatives; better as secondary signal</td></tr>
        </tbody>
      </table>

<pre><code>// Escalation decision logic
function shouldEscalate(context) {
  // Always honor explicit requests
  if (context.customerRequestedHuman) return { escalate: true, reason: "customer_request" };

  // Policy gap — request outside guidelines
  if (!policyCovers(context.requestType)) return { escalate: true, reason: "policy_gap" };

  // Conflicting data — agent can't resolve
  if (context.conflictingInfo.length > 0) return { escalate: true, reason: "conflicting_info" };

  // High-stakes + low confidence
  if (context.stakes === "high" && context.confidence < 0.7) {
    return { escalate: true, reason: "low_confidence_high_stakes" };
  }

  return { escalate: false };
}

// Handoff with context summary
function escalateToHuman(context, reason) {
  return {
    summary: buildContextSummary(context),  // What was attempted & gathered
    reason: reason,
    partialResults: context.results,  // Any work completed so far
    suggestedAction: context.bestGuess,  // Agent's recommendation
  };
}</code></pre>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Always honor explicit requests for a human — this is non-negotiable</li>
          <li>Escalate on: policy gaps, conflicting info, low confidence + high stakes</li>
          <li>Sentiment-based escalation alone is unreliable — use as secondary signal only</li>
          <li>Include context summary in handoff: what was tried, what was found, why escalating</li>
          <li>Surface uncertainty rather than hiding it — transparency builds trust</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#agentic-systems",
    docLabel: "Agentic Prompting Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/build-with-claude/agentic-prompting",
    relatedTopics: ["d5-error-propagation", "d5-human-review", "d1-programmatic-enforcement"],
  },
  {
    id: "d5-error-propagation",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Error Propagation",
    icon: "",
    content: `
      <h3>Error Propagation in Multi-Agent Systems</h3>
      <p>In multi-agent architectures, errors in one subagent can cascade through the system if not handled properly. The coordinator must be able to distinguish between types of failures and decide whether to retry, fallback, or escalate. This requires subagents to propagate <strong>structured error context</strong> rather than generic error messages.</p>
      <p>The most dangerous anti-pattern is an access failure that returns empty results. If a subagent queries a database and gets a permissions error, returning an empty array tells the coordinator "no data exists" — which is <strong>factually wrong</strong>. The correct behavior is to return a structured error that clearly distinguishes "no data found" from "couldn't access the data." This distinction is critical for data integrity.</p>
      <p>Partial results with error flags are often more valuable than all-or-nothing failure. If a subagent was tasked with analyzing 10 files and 2 failed due to encoding issues, returning results for the 8 successful files plus error details for the 2 failures gives the coordinator much more to work with than a blanket "analysis failed" error.</p>

      <h4>Error Types and Coordinator Actions</h4>
      <table>
        <thead><tr><th>Error Type</th><th>Retryable?</th><th>Coordinator Action</th></tr></thead>
        <tbody>
          <tr><td>Access denied</td><td>No (usually)</td><td>Escalate or use alternative data source</td></tr>
          <tr><td>Not found (genuine)</td><td>No</td><td>Accept as valid "no data" result</td></tr>
          <tr><td>Timeout</td><td>Yes</td><td>Retry with longer timeout or smaller scope</td></tr>
          <tr><td>Rate limit</td><td>Yes (after delay)</td><td>Retry after backoff period</td></tr>
          <tr><td>Malformed input</td><td>Yes (with fixes)</td><td>Fix input and retry</td></tr>
          <tr><td>Partial failure</td><td>Partial</td><td>Accept successful results, retry failed items</td></tr>
        </tbody>
      </table>

<pre><code>// Subagent returning structured error context
function analyzeFiles(files) {
  const results = [];
  const errors = [];

  for (const file of files) {
    try {
      results.push({ file: file.path, analysis: analyze(file) });
    } catch (err) {
      errors.push({
        file: file.path,
        failureType: classifyError(err),  // "access_denied" | "encoding" | "timeout"
        message: err.message,
        isRetryable: err.code !== "EACCES",
      });
    }
  }

  return {
    results,          // Partial results — whatever succeeded
    errors,           // Structured error details for failures
    coverage: \`\${results.length}/\${files.length} files analyzed\`,
    hasGaps: errors.length > 0,
  };
}</code></pre>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Access failures returning empty results is the most dangerous anti-pattern</li>
          <li>Propagate structured error context: what failed, why, impact, is it retryable?</li>
          <li>Partial results with error flags are better than all-or-nothing failure</li>
          <li>Coordinator decides retry vs fallback vs escalation based on error type</li>
          <li>Coverage gap detection: verify subagent results cover the full requested scope</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls",
    docLabel: "Handle Tool Calls Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls",
    relatedTopics: ["d2-error-responses", "d1-multi-agent", "d5-escalation"],
  },
  {
    id: "d5-large-codebase",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Large Codebase Exploration",
    icon: "",
    content: `
      <h3>Exploring Large Codebases Effectively</h3>
      <p>Large codebases present a unique challenge: the full codebase cannot fit in context, and context degradation occurs as more files are read and analyzed. The key strategies are <strong>incremental exploration</strong> (read only what you need), <strong>scratchpad files</strong> (persist findings outside context), and <strong>subagent delegation</strong> (split exploration across multiple agents with isolated contexts).</p>
      <p>Context degradation is the gradual loss of accuracy that occurs as the context window fills. Reading 50 files into context means earlier files become harder to recall accurately (lost-in-the-middle effect). The solution is to take structured notes in a scratchpad file as you explore, so findings persist even after compaction or context overflow.</p>
      <p>For very large tasks (e.g., "audit the entire codebase for security issues"), delegate to subagents. Each subagent explores a subset of the codebase (e.g., one module each) and returns structured findings. The coordinator aggregates results without ever needing the full codebase in its own context.</p>

      <div class="diagram">
        <div class="diagram-title">Large Codebase Exploration Strategy</div>
        <div class="diagram-flow">
          <span class="diagram-node node-start">Glob: Find files</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-process">Grep: Find patterns</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-decision">Read: Targeted lines</span>
          <span class="diagram-arrow">→</span>
          <span class="diagram-node node-end">Scratchpad: Notes</span>
        </div>
        <div class="diagram-caption">Read minimally, note findings immediately. Use subagents for large-scope tasks.</div>
      </div>

      <h4>Strategies for Scale</h4>
      <table>
        <thead><tr><th>Strategy</th><th>When to Use</th><th>How</th></tr></thead>
        <tbody>
          <tr><td>Incremental exploration</td><td>Always (default approach)</td><td>Glob → Grep → Read specific lines (never whole files)</td></tr>
          <tr><td>Scratchpad file</td><td>Long sessions, complex analysis</td><td>Write findings to a temp file; survives compaction</td></tr>
          <tr><td>Subagent delegation</td><td>Codebase-wide tasks</td><td>Each subagent handles one module, coordinator aggregates</td></tr>
          <tr><td>Early compaction</td><td>Context filling up with exploration</td><td>Use /compact with focus topic to free space</td></tr>
        </tbody>
      </table>

<pre><code># Scratchpad pattern for large codebase exploration
# Write findings to a temporary file as you go:

## /tmp/security-audit-notes.md

### Auth Module (src/auth/)
- JWT tokens never expire — CRITICAL
- Password hashing uses bcrypt with cost=10 (acceptable)
- No rate limiting on login endpoint — HIGH

### API Routes (src/api/)
- SQL injection risk in src/api/search.ts:45 — CRITICAL
- CORS allows * in production config — MEDIUM
- Input validation missing on 3/12 endpoints — HIGH

### File Upload (src/upload/)
- No file type validation — HIGH
- Max size check exists but is 500MB — MEDIUM</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Never read whole files — use Glob → Grep → Read (specific lines) pattern</li>
          <li>Context degradation worsens as more files are read; take notes in a scratchpad file</li>
          <li>Scratchpad files persist across compaction — context summaries do not preserve details</li>
          <li>Delegate codebase-wide tasks to subagents (one per module), aggregate results</li>
          <li>Use <code>/compact</code> early with a focus topic to free context for more exploration</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/context-window",
    docLabel: "Context Window Docs",
    skilljarRefs: [
      { course: "Introduction to subagents", lesson: "What are subagents?", url: "https://anthropic.skilljar.com/introduction-to-subagents/450698" },
      { course: "Claude Code in Action", lesson: "Controlling context", url: "https://anthropic.skilljar.com/claude-code-in-action/303237" }
    ],
    relatedTopics: ["d2-builtin-tools", "d5-context-windows", "d3-context-window"],
  },
  {
    id: "d5-human-review",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Human Review Workflows",
    icon: "",
    content: `
      <h3>Human Review & Confidence Calibration</h3>
      <p>Production AI systems need human review workflows that prioritize limited reviewer time. Not every output can be reviewed, so the system must intelligently select which outputs need human attention. The key techniques are <strong>field-level confidence scores</strong>, <strong>stratified sampling</strong>, and <strong>accuracy tracking by document type</strong>.</p>
      <p>Field-level confidence is more useful than document-level confidence. A document might have high overall confidence but one critical field (e.g., total amount) with low confidence. Surfacing per-field confidence lets reviewers focus on uncertain extractions rather than re-checking everything.</p>
      <p>A critical insight: <strong>aggregate accuracy can mask category-specific failures</strong>. A system reporting 97% aggregate accuracy across all document types might have 99.5% accuracy on standard invoices but 40% accuracy on handwritten receipts. Without stratified accuracy tracking, you won't discover this until the rare category causes a costly error.</p>

      <h4>Review Prioritization Strategies</h4>
      <table>
        <thead><tr><th>Strategy</th><th>What</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Field-level confidence</td><td>Confidence score per extracted field</td><td>Focus reviewer attention on uncertain fields</td></tr>
          <tr><td>Stratified sampling</td><td>Sample across document types, not randomly</td><td>Ensures rare categories get adequate review</td></tr>
          <tr><td>Accuracy by document type</td><td>Track accuracy per category separately</td><td>Reveals hidden failure modes in rare categories</td></tr>
          <tr><td>Low-confidence queue</td><td>Route low-confidence outputs to human review</td><td>Catch likely errors before they propagate</td></tr>
          <tr><td>Novel pattern detection</td><td>Flag inputs that differ from training distribution</td><td>New document formats may need human handling</td></tr>
        </tbody>
      </table>

<pre><code>// Extraction output with field-level confidence
{
  "vendor_name": { "value": "Acme Corp", "confidence": 0.98 },
  "invoice_date": { "value": "2024-03-15", "confidence": 0.95 },
  "total_amount": { "value": 1247.50, "confidence": 0.62 },  // LOW — route to reviewer
  "line_items": [
    { "description": "Consulting", "amount": 1200.00, "confidence": 0.94 },
    { "description": "??penses", "amount": 47.50, "confidence": 0.31 }  // LOW — OCR issue
  ]
}

// Accuracy tracking by document type
{
  "standard_invoice": { "count": 4521, "accuracy": 0.995 },
  "handwritten_receipt": { "count": 83, "accuracy": 0.41 },  // Hidden failure!
  "scanned_pdf": { "count": 612, "accuracy": 0.87 },
  "aggregate": { "count": 5216, "accuracy": 0.97 }  // Looks fine, but it's not
}</code></pre>

      <div class="callout callout-critical">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Field-level confidence lets reviewers focus on uncertain extractions, not everything</li>
          <li>Stratified sampling ensures rare document types get adequate review coverage</li>
          <li>97% aggregate accuracy can mask 40% failure rate on a rare but important category</li>
          <li>Track accuracy by document type separately — aggregate metrics are misleading</li>
          <li>Compare self-reported confidence against actual accuracy to calibrate reliability</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    docLabel: "Prompting Best Practices",
    anthropicDocsRef: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
    relatedTopics: ["d5-escalation", "d4-structured-output", "d4-multi-instance-review"],
  },
  {
    id: "d5-provenance",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Information Provenance",
    icon: "",
    content: `
      <h3>Information Provenance & Source Attribution</h3>
      <p>When Claude works with multiple sources or long documents, tracking where information comes from is critical for trust and verifiability. <strong>Provenance</strong> means every claim in the output should be traceable to a specific source document, section, or data point. Without provenance, users cannot verify claims or resolve conflicts.</p>
      <p>Conflicting data across sources is a common challenge. If two reports state different revenue figures for the same quarter, the output should <strong>flag the conflict explicitly</strong> rather than silently choosing one value. Annotation of conflicts — including the source, date, and context of each data point — lets the user make an informed decision about which to trust.</p>
      <p>Temporal context adds another dimension: newer data may supersede older data, but recency does not always equal correctness. A preliminary report from last week might be less accurate than a finalized report from last month. Source authority, publication status (draft vs. final), and methodology should all factor into reliability assessment.</p>

      <h4>Provenance Implementation Patterns</h4>
      <table>
        <thead><tr><th>Pattern</th><th>What</th><th>When</th></tr></thead>
        <tbody>
          <tr><td>Claim-source mapping</td><td>Link every output claim to a source</td><td>Always (baseline requirement)</td></tr>
          <tr><td>Conflict annotation</td><td>Flag and detail conflicting data points</td><td>Multiple sources with potential contradictions</td></tr>
          <tr><td>Temporal tagging</td><td>Include date/version for each data point</td><td>Data that changes over time</td></tr>
          <tr><td>Reliability scoring</td><td>Rate source authority and data quality</td><td>Mixed-quality sources</td></tr>
          <tr><td>Consensus detection</td><td>Note when sources agree vs disagree</td><td>Multi-source synthesis tasks</td></tr>
        </tbody>
      </table>

<pre><code>// Output with provenance annotations
{
  "summary": "Q3 revenue was approximately $4.2M",
  "claims": [
    {
      "claim": "Q3 revenue was $4.2M",
      "sources": [
        {
          "document": "Q3 Earnings Report (Final)",
          "page": 3,
          "date": "2024-10-15",
          "status": "finalized",
          "value": "$4,217,000"
        },
        {
          "document": "Board Presentation Draft",
          "slide": 12,
          "date": "2024-10-02",
          "status": "draft",
          "value": "$4,180,000"
        }
      ],
      "conflict": true,
      "resolution": "Used finalized report figure. Draft presentation shows preliminary estimate that differs by $37K.",
      "confidence": "high"  // Despite conflict, finalized source is authoritative
    }
  ]
}</code></pre>

      <div class="callout callout-tip">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>Every claim should be traceable to a specific source document or section</li>
          <li>Conflicting data must be flagged, not silently resolved — annotate both sides</li>
          <li>Recency does not always mean correctness — consider source authority and finalization status</li>
          <li>Distinguish well-established facts from contested or evolving claims</li>
          <li>Temporal tagging helps users understand which data is current vs. potentially outdated</li>
        </ul>
      </div>
    `,
    docUrl: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#long-context-prompting",
    docLabel: "Long Context Prompting Docs",
    anthropicDocsRef: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-prompting",
    relatedTopics: ["d5-context-windows", "d5-human-review", "d5-escalation"],
  },
  {
    id: "d5-hooks-settings",
    domainId: 5,
    domain: "Context Management & Reliability",
    title: "Hooks in Settings",
    icon: "",
    content: `
      <h3>Configuring Hooks in settings.json</h3>
      <p>Hooks are configured in Claude Code's <code>settings.json</code> file, providing a declarative way to intercept agent actions. Each hook specifies a <strong>matcher</strong> (which tool calls to intercept), a <strong>handler type</strong> (how to evaluate the decision), and the <strong>hook point</strong> (PreToolUse or PostToolUse). This configuration lives outside the agent's context, making it tamper-resistant.</p>
      <p>There are four handler types: <code>command</code> (shell command), <code>http</code> (webhook), <code>prompt</code> (LLM-evaluated), and <code>agent</code> (subagent for complex verification). Command handlers are the most common — they run a script that inspects the tool call and returns an exit code. The handler's stdout output is captured but capped at 10,000 characters. Hooks execute <strong>in parallel</strong> (not sequentially) and are deduplicated by command string (for command handlers) or URL (for HTTP handlers).</p>
      <p>Matcher patterns determine which tool calls trigger the hook. The matching rules are: <code>"*"</code>, <code>""</code>, or omitted matches all tools. If the pattern contains only <code>[a-zA-Z0-9_|]</code> characters, it is treated as an exact string or pipe-separated list. Any other characters cause it to be interpreted as a JavaScript RegExp. This allows precise targeting — for example, blocking only Bash commands that contain <code>rm -rf</code> while allowing all other Bash usage.</p>

      <h4>Handler Types</h4>
      <table>
        <thead><tr><th>Type</th><th>How It Works</th><th>Default Timeout</th><th>Best For</th></tr></thead>
        <tbody>
          <tr><td><code>command</code></td><td>Runs a shell command; exit code determines decision</td><td>600s</td><td>Local validation, file system checks, git checks</td></tr>
          <tr><td><code>http</code></td><td>Sends POST to webhook; JSON response with decision</td><td>30s</td><td>Remote policy servers, audit logging</td></tr>
          <tr><td><code>prompt</code></td><td>LLM evaluates whether the action should proceed</td><td>30s</td><td>Nuanced decisions requiring reasoning</td></tr>
          <tr><td><code>agent</code></td><td>Subagent performs complex verification</td><td>60s</td><td>Multi-step checks, complex policy evaluation</td></tr>
        </tbody>
      </table>

<pre><code>// settings.json hook configuration
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": {
          "tool_name": "Bash",
          "input_contains": ["rm -rf", "DROP TABLE", "DELETE FROM"]
        },
        "handler": {
          "type": "command",
          "command": "node /path/to/safety-check.js"
        }
      },
      {
        "matcher": {
          "tool_name": "Write",
          "input_glob": { "file_path": "*.env*" }
        },
        "handler": {
          "type": "command",
          "command": "echo 'Blocked: cannot write to .env files' >&2 && exit 2"
        }
      }
    ],
    "PostToolUse": [
      {
        "matcher": { "tool_name": "*" },
        "handler": {
          "type": "http",
          "url": "https://audit.internal.com/log-tool-use"
        }
      }
    ]
  }
}</code></pre>

      <h4>Exit Codes for Command Handlers</h4>
      <table>
        <thead><tr><th>Exit Code</th><th>Decision</th><th>JSON Processing</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td><strong>0</strong></td><td>Success / Allow</td><td>YES (parses stdout)</td><td>Action proceeds normally</td></tr>
          <tr><td><strong>2</strong></td><td>BLOCK</td><td>NO (ignores stdout)</td><td>Action blocked; stderr shown to Claude</td></tr>
          <tr><td><strong>Any other (1, 3+)</strong></td><td>Non-blocking error</td><td>NO</td><td>Execution continues; stderr logged to transcript</td></tr>
        </tbody>
      </table>
      <div class="callout callout-critical">
        <div class="callout-title">Critical: Exit Code 1 Does NOT Block</div>
        <p>Only exit code <strong>2</strong> blocks an action. Exit code 1 (and any code other than 0 or 2) is treated as a non-blocking error — execution continues normally. This is a common source of bugs in hook scripts that use <code>exit 1</code> expecting it to deny the tool call.</p>
      </div>

      <h4>asyncRewake Behavior</h4>
      <p>When a command handler has <code>asyncRewake: true</code>, it implies <code>async: true</code> (background execution). The hook runs in the background while Claude continues working. When the hook finishes with <strong>exit code 2</strong>, it <strong>wakes Claude</strong> — stderr (or stdout if stderr is empty) is shown to Claude as a system reminder. This is useful for long-running validations or external approval workflows.</p>

      <h4>Output Caps</h4>
      <p>The following output fields are capped at <strong>10,000 characters</strong>: <code>additionalContext</code>, <code>systemMessage</code>, and <code>updatedMCPToolOutput</code>. When the cap is exceeded, the content is saved to a file and replaced with a preview plus the file path. This prevents hook outputs from consuming excessive context.</p>

      <h4>Hook Sources Priority</h4>
      <p>When multiple hook sources define hooks for the same event, they are resolved in this priority order (highest to lowest):</p>
      <ol>
        <li><strong>Managed policy</strong> (organization-level)</li>
        <li><strong>User settings</strong></li>
        <li><strong>Project settings</strong></li>
        <li><strong>Local settings</strong></li>
        <li><strong>Plugin hooks</strong></li>
        <li><strong>Skill/Agent frontmatter</strong></li>
        <li><strong>Built-in</strong> hooks</li>
      </ol>

      <div class="callout callout-warning">
        <div class="callout-title">Key Takeaways</div>
        <ul>
          <li>4 handler types: command, http, prompt, agent (not asyncRewake — that is a property of command handlers)</li>
          <li>Exit codes: 0 = allow (parses stdout JSON), 2 = BLOCK (stderr shown to Claude), any other = non-blocking error</li>
          <li><strong>Exit 1 does NOT block</strong> — only exit 2 blocks. This is the most common hook bug.</li>
          <li>asyncRewake: true implies async execution; exit code 2 wakes Claude with stderr as system reminder</li>
          <li>Output caps: additionalContext, systemMessage, updatedMCPToolOutput capped at 10,000 chars</li>
          <li>Matcher patterns: "*" or "" or omitted = match all; only [a-zA-Z0-9_|] = exact/pipe-separated; other chars = RegExp</li>
          <li>Hooks execute in parallel (not sequentially), deduplicated by command string/URL</li>
          <li>Priority: Managed policy > User settings > Project settings > Local settings > Plugin > Skill/Agent > Built-in</li>
          <li>Hooks live in settings.json — outside the agent's context, making them tamper-resistant</li>
        </ul>
      </div>
    `,
    docUrl: "https://code.claude.com/docs/en/hooks",
    docLabel: "Hooks Docs",
    skilljarRefs: [
      { course: "Claude Code in Action", lesson: "Introducing hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312000" },
      { course: "Claude Code in Action", lesson: "Defining hooks", url: "https://anthropic.skilljar.com/claude-code-in-action/312002" }
    ],
    relatedTopics: ["d1-hooks", "d1-programmatic-enforcement", "d3-claude-md"],
  },
];
