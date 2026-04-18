# Research: Extended Thinking & Adaptive Thinking
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking

## Adaptive Thinking Configuration (Recommended)
```json
{
  "thinking": {
    "type": "adaptive"
  },
  "output_config": {
    "effort": "high"
  }
}
```

Note: `effort` is in `output_config`, NOT inside `thinking`.

## Effort Levels
- `low` — Minimal reasoning
- `medium` — Balanced reasoning
- `high` — Extensive reasoning
- `max` — Maximum reasoning depth

All four levels supported across all models that support adaptive thinking (Opus 4.7, Opus 4.6, Sonnet 4.6). No model-exclusive restriction on `max` based on the docs.

## Manual Extended Thinking (Legacy)
```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

- Claude Opus 4.7+: Manual thinking NOT supported (400 error). Must use adaptive.
- Claude Opus 4.6 / Sonnet 4.6: `budget_tokens` deprecated but still functional
- budget_tokens must be less than max_tokens

## Tool Use Restrictions
- Only `tool_choice: auto` and `tool_choice: none` compatible
- `tool_choice: any` or `tool_choice: tool` **cause errors**
- Must pass thinking blocks back unmodified when providing tool results

## Prefilled Responses
- Message prefilling (pre-filling assistant turn) is **incompatible** with JSON structured outputs
- Claude Mythos Preview does not support forced tool use

## Content Block Types
```json
{
  "type": "thinking",
  "thinking": "Let me analyze this step by step...",
  "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve..."
}
```

## Output Token Limits
- Opus 4.7/4.6: **128k** output tokens
- Sonnet 4.6 / Haiku 4.5: **64k** output tokens
