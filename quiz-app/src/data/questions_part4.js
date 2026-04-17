export const questionsPart4 = [
  // ===== stop_reason (5 questions) =====
  {
    id: 205,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your agent uses web_search (server-executed tool) and you receive a response with stop_reason: 'pause_turn'. What does this mean and what is the correct action?",
    options: [
      { id: "a", text: "The model detected a search error and you need to restart the session from scratch with a new conversation ID.", correct: false },
      { id: "b", text: "The server-side loop reached its iteration limit and the work is not finished. You must re-send the conversation (including the paused response) so the model can continue.", correct: true },
      { id: "c", text: "Claude is waiting for user confirmation before proceeding with the next tool. You must send a user message with 'continue'.", correct: false },
      { id: "d", text: "The API is under heavy load and is asking you to wait 30 seconds before resending the request with a retry header.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "pause_turn indicates that the server-side loop (web_search, code_execution, etc.) reached its iteration limit. The work is not complete; you must re-send the conversation including the paused response so the model can continue where it left off.",
    whyOthersWrong: {
      a: "pause_turn does not indicate an error. It indicates that the server-side loop reached its iteration limit but the model needs to continue. No session restart is required.",
      c: "pause_turn is not a user confirmation mechanism. It is specific to the server-side loop reaching its iteration cap. Simply re-send the complete conversation.",
      d: "pause_turn has no relation to API load or rate limiting. It is a mechanism specific to the server-side loop for tools executed by Anthropic."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — How tool use works",
        quote: "This internal loop has an iteration limit. If the model is still iterating when it hits the cap, the response comes back with stop_reason: \"pause_turn\" instead of \"end_turn\". A paused turn means the work isn't finished; re-send the conversation (including the paused response) to let the model continue where it left off."
      }
  },
  {
    id: 206,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "What are the 6 possible values of stop_reason in the Claude API?",
    options: [
      { id: "a", text: "end_turn, tool_use, max_tokens, stop_sequence, error, timeout", correct: false },
      { id: "b", text: "end_turn, tool_use, max_tokens, stop_sequence, refusal, pause_turn", correct: true },
      { id: "c", text: "end_turn, tool_use, max_tokens, stop_sequence, content_filter, rate_limit", correct: false },
      { id: "d", text: "complete, tool_call, length, stop, refusal, pause", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 6 exact values are: end_turn (final response), tool_use (wants to use tools), max_tokens (limit reached), stop_sequence (stop sequence detected), refusal (model refusal), and pause_turn (server-side loop reached iteration limit).",
    whyOthersWrong: {
      a: "The values 'error' and 'timeout' do not exist as stop_reason values. API errors are handled with HTTP status codes, not stop_reason. The value for refusal is 'refusal' and for server-side pause is 'pause_turn'.",
      c: "'content_filter' and 'rate_limit' do not exist as stop_reason values. Content filters generate 'refusal' and rate limits are HTTP 429 errors, not stop_reasons.",
      d: "These names are from the OpenAI API, not Claude. Claude's values use different snake_case: end_turn (not 'complete'), tool_use (not 'tool_call'), etc."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Multi-turn conversations with tools", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287750" },
      docReference: {
        source: "Anthropic Docs — How tool use works",
        quote: "In practice this reads as: while stop_reason == \"tool_use\", execute the tools and continue the conversation. The loop exits on any other stop reason (\"end_turn\", \"max_tokens\", \"stop_sequence\", or \"refusal\"), which means Claude has either produced a final answer or stopped for another reason that your application should handle."
      }
  },
  {
    id: 207,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "Your moderation agent receives an API response with stop_reason: 'refusal'. A colleague suggests it is the same as end_turn but with an apology message. Is this correct?",
    options: [
      { id: "a", text: "Yes, refusal is simply an end_turn where the text content includes an apology; both end the turn in the same way.", correct: false },
      { id: "b", text: "No, refusal is a distinct stop_reason that explicitly indicates Claude refused the request. Your code must handle it as a separate case, not as a normal end_turn.", correct: true },
      { id: "c", text: "No, refusal only occurs when the system prompt contains contradictory instructions, not when Claude rejects inappropriate content.", correct: false },
      { id: "d", text: "Yes, but only in models prior to Claude Opus. In newer models, refusal was replaced by a separate 'is_refused' field in the response body.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "refusal is a distinct stop_reason independent from end_turn. It indicates that Claude refused to process the request. The agentic loop must have specific handling for this case, separate from the end_turn logic.",
    whyOthersWrong: {
      a: "refusal and end_turn are distinct stop_reason values with different semantics. end_turn means Claude produced a final response; refusal means it rejected the request. Your code needs separate branches.",
      c: "refusal occurs when Claude refuses to generate content that violates its safety policies, not only due to contradictory prompts. It is a general safety mechanism of the model.",
      d: "There is no 'is_refused' field in the Claude API. refusal remains a valid stop_reason value in all current models including Opus."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — How tool use works",
        quote: "The loop exits on any other stop reason (\"end_turn\", \"max_tokens\", \"stop_sequence\", or \"refusal\"), which means Claude has either produced a final answer or stopped for another reason that your application should handle."
      }
  },
  {
    id: 208,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Customer Support Resolution Agent",
    question: "You are designing a robust agentic loop. What is the correct condition to continue the loop and which stop_reason requires special client-side action?",
    options: [
      { id: "a", text: "Continue while stop_reason is 'tool_use' or 'pause_turn'. For pause_turn, re-send the conversation including the paused response.", correct: true },
      { id: "b", text: "Continue while stop_reason is 'tool_use'. For 'max_tokens', automatically increase the limit and resend.", correct: false },
      { id: "c", text: "Continue while stop_reason is not 'end_turn'. All other stop_reasons indicate the model wants to keep working.", correct: false },
      { id: "d", text: "Continue while stop_reason is 'tool_use'. For pause_turn, wait 5 seconds and make a GET request to the API status endpoint.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The standard loop continues with tool_use (execute tools and resend results). Additionally, pause_turn requires re-sending the complete conversation (including the paused response) so the model can continue its server-side work.",
    whyOthersWrong: {
      b: "max_tokens indicates the response reached the configured limit. Automatically increasing the limit is not the correct action; it is a design decision that requires evaluation. Additionally, this option ignores pause_turn.",
      c: "Continuing with any stop_reason except end_turn is dangerous. refusal and stop_sequence do not indicate the model wants to continue; refusal is a rejection and stop_sequence is an intentional cutoff.",
      d: "There is no status endpoint for pause_turn. The correct action is to re-send the complete conversation including the paused response, not to poll."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — How tool use works",
        quote: "A paused turn means the work isn't finished; re-send the conversation (including the paused response) to let the model continue where it left off. In practice this reads as: while stop_reason == \"tool_use\", execute the tools and continue the conversation."
      }
  },
  {
    id: 209,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "What is the key difference between server-executed tools (like web_search) and client-executed tools in relation to the agentic loop?",
    options: [
      { id: "a", text: "Server-executed tools return server_tool_use blocks (already executed) and can generate pause_turn if the server-side loop reaches its limit. You never construct a tool_result for these.", correct: true },
      { id: "b", text: "Server-executed tools require you to construct tool_result blocks just like client-executed tools, but you send them to a different API endpoint.", correct: false },
      { id: "c", text: "Server-executed tools are synchronous and always complete in a single request, while client-executed tools may require multiple turns.", correct: false },
      { id: "d", text: "Server-executed tools do not require you to define them in the tools array; they are automatically enabled when Claude detects it needs them.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Server-executed tools (web_search, web_fetch, code_execution, tool_search) are executed by Anthropic. The response contains server_tool_use blocks that are already executed. You never construct tool_result for them. Their server-side loop has an iteration limit that can generate pause_turn.",
    whyOthersWrong: {
      b: "You never construct tool_result blocks for server-executed tools. Anthropic executes these tools internally and the results are already included in the response you receive.",
      c: "Server-executed tools run their own internal loop that may require multiple iterations. If they reach the limit, you receive pause_turn and must re-send to continue.",
      d: "You must explicitly enable server-executed tools in your request. They are not activated automatically."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — How tool use works",
        quote: "For web_search, web_fetch, code_execution, and tool_search, Anthropic runs the code. You enable the tool in your request and the server handles everything else. You never construct a tool_result block for these tools because the server-side loop executes the operation and feeds the output back to the model before the response reaches you. The response you receive contains server_tool_use blocks showing what ran and what came back, but by the time you see them, execution is already complete."
      }
  },

  // ===== tool_result formatting (5 questions) =====
  {
    id: 210,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your application sends a user message with tool results and you receive a 400 error. The message content is: [{type:'text', text:'Here are the results:'}, {type:'tool_result', tool_use_id:'toolu_01'}]. What is the problem?",
    options: [
      { id: "a", text: "The tool_use_id has an invalid format; it must start with 'tool_' not 'toolu_'.", correct: false },
      { id: "b", text: "The tool_result blocks must go FIRST in the content array. Any text must go AFTER all tool_results. Reversing the order fixes the 400 error.", correct: true },
      { id: "c", text: "You cannot mix text and tool_result blocks in the same user message. You must send them as separate messages.", correct: false },
      { id: "d", text: "The 'content' field inside the tool_result block is missing. A tool_result without content always causes a 400 error.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "In the user message, tool_result blocks must go FIRST in the content array. Placing text before tool_result causes a 400 error. The correct order is: all tool_results first, then any additional text.",
    whyOthersWrong: {
      a: "The 'toolu_' format is the correct prefix used by the Claude API for tool use IDs. It is not the cause of the error.",
      c: "You can mix text and tool_result blocks in the same user message. The rule is the ORDER: tool_results first, text after.",
      d: "A tool_result can omit the content field (empty result). This is valid when the tool does not need to return data, such as a side-effect tool."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      docReference: {
        source: "Anthropic Docs — Handle tool calls",
        quote: "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message. In the user message containing tool results, the tool_result blocks must come FIRST in the content array. Any text must come AFTER all tool results."
      }
  },
  {
    id: 211,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "Your tool returns is_error: true with the message 'Error: Missing required location parameter'. How does Claude react to a tool_result with is_error: true?",
    options: [
      { id: "a", text: "Claude stops the agentic loop immediately and returns the error to the user without attempting to correct it.", correct: false },
      { id: "b", text: "Claude retries 2-3 times with corrections to the parameters before apologizing to the user if it cannot resolve the error.", correct: true },
      { id: "c", text: "Claude ignores the error and continues with the next tool in its plan, treating the result as empty.", correct: false },
      { id: "d", text: "Claude escalates the error to a diagnostic subagent that analyzes the root cause and suggests the correction.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When Claude receives a tool_result with is_error: true, it retries the call 2-3 times with corrections (for example, adding the missing parameter). Only after exhausting retries does it apologize to the user.",
    whyOthersWrong: {
      a: "Claude does not stop the loop immediately upon an error. Its default behavior is to retry 2-3 times with input corrections before giving up.",
      c: "Claude does not ignore tool errors. It actively takes them into account and attempts to correct its inputs to resolve the problem before continuing.",
      d: "There is no automatic escalation mechanism to diagnostic subagents. Claude handles tool errors directly with retries and corrections."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      docReference: {
        source: "Anthropic Docs — Handle tool calls",
        quote: "If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user."
      }
  },
  {
    id: 212,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "What are the valid content types that can be included within a tool_result block in the Claude API?",
    options: [
      { id: "a", text: "Only simple strings and text blocks. Images and documents must be sent as separate user messages.", correct: false },
      { id: "b", text: "Simple strings, text blocks, image blocks (base64), and document blocks.", correct: true },
      { id: "c", text: "Simple strings, text blocks, image blocks, document blocks, audio blocks, and video blocks.", correct: false },
      { id: "d", text: "Only structured JSON. The content must be a valid JSON object that Claude parses automatically.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "tool_result supports 4 content types: direct string ('15 degrees'), text blocks ({type:'text'}), image blocks ({type:'image', source:{type:'base64'}}), and document blocks ({type:'document'}).",
    whyOthersWrong: {
      a: "tool_result supports images and documents directly within the block. You do not need to send them as separate messages; they can go in the tool_result content array.",
      c: "The Claude API does not support audio or video blocks within tool_result. It only supports strings, text, images (base64), and documents.",
      d: "tool_result does not require structured JSON. It can be a simple string or an array of mixed content blocks (text, image, document)."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      docReference: {
        source: "Anthropic Docs — Handle tool calls",
        quote: "content: The result of the tool, as a string (for example, \"content\": \"15 degrees\"), a list of nested content blocks (for example, \"content\": [{\"type\": \"text\", \"text\": \"15 degrees\"}]), or a list of document blocks (for example, \"content\": [{\"type\": \"document\", \"source\": {\"type\": \"text\", \"media_type\": \"text/plain\", \"data\": \"15 degrees\"}}]). These content blocks can use the text, image, or document types."
      }
  },
  {
    id: 213,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your agent executed 3 tools in parallel and you need to send the results. What is the critical restriction on messages between the assistant tool_use and the user tool_result?",
    options: [
      { id: "a", text: "You can insert a system message between the tool_use and tool_result to give the model additional context on how to interpret the results.", correct: false },
      { id: "b", text: "The tool_result blocks must go in a user message immediately after the assistant message with tool_use. There can be no intermediate messages between them.", correct: true },
      { id: "c", text: "You can insert up to 2 intermediate user messages as long as they contain only text and no other tool_results.", correct: false },
      { id: "d", text: "The order does not matter as long as the tool_use_ids match correctly. The API automatically reorders the messages.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The tool_result blocks must immediately follow the assistant message with tool_use. No messages can be included between the assistant's tool_use and the user's tool_result. Additionally, within the user message, tool_results must go first in the content array.",
    whyOthersWrong: {
      a: "You cannot insert messages of any type (including system) between the assistant tool_use and the user tool_result. The API requires them to be consecutive.",
      c: "You cannot insert any intermediate messages, not even text messages. The tool_result must come immediately after the tool_use.",
      d: "The API does NOT automatically reorder messages. The order is strict and violating it causes errors."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      docReference: {
        source: "Anthropic Docs — Handle tool calls",
        quote: "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message."
      }
  },
  {
    id: 214,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Customer Support Resolution Agent",
    question: "According to best practices, how should an error message in a tool_result with is_error: true be written to maximize Claude's recovery capability?",
    options: [
      { id: "a", text: "A generic message like 'Operation failed' is sufficient since Claude infers the error context from the conversation history.", correct: false },
      { id: "b", text: "A numeric error code (e.g., 'E-4032') that Claude maps to its internal knowledge base of common errors.", correct: false },
      { id: "c", text: "An instructive message that describes what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.'", correct: true },
      { id: "d", text: "A complete stack trace of the error so Claude can diagnose the problem at the code level.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Error messages should be instructive: describe what went wrong AND what Claude should try. Instead of 'failed', include actionable context like 'Rate limit exceeded. Retry after 60 seconds.' This allows Claude to make intelligent recovery decisions.",
    whyOthersWrong: {
      a: "A generic 'Operation failed' message does not give Claude enough information to decide between retrying, using different parameters, or reporting to the user. The model needs actionable context.",
      b: "Claude does not have an internal knowledge base of custom error codes. Numeric codes without context do not help the model decide the correct action.",
      d: "A complete stack trace contains unnecessary implementation details and consumes tokens without adding value. Claude needs high-level, actionable information, not code details."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Building with the Claude API", lesson: "Sending tool results", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api/287752" },
      docReference: {
        source: "Anthropic Docs — Handle tool calls",
        quote: "Write instructive error messages. Instead of generic errors like \"failed\", include what went wrong and what Claude should try next, e.g., \"Rate limit exceeded. Retry after 60 seconds.\" This gives Claude the context it needs to recover or adapt without guessing."
      }
  },

  // ===== strict:true (5 questions) =====
  {
    id: 215,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "What internal mechanism does strict: true use to guarantee that Claude's inputs comply with the JSON Schema?",
    options: [
      { id: "a", text: "A post-generation JSON Schema validator that rejects invalid outputs and forces the model to regenerate.", correct: false },
      { id: "b", text: "Grammar-constrained sampling that restricts token-by-token generation so it can only produce valid outputs according to the schema.", correct: true },
      { id: "c", text: "Per-schema specific fine-tuning where the model is trained in real-time with the provided schema.", correct: false },
      { id: "d", text: "A preprocessor that converts the schema to natural language instructions that are injected into the system prompt.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "strict: true uses grammar-constrained sampling, the same pipeline as structured outputs. It compiles the input_schema into a grammar that restricts token-by-token generation, making it impossible for the model to generate invalid inputs.",
    whyOthersWrong: {
      a: "It is not post-generation validation with regeneration. Grammar-constrained sampling operates DURING generation, restricting possible tokens at each step. It is more efficient than generate-validate-retry.",
      c: "There is no real-time fine-tuning. strict mode compiles the schema into a grammar that is applied during sampling. Compiled grammars are cached for up to 24 hours.",
      d: "strict mode does not inject instructions into the prompt. It operates at the level of the model's sampling process, restricting possible tokens at each position."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" },
      docReference: {
        source: "Anthropic Docs — Strict tool use",
        quote: "Setting strict: true on a tool definition uses grammar-constrained sampling to guarantee Claude's tool inputs match your JSON Schema."
      }
  },
  {
    id: 216,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "What input_schema property is recommended to combine with strict: true and why?",
    options: [
      { id: "a", text: "required: [] with all fields, because strict mode does not validate optional fields.", correct: false },
      { id: "b", text: "additionalProperties: false, because it prevents the model from generating extra properties not defined in the schema, complementing the guarantees of strict.", correct: true },
      { id: "c", text: "type: 'object' with maxProperties defined, because strict mode does not limit the number of properties.", correct: false },
      { id: "d", text: "default values for all fields, because strict mode cannot generate values for omitted optional fields.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The documentation recommends using additionalProperties: false together with strict: true. This prevents the model from generating extra properties not defined in the schema, ensuring that inputs match exactly the expected structure.",
    whyOthersWrong: {
      a: "strict mode validates against the entire schema including optional fields. Marking all fields as required is a design decision, not a requirement of strict mode.",
      c: "maxProperties is not the documented recommendation. additionalProperties: false is the property specifically recommended to complement strict mode.",
      d: "strict mode can handle optional fields correctly. You do not need default values; the recommendation is additionalProperties: false to prevent extra properties."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" },
      docReference: {
        source: "Anthropic Docs — Strict tool use (example schemas)",
        quote: "input_schema: type: object properties: location: type: string description: The city and state, e.g. San Francisco, CA unit: type: string enum: [celsius, fahrenheit] required: [location] additionalProperties: false"
      }
  },
  {
    id: 217,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "For how long are compiled tool schemas cached when using strict: true, and what data is retained?",
    options: [
      { id: "a", text: "Schemas compiled into grammars are cached temporarily for up to 24 hours since the last use. Prompts and responses are NOT retained beyond the API response.", correct: true },
      { id: "b", text: "Schemas, prompts, and responses are cached for 1 hour. After that time, everything is automatically deleted.", correct: false },
      { id: "c", text: "Only schemas are cached permanently on Anthropic's servers to optimize future requests. An explicit deletion request is required.", correct: false },
      { id: "d", text: "There is no caching. Each request recompiles the schema from scratch to guarantee it always uses the most recent version.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "Tool schemas are compiled into grammars and cached temporarily for up to 24 hours since the last use. It is important to note that prompts and responses are NOT retained beyond the API response, only the compiled grammars.",
    whyOthersWrong: {
      b: "The cache lasts up to 24 hours, not 1 hour. And prompts and responses are NOT cached or retained beyond the API response.",
      c: "Schemas are not cached permanently. They are temporary (up to 24 hours) and do not require manual deletion. It is a transient cache.",
      d: "There is caching of up to 24 hours for compiled schemas. This improves performance by avoiding recompiling the same grammar on each request."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" },
      docReference: {
        source: "Anthropic Docs — Strict tool use",
        quote: "Strict tool use compiles tool input_schema definitions into grammars using the same pipeline as structured outputs. Tool schemas are temporarily cached for up to 24 hours since last use. Prompts and responses are not retained beyond the API response."
      }
  },
  {
    id: 218,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Can strict: true be used together with extended thinking? Are there any restrictions?",
    options: [
      { id: "a", text: "No, strict: true and extended thinking are completely incompatible. You must choose one or the other.", correct: false },
      { id: "b", text: "Yes, without restrictions. strict: true works with any combination of tool_choice and extended thinking.", correct: false },
      { id: "c", text: "Yes, but with extended thinking you can only use tool_choice auto or none. Using tool_choice any or tool with extended thinking returns an error.", correct: true },
      { id: "d", text: "Yes, but only with the Claude Opus model. Sonnet and Haiku do not support strict with extended thinking.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "strict: true works with extended thinking, but extended thinking imposes a restriction on tool_choice: only auto and none are compatible. Using tool_choice any or tool together with extended thinking returns an error.",
    whyOthersWrong: {
      a: "They are not completely incompatible. strict: true does work with extended thinking as long as you use tool_choice auto or none.",
      b: "There are restrictions. With extended thinking, tool_choice any and tool return an error. Only auto and none are valid.",
      d: "The restriction is about tool_choice (only auto/none with extended thinking), not about the model. It is not specific to Opus."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "When using extended thinking with tool use, tool_choice: {\"type\": \"any\"} and tool_choice: {\"type\": \"tool\", \"name\": \"...\"} are not supported and will result in an error. Only tool_choice: {\"type\": \"auto\"} (the default) and tool_choice: {\"type\": \"none\"} are compatible with extended thinking."
      }
  },
  {
    id: 219,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your healthcare team uses strict: true in a HIPAA-eligible application. What is the critical restriction regarding PHI (Protected Health Information)?",
    options: [
      { id: "a", text: "PHI can be in tool schemas since the 24-hour cache is encrypted with AES-256 and complies with HIPAA.", correct: false },
      { id: "b", text: "PHI must not be in the tool schema definitions (property names, enum values, const values, or regex patterns) because the schemas are cached for up to 24 hours.", correct: true },
      { id: "c", text: "PHI can be in property descriptions but not in property names, since only the names are included in the compiled grammar.", correct: false },
      { id: "d", text: "PHI is only allowed if you use strict: false, since without caching there is no risk of data retention.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Although strict mode is HIPAA-eligible, PHI must not be included in the tool schema definitions: not in property names, enum values, const values, or regex patterns. This is because schemas are compiled into grammars that are cached temporarily for up to 24 hours.",
    whyOthersWrong: {
      a: "Although the system is HIPAA-eligible, the 24-hour caching of compiled schemas means PHI in schemas could be retained. The explicit recommendation is to not include PHI in tool schemas.",
      c: "The restriction covers multiple parts of the schema, not just property names. Enum values, const values, and regex patterns are also compiled into grammars and cached.",
      d: "The restriction is about PHI in tool schemas with strict: true due to caching. You do not need to deactivate strict; just keep PHI out of the schema definitions."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" },
      docReference: {
        source: "Anthropic Docs — Strict tool use",
        quote: "Strict tool use is HIPAA eligible, but PHI must not be included in tool schema definitions. The API caches compiled schemas separately from message content, and these cached schemas do not receive the same PHI protections as prompts and responses. Do not include PHI in input_schema property names, enum values, const values, or pattern regular expressions."
      }
  },

  // ===== tool_choice (5 questions) =====
  {
    id: 220,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "What is the fourth tool_choice option that is often overlooked, and what is its behavior?",
    options: [
      { id: "a", text: "tool_choice 'required' which forces the model to use at least one tool but allows text before it.", correct: false },
      { id: "b", text: "tool_choice 'none' (type:'none') which prevents Claude from using any tools. It is the default when no tools are provided.", correct: true },
      { id: "c", text: "tool_choice 'parallel' which allows the model to emit multiple simultaneous tool_use blocks.", correct: false },
      { id: "d", text: "tool_choice 'sequential' which forces the model to use tools one at a time in order.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 4 tool_choice options are: auto (Claude decides, default with tools), any (must use one), tool (forces a specific one), and none (prevents tool use, default without tools). 'none' is useful for temporarily disabling tools without removing them from the request.",
    whyOthersWrong: {
      a: "'required' does not exist as a tool_choice in the Claude API. The closest equivalent is 'any' which forces the use of some tool.",
      c: "'parallel' does not exist as a tool_choice. Claude can emit multiple tool_use blocks in a single turn by default with tool_choice auto.",
      d: "'sequential' does not exist as a tool_choice. The execution order of tools is controlled by your agentic loop code, not tool_choice."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "When working with the tool_choice parameter, there are four possible options: auto allows Claude to decide whether to call any provided tools or not. This is the default value when tools are provided. any tells Claude that it must use one of the provided tools, but doesn't force a particular tool. tool forces Claude to always use a particular tool. none prevents Claude from using any tools. This is the default value when no tools are provided."
      }
  },
  {
    id: 221,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "Your application uses extended thinking and you need to force Claude to use a specific tool with tool_choice type:'tool'. What happens?",
    options: [
      { id: "a", text: "It works normally. Extended thinking is compatible with all tool_choice options.", correct: false },
      { id: "b", text: "Claude silently ignores the tool_choice and uses auto as a fallback when extended thinking is active.", correct: false },
      { id: "c", text: "The API returns an error. With extended thinking, only tool_choice auto and none are compatible. The options any and tool return an error.", correct: true },
      { id: "d", text: "Extended thinking is automatically disabled when tool_choice tool or any is used, and the tool executes without thinking.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "With extended thinking enabled, only tool_choice auto and none are compatible. Attempting to use tool_choice any or tool returns an API error. This is an explicitly documented restriction.",
    whyOthersWrong: {
      a: "It is not compatible with all options. any and tool generate an error when extended thinking is active.",
      b: "The API does not do a silent fallback. It returns an explicit error when it detects tool_choice any or tool with extended thinking.",
      d: "Extended thinking is not automatically disabled. The API rejects the request with an error instead of silently degrading."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "When using extended thinking with tool use, tool_choice: {\"type\": \"any\"} and tool_choice: {\"type\": \"tool\", \"name\": \"...\"} are not supported and will result in an error. Only tool_choice: {\"type\": \"auto\"} (the default) and tool_choice: {\"type\": \"none\"} are compatible with extended thinking."
      }
  },
  {
    id: 222,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "When you use tool_choice any or tool_choice type:'tool', what effect does it have on Claude's response regarding natural language?",
    options: [
      { id: "a", text: "Claude generates a reasoning paragraph explaining why it chose that tool, followed by the tool_use block.", correct: false },
      { id: "b", text: "The API prefills the assistant message to force tool use, so Claude will NOT emit natural language before the tool_use blocks, even if explicitly asked to.", correct: true },
      { id: "c", text: "Claude alternates between text and tool_use blocks: first a sentence, then the tool_use, then more text.", correct: false },
      { id: "d", text: "It only affects the first turn. In subsequent turns of the loop, Claude can generate text before tool_use normally.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "With tool_choice any or tool, the API prefills the assistant message to force tool use. This means the model will NOT emit natural language before the tool_use blocks, even if the prompt explicitly requests it.",
    whyOthersWrong: {
      a: "With tool_choice any/tool, the message prefilling prevents Claude from generating text before the tool_use. There is no prior reasoning paragraph.",
      c: "There is no alternation. The prefilling forces the tool_use to be the first thing in the response, with no preceding text.",
      d: "The prefilling behavior applies on every turn where tool_choice any/tool is active, not just the first one."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "Note that when you have tool_choice as any or tool, the API prefills the assistant message to force a tool to be used. This means that the models will not emit a natural language response or explanation before tool_use content blocks, even if explicitly asked to do so."
      }
  },
  {
    id: 223,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "Your application uses prompt caching and you change tool_choice from auto to any between requests. What impact does this change have on the cache?",
    options: [
      { id: "a", text: "No impact. tool_choice does not affect caching since it is a top-level parameter, not part of the cached content.", correct: false },
      { id: "b", text: "Changes to tool_choice invalidate cached message blocks, but tool definitions and system prompts remain cached.", correct: true },
      { id: "c", text: "The entire cache is completely invalidated: tools, system prompts, and messages must be recached.", correct: false },
      { id: "d", text: "Only the assistant's tool_use blocks are invalidated. User messages remain cached.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Changes to tool_choice invalidate cached message blocks but do not affect the cache of tool definitions or system prompts. This means frequently changing tool_choice between requests reduces the effectiveness of message caching.",
    whyOthersWrong: {
      a: "tool_choice DOES affect caching. Changing it invalidates cached message blocks, which can impact performance.",
      c: "Not everything is invalidated. Tool definitions and system prompts remain cached. Only the message blocks are invalidated.",
      d: "The invalidation is not selective by message type (assistant vs user). It is the message blocks in general that are invalidated when tool_choice changes."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "When using prompt caching, changes to the tool_choice parameter will invalidate cached message blocks. Tool definitions and system prompts remain cached, but message content must be reprocessed."
      }
  },
  {
    id: 224,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Structured Data Extraction",
    question: "You want to guarantee that Claude ALWAYS calls a tool AND that the inputs comply exactly with the schema. What is the correct combination?",
    options: [
      { id: "a", text: "tool_choice auto with strict: true. Auto allows Claude to choose the correct tool and strict guarantees valid inputs.", correct: false },
      { id: "b", text: "tool_choice any with strict: true. 'any' guarantees a tool will be used and strict guarantees the inputs comply with the schema.", correct: true },
      { id: "c", text: "tool_choice none with strict: true and a system prompt instruction to always use tools.", correct: false },
      { id: "d", text: "tool_choice tool with strict: false. Forcing the specific tool is sufficient since Claude generates valid inputs 99% of the time.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The documentation recommends combining tool_choice any with strict: true to guarantee BOTH things: that a tool will be called (any) AND that the inputs will follow the schema exactly (strict). This is the way to obtain guaranteed structured outputs.",
    whyOthersWrong: {
      a: "tool_choice auto does NOT guarantee that a tool will be used. Claude could decide to respond with text only. You need any or tool to guarantee tool use.",
      c: "tool_choice none explicitly prevents tool use. A prompt instruction cannot override this API-level restriction.",
      d: "strict: false does not guarantee that inputs comply with the schema. 99% is not 100%. For guarantees, you need strict: true with grammar-constrained sampling."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      docReference: {
        source: "Anthropic Docs — Define tools",
        quote: "Guaranteed tool calls with strict tools — Combine tool_choice: {\"type\": \"any\"} with strict tool use to guarantee both that one of your tools will be called AND that the tool inputs strictly follow your schema. Set strict: true on your tool definitions to enable schema validation."
      }
  },

  // ===== Hooks (10 questions) =====
  {
    id: 227,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You have 3 PreToolUse hooks configured for the Bash tool. The first returns permissionDecision: 'allow', the second returns 'deny', and the third returns 'allow'. What is the final result?",
    options: [
      { id: "a", text: "The third hook wins because it executes last. The decision of the last hook in the chain always prevails.", correct: false },
      { id: "b", text: "The operation is allowed because 2 out of 3 hooks returned 'allow'. The decision is made by majority.", correct: false },
      { id: "c", text: "The operation is denied. The priority rule is deny > ask > allow. If any hook returns 'deny', the operation is blocked regardless of the others.", correct: true },
      { id: "d", text: "A conflict error occurs and the operation is left pending until the user manually resolves the discrepancy.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The hook priority rule is: deny > ask > allow. If ANY hook returns 'deny', the operation is blocked independently of what the other hooks return. This guarantees that a security hook cannot be overridden by other hooks.",
    whyOthersWrong: {
      a: "The last one does not win. Priority is based on the TYPE of decision (deny > ask > allow), not the execution order.",
      b: "Majority voting is not used. A single 'deny' blocks the operation regardless of how many 'allow' votes there are.",
      d: "There is no manual conflict resolution mechanism. The deny > ask > allow rule automatically resolves any conflict."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "When multiple PreToolUse hooks return different decisions, precedence is: deny > defer > ask > allow. The strongest decision wins. A single hook returning \"deny\" overrides others returning \"allow\"."
      }
  },
  {
    id: 228,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your PreToolUse hook needs to modify the file_path of a Write tool to redirect writes to a sandbox. You return updatedInput with the modified path but the tool keeps writing to the original path. What is the most likely error?",
    options: [
      { id: "a", text: "updatedInput is not supported for built-in tools like Write. It only works with user-defined tools.", correct: false },
      { id: "b", text: "You are missing permissionDecision: 'allow' alongside updatedInput. updatedInput REQUIRES that permissionDecision: 'allow' also be included in hookSpecificOutput.", correct: true },
      { id: "c", text: "You must return updatedInput as a top-level field, not inside hookSpecificOutput.", correct: false },
      { id: "d", text: "You must mutate the original tool_input object instead of returning a new updatedInput object.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "updatedInput REQUIRES that you also include permissionDecision: 'allow' in the hookSpecificOutput. Without the permissionDecision, the updatedInput is silently ignored. Additionally, you should always return a new object instead of mutating the original.",
    whyOthersWrong: {
      a: "updatedInput works with any tool, including built-in tools like Write, Edit, Bash, etc. There is no restriction by tool type.",
      c: "updatedInput must be INSIDE hookSpecificOutput, not as a top-level field. Putting it at the top level is precisely what causes it not to work.",
      d: "You must return a NEW object, not mutate the original. The documentation specifies that a new object should always be returned in updatedInput."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "When modifying tool input via updatedInput: Must replace the entire input object – include unchanged fields alongside modified ones. Works in: PreToolUse (with \"allow\" or \"ask\"), PermissionRequest (with \"allow\")."
      }
  },
  {
    id: 229,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "What is the regex pattern of the matcher in a tool hook evaluated against? For example, if you configure matcher: 'Write|Edit', what is being filtered?",
    options: [
      { id: "a", text: "The regex pattern is evaluated against the file paths in the tool call arguments.", correct: false },
      { id: "b", text: "The regex pattern is evaluated against the tool name. To filter by file path, you must check tool_input.file_path inside your callback.", correct: true },
      { id: "c", text: "The regex pattern is evaluated against the tool input content serialized as a JSON string.", correct: false },
      { id: "d", text: "The regex pattern is evaluated against a combination of tool name + arguments, separated by a colon.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Hook matchers filter ONLY by tool name, not by file paths or arguments. The regex 'Write|Edit' matches tools named 'Write' or 'Edit'. To filter by file path or other arguments, you must check tool_input.file_path inside the callback.",
    whyOthersWrong: {
      a: "The matcher does NOT evaluate file paths. It only filters by tool name. To inspect paths, you must do so inside the callback logic by accessing tool_input.",
      c: "The matcher does not evaluate the serialized input content. It only operates on the tool name. The input is inspected inside the callback.",
      d: "There is no combination of tool name + arguments. The matcher is exclusively against the tool name. Arguments are inspected programmatically in the callback."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "Matchers filter when hooks fire based on different fields per event. Tool Events (PreToolUse, PostToolUse, etc.) — Matchers filter on tool name."
      }
  },
  {
    id: 230,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "What are the exact names of the built-in tools you can use in hook matchers for Claude Code?",
    options: [
      { id: "a", text: "bash, read, write, edit, glob, grep, webfetch, agent (all lowercase).", correct: false },
      { id: "b", text: "Bash, Read, Write, Edit, Glob, Grep, WebFetch, Agent (with specific capitalization).", correct: true },
      { id: "c", text: "shell, file_read, file_write, file_edit, find, search, http_fetch, delegate (descriptive names).", correct: false },
      { id: "d", text: "BASH, READ, WRITE, EDIT, GLOB, GREP, WEB_FETCH, AGENT (all uppercase with underscores).", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The exact names of the built-in tools for matchers are: Bash, Read, Write, Edit, Glob, Grep, WebFetch, Agent. The exact capitalization matters since matchers use regex which is case-sensitive by default.",
    whyOthersWrong: {
      a: "The names are NOT all lowercase. They use PascalCase (Bash, Read) or compound camelCase (WebFetch). Since matchers are case-sensitive regex, 'bash' would not match 'Bash'.",
      c: "These are not the real names of the built-in tools. The correct names are shorter and specific: Bash (not shell), Read (not file_read), Agent (not delegate).",
      d: "The names do not use ALL_CAPS with underscores. The convention is PascalCase: Bash, Read, Write, Edit, Glob, Grep, WebFetch, Agent."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "Tool Events (PreToolUse, PostToolUse, etc.) Matchers filter on tool name. Built-in tools are PascalCase: Bash – shell commands, Read – file reading, Write – file creation, Edit – file editing, Glob – file pattern matching, Grep – text search, WebFetch – web content retrieval, WebSearch – web search, Agent – spawn subagents, AskUserQuestion – user prompts, ExitPlanMode – exit plan mode."
      }
  },
  {
    id: 231,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You need to write a hook that captures all tool calls to an MCP server called 'playwright'. What is the correct matcher pattern and why?",
    options: [
      { id: "a", text: "matcher: 'playwright' -- matches any tool that contains 'playwright' in its name.", correct: false },
      { id: "b", text: "matcher: '^mcp__playwright__' -- MCP tools follow the pattern mcp__<server>__<action>, and the ^ anchors to the start to avoid false positives.", correct: true },
      { id: "c", text: "matcher: 'mcp-playwright-*' -- MCP tools use hyphens as separators and * is a wildcard.", correct: false },
      { id: "d", text: "matcher: 'MCP.playwright.*' -- MCP tools use dot notation for namespacing.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "MCP tools follow the naming pattern mcp__<server>__<action> (double underscore as separator). For a server 'playwright', tools are named mcp__playwright__browser_screenshot, etc. The matcher '^mcp__playwright__' with the ^ anchor ensures it only matches tools from that server.",
    whyOthersWrong: {
      a: "Although 'playwright' would match MCP playwright tools, it could also match any other tool that contains 'playwright' in its name. The mcp__<server>__ pattern is more precise.",
      c: "MCP tools do not use hyphens but double underscores (__) as separators. Additionally, matchers are regex, not glob; * in regex means 'zero or more of the previous character'.",
      d: "MCP tools do not use dot notation. The correct format is mcp__<server>__<action> with double underscores."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "MCP tools follow the pattern: mcp__<server>__<tool>. mcp__memory__create_entities, mcp__filesystem__read_file, mcp__github__search_repositories. To match all tools from a server: mcp__memory__.* (the .* is required). To match write operations from any server: mcp__.*__write.*"
      }
  },
  {
    id: 232,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "A developer configures a hook with the key 'pretooluse' (all lowercase) and reports that it never executes. What is the problem?",
    options: [
      { id: "a", text: "Hook event names must be in ALL_CAPS with underscores: 'PRE_TOOL_USE'.", correct: false },
      { id: "b", text: "Hook event names are case-sensitive. The correct name is 'PreToolUse' (PascalCase), not 'pretooluse'.", correct: true },
      { id: "c", text: "Hook event names must be in camelCase: 'preToolUse' with the first letter lowercase.", correct: false },
      { id: "d", text: "Hooks are not configured by event name but by a numeric ID. 'pretooluse' is not a valid format.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Hook event names are case-sensitive and use PascalCase: PreToolUse, PostToolUse, SubagentStart, etc. Using 'pretooluse' (lowercase) does not match 'PreToolUse' and the hook never fires.",
    whyOthersWrong: {
      a: "Hook event names do not use ALL_CAPS. The correct format is PascalCase: PreToolUse, PostToolUse, SessionStart, etc.",
      c: "They do not use camelCase with a lowercase first letter. They all start with an uppercase letter (PascalCase): PreToolUse, not preToolUse.",
      d: "Hooks are configured by event name as a string, not by numeric IDs. But the name must be exact PascalCase."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Hooks", url: "https://code.claude.com/docs/en/hooks" },
      docReference: {
        source: "Claude Code Docs — Hooks",
        quote: "Hooks fire at specific lifecycle points in Claude Code sessions. Events fall into three cadences: Once per session: SessionStart, SessionEnd. Once per turn: UserPromptSubmit, Stop, StopFailure. On every tool call: PreToolUse, PostToolUse, PostToolUseFailure, PermissionRequest, PermissionDenied."
      }
  },

  // ===== Agent SDK Subagents (10 questions) =====
  {
    id: 236,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Code Generation with Claude Code",
    question: "In Claude Code, what is the tool that invokes subagents called and what was its previous name?",
    options: [
      { id: "a", text: "It is called 'Subagent' and was previously called 'Delegate'. The change was made in v2.0.", correct: false },
      { id: "b", text: "It is called 'Agent' and was previously called 'Task'. The renaming was done in Claude Code v2.1.63.", correct: true },
      { id: "c", text: "It is called 'Spawn' and was previously called 'Agent'. The change was to avoid confusion with the SDK.", correct: false },
      { id: "d", text: "It has always been called 'Agent'. There have been no renamings in the SDK history.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The tool for invoking subagents is called 'Agent', renamed from 'Task' in Claude Code v2.1.63. Note: current SDK releases emit 'Agent' in tool_use blocks but still use 'Task' in the system:init tools list and in permission_denials.",
    whyOthersWrong: {
      a: "It is not called 'Subagent' nor was it called 'Delegate'. The current name is 'Agent' and the previous one was 'Task'.",
      c: "It is not called 'Spawn'. The correct name is 'Agent' (current) and 'Task' (previous).",
      d: "There was a renaming. It was originally called 'Task' and was renamed to 'Agent' in version v2.1.63."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "In version 2.1.63, the Task tool was renamed to Agent. Existing Task(...) references in settings and agent definitions still work as aliases."
      }
  },
  {
    id: 237,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your subagent 'security-scanner' needs to delegate dependency analysis to another specialized subagent. Is this possible?",
    options: [
      { id: "a", text: "Yes, subagents can create subagents recursively up to 3 levels deep.", correct: false },
      { id: "b", text: "No, subagents CANNOT create their own subagents. You must not include 'Agent' in the tools array of a subagent.", correct: true },
      { id: "c", text: "Yes, but only if the subagent uses the same model as the parent to avoid inconsistencies.", correct: false },
      { id: "d", text: "Yes, as long as the parent agent explicitly authorizes the delegation in its AgentDefinition.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Subagents CANNOT create their own subagents. This is a critical system restriction. You must not include 'Agent' in the tools array of a subagent. If you need dependency analysis, the parent agent must orchestrate both subagents.",
    whyOthersWrong: {
      a: "There is no recursive depth. Subagents simply cannot create other subagents, period. Only one level of delegation is possible.",
      c: "It is not a matter of the model. The restriction is absolute: subagents cannot invoke the Agent tool regardless of the model.",
      d: "There is no authorization for nested delegation. The restriction is at the SDK architecture level: subagents do not create subagents."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "Subagents cannot spawn other subagents. If your workflow requires nested delegation, use Skills or chain subagents from the main conversation."
      }
  },
  {
    id: 238,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "What is the ONLY communication channel from the parent agent to a subagent?",
    options: [
      { id: "a", text: "The parent's conversation history is automatically shared with the subagent as context.", correct: false },
      { id: "b", text: "The parent's system prompt is inherited and the subagent can access the parent's tool results.", correct: false },
      { id: "c", text: "The prompt string of the Agent tool is the ONLY channel. You must include any file path, error message, or decision the subagent needs there.", correct: true },
      { id: "d", text: "Shared memory between parent and subagent allows exchanging structured data during execution.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The ONLY communication channel from parent to subagent is the prompt string of the Agent tool. The subagent does not receive the parent's conversation history, tool results, or system prompt. You must include all necessary context directly in that prompt.",
    whyOthersWrong: {
      a: "The subagent does NOT receive the parent's conversation history. It has its own isolated conversation with only its own system prompt and the Agent tool prompt.",
      b: "The parent's system prompt is NOT inherited. The subagent uses its own system prompt (defined in AgentDefinition.prompt). It also has no access to the parent's tool results.",
      d: "There is no shared memory between parent and subagent. The subagent is isolated; the only way to pass information is through the Agent tool prompt."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "Your full message still goes to Claude, which writes the subagent's task prompt based on what you asked. The @-mention controls which subagent Claude invokes, not what prompt it receives."
      }
  },
    {
    id: 240,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "Your main agent has permissions to execute Bash and Write. You create a subagent with tools: ['Bash', 'Read', 'Write']. Does the subagent inherit the parent's permissions?",
    options: [
      { id: "a", text: "Yes, the subagent inherits all of the parent's permissions automatically. You only need to define the tools.", correct: false },
      { id: "b", text: "No, subagents do NOT inherit the parent's permissions. The user will receive separate permission prompts for the subagent, unless you use PreToolUse hooks to auto-approve.", correct: true },
      { id: "c", text: "Partially. It inherits permissions for tools the parent already has, but asks for permission for new tools like Read.", correct: false },
      { id: "d", text: "Yes, as long as the subagent uses the same model as the parent. Different models require independent permissions.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Subagents do NOT inherit the parent's permissions. This can cause permission prompts to multiply. To avoid this, use PreToolUse hooks to auto-approve operations from trusted subagents.",
    whyOthersWrong: {
      a: "Permissions are NOT inherited automatically. Each subagent needs its own permissions, which can cause multiple approval prompts.",
      c: "There is no partial inheritance. None of the parent's permissions transfer to the subagent, regardless of whether the parent had that permission.",
      d: "Permission inheritance does not depend on the model. Subagents simply do not inherit the parent's permissions under any circumstances."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "The permissionMode field controls how the subagent handles permission prompts. Subagents inherit the permission context from the main conversation and can override the mode, except when the parent mode takes precedence as described below."
      }
  },
  {
    id: 242,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "What happens when you omit the tools field in an AgentDefinition?",
    options: [
      { id: "a", text: "The subagent has no access to any tools and can only generate text.", correct: false },
      { id: "b", text: "The subagent inherits ALL of the parent agent's tools.", correct: true },
      { id: "c", text: "The API returns an error because tools is a required field of AgentDefinition.", correct: false },
      { id: "d", text: "The subagent only has access to the built-in tools (Read, Write, Bash) without custom tools.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When you omit the tools field in AgentDefinition, the subagent inherits all of the parent's tools. To restrict tools, you must explicitly define a subset in the tools array.",
    whyOthersWrong: {
      a: "Omitting tools does not leave the subagent without tools. It inherits ALL of the parent's tools, which is even more permissive.",
      c: "tools is not a required field. Only description and prompt are required in AgentDefinition.",
      d: "It does not inherit only built-in tools. It inherits ALL of the parent's tools, including user-defined, MCP tools, and any other available tool."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "Subagents can use any of Claude Code's internal tools. By default, subagents inherit all tools from the main conversation, including MCP tools."
      }
  },
  {
    id: 244,
    domain: "Agentic Architecture & Orchestration",
    domainId: 1,
    scenario: "Multi-Agent Research System",
    question: "A subagent 'test-runner' needs to know the file path that failed in a test from the parent agent. How do you pass this information?",
    options: [
      { id: "a", text: "The subagent can access the parent's tool results through a shared context API.", correct: false },
      { id: "b", text: "You include the file path directly in the prompt string of the Agent tool, since it is the only parent-to-subagent communication channel.", correct: true },
      { id: "c", text: "You configure an environment variable that the subagent reads at the start of its execution.", correct: false },
      { id: "d", text: "You use the 'context' field of AgentDefinition to pass dynamic data to the subagent.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The only channel from parent to subagent is the prompt string of the Agent tool. The subagent has no access to the parent's history, tool results, or system prompt. You must include the file path (and any other necessary context) directly in that prompt.",
    whyOthersWrong: {
      a: "There is no shared context API. The subagent is isolated from the parent's history and tool results.",
      c: "AgentDefinition does not have a mechanism to pass dynamic environment variables to the subagent. The Agent tool prompt is the only channel.",
      d: "There is no 'context' field in AgentDefinition. The 7 fields are: description, prompt, tools, model, skills, memory, mcpServers."
    },
      docStatus: "PARTIAL",
      skilljarRef: { course: "Anthropic Docs", lesson: "Subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      docReference: {
        source: "Claude Code Docs — Subagents",
        quote: "Subagents receive only this system prompt (plus basic environment details like working directory), not the full Claude Code system prompt."
      }
  },

  // ===== MCP (10 questions) =====
  {
    id: 245,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "What are the 3 primitives of the Model Context Protocol and who controls each one?",
    options: [
      { id: "a", text: "Endpoints (server-controlled), Schemas (developer-controlled), and Configs (admin-controlled).", correct: false },
      { id: "b", text: "Tools (model-controlled: the LLM decides when to call them), Resources (application-controlled: the app decides when to load them), and Prompts (user-controlled: the user selects them).", correct: true },
      { id: "c", text: "Functions (model-controlled), Data (server-controlled), and Templates (model-controlled).", correct: false },
      { id: "d", text: "Tools (user-controlled), Resources (model-controlled), and Prompts (application-controlled).", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 3 MCP primitives are: Tools (model-controlled, the LLM actively decides when to call them), Resources (application-controlled, passive data sources that the app decides when to load), and Prompts (user-controlled, instruction templates that the user selects).",
    whyOthersWrong: {
      a: "Endpoints, Schemas, and Configs are not MCP primitives. The primitives are Tools, Resources, and Prompts with specific control per actor.",
      c: "Functions, Data, and Templates are not the correct names of the MCP primitives. And Resources are application-controlled, not server-controlled.",
      d: "The controllers are inverted. Tools are model-controlled (not user), Resources are application-controlled (not model), and Prompts are user-controlled (not application)."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP Tools", url: "https://modelcontextprotocol.io/docs/concepts/tools" },
      docReference: {
        source: "MCP Docs — Tools / Resources",
        quote: "Tools in MCP are designed to be model-controlled, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user's prompts. Resources in MCP are designed to be application-driven, with host applications determining how to incorporate context based on their needs."
      }
  },
  {
    id: 246,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Developer Productivity",
    question: "A developer is migrating a tool from the direct Claude API to an MCP server and the schema does not work. They notice that the API uses input_schema but MCP expects a different format. What is the difference?",
    options: [
      { id: "a", text: "MCP uses toolSchema (compound camelCase) instead of input_schema.", correct: false },
      { id: "b", text: "MCP uses inputSchema (camelCase) while the Claude API uses input_schema (snake_case). They are the same JSON schema but with different casing of the field name.", correct: true },
      { id: "c", text: "MCP does not use JSON Schema at all. It uses a proprietary format called MCP Schema Definition Language.", correct: false },
      { id: "d", text: "There is no difference. Both use identical input_schema. The problem must be something else.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "MCP uses inputSchema (camelCase) in its tool definitions, while the Claude API uses input_schema (snake_case). The JSON schema content is identical, but the container field name differs in casing. This is a detail that is easy to overlook when migrating.",
    whyOthersWrong: {
      a: "The field is not called 'toolSchema'. MCP uses 'inputSchema' (camelCase) as the field name.",
      c: "MCP does use JSON Schema. The only difference is the casing of the field name: inputSchema vs input_schema.",
      d: "There is a casing difference: MCP uses inputSchema (camelCase) and the Claude API uses input_schema (snake_case). This change can cause the schema to not be recognized."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP Tools", url: "https://modelcontextprotocol.io/docs/concepts/tools" },
      docReference: {
        source: "MCP Docs — Tools",
        quote: "A tool definition includes: name: Unique identifier for the tool. title: Optional human-readable name of the tool for display purposes. description: Human-readable description of functionality. inputSchema: JSON Schema defining expected parameters. outputSchema: Optional JSON Schema defining expected output structure."
      }
  },
  {
    id: 247,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "What is the precedence order of MCP server scopes in Claude Code (from highest to lowest)?",
    options: [
      { id: "a", text: "User > Project > Local > Plugin > Connectors", correct: false },
      { id: "b", text: "Local > Project > User > Plugin-provided > claude.ai connectors", correct: true },
      { id: "c", text: "Project > Local > User > Connectors > Plugin", correct: false },
      { id: "d", text: "Connectors > Plugin > User > Project > Local", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The precedence order from highest to lowest is: Local (1st), Project (2nd), User (3rd), Plugin-provided (4th), claude.ai connectors (5th). Duplicates are resolved by name (scopes) or by endpoint (plugins/connectors).",
    whyOthersWrong: {
      a: "User does not have the highest precedence. Local has higher precedence than Project which has higher than User. The correct order is Local > Project > User.",
      c: "Project does not have higher precedence than Local. Local is the highest precedence scope, followed by Project.",
      d: "The order is completely inverted. Connectors have the LOWEST precedence, not the highest."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "When the same server is defined in more than one place, Claude Code connects to it once, using the definition from the highest-precedence source: 1. Local scope 2. Project scope 3. User scope 4. Plugin-provided servers 5. claude.ai connectors. The three scopes match duplicates by name. Plugins and connectors match by endpoint, so one that points at the same URL or command as a server above is treated as a duplicate."
      }
  },
  {
    id: 248,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "In an .mcp.json file, what are the two supported syntaxes for environment variable expansion?",
    options: [
      { id: "a", text: "$VAR and $VAR:default using the dollar sign without braces.", correct: false },
      { id: "b", text: "${VAR} for direct expansion and ${VAR:-default} for expansion with a default value if the variable is not defined.", correct: true },
      { id: "c", text: "{{VAR}} and {{VAR|default}} using double braces as template syntax.", correct: false },
      { id: "d", text: "%VAR% and %VAR:default% using Windows variable syntax.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The two supported syntaxes are: ${VAR} for direct environment variable expansion, and ${VAR:-default} for expansion with a default value when the variable is not defined. If a required variable does not exist and has no default, Claude Code fails when parsing the config.",
    whyOthersWrong: {
      a: "Braces are required: ${VAR}, not $VAR. And the default syntax uses :- not just : (${VAR:-default}).",
      c: "Double braces are not used. The syntax is ${VAR} with dollar sign and single braces, not {{VAR}} template style.",
      d: "%VAR% Windows syntax is not used. .mcp.json uses Unix-style ${VAR} syntax regardless of the operating system."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "Supported syntax: ${VAR} - Expands to the value of environment variable VAR. ${VAR:-default} - Expands to VAR if set, otherwise uses default."
      }
  },
  {
    id: 249,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "In which 5 locations within the .mcp.json configuration can environment variables be expanded?",
    options: [
      { id: "a", text: "name, description, command, args, and env.", correct: false },
      { id: "b", text: "command, args, env, url, and headers.", correct: true },
      { id: "c", text: "url, headers, command, name, and type.", correct: false },
      { id: "d", text: "command, args, env, oauth.clientId, and oauth.callbackPort.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 5 locations where environment variables are expanded are: command (executable path), args (command line arguments), env (environment variables passed to the server), url (for HTTP servers), and headers (for HTTP authentication).",
    whyOthersWrong: {
      a: "name and description do not support variable expansion. The locations are command, args, env, url, and headers.",
      c: "name and type do not support variable expansion. And while command is included (correct), args and env are missing.",
      d: "oauth.clientId and oauth.callbackPort do not support variable expansion. The 5 correct locations are command, args, env, url, and headers."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "Expansion locations: Environment variables can be expanded in: command - The server executable path. args - Command-line arguments. env - Environment variables passed to the server. url - For HTTP server types. headers - For HTTP server authentication."
      }
  },
  {
    id: 250,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "Your HTTP MCP server needs dynamic authentication headers. You configure headersHelper pointing to a script. What are the restrictions of headersHelper?",
    options: [
      { id: "a", text: "The script must write YAML to stdout, has a 30-second timeout, and runs once at the start of the session.", correct: false },
      { id: "b", text: "The script must write a JSON object of string key-value pairs to stdout, has a 10-second timeout, and runs fresh on each connection (no caching).", correct: true },
      { id: "c", text: "The script must write headers in raw HTTP format (Header: Value), has a 60-second timeout, and results are cached for 5 minutes.", correct: false },
      { id: "d", text: "The script must return a JWT token as a simple string, has a 5-second timeout, and re-runs only when the token expires.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "headersHelper must write a JSON object of string key-value pairs to stdout, has a 10-second timeout, and runs fresh on each connection without caching. Dynamic headers override static headers with the same name.",
    whyOthersWrong: {
      a: "The output format is JSON (not YAML), the timeout is 10 seconds (not 30), and it runs on EACH connection (not just at startup).",
      c: "The format is JSON (not raw HTTP headers), the timeout is 10 seconds (not 60), and results are NOT cached (it runs fresh each time).",
      d: "It must return a complete JSON object (not just a string), the timeout is 10 seconds (not 5), and it runs on each connection (not based on expiration)."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "Requirements: The command must write a JSON object of string key-value pairs to stdout. The command runs in a shell with a 10-second timeout. Dynamic headers override any static headers with the same name. The helper runs fresh on each connection (at session start and on reconnect). There is no caching, so your script is responsible for any token reuse."
      }
  },
  {
    id: 251,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "What are the 3 transport types for MCP servers and which is deprecated?",
    options: [
      { id: "a", text: "HTTP (recommended for remote), WebSocket (for bidirectional streaming), and gRPC (deprecated).", correct: false },
      { id: "b", text: "HTTP (recommended for remote), SSE (deprecated, use HTTP instead), and stdio (for local processes).", correct: true },
      { id: "c", text: "HTTPS (recommended), HTTP (deprecated), and stdio (for local). HTTPS replaced HTTP for security.", correct: false },
      { id: "d", text: "REST (recommended), SSE (for streaming), and stdio (for local). None are deprecated.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 3 MCP transport types are: HTTP (recommended for remote servers), SSE/Server-Sent Events (deprecated, use HTTP instead), and stdio (for local processes running on your machine).",
    whyOthersWrong: {
      a: "WebSocket and gRPC are not used as MCP transports. The transports are HTTP, SSE (deprecated), and stdio.",
      c: "HTTP is not deprecated; it is the recommended transport. The deprecated one is SSE. There is no separate HTTP/HTTPS distinction in transport types.",
      d: "It is not called 'REST' but HTTP. And SSE IS deprecated; migration to HTTP is recommended."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "HTTP servers are the recommended option for connecting to remote MCP servers. This is the most widely supported transport for cloud-based services. [...] The SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead, where available."
      }
  },
  {
    id: 252,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "What do the environment variables MCP_TIMEOUT and MAX_MCP_OUTPUT_TOKENS do in Claude Code?",
    options: [
      { id: "a", text: "MCP_TIMEOUT configures the timeout for each individual tool call, and MAX_MCP_OUTPUT_TOKENS limits the model's tokens when responding about MCP results.", correct: false },
      { id: "b", text: "MCP_TIMEOUT configures the startup timeout of the MCP server (e.g., MCP_TIMEOUT=10000 for 10 seconds), and MAX_MCP_OUTPUT_TOKENS increases the output token limit for MCP tools (warning by default at 10,000 tokens).", correct: true },
      { id: "c", text: "MCP_TIMEOUT configures how long Claude waits between tool calls, and MAX_MCP_OUTPUT_TOKENS defines the maximum number of MCP tools that can be used in a session.", correct: false },
      { id: "d", text: "Both variables are aliases for the same settings in the Claude API and are not specific to MCP.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "MCP_TIMEOUT configures the startup timeout of the MCP server (example: MCP_TIMEOUT=10000 claude for 10 seconds). MAX_MCP_OUTPUT_TOKENS configures the output token limit for MCP tools; by default it generates a warning when exceeding 10,000 tokens.",
    whyOthersWrong: {
      a: "MCP_TIMEOUT is for the server startup, not for individual tool calls. MAX_MCP_OUTPUT_TOKENS limits the tool's output, not the model's tokens.",
      c: "MCP_TIMEOUT is not for waiting between tool calls but for server startup. MAX_MCP_OUTPUT_TOKENS is an output token limit, not a tool count.",
      d: "They are MCP-specific variables in Claude Code, not aliases for general API settings."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "Configure MCP server startup timeout using the MCP_TIMEOUT environment variable (for example, MCP_TIMEOUT=10000 claude sets a 10-second timeout). Claude Code will display a warning when MCP tool output exceeds 10,000 tokens. To increase this limit, set the MAX_MCP_OUTPUT_TOKENS environment variable (for example, MAX_MCP_OUTPUT_TOKENS=50000)."
      }
  },
  {
    id: 253,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Developer Productivity",
    question: "When you install an MCP server with scope 'local' (the default), where is the configuration stored?",
    options: [
      { id: "a", text: "In .claude/settings.local.json within the project directory.", correct: false },
      { id: "b", text: "In ~/.claude.json (the configuration file in the user's home directory), under the projects section for the current project.", correct: true },
      { id: "c", text: "In .mcp.json at the project root, marked with a 'local: true' flag.", correct: false },
      { id: "d", text: "In a local SQLite database at ~/.claude/mcp-servers.db.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 'local' scope for MCP servers is stored in ~/.claude.json (home directory), under the projects section for the current project. It is NOT stored in .claude/settings.local.json within the project. This distinction is important since both files are 'local' in different senses.",
    whyOthersWrong: {
      a: ".claude/settings.local.json is for local project settings, NOT for local scope MCP servers. Local MCP servers go in ~/.claude.json.",
      c: ".mcp.json is for 'project' scope (shared via version control), not for 'local' scope. And there is no 'local: true' flag.",
      d: "SQLite is not used. The configuration is stored as JSON in ~/.claude.json."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "Claude Code Docs — MCP",
        quote: "Local scope is the default. A local-scoped server loads only in the project where you added it and stays private to you. Claude Code stores it in ~/.claude.json under that project's path, so the same server won't appear in your other projects. [...] The term \"local scope\" for MCP servers differs from general local settings. MCP local-scoped servers are stored in ~/.claude.json (your home directory), while general local settings use .claude/settings.local.json (in the project directory)."
      }
  },
  {
    id: 254,
    domain: "Tool Design & MCP Integration",
    domainId: 2,
    scenario: "Multi-Agent Research System",
    question: "What are the two resource discovery patterns in MCP and how do they differ?",
    options: [
      { id: "a", text: "Pull Resources (the client requests) and Push Resources (the server sends proactively). They differ in who initiates the transfer.", correct: false },
      { id: "b", text: "Direct Resources (fixed URIs pointing to specific data, e.g., calendar://events/2024) and Resource Templates (dynamic URIs with parameters, e.g., weather://forecast/{city}/{date}).", correct: true },
      { id: "c", text: "Static Resources (defined in configuration) and Dynamic Resources (generated at runtime). They differ in when they are created.", correct: false },
      { id: "d", text: "Public Resources (accessible by any client) and Private Resources (requiring authentication). They differ in their access level.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "MCP has two resource discovery patterns: Direct Resources with fixed URIs (resources/list) pointing to specific data, and Resource Templates with parameterized URIs (resources/templates/list) that allow dynamic queries with placeholders like {city}.",
    whyOthersWrong: {
      a: "They are not categorized as Pull vs Push. Resources are always application-controlled. The distinction is between fixed URIs (Direct) and parameterized URIs (Templates).",
      c: "They are not categorized as Static vs Dynamic in that sense. Direct Resources have fixed URIs and Resource Templates have parameterized URIs; both can exist in configuration.",
      d: "They are not categorized by access level (Public/Private). The distinction is by URI type: fixed (Direct) vs parameterized (Template)."
    },
      docStatus: "STRONG",
      skilljarRef: { course: "Anthropic Docs", lesson: "MCP in Claude Code", url: "https://code.claude.com/docs/en/mcp" },
      docReference: {
        source: "MCP Docs — Resources",
        quote: "To discover available resources, clients send a resources/list request. [...] Resource templates allow servers to expose parameterized resources using URI templates. Arguments may be auto-completed through the completion API. [...] resourceTemplates: uriTemplate: \"file:///{path}\", name: \"Project Files\", title: \"📁 Project Files\", description: \"Access files in the project directory\", mimeType: \"application/octet-stream\""
      }
  }
];
