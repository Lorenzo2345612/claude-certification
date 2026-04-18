# Claude Managed Agents -- Official Documentation Research

Extracted from official Anthropic platform docs on 2026-04-17.

---

## 1. Overview

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- Overview

### What It Is

- Pre-built, configurable agent harness that runs in managed infrastructure
- Best for long-running tasks and asynchronous work
- Provides the harness and infrastructure for running Claude as an autonomous agent
- Instead of building your own agent loop, tool execution, and runtime, you get a fully managed environment
- Built-in prompt caching, compaction, and other performance optimizations

### Two Ways to Build with Claude

| Approach | What it is | Best for |
|---|---|---|
| **Messages API** | Direct model prompting access | Custom agent loops and fine-grained control |
| **Claude Managed Agents** | Pre-built, configurable agent harness | Long-running tasks and asynchronous work |

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- Overview table

### Core Concepts (4 pillars)

| Concept | Description |
|---------|-------------|
| **Agent** | The model, system prompt, tools, MCP servers, and skills |
| **Environment** | A configured container template (packages, network access) |
| **Session** | A running agent instance within an environment, performing a specific task and generating outputs |
| **Events** | Messages exchanged between your application and the agent (user turns, tool results, status updates) |

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- Core concepts

### How It Works (5 steps)

1. **Create an agent** -- Define model, system prompt, tools, MCP servers, skills. Create once, reference by ID.
2. **Create an environment** -- Configure cloud container with packages, network access rules, mounted files.
3. **Start a session** -- Launch session referencing agent and environment.
4. **Send events and stream responses** -- User messages as events; Claude streams back via SSE. Event history persisted server-side.
5. **Steer or interrupt** -- Send additional user events mid-execution, or interrupt to change direction.

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- How it works

### When to Use

- Long-running execution (minutes or hours with multiple tool calls)
- Cloud infrastructure (secure containers with pre-installed packages and network access)
- Minimal infrastructure (no need to build own agent loop, sandbox, or tool execution layer)
- Stateful sessions (persistent file systems and conversation history)

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- When to use

### Beta Access

- Beta header required: `managed-agents-2026-04-01`
- SDK sets the beta header automatically
- Enabled by default for all API accounts
- Research preview features (outcomes, multiagent, memory) require separate access request

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- Beta access

### Rate Limits

| Operation | Limit |
|---|---|
| Create endpoints (agents, sessions, environments, etc.) | 60 requests per minute |
| Read endpoints (retrieve, list, stream, etc.) | 600 requests per minute |

Organization-level spend limits and tier-based rate limits also apply.

> **Source:** https://platform.claude.com/docs/en/managed-agents/overview.md -- Rate limits

---

## 2. Quickstart

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- Quickstart

### Prerequisites

- Anthropic Console account
- API key
- All requests require beta header `managed-agents-2026-04-01`

### CLI Installation

- Homebrew (macOS): `brew install anthropics/tap/ant`
- Linux/WSL: download release binary from GitHub
- Go: `go install github.com/anthropics/anthropic-cli/cmd/ant@latest`

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- Install the CLI

### SDK Support

SDKs available for: Python, TypeScript, Java, Go, C#, Ruby, PHP

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- Install the SDK

### Creating a Session (4 steps)

1. **Create an agent** -- Model is `claude-opus-4-7`; tool type is `agent_toolset_20260401` for the full pre-built toolset (bash, file ops, web search, etc.)
2. **Create an environment** -- Config type `cloud`, networking type `unrestricted`
3. **Start a session** -- Reference agent ID and environment ID
4. **Send a message and stream the response** -- Open SSE stream, send `user.message` event, process events as they arrive

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- Create your first session

### What Happens Under the Hood

1. Provisions a container from environment configuration
2. Runs the agent loop (Claude decides tools)
3. Executes tools inside the container
4. Streams events back in real-time
5. Emits `session.status_idle` when finished

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- What's happening

### Key Event Types

- `agent.message` -- text content from Claude
- `agent.tool_use` -- tool call (includes tool `name`)
- `session.status_idle` -- agent finished work

> **Source:** https://platform.claude.com/docs/en/managed-agents/quickstart.md -- Send a message and stream the response

---

## 3. Agent Setup (Define Your Agent)

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Define your agent

### Configuration Fields

