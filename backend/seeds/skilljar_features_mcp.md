# Skilljar Lessons: Features of Claude, MCP, RAG, and Prompt Evaluation
## Extracted testable facts for CCA exam preparation

---

## FEATURES OF CLAUDE

### Lesson: Extended Thinking
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287773
- Extended thinking is Claude's advanced reasoning feature that gives the model time to work through complex problems before generating a final response; think of it as Claude's "scratch paper"
- When extended thinking is enabled, Claude's response changes from a simple text block to a structured response containing two parts: the reasoning process (thinking) and the final answer
- Key benefits: better reasoning capabilities for complex tasks, increased accuracy on difficult problems, transparency into Claude's thought process
- Key trade-offs: higher costs (you pay for thinking tokens), increased latency (thinking takes time), more complex response handling in your code
- When to use: run prompts without thinking first; if accuracy isn't meeting requirements after prompt optimization, then enable extended thinking
- Extended thinking responses include a cryptographic signature system for security that ensures thinking text hasn't been tampered with
- Redacted thinking blocks appear when Claude's thinking process gets flagged by internal safety systems; the redacted content is encrypted but can be passed back in future conversations
- To enable extended thinking, add `thinking=True` and `thinking_budget=1024` parameters
- The thinking budget sets the maximum tokens Claude can use for reasoning; the minimum value is 1024 tokens
- `max_tokens` must be greater than `thinking_budget`
- The thinking configuration uses: `params["thinking"] = {"type": "enabled", "budget": thinking_budget}`
- Extended Thinking is NOT compatible with message pre-filling and temperature (see full restrictions in docs)
- You can force Claude to return a redacted thinking block by sending a special trigger string (useful for testing)

### Lesson: Citations
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287771
- Citations let Claude reference specific parts of source documents and show users exactly where each piece of information comes from
- To enable citations, add `"citations": {"enabled": True}` and a `"title"` field to your document block
- When citations are enabled, Claude's response becomes structured data with citation information for each claim
- Each citation contains: `cited_text` (exact text from document), `document_index` (which document), `document_title`, `start_page_number`, `end_page_number`
- Citations work with both PDFs and plain text sources
- With plain text sources, instead of page numbers, you get character positions that pinpoint where Claude found each piece of information
- Document block for PDF citations uses `"source": {"type": "base64", "media_type": "application/pdf", "data": file_bytes}`
- Document block for text citations uses `"source": {"type": "text", "media_type": "text/plain", "data": article_text}`
- Citations are valuable when: users need to verify information, working with authoritative documents, transparency about information sources is critical

### Lesson: Prompt Caching
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287772
- Prompt caching speeds up Claude's responses and reduces cost by reusing computational work from previous requests
- Without caching, Claude tokenizes the prompt, creates embeddings, adds context, generates output, then discards all preprocessing work
- With caching, Claude saves the preprocessing work in a cache instead of discarding it; acts like a lookup table
- Key benefits: faster responses, lower costs for cached portions, automatic optimization (initial request writes cache, follow-ups read from it)
- Key limitations: cache duration is only ONE HOUR; only beneficial when repeatedly sending the same content; most effective at high frequency
- Best use cases: document analysis workflows (multiple questions about same large document), iterative editing tasks where base content remains constant

### Lesson: Rules of Prompt Caching
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287770
- Caching is NOT enabled automatically; you must manually add cache breakpoints to specific blocks in your messages
- Everything before the breakpoint will be cached; cache is only used if content up to and including the breakpoint is IDENTICAL on follow-up requests
- To add a cache breakpoint, use the longhand form for text blocks with `cache_control: {"type": "ephemeral"}`
- The shorthand text format does NOT support cache control; you must use the expanded format
- Even small changes (like adding the word "please") will invalidate the cache and force reprocessing
- Cache breakpoints can span across multiple messages and message types (user, assistant, etc.)
- Cache breakpoints can be added to: system prompts, tool definitions, image blocks, tool use and tool result blocks
- System prompts and tool definitions are excellent candidates for caching since they rarely change between requests
- Processing order: tools first, then system prompt, then messages
- Maximum of FOUR cache breakpoints total
- Minimum content length for caching: at least 1024 TOKENS (sum of all messages and blocks being cached, not individual blocks)

