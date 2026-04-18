# Claude with Amazon Bedrock - Skilljar Course Research

**Course URL:** https://anthropic.skilljar.com/claude-in-amazon-bedrock
**Platform:** Anthropic Academy (Skilljar)
**Registration:** https://anthropic.skilljar.com/checkout/2dzxfq5v2bzhu
**Cost:** Free
**Estimated Lessons:** ~80+ individual lessons across 10 modules

## Course Overview

Originally created as a first-of-its-kind accreditation program for AWS employees, now publicly available. This comprehensive technical training teaches developers how to integrate and deploy Claude AI models through Amazon Bedrock. Covers Claude API integration through Amazon Bedrock, including RAG pipelines, tool use, extended thinking, prompt caching, MCP, Claude Code, and Computer Use - all within the AWS ecosystem. Every code example uses the AWS SDK (boto3).

## Prerequisites

- Python programming proficiency
- Basic AWS services and Amazon Bedrock knowledge

## Target Audience

Backend developers, ML engineers, DevOps engineers, full-stack developers, technical architects, and automation engineers building AI-powered applications.

## Learning Objectives

- Implement Claude via Amazon Bedrock for conversational AI and system prompts
- Build and evaluate prompts through structured methodologies
- Create custom tools using JSON Schema for function calling
- Develop RAG (Retrieval Augmented Generation) pipelines with text chunking and embeddings
- Configure advanced features like extended thinking, vision, and prompt caching
- Use Claude Code for debugging and task automation
- Implement Model Context Protocol (MCP) for tool/resource management
- Optimize inference through streaming and structured extraction
- Create evaluation frameworks with model-based and code-based grading

---

## Full Curriculum

### Module 1: Course Introduction
1. Introduction to the course
2. Overview of Claude Models

### Module 2: Working with the API
3. Accessing the API
4. Making a request
5. Multi-Turn conversations
6. Chat bot exercise
7. System prompts
8. System prompt exercise
9. Temperature
10. Streaming
11. Controlling model output
12. Structured data
13. Structured data exercise
14. Quiz on working with the API

**Module Description:** Covers how to access and interact with AI models through AWS Bedrock. Learn the fundamental patterns for connecting applications to cloud-based models and controlling how those models generate text. Topics include API requests, multi-turn conversations, response control, streaming, and structured data generation.

### Module 3: Prompt Evaluations
15. Prompt evaluation
16. A typical eval workflow
17. Generating test datasets
18. Running the eval
19. Model based grading
20. Code based grading
21. Exercise on prompt evals
22. Quiz on prompt evaluations

**Module Description:** Covers evaluation workflows, test dataset creation, model-based and code-based grading, and iterative improvement. Teaches why thorough testing is essential before deploying any AI solution.

### Module 4: Prompt Engineering
23. Prompt engineering
24. Being clear and direct
25. Being specific
26. Structure with XML tags
27. Providing examples
28. Exercise on prompting
29. Quiz on prompt engineering

**Module Description:** Covers clear instructions, specific guidelines, XML structure, and example-based learning. Teaches prompt engineering techniques for optimal results.

### Module 5: Tool Use
30. Introducing tool use
31. Tool functions
32. JSON Schema for tools
33. Handling tool use responses
34. Running tool functions
35. Sending tool results
36. Multi-Turn conversations with tools
37. Adding multiple tools
38. Batch tool use
39. Structured data with tools
40. Flexible tool extraction
41. The text editor tool
42. Quiz on tool use

**Module Description:** Covers tool fundamentals, JSON Schema implementation, multi-tool management, batch processing, structured data extraction with tools, and the text editor tool.

### Module 6: Retrieval Augmented Generation
43. Introducing Retrieval Augmented Generation
44. Text chunking strategies
45. Text embeddings
46. The full RAG flow
47. Implementing the RAG flow
48. BM25 lexical search
49. A multi-search RAG pipeline
50. Reranking results
51. Contextual retrieval
52. Quiz on Retrieval Augmented Generation

