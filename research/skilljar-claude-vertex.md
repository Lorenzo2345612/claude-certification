# Claude with Google Cloud's Vertex AI - Skilljar Course Research

**Course URL:** https://anthropic.skilljar.com/claude-with-google-vertex
**Platform:** Anthropic Academy (Skilljar)
**Registration:** https://anthropic.skilljar.com/checkout/3j69dgl9s5q86
**Cost:** Free
**Estimated Lessons:** ~85+ individual lessons across 11 modules

## Course Overview

Comprehensive technical training on integrating and deploying Claude AI models through Google Cloud's Vertex AI. Covers the full spectrum of working with Anthropic models through Google Cloud's Vertex AI, from API access to advanced implementation patterns. Every code example uses the GCP SDK. The curriculum covers the complete deployment workflow from initial setup through production operation: model configuration within the Vertex AI environment, API management within Google Cloud's infrastructure, and governance and access control frameworks appropriate for enterprise-scale Claude deployments.

## Prerequisites

- Python programming proficiency
- Google Cloud Platform experience
- JSON data structure knowledge

## Target Audience

Backend developers, full-stack engineers, ML engineers, DevOps professionals, technical architects, and those transitioning from competing LLM platforms.

## Learning Objectives

- Set up and configure Claude models through Google Cloud's Vertex AI
- Implement multi-turn conversations with proper context management
- Design and evaluate prompts using systematic testing and automated grading
- Apply prompt engineering with XML tags, examples, and output control
- Build tool-use implementations enabling Claude to interact with external functions and APIs
- Develop RAG pipelines using embeddings and retrieval techniques
- Configure advanced capabilities including vision, PDF processing, and prompt caching
- Implement Model Context Protocol (MCP)
- Deploy Claude Code and Computer Use applications
- Design agent-based workflows with parallelization, chaining, and routing patterns

---

## Full Curriculum

### Module 1: Introduction
1. Welcome to the course
2. Anthropic overview
3. Overview of Claude models

### Module 2: Accessing Claude with the API
4. Accessing the API
5. Vertex AI Setup
6. Making a request
7. Multi-turn conversations
8. Chat exercise
9. System prompts
10. System prompts exercise
11. Temperature
12. Course satisfaction survey
13. Response streaming
14. Controlling model output
15. Structured data
16. Structured data exercise
17. Quiz on accessing Claude with the API

**Module Description:** Covers Vertex AI-specific setup and configuration, API requests through GCP infrastructure, multi-turn conversations, system prompts, temperature control, streaming, and structured data generation. Includes a mid-course satisfaction survey.

### Module 3: Prompt Evaluation
18. Prompt evaluation
19. A typical eval workflow
20. Generating test datasets
21. Running the eval
22. Model based grading
23. Code based grading
24. Exercise on prompt evals
25. Quiz on prompt evaluation

**Module Description:** Covers evaluation workflows, test dataset creation, model-based and code-based grading approaches, and iterative prompt improvement methodologies.

### Module 4: Prompt Engineering Techniques
26. Prompt engineering
27. Being clear and direct
28. Being specific
29. Structure with XML tags
30. Providing examples
31. Exercise on prompting
32. Quiz on prompt engineering techniques

**Module Description:** Covers core prompt engineering techniques including clarity, specificity, XML tag structuring, and few-shot example patterns.

### Module 5: Tool Use with Claude
33. Introducing tool use
34. Project overview
35. Tool functions
36. Tool schemas
37. Handling message blocks
38. Sending tool results
39. Multi-turn conversations with tools
40. Implementing multiple turns
41. Using multiple tools
42. The batch tool
43. Tools for structured data
44. The text edit tool
45. The web search tool
46. Quiz on tool use with Claude

**Module Description:** Covers tool use fundamentals, defining tool schemas, handling message blocks, multi-turn tool conversations, batch tool processing, structured data extraction, the text editor tool, and the web search tool. Note: this module includes "The web search tool" which is unique to this course (not in the Bedrock version).

### Module 6: Retrieval Augmented Generation
47. Introducing RAG
48. Text chunking strategies
49. Text embeddings
50. The full RAG flow
51. Implementing the RAG flow
52. BM25 lexical search
53. A Multi-index RAG pipeline
54. Reranking results
55. Contextual retrieval
56. Quiz on RAG

**Module Description:** Covers text chunking, embeddings, the complete RAG flow, BM25 lexical search, multi-index RAG pipelines, reranking, and contextual retrieval techniques.

