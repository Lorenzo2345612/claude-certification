# CAC Certification Quiz System — Audit Report

**Date:** 2026-04-15
**Auditor:** Claude Opus 4.6 (AI-assisted), supervised by Lorenzo Trujillo
**Scope:** Full audit of questions, answers, learn content, and documentation links

---

## 1. Executive Summary

A comprehensive audit was performed on the Claude Certified Architect (CAC) Foundations certification quiz system. The audit verified **331 questions** across 5 domains and **36 learn topics** against the official **Claude Certified Architect – Foundations Certification Exam Guide** (PDF).

### Key Findings
- **27 new questions** added to address distribution imbalances in D1 and D4
- **1 new learn topic** added (Iterative Refinement Techniques) to cover exam Task Statement 3.5
- **36 summary boxes with key concept definitions** added to all learn topics
- **All documentation URLs verified** as valid and pointing to correct resources
- **No factually incorrect answers** found in existing question bank (see methodology below)

---

## 2. Audit Methodology

### 2.1 Source of Truth

The primary source of truth for this audit is the official exam guide:

> **Claude Certified Architect – Foundations Certification Exam Guide**
> File: `instructor_8lsy243ftffjjy1cx9lm3o2bw_public_1773274827_Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf`

This document defines:
- 5 exam domains with specific weight percentages
- 25+ task statements (detailed competency areas)
- Recommended study resources and documentation

### 2.2 Question Accuracy Verification

Each question was evaluated on four dimensions:

#### a) Factual Correctness
- Every correct answer was cross-referenced against the official Anthropic documentation at `platform.claude.com/docs` and `code.claude.com/docs`
- API behavior claims (stop_reason values, tool_choice options, strict mode mechanics) were verified against the Claude API reference
- Claude Code features (hooks, skills, CLAUDE.md, CLI flags) were verified against the Claude Code documentation
- MCP protocol details were verified against `modelcontextprotocol.io/docs`

#### b) Answer Uniqueness
- Each question has exactly ONE unambiguously correct answer
- "Why others are wrong" explanations were verified to be logically sound
- Distractors (wrong answers) represent common misconceptions or plausible-but-incorrect approaches

#### c) Scenario Relevance
- Questions use realistic scenarios (Customer Support Agent, Multi-Agent Research System, Developer Productivity, CI/CD Pipeline)
- Scenarios match the types of problems an architect would encounter in production

#### d) Explanation Quality
- Each question includes a detailed explanation of WHY the correct answer is correct
- Each question includes `whyOthersWrong` entries explaining why each distractor fails
- Explanations reference specific technical details (not vague reasoning)

### 2.3 Domain Coverage Analysis

The exam guide specifies 5 domains with target weights:

| Domain | Exam Weight | Questions Before | Questions After | After % |
|--------|------------|-----------------|----------------|---------|
| D1: Agentic Architecture & Orchestration | 27% | 68 | 82 | 24.8% |
| D2: Tool Design & MCP Integration | 18% | 55 | 55 | 16.6% |
| D3: Claude Code Configuration & Workflows | 20% | 85 | 85 | 25.7% |
| D4: Prompt Engineering & Structured Output | 20% | 48 | 61 | 18.4% |
| D5: Context Management & Reliability | 15% | 48 | 48 | 14.5% |
| **Total** | **100%** | **304** | **331** | |

#### Coverage gaps addressed:
- **D1 was under-represented** (22.4% vs 27% target): Added 14 questions covering parallel subagent spawning, iterative refinement loops, session forking, task decomposition, escalation protocols, and hook normalization
- **D4 was under-represented** (15.8% vs 20% target): Added 13 questions covering enum extensibility patterns, retry-with-error-feedback, nullable field design, explicit review criteria, severity calibration, and batch processing preparation

### 2.4 Task Statement Mapping

Each of the 25+ task statements from the exam guide was mapped to existing questions and learn topics. The following gap was identified and resolved:

| Task Statement | Gap Found | Resolution |
|---------------|-----------|------------|
| 3.5: Iterative refinement techniques | No dedicated learn topic | Added "d3-iterative-refinement" topic covering input/output examples, test-driven iteration, and the interview pattern |

All other task statements had adequate coverage in both questions and learn topics.

### 2.5 Documentation Link Verification

All documentation URLs were verified using HTTP requests to confirm they resolve to valid pages:

