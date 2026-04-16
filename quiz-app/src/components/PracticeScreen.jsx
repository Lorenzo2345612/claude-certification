import { useState, useMemo, useCallback } from 'react'
import { questions as q1 } from '../data/questions'
import { questionsPart2 as q2 } from '../data/questions_part2'
import { questionsPart3 as q3 } from '../data/questions_part3'
import { questionsPart4 as q4 } from '../data/questions_part4'
import { questionsPart5 as q5 } from '../data/questions_part5'
import { questionsPart6 as q6 } from '../data/questions_part6'
import StartScreen from './StartScreen'
import QuizScreen from './QuizScreen'
import ResultsScreen from './ResultsScreen'

const DOC_KEYWORD_MAP = [
  { kw: /stop_reason|agentic loop|end_turn|pause_turn|tool_use.*block|loop.*terminat/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works#the-agentic-loop" },
  { kw: /tool_result|is_error|isError|error.*tool|tool.*error|error.*response|error.*category|errorCategory|isRetryable|retry.*error|timeout.*error|transient.*error/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls#handling-errors-with-is_error" },
  { kw: /tool description|tool.*definition|input_schema|input_examples|tool.*naming|rename.*tool|split.*tool|consolidat.*tool|generic.*tool/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#best-practices-for-tool-definitions" },
  { kw: /tool_choice|forced.*tool|"auto"|"any"|"none"|tool selection|tool.*routing/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#controlling-claudes-output" },
  { kw: /strict.*true|strict tool|grammar.constrained|additionalProperties/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use" },
  { kw: /parallel.*tool|multiple.*tool.*call|simultaneous.*tool/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use" },
  { kw: /structured output|output_config|json_schema.*output|JSON.*schema.*output|confidence.*field|extraction.*schema|nullable.*field|required.*field.*schema|enum.*other.*detail|validation.*retry|calculated_total|stated_total/i, url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
  { kw: /batch|Message Batches|custom_id|processing_status|50%.*cost|24.*hour.*processing|overnight.*report|nightly|weekly.*audit/i, url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
  { kw: /few-shot|explicit criteria|false positive|XML tag|<example>|prompt.*engineering|input.*output.*example|test-driven.*iteration|interview.*pattern/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  { kw: /adaptive thinking|effort.*parameter|budget_tokens|extended thinking|thinking.*type|prefill.*deprecated/i, url: "https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking" },
  { kw: /context window|lost.*middle|token.*budget|context.*aware|progressive.*summar|case.*facts|trimm.*tool.*output/i, url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
  { kw: /PreToolUse|PostToolUse|hook.*callback|permissionDecision|deny.*ask.*allow|hook.*event|hook.*intercept|normalize.*hook/i, url: "https://code.claude.com/docs/en/agent-sdk/hooks" },
  { kw: /AgentDefinition|subagent|sub-agent|Task.*tool|Agent.*tool.*spawn|parent_tool_use_id|cannot.*spawn.*subagent|coordinator.*subagent|hub.*spoke|delegat.*subagent|allowedTools.*Agent|coordinator.*delegate/i, url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
  { kw: /session.*resum|fork_session|--resume|session.*id|session.*fork|resume.*session|interrupted.*session|crash.*recovery|manifest.*recovery/i, url: "https://code.claude.com/docs/en/agent-sdk/sessions" },
  { kw: /CLAUDE\.md|claude.*md|@import|auto.*memory|\.claude\/rules|claudeMdExcludes|CLAUDE\.local|memory.*hierarchy|\/memory|user-level.*project-level|managed.*policy/i, url: "https://code.claude.com/docs/en/memory" },
  { kw: /SKILL\.md|skill.*frontmatter|context.*fork|allowed-tools|disable-model-invocation|argument-hint|\.claude\/skills|\.claude\/commands|slash command|\$ARGUMENTS/i, url: "https://code.claude.com/docs/en/skills" },
  { kw: /--print|-p flag|--output-format|--json-schema|--bare|--max-turns|--max-budget|--permission-mode|--append-system-prompt|--worktree|CLI.*flag|non-interactive.*mode/i, url: "https://code.claude.com/docs/en/cli-reference" },
  { kw: /plan mode|direct execution|Explore.*subagent|plan.*vs.*direct|microservice.*restructur|large.*scale.*change|architectural.*decision/i, url: "https://code.claude.com/docs/en/best-practices" },
  { kw: /\/compact|compaction|context.*degradation|scratchpad|startup.*load|survives.*compaction|context.*fills/i, url: "https://code.claude.com/docs/en/context-window" },
  { kw: /hooks.*settings|exit code 2|hook.*handler.*type|asyncRewake|hook.*command.*http.*prompt|settings\.json.*hook/i, url: "https://code.claude.com/docs/en/hooks" },
  { kw: /CI\/CD|GitHub Action|pipeline.*review|automated.*review|pull request.*review|pre-merge|inline.*comment/i, url: "https://code.claude.com/docs/en/github-actions" },
  { kw: /\.mcp\.json|MCP.*server.*config|mcp.*scope|~\/\.claude\.json|env.*var.*expansion|\$\{.*TOKEN|MCP.*transport|headersHelper/i, url: "https://code.claude.com/docs/en/mcp" },
  { kw: /MCP.*primitive|MCP.*resource|MCP.*tool.*vs.*resource|inputSchema.*camelCase|MCP.*architect|tools\/list|tools\/call|resources\/list|model.*controlled|application.*controlled/i, url: "https://modelcontextprotocol.io/docs/learn/architecture" },
  { kw: /escalat|human.*agent|handoff|sentiment.*analysis|confidence.*score.*self|customer.*request.*human|policy.*gap|ambiguity.*resolution/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#agentic-systems" },
  { kw: /multi-pass|self-review|independent.*review|per-file.*pass|cross-file|attention.*dilution|single.*pass.*review|review.*inconsisten/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#chain-complex-prompts" },
  { kw: /error.*propagat|partial.*result|coverage.*gap|structured.*error.*context|failure.*type|access.*failure.*empty.*result/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls" },
  { kw: /provenance|source.*attribution|claim.*source|conflicting.*statistic|temporal.*data|publication.*date|well-established.*contested/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#long-context-prompting" },
  { kw: /stratified.*sampl|field-level.*confidence|accuracy.*by.*document|human.*review.*workflow|aggregate.*accuracy|97%.*accuracy/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  { kw: /built-in tool|Read.*Write.*Edit|Grep.*Glob|Bash.*command|file.*pattern.*match|content.*search|codebase.*explor/i, url: "https://code.claude.com/docs/en/agent-sdk/overview#built-in-tools" },
  { kw: /task decomposition|prompt chaining|sequential.*pipeline|adaptive.*decomposition|multi-concern|multi-issue/i, url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#chain-complex-prompts" },
  { kw: /extract.*pipeline|extract.*invoice|extract.*data|document.*extract|unstructured.*document|varied.*format/i, url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
  { kw: /tool.*distribut|too many tools|18.*tools|4-5.*tools|restrict.*tool.*set|scoped.*tool|verify_fact/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools" },
  { kw: /programmatic.*enforce|programmatic.*prerequisit|deterministic.*guarantee|prompt.*instruction.*fail|block.*downstream|prerequisite.*gate/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works" },
  { kw: /XML.*wrapper|legacy.*system|data.*normali|heterogeneous.*format/i, url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls" },
]

const DOMAIN_FALLBACK = {
  1: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works",
  2: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools",
  3: "https://code.claude.com/docs/en/overview",
  4: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  5: "https://platform.claude.com/docs/en/build-with-claude/context-windows",
}

function getDocUrl(q) {
  const text = `${q.question} ${q.options?.map(o => o.text).join(' ') || ''}`
  for (const { kw, url } of DOC_KEYWORD_MAP) {
    if (kw.test(text)) return url
  }
  return DOMAIN_FALLBACK[q.domainId] || "https://platform.claude.com/docs"
}

const rawQuestions = [...q1, ...q2, ...q3, ...q4, ...q5, ...q6]
const questions = rawQuestions.map(q => ({ ...q, docUrl: getDocUrl(q) }))

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function PracticeScreen({ domains }) {
  const [phase, setPhase] = useState('start')
  const [selectedDomains, setSelectedDomains] = useState([1, 2, 3, 4, 5])
  const [questionCount, setQuestionCount] = useState(60)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)

  const availableCount = useMemo(() => {
    return questions.filter(q => selectedDomains.includes(q.domainId)).length
  }, [selectedDomains])

  const startQuiz = useCallback(() => {
    const filtered = questions.filter(q => selectedDomains.includes(q.domainId))
    const shuffled = shuffleArray(filtered)
    const count = Math.min(questionCount, shuffled.length)
    const letters = ['a', 'b', 'c', 'd']
    const selected = shuffled.slice(0, count).map(q => {
      const shuffledOpts = shuffleArray(q.options)
      const remapped = shuffledOpts.map((opt, i) => ({ ...opt, id: letters[i] }))
      const newCorrect = remapped.find(o => o.correct)?.id || q.correctAnswer
      const oldToNew = {}
      shuffledOpts.forEach((opt, i) => { oldToNew[opt.id] = letters[i] })
      const newWhyWrong = {}
      if (q.whyOthersWrong) {
        Object.entries(q.whyOthersWrong).forEach(([oldKey, text]) => {
          newWhyWrong[oldToNew[oldKey] || oldKey] = text
        })
      }
      return { ...q, options: remapped, correctAnswer: newCorrect, whyOthersWrong: newWhyWrong }
    })
    setQuizQuestions(selected)
    setCurrentIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setPhase('quiz')
  }, [selectedDomains, questionCount])

  const selectAnswer = useCallback((questionId, optionId) => {
    if (answers[questionId]?.confirmed) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selected: optionId, confirmed: false }
    }))
  }, [answers])

  const confirmAnswer = useCallback((questionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], confirmed: true }
    }))
    setShowExplanation(true)
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      setPhase('results')
    }
  }, [currentIndex, quizQuestions.length])

  const restart = useCallback(() => {
    setPhase('start')
    setAnswers({})
    setCurrentIndex(0)
    setShowExplanation(false)
  }, [])

  const answeredCount = Object.values(answers).filter(a => a.confirmed).length

  // Inject answered count into header right slot
  if (phase === 'quiz') {
    const slot = document.getElementById('header-right-slot')
    if (slot) slot.textContent = `${answeredCount} / ${quizQuestions.length} answered`
  } else {
    const slot = document.getElementById('header-right-slot')
    if (slot) slot.textContent = ''
  }

  return (
    <div className="main-content">
      {phase === 'start' && (
        <StartScreen
          domains={domains}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          availableCount={availableCount}
          onStart={startQuiz}
        />
      )}
      {phase === 'quiz' && quizQuestions.length > 0 && (
        <QuizScreen
          question={quizQuestions[currentIndex]}
          currentIndex={currentIndex}
          total={quizQuestions.length}
          answer={answers[quizQuestions[currentIndex].id]}
          showExplanation={showExplanation}
          onSelect={selectAnswer}
          onConfirm={confirmAnswer}
          onNext={nextQuestion}
          isLast={currentIndex === quizQuestions.length - 1}
        />
      )}
      {phase === 'results' && (
        <ResultsScreen
          questions={quizQuestions}
          answers={answers}
          domains={domains}
          onRestart={restart}
        />
      )}
    </div>
  )
}