### Lesson: Prompt Caching in Action
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287774
- To cache tool schemas, add cache_control to the LAST tool in your list; create copies of both the tools list and the last tool before adding cache_control
- For system prompt caching, convert the system prompt from a simple string into a structured format: `[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}]`
- First request shows `cache_creation_input_tokens` (writing to cache); follow-up requests show `cache_read_input_tokens` (reading from cache)
- The cache is extremely sensitive: changing even a SINGLE CHARACTER in tools or system prompt invalidates the entire cache for that component
- If you change your system prompt but keep the same tools, you get a partial cache read (for tools) and a cache write (for the new system prompt)
- Cache only lasts for one hour; designed for applications with relatively frequent API usage

### Lesson: Code Execution and the Files API
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287777
- The Files API provides an alternative to encoding files as base64 in messages; upload files ahead of time and reference them by file ID later
- Files API workflow: upload file via separate API call, receive file metadata with unique file ID, reference that file ID in future messages
- Code Execution is a server-based tool; you include a predefined tool schema and Claude can execute Python code in an isolated Docker container
- Code execution environment: runs in isolated Docker container, NO network access, Claude can execute code multiple times during a single conversation
- The tool schema for code execution is: `{"type": "code_execution_20250522", "name": "code_execution"}`
- To get data into the Docker container, use a `"container_upload"` block with the file ID from Files API
- Claude's code execution response contains: text blocks, server tool use blocks (code Claude ran), code execution tool result blocks (output)
- Generated files (like plots) can be downloaded using the Files API; look for blocks with `type: "code_execution_output"` containing file IDs
- Use cases beyond data analysis: image processing, document parsing, mathematical computations, report generation

---

## MODEL CONTEXT PROTOCOL (MCP)

### Lesson: Introducing MCP
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287780
- MCP (Model Context Protocol) is a communication layer that provides Claude with context and tools without requiring you to write integration code
- Architecture: MCP Client (your server) connects to MCP Servers that contain tools, prompts, and resources; each MCP server acts as an interface to an outside service
- MCP shifts the burden of tool definitions and execution from your server to MCP servers
- Anyone can create an MCP server implementation; often service providers themselves create official MCP implementations
- MCP is NOT just tool use; they are complementary but different concepts; MCP is about WHO does the work of creating and maintaining the tools
- MCP servers provide tool schemas and functions ALREADY DEFINED for you, eliminating the need to build and maintain complex integrations yourself
- Key difference from direct API calls: if you call an API directly, you author tool definitions yourself; MCP servers provide them pre-built

### Lesson: MCP Clients
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287775
- The MCP client serves as the communication bridge between your server and MCP servers; it's your access point to all tools an MCP server provides
- MCP is transport agnostic: client and server can communicate using different methods (standard input/output, HTTP, WebSockets, other network protocols)
- Most common setup: MCP client and server on same machine, communicating through standard input/output (stdio)
- Key message types: ListToolsRequest/ListToolsResult (what tools are available?), CallToolRequest/CallToolResult (execute a specific tool)
- Complete flow: User query -> Server asks MCP client for tools -> ListToolsRequest to MCP server -> Server sends query + tools to Claude -> Claude responds with tool_use -> Server asks MCP client to execute -> CallToolRequest to MCP server -> MCP server calls external service -> Results flow back -> Server sends tool results to Claude -> Claude formulates final response

