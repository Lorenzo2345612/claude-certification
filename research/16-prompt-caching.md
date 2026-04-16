# Research: Prompt Caching
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

## Cache TTL
- Default: **5 minutes** (`"ttl": "5m"`)
- Extended: **1 hour** (`"ttl": "1h"`) at 2x base input price
- Refreshed at no additional cost when reused within TTL

## Cache Hierarchy
tools → system → messages
- Changes at each level invalidate that level AND all subsequent levels

## What Invalidates Cache

| Change | Tools | System | Messages |
|--------|-------|--------|----------|
| Tool definitions modified | BREAKS | BREAKS | BREAKS |
| **tool_choice parameter** | OK | OK | **BREAKS** |
| Extended thinking settings | OK | OK | **BREAKS** |
| Images added/removed | OK | OK | **BREAKS** |

## Pricing
- 5-min cache writes: 1.25x base
- 1-hour cache writes: 2.0x base
- Cache reads/hits: **0.1x base** (90% savings)
- Cache reads do NOT count against rate limits
