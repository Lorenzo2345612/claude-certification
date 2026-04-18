# Domain 4: Prompt Engineering & Structured Output (20% of CCA Exam)

> Official Anthropic documentation research -- extracted from platform.claude.com docs, April 2026.

---

## 1. Prompting Best Practices

> **Source:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

### 1.1 Be Clear and Direct

- Claude responds well to **clear, explicit instructions**. Being specific about desired output enhances results.
- Think of Claude as a "brilliant but new employee who lacks context on your norms and workflows."
- **Golden rule**: Show your prompt to a colleague with minimal context. If they'd be confused, Claude will be too.
- Provide instructions as **sequential steps** using numbered lists or bullet points when order/completeness matters.
- If you want "above and beyond" behavior, **explicitly request it** rather than relying on inference.

**Example -- more effective prompting:**
```text
Create an analytics dashboard. Include as many relevant features and interactions
as possible. Go beyond the basics to create a fully-featured implementation.
```

### 1.2 Add Context to Improve Performance

- Providing **motivation behind instructions** (explaining *why*) helps Claude generalize better.
- Example: Instead of "NEVER use ellipses," say "Your response will be read aloud by a text-to-speech engine, so never use ellipses since the TTS engine will not know how to pronounce them."
- Claude is smart enough to generalize from the explanation.

### 1.3 Use Examples Effectively (Few-Shot / Multishot Prompting)

- Examples are **one of the most reliable ways** to steer output format, tone, and structure.
- **Include 3-5 examples for best results** (exact recommendation from docs).
- Make examples:
  - **Relevant**: Mirror your actual use case closely
  - **Diverse**: Cover edge cases; vary enough so Claude doesn't pick up unintended patterns
  - **Structured**: Wrap in `<example>` tags (multiple in `<examples>` tags) to distinguish from instructions
- You can ask Claude to evaluate your examples for relevance/diversity, or to generate additional ones.
- **Multishot examples work with thinking**: Use `<thinking>` tags inside few-shot examples to show Claude the reasoning pattern. It will generalize that style to its own extended thinking blocks.

### 1.4 Structure Prompts with XML Tags

- XML tags help Claude **parse complex prompts unambiguously**, especially when mixing instructions, context, examples, and variable inputs.
- Wrapping each content type in its own tag (e.g., `<instructions>`, `<context>`, `<input>`) reduces misinterpretation.
- Best practices:
  - Use **consistent, descriptive tag names** across prompts
  - **Nest tags** for natural hierarchy (e.g., `<documents>` > `<document index="n">`)

