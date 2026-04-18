# Skilljar API Course Remaining Lessons — Extracted Content

## Source Course
**Building with the Claude API:** https://anthropic.skilljar.com/claude-with-the-anthropic-api

**Note:** Lesson content behind Skilljar authentication was supplemented with official Anthropic documentation at docs.anthropic.com / platform.claude.com and the MCP specification at modelcontextprotocol.io.

---

## RAG AND AGENTIC SEARCH SECTION

### Lesson: Introducing Retrieval Augmented Generation (RAG)
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287763

**Key Facts:**
- RAG = Retrieval Augmented Generation — technique to provide Claude with relevant external data at query time
- Problem: Including all information in prompts leads to high costs, slower response times, and context window limits
- Solution: Retrieve only relevant information from a knowledge base and include it in the prompt
- RAG pipeline: User query → Retrieve relevant documents → Include in prompt → Claude generates answer
- Benefits: Reduced costs, faster responses, avoids context window limits, access to up-to-date information
- Best for: Large amounts of static and dynamic context, frequently changing information
- Alternative to fine-tuning — keeps model general while providing specific context

---

### Lesson: Text Chunking Strategies
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287776

**Key Facts:**
- Before documents can be searched, they must be split into manageable chunks
- Chunking breaks large documents into smaller pieces suitable for embedding and retrieval
- Common strategies:
  - **Fixed-size chunking:** Split by character/token count (e.g., every 500 tokens). Simple but may break context.
  - **Sentence-based chunking:** Split at sentence boundaries. Preserves meaning better.
  - **Paragraph-based chunking:** Split at paragraph boundaries. Good for structured documents.
  - **Semantic chunking:** Use meaning/topic shifts to determine boundaries. Most sophisticated.
  - **Recursive chunking:** Try large chunks first, recursively split if too large.
- Chunk size tradeoffs:
  - Smaller chunks = more precise retrieval but may lose context
  - Larger chunks = more context but less precise retrieval and more tokens consumed
- Overlap: Add overlapping text between chunks to prevent losing context at boundaries
- For citations: put each RAG chunk into a plain text document so Claude can cite specific sentences
- PDFs are automatically chunked into sentences by default

---

### Lesson: Text Embeddings
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287759
**Official docs:** https://platform.claude.com/docs/en/docs/embeddings

**Key Facts:**
- Text embeddings = numerical vector representations of text that capture semantic meaning
- Similar texts have similar embeddings (close in vector space)
- Anthropic does NOT offer its own embedding model
- Recommended provider: **Voyage AI** (state-of-the-art, customizable, domain-specific models)

**Voyage AI Models:**
| Model | Context | Dimensions | Use Case |
|-------|---------|------------|----------|
| `voyage-3-large` | 32K | 1024 (default) | Best general-purpose and multilingual |
| `voyage-3.5` | 32K | 1024 (default) | Balanced performance |
| `voyage-3.5-lite` | 32K | 1024 (default) | Optimized for latency/cost |
| `voyage-code-3` | 32K | 1024 (default) | Optimized for code retrieval |
| `voyage-finance-2` | 32K | 1024 | Finance RAG |
| `voyage-law-2` | 16K | 1024 | Legal and long-context |

**Usage:**
```python
import voyageai
vo = voyageai.Client()
# For documents
doc_embds = vo.embed(documents, model="voyage-3.5", input_type="document").embeddings
# For queries
query_embd = vo.embed([query], model="voyage-3.5", input_type="query").embeddings[0]
```

**Critical:** Use `input_type="document"` for documents and `input_type="query"` for queries — different prompts are prepended internally for better retrieval.

**Similarity:** Voyage embeddings are normalized to length 1, so dot-product = cosine similarity.

---

### Lesson: The Full RAG Flow
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287764

**Key Facts:**
- Complete RAG pipeline:
  1. **Indexing phase (offline):** Chunk documents → Embed chunks with Voyage AI → Store in vector database
  2. **Query phase (online):** Embed user query → Search vector DB for similar chunks → Include top-K results in prompt → Claude generates answer
- Vector databases store embeddings with metadata for efficient similarity search
- Top-K retrieval: retrieve the K most similar chunks (typically K=3 to 10)
- Include retrieved chunks in the system prompt or user message with clear XML tags
- Example prompt structure:
  ```
  <context>
  {retrieved_chunk_1}
  {retrieved_chunk_2}
  </context>
  Based on the context above, answer: {user_query}
  ```

