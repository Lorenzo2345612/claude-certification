# AI Capabilities and Limitations -- Skilljar Course Extraction

**Course URL:** https://anthropic.skilljar.com/ai-capabilities-and-limitations
**Provider:** Anthropic Academy
**Format:** Free, self-paced, certificate on completion
**Prerequisite:** None (no Anthropic account required)
**Companion to:** AI Fluency: Framework & Foundations (the 4D Framework course)

---

## Course Overview

This course "gives learners a working mental model of how modern generative AI systems behave and why." It is the companion to the 4D Framework course: where that course teaches the **human** competencies (Delegation, Description, Discernment, Diligence), this one teaches the **machine properties** those competencies are responding to.

### Learning Objectives
By the end, learners can:
1. Look at an unexpected AI output and **recognize which kind of unexpected it is**
2. Locate roughly **where on a capability-to-limitation continuum** their task landed
3. **Respond with a targeted fix** rather than guessing

---

## Full Curriculum Structure

| # | Section | Lessons |
|---|---------|---------|
| 1 | Getting Started | (Intro/orientation) |
| 2 | Intro to AI Capabilities and Limitations | What We Mean by AI; How AI Gets Its Character |
| 3 | Next Token Prediction | Next Token Prediction (lesson); Try it out |
| 4 | Knowledge | Knowledge (lesson); Try it out |
| 5 | Working Memory | Working Memory (lesson); Try it out |
| 6 | Steerability | Steerability (lesson); Try it out |
| 7 | Putting It All Together and Next Steps | When Properties Collide; Next Steps; Course Quiz |

**Pattern:** Each core property section has a concept lesson followed by a hands-on "Try it out" interactive exercise.

---

## Section 1: Getting Started

Orientation to the course, including how to navigate the platform and what to expect from the learning experience.

---

## Section 2: Intro to AI Capabilities and Limitations

### Lesson: What We Mean by AI

Establishes the scope of "AI" as used throughout the course. Modern generative AI refers specifically to large language models (LLMs) trained on massive text corpora to generate human-like text. These systems:
- Generate text one token at a time
- Are trained through a multi-stage process
- Have both remarkable capabilities and inherent limitations
- Are not general-purpose intelligence but specialized statistical systems

### Lesson: How AI Gets Its Character

Covers the multi-stage training pipeline that shapes AI behavior:

**Pre-training:**
- Learning patterns from vast text corpora
- Develops base capabilities through next-token prediction on internet-scale data
- Produces a "raw" model with broad knowledge but no specific behavioral alignment

**Fine-tuning:**
- Adapting pre-trained models for specific tasks and behaviors
- RLHF (Reinforcement Learning from Human Feedback) -- training the model based on human preference judgments
- RLAIF (RL from AI Feedback) -- using AI systems to provide feedback