| Base URL Pattern | Status | Count |
|-----------------|--------|-------|
| `https://platform.claude.com/docs/en/...` | Valid | 28 URLs |
| `https://code.claude.com/docs/en/...` | Valid | 14 URLs |
| `https://modelcontextprotocol.io/docs/...` | Valid | 1 URL |

**Note:** The legacy domain `docs.anthropic.com` redirects (HTTP 301) to `platform.claude.com` but introduces a doubled path segment (`/docs/en/docs/...`). All URLs in the system correctly use the canonical `platform.claude.com/docs/en/...` pattern.

---

## 3. Question Design Principles

### 3.1 Scenario-Based Architecture
Questions are designed around realistic architectural scenarios rather than simple factual recall. Each question presents a situation an architect would encounter and requires selecting the most appropriate solution approach.

### 3.2 Distractor Design
Wrong answers are designed to represent:
- **Common misconceptions**: Approaches that sound reasonable but miss a key technical detail
- **Over-engineering**: Solutions that are more complex than necessary for the described problem
- **Under-engineering**: Solutions that address symptoms rather than root causes
- **Adjacent solutions**: Correct approaches for different problems (tests understanding of problem diagnosis)

### 3.3 Explanation Depth
Every question includes:
- **Correct answer explanation**: Why this approach is optimal for the specific scenario
- **Per-distractor explanations**: Why each wrong answer fails, with specific technical reasoning
- **Documentation reference**: Link to the relevant Anthropic documentation page

---

## 4. Learn Content Audit

### 4.1 Topic Coverage
36 learn topics across 5 domains were audited:

| Domain | Topics | Coverage Assessment |
|--------|--------|-------------------|
| D1: Agentic Architecture | 8 | Comprehensive: agentic loop, tool contract, multi-agent, hooks, subagents, sessions, decomposition, enforcement |
| D2: Tool Design & MCP | 7 | Comprehensive: interfaces, tool_choice, strict mode, errors, MCP architecture, MCP config, built-in tools |
| D3: Claude Code Config | 8 | Comprehensive (after adding iterative refinement): CLAUDE.md, rules, skills, plan mode, CLI, CI/CD, context window, iterative refinement |
| D4: Prompt Engineering | 6 | Comprehensive: best practices, few-shot, structured output, batch processing, multi-instance review, adaptive thinking |
| D5: Context & Reliability | 7 | Comprehensive: context windows, escalation, error propagation, large codebase, human review, provenance, hooks settings |

### 4.2 Summary Boxes Added
Every learn topic now includes:
- **Quick Summary**: 2-3 sentence overview of the topic's key points
- **Key Concepts**: Tagged list of critical terms with hover-tooltip definitions

This ensures students can quickly assess topic scope before diving into detailed content, and can reference definitions without leaving the page.

### 4.3 Content Accuracy
Learn topic content was verified against the same documentation sources used for question verification. Key technical claims in each topic (API parameters, configuration paths, behavior descriptions) were cross-referenced with the official documentation.

---

## 5. Limitations and Disclaimers

### 5.1 Anthropic Documentation Changes
The Claude API and Claude Code are actively evolving products. Some technical details may change between the time of this audit and the time of the exam. Students should always consult the latest official documentation.

### 5.2 Exam Content Independence
This quiz system is an **independent study tool** and is NOT affiliated with or endorsed by Anthropic. The exam guide provides task statements and domains but does not publish actual exam questions. Questions in this system are original creations designed to test the same competencies.

### 5.3 AI-Generated Content Verification
All questions, answers, and explanations were generated and verified by Claude Opus 4.6, an AI model. While extensive cross-referencing with official documentation was performed, AI-generated content should be treated as a study aid, not as authoritative documentation. When in doubt, consult the official Anthropic documentation directly.

### 5.4 Coverage Completeness
While this system covers all documented task statements from the exam guide, the actual exam may test nuances or combinations of concepts not explicitly covered by individual questions. Broad understanding of the documentation is recommended in addition to using this quiz system.

---

## 6. Recommended Study Approach

1. **Read the learn topics** in order within each domain, using the summary boxes for orientation
2. **Practice with domain-specific quizzes** before attempting full mixed-domain practice
3. **Review wrong answers carefully** — the "why others are wrong" explanations contain valuable architectural reasoning
4. **Follow documentation links** for topics where you score below 80%
5. **Re-take practice quizzes** with shuffled questions to ensure retention, not pattern recognition

---

*Report generated 2026-04-15 by Claude Opus 4.6 during system audit.*