---

### Lesson: BM25 Lexical Search
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287767

**Key Facts:**
- BM25 = Best Matching 25 — a lexical/keyword-based search algorithm
- Complements semantic search (embeddings) with exact keyword matching
- BM25 scores documents based on:
  - **Term frequency (TF):** How often the search term appears in a document
  - **Inverse document frequency (IDF):** How rare the term is across all documents (rarer = more important)
  - **Document length normalization:** Shorter documents get slight boost
- Strengths:
  - Great for exact keyword matches, technical terms, proper nouns, codes
  - Fast and efficient
  - No need for embedding model
- Weaknesses:
  - No semantic understanding (misses synonyms, paraphrases)
  - Can't handle conceptual queries
- Best used in combination with semantic search for robust retrieval

---

### Lesson: A Multi-Index RAG Pipeline
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287766

**Key Facts:**
- Combines multiple retrieval methods for better results than either alone
- Hybrid approach: semantic search (embeddings) + lexical search (BM25)
- Pipeline:
  1. User query → Run both semantic search AND BM25 search in parallel
  2. Semantic search returns conceptually similar results
  3. BM25 returns keyword-matched results
  4. **Reciprocal Rank Fusion (RRF)** or other fusion methods combine and re-rank results
  5. Top-K combined results sent to Claude
- Benefits:
  - Catches both semantic matches AND exact keyword matches
  - More robust than either method alone
  - Handles diverse query types (conceptual + specific)
- Contextual retrieval: adding brief context to each chunk before embedding improves retrieval quality

---

## PROMPT EVALUATION SECTION

### Lesson: Prompt Evaluation
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287731

**Key Facts:**
- 3 approaches to testing prompts:
  1. Test once (risky — no confidence in reliability)
  2. Test a few times (better — some signal)
  3. **Evaluation pipeline** (best — data-driven, catches problems before production)
- Evaluation = systematic testing of prompt performance against defined criteria
- Central to prompt engineering cycle: test cases → preliminary prompt → iterative testing → final validation → ship

---

### Lesson: A Typical Eval Workflow
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287736

**Key Facts:**
- Eval workflow steps:
  1. Define success criteria (specific, measurable, achievable, relevant)
  2. Create test dataset (representative of real-world distribution)
  3. Run eval against the dataset
  4. Grade results (code-based, model-based, or human)
  5. Analyze results and iterate on prompt
  6. Validate final prompt against held-out test set
- Success criteria examples:
  - Task fidelity (F1, accuracy)
  - Consistency (cosine similarity between similar inputs)
  - Relevance and coherence (ROUGE-L)
  - Tone and style (Likert scale)
  - Privacy preservation (binary classification)
  - Context utilization (ordinal scale)
  - Latency (response time)
  - Price (cost per call)
- Most use cases need multidimensional evaluation along several criteria

---

### Lesson: Generating Test Datasets
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287739

**Key Facts:**
- Test datasets should mirror real-world task distribution
- Methods for creating test cases:
  1. Manually write representative examples
  2. Use Claude to automatically generate test cases from a baseline set
  3. Import from CSV files
- Include edge cases: irrelevant input, overly long input, harmful user input, ambiguous cases
- Separate datasets: development set (for tuning) and held-out test set (for final validation)
- Don't forget edge cases that even humans would find hard to assess

---

### Lesson: Running the Eval
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287743

**Key Facts:**
- Run prompt against all test cases programmatically
- Collect model outputs for grading
- Automate when possible: structure questions for automated grading (multiple-choice, string match, code-graded, LLM-graded)
- Prioritize volume over quality: more questions with automated grading > fewer with hand-grading

---

### Lesson: Model-Based Grading
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287742

**Key Facts:**
- Use an LLM (often a different model) to grade outputs
- Fast, flexible, scalable, suitable for complex judgment
- Best practice: use a different model to evaluate than the one that generated the output

**Tips for LLM-based grading:**
- Have detailed, clear rubrics
- Be empirical/specific: instruct LLM to output only 'correct'/'incorrect' or score 1-5
- Encourage reasoning: ask LLM to think first (in tags), then decide score — increases evaluation performance

