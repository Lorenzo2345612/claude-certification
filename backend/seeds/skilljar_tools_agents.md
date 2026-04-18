# Skilljar Course: Building with the Claude API
## Tool Use and Agents/Workflows Sections - Testable Facts

---

### Lesson: Introducing tool use
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287747

- Tools allow Claude to access information from the outside world, extending its capabilities beyond what it learned during training
- By default, Claude only knows information from its training data and cannot access current events, real-time data, or external systems
- Tool use follows a specific back-and-forth pattern between your application and Claude with 4 steps:
  1. **Initial Request**: You send Claude a question along with instructions on how to get extra data from external sources
  2. **Tool Request**: Claude analyzes the question and decides it needs additional information, then asks for specific details
  3. **Data Retrieval**: Your server runs code to fetch the requested information from external APIs or databases
  4. **Final Response**: You send the retrieved data back to Claude, which generates a complete response using both the original question and the fresh data
- Key benefits: Real-time Information, External System Integration, Dynamic Responses, Structured Interaction
- Tool use transforms Claude from a static knowledge base into a dynamic assistant that can work with live data

---

### Lesson: Tool functions
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287756

- A tool function is a plain Python function that gets executed automatically when Claude decides it needs extra information
- Best practices for tool functions:
  - **Use descriptive names**: Both function name and parameter names should clearly indicate their purpose
  - **Validate inputs**: Check that required parameters are not empty or invalid, and raise errors when they are
  - **Provide meaningful error messages**: Claude can see error messages and might retry the function call with corrected parameters
- Validation is important because Claude learns from errors. If you raise a clear error like "Location cannot be empty", Claude might retry the function call with corrected parameters
- Best practice: Default parameter values should be provided (e.g., `date_format="%Y-%m-%d %H:%M:%S"`)
- Creating the function is just the first step. Next you need to write a JSON schema that describes the function to Claude

---

### Lesson: Tool schemas
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287753

- JSON Schema is a widely-used data validation specification (not specific to AI or tool calling)
- The complete tool specification has three main parts:
  1. **name** - A clear, descriptive name for your tool (like "get_weather")
  2. **description** - What the tool does, when to use it, and what it returns
  3. **input_schema** - The actual JSON schema describing the function's arguments
- Best practice for writing tool descriptions:
  - Aim for 3-4 sentences explaining what the tool does
  - Describe when Claude should use it
  - Explain what kind of data it returns
  - Provide detailed descriptions for each argument
- You can use Claude itself to generate JSON schemas for your tool functions
- Best practice: Use the naming pattern `function_name` followed by `function_name_schema` to keep schemas organized
- For better type checking, import and use the `ToolParam` type from the Anthropic library: `from anthropic.types import ToolParam`
- Using ToolParam prevents type errors when using the schema with Claude's API

---

### Lesson: Handling message blocks
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287757

- To enable Claude to use tools, include a `tools` parameter in your API call that takes a list of JSON schemas
- When Claude decides to use a tool, it returns an assistant message with **multiple blocks** in the content list (not just text)
- A multi-block message typically contains:
  1. **Text Block** - Human-readable text explaining what Claude is doing
  2. **ToolUse Block** - Instructions for which tool to call and what parameters to use
- The ToolUse block includes: an ID for tracking, the name of the function, input parameters as a dictionary, and the type "tool_use"
- Claude does NOT store conversation history - you must manage it manually
- When working with tool responses, you must preserve the **entire content structure** including all blocks
- Properly append multi-block assistant message: `messages.append({"role": "assistant", "content": response.content})`
- The complete tool usage flow:
  1. Send user message with tool schema to Claude
  2. Receive assistant message with text block and tool use block
  3. Extract tool information and execute the actual function
  4. Send tool result back to Claude along with complete conversation history
  5. Receive final response from Claude

---

### Lesson: Sending tool results
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752