**Example multi-document structure:**
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
```

### 1.5 Give Claude a Role (Role Prompting)

- Set a role in the **system prompt** to focus behavior and tone.
- Even a single sentence makes a difference.

```python
message = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    system="You are a helpful coding assistant specializing in Python.",
    messages=[
        {"role": "user", "content": "How do I sort a list of dictionaries by key?"}
    ],
)
```

### 1.6 Long Context Prompting (20k+ tokens)

- **Put longform data at the top**: Place long documents/inputs near the top of the prompt, above query/instructions/examples. Queries at the end can improve response quality by **up to 30%** in tests, especially with complex multi-document inputs.
- **Structure with XML tags**: Wrap each document in `<document>` tags with `<document_content>` and `<source>` subtags.
- **Ground responses in quotes**: For long document tasks, ask Claude to quote relevant parts first before carrying out its task. This helps cut through noise.

```xml
Find quotes from the patient records and appointment history that are relevant
to diagnosing the patient's reported symptoms. Place these in <quotes> tags.
Then, based on these quotes, list all information that would help the doctor
diagnose the patient's symptoms. Place your diagnostic information in <info> tags.
```

### 1.7 Chain of Thought / Thinking

- **Prefer general instructions over prescriptive steps**: "Think thoroughly" often produces better reasoning than hand-written step-by-step plans.
- **Manual CoT as a fallback**: When thinking is off, encourage step-by-step reasoning. Use structured tags like `<thinking>` and `<answer>` to cleanly separate reasoning from final output.
- **Ask Claude to self-check**: "Before you finish, verify your answer against [test criteria]." This catches errors reliably for coding and math.
- When extended thinking is disabled, Claude Opus 4.5 is particularly sensitive to the word "think" and its variants. Use alternatives like "consider," "evaluate," or "reason through."

### 1.8 Migrating Away from Prefilled Responses

Starting with Claude 4.6 models and Claude Mythos Preview, **prefilled responses on the last assistant turn are no longer supported**. On Mythos Preview, prefilled assistant messages return a **400 error**.

Migration strategies:
| Old Prefill Use Case | New Approach |
|---|---|
| Output formatting (JSON, YAML) | Use **Structured Outputs** (`output_config.format`) or tools with enum fields |
| Eliminating preambles | System prompt: "Respond directly without preamble." Or use XML tags / structured outputs |
| Avoiding bad refusals | Clear prompting within the `user` message (Claude much better at appropriate refusals now) |
| Continuations | Move continuation to user message: "Your previous response was interrupted and ended with `[text]`. Continue from where you left off." |
| Context hydration | Inject reminders into user turn, or hydrate via tools |

### 1.9 Control Format of Responses

1. **Tell Claude what to do instead of what not to do**: "Your response should be composed of smoothly flowing prose paragraphs" instead of "Do not use markdown."
2. **Use XML format indicators**: "Write the prose sections in `<smoothly_flowing_prose_paragraphs>` tags."
3. **Match your prompt style to desired output**: Formatting style in your prompt influences Claude's response style. Removing markdown from your prompt reduces markdown in output.
4. **Use detailed prompts** for specific formatting preferences (example: `<avoid_excessive_markdown_and_bullet_points>` block).

### 1.10 Prompt Chaining

With adaptive thinking and subagent orchestration, Claude handles most multi-step reasoning internally. Explicit prompt chaining (breaking into sequential API calls) is still useful when you need to:
- **Inspect intermediate outputs**
- **Enforce a specific pipeline structure**

Most common pattern: **self-correction** -- generate draft -> review against criteria -> refine. Each step = separate API call for logging/evaluation/branching.

---

## 2. Few-Shot Prompting (Deep Dive)

### Targeted Examples for Ambiguous Scenarios
- Few-shot examples are the primary mechanism for disambiguating ambiguous scenarios.
- Make examples **diverse** enough to cover edge cases so Claude doesn't pick up unintended patterns.
- 3-5 examples is the sweet spot for best results.

### Format Demonstration
- Examples are one of the most reliable ways to steer **output format, tone, and structure**.
- Wrap in `<example>` / `<examples>` tags so Claude distinguishes them from instructions.

### Generalization to Novel Patterns
- Claude generalizes the reasoning *style* from examples to new situations.
- `<thinking>` tags in few-shot examples teach Claude how to reason within extended thinking blocks.

### Reducing Hallucination
- Grounding in quotes from source documents reduces hallucination.
- Explicit prompt: "Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering."
- Use `<investigate_before_answering>` XML wrapper for anti-hallucination instructions.

---

## 3. Structured Output via `output_config.format`

> **Source:** https://platform.claude.com/docs/en/build-with-claude/structured-outputs

### 3.1 Overview

Two complementary features:
1. **JSON outputs** (`output_config.format`): Constrains Claude's response to a specific JSON schema
2. **Strict tool use** (`strict: true`): Guarantees schema validation on tool names and inputs

Can be used independently or together.

### 3.2 JSON Outputs API Parameter

```json
{
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "fieldName": {"type": "string"}
        },
        "required": ["fieldName"],
        "additionalProperties": false
      }
    }
  }
}
```

**Response**: Valid JSON in `response.content[0].text`

### 3.3 Schema Requirements & Limitations

**Supported types**: `object`, `array`, `string`, `integer`, `number`, `boolean`, `null`

| Feature | Supported | Notes |
|---|---|---|
| `enum` | Yes | Scalars only |
| `const` | Yes | |
| `anyOf` | Yes | With limitations |
| `allOf` | Yes | `allOf` with `$ref` unsupported |
| `$ref`, `$def`, `definitions` | Yes | No external `$ref` |
| `default` | Yes | |
| `required` | Yes | |
| `additionalProperties: false` | **Required** | Must be `false` for all objects |
| String formats | Yes | `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid` |
| `pattern` (regex) | Partial | `*+?{n,m}`, `[].\d\w\s(...)` supported. No backreferences, lookahead/lookbehind, `\b` |
| `minItems` | Yes | Only `0` or `1` |
| Recursive schemas | **No** | |
| `minimum`/`maximum`/`multipleOf` | **No** | |
| `minLength`/`maxLength` | **No** | |
| `additionalProperties` != `false` | **No** | |

### 3.4 Complexity Limits

| Limit | Value |
|---|---|
| Strict tools per request | 20 |
| Optional parameters (total) | 24 |
| Union type parameters (`anyOf`/type arrays) | 16 |
| Compilation timeout | 180 seconds |

Exceeding combined grammar complexity returns **400 error**: "Schema is too complex for compilation."

### 3.5 Guarantees

- **Always valid JSON** -- no `JSON.parse()` errors
- **Type safe** -- guaranteed field types and required fields
- **No retries needed** -- schema violations impossible
- **Property ordering**: Required properties first, then optional (may reorder from schema definition)

**Exceptions:**
- **Refusals** (`stop_reason: "refusal"`): 200 status, output may NOT match schema. Safety takes precedence.
- **Token limit** (`stop_reason: "max_tokens"`): Output incomplete, may not match schema. Retry with higher `max_tokens`.

### 3.6 Grammar Compilation & Caching

- First request: additional latency for grammar compilation
- **Automatic caching**: 24 hours from last use
- Cache invalidation: Schema structure changes or tool set changes (changing only name/description preserves cache)

### 3.7 SDK Helpers

| SDK | Helper Method | Type System |
|---|---|---|
| **Python** | `client.messages.parse(output_format=PydanticModel)` | Pydantic models; returns `parsed_output` |
| **TypeScript** | `client.messages.parse()` with `zodOutputFormat(ZodSchema)` | Zod schemas; returns typed `parsed_output` |
| **TypeScript** | `jsonSchemaOutputFormat(schema)` | Raw JSON Schema with compile-time type inference (`as const`) |
| **Java** | `outputConfig(Class<T>)` | Class-based; returns `StructuredMessage<T>` |
| **Ruby** | `output_config: {format: CustomModel}` | Extend `Anthropic::BaseModel` |
| **PHP** | Classes implementing `StructuredOutputModel` | PHP 8 property types + `#[Constrained]` attribute |
| **C#, Go** | Raw JSON schemas via `OutputConfig` | No automatic type inference |