### Lesson: Defining Tools with MCP
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287797
- The Python MCP SDK (FastMCP) simplifies server creation: `from mcp.server.fastmcp import FastMCP; mcp = FastMCP("ServerName", log_level="ERROR")`
- Tools are defined using the `@mcp.tool()` decorator with name and description parameters
- The SDK automatically generates JSON schemas from Python type hints and Pydantic Field descriptions
- Use `Field(description="...")` from Pydantic to provide parameter descriptions that help Claude understand arguments
- Error handling: tools should raise ValueError with descriptive messages that Claude can understand and act upon
- Key benefits of SDK approach: automatic JSON schema generation, clean readable code, built-in parameter validation through Pydantic, reduced boilerplate, type safety

### Lesson: Defining Resources
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287782
- Resources in MCP expose data to clients, similar to GET request handlers in HTTP servers; they fetch information rather than perform actions
- Two types of resources: Direct Resources (static URIs like `docs://documents`) and Templated Resources (URIs with parameters like `docs://documents/{doc_id}`)
- Resources are defined using the `@mcp.resource()` decorator with a URI pattern and optional mime_type
- For templated resources, the SDK automatically parses parameters from the URI and passes them as keyword arguments
- MIME types give clients hints about data format: `application/json` for structured data, `text/plain` for plain text
- The SDK handles serialization automatically; you don't need to manually convert to JSON strings
- Test resources using the MCP Inspector: `uv run mcp dev mcp_server.py`
- Key distinction: Resources expose data, Tools perform actions

### Lesson: Accessing Resources
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287783
- Resources can be directly included in prompts rather than requiring tool calls to access information
- Client-side implementation uses `read_resource(uri)` which returns a contents list; typically only the first element is needed
- Handle different content types based on MIME type: parse JSON for `application/json`, return raw text for others
- Required imports: `json` module and `AnyUrl` from Pydantic
- Resources enable features like document mentions (user types @document_name), autocomplete for available documents, automatic content injection into prompts
- Key advantage: Claude receives document content directly in the prompt, eliminating the need for tool calls

### Lesson: Defining Prompts
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287784
- Prompts in MCP servers define pre-built, high-quality instructions that clients can use instead of writing their own
- Prompts give more consistent and higher-quality results than ad-hoc user prompts because they are carefully developed and tested
- Define prompts using `@mcp.prompt()` decorator with name and description
- Prompts return a list of `base.Message` objects (import from `mcp.server.fastmcp.base`)
- Prompt functions can accept parameters using Pydantic Field descriptors
- Best practices: focus on tasks central to server's purpose, write detailed/specific instructions, test thoroughly, include clear descriptions
- Test prompts using the MCP Inspector in the Prompts section

### Lesson: MCP Review
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287790
- This lesson is video-only (4:12 duration) with no text content; summarizes the MCP section concepts

---

## RAG AND AGENTIC SEARCH

### Lesson: Introducing RAG
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287763
- RAG (Retrieval Augmented Generation) helps work with large documents too big to fit in a single prompt
- Instead of cramming everything into one prompt, RAG breaks documents into chunks and includes only the most relevant pieces
- Option 1 (stuffing everything): has hard limit on prompt length, Claude less effective with very long prompts, costs more, takes longer
- Option 2 (RAG): break document into chunks during preprocessing, then at query time find and include only relevant chunks
- RAG benefits: Claude focuses on relevant content, scales to very large documents, works with multiple documents, smaller prompts cost less and run faster
- RAG challenges: requires preprocessing step, needs a search mechanism, included chunks might miss context, many chunking approaches to choose from
- RAG trades simplicity for scalability and efficiency; requires more upfront work but enables working with document collections