**Constitutional AI (Anthropic's approach):**
- Gives the AI a set of principles (a "constitution") against which it evaluates its own outputs
- Two phases: supervised learning (self-critique and revision) + reinforcement learning
- The AI uses the Constitution to correct itself rather than relying solely on human contractors
- When Claude encounters a scenario, it considers its values and uses judgment rather than looking up a specific rule
- Character vs. rules -- building principled behavior rather than rule-following

**Key insight:** Understanding how AI gets its character helps users predict when the model will comply, push back, or refuse -- directly connecting to the Delegation competency in the 4D Framework.

---

## Section 3: Next Token Prediction

### Lesson: Next Token Prediction

The foundational mechanism underlying all modern LLMs.

**Core concept:** LLMs are optimized on next-token prediction -- given a sequence of tokens, predict the most likely next token. During training, the system is rewarded or punished depending on whether it correctly predicts the hidden next word.

**Key nuances:**
- While trained on next-token prediction, reducing LLMs to "just next-token predictors" is misleading
- Models develop internal representations that go far beyond simple word prediction
- Research shows Claude sometimes **plans several moves ahead** internally (e.g., when writing a rhyming poem, it figures out the target rhyming word in advance, then selects words leading up to it)
- The model generates text one token at a time but "may think on much longer horizons to do so"
- This provides strong evidence against the "just predicting words" critique

**Capability side:**
- Coherent multi-paragraph generation
- Logical reasoning chains
- Code generation that follows complex syntax rules
- Creative writing with structure and intent

**Limitation side:**
- Can generate plausible-sounding but factually incorrect information (hallucinations)
- Statistical patterns can lead to confident-sounding wrong answers
- The generative process has no built-in truth-verification mechanism
- Temperature settings affect the probability distribution of token selection

### Exercise: Try It Out
Hands-on exercise exploring how next-token prediction manifests in AI behavior, observing both capabilities and failure modes.

---

## Section 4: Knowledge

### Lesson: Knowledge

How LLMs acquire, store, and apply knowledge -- and where this breaks down.

**Knowledge capabilities:**
- Vast factual knowledge encoded during pre-training from internet-scale data
- Ability to synthesize information across domains
- Pattern recognition and analogy-making
- Multi-lingual knowledge

**Knowledge limitations:**
- **Knowledge cutoff** -- training data has a date boundary; the model does not know about events after this date
- **No real-time information access** (without tools/retrieval)
- **Uneven knowledge distribution** -- more coverage of well-represented topics in training data
- **Cannot verify its own knowledge** -- may state incorrect information with high confidence
- **Confabulation** -- filling gaps with plausible-sounding but fabricated information

**Capability-to-limitation spectrum:**
Tasks fall on a spectrum from high-capability (well-represented in training data, factual, common knowledge) to high-limitation (recent events, niche topics, precise numerical data, proprietary information).

### Exercise: Try It Out
Hands-on exercise probing the model's knowledge boundaries -- finding where it is confident and correct vs. confident and wrong.

---

## Section 5: Working Memory

### Lesson: Working Memory

How LLMs handle information within a conversation through their context window.

**Core concept:** Like humans with limited working memory capacity, LLMs have an "attention budget." Every new token introduced depletes this budget by some amount. The context window is the model's working memory.

**Capabilities:**
- Multi-turn conversation tracking
- Reference resolution across long documents
- Maintaining coherence over extended interactions
- Following complex, multi-step instructions

**Limitations:**
- **Context window limits** -- fixed maximum number of tokens that can be processed
- **Context rot** -- as token count grows, accuracy and recall degrade
- **Lost-in-the-middle effect** -- information in the middle of long contexts is less reliably accessed than information at the beginning or end
- **Attention dilution** -- with more context, each piece gets proportionally less attention
- **No persistent memory** -- information not in the current context window is inaccessible (without external storage)

**Practical implications:**
- Curating what is in context is as important as how much space is available
- Placing important information strategically (beginning or end of context) improves reliability
- Long conversations may need summarization or context management strategies
- Models remain highly capable at longer contexts but may show reduced precision for information retrieval and long-range reasoning compared to shorter contexts -- this is a performance gradient, not a hard cliff

### Exercise: Try It Out
Hands-on exercise exploring context window behavior -- testing how the model handles information placement and context length.

---

## Section 6: Steerability

### Lesson: Steerability

How well users can guide and control AI system behavior.

**Core concept:** Steerability refers to the ability to direct the model's behavior through prompts, system prompts, and instructions. It encompasses how reliably the model follows instructions and adopts specified behaviors.

**Capabilities:**
- Role adoption and persona maintenance
- Tone and style adjustment
- Format compliance (JSON, markdown, specific structures)
- Following complex multi-step instructions
- Constraint adherence (word limits, topic restrictions)

**Limitations:**
- **Instruction following is probabilistic, not deterministic** -- the model may occasionally deviate
- **Competing instructions** -- when system prompt and user message conflict, behavior may be unpredictable
- **Safety overrides** -- certain instructions will be refused regardless of prompt engineering
- **Prompt sensitivity** -- small wording changes can produce significantly different outputs
- **Degraded steerability under complexity** -- more complex or longer instructions may be partially followed
- **Character consistency** -- maintaining a specific persona perfectly over long conversations is challenging

**Connection to training:**
- RLHF and Constitutional AI shape the model's baseline steerability
- System prompts provide session-level steering
- User prompts provide turn-level steering
- The training process determines the boundaries of what the model will and won't do

**Enhanced steerability via:**
- Clear, specific instructions
- XML tags or structured formatting for complex prompts
- Examples (few-shot prompting)
- System prompts for persistent behavior
- Step-by-step breakdowns

### Exercise: Try It Out
Hands-on exercise testing the model's responsiveness to different steering approaches and finding the boundaries.

---

## Section 7: Putting It All Together and Next Steps

### Lesson: When Properties Collide

**Core concept:** Real-world AI usage involves all four properties (next-token prediction, knowledge, working memory, steerability) interacting simultaneously. Problems often arise not from a single property but from **collisions between properties**.

**Examples of property collisions:**
- **Knowledge vs. Steerability** -- asking the model to role-play as an expert in a domain where its knowledge is limited; it steers toward the role but confabulates facts
- **Working Memory vs. Knowledge** -- in a long conversation, the model may lose track of earlier corrections and revert to its trained (potentially incorrect) knowledge
- **Next-token Prediction vs. Steerability** -- statistical patterns in training data may override specific steering instructions (e.g., generating common phrasings instead of requested unusual ones)
- **Working Memory vs. Steerability** -- complex instruction sets may be partially forgotten as the context grows

**Diagnostic approach:**
When AI output is unexpected:
1. Identify which property or properties are involved
2. Determine where on the capability-to-limitation spectrum the task falls for each property
3. Apply targeted fixes based on the identified property:
   - Knowledge issue -> provide information, use retrieval tools
   - Working memory issue -> manage context, place info strategically
   - Steerability issue -> refine prompts, add examples, use system prompts
   - Prediction issue -> adjust temperature, provide more constraints

### Lesson: Next Steps

Guidance on continued learning and application of the framework. Connects back to the 4D Framework:
- **Delegation** is informed by understanding capabilities and limitations
- **Description** is improved by knowing what the model responds to (steerability)
- **Discernment** requires understanding failure modes (knowledge gaps, context limits)
- **Diligence** demands awareness of where the model cannot be trusted

### Course Quiz

Assessment covering all sections. Tests ability to:
- Identify types of AI outputs
- Determine where tasks fall on capability-to-limitation spectrums
- Apply targeted solutions based on property analysis

---

## Key Takeaways

1. **Four core AI properties:** Next-token prediction, Knowledge, Working Memory, Steerability
2. **Each property exists on a capability-to-limitation spectrum** -- tasks are not simply "possible" or "impossible"
3. **Properties interact and collide** -- real-world issues often stem from property interactions
4. **Diagnostic approach:** Identify the property -> locate on spectrum -> apply targeted fix
5. **Working mental model > memorized rules** -- understanding why helps more than knowing what
6. **This course complements the 4D Framework** -- machine properties inform human competencies
7. **Context management is as important as capability** -- what you put in the context window matters as much as the window size
8. **AI character comes from training** -- understanding pre-training, fine-tuning, RLHF, and Constitutional AI explains behavioral boundaries
9. **Next-token prediction is necessary but not sufficient** to explain LLM behavior -- models develop capabilities beyond simple word prediction
10. **Hallucination is a feature of the generation mechanism** -- the same process that enables creativity also enables confabulation

---

## Connections to 4D Framework

| AI Property | Primary 4D Competency | Why |
|-------------|----------------------|-----|
| Next Token Prediction | Discernment | Understanding generation mechanics helps evaluate output quality |
| Knowledge | Delegation | Knowing what AI knows/doesn't know informs task assignment |
| Working Memory | Description | Understanding context limits shapes how you communicate with AI |
| Steerability | Description | Knowing what the model responds to improves prompt crafting |
| When Properties Collide | All 4Ds | Real-world AI use requires all competencies working together |

---

## Related Resources

- **Companion course:** AI Fluency: Framework & Foundations (the 4D Framework)
- **Anthropic Research -- Tracing Thoughts:** https://www.anthropic.com/research/tracing-thoughts-language-model
- **Constitutional AI paper:** https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback
- **Context Engineering:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Context Windows docs:** https://docs.anthropic.com/en/docs/build-with-claude/context-windows