Python SDK `transform_schema()` available for manual schema transformation. Legacy `output_format` parameter still accepted (translates internally to `output_config.format`).

### 3.8 Incompatibilities

- **Citations**: Incompatible with `output_config.format` (returns 400 error)
- **Message prefilling**: Incompatible with JSON outputs

### 3.9 Data Retention & Security

- ZDR eligible (limited technical retention)
- HIPAA eligible, but **PHI must NOT be in schema definitions** (cached separately up to 24 hours)
- Message content protected under HIPAA safeguards

---

## 4. Structured Output via `tool_use`

### 4.1 Tool Use with JSON Schemas

Define a tool with an `input_schema` to get structured data back:

```json
{
  "tools": [
    {
      "name": "extract_info",
      "description": "Extract structured information",
      "input_schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "age": {"type": "integer"}
        },
        "required": ["name", "age"],
        "additionalProperties": false
      }
    }
  ]
}
```

### 4.2 When to Use `tool_use` vs `output_config.format`

| Feature | `output_config.format` | `tool_use` |
|---|---|---|
| Primary purpose | Constrain entire response to JSON schema | Extract structured data via function calling |
| Response location | `response.content[0].text` (JSON string) | `response.content[].input` (on `tool_use` blocks) |
| Multiple schemas | One schema per request | Multiple tools per request |
| Mixing with text | No -- entire response is JSON | Yes -- can have text + tool_use blocks |
| Strict mode | Implicit (always grammar-constrained) | Opt-in via `strict: true` |
| SDK helpers | Pydantic/Zod `parse()` | Standard tool handling |

---

## 5. Strict Tool Use

### 5.1 `strict: true` on Tool Definitions

```json
{
  "tools": [
    {
      "name": "toolName",
      "strict": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "param": {"type": "string"}
        },
        "required": ["param"],
        "additionalProperties": false
      }
    }
  ]
}
```

- Uses **grammar-constrained sampling** (same as `output_config.format`)
- Guarantees tool inputs match the schema exactly
- `additionalProperties: false` is **required** for strict mode
- Same schema limitations as JSON outputs (no recursive schemas, no numerical constraints, etc.)
- Same complexity limits: max 20 strict tools, 24 optional params, 16 union types

### 5.2 Grammar-Constrained Sampling

