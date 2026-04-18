# Research: Structured Outputs
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/structured-output

## output_config.format Syntax
```json
"output_config": {
  "format": {
    "type": "json_schema",
    "schema": {
      "type": "object",
      "properties": { ... },
      "required": [...],
      "additionalProperties": false
    }
  }
}
```

- Response is valid JSON matching schema, in `response.content[0].text`

## Migration Note
- Old `output_format` parameter moved to `output_config.format`
- Old parameter still works during transition period

## SDK Helpers

### Python (Pydantic)
- Use `client.messages.parse()` with Pydantic models
- `output_format=MyModel` as convenience parameter

### TypeScript (Zod)
- `import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"`
- Usage: `output_config: { format: zodOutputFormat(ContactInfo) }`
- `parse()` method returns `parsed_output` with inferred types

### TypeScript (JSON Schema without Zod)
- `import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema"`
- Usage: `format: jsonSchemaOutputFormat({ type: "object", ... } as const)`

## as const Requirement in TypeScript
- With `as const`: compile-time type inference, `parsed_output` typed to match schema
- Without `as const`: inferred type collapses to `unknown`
- Only works with literal expressions

## Difference from strict tool use
- **JSON outputs** (`output_config.format`): Controls Claude's **response format** (what Claude says)
- **Strict tool use** (`strict: true`): Validates **tool parameters** (how Claude calls functions)
- Can be used **independently or together**
- Both share the same grammar-constrained sampling pipeline

## Schema Caching
- JSON schema cached for up to **24 hours since last use**
- Same PHI restrictions as strict tool use

## Guarantees
- Always valid JSON (no parse errors)
- Correct field types
- Required fields always present
- Exact schema compliance
- Eliminates retries due to schema violations
