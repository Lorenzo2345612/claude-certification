# Research: Context Windows
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/context-windows

## Context Window Sizes
- **1M tokens**: Claude Mythos Preview, Opus 4.7, Opus 4.6, Sonnet 4.6
- **200k tokens**: Claude Sonnet 4.5, Sonnet 4 (deprecated), older models

## Max Images/PDFs
- Up to 600 images or PDF pages (1M models)
- Up to 100 (200k models)

## Progressive Token Accumulation
- Each turn: all previous history + current message → generates response
- Linear growth with each turn

## Extended Thinking and Context
- Thinking budget tokens are subset of max_tokens, billed as output
- Previous thinking blocks **automatically stripped** from context window calculation
- Cryptographic signatures verify thinking block authenticity
- Claude 4 models support interleaved thinking (between tool calls)

## Context Awareness (Sonnet 4.6, 4.5, Haiku 4.5)
- Models track remaining token budget throughout conversation
- System warning after tool calls: `Token usage: 35000/1000000; 965000 remaining`

## Server-Side Compaction
- Recommended for conversations approaching limits
- Beta for Opus 4.7, 4.6, Sonnet 4.6
- Automatically condenses earlier conversation parts