Both `output_config.format` and `strict: true` use **grammar-constrained sampling** under the hood. This means:
- The model's token sampling is constrained at generation time to only produce valid tokens according to the schema
- This is NOT post-processing validation -- it's built into the generation process
- Result: 100% schema compliance (except refusals and max_tokens truncation)

---

## 6. `tool_choice` Options

### 6.1 Exact JSON Syntax

#### Auto (default) -- model decides whether to use tools
```json
{
  "tool_choice": {
    "type": "auto",
    "disable_parallel_tool_use": false
  }
}
```

#### Any -- model MUST use at least one tool
```json
{
  "tool_choice": {
    "type": "any",
    "disable_parallel_tool_use": false
  }
}
```

#### Tool -- model MUST use a specific named tool
```json
{
  "tool_choice": {
    "type": "tool",
    "name": "tool_name",
    "disable_parallel_tool_use": false
  }
}
```

#### None -- model will NOT use tools
```json
{
  "tool_choice": {
    "type": "none"
  }
}
```

### 6.2 `disable_parallel_tool_use` (optional, default `false`)

- When `true`: model outputs **at most one** tool use
- For `any` and `tool` types: exactly one tool call
- Available on `auto`, `any`, and `tool` (not on `none`)

### 6.3 Extended Thinking Restrictions

When extended thinking is enabled:
- **Only** `tool_choice: {"type": "auto"}` or `tool_choice: {"type": "none"}` are supported
- `tool_choice: {"type": "any"}` causes **error**
- `tool_choice: {"type": "tool", "name": "..."}` causes **error**
- Reason: Forcing tool use is incompatible with extended thinking

---

## 7. Extended Thinking

> **Source:** https://platform.claude.com/docs/en/build-with-claude/extended-thinking

### 7.1 Adaptive Thinking (Current Standard)

```json
{
  "thinking": {"type": "adaptive"},
  "output_config": {"effort": "high"}
}
```

- Claude **dynamically decides** when and how much to think
- Calibrates thinking based on: (1) `effort` parameter, (2) query complexity
- On easier queries that don't require thinking, model responds directly
- **Reliably drives better performance** than manual extended thinking in internal evaluations

**Supported models**: Claude Opus 4.7+, Claude Opus 4.6, Claude Sonnet 4.6

### 7.2 Effort Levels

| Level | Description | Use Case |
|---|---|---|
| `low` | Reserve for short, scoped tasks | Latency-sensitive workloads not needing intelligence |
| `medium` | Good cost-intelligence tradeoff | Cost-sensitive use cases |
| `high` | Balanced token usage and intelligence | **Minimum for most intelligence-sensitive use cases** |
| `xhigh` | Extra high effort (new with Opus 4.7) | **Best for coding and agentic use cases** |
| `max` | Maximum effort, may show diminishing returns | Intelligence-demanding tasks; can be prone to overthinking |

**Exact API syntax:**
```python
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # or "max", "xhigh", "medium", "low"
    messages=[{"role": "user", "content": "..."}],
)
```

Claude Opus 4.7 **respects effort levels strictly**, especially at the low end. At `low` and `medium`, model scopes work to what was asked rather than going above and beyond.

### 7.3 Legacy Manual Extended Thinking (Deprecated)

```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000,
    "display": "summarized"
  }
}
```

| Parameter | Description |
|---|---|
| `type` | `"enabled"`, `"disabled"`, or `"adaptive"` |
| `budget_tokens` | Maximum tokens for internal reasoning. Must be < `max_tokens` |
| `display` | `"summarized"` (default on Opus 4.6/Sonnet 4.6) or `"omitted"` (default on Opus 4.7/Mythos) |

**Deprecation status:**
- **Claude Opus 4.7+**: Returns **400 error** -- manual extended thinking no longer supported
- **Claude Opus 4.6 & Sonnet 4.6**: Deprecated but still functional; will be removed in future release
- **Other Claude models**: Fully supported

### 7.4 Thinking Display Configuration

| Display Mode | Behavior |
|---|---|
| `"summarized"` | Returns summarized thinking text. First few lines more verbose for prompt engineering insights. Charged for **full** thinking tokens, not summary. |
| `"omitted"` | Thinking blocks returned with **empty** `thinking` field. `signature` field still carries encrypted full thinking. Faster time-to-first-text-token. Still charged for full thinking tokens. |

### 7.5 Response Content Blocks

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

- `signature`: Encrypted full thinking for multi-turn continuity (present regardless of `display` setting)