- Use Python's unpacking syntax to pass tool arguments: `get_current_datetime(**response.content[1].input)`
- Tool result block goes inside a **user message** and has these properties:
  - **tool_use_id** - Must match the id of the ToolUse block that this result corresponds to
  - **content** - Output from running your tool, serialized as a string
  - **is_error** - True if an error occurred
- Claude can request **multiple tool calls in a single response**
- Each tool call gets a unique ID, and you must match these IDs when sending back results
- The follow-up request must still include the tool schema even though you are not expecting Claude to make another tool call - Claude needs the schema to understand tool references in conversation history
- Complete message history for tool use contains: Original user message -> Assistant message with tool use block -> User message with tool result block

---

### Lesson: Multi-turn conversations with tools
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287750

- Claude may need to call multiple tools in sequence to answer a single question (e.g., get current date, then add duration)
- Build a conversation loop that continues until Claude stops requesting tools
- Refactored helper functions should handle different message formats (string, list of blocks, or complete message objects)
- Use `isinstance(message, Message)` to check if it's a full message object from the Anthropic SDK
- Chat function should accept a list of tools and return the full message (not just text)
- Text extraction helper: filter for text blocks and join them: `[block.text for block in message.content if block.type == "text"]`
- Key improvements needed for multi-turn: flexible message handling, tool support in chat, full message returns, text extraction utility

---

### Lesson: Implementing multiple turns
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287758

- The key to knowing whether Claude wants to use a tool is the **stop_reason** field: when set to **"tool_use"**, Claude needs to call a tool
- Conversation loop pattern: `while True` -> call Claude -> check `response.stop_reason != "tool_use"` -> break if done, otherwise process tools
- Claude can request multiple tools in a single response - filter for tool use blocks: `[block for block in message.content if block.type == "tool_use"]`
- Each tool use block must be answered with a corresponding tool result block, connected through matching IDs
- Tool result block structure: `{"type": "tool_result", "tool_use_id": tool_request.id, "content": json.dumps(tool_output), "is_error": False}`
- Error handling: When a tool fails, still provide a result block to Claude with `is_error: True` and the error message as content
- Best practice: Create a routing function that maps tool names to implementations for scalability
- Anti-pattern: Not handling errors in tool execution - always wrap in try/except and return error results to Claude

---

### Lesson: Fine grained tool calling
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/313160

- When combining tool use with streaming, Claude sends `InputJsonEvent` events with two properties:
  - **partial_json** - A chunk of JSON representing part of the tool arguments
  - **snapshot** - The cumulative JSON built up from all chunks received so far
- The Anthropic API buffers chunks and validates them before sending - it waits for **complete top-level key-value pairs** before sending
- This validation explains delays followed by bursts of text even with streaming enabled
- **Fine-grained tool calling** disables JSON validation on the API side:
  - You get chunks as soon as Claude generates them
  - No buffering delays between top-level keys
  - **Critical**: JSON validation is disabled - your code must handle invalid JSON
- Enable with `fine_grained=True` in the API call
- Without fine-grained, the API validation catches errors and may wrap problematic values in strings
- With fine-grained, Claude might generate invalid JSON like `"word_count": undefined`
- When to use fine-grained tool calling:
  - Need to show users real-time progress on tool argument generation
  - Want to start processing partial tool results as quickly as possible
  - Comfortable implementing robust JSON error handling
- Anti-pattern: Using fine-grained tool calling without implementing JSON error handling
- For most applications, the default behavior with validation is perfectly adequate

---

### Lesson: The text edit tool
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287760