### Module 7: Features of Claude
57. Extended thinking
58. Image support
59. PDF support
60. Citations
61. Prompt caching
62. Rules of prompt caching
63. Prompt caching in action
64. Quiz on features of Claude

**Module Description:** Covers extended thinking for complex reasoning, image/vision support, PDF processing, citations, and prompt caching (rules and implementation).

### Module 8: Model Context Protocol
65. Introducing MCP
66. MCP clients
67. Project setup
68. Defining tools with MCP
69. The server inspector
70. Implementing a client
71. Defining resources
72. Accessing resources
73. Defining prompts
74. Prompts in the client
75. MCP review
76. Quiz on Model Context Protocol

**Module Description:** Covers MCP architecture, building MCP servers and clients, defining tools/resources/prompts, the server inspector, and comprehensive MCP review.

### Module 9: Anthropic Apps - Claude Code and Computer Use
77. Anthropic apps
78. Claude Code setup
79. Claude Code in action
80. Enhancements with MCP servers
81. Parallelizing Claude Code
82. Automated debugging
83. Computer use
84. How computer use works

**Module Description:** Covers Claude Code setup, usage, MCP server enhancements, parallelizing tasks, automated debugging workflows, and Computer Use for UI automation. Note: this is a separate module from Agents (unlike the Bedrock course which combines them).

### Module 10: Agents and Workflows
85. Agents and workflows
86. Parallelization workflows
87. Chaining workflows
88. Routing workflows
89. Agents and tools
90. Environment inspection
91. Workflows vs agents
92. Quiz on agents and workflows

**Module Description:** Covers agent-based workflow design patterns including parallelization, chaining, and routing. Discusses the distinction between workflows and agents, agent-tool integration, and environment inspection. Note: this module is UNIQUE to the Vertex AI course - the Bedrock course does not have a separate agents/workflows module with these design patterns.

### Module 11: Final Assessment
93. Final assessment quiz
94. Course Wrap Up

**Module Description:** Comprehensive evaluation covering all course material, followed by key concept review and future directions.

---

## Key Technical Topics Covered

### API Integration (Vertex AI-Specific)
- Using GCP SDK for all API calls
- Vertex AI-specific setup and configuration
- Making requests through Google Cloud's Vertex AI infrastructure
- Streaming responses via Vertex AI
- Integration with Google Cloud data and analytics services

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
- Defining tool schemas
- Handling message blocks in tool responses
- Multi-turn tool conversations
- Implementing multiple conversation turns
- Using multiple tools simultaneously
- Batch tool processing
- Structured data extraction via tools
- The text editor tool
- The web search tool (unique to Vertex course)

### RAG Pipeline
- Text chunking strategies
- Text embeddings for semantic search
- BM25 lexical search
- Multi-index RAG pipelines
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

### Anthropic Apps
- Claude Code setup and usage
- Enhancing Claude Code with MCP servers
- Parallelizing Claude Code tasks
- Automated debugging workflows
- Computer Use (UI automation)

### Agent Workflow Design Patterns (Unique to Vertex Course)
- Parallelization workflows
- Chaining workflows
- Routing workflows
- Agents and tools integration
- Environment inspection
- Workflows vs agents distinction

---

## Key Differences from Bedrock Course

1. **SDK:** Uses GCP SDK instead of AWS SDK (boto3)
2. **Setup:** Includes "Vertex AI Setup" lesson specific to GCP configuration
3. **Tool Use:** Includes additional lessons: "Project overview", "Implementing multiple turns", and "The web search tool"
4. **Agents Module:** Has a dedicated "Agents and Workflows" module covering parallelization, chaining, and routing design patterns (Bedrock course lacks this separate module)
5. **Anthropic Apps:** Separated into its own module (Bedrock course combines apps + agents)
6. **Course Satisfaction Survey:** Included as a lesson in Module 2
7. **Introduction:** Includes an "Anthropic overview" lesson not in Bedrock version

## Relationship to Other Courses

This course shares approximately 70% content overlap with "Building with the Claude API" - the core difference is that every example uses the GCP SDK instead of the direct Anthropic SDK. The course is recommended when deploying specifically to Google Cloud infrastructure.

## Notes

- Individual lesson content is behind Skilljar authentication (requires free enrollment)
- Course content is delivered as video lessons, interactive exercises, and quizzes
- The GitHub repository at https://github.com/anthropics/courses contains related Jupyter notebooks for some modules with Google Vertex-specific versions