### 7.6 Tool Use with Extended Thinking

**Restrictions:**
- Only `tool_choice: {"type": "auto"}` (default) or `tool_choice: {"type": "none"}` supported
- `tool_choice: {"type": "any"}` --> ERROR
- `tool_choice: {"type": "tool", "name": "..."}` --> ERROR

**Critical requirement**: Pass thinking blocks back to API for last assistant message:
- Include **complete, unmodified** blocks to maintain reasoning continuity
- Entire sequence of thinking blocks must match original outputs
- Cannot rearrange or modify thinking block sequence

**Cannot toggle thinking mid-turn** (including during tool use loops):
- Entire assistant turn must operate in single thinking mode
- Mid-turn conflicts trigger **graceful degradation**: thinking silently disabled, no error thrown
- Check response for `thinking` blocks to confirm whether thinking was active

### 7.7 Interleaved Thinking

- Claude thinks **between tool calls** and after receiving tool results
- `budget_tokens` can **exceed** `max_tokens` (represents total budget across all thinking blocks in turn)

**Model support:**
| Model | Interleaved Thinking |
|---|---|
| Claude Mythos Preview | Automatic, no beta header |
| Claude Opus 4.7 | Automatic with adaptive thinking |
| Claude Opus 4.6 | Automatic with adaptive thinking |
| Claude Sonnet 4.6 | Automatic with adaptive thinking (recommended) |
| Other Claude 4 models | Requires beta header `interleaved-thinking-2025-05-14` |

### 7.8 Prompt Caching with Extended Thinking

- Thinking blocks from previous turns **removed from context** for cache calculation
- Thinking blocks still count as **input tokens when read from cache**
- Changes to thinking parameters **invalidate message cache breakpoints**
- System prompts and tools **remain cached** despite thinking parameter changes
- Cache TTL: `"5m"` (default) or `"1h"` (recommended for extended thinking)

### 7.9 Output Token Limits by Model

| Model | Standard Max Output | Batch Extended Output |
|---|---|---|
| Claude Mythos Preview, Opus 4.7, Opus 4.6 | 128k tokens | 300k (with `output-300k-2026-03-24` beta) |
| Claude Sonnet 4.6, Haiku 4.5 | 64k tokens | 300k (with beta, Sonnet 4.6 only) |

---

## 8. Message Batches API

> **Source:** https://platform.claude.com/docs/en/build-with-claude/batch-processing

### 8.1 Key Facts

| Property | Value |
|---|---|
| **Cost savings** | **50% off** standard API prices (input, output, and special tokens) |
| **Processing window** | Up to **24 hours**; most batches finish in **< 1 hour** |
| **Latency SLA** | **None** -- no guaranteed latency; async processing |
| **Max requests per batch** | **100,000** requests OR **256 MB**, whichever comes first |
| **Results availability** | **29 days** after creation |
| **Streaming** | **Not supported** for batch requests |
| **ZDR eligible** | **No** -- data retained per standard retention policy |
| **Multi-turn tool calling** | Each request is independent; no multi-turn tool loops within a batch |
| **Batch modification** | Cannot modify after submission; must cancel and resubmit |

### 8.2 `custom_id` Requirements

- **Required** for each request in a batch
- Must be **unique** within the batch
- 1-64 characters matching regex: `^[a-zA-Z0-9_-]{1,64}$`
- Used to **correlate results to requests** (results may return out of order)

### 8.3 Processing States

| State | Description |
|---|---|
| `in_progress` | Initial state; batch is being processed |
| `canceling` | Cancel initiated but not yet complete |
| `ended` | All requests finished processing |

### 8.4 Result Types

| Result Type | Description | Billed? |
|---|---|---|
| `succeeded` | Request successful; includes message result | Yes |
| `errored` | Request encountered error (invalid request or server error) | **No** |
| `canceled` | Batch canceled before this request was processed | **No** |
| `expired` | Batch reached 24-hour expiration before processing | **No** |

### 8.5 Batch Response Object

