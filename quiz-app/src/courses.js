// Canonical Skilljar course inventory for the CCA exam.
// Source of truth: docs/superpowers/specs/2026-04-29-course-specific-filtering-research.md
// Updated 2026-04-29 after live verification pass.

export const PUBLISHED_COURSES = [
  { key: "claude-api",            displayName: "Building with the Claude API",        verification: "verified" },
  { key: "claude-code-101",       displayName: "Claude Code 101",                     verification: "verified" },
  { key: "claude-code-in-action", displayName: "Claude Code in Action",               verification: "verified" },
  { key: "subagents",             displayName: "Introduction to Subagents",           verification: "verified" },
  { key: "agent-skills",          displayName: "Introduction to Agent Skills",        verification: "verified" },
  { key: "mcp-intro",             displayName: "Introduction to Model Context Protocol", verification: "verified" },
  { key: "mcp-advanced",          displayName: "MCP Advanced Topics",                 verification: "verified" },
  { key: "claude-cowork",         displayName: "Introduction to Claude Cowork",       verification: "verified" },
];

export const DOCS_ONLY_KEY = "cca-docs-only";

export function getCourse(key) {
  return PUBLISHED_COURSES.find(c => c.key === key) || null;
}

export function courseDisplayName(key) {
  if (key === DOCS_ONLY_KEY) return "Anthropic Docs only";
  const c = getCourse(key);
  return c ? c.displayName : key;
}