| Field | Description |
|---|---|
| `name` | Required. Human-readable name. |
| `model` | Required. Claude model (all 4.5+ models supported). |
| `system` | System prompt for behavior and persona. |
| `tools` | Pre-built agent tools, MCP tools, and custom tools. |
| `mcp_servers` | MCP servers for standardized third-party capabilities. |
| `skills` | Skills for domain-specific context with progressive disclosure. |
| `callable_agents` | Other agents this agent can invoke (multi-agent orchestration). Research preview. |
| `description` | Description of what the agent does. |
| `metadata` | Arbitrary key-value pairs for tracking. |

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Agent configuration fields

### Fast Mode

- For Claude Opus 4.6 with fast mode, pass model as object: `{"id": "claude-opus-4-6", "speed": "fast"}`

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Tip after create example

### Agent Response Fields

- `id`, `version`, `created_at`, `updated_at`, `archived_at`
- Version starts at 1, increments on each update

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Create an agent response

### Update Semantics

- **Omitted fields are preserved** (only include fields you want to change)
- **Scalar fields** (model, system, name) are replaced
- **Array fields** (tools, mcp_servers, skills, callable_agents) are fully replaced
- **Metadata** is merged at key level; set value to empty string to delete a key
- **No-op detection**: if no change, no new version created
- `system` and `description` can be cleared with `null`; `model` and `name` cannot be cleared

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Update semantics

### Agent Lifecycle

| Operation | Behavior |
|---|---|
| **Update** | Generates a new agent version |
| **List versions** | Fetch full version history |
| **Archive** | Agent becomes read-only; new sessions cannot reference it; existing sessions continue |

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Agent lifecycle

---

## 4. Sessions

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- Start a session

### Creating a Session

- Requires `agent` ID and `environment_id`
- Pass agent ID as string = uses latest version
- Pass agent as object `{"type": "agent", "id": "...", "version": 1}` to pin to specific version

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- Creating a session

### MCP Authentication via Vaults

- Pass `vault_ids` at session creation for MCP tools requiring authentication
- Anthropic manages token refresh on your behalf

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- MCP authentication through vaults

### Starting Work

- Creating a session provisions environment but does NOT start work
- Must send a `user.message` event to start a task
- Session acts as a state machine; events drive execution

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- Starting the session

### Session Statuses

| Status | Description |
|--------|-------------|
| `idle` | Waiting for input (sessions start here) |
| `running` | Agent is actively executing |
| `rescheduling` | Transient error, retrying automatically |
| `terminated` | Unrecoverable error |

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- Session statuses

### Session Operations

- **Retrieve**: GET session by ID
- **List**: paginated list of all sessions
- **Archive**: prevents new events, preserves history
- **Delete**: permanently removes record, events, and container. Running sessions cannot be deleted (must send interrupt first). Files, memory stores, environments, agents are NOT affected.

> **Source:** https://platform.claude.com/docs/en/managed-agents/sessions.md -- Other session operations

---

## 5. Tools

> **Source:** https://platform.claude.com/docs/en/managed-agents/tools.md -- Tools

### Built-in Agent Tools

All enabled by default with `agent_toolset_20260401`:

| Tool | Name | Description |
|---|---|---|
| Bash | `bash` | Execute bash commands in a shell session |
| Read | `read` | Read a file from the local filesystem |
| Write | `write` | Write a file to the local filesystem |
| Edit | `edit` | Perform string replacement in a file |
| Glob | `glob` | Fast file pattern matching using glob patterns |
| Grep | `grep` | Text search using regex patterns |
| Web fetch | `web_fetch` | Fetch content from a URL |
| Web search | `web_search` | Search the web for information |

> **Source:** https://platform.claude.com/docs/en/managed-agents/tools.md -- Available tools

### Configuring the Toolset

- Enable full toolset: `{"type": "agent_toolset_20260401"}`
- Disable specific tools: set `configs` array with `{"name": "web_fetch", "enabled": false}`
- Enable ONLY specific tools: set `default_config.enabled` to `false`, then enable individual tools

```json
{
  "type": "agent_toolset_20260401",
  "default_config": { "enabled": false },
  "configs": [
    { "name": "bash", "enabled": true },
    { "name": "read", "enabled": true }
  ]
}
```

> **Source:** https://platform.claude.com/docs/en/managed-agents/tools.md -- Configuring the toolset

### Permission Policy

- Default permission policy: `{"type": "always_allow"}`

> **Source:** https://platform.claude.com/docs/en/managed-agents/agent-setup.md -- Create an agent response JSON

### Custom Tools