```json
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### 8.6 API Endpoints

| Operation | Method | Path |
|---|---|---|
| Create batch | `POST` | `/v1/messages/batches` |
| Retrieve batch | `GET` | `/v1/messages/batches/{batch_id}` |
| List batches | `GET` | `/v1/messages/batches` |
| Cancel batch | `POST` | `/v1/messages/batches/{batch_id}/cancel` |
| Get results | `GET` | `results_url` from batch object |
| Delete batch | `DELETE` | `/v1/messages/batches/{batch_id}` |

### 8.7 What Can Be Batched

- Vision, Tool use, System messages, Multi-turn conversations, Any beta features
- Each request processed independently; can mix different types
- All active models supported

### 8.8 Prompt Caching with Batches

- Prompt caching and batch discounts **stack**
- Cache hits are **best-effort** (async concurrent processing)
- Typical cache hit rates: **30%-98%** depending on traffic patterns
- Tips: Include identical `cache_control` blocks, maintain steady request stream, use 1-hour cache duration

### 8.9 Extended Output (Beta)

- Beta header: `output-300k-2026-03-24`
- Raises `max_tokens` cap to **300,000** for batch requests
- Supported models: Claude Opus 4.7, Opus 4.6, Sonnet 4.6
- **Batch API only** -- not available in synchronous Messages API
- Not available on Bedrock, Vertex AI, or Microsoft Foundry
- A single 300k-token generation can take **over an hour**

---

## 9. Batch Failure Handling

### 9.1 Error Types and Retry Strategy

```python
for result in client.messages.batches.results("msgbatch_..."):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.error.type == "invalid_request_error":
                # Request body must be FIXED before re-sending
                print(f"Validation error {result.custom_id}")
            else:
                # Request CAN be retried directly (server error)
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

- **`invalid_request_error`**: Fix request body before retrying
- **Server errors**: Can be retried directly
- **`expired`**: Resubmit; consider breaking into smaller batches

### 9.2 Resubmit by `custom_id`

- Use `custom_id` to identify which requests failed
- Collect failed `custom_id`s and create a new batch with only those requests
- Results may not match input order -- always use `custom_id` for correlation

### 9.3 Chunking Oversized Documents

- Max batch size: 256 MB
- If request too large: **413 `request_too_large` error**
- Break very large datasets into multiple batches for better manageability
- Dry-run a single request shape with the Messages API to avoid validation errors

### 9.4 Best Practices

- Monitor batch processing status regularly
- Use **meaningful `custom_id` values** for easy matching
- Implement retry logic for failed requests
- Validate with Messages API first before batching
- Failure of one request does NOT affect processing of other requests

---

## 10. Validation-Retry Loops

### 10.1 When Retries Work

- **Server errors** in batches: retry directly
- **Structured output with `max_tokens` truncation**: retry with higher `max_tokens`
- **Transient API errors** (rate limits, timeouts): standard exponential backoff
- **Schema compilation timeout**: simplify schema and retry

### 10.2 When Retries Don't Work

- **`invalid_request_error`**: Must fix the request body (wrong schema, missing required fields, etc.)
- **Refusals** (`stop_reason: "refusal"`): Safety takes precedence; changing the prompt is needed, not retrying
- **Schema too complex**: Need to simplify schema, not just retry
- **400 error from deprecated thinking config** (e.g., `budget_tokens` on Opus 4.7): Must change configuration

### 10.3 Retry with Error Feedback Pattern

For structured output, when using the SDK `parse()` helpers:
1. Call `client.messages.parse(output_format=Model)`
2. If parsing fails or output doesn't match expectations, include the error in a follow-up message
3. Claude can self-correct given specific error feedback

For tool use validation:
1. If tool input is invalid, return a `tool_result` with `is_error: true`
2. Include the validation error message in the content
3. Claude will attempt to correct and re-call the tool

---

## 11. Multi-Pass Review

### 11.1 Self-Review Limitations

- Claude can self-check, but a single instance reviewing its own output has limitations
- The same biases that produced the original output may persist in self-review
- "Before you finish, verify your answer against [test criteria]" catches errors for coding/math but is less reliable for subjective quality

### 11.2 Independent Instances

- Most common chaining pattern: **generate draft -> review against criteria -> refine**
- Each step is a **separate API call** so you can log, evaluate, or branch at any point
- Using separate API calls means independent context = fresh perspective
- For code review: Claude Opus 4.7 has **11pp better recall** on bug-finding evals vs prior models

### 11.3 Per-File + Cross-File Passes

For code review harnesses:
- **Finding pass**: "Report every issue you find, including ones you are uncertain about or consider low-severity. Do not filter for importance or confidence at this stage."
- **Verification/ranking pass**: Separate stage for deduplication, confidence filtering, severity ranking
- **Cross-file analysis**: Claude maintains orientation across extended sessions; use structured state files

