export const questionsPart5 = [
  // ===== CLAUDE.md & Memory System (8 questions, IDs 255-262) =====
  {
    id: 255,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your company's IT team needs to enforce mandatory CLAUDE.md instructions for all developers on Windows machines. In what path should they place the managed policy file?",
    options: [
      { id: "a", text: "C:\\Program Files\\ClaudeCode\\CLAUDE.md", correct: true },
      { id: "b", text: "C:\\ProgramData\\ClaudeCode\\CLAUDE.md", correct: false },
      { id: "c", text: "/etc/claude-code/CLAUDE.md", correct: false },
      { id: "d", text: "/Library/Application Support/ClaudeCode/CLAUDE.md", correct: false }
    ],
    correctAnswer: "a",
    explanation: "On Windows, the CLAUDE.md managed policy is located at C:\\Program Files\\ClaudeCode\\CLAUDE.md. This path is platform-specific and cannot be excluded via claudeMdExcludes.",
    whyOthersWrong: {
      b: "C:\\ProgramData is not the correct path. The documentation explicitly specifies C:\\Program Files\\ClaudeCode\\CLAUDE.md for Windows.",
      c: "/etc/claude-code/CLAUDE.md is the managed policy path for Linux and WSL, not for native Windows.",
      d: "/Library/Application Support/ClaudeCode/CLAUDE.md is the managed policy path for macOS, not for Windows."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (How Claude remembers your project)",
        quote: "Create the file at the managed policy location: macOS: /Library/Application Support/ClaudeCode/CLAUDE.md • Linux and WSL: /etc/claude-code/CLAUDE.md • Windows: C:\\Program Files\\ClaudeCode\\CLAUDE.md"
      }
  },
  {
    id: 256,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your project's CLAUDE.md imports a file that in turn imports another, and so on forming a chain. What is the maximum depth of nested @imports allowed?",
    options: [
      { id: "a", text: "3 hops — sufficient for most use cases.", correct: false },
      { id: "b", text: "5 hops — each file can import another up to 5 levels deep.", correct: true },
      { id: "c", text: "10 hops — to support complex monorepos with many levels.", correct: false },
      { id: "d", text: "No limit — imports are resolved recursively until the chain is exhausted.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The @import system has a strict limit of 5 hops of depth. This prevents infinite chains while allowing a reasonably deep documentation structure.",
    whyOthersWrong: {
      a: "3 hops would be too restrictive. The actual documented limit is 5 hops.",
      c: "10 hops is incorrect. The documented limit is exactly 5 hops of maximum depth.",
      d: "There is no unlimited resolution. Without a depth limit there would be risk of circular imports or excessively long chains. The limit is 5 hops."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (How Claude remembers your project)",
        quote: "Both relative and absolute paths are allowed. Relative paths resolve relative to the file containing the import, not the working directory. Imported files can recursively import other files, with a maximum depth of five hops."
      }
  },
  {
    id: 257,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "How much MEMORY.md content is automatically loaded at the start of a Claude Code session?",
    options: [
      { id: "a", text: "The entire MEMORY.md file is loaded without limit at session start.", correct: false },
      { id: "b", text: "The first 100 lines or the first 10KB, whichever comes first.", correct: false },
      { id: "c", text: "The first 200 lines or the first 25KB, whichever comes first.", correct: true },
      { id: "d", text: "The first 50KB of the file, regardless of the number of lines.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "Auto Memory loads the first 200 lines of MEMORY.md or the first 25KB, whichever is reached first, at session start. Content exceeding this threshold is NOT automatically loaded — Claude reads it on demand.",
    whyOthersWrong: {
      a: "Loading the entire file would consume too many context tokens. The system enforces strict limits: 200 lines or 25KB.",
      b: "The values of 100 lines and 10KB are incorrect. The actual limits are 200 lines and 25KB respectively.",
      d: "There is no 50KB limit. The limit is 25KB or 200 lines, whichever comes first, not by size alone."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (Auto memory section)",
        quote: "The first 200 lines of MEMORY.md, or the first 25KB, whichever comes first, are loaded at the start of every conversation. Content beyond that threshold is not loaded at session start. Claude keeps MEMORY.md concise by moving detailed notes into separate topic files."
      }
  },
  {
    id: 258,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want to exclude another team's CLAUDE.md in your monorepo. Where do you configure claudeMdExcludes and what important restriction applies?",
    options: [
      { id: "a", text: "In .claude/settings.local.json. Exclusions apply to all CLAUDE.md files including managed policy.", correct: false },
      { id: "b", text: "In .claude/settings.local.json. Patterns are evaluated against absolute paths and managed policy files CANNOT be excluded.", correct: true },
      { id: "c", text: "Only in ~/.claude/settings.json (user level). Patterns use paths relative to the project directory.", correct: false },
      { id: "d", text: "In any settings.json file. Exclusion arrays are replaced across layers instead of being merged.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "claudeMdExcludes can be configured in any settings layer (user, project, local, managed policy). Patterns are evaluated against absolute paths using glob syntax. Critical restriction: managed policy CLAUDE.md files can NEVER be excluded. Arrays are merged across layers.",
    whyOthersWrong: {
      a: "Although .claude/settings.local.json is a valid and recommended location, the claim that managed policy files can be excluded is false. These are immune to exclusion.",
      c: "claudeMdExcludes can be configured in any settings layer, not just the user layer. Furthermore, patterns use absolute paths, not relative ones.",
      d: "claudeMdExcludes arrays are merged across layers, not replaced. This is important: exclusions from each layer accumulate."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (Exclude specific CLAUDE.md files)",
        quote: "Patterns are matched against absolute file paths using glob syntax. You can configure claudeMdExcludes at any settings layer: user, project, local, or managed policy. Arrays merge across layers. Managed policy CLAUDE.md files cannot be excluded. This ensures organization-wide instructions always apply regardless of individual settings."
      }
  },
  {
    id: 259,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "After a context compaction in Claude Code, what happens with the project root CLAUDE.md files versus nested subdirectory CLAUDE.md files?",
    options: [
      { id: "a", text: "Both survive compaction — they are re-read from disk and automatically re-injected.", correct: false },
      { id: "b", text: "Neither survives — all CLAUDE.md files must be manually reloaded after compaction.", correct: false },
      { id: "c", text: "The project root CLAUDE.md survives and is re-injected; nested CLAUDE.md files are NOT re-injected until Claude reads files in that subdirectory.", correct: true },
      { id: "d", text: "Only CLAUDE.md files that were referenced in the last 5 turns before compaction survive.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The project root CLAUDE.md is treated as persistent content — it is re-read from disk and automatically re-injected after compaction. Nested subdirectory CLAUDE.md files are NOT automatically re-injected; they are reloaded on demand when Claude reads files in that subdirectory.",
    whyOthersWrong: {
      a: "Only the root CLAUDE.md survives compaction automatically. Nested CLAUDE.md files are lost until the corresponding subdirectory is accessed.",
      b: "The project root CLAUDE.md does survive automatically — it does not require manual reload. Only nested ones need re-triggering.",
      d: "There is no 'last 5 turns' mechanism to determine which CLAUDE.md files survive. The rule is simple: root yes, nested no."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (Instructions seem lost after /compact)",
        quote: "Project-root CLAUDE.md survives compaction: after /compact, Claude re-reads it from disk and re-injects it into the session. Nested CLAUDE.md files in subdirectories are not re-injected automatically; they reload the next time Claude reads a file in that subdirectory."
      }
  },
  {
    id: 260,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your CLAUDE.md contains HTML comments to document internal team sections that you do not want Claude to process. How does Claude Code handle these comments?",
    options: [
      { id: "a", text: "HTML comments are preserved as-is for Claude to use as additional context.", correct: false },
      { id: "b", text: "Block-level HTML comments are removed before injecting into context (saves tokens), but comments inside code blocks are preserved.", correct: true },
      { id: "c", text: "All HTML comments are removed, including those inside code blocks.", correct: false },
      { id: "d", text: "HTML comments are converted into hidden system instructions that only Claude can see.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Claude Code removes block-level HTML comments (<!-- ... -->) from CLAUDE.md content before injecting it into context, which saves tokens. However, comments inside fenced code blocks are preserved intact, as they are part of the code content.",
    whyOthersWrong: {
      a: "Block-level HTML comments are actively removed before injection — they are not preserved. The purpose is to save tokens.",
      c: "The removal is not total. Comments inside code blocks are preserved because they are part of the code, not document metadata.",
      d: "HTML comments are not converted into anything special. They are simply removed from the content before Claude sees it, saving tokens."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (How CLAUDE.md files load)",
        quote: "Block-level HTML comments (<!-- maintainer notes -->) in CLAUDE.md files are stripped before the content is injected into Claude's context. Use them to leave notes for human maintainers without spending context tokens on them. Comments inside code blocks are preserved. When you open a CLAUDE.md file directly with the Read tool, comments remain visible."
      }
  },
  {
    id: 261,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You want to add personal preferences for a specific project without affecting other team members. What file should you use and what precaution must you take?",
    options: [
      { id: "a", text: "CLAUDE.local.md — it should be added to .gitignore to avoid sharing it with the team.", correct: true },
      { id: "b", text: "~/.claude/CLAUDE.md — it is personal by nature and applies to all your projects.", correct: false },
      { id: "c", text: ".claude/settings.local.json — personal preferences go in settings, not in CLAUDE.md.", correct: false },
      { id: "d", text: "CLAUDE.md with a section marked as <!-- personal --> that is automatically filtered for other users.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "CLAUDE.local.md is the file designed for per-project personal preferences. It is loaded after CLAUDE.md in the same directory (appended after). It should be added to .gitignore because it contains personal preferences that should not be shared.",
    whyOthersWrong: {
      b: "~/.claude/CLAUDE.md is for global personal preferences that apply to ALL projects. The question asks for preferences specific to a single project.",
      c: ".claude/settings.local.json is for settings configuration (hooks, permissions, etc.), not for natural language instructions to the model. CLAUDE.local.md is the correct file for personal instructions.",
      d: "There is no automatic filtering mechanism based on HTML comments. HTML comments are removed for ALL users, not selectively."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (Import additional files)",
        quote: "For private per-project preferences that shouldn't be checked into version control, create a CLAUDE.local.md at the project root. It loads alongside CLAUDE.md and is treated the same way. Add CLAUDE.local.md to your .gitignore so it isn't committed; running /init and choosing the personal option does this for you."
      }
  },
  {
    id: 262,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "In the CLAUDE.md hierarchy, in what part of Claude's context is the content of these files delivered?",
    options: [
      { id: "a", text: "As part of the system prompt, at the beginning of the context.", correct: false },
      { id: "b", text: "As a user message after the system prompt.", correct: true },
      { id: "c", text: "As a prefilled assistant message at the beginning of the conversation.", correct: false },
      { id: "d", text: "As hidden metadata injected into the headers of each API call.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "CLAUDE.md content is delivered as a USER MESSAGE after the system prompt, NOT as part of the system prompt. This distinction is important for understanding how Claude prioritizes these instructions relative to other content.",
    whyOthersWrong: {
      a: "CLAUDE.md is NOT part of the system prompt. It is delivered as a separate user message after the system prompt. The system prompt contains base system instructions.",
      c: "Prefilled assistant messages are not used for CLAUDE.md. Furthermore, prefilled responses are deprecated in Claude 4.6/Mythos.",
      d: "No such hidden metadata mechanism exists. CLAUDE.md is delivered as visible content within the conversation as a user message."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Memory (Troubleshoot memory issues)",
        quote: "CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions."
      }
  },

  // ===== Skills System (8 questions, IDs 263-270) =====
  {
    id: 263,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "When creating a SKILL.md, you combine the 'description' and 'when_to_use' fields in the frontmatter. What is the character limit for the combination of both fields?",
    options: [
      { id: "a", text: "512 characters — descriptions must be extremely concise.", correct: false },
      { id: "b", text: "1,536 characters — description + when_to_use combined are truncated at this limit.", correct: true },
      { id: "c", text: "2,048 characters — a generous limit for detailed descriptions.", correct: false },
      { id: "d", text: "No character limit, but the dynamic token budget controls how much is loaded.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Each skill has a limit of 1,536 characters for the combination of 'description' + 'when_to_use'. The when_to_use field is appended to description and both count against this 1,536-character cap.",
    whyOthersWrong: {
      a: "512 characters is too restrictive. The actual limit is 1,536 characters per skill entry.",
      c: "2,048 characters is incorrect. The documented limit is exactly 1,536 characters.",
      d: "There is an explicit character limit (1,536). The dynamic budget of 1% of context is the global budget for ALL descriptions, not the per-skill limit."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Frontmatter reference)",
        quote: "What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Front-load the key use case: the combined description and when_to_use text is truncated at 1,536 characters in the skill listing to reduce context usage."
      }
  },
  {
    id: 264,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "In a SKILL.md, you use the syntax `/my-skill \"hello world\" second`. What values will $0 and $1 have?",
    options: [
      { id: "a", text: "$0 = 'hello', $1 = 'world', $2 = 'second'", correct: false },
      { id: "b", text: "$0 = 'hello world', $1 = 'second'", correct: true },
      { id: "c", text: "$0 = '/my-skill', $1 = 'hello world', $2 = 'second'", correct: false },
      { id: "d", text: "$0 = 'hello world second' (everything concatenated as a single argument)", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The skills system uses shell-style quoting: values enclosed in quotes are treated as a single argument. Therefore 'hello world' in quotes is $0 (equivalent to $ARGUMENTS[0]) and 'second' is $1 ($ARGUMENTS[1]).",
    whyOthersWrong: {
      a: "Quotes group 'hello world' as a single argument. It is not split into individual words when enclosed in quotes.",
      c: "The skill name (/my-skill) is not included in the arguments. $0 is the first argument passed TO the skill, not the skill name itself.",
      d: "Arguments are not concatenated. They are kept separate according to shell quoting: 'hello world' is one argument and 'second' is another."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Available string substitutions)",
        quote: "Indexed arguments use shell-style quoting, so wrap multi-word values in quotes to pass them as a single argument. For example, /my-skill \"hello world\" second makes $0 expand to hello world and $1 to second. The $ARGUMENTS placeholder always expands to the full argument string as typed."
      }
  },
  {
    id: 265,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your SKILL.md contains the line `- PR diff: !\\`gh pr diff\\``. When is this command executed and who executes it?",
    options: [
      { id: "a", text: "Claude executes the command during its reasoning when it determines it needs the PR diff.", correct: false },
      { id: "b", text: "The command is executed as preprocessing BEFORE Claude sees the content — Claude receives the result, not the command.", correct: true },
      { id: "c", text: "The command is executed when the user invokes the skill with /my-skill, and Claude decides whether to use the output.", correct: false },
      { id: "d", text: "The command is stored and executed after Claude provides its response, as post-processing.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The !`command` syntax in SKILL.md is a dynamic injection that is executed IMMEDIATELY as preprocessing. The output REPLACES the placeholder. Claude receives the fully rendered prompt with the actual data — it is PREPROCESSING, not something Claude executes.",
    whyOthersWrong: {
      a: "Claude does NOT execute these commands. They are executed before Claude sees the skill content. Claude only sees the resulting output.",
      c: "While the timing coincides with the skill invocation, the key distinction is that it is automatic preprocessing, not a decision by Claude about whether to use the output.",
      d: "It is not post-processing. The command is executed BEFORE Claude sees the skill, not after it responds."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Inject dynamic context)",
        quote: "When this skill runs: 1. Each !`<command>` executes immediately (before Claude sees anything) 2. The output replaces the placeholder in the skill content 3. Claude receives the fully-rendered prompt with actual PR data. This is preprocessing, not something Claude executes. Claude only sees the final result."
      }
  },
  {
    id: 266,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You configure a skill with `context: fork` in the frontmatter so it runs in a subagent. However, the subagent does not follow the skill's instructions. What is the most likely cause?",
    options: [
      { id: "a", text: "The skill has too many tokens and exceeds the 5,000-token budget per skill.", correct: false },
      { id: "b", text: "The skill content only contains general guidelines without explicit task instructions — context: fork requires concrete task instructions.", correct: true },
      { id: "c", text: "The subagent does not have access to the main project's CLAUDE.md.", correct: false },
      { id: "d", text: "The 'agent' field is not configured, so the subagent does not know what type of agent to be.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When using context: fork, the skill runs in a separate subagent context. If the SKILL.md only contains general guidelines without explicit task instructions, the subagent will not know what to do. Guidelines alone do not work — concrete instructions of what to execute are needed.",
    whyOthersWrong: {
      a: "The 5,000-token limit is for after compaction, not for the initial loading of the skill. Furthermore, if the skill loaded correctly but without task instructions, the problem would be the same.",
      c: "Subagents do load their own copy of CLAUDE.md (except Explore and Plan which omit it). The problem is the lack of task instructions in the skill, not the lack of CLAUDE.md.",
      d: "The 'agent' field is optional — there is a default agent type. The absence of this field does not cause the subagent to ignore instructions."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Run skills in a subagent)",
        quote: "Add context: fork to your frontmatter when you want a skill to run in isolation. The skill content becomes the prompt that drives the subagent. It won't have access to your conversation history. context: fork only makes sense for skills with explicit instructions. If your skill contains guidelines like \"use these API conventions\" without a task, the subagent receives the guidelines but no actionable prompt, and returns without meaningful output."
      }
  },
  {
    id: 267,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "After a context compaction, how many tokens are preserved per invoked skill and what is the total combined budget?",
    options: [
      { id: "a", text: "2,500 tokens per skill, 10,000 total — priority to the most recent ones.", correct: false },
      { id: "b", text: "5,000 tokens per skill, 25,000 total — filling from the most recently invoked skill.", correct: true },
      { id: "c", text: "8,000 tokens per skill, 40,000 total — older skills are discarded first.", correct: false },
      { id: "d", text: "No per-skill limit, but 25,000 tokens total — evenly distributed among active skills.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "After compaction, each invoked skill retains up to 5,000 tokens from its last invocation. The total combined budget for all re-attached skills is 25,000 tokens. The budget is filled starting from the most recently invoked skill; older skills may be discarded entirely.",
    whyOthersWrong: {
      a: "The values of 2,500 and 10,000 are incorrect. The actual limits are 5,000 tokens per skill and 25,000 total.",
      c: "8,000 and 40,000 are made-up values. The documented limits are 5,000 per skill and 25,000 total.",
      d: "There is a per-skill limit (5,000 tokens). Furthermore, the distribution is not even but prioritized by most recent invocation."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Skill content lifecycle)",
        quote: "Auto-compaction carries invoked skills forward within a token budget. When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens. Claude Code fills this budget starting from the most recently invoked skill, so older skills can be dropped entirely after compaction if you have invoked many in one session."
      }
  },
  {
    id: 268,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You configure `disable-model-invocation: true` in a skill's frontmatter. What is the exact effect on the skill's visibility and usage?",
    options: [
      { id: "a", text: "Claude can see the skill's description but cannot invoke it automatically — only the user can invoke it.", correct: false },
      { id: "b", text: "The skill's description is COMPLETELY REMOVED from Claude's context. Only the user can invoke it manually with /name.", correct: true },
      { id: "c", text: "Claude can invoke the skill but the user is asked for confirmation before execution.", correct: false },
      { id: "d", text: "The skill is completely deactivated — neither the user nor Claude can invoke it.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "With disable-model-invocation: true, the skill's description does NOT appear in Claude's context — it is completely removed. Claude does not know it exists. Only the user can invoke it manually with /name. This means the skill costs ZERO context tokens until the user invokes it.",
    whyOthersWrong: {
      a: "The description does NOT remain visible. That is the key difference: with disable-model-invocation: true the description is removed from context entirely, not just the invocation blocked.",
      c: "There is no confirmation mechanism. The skill simply does not exist for Claude until the user invokes it manually.",
      d: "The skill is not completely deactivated — the user CAN invoke it with /name. It is only removed from Claude's perspective."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Control who invokes a skill)",
        quote: "disable-model-invocation: true: Only you can invoke the skill. Use this for workflows with side effects or that you want to control timing, like /commit, /deploy, or /send-slack-message. [...] Description not in context, full skill loads when you invoke."
      }
  },
  {
    id: 269,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your SKILL.md includes !`...` commands that execute shell scripts to inject dynamic data. A security administrator wants to disable this capability. What setting should they configure?",
    options: [
      { id: "a", text: "\"disableAllHooks\": true in settings.json.", correct: false },
      { id: "b", text: "\"disableSkillShellExecution\": true in settings.json.", correct: true },
      { id: "c", text: "\"allowedTools\": [] to remove Bash from the skill.", correct: false },
      { id: "d", text: "Add the skill to \"disallowedTools\" in settings.json.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The specific setting to disable dynamic shell command execution (!`command`) in skills is 'disableSkillShellExecution': true. This prevents dynamic injection commands from being executed during skill preprocessing.",
    whyOthersWrong: {
      a: "disableAllHooks disables hooks, not shell command execution in skills. The !`command` syntax in skills is a separate mechanism from the hooks system.",
      c: "allowedTools controls what tools Claude can use during skill execution, not the preprocessing !`command` commands. These are executed before Claude sees the skill.",
      d: "disallowedTools controls Claude's tools, not shell execution in skill preprocessing. They are completely different mechanisms."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Skills (Inject dynamic context)",
        quote: "To disable this behavior for skills and custom commands from user, project, plugin, or additional-directory sources, set \"disableSkillShellExecution\": true in settings. Each command is replaced with [shell command execution disabled by policy] instead of being run. Bundled and managed skills are not affected. This setting is most useful in managed settings, where users cannot override it."
      }
  },
  {
    id: 270,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "How many frontmatter fields does the SKILL.md system recognize, and what is the only required element in a skill's directory structure?",
    options: [
      { id: "a", text: "8 frontmatter fields; the SKILL.md file and the 'name' field are required.", correct: false },
      { id: "b", text: "15 frontmatter fields; only the SKILL.md file is required (name defaults to the directory name).", correct: true },
      { id: "c", text: "12 frontmatter fields; the 'name' and 'description' fields are both required.", correct: false },
      { id: "d", text: "20 frontmatter fields; 'name', 'description', and 'allowed-tools' are required.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The system recognizes 15 frontmatter fields: name, description, when_to_use, argument-hint, disable-model-invocation, user-invocable, allowed-tools, model, effort, context, agent, hooks, paths, shell. No frontmatter field is required — name defaults to the directory name. Only the SKILL.md file itself is mandatory.",
    whyOthersWrong: {
      a: "There are 15 fields, not 8. Furthermore, 'name' is not required — it uses the directory name as default if not specified.",
      c: "There are 15 fields, not 12. No individual field is required — neither name nor description is mandatory (though description is 'recommended').",
      d: "There are 15 fields, not 20. None of the mentioned fields are required — all have defaults or are optional."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Skills (Frontmatter reference)",
        quote: "All fields are optional. Only description is recommended so Claude knows when to use the skill. [...] name — No — Display name for the skill. If omitted, uses the directory name. Lowercase letters, numbers, and hyphens only (max 64 characters)."
      }
  },

  // ===== CLI Flags (7 questions, IDs 271-277) =====
  {
    id: 271,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "You run `claude --bare -p \"query\"`. What components are omitted exactly in --bare mode?",
    options: [
      { id: "a", text: "Only skills and plugins are omitted — hooks, MCP, auto memory, and CLAUDE.md remain active.", correct: false },
      { id: "b", text: "Hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md are omitted — only Bash, file read, and file edit remain.", correct: true },
      { id: "c", text: "All components including base tools are omitted — Claude can only generate text.", correct: false },
      { id: "d", text: "Hooks and CLAUDE.md are omitted but skills, plugins, and MCP servers are retained.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The --bare flag activates minimal mode which sets the CLAUDE_CODE_SIMPLE environment variable. It omits: hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md. Only basic tools are retained: Bash, file read, and file edit.",
    whyOthersWrong: {
      a: "--bare omits ALL of these components, not just a subset. Its purpose is the most minimal mode possible with tools.",
      c: "--bare does not remove base tools. Claude retains Bash, file read, and file edit. It is not reduced to only generating text.",
      d: "--bare omits EVERYTHING: hooks, skills, plugins, MCP, auto memory, AND CLAUDE.md. It does not retain any of these components."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference",
        quote: "Minimal mode: skip auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md so scripted calls start faster. Claude has access to Bash, file read, and file edit tools. Sets CLAUDE_CODE_SIMPLE."
      }
  },
  {
    id: 272,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "You use `claude -p --max-turns 3 \"analyze this codebase\"`. The analysis requires 5 agentic turns. What happens when the limit is reached?",
    options: [
      { id: "a", text: "Claude generates a partial response with a summary of what was completed up to turn 3.", correct: false },
      { id: "b", text: "Claude terminates silently and returns the last generated output.", correct: false },
      { id: "c", text: "Claude exits with an error upon reaching the turn limit.", correct: true },
      { id: "d", text: "Claude pauses and asks the user for confirmation to continue beyond the limit.", correct: false }
    ],
    correctAnswer: "c",
    explanation: "The --max-turns flag limits agentic turns in print mode. When the limit is reached, Claude exits with an error — it does not generate partial summaries or ask for confirmation. It is an abrupt cutoff designed for cost control in automated scripts.",
    whyOthersWrong: {
      a: "No partial summary is generated. Claude simply exits with an error upon reaching the limit.",
      b: "It is not silent — it exits with an explicit ERROR, not a clean termination.",
      d: "In print mode (-p), there is no user interaction. --max-turns is for non-interactive use where confirmation cannot be requested."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference",
        quote: "Limit the number of agentic turns (print mode only). Exits with an error when the limit is reached. No limit by default."
      }
  },
  {
    id: 273,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "You need to control the maximum spend of an automated Claude Code execution. What flag do you use and in what mode does it operate?",
    options: [
      { id: "a", text: "--max-budget-usd — works in both interactive mode and print mode.", correct: false },
      { id: "b", text: "--max-budget-usd — only works in print mode (-p) to control API costs.", correct: true },
      { id: "c", text: "--cost-limit — works in all modes and stops the session upon reaching the limit.", correct: false },
      { id: "d", text: "--max-tokens — limits the total tokens that can be consumed in the session.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The --max-budget-usd flag sets a maximum dollar amount for API calls. It only works in print mode (-p), designed for automated scripts where cost control is critical.",
    whyOthersWrong: {
      a: "--max-budget-usd only works in print mode, not in interactive mode. It is a flag specific to non-interactive use and automation.",
      c: "There is no --cost-limit flag in Claude Code. The correct flag is --max-budget-usd.",
      d: "--max-tokens is not a Claude Code CLI flag for limiting sessions. max_tokens is a Claude API parameter for limiting individual responses, not total spend."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference",
        quote: "Maximum dollar amount to spend on API calls before stopping (print mode only)."
      }
  },
  {
    id: 274,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "You want to resume a previous session but in a new fork, without modifying the original session. What combination of flags do you need?",
    options: [
      { id: "a", text: "--continue --fork-session — continues the most recent session in a new fork.", correct: false },
      { id: "b", text: "--resume <session-id> --fork-session — creates a new session ID from the specified session.", correct: true },
      { id: "c", text: "--fork <session-id> — direct fork without needing --resume.", correct: false },
      { id: "d", text: "--resume <session-id> --new-session — clones the context to a new session.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The combination of --resume <session-id> with --fork-session creates a new session ID based on the specified session. This allows resuming the context without modifying the original session.",
    whyOthersWrong: {
      a: "--continue loads the most recent conversation, but --fork-session works with --resume which specifies a specific session by ID or name, not with --continue.",
      c: "There is no --fork flag as a standalone command. You need --resume to specify the base session and --fork-session to create the fork.",
      d: "There is no --new-session flag. The correct combination is --resume with --fork-session."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference",
        quote: "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)."
      }
  },
  {
    id: 275,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "What is the relationship between --system-prompt and --append-system-prompt in Claude Code?",
    options: [
      { id: "a", text: "They are synonyms — both replace the entire system prompt.", correct: false },
      { id: "b", text: "--system-prompt replaces the entire prompt; --append-system-prompt is added to the default. The replacement flags (--system-prompt and --system-prompt-file) are mutually exclusive with each other, but the append flags CAN be combined with either.", correct: true },
      { id: "c", text: "Both add content — --system-prompt at the beginning and --append-system-prompt at the end of the default prompt.", correct: false },
      { id: "d", text: "--system-prompt sets the base prompt and --append-system-prompt appends, but they cannot be used in the same invocation.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "--system-prompt COMPLETELY REPLACES the default system prompt. --append-system-prompt APPENDS text to the end of the default prompt. The flags --system-prompt and --system-prompt-file are mutually exclusive with each other, but the append flags (--append-system-prompt, --append-system-prompt-file) CAN be combined with either of the replacement flags.",
    whyOthersWrong: {
      a: "They are not synonyms. --system-prompt completely replaces while --append-system-prompt appends to the default. They have opposite functions.",
      c: "Both do not add content. --system-prompt REPLACES the entire prompt, it does not add to the beginning.",
      d: "They CAN be used together. The append flags can be combined with the replacement flags. Mutual exclusivity only applies between --system-prompt and --system-prompt-file."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference (System prompt flags)",
        quote: "--system-prompt and --system-prompt-file are mutually exclusive. The append flags can be combined with either replacement flag. For most use cases, use an append flag. Appending preserves Claude Code's built-in capabilities while adding your requirements. Use a replacement flag only when you need complete control over the system prompt."
      }
  },
  {
    id: 276,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "You run Claude Code with `--exclude-dynamic-system-prompt-sections` in print mode. What is the main purpose of this flag?",
    options: [
      { id: "a", text: "Exclude all sections from the system prompt to save context tokens.", correct: false },
      { id: "b", text: "Move per-machine sections of the system prompt to a user message, enabling greater cache reuse of the system prompt.", correct: true },
      { id: "c", text: "Disable the dynamic injection of CLAUDE.md and auto memory into the system prompt.", correct: false },
      { id: "d", text: "Exclude dynamic tool sections (MCP) from the prompt to reduce latency.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The --exclude-dynamic-system-prompt-sections flag moves dynamic (per-machine specific) sections from the system prompt to a user message. This allows the system prompt to be more stable across executions, maximizing prompt cache reuse and reducing costs.",
    whyOthersWrong: {
      a: "It does not exclude all sections — it only moves dynamic/per-machine sections to a user message. The base system prompt is maintained.",
      c: "CLAUDE.md and auto memory are not part of the system prompt — they are already delivered as user messages. This flag addresses dynamic sections of the system prompt itself.",
      d: "It is not specific to MCP tools. It addresses dynamic sections of the system prompt that vary between machines, optimizing cache."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference",
        quote: "Move per-machine sections from the system prompt (working directory, environment info, memory paths, git status) into the first user message. Improves prompt-cache reuse across different users and machines running the same task. Only applies with the default system prompt; ignored when --system-prompt or --system-prompt-file is set. Use with -p for scripted, multi-user workloads."
      }
  },
  {
    id: 277,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Claude Code for Continuous Integration",
    question: "What are the 6 permission modes available in Claude Code and what does the 'plan' mode do?",
    options: [
      { id: "a", text: "default, acceptEdits, plan, auto, dontAsk, bypassPermissions. The 'plan' mode restricts Claude to only reading files and planning without executing changes.", correct: true },
      { id: "b", text: "default, readOnly, plan, auto, silent, admin. The 'plan' mode allows only reads and analysis.", correct: false },
      { id: "c", text: "default, acceptEdits, plan, auto, dontAsk, bypassPermissions. The 'plan' mode allows all actions but requires confirmation for each one.", correct: false },
      { id: "d", text: "restricted, acceptEdits, plan, auto, dontAsk, admin. The 'plan' mode disables all tools except Read.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The 6 permission modes are: default, acceptEdits, plan, auto, dontAsk, and bypassPermissions. The 'plan' mode is a restrictive mode where Claude can only read files and plan without executing changes — ideal for code review and analysis.",
    whyOthersWrong: {
      b: "The mode names are incorrect. 'readOnly', 'silent', and 'admin' do not exist. The correct modes are default, acceptEdits, plan, auto, dontAsk, bypassPermissions.",
      c: "The modes are correct but the description of 'plan' is wrong. Plan restricts to read-only and planning, it does not allow all actions with confirmation (that would be closer to 'default').",
      d: "The mode names are incorrect. 'restricted' and 'admin' do not exist. Furthermore, plan does not disable all tools except Read — it allows reading and planning."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — CLI reference (--permission-mode)",
        quote: "Begin in a specified permission mode. Accepts default, acceptEdits, plan, auto, dontAsk, or bypassPermissions. Overrides defaultMode from settings files."
      }
  },

  // ===== Prompt Engineering (7 questions, IDs 278-284) =====
  {
    id: 278,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "When providing few-shot examples in a prompt for Claude, what is the recommended XML structure?",
    options: [
      { id: "a", text: "Each example in an <example> tag, all inside a container <examples> tag.", correct: true },
      { id: "b", text: "Each example in a <shot> tag, all inside a <few-shots> tag.", correct: false },
      { id: "c", text: "All examples in a single <examples> tag without individual tags per example.", correct: false },
      { id: "d", text: "Each example as an <input>/<output> pair without a container tag.", correct: false }
    ],
    correctAnswer: "a",
    explanation: "The documentation recommends wrapping each individual example in <example> tags and placing multiple examples inside a container <examples> tag. It is recommended to include 3-5 examples that are relevant, diverse, and structurally distinct from the instructions.",
    whyOthersWrong: {
      b: "The recommended tags are <example> and <examples>, not <shot> and <few-shots>. Using the correct tags is important for consistency.",
      c: "Individual <example> tags are needed for each example within the <examples> container. Without individual separation, Claude may confuse the boundaries between examples.",
      d: "A container <examples> tag is needed to group all examples and clearly distinguish them from the prompt instructions."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Use examples effectively)",
        quote: "Structured: Wrap examples in <example> tags (multiple examples in <examples> tags) so Claude can distinguish them from instructions. Include 3–5 examples for best results. You can also ask Claude to evaluate your examples for relevance and diversity, or to generate additional ones based on your initial set."
      }
  },
  {
    id: 279,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your prompt includes 150K tokens of reference documents and an analysis query. Where should you place the documents and the query to maximize response quality?",
    options: [
      { id: "a", text: "Query at the beginning, documents at the end — so Claude knows what to look for first.", correct: false },
      { id: "b", text: "Documents at the beginning (top), query at the end (bottom) — improves response quality by up to 30% in tests.", correct: true },
      { id: "c", text: "Interleave documents and queries to maintain Claude's attention throughout the context.", correct: false },
      { id: "d", text: "Order does not matter — Claude 4.6 has uniform attention across the entire context.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The documentation indicates placing longform data at the TOP of the prompt, with queries/instructions/examples at the BOTTOM. This ordering improves response quality by up to 30% according to the tests performed.",
    whyOthersWrong: {
      a: "Placing the query first and documents after is the incorrect order. The 30% improvement comes from data on top and queries at the bottom, not the reverse.",
      c: "Interleaving is not the recommendation. The optimal structure is clear: long data on top, queries and instructions at the bottom.",
      d: "Although Claude handles long contexts, order DOES matter. Tests demonstrate up to a 30% improvement with the correct order."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Long context prompting)",
        quote: "Put longform data at the top: Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This can significantly improve performance across all models. Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs."
      }
  },
  {
    id: 280,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "What is the correct configuration to activate adaptive thinking in Claude 4.6 with high effort?",
    options: [
      { id: "a", text: "thinking: {type: \"enabled\", budget_tokens: 32000} with effort: \"high\"", correct: false },
      { id: "b", text: "thinking: {type: \"adaptive\"} with output_config: {effort: \"high\"}", correct: true },
      { id: "c", text: "thinking: {type: \"auto\"} with effort_level: \"high\"", correct: false },
      { id: "d", text: "extended_thinking: true with thinking_budget: \"high\"", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Adaptive thinking in Claude 4.6 uses thinking: {type: \"adaptive\"} together with output_config: {effort: \"high\"}. Claude dynamically decides when and how much to think, calibrated by the effort parameter and the complexity of the query.",
    whyOthersWrong: {
      a: "thinking: {type: \"enabled\", budget_tokens: N} is the extended thinking syntax (deprecated). Adaptive thinking uses type: \"adaptive\" without budget_tokens.",
      c: "There is no type: \"auto\" nor the effort_level parameter. The correct values are type: \"adaptive\" and output_config: {effort: \"high\"}.",
      d: "There is no extended_thinking as a boolean parameter nor thinking_budget as a string. The correct syntax uses the thinking object with type: \"adaptive\"."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Leverage thinking)",
        quote: "Claude Opus 4.6 and Claude Sonnet 4.6 use adaptive thinking (thinking: {type: \"adaptive\"}), where Claude dynamically decides when and how much to think. Claude calibrates its thinking based on two factors: the effort parameter and query complexity. Higher effort elicits more thinking, and more complex queries do the same."
      }
  },
  {
    id: 281,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "The effort parameter has 4 levels. What is exclusive to Opus 4.6 and what effect does it have?",
    options: [
      { id: "a", text: "\"ultra\" — activates extended thinking with automatic maximum budget.", correct: false },
      { id: "b", text: "\"max\" — only available on Opus 4.6, activates significantly more upfront exploration.", correct: true },
      { id: "c", text: "\"extreme\" — exclusive to Opus 4.6, doubles the available thinking context.", correct: false },
      { id: "d", text: "\"high\" — the maximum level is 'high' and it is exclusive to Opus 4.6.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 4 effort levels are: low, medium, high, max. The 'max' level is EXCLUSIVE to Opus 4.6 and activates significantly more upfront exploration than the other levels.",
    whyOthersWrong: {
      a: "There is no 'ultra' level. The levels are low, medium, high, and max.",
      c: "There is no 'extreme' level. The levels are low, medium, high, and max.",
      d: "'high' is NOT the maximum level nor is it exclusive to Opus 4.6. 'high' is available on all models. The level exclusive to Opus 4.6 is 'max'."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Skills (Frontmatter reference, effort field)",
        quote: "Effort level when this skill is active. Overrides the session effort level. Default: inherits from session. Options: low, medium, high, xhigh, max; available levels depend on the model."
      }
  },
  {
    id: 282,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Structured Data Extraction",
    question: "Your application uses prefilled responses in the last assistant turn to control output format. This worked on Claude Sonnet 4.5. What happens when migrating to Claude 4.6?",
    options: [
      { id: "a", text: "It continues to work the same — prefilled responses are a stable API feature.", correct: false },
      { id: "b", text: "Prefilled responses in the last assistant turn are deprecated in Claude 4.6/Mythos. You must migrate to Structured Outputs or direct instructions.", correct: true },
      { id: "c", text: "They work but with lower quality — Claude 4.6 tends to ignore the prefill more frequently.", correct: false },
      { id: "d", text: "They only work if you use the legacy_mode: true parameter in the API request.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Prefilled responses in the last assistant turn are deprecated in Claude 4.6 and Mythos. To control output format, the recommended migration is to use Structured Outputs (output_config.format). To eliminate preambles, use direct instructions like 'Respond directly without preamble'.",
    whyOthersWrong: {
      a: "Prefilled responses do NOT continue working in Claude 4.6. It is a breaking change that requires migration.",
      c: "It is not a matter of degraded quality — prefilled responses are actively deprecated, not just less effective.",
      d: "There is no legacy_mode parameter. Migration requires switching to Structured Outputs or direct instructions."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Migrating away from prefilled responses)",
        quote: "Starting with Claude 4.6 models and Claude Mythos Preview, prefilled responses on the last assistant turn are no longer supported. On Mythos Preview, requests with prefilled assistant messages return a 400 error. Model intelligence and instruction following has advanced such that most use cases of prefill no longer require it. Existing models will continue to support prefills, and adding assistant messages elsewhere in the conversation is not affected."
      }
  },
  {
    id: 283,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Claude Code for Continuous Integration",
    question: "You want to optimize Claude 4.6 to execute multiple tool calls in parallel. What is the most effective technique according to the documentation?",
    options: [
      { id: "a", text: "Set parallel_execution: true in the API request parameters.", correct: false },
      { id: "b", text: "Wrap tool usage instructions in <use_parallel_tool_calls> tags in the prompt.", correct: true },
      { id: "c", text: "List all tools with parallel: true in their tool definition.", correct: false },
      { id: "d", text: "No optimization is needed — Claude 4.6 executes all tool calls in parallel by default.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Claude 4.6 has a near-100% success rate for parallel tool calls with an explicit prompt. The recommended technique is to use the <use_parallel_tool_calls> wrapper in the prompt to indicate to Claude that it should attempt to execute tools in parallel when possible.",
    whyOthersWrong: {
      a: "There is no parallel_execution parameter in the API. The optimization is done at the prompt level, not via API parameters.",
      c: "There is no parallel: true field in tool definitions. Parallelism is promoted through instructions in the prompt.",
      d: "Although Claude 4.6 is good at parallelism, it achieves near-100% success with the explicit prompt using <use_parallel_tool_calls>. It is not completely automatic without indication."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Optimize parallel tool calling)",
        quote: "This behavior is easily steerable. While the model has a high success rate in parallel tool calling without prompting, you can boost this to ~100% or adjust the aggression level: <use_parallel_tool_calls> If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. [...] </use_parallel_tool_calls>"
      }
  },
  {
    id: 284,
    domain: "Prompt Engineering & Structured Output",
    domainId: 4,
    scenario: "Code Generation with Claude Code",
    question: "You ask Claude to generate code and then review it in the same session. What is the main limitation of this approach?",
    options: [
      { id: "a", text: "Claude cannot read its own previous output within the same session.", correct: false },
      { id: "b", text: "Claude retains the reasoning context from the session, which biases the review toward confirming its own original decisions.", correct: true },
      { id: "c", text: "Token cost doubles because Claude needs to re-process all the generated code.", correct: false },
      { id: "d", text: "Claude loses context after generating long code, making the review superficial.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "When Claude reviews its own work in the same session, it retains the original reasoning context. This creates a confirmation bias: Claude tends to validate its own decisions rather than evaluating them objectively. For more effective reviews, it is recommended to use a separate session.",
    whyOthersWrong: {
      a: "Claude CAN read its own previous output in the same session. The problem is not about access but about confirmation bias.",
      c: "Token cost is not the main limitation. The fundamental problem is the reasoning bias, not the economic cost.",
      d: "Claude does not necessarily lose context. The problem is that it RETAINS too much context (its own reasoning), which biases the review."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Prompt engineering best practices (Chain complex prompts)",
        quote: "The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point."
      }
  },

  // ===== Batch Processing (7 questions, IDs 285-291) =====
  {
    id: 285,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "You are building the custom_id for each request in a batch. Which of these IDs is VALID according to the API rules?",
    options: [
      { id: "a", text: "\"user.request.001\" — uses dots as separators.", correct: false },
      { id: "b", text: "\"request_alpha-01\" — uses only alphanumerics, underscores, and hyphens.", correct: true },
      { id: "c", text: "\"req/batch/2024/item1\" — uses slashes to organize hierarchically.", correct: false },
      { id: "d", text: "\"a]b[c\" — any ASCII character is valid within 64 characters.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The custom_id must match the regex ^[a-zA-Z0-9_-]{1,64}$: only letters (uppercase and lowercase), digits, underscores (_), and hyphens (-), with a length of 1 to 64 characters.",
    whyOthersWrong: {
      a: "Dots (.) are not allowed in custom_id. Only letters, digits, underscores, and hyphens are accepted.",
      c: "Slashes (/) are not allowed. The regex only admits [a-zA-Z0-9_-].",
      d: "Not any ASCII character is valid. Only alphanumerics, underscores, and hyphens. Brackets and other special characters are not allowed."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Prepare and create your batch)",
        quote: "A unique custom_id for identifying the Messages request. Must be 1 to 64 characters and contain only alphanumeric characters, hyphens, and underscores (matching ^[a-zA-Z0-9_-]{1,64}$)."
      }
  },
  {
    id: 286,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "You are polling the status of a batch. What are the ONLY two possible values of processing_status?",
    options: [
      { id: "a", text: "\"queued\" and \"completed\" — representing the states before and after processing.", correct: false },
      { id: "b", text: "\"in_progress\" and \"ended\" — the batch is being processed or all requests have finished.", correct: true },
      { id: "c", text: "\"pending\", \"in_progress\", and \"completed\" — three states representing the lifecycle.", correct: false },
      { id: "d", text: "\"in_progress\", \"succeeded\", and \"failed\" — three states including the result.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "processing_status only has 2 possible values: 'in_progress' (the batch is being processed) and 'ended' (all requests have finished and results are available). There are no intermediate or result states at the batch level.",
    whyOthersWrong: {
      a: "Neither 'queued' nor 'completed' exist as processing_status values. The only values are 'in_progress' and 'ended'.",
      c: "There are not 3 states. Only exactly 2 exist: 'in_progress' and 'ended'. Neither 'pending' nor 'completed' exist.",
      d: "'succeeded' and 'failed' are concepts for individual request results, not batch-level states. The batch only has 'in_progress' and 'ended'."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Tracking your batch)",
        quote: "The Message Batch's processing_status field indicates the stage of processing the batch is in. It starts as in_progress, then updates to ended once all the requests in the batch have finished processing, and results are ready."
      }
  },
  {
    id: 287,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "A batch has finished processing. You review the results and find 4 different result types per request. What are they and which ones are billed?",
    options: [
      { id: "a", text: "succeeded (billed), errored (billed), canceled (not billed), expired (not billed).", correct: false },
      { id: "b", text: "succeeded (billed), errored (not billed), canceled (not billed), expired (not billed).", correct: true },
      { id: "c", text: "completed (billed), failed (billed), canceled (not billed), timeout (not billed).", correct: false },
      { id: "d", text: "succeeded (billed), errored (billed), timeout (not billed), skipped (not billed).", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 4 result types are: succeeded (successful, IS billed), errored (request or server error, NOT billed), canceled (user canceled the batch before processing the request, NOT billed), and expired (the batch reached its 24h expiration before processing the request, NOT billed).",
    whyOthersWrong: {
      a: "errored is NOT billed. Only 'succeeded' is billed. Requests with errors do not incur charges.",
      c: "The correct names are succeeded/errored/canceled/expired, not completed/failed/timeout. Furthermore, errored is not billed.",
      d: "The correct names are errored and expired, not errored and timeout/skipped. Furthermore, errored is NOT billed."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (4 result types table)",
        quote: "succeeded: Request was successful. Includes the message result. | errored: Request encountered an error and a message was not created. Possible errors include invalid requests and internal server errors. You will not be billed for these requests. | canceled: User canceled the batch before this request could be sent to the model. You will not be billed for these requests. | expired: Batch reached its 24 hour expiration before this request could be sent to the model. You will not be billed for these requests."
      }
  },
  {
    id: 288,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "What are the maximum limits per batch in the Message Batches API?",
    options: [
      { id: "a", text: "50,000 requests or 128MB, whichever is reached first.", correct: false },
      { id: "b", text: "100,000 requests or 256MB, whichever is reached first.", correct: true },
      { id: "c", text: "1,000,000 requests or 1GB, whichever is reached first.", correct: false },
      { id: "d", text: "No request limit, but maximum 512MB per batch.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Each batch can contain a maximum of 100,000 Message requests OR 256MB of total size, whichever is reached first. Most batches complete within 1 hour.",
    whyOthersWrong: {
      a: "The limits of 50,000 requests and 128MB are incorrect. The actual values are 100,000 requests and 256MB.",
      c: "1,000,000 requests and 1GB are excessively high. The actual limits are 100,000 requests and 256MB.",
      d: "There IS a request limit (100,000) and the size limit is 256MB, not 512MB."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Batch limitations)",
        quote: "A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first."
      }
  },
  {
    id: 289,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "You created a batch 25 days ago and need to download the results. Will you be able to access them?",
    options: [
      { id: "a", text: "Yes — results are available indefinitely as long as the account is active.", correct: false },
      { id: "b", text: "Yes — results are available for 29 days after batch creation.", correct: true },
      { id: "c", text: "No — results are deleted after 7 days.", correct: false },
      { id: "d", text: "No — results are deleted after 24 hours.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Batch results are available for download for 29 days after batch creation. After that period, the batch remains visible but the results can no longer be downloaded. At 25 days, you are still within the retention period.",
    whyOthersWrong: {
      a: "Results are NOT available indefinitely. They have a retention period of 29 days after creation.",
      c: "7 days is incorrect. The results retention period is 29 days.",
      d: "24 hours is the expiration time for batch PROCESSING, not results retention. Results persist for 29 days."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Batch limitations)",
        quote: "Batch results are available for 29 days after creation. After that, you may still view the Batch, but its results will no longer be available for download."
      }
  },
  {
    id: 290,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "What is the price discount that the Message Batches API offers compared to standard API prices?",
    options: [
      { id: "a", text: "25% discount on input and output tokens.", correct: false },
      { id: "b", text: "50% discount on input and output tokens.", correct: true },
      { id: "c", text: "75% discount on input tokens only; output tokens at standard price.", correct: false },
      { id: "d", text: "No discount on tokens, but no charge for individual requests.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The Message Batches API offers a 50% discount on both input and output tokens compared to standard prices. For example, Claude Opus 4.6 batch costs $2.50/MTok input and $12.50/MTok output versus $5/MTok and $25/MTok standard.",
    whyOthersWrong: {
      a: "The discount is not 25%. It is 50% — exactly half the standard price.",
      c: "The 50% discount applies to BOTH input AND output tokens, not just input.",
      d: "There IS a significant 50% discount on tokens. This is the main incentive for using batch processing."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Pricing)",
        quote: "The Batches API offers significant cost savings. All usage is charged at 50% of the standard API prices."
      }
  },
  {
    id: 291,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Claude Code for Continuous Integration",
    question: "When are the parameters (params) of each individual request within a batch validated?",
    options: [
      { id: "a", text: "Synchronously at the time of batch creation — validation errors prevent creation.", correct: false },
      { id: "b", text: "Asynchronously during processing — a request with invalid params results in 'errored' with invalid_request_error.", correct: true },
      { id: "c", text: "In two phases: schema validation at creation and content validation during processing.", correct: false },
      { id: "d", text: "They are not validated — params are sent directly to the model and any error is reflected in the response.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Parameter validation is performed ASYNCHRONOUSLY, not at the time of batch creation. This means a batch can be created successfully even with requests that have invalid params. These requests will appear as 'errored' with type 'invalid_request_error' in the results.",
    whyOthersWrong: {
      a: "Validation is NOT synchronous at creation time. Params are validated during asynchronous batch processing.",
      c: "There is no two-phase validation. All validation occurs asynchronously during processing.",
      d: "Params ARE validated — requests with invalid params result in 'errored'. They are not sent to the model without validation."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Batch processing (Test your batch requests tip)",
        quote: "Validation of the params object for each message request is performed asynchronously, and validation errors are returned when processing of the entire batch has ended. You can ensure that you are building your input correctly by verifying your request shape with the Messages API first."
      }
  },

  // ===== Structured Outputs (5 questions, IDs 292-296) =====
  {
    id: 292,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "What is the correct way to configure direct JSON outputs (not tool use) in the Claude API?",
    options: [
      { id: "a", text: "response_format: {type: \"json_object\"} in the request.", correct: false },
      { id: "b", text: "output_config: {format: {type: \"json_schema\", schema: {...}}} in the request.", correct: true },
      { id: "c", text: "output_format: \"json\" with json_schema: {...} as separate parameters.", correct: false },
      { id: "d", text: "content_type: \"application/json\" in the request headers.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The correct way is to use output_config.format with type: \"json_schema\" and the desired schema. The previous parameter output_format has been renamed to output_config.format, although the old one still works during the transition period.",
    whyOthersWrong: {
      a: "response_format: {type: \"json_object\"} is the OpenAI syntax, not the Claude API. Claude uses output_config.format.",
      c: "output_format as a top-level parameter is the old syntax (deprecated). Furthermore, json_schema does not go as a separate parameter but inside output_config.format.",
      d: "content_type in headers does not control Claude's response format. The control is at the request body level with output_config.format."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured outputs",
        quote: "output_config: { format: { type: \"json_schema\", schema: { type: \"object\", properties: {...}, required: [...], additionalProperties: false } } }"
      }
  },
  {
    id: 293,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "What is the difference between strict: true in tool use and output_config.format for getting valid JSON from Claude?",
    options: [
      { id: "a", text: "They are equivalent — both guarantee valid JSON in Claude's direct response.", correct: false },
      { id: "b", text: "strict: true validates tool use inputs against the schema; output_config.format controls the format of Claude's direct response as JSON.", correct: true },
      { id: "c", text: "strict: true is for the Python SDK and output_config.format is for the TypeScript SDK.", correct: false },
      { id: "d", text: "strict: true only validates the tool name; output_config.format validates the full content.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "They are two complementary features: strict: true in tool definitions guarantees that tool INPUTS comply with the defined schema. output_config.format controls the format of Claude's DIRECT RESPONSE as JSON. They can be used independently or together for end-to-end validation.",
    whyOthersWrong: {
      a: "They are not equivalent. strict: true operates on tool use inputs; output_config.format operates on Claude's direct response. They cover different aspects.",
      c: "Both are available in all SDKs. They are not language-specific.",
      d: "strict: true validates both the tool name and the inputs against the schema, not just the name."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured outputs",
        quote: "JSON outputs (output_config.format): Get Claude's response in a specific JSON format — Controls what Claude says (final response). Strict tool use (strict: true): Guarantee schema validation on tool names and inputs — Controls how Claude calls your functions (tool parameters). When combined, Claude can call tools with guaranteed-valid parameters AND return structured JSON responses."
      }
  },
  {
    id: 294,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "What is the correct SDK helper for defining structured output schemas in Python and TypeScript respectively?",
    options: [
      { id: "a", text: "Python uses dataclasses; TypeScript uses TypeBox.", correct: false },
      { id: "b", text: "Python uses Pydantic models; TypeScript uses Zod schemas.", correct: true },
      { id: "c", text: "Python uses marshmallow; TypeScript uses io-ts.", correct: false },
      { id: "d", text: "Both use JSON Schema directly without third-party helpers.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The Python SDK uses Pydantic models with client.messages.parse() and output_format=MyModel. The TypeScript SDK uses Zod schemas with zodOutputFormat() and client.messages.parse(). Both SDKs also support direct JSON Schema as an alternative.",
    whyOthersWrong: {
      a: "dataclasses and TypeBox are not the official helpers. Python uses Pydantic and TypeScript uses Zod in the Anthropic SDKs.",
      c: "marshmallow and io-ts are not the official helpers in the Anthropic SDKs. Pydantic and Zod are the integrated libraries.",
      d: "Although direct JSON Schema IS supported as an alternative, the official SDKs provide helpers (Pydantic and Zod) which are the recommended and more ergonomic approach."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured outputs",
        quote: "Python with Pydantic: client.messages.parse(model=..., output_format=ContactInfo). The parse() method automatically transforms your Pydantic model, validates the response, and returns a parsed_output attribute. TypeScript with Zod: import { zodOutputFormat } from \"@anthropic-ai/sdk/helpers/zod\"; output_config: { format: zodOutputFormat(ContactInfoSchema) }. The parse() method accepts a Zod schema, validates the response, and returns a parsed_output attribute with inferred TypeScript type matching the schema."
      }
  },
  {
    id: 295,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "In TypeScript, you use jsonSchemaOutputFormat() to define the schema. What happens if you omit `as const` in the schema definition?",
    options: [
      { id: "a", text: "The code does not compile — as const is required for TypeScript to accept the schema.", correct: false },
      { id: "b", text: "The inferred type collapses to 'unknown' — you lose type safety in the parsed result.", correct: true },
      { id: "c", text: "The schema is validated at runtime but not at compile time — functionally the same.", correct: false },
      { id: "d", text: "TypeScript infers the type correctly anyway — as const is just a best practice.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Without 'as const' in the schema definition passed to jsonSchemaOutputFormat(), TypeScript cannot infer the specific types from the schema. The inferred type collapses to 'unknown', losing all type safety in the parsed result. With 'as const', TypeScript infers the exact types from the schema.",
    whyOthersWrong: {
      a: "The code DOES compile without as const — it is not a compilation error. The problem is that you lose type inference.",
      c: "It is not functionally the same. Without as const, the parsed result's type is 'unknown', meaning you need unsafe manual type assertions.",
      d: "TypeScript does NOT infer correctly without as const. The type collapses to 'unknown', which is significantly worse than having the exact types."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured outputs",
        quote: "The as const assertion is required for compile-time type inference with jsonSchemaOutputFormat(). [...] Without as const, TypeScript cannot narrow the property types, and the inferred type collapses to unknown. The as const assertion enables TypeScript to infer the exact structure of your literal object expression."
      }
  },
  {
    id: 296,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Structured Data Extraction",
    question: "What guarantees do Claude's Structured Outputs provide compared to using prompt instructions to generate JSON?",
    options: [
      { id: "a", text: "Faster response speed and lower token consumption.", correct: false },
      { id: "b", text: "Always valid JSON, guaranteed types, required fields present — no need for retries due to schema violations.", correct: true },
      { id: "c", text: "They only guarantee the response is parseable JSON, but not that it complies with a specific schema.", correct: false },
      { id: "d", text: "The same guarantees as prompt instructions but with lower latency.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Structured Outputs uses constrained decoding to guarantee: always valid JSON (no JSON.parse() errors), correct field types, required fields always present, and exact schema compliance. This eliminates the need for retries due to schema violations.",
    whyOthersWrong: {
      a: "Structured Outputs do not guarantee faster speed or lower token consumption. Their benefit is guaranteed format correctness.",
      c: "Structured Outputs guarantee much more than parseable JSON — they guarantee full schema compliance including types and required fields.",
      d: "Prompt instructions CANNOT guarantee the same thing. They are probabilistic — they can fail. Structured Outputs are deterministic via constrained decoding."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Structured outputs",
        quote: "Structured outputs guarantee three key properties: Always Valid JSON — No more JSON.parse() errors. Type Safe — Guaranteed field types and required fields: Required fields are always present; Field types match your schema definition; No missing or unexpected field types. No Retries Needed — Reliable: No retries needed for schema violations."
      }
  },

  // ===== Context Window (4 questions, IDs 297-300) =====
  {
    id: 297,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "How many items are loaded at the start of a Claude Code session and approximately how many tokens do they consume before the user's first prompt?",
    options: [
      { id: "a", text: "4 items consuming approximately 3,500 tokens.", correct: false },
      { id: "b", text: "7 items consuming approximately 7,850 tokens.", correct: true },
      { id: "c", text: "10 items consuming approximately 12,000 tokens.", correct: false },
      { id: "d", text: "3 items (system prompt, CLAUDE.md, auto memory) consuming approximately 5,000 tokens.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "7 items are loaded at startup: (1) system prompt ~4,200 tokens, (2) auto memory ~680 tokens, (3) environment info ~280 tokens, (4) MCP tools deferred ~120 tokens, (5) skill descriptions ~450 tokens, (6) ~/.claude/CLAUDE.md ~320 tokens, (7) project CLAUDE.md ~1,800 tokens. Total: approximately 7,850 tokens.",
    whyOthersWrong: {
      a: "There are 7 items, not 4. And the total consumption is ~7,850 tokens, not 3,500.",
      c: "There are 7 items, not 10. And the consumption is ~7,850 tokens, not 12,000.",
      d: "There are 7 items loaded at startup, not just 3. In addition to the system prompt, CLAUDE.md, and auto memory, environment info, MCP tools, skill descriptions, and ~/.claude/CLAUDE.md are also loaded."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Context window (Explore the context window)",
        quote: "System prompt (4,200 tokens); Auto memory MEMORY.md (680 tokens); Environment info (280 tokens); MCP tools deferred (120 tokens); Skill descriptions (450 tokens); ~/.claude/CLAUDE.md (320 tokens); Project CLAUDE.md (1,800 tokens). Before you type anything: CLAUDE.md, auto memory, MCP tool names, and skill descriptions all load into context."
      }
  },
  {
    id: 298,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "When a context compaction occurs, the summary that replaces the conversation represents approximately what percentage of the original token count?",
    options: [
      { id: "a", text: "~5% — very aggressive compression that preserves only key points.", correct: false },
      { id: "b", text: "~12% — preserves user requests/intent, technical concepts, modified files, errors, and pending tasks.", correct: true },
      { id: "c", text: "~25% — moderate compression that preserves most detail.", correct: false },
      { id: "d", text: "~50% — preserves half the conversation verbatim.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Compaction produces a summary that represents approximately 12% of the original token count. The summary preserves: user requests/intent, key technical concepts, examined/modified files with code snippets, errors and fixes, pending tasks, and current work.",
    whyOthersWrong: {
      a: "5% would be too aggressive and would lose too much context. The actual ratio is ~12%.",
      c: "25% is too high. Compaction is more aggressive than that, producing ~12% of the original.",
      d: "50% is not significant compaction. The actual ratio is ~12%, which allows recovering a substantial portion of the context window."
    },
      docStatus: "PARTIAL",
      docReference: {
        source: "Anthropic Docs — Context window (compaction summary)",
        quote: "All conversation events condensed into one structured summary. The summary keeps: your requests and intent, key technical concepts, files examined or modified with important code snippets, errors and how they were fixed, pending tasks, and current work. It replaces the verbatim conversation: full tool outputs and intermediate reasoning are gone."
      }
  },
  {
    id: 299,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "After a compaction, what happens with the listing of skill descriptions that was in the context?",
    options: [
      { id: "a", text: "All skill descriptions survive compaction and are automatically re-injected.", correct: false },
      { id: "b", text: "The listing of skill descriptions does NOT survive compaction — only skills that were invoked are preserved (with token limits).", correct: true },
      { id: "c", text: "Descriptions are compressed to 50% but all remain available.", correct: false },
      { id: "d", text: "Only descriptions of skills with disable-model-invocation: false survive.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The general listing of skill descriptions does NOT survive compaction. Only skills that were actually invoked during the session are preserved, subject to the limit of 5,000 tokens per skill and 25,000 tokens total. Skills with disable-model-invocation: true cost ZERO context until manually invoked.",
    whyOthersWrong: {
      a: "Skill descriptions (the general listing) do NOT survive. Only invoked skills are preserved with token limits.",
      c: "There is no 50% compression of descriptions. The complete listing is lost; only invoked skills are preserved.",
      d: "Survival does not depend on the disable-model-invocation value. It depends on whether the skill was invoked during the session or not."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Context window (What survives compaction)",
        quote: "One-line descriptions of available skills so Claude knows what it can invoke. Full skill content loads only when Claude actually uses one. Skills with disable-model-invocation: true are not in this list. They stay completely out of context until you invoke them with /name. Unlike the rest of the startup content, this listing is not re-injected after /compact. Only skills you actually invoked get preserved."
      }
  },
  {
    id: 300,
    domain: "Context Management & Reliability",
    domainId: 5,
    scenario: "Developer Productivity",
    question: "What is the context window size in Claude Code and what items are automatically re-injected as 'persistent' after each compaction?",
    options: [
      { id: "a", text: "128K tokens. Only the system prompt and project CLAUDE.md are re-injected.", correct: false },
      { id: "b", text: "200K tokens. Re-injected items: system prompt, auto memory (MEMORY.md), environment info, MCP tools (deferred), ~/.claude/CLAUDE.md, and project CLAUDE.md.", correct: true },
      { id: "c", text: "200K tokens. All startup items are re-injected including skill descriptions and subdirectory CLAUDE.md files.", correct: false },
      { id: "d", text: "256K tokens. Only the system prompt, auto memory, and project CLAUDE.md are re-injected.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The context window is 200,000 tokens (200K). The items that survive compaction (persistent) are: system prompt, auto memory (MEMORY.md), environment info, MCP tools (deferred), ~/.claude/CLAUDE.md, and project CLAUDE.md. Skill descriptions and subdirectory CLAUDE.md files are NOT automatically re-injected.",
    whyOthersWrong: {
      a: "The context is 200K tokens, not 128K. Furthermore, more items than just the system prompt and project CLAUDE.md are re-injected.",
      c: "Skill descriptions are NOT automatically re-injected after compaction. Subdirectory CLAUDE.md files are not either — they are reloaded on demand.",
      d: "The context is 200K, not 256K. Furthermore, persistent items are missing such as environment info, MCP tools, and ~/.claude/CLAUDE.md."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Context window (What survives compaction table)",
        quote: "System prompt and output style — Unchanged; not part of message history. Project-root CLAUDE.md and unscoped rules — Re-injected from disk. Auto memory — Re-injected from disk. Rules with paths: frontmatter — Lost until a matching file is read again. Nested CLAUDE.md in subdirectories — Lost until a file in that subdirectory is read again. Invoked skill bodies — Re-injected, capped at 5,000 tokens per skill and 25,000 tokens total; oldest dropped first."
      }
  },

  // ===== Hooks in settings.json (4 questions, IDs 301-304) =====
  {
    id: 301,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "What are the 4 handler types available for hooks in Claude Code?",
    options: [
      { id: "a", text: "command, http, script, webhook.", correct: false },
      { id: "b", text: "command, http, prompt, agent.", correct: true },
      { id: "c", text: "shell, api, llm, subprocess.", correct: false },
      { id: "d", text: "command, websocket, prompt, plugin.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The 4 handler types for hooks are: (1) command — executes a shell script/command, (2) http — makes an HTTP request to a URL, (3) prompt — sends a prompt to an LLM model for evaluation, (4) agent — invokes an agent for more complex verification.",
    whyOthersWrong: {
      a: "The types 'script' and 'webhook' do not exist. The correct types are command, http, prompt, and agent.",
      c: "The types 'shell', 'api', 'llm', and 'subprocess' do not exist. The correct names are command, http, prompt, and agent.",
      d: "The types 'websocket' and 'plugin' do not exist. The correct types are command, http, prompt, and agent."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Hooks",
        quote: "Command Hooks (type: \"command\"): Run shell commands that receive JSON input on stdin and communicate results through exit codes and stdout. HTTP Hooks (type: \"http\"): Send the event's JSON input as an HTTP POST request to a URL. Prompt Hooks (type: \"prompt\"): Send a prompt to a Claude model for single-turn evaluation. The model returns a yes/no decision as JSON. Agent Hooks (type: \"agent\"): Spawn a subagent that can use tools like Read, Grep, and Glob to verify conditions before returning a decision."
      }
  },
  {
    id: 302,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "Your PreToolUse hook returns exit code 2 when it detects a dangerous command. What effect does exit code 2 have specifically on the PreToolUse event?",
    options: [
      { id: "a", text: "Shows a warning to Claude but allows the tool call to continue.", correct: false },
      { id: "b", text: "BLOCKS the tool call entirely — the action is not executed. Any JSON in stdout is ignored.", correct: true },
      { id: "c", text: "Terminates the entire Claude Code session immediately.", correct: false },
      { id: "d", text: "Retries the tool call with modified parameters from the JSON in stdout.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "Exit code 2 on PreToolUse is a blocking error: it completely blocks the tool call, the action is not executed, and any JSON in stdout is ignored. It is the primary mechanism for implementing security guards that prevent dangerous actions.",
    whyOthersWrong: {
      a: "Exit code 2 is not a warning — it is a TOTAL BLOCK. The tool call is not executed under any circumstances.",
      c: "Exit code 2 does not terminate the session. It only blocks the specific tool call. The session continues normally.",
      d: "There is no automatic retry mechanism. JSON in stdout is IGNORED when the exit code is 2. No output data from the hook is used."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Hooks (Exit Code 2 Blocking)",
        quote: "When a PreToolUse hook exits with code 2: The tool call is blocked before execution. The stderr message is fed back to Claude. Claude sees the reason and can adjust its approach. JSON output is only processed on exit 0. If you exit 2, any JSON is ignored and stderr becomes the feedback mechanism."
      }
  },
  {
    id: 303,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "A hook generates an additionalContext output of 15,000 characters. What happens with this output?",
    options: [
      { id: "a", text: "It is silently truncated to 10,000 characters and injected into context.", correct: false },
      { id: "b", text: "It is saved to a file, replaced with a preview plus the file path, respecting the 10,000-character cap.", correct: true },
      { id: "c", text: "It is completely rejected and the hook fails with a size error.", correct: false },
      { id: "d", text: "It is accepted without modification — there is no size limit for additionalContext.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "The additionalContext, systemMessage, and updatedMCPToolOutput fields have a 10,000-character cap. When the output exceeds this limit, it is saved to a file and replaced with a preview plus the path to the full file. It is not silently truncated or rejected.",
    whyOthersWrong: {
      a: "It is not silently truncated. The full content is saved to a file and a reference to the file is provided.",
      c: "It is not rejected with an error. The mechanism is save to file + preview, not failure.",
      d: "There IS a 10,000-character limit for these fields. Content exceeding the limit is handled with the file + preview mechanism."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Hooks (additionalContext cap)",
        quote: "Hook output injected into context (additionalContext, systemMessage, or plain stdout) is capped at 10,000 characters. Output that exceeds this limit is saved to a file and replaced with a preview and file path, the same way large tool results are handled."
      }
  },
  {
    id: 304,
    domain: "Claude Code Configuration & Workflows",
    domainId: 3,
    scenario: "Code Generation with Claude Code",
    question: "You configure a hook with `\"asyncRewake\": true`. What is the exact behavior of this hook?",
    options: [
      { id: "a", text: "The hook executes synchronously but with an extended timeout for long operations.", correct: false },
      { id: "b", text: "The hook executes in the background (implies async: true) and WAKES Claude when it finishes with exit code 2 — stderr is shown to Claude as a system reminder.", correct: true },
      { id: "c", text: "The hook executes in the background and notifies the user (not Claude) when it finishes.", correct: false },
      { id: "d", text: "The hook creates an asynchronous subagent that executes the task and returns results to the main agent.", correct: false }
    ],
    correctAnswer: "b",
    explanation: "asyncRewake: true implies async: true (runs in the background). Execution continues immediately. The special feature is that when the hook finishes with exit code 2, it WAKES Claude. The hook's stderr is shown to Claude as a system reminder, allowing it to react to the result.",
    whyOthersWrong: {
      a: "asyncRewake is NOT synchronous. It implies async: true, so it runs in the background. It has nothing to do with extended timeouts.",
      c: "asyncRewake wakes CLAUDE, it does not just notify the user. The stderr is shown to Claude as a system reminder so it can act on the information.",
      d: "asyncRewake does not create a subagent. It is a background hook that can wake Claude. Subagents are a completely different concept."
    },
      docStatus: "STRONG",
      docReference: {
        source: "Anthropic Docs — Hooks (asyncRewake field documentation)",
        quote: "asyncRewake: If true, runs in the background and wakes Claude on exit code 2. Implies async. The hook's stderr, or stdout if stderr is empty, is shown to Claude as a system reminder so it can react to a long-running background failure."
      }
  }
];