### Lesson: Text Chunking Strategies
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287776
- Text chunking is one of the MOST CRITICAL steps in RAG; poor chunking leads to irrelevant context and wrong answers
- Three main chunking approaches: size-based, structure-based, and semantic-based
- Size-based chunking: simplest approach, divides text into equal-length strings; downsides are words cut mid-sentence, lost context, headers separated from content; fix with OVERLAP between chunks
- Structure-based chunking: divides based on document structure (headers, paragraphs, sections); gives cleanest most meaningful chunks; only works when you have structural guarantees (like Markdown)
- Semantic-based chunking: most sophisticated; divides into sentences, uses NLP to determine relatedness, groups related sentences; computationally expensive
- Sentence-based chunking: practical middle ground; split text into sentences using regex, group them with optional overlap
- Strategy selection: structure-based for controlled formatting, sentence-based as good middle ground, size-based as reliable fallback for any content type including code
- Size-based chunking with overlap is often the go-to choice in PRODUCTION because it's simple, reliable, and works with any document type

### Lesson: The Full RAG Flow
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287764
- Complete RAG pipeline has 6 steps: chunk source text, generate embeddings, store in vector database, process user query, find similar embeddings, create final prompt
- Text embeddings are numerical representations (lists of floating-point numbers) of text meaning; each number ranges from -1 to +1
- Embedding API typically performs normalization: scales each vector to have a magnitude of 1.0
- Steps 1-3 (chunking, embedding, storing) are preprocessing done ahead of time BEFORE any user query
- Steps 4-6 happen at query time: embed user query with same model, find similar embeddings in vector DB, combine user question with relevant chunk and send to Claude
- Vector database: specialized database optimized for storing, comparing, and searching through embeddings
- Cosine similarity measures similarity between embeddings: ranges from -1 to 1; close to 1 = high similarity; 0 = no relationship; close to -1 = very different
- Cosine distance = (1 - cosine similarity); values close to 0 mean HIGH similarity
- Anthropic does NOT currently provide embedding generation; recommended provider is VoyageAI (model: voyage-3-large)

---

## PROMPT EVALUATION

### Lesson: Prompt Evaluation
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287731
- Prompt engineering provides techniques for writing better prompts; prompt evaluation measures how well those prompts actually work through automated testing
- Three paths after writing a prompt: (1) test once and ship (risky), (2) test a few times and tweak (better but still risky), (3) run through an evaluation pipeline to score objectively (best approach)
- Options 1 and 2 are "common traps" that all engineers fall into; users will interact with prompts in ways you never anticipated
- The evaluation-first approach provides objective metrics, identifies weaknesses before production, enables comparing prompt versions objectively
- Prompt evaluation techniques: test against expected answers, compare different prompt versions, review outputs for errors

### Lesson: A Typical Eval Workflow
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287736
- Five key steps in a prompt evaluation workflow: draft a prompt, create an eval dataset, feed through Claude, feed through a grader, change prompt and repeat
- Eval dataset contains sample inputs representing the types of questions/requests your prompt will handle in production
- Datasets can be assembled by hand or generated by Claude; real-world evals might have tens, hundreds, or thousands of records
- Grader evaluates quality of Claude's responses by examining original question and Claude's answer; typically scores 1-10 (10 = perfect)
- Average score across all questions provides an objective measurement for comparing prompt versions
- This systematic approach removes guesswork from prompt engineering; gives confidence that changes are improvements

### Lesson: Model-Based Grading
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287742
- Three types of graders: code graders (programmatic checks), model graders (another AI model evaluates), human graders (manual review)
- Code graders: check output length, verify presence/absence of words, syntax validation (JSON, Python, regex), readability scores; must return a usable signal (usually 1-10)
- Model graders: feed output into another API call for evaluation; assess response quality, instruction following, completeness, helpfulness, safety
- Human graders: most flexibility but time-consuming and tedious; evaluate quality, comprehensiveness, depth, conciseness, relevance
- Before implementing any grader, define clear evaluation criteria (e.g., format, valid syntax, task following)
- Model grader best practice: ask for strengths, weaknesses, and reasoning ALONGSIDE the score; without this context, models tend to default to middling scores around 6
- Use assistant message pre-fill with ````json` and stop_sequences=[````] to get structured JSON output from graders
- Calculate average score across all test cases using `mean()` for objective metrics
- Model graders can be "somewhat capricious" but provide a consistent baseline for measuring improvements