**Module Description:** Covers text chunking, vector embeddings, hybrid search (combining semantic and BM25 lexical search), reranking, and contextual retrieval techniques for building production RAG pipelines.

### Module 7: Features of Claude
53. Extended thinking
54. Image support
55. PDF support
56. Citations
57. Prompt caching
58. Rules of prompt caching
59. Prompt caching in action
60. Quiz on features of Claude

**Module Description:** Covers how to enable Claude's reasoning phase for complex problems (extended thinking), vision/image capabilities, PDF processing, citations, and prompt caching for faster responses and reduced costs.

### Module 8: Model Context Protocol
61. Introducing MCP
62. MCP clients
63. Project setup
64. Defining tools with MCP
65. The server inspector
66. Implementing a client
67. Defining resources
68. Accessing resources
69. Defining prompts
70. Prompts in the client
71. MCP review
72. Quiz on Model Context Protocol

**Module Description:** Covers MCP server/client architecture, building tools with MCP, the server inspector, implementing clients, defining and accessing resources, and working with MCP prompts.

### Module 9: Agents
73. Agents overview
74. Claude Code setup
75. Claude Code in action
76. Enhancements with MCP servers
77. Parallelizing Claude Code
78. Automated debugging
79. Computer Use
80. How Computer Use works
81. Qualities of agents
82. Final assessment
83. Final assessment quiz

**Module Description:** Covers agent fundamentals, Claude Code setup and usage, MCP server enhancements, parallel development with Claude Code, automated debugging, Computer Use capabilities and how it works, and qualities of effective agents.

### Module 10: Wrap Up
84. Course wrap up

**Module Description:** Key concept review covering model families, API usage, parameters, and prompt engineering. Covers future directions on emerging trends in LLM orchestration and agentic workflows.

---

## Key Technical Topics Covered

### API Integration (Bedrock-Specific)
- Using AWS SDK (boto3) for all API calls
- Bedrock-specific authentication and configuration
- Making requests through Amazon Bedrock's infrastructure
- Streaming responses via Bedrock

### Prompt Engineering Techniques
- Being clear and direct in prompts
- Being specific with instructions
- Structuring prompts with XML tags
- Providing examples (few-shot prompting)

### Evaluation Framework
- Building systematic evaluation workflows
- Generating test datasets
- Model-based grading (using Claude to evaluate outputs)
- Code-based grading (programmatic evaluation)

### Tool Use / Function Calling
- Defining tools with JSON Schema
- Handling tool use response blocks
- Running tool functions and returning results
- Multi-turn tool conversations
- Batch tool use
- Structured data extraction via tools
- The text editor tool

### RAG Pipeline
- Text chunking strategies
- Text embeddings for semantic search
- BM25 lexical search
- Multi-index/multi-search RAG pipelines
- Reranking results for relevance
- Contextual retrieval techniques

### Advanced Claude Features
- Extended thinking for complex reasoning
- Image/vision support
- PDF document processing
- Citations
- Prompt caching (rules, implementation, cost savings)

### Model Context Protocol (MCP)
- MCP architecture (servers and clients)
- Defining tools, resources, and prompts in MCP
- Server inspector for debugging
- Client implementation

### Agents & Automation
- Claude Code setup and usage
- Enhancing Claude Code with MCP servers
- Parallelizing Claude Code tasks
- Automated debugging workflows
- Computer Use (UI automation)
- Agent design qualities

---

## Relationship to Other Courses

This course shares approximately 70% content overlap with "Building with the Claude API" - the core difference is that every example uses the AWS SDK (boto3) instead of the direct Anthropic SDK. The course is recommended when deploying specifically to AWS infrastructure.

## Notes

- Individual lesson content is behind Skilljar authentication (requires free enrollment)
- Course content is delivered as video lessons, interactive exercises, and quizzes
- The GitHub repository at https://github.com/anthropics/courses contains related Jupyter notebooks for some modules (prompt engineering, tool use, evaluations) with Bedrock-specific versions
