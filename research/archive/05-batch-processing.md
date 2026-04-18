# Research: Message Batches API
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/batch-processing

## custom_id Rules
- Regex: `^[a-zA-Z0-9_-]{1,64}$`
- 1-64 characters, alphanumeric + hyphens + underscores only
- Must be unique within a batch

## processing_status Values
- `in_progress` — Batch is being processed (initial state)
- `canceling` — Cancellation initiated but not finalized
- `ended` — All requests finished, results ready

## Result Types and Billing
| Type | Description | Billed? |
|---|---|---|
| `succeeded` | Request completed successfully | **Yes** |
| `errored` | Request failed (invalid input or server error) | **No** |
| `canceled` | Batch canceled before this request processed | **No** |
| `expired` | 24h expiration reached before processing | **No** |

Only `succeeded` results are billed.

## Max Limits Per Batch
- **100,000 Message requests** OR **256 MB** total size, whichever first

## Result Retention
- **29 days** after batch creation
- After 29 days: metadata viewable but results not downloadable

## Async Parameter Validation
- Params validated **asynchronously** during processing, NOT at batch creation
- Invalid params appear as `errored` with `invalid_request_error`
- Recommendation: verify shape with synchronous API first

## Processing Time
- Most batches finish in **less than 1 hour**
- Maximum window: **24 hours**

## Pricing
- **50% discount** on all token usage vs standard API prices
- Prompt caching and batch discounts **stack**
