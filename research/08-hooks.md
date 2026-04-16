# Research: Claude Code Hooks
**Source:** https://docs.anthropic.com/en/docs/claude-code/hooks

## Hook Event Types (26 total)
1. SessionStart — matcher: startup/resume/clear/compact
2. UserPromptSubmit — no matcher
3. PreToolUse — matcher: tool name
4. PermissionRequest — matcher: tool name
5. PermissionDenied — matcher: tool name
6. PostToolUse — matcher: tool name
7. PostToolUseFailure — matcher: tool name
8. Notification — matcher: permission_prompt/idle_prompt/auth_success/elicitation_dialog
9. SubagentStart — matcher: agent type
10. SubagentStop — matcher: agent type
11. TaskCreated — no matcher
12. TaskCompleted — no matcher
13. Stop — no matcher
14. StopFailure — matcher: rate_limit/authentication_failed/billing_error/...
15. TeammateIdle — no matcher
16. InstructionsLoaded — matcher: session_start/nested_traversal/path_glob_match/include/compact
17. ConfigChange — matcher: user_settings/project_settings/local_settings/...
18. CwdChanged — no matcher
19. FileChanged — matcher: literal filenames (not regex)
20. WorktreeCreate — no matcher
21. WorktreeRemove — no matcher
22. PreCompact — matcher: manual/auto
23. PostCompact — matcher: manual/auto
24. Elicitation — matcher: MCP server name
25. ElicitationResult — matcher: MCP server name
26. SessionEnd — matcher: clear/resume/logout/...

## 4 Handler Types
- **command** — shell command; exit code determines decision; default timeout 600s
- **http** — webhook POST; JSON response; default timeout 30s
- **prompt** — LLM evaluates; default timeout 30s
- **agent** — subagent for complex verification; default timeout 60s

## Common Input Fields (stdin JSON)
- `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`
- `agent_id` (optional, only in subagent), `agent_type` (optional)
- Plus event-specific: `tool_name`, `tool_input`, `tool_use_id` for tool events

## permissionDecision Values (PreToolUse)
- `"allow"` — skip permission, let tool run
- `"deny"` — prevent tool call
- `"ask"` — show permission dialog
- `"defer"` — pause for calling process (SDK/headless, requires -p flag)

**Precedence**: `deny` > `defer` > `ask` > `allow`

## Exit Codes for Shell Hooks
| Code | Meaning | JSON Processing | Effect |
|---|---|---|---|
| `0` | Success | YES (parses stdout) | Allow action, proceed normally |
| `2` | Blocking error | NO (ignores stdout) | **Block action**; stderr shown to Claude |
| Any other (1, 3+) | Non-blocking error | NO | Execution continues; stderr in transcript |

**CRITICAL**: Exit code 1 does NOT block. Only exit code 2 blocks.

## updatedInput Requirements
- Must be a **complete object** — replaces entire input
- For PreToolUse: combine with "allow" or "ask"; ignored for "deny"/"defer"

## Matcher Regex Behavior
- `"*"` or `""` or omitted → match all
- Only `[a-zA-Z0-9_|]` chars → exact string or pipe-separated list
- Any other character → JavaScript RegExp

## Hook Execution Order
- All matching hooks run **in parallel**
- Deduplicated: command hooks by command string, HTTP hooks by URL
- Conflicting decisions resolved by precedence: deny > defer > ask > allow

## asyncRewake Behavior
- `asyncRewake: true` implies `async: true` (runs in background)
- When hook finishes with **exit code 2**: **wakes Claude**
- stderr (or stdout if stderr empty) shown to Claude as system reminder

## additionalContext Cap
- **10,000 characters maximum**
- When exceeded: saved to file, replaced with preview + file path
- Same cap applies to `systemMessage` and `updatedMCPToolOutput`

## Hook Sources Priority
Managed policy > User settings > Project settings > Local settings > Plugin hooks > Skill/Agent frontmatter > Built-in