**Example grading prompt:**
```python
def build_grader_prompt(answer, rubric):
    return f"""Grade this answer based on the rubric:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Think through your reasoning in <thinking> tags,
    then output 'correct' or 'incorrect' in <result> tags."""
```

**Evaluation types by criteria:**
| Criteria | Method | Metric |
|----------|--------|--------|
| Task fidelity | Exact match | `output == golden_answer` |
| Consistency | Cosine similarity | SBERT embeddings comparison |
| Relevance | ROUGE-L | Longest common subsequence |
| Tone/style | LLM Likert scale | 1-5 rating |
| Privacy | LLM binary classification | yes/no PHI detection |
| Context utilization | LLM ordinal scale | 1-5 rating |

---

### Lesson: Code-Based Grading
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287737

**Key Facts:**
- Fastest, most reliable, extremely scalable grading method
- Lacks nuance for complex judgments requiring less rule-based rigidity
- Types:
  - **Exact match:** `output == golden_answer`
  - **String match:** `key_phrase in output`
  - **Regex match:** Pattern matching on output
  - **Structural validation:** JSON schema validation, format checks
- Grading method priority (choose fastest reliable method):
  1. Code-based grading (fastest, most reliable, scalable)
  2. LLM-based grading (fast, flexible, test reliability first)
  3. Human grading (most flexible, highest quality, but slow and expensive — avoid if possible)

---

## FEATURES OF CLAUDE SECTION

### Lesson: Image Support
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287778
**Official docs:** https://platform.claude.com/docs/en/docs/build-with-claude/vision

**Key Facts:**
- All current Claude models support text and image input
- Multiple images can be analyzed jointly in a single request (comparing/contrasting)
- Three ways to provide images: base64-encoded, URL reference, Files API (`file_id`)

**Image Limits:**
- Max images per message: 20 (claude.ai), 100 (API, 200K context), 600 (API, other models)
- Max dimensions: 8000x8000 px (reduced to 2000x2000 if >20 images in request)
- Request size limit: 32 MB
- Supported formats: JPEG, PNG, GIF, WebP (animations not supported — first frame only)

**Token Calculation:**
- Approximate tokens: `width * height / 750`
- Max native resolution per image:
  - Claude Opus 4.7: 4784 tokens, max 2576px long edge (high-resolution, automatic)
  - Other models: 1568 tokens, max 1568px long edge
- Larger images are resized preserving aspect ratio, padded to multiple of 28px

**API Example (Python):**
```python
message = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_data
                }
            },
            {"type": "text", "text": "Describe this image."}
        ]
    }]
)
```

**URL-based image:**
```python
{
    "type": "image",
    "source": {
        "type": "url",
        "url": "https://example.com/image.jpg"
    }
}
```

**Best Practices:**
- Place images BEFORE text in requests (like long documents before queries)
- Ensure images are clear and legible
- Pre-resize/crop images to control token costs
- Use Files API for repeatedly-used images

---

### Lesson: PDF Support
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287768
**Official docs:** https://platform.claude.com/docs/en/docs/build-with-claude/pdf-support

**Key Facts:**
- All active Claude models support PDF processing
- Can analyze text, pictures, charts, tables in PDFs
- Since PDF support uses vision capabilities, subject to same vision limitations

**PDF Limits:**
| Requirement | Limit |
|-------------|-------|
| Max request size | 32 MB |
| Max pages per request | 600 (100 for 200K context models) |
| Format | Standard PDF (no passwords/encryption) |

**How it works:**
1. System converts each page into an image + extracts text
2. Claude analyzes both text and images together
3. Claude responds referencing both textual and visual content

**Three ways to send PDFs:**
1. **URL reference:** `{"type": "document", "source": {"type": "url", "url": "..."}}`
2. **Base64-encoded:** `{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": "..."}}`
3. **Files API:** `{"type": "document", "source": {"type": "file", "file_id": "..."}}`

**Token Costs:**
- Text: 1,500-3,000 tokens per page (depends on content density)
- Image: Same image-based cost calculations as vision
- No additional PDF fees — standard API pricing applies

**Best Practices:**
- Place PDFs before text in requests
- Use standard fonts, ensure text is legible
- Rotate pages to proper upright orientation
- Use logical page numbers in prompts
- Split large PDFs into chunks when needed
- Enable prompt caching for repeated analysis (`cache_control: {"type": "ephemeral"}`)
- Use batch processing for high-volume workflows