- Type: `"custom"`
- Analogous to user-defined client tools in the Messages API
- Define `name`, `description`, `input_schema` (JSON Schema)
- Model emits structured request; YOUR code runs the operation; result flows back
- Best practices:
  - Extremely detailed descriptions (3-4+ sentences each)
  - Consolidate related operations into fewer tools with `action` parameter
  - Use meaningful namespacing in tool names (e.g., `db_query`, `storage_read`)
  - Return only high-signal information in responses

> **Source:** https://platform.claude.com/docs/en/managed-agents/tools.md -- Custom tools

---

## 6. Multi-Agent Sessions

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- Multiagent sessions

### Status

- **Research Preview** -- requires access request

### Architecture

- All agents share the same container and filesystem
- Each agent runs in its own session **thread** (context-isolated event stream with own conversation history)
- Coordinator reports activity in the **primary thread** (session-level event stream)
- Additional threads spawned at runtime when coordinator delegates
- Threads are persistent: coordinator can send follow-ups; agent retains previous turns
- Each agent uses its own configuration (model, system prompt, tools, MCP servers, skills)
- **Tools and context are NOT shared** between agents

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- How it works

### Use Cases for Multi-Agent

- Code review (reviewer agent with read-only tools)
- Test generation (test agent that writes and runs tests)
- Research (search agent with web tools)

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- What to delegate

### Declaring Callable Agents

- List agent IDs in `callable_agents` field
- **Only one level of delegation**: coordinator can call agents, but those agents CANNOT call agents of their own
- Callable agents resolved from orchestrator config; no need to reference at session creation

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- Declare callable agents

### Session Threads

- Session-level stream = **primary thread** (condensed view of all activity)
- Individual thread streams for per-agent reasoning and tool calls
- Session status is aggregation: if any thread is `running`, session is `running`
- List threads: `GET /v1/sessions/:id/threads`
- Stream per-thread: `GET /v1/sessions/:id/threads/:thread_id/stream`
- List thread events: `GET /v1/sessions/:id/threads/:thread_id/events`

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- Session threads

### Multi-Agent Event Types

| Type | Description |
|---|---|
| `session.thread_created` | Coordinator spawned a new thread (includes `session_thread_id` and `model`) |
| `session.thread_idle` | An agent thread finished its current work |
| `agent.thread_message_sent` | Agent sent message to another thread (includes `to_thread_id` and `content`) |
| `agent.thread_message_received` | Agent received message from another thread (includes `from_thread_id` and `content`) |

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- Multiagent event types

### Tool Permissions in Threads

- When a callable agent thread needs permission (always_ask tool) or custom tool result, request surfaces on **session stream** with `session_thread_id`
- Include same `session_thread_id` when posting response to route back to waiting thread
- If `session_thread_id` is absent, event came from primary thread
- Match on `tool_use_id` to pair requests with responses

> **Source:** https://platform.claude.com/docs/en/managed-agents/multi-agent.md -- Tool permissions and custom tools in threads

---

## API Endpoints Summary

| Resource | Endpoint |
|---|---|
| Agents | `POST /v1/agents`, `PUT /v1/agents/:id`, `POST /v1/agents/:id/archive` |
| Agent Versions | `GET /v1/agents/:id/versions` |
| Environments | `POST /v1/environments` |
| Sessions | `POST /v1/sessions`, `GET /v1/sessions/:id`, `GET /v1/sessions`, `POST /v1/sessions/:id/archive`, `DELETE /v1/sessions/:id` |
| Events | `POST /v1/sessions/:id/events` (send), `GET /v1/sessions/:id/stream` (SSE) |
| Threads | `GET /v1/sessions/:id/threads`, `GET /v1/sessions/:id/threads/:thread_id/stream`, `GET /v1/sessions/:id/threads/:thread_id/events` |

> **Source:** Compiled from quickstart.md, sessions.md, multi-agent.md

---

## Key Exam Facts -- Quick Reference

1. Beta header: `managed-agents-2026-04-01` (SDK sets automatically)
2. 4 core concepts: Agent, Environment, Session, Events
3. Agent toolset type: `agent_toolset_20260401`
4. Session starts `idle`; must send `user.message` to begin work
5. Session statuses: idle, running, rescheduling, terminated
6. Agent versions are immutable; update creates new version
7. Archiving an agent = read-only; existing sessions continue
8. Deleting a session = permanent; running sessions cannot be deleted
9. Multi-agent: one level of delegation only
10. Threads are context-isolated but share filesystem
11. `session_thread_id` routes tool confirmations to correct thread
12. Rate limits: 60/min create, 600/min read
13. Supported models: All Claude 4.5 and later
14. Vault IDs enable MCP authentication at session creation
15. Custom tools are client-executed; model never runs them itself