### 11.4 Code Review Prompt Guidance

```text
Report every issue you find, including ones you are uncertain about or consider
low-severity. Do not filter for importance or confidence at this stage - a
separate verification step will do that. Your goal here is coverage: it is
better to surface a finding that later gets filtered out than to silently drop
a real bug. For each finding, include your confidence level and an estimated
severity so a downstream filter can rank them.
```

---

## 12. Explicit Criteria

### 12.1 Specific Review Criteria vs Vague Instructions

- Claude Opus 4.7 interprets prompts **more literally and explicitly** than Opus 4.6, particularly at lower effort levels
- Will NOT silently generalize an instruction from one item to another
- Will NOT infer requests you didn't make
- If you need Claude to apply an instruction broadly, **state the scope explicitly** ("Apply this formatting to every section, not just the first one")

### 12.2 Code Review Filtering Example

When "only report high-severity issues" or "be conservative" is said:
- Claude Opus 4.7 may follow that instruction **more faithfully** than earlier models
- May investigate thoroughly, identify bugs, then **not report** findings it judges below your stated bar
- Precision rises but measured recall can fall

**Better approach**: Be concrete about where the bar is rather than qualitative terms:
```text
Report any bugs that could cause incorrect behavior, a test failure, or a
misleading result; only omit nits like pure style or naming preferences.
```

### 12.3 False Positive Management

- Separate finding stage (high recall) from filtering stage (high precision)
- Include confidence level and severity for each finding
- Downstream filter can rank and deduplicate
- "It is better to surface a finding that later gets filtered out than to silently drop a real bug"

---

## 13. Messages API Reference

> **Source:** https://platform.claude.com/docs/en/api/messages

### 13.1 Core Endpoint

**POST** `/v1/messages`

### 13.2 Required Parameters

| Parameter | Type | Description |
|---|---|---|
| `model` | string | Model ID (e.g., `claude-opus-4-7`, `claude-sonnet-4-6`) |
| `messages` | array | Array of `MessageParam` objects (alternating user/assistant) |
| `max_tokens` | number | Maximum tokens to generate (absolute ceiling, not target) |

### 13.3 Optional Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `system` | string or TextBlockParam[] | - | System prompt |
| `temperature` | number (0.0-1.0) | 1.0 | Randomness; 0.0 for analytical, 1.0 for creative. Not fully deterministic even at 0.0 |
| `top_p` | number | - | Nucleus sampling (mutually exclusive with `top_k`) |
| `top_k` | number | - | Sample from top K options (mutually exclusive with `top_p`) |
| `stop_sequences` | string[] | - | Custom sequences that cause generation to stop |
| `stream` | boolean | false | Enable SSE streaming |
| `metadata` | object | - | Contains `user_id` for abuse detection (UUID/hash, never PII) |
| `cache_control` | object | - | `{type: "ephemeral", ttl: "5m" or "1h"}` |
| `service_tier` | string | "auto" | `"auto"` or `"standard_only"` |
| `container` | string | - | Container ID for code execution |
| `inference_geo` | string | - | Geographic region for inference |
| `tools` | ToolUnion[] | - | Tool definitions |
| `tool_choice` | object | - | How model uses tools |
| `output_config` | object | - | Output format and effort |
| `thinking` | object | - | Extended thinking configuration |

### 13.4 `output_config` Full Syntax

```json
{
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": { ... }
    },
    "effort": "low" | "medium" | "high" | "xhigh" | "max"
  }
}
```

### 13.5 Response Fields

| Field | Description |
|---|---|
| `id` | Unique message ID |
| `content` | Array of content blocks (text, tool_use, thinking, etc.) |
| `model` | Model used |
| `role` | Always `"assistant"` |
| `stop_reason` | `"end_turn"`, `"stop_sequence"`, `"max_tokens"`, `"tool_use"`, `"refusal"` |
| `stop_sequence` | Matched stop sequence (if applicable) |
| `usage.input_tokens` | Input token count |
| `usage.output_tokens` | Output token count |
| `usage.cache_creation_input_tokens` | Tokens written to cache |
| `usage.cache_read_input_tokens` | Tokens read from cache |
| `type` | Always `"message"` |

### 13.6 Content Block Types in Messages