---

### Lesson: Overview of Claude Models
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287722
**Official docs:** https://platform.claude.com/docs/en/docs/about-claude/models

**Key Facts — Latest Models:**

| Feature | Claude Opus 4.7 | Claude Sonnet 4.6 | Claude Haiku 4.5 |
|---------|-----------------|-------------------|-------------------|
| API ID | claude-opus-4-7 | claude-sonnet-4-6 | claude-haiku-4-5-20251001 |
| Pricing (input/output MTok) | $5 / $25 | $3 / $15 | $1 / $5 |
| Extended thinking | No | Yes | Yes |
| Adaptive thinking | Yes | Yes | No |
| Context window | 1M tokens | 1M tokens | 200K tokens |
| Max output | 128K tokens | 64K tokens | 64K tokens |
| Reliable knowledge cutoff | Jan 2026 | Aug 2025 | Feb 2025 |
| Latency | Moderate | Fast | Fastest |
| Description | Most capable, agentic coding | Best speed + intelligence | Fastest, near-frontier |

**Key Legacy Models:**
- Claude Opus 4.6: $5/$25, 1M context, 128K output, extended thinking: Yes
- Claude Sonnet 4.5: $3/$15, 200K context, 64K output
- Claude Opus 4.5: $5/$25, 200K context, 64K output
- Claude Opus 4.1: $15/$75, 200K context, 32K output

**Deprecation Notices:**
- Claude Sonnet 4 and Claude Opus 4 deprecated — retire June 15, 2026
- Claude Haiku 3 deprecated — retire April 19, 2026

**Choosing a model:** Start with Claude Opus 4.7 for complex tasks. Use Sonnet 4.6 for speed+intelligence balance. Use Haiku 4.5 for fastest/cheapest.

**Model capabilities:** Query programmatically via Models API (`/v1/models`) for `max_input_tokens`, `max_tokens`, `capabilities`.

**Batch API:** Opus 4.7, Opus 4.6, and Sonnet 4.6 support up to 300K output tokens with `output-300k-2026-03-24` beta header.

---

### Lesson: Environment Inspection
**Skilljar URL:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/287798

**Key Facts:**
- Part of the Agents and Workflows section
- Environment inspection = examining the runtime environment and available resources before executing agent tasks
- Agents should inspect their environment to understand:
  - What tools are available
  - What resources/data they can access
  - What constraints exist (permissions, rate limits, timeouts)
  - Current system state and context
- Pattern: Before starting work, agent gathers information about capabilities and constraints
- Enables robust agent behavior — agents adapt to available tools rather than assuming fixed setup
- Related to the Explore built-in subagent pattern: investigate before acting
- Practical application: Claude Code inspects project structure (files, languages, frameworks) before making changes
- Best practice: Start agent workflows with an inspection/exploration phase

---

## Summary of All Remaining Lessons by Section

### RAG Section (6 lessons)
| Lesson | Skilljar ID | Status |
|--------|-------------|--------|
| Introducing RAG | 287763 | Extracted above |
| Text chunking strategies | 287776 | Extracted above |
| Text embeddings | 287759 | Extracted above |
| The full RAG flow | 287764 | Extracted above |
| BM25 lexical search | 287767 | Extracted above |
| A Multi-Index RAG pipeline | 287766 | Extracted above |
| Implementing the RAG flow | 287761 | Exercise/hands-on (no separate conceptual content) |

### Prompt Evaluation Section (6 lessons)
| Lesson | Skilljar ID | Status |
|--------|-------------|--------|
| Prompt evaluation | 287731 | Extracted above |
| A typical eval workflow | 287736 | Extracted above |
| Generating test datasets | 287739 | Extracted above |
| Running the eval | 287743 | Extracted above |
| Model based grading | 287742 | Extracted above |
| Code based grading | 287737 | Extracted above |

### Features Section (2 lessons)
| Lesson | Skilljar ID | Status |
|--------|-------------|--------|
| Image support | 287778 | Extracted above |
| PDF support | 287768 | Extracted above |

### Other Lessons
| Lesson | Skilljar ID | Status |
|--------|-------------|--------|
| Overview of Claude models | 287722 | Extracted above |
| Environment inspection | 287798 | Extracted above |
