# Research: Prompting Best Practices
**Source:** https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview

## General Principles
- Be clear and direct — think of Claude as a brilliant but new employee
- Provide sequential steps using numbered lists when order matters
- Add context: explain WHY a behavior is important (Claude generalizes from explanation)

## XML Tag Usage
- Use XML tags to structure complex prompts: `<instructions>`, `<context>`, `<input>`
- Consistent, descriptive tag names
- Nest tags for hierarchy: `<documents>` containing `<document index="n">`

## Role Prompting
- Set role in system prompt to focus behavior and tone
- Even single sentence makes a difference
- Example: `system="You are a helpful coding assistant specializing in Python."`

## Positive Instructions
- Tell Claude what TO DO, not what NOT to do
- Instead of "Don't use markdown" → "Use smoothly flowing prose paragraphs"

## Document Placement (Long Context, 20k+ tokens)
- **Put longform data at the TOP** of prompt, ABOVE query/instructions/examples
- **Queries at the end improve quality by up to 30%** in tests
- Structure with XML: `<documents>` > `<document index="1">` > `<source>` + `<document_content>`
- **Ground responses in quotes**: ask Claude to quote relevant parts first in `<quotes>` tags

## Few-Shot Examples
- "One of the most reliable ways to steer output format, tone, and structure"
- **Recommended: 3-5 examples**
- Wrap in `<example>` tags, multiple inside `<examples>` container
- Make examples **relevant**, **diverse**, **structured**
- Include edge cases; cover all output categories
- Multishot with thinking: use `<thinking>` tags inside examples

## Chain-of-Thought
- Claude supports adaptive thinking: `thinking: {type: "adaptive"}`
- Prefer general instructions over prescriptive steps
- Use `<thinking>` and `<answer>` tags when thinking disabled
- Self-check: "Before finishing, verify your answer against [criteria]"

## Effort Levels (Claude Opus 4.7)
- `max`: maximum effort, may show diminishing returns
- `xhigh`: best for most coding and agentic use cases
- `high`: balances token usage and intelligence
- `medium`: cost-sensitive
- `low`: short, scoped tasks

## Prefilled Responses
- Starting with Claude 4.6: prefilled responses on last assistant turn **no longer supported**
- On Mythos Preview: returns 400 error

## Parallel Tool Calls
- Use `<use_parallel_tool_calls>` wrapper in prompt to indicate parallel execution
- Claude 4.6 has near-100% success rate with explicit prompt