User-side: `text`, `image`, `document`, `tool_result`, `search_result`, `container_upload`
Assistant-side: `text`, `tool_use`, `server_tool_use`, `thinking`, `redacted_thinking`
Tool results: `web_search_tool_result`, `web_fetch_tool_result`, `code_execution_tool_result`, `bash_code_execution_tool_result`, `text_editor_code_execution_tool_result`, `tool_search_tool_result`

### 13.7 Tool Definition Types

| Type | Name |
|---|---|
| `custom` | User-defined tools |
| `bash_20250124` | Bash execution |
| `code_execution_20250522` / `20250825` / `20260120` | Code execution (20260120 = REPL persistence) |
| `memory_20250818` | Memory tool |
| `text_editor_20250124` / `20250429` / `20250728` | Text editor |
| `web_search_20250305` / `20260209` | Web search |
| `web_fetch_20250910` / `20260209` / `20260309` | Web fetch |
| `tool_search_tool_bm25` / `tool_search_tool_regex` | Tool search |

---

## 14. Model-Specific Prompting Notes

### Claude Opus 4.7

- **More literal instruction following** than 4.6, especially at lower effort
- **Shorter answers** on simple lookups, longer on open-ended analysis
- **Fewer subagents** by default (steerable via prompting)
- **Stronger design instincts** with consistent default house style (cream/off-white, serif type)
- Requires `xhigh` or `high` effort minimum for most use cases
- Set **64k max output tokens** at `max`/`xhigh` effort for room to think
- **Does NOT support** `budget_tokens` (returns 400 error)
- **Does NOT support** prefilled assistant responses (returns 400 error on Mythos Preview)
- Tends to use **tools less often** than Opus 4.6 (prefers reasoning)

### Claude Opus 4.6

- Uses **adaptive thinking** (`thinking: {type: "adaptive"}`) -- recommended
- `budget_tokens` still works but **deprecated**
- Default effort: respects effort levels but less strictly than 4.7
- May do significantly more upfront exploration than previous models at higher effort settings
- More responsive to system prompt than previous models (may overtrigger)

### Claude Sonnet 4.6

- Default effort level: `high` (unlike Sonnet 4.5 which had none)
- Recommended: `medium` for most apps, `low` for high-volume/latency-sensitive
- Set 64k max output at medium/high effort
- Adaptive thinking recommended; `budget_tokens` deprecated

---

## 15. Quick Reference: Exam-Critical Facts

| Topic | Key Fact |
|---|---|
| Few-shot examples | **3-5 examples** for best results |
| XML tags | Use `<example>`, `<examples>`, `<documents>`, `<document>` |
| Long context | Put data at top, query at bottom (**30% improvement**) |
| Prefill support | **Deprecated** on Claude 4.6+; 400 error on Mythos Preview |
| `output_config.format` | `type: "json_schema"` with `additionalProperties: false` required |
| Strict tools | `strict: true` + `additionalProperties: false` on tool definition |
| Grammar compilation cache | **24 hours** |
| Strict tools limit | **20 per request** |
| Compilation timeout | **180 seconds** |
| `tool_choice` options | `auto` (default), `any`, `tool` (+ name), `none` |
| `disable_parallel_tool_use` | Available on `auto`, `any`, `tool` |
| Extended thinking + tool_choice | Only `auto` or `none` (any/tool = error) |
| Adaptive thinking | `thinking: {type: "adaptive"}` + `output_config: {effort: "..."}` |
| Effort levels | `low`, `medium`, `high`, `xhigh` (new), `max` |
| `budget_tokens` on Opus 4.7 | **400 error** (not supported) |
| `budget_tokens` on Opus 4.6 | Deprecated but functional |
| Thinking display | `"summarized"` or `"omitted"` |
| Thinking billing | Charged for **full** thinking tokens, not summary |
| Batch cost savings | **50%** off standard prices |
| Batch time window | **24 hours** max |
| Batch results available | **29 days** after creation |
| Batch max requests | **100,000** or **256 MB** |
| Batch latency SLA | **None** |
| `custom_id` regex | `^[a-zA-Z0-9_-]{1,64}$` |
| Batch result types | `succeeded`, `errored`, `canceled`, `expired` |
| Batch extended output | **300k tokens** with `output-300k-2026-03-24` beta header |
| Temperature default | **1.0** (not 0.7) |
| Temperature range | **0.0-1.0** |
| `stop_reason` values | `end_turn`, `stop_sequence`, `max_tokens`, `tool_use`, `refusal` |