- Claude has one **built-in tool**: the text editor tool (you don't need to create it from scratch)
- The text editor tool capabilities: view file/directory contents, view specific line ranges, replace text, create new files, insert text at specific lines, undo recent edits
- Important distinction: While the tool **schema is built into Claude**, you still need to provide the **actual implementation** (the code that performs file operations)
- Schema versions depend on the Claude model:
  - Claude 3.7 Sonnet: `"type": "text_editor_20250124"`, `"name": "str_replace_editor"`
  - Claude 3.5 Sonnet: `"type": "text_editor_20241022"`, `"name": "str_replace_editor"`
- Tool version strings for all model versions: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/text-editor-tool
- Claude sees the small schema stub and automatically expands it into the full text editor tool specification
- The text editor tool lets you replicate AI-powered code editor functionality within your own applications

---

### Lesson: The web search tool
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287755

- **Important**: Your organization must enable the Web Search tool in the settings console before using it: https://console.anthropic.com/settings/privacy
- Web search tool schema: `{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}`
- The **max_uses** field limits how many searches Claude can perform (Claude may do follow-up searches)
- A single search returns multiple results, but Claude may decide additional searches are needed
- Response contains several block types:
  - **Text blocks** - Claude's explanation
  - **ServerToolUseBlock** - The exact search query Claude used
  - **WebSearchToolResultBlock** - Search results container
  - **WebSearchResultBlock** - Individual results with titles and URLs
  - **Citation blocks** - Text supporting Claude's statements with source URLs
- You can restrict search domains using the **allowed_domains** field (e.g., `"allowed_domains": ["nih.gov"]`)
- Best use cases: current events, specialized information not in training data, fact-checking, research requiring up-to-date info
- Claude automatically decides when a web search would help answer a question

---

### Lesson: Agents and workflows
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287796

- Workflows and agents are strategies for handling tasks that cannot be completed in a single request
- **Use workflows** when you can picture the exact flow or steps, or when your app's UX constrains users to a set of tasks
- **Use agents** when you're not sure exactly what task or parameters you'll give to Claude
- Workflows = series of calls to Claude meant to solve a specific problem through a predetermined series of steps
- Agents = give Claude a goal and a set of tools, expecting Claude to figure out how to complete it
- Example workflow pattern: Image to CAD (describe object -> model with CadQuery -> render -> grade rendering against original)
- **Evaluator-Optimizer pattern**: Producer creates output -> Grader evaluates against criteria -> Feedback loop if not accepted -> Iteration until accepted
- The goal of identifying workflow patterns is to give you a set of repeatable recipes for implementing features

---

### Lesson: Parallelization workflows
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287804

- Anti-pattern: Cramming everything into one massive prompt makes Claude juggle multiple considerations simultaneously, leading to confusion and suboptimal results
- Parallelization pattern: Split a task into multiple parallel requests, each focused on evaluating one aspect with specialized criteria
- Pattern structure:
  1. Split a single task into multiple sub-tasks
  2. Run the sub-tasks in parallel
  3. Aggregate the results together
- The parallelized sub-tasks do NOT need to be identical - each can have a specialized prompt, set of tools, or evaluation criteria
- Benefits:
  - **Focused attention**: Claude concentrates on one specific aspect at a time
  - **Easier optimization**: Improve and test prompts for each evaluation independently
  - **Better scalability**: Adding new evaluations is straightforward without rewriting existing prompts
  - **Improved reliability**: Reduces cognitive load on the AI model
- Use parallelization when you have a complex decision that can be broken down into independent evaluations

---

### Lesson: Chaining workflows
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287800

- Chaining breaks down a large, complex task into smaller, sequential subtasks
- Key benefit: **focus** - when you give Claude one specific task at a time, it concentrates on doing that task well
- Advantages: split large tasks into smaller non-parallelizable subtasks, optionally do non-LLM processing between tasks, keep Claude focused
- **The Long Prompt Problem**: Even with constraints clearly stated, Claude might still violate some rules (e.g., using emojis despite being told not to)
- **Chaining solution for the long prompt problem**: Step 1 - generate initial content, Step 2 - make a follow-up request focused specifically on fixing constraint violations
- Chaining is especially useful when:
  - Complex tasks with multiple requirements
  - Claude consistently ignores some constraints in long prompts
  - Need to process or validate outputs between steps
  - Want to keep each interaction focused and manageable
- Anti-pattern: Trying to cram everything into a single prompt when Claude consistently fails to follow all constraints

---

### Lesson: Routing workflows
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287801

- Routing categorizes incoming requests and routes them to specialized processing pipelines
- Anti-pattern: Using a one-size-fits-all prompt for different types of requests
- Routing process happens in two steps:
  1. **Categorization** - Send user's topic to Claude to categorize it into predefined genres
  2. **Specialized Processing** - Use the category to select the appropriate prompt template
- Architecture: User input -> Router (Claude call) -> One specific processing pipeline (not all of them)
- Key insight: User input only goes to **one** specialized pipeline, not all of them
- Each pipeline can have its own workflow, prompts, or tools optimized for that category
- Use routing when:
  - Application handles diverse request types needing different approaches
  - Categories can be clearly defined
  - Categorization can be handled reliably by Claude
  - Performance benefit outweighs routing step overhead

---

### Lesson: Agents and tools
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287803

- Agents shine when you don't know what steps are needed - give Claude a goal and a set of tools, let it figure out how to combine them
- Agents offer flexibility but come with trade-offs in **reliability and cost**
- Simple tools can be chained by Claude to handle surprisingly complex requests
- Claude can recognize when it needs more information and ask users for clarification
- **Best practice: Tools should be abstract, not hyper-specialized**
- Claude Code example of abstract tools: bash, read, write, edit, glob, grep (not "refactor code" or "install dependencies")
- Claude Code does NOT have specialized tools - it figures out how to use basic tools to accomplish complex tasks
- **Best practice: Provide combinable tools** that Claude can combine in creative ways
- Example combinable tool set for video: bash (FFMPEG), generate_image, text_to_speech, post_media
- Anti-pattern: Creating hyper-specialized tools instead of abstract, combinable ones

---

### Lesson: Environment inspection
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287798

- Claude operates **blindly** - it needs to be able to observe and understand the results of its actions
- In computer use, every action results in a **screenshot** so Claude can understand what happened
- **Best practice: Read before writing** - Before Claude modifies any file, it needs to understand the current contents
- System prompts can guide Claude to inspect its environment (e.g., use whisper.cpp to verify dialogue placement, use FFmpeg to extract screenshots)
- Benefits of environment inspection:
  - **Better progress tracking** - Claude can gauge completion status
  - **Error handling** - Unexpected results can be detected and corrected
  - **Quality assurance** - Output verified before task is complete
  - **Adaptive behavior** - Claude adjusts approach based on observations
- Key design question: "How will Claude know if this action worked?"
- Implementation approaches: reading files before modifications, taking screenshots after UI interactions, checking API responses, validating generated content
- Anti-pattern: Having agents execute commands without observing results (blind execution)

---

### Lesson: Workflows vs agents
URL: https://anthropic.skilljar.com/claude-with-the-anthropic-api/287794

- **Workflows**: Predefined series of calls to Claude designed to solve a known problem with exact steps known ahead of time
- **Agents**: Claude gets basic tools and formulates its own plan - more adaptive, don't know exact tasks in advance
- Benefits of workflows:
  - Claude can focus on one subtask at a time -> higher accuracy
  - Far easier to evaluate and test (each step is known)
  - More predictable and reliable execution
  - Better for specific, well-defined problems
- Benefits of agents:
  - More flexible user experience
  - Far more flexible task completion (unexpected tool combinations)
  - Handle novel situations not anticipated during development
  - Can ask users for additional input
- Downsides of workflows: less flexible, constrained UX, more upfront planning
- Downsides of agents: **lower successful task completion rate**, more challenging to test/evaluate, less predictable behavior
- **Key recommendation: Always focus on implementing workflows where possible, and only resort to agents when truly required**
- Anti-pattern: Building a fancy agent when a workflow would provide more reliable results
- Best practice: Users want a product that works consistently - reliability over flexibility
