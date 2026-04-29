import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { mapQuestionKeys, shuffleArray, prepareQuestionsForQuiz } from '../utils'
import StartScreen from './StartScreen'
import QuizScreen from './QuizScreen'
import ResultsScreen from './ResultsScreen'
import { DOCS_ONLY_KEY } from '../courses'

function matchesCourse(q, courseKey, includeDocsOnly) {
  if (!courseKey) return true
  const keys = q.courseKeys || q.course_keys || []
  if (!Array.isArray(keys) || keys.length === 0) return false
  if (courseKey === DOCS_ONLY_KEY) return keys.includes(DOCS_ONLY_KEY)
  if (keys.includes(courseKey)) return true
  if (includeDocsOnly && keys.includes(DOCS_ONLY_KEY)) return true
  return false
}

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

const CCA_SCENARIOS = [
  { id: 'customer-support', name: 'Customer Support Resolution Agent' },
  { id: 'code-generation', name: 'Code Generation with Claude Code' },
  { id: 'multi-agent', name: 'Multi-Agent Research System' },
  { id: 'developer-productivity', name: 'Developer Productivity with Claude' },
  { id: 'ci-cd', name: 'Claude Code for CI/CD' },
  { id: 'data-extraction', name: 'Structured Data Extraction' },
]

export default function PracticeScreen({ domains, onProgressChange, onQuizActiveChange, onLeaveCallbackRef }) {
  const { user } = useAuth()
  const location = useLocation()
  const [phase, setPhase] = useState('start')
  const [onlyUnanswered, setOnlyUnanswered] = useState(false)
  const [answeredIds, setAnsweredIds] = useState(new Set())
  const [selectedDomains, setSelectedDomains] = useState([1, 2, 3, 4, 5])
  const [filterMode, setFilterMode] = useState('domain')
  const [selectedScenarios, setSelectedScenarios] = useState(CCA_SCENARIOS.map(s => s.name))
  const [selectedCourseKey, setSelectedCourseKeyState] = useState(() => {
    try { return localStorage.getItem('course_filter:practice') || null } catch { return null }
  })
  const [includeDocsOnly, setIncludeDocsOnlyState] = useState(() => {
    try { return localStorage.getItem('course_filter:practice:docs_only') === '1' } catch { return false }
  })
  const setSelectedCourseKey = useCallback((v) => {
    setSelectedCourseKeyState(v)
    try {
      if (v) localStorage.setItem('course_filter:practice', v)
      else localStorage.removeItem('course_filter:practice')
    } catch {}
  }, [])
  const setIncludeDocsOnly = useCallback((v) => {
    setIncludeDocsOnlyState(!!v)
    try { localStorage.setItem('course_filter:practice:docs_only', v ? '1' : '0') } catch {}
  }, [])
  const [questionCount, setQuestionCount] = useState(60)
  const [timeLimit, setTimeLimit] = useState(0)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [examStatus, setExamStatus] = useState('completed')
  const timerRef = useRef(null)
  const pendingNavRef = useRef(null)

  useEffect(() => {
    onQuizActiveChange?.(phase === 'quiz')
    if (onLeaveCallbackRef) {
      onLeaveCallbackRef.current = phase === 'quiz' ? () => setExamStatus('abandoned') : null
    }
    return () => {
      onQuizActiveChange?.(false)
      if (onLeaveCallbackRef) onLeaveCallbackRef.current = null
    }
  }, [phase, onQuizActiveChange, onLeaveCallbackRef])

  useEffect(() => {
    api.getQuestions()
      .then(data => {
        const mapped = data.map(q => {
          const mq = mapQuestionKeys(q)
          return { ...mq, docUrl: getDocUrl(mq) }
        })
        setQuestions(mapped)
      })
      .catch(err => console.error('Failed to load questions:', err))
      .finally(() => setLoading(false))
  }, [])

  // Load answered question IDs for logged-in users
  useEffect(() => {
    if (!user) return
    api.getAnsweredQuestionIds()
      .then(ids => setAnsweredIds(new Set(ids)))
      .catch(err => console.error('Failed to load answered IDs:', err))
  }, [user])

  // Auto-start retake if navigated with retakeQuestionIds
  const retakeHandled = useRef(false)
  useEffect(() => {
    if (retakeHandled.current) return
    const retakeIds = location.state?.retakeQuestionIds
    if (!retakeIds || retakeIds.length === 0 || questions.length === 0 || loading) return
    retakeHandled.current = true

    const retakeSet = new Set(retakeIds)
    const filtered = questions.filter(q => retakeSet.has(q.id))
    if (filtered.length === 0) return

    const shuffled = prepareQuestionsForQuiz(filtered)

    setQuizQuestions(shuffled)
    setCurrentIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setExamStatus('in_progress')
    finishExamRef.current = false
    setRemainingSeconds(null)
    setPhase('quiz')
    // Clear the location state so refresh doesn't re-trigger
    window.history.replaceState({}, '')
  }, [questions, loading, location.state])

  // Timer countdown
  const timerActive = phase === 'quiz' && remainingSeconds !== null && remainingSeconds > 0
  useEffect(() => {
    if (!timerActive) return
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (remainingSeconds === 0 && phase === 'quiz') {
      setExamStatus('timed_out')
    }
  }, [remainingSeconds, phase])

  // Handle timed_out or abandoned status — auto-finish
  const finishExamRef = useRef(false)
  const finishExamFnRef = useRef(null)

  // Navigation blocking — beforeunload
  useEffect(() => {
    if (phase !== 'quiz') return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [phase])

  // Block in-app navigation via popstate
  useEffect(() => {
    if (phase !== 'quiz') return
    const handler = (e) => {
      if (phase === 'quiz') {
        setShowLeaveDialog(true)
        // Push state back to prevent navigation
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [phase])

  const availableCount = useMemo(() => {
    let filtered
    if (filterMode === 'scenario') {
      filtered = questions.filter(q => selectedScenarios.includes(q.scenario))
    } else {
      filtered = questions.filter(q => selectedDomains.includes(q.domainId))
    }
    filtered = filtered.filter(q => matchesCourse(q, selectedCourseKey, includeDocsOnly))
    if (onlyUnanswered) {
      filtered = filtered.filter(q => !answeredIds.has(q.id))
    }
    return filtered.length
  }, [filterMode, selectedDomains, selectedScenarios, questions, onlyUnanswered, answeredIds, selectedCourseKey, includeDocsOnly])

  const unansweredCount = useMemo(() => {
    let filtered
    if (filterMode === 'scenario') {
      filtered = questions.filter(q => selectedScenarios.includes(q.scenario))
    } else {
      filtered = questions.filter(q => selectedDomains.includes(q.domainId))
    }
    filtered = filtered.filter(q => matchesCourse(q, selectedCourseKey, includeDocsOnly))
    return filtered.filter(q => !answeredIds.has(q.id)).length
  }, [filterMode, selectedDomains, selectedScenarios, questions, answeredIds, selectedCourseKey, includeDocsOnly])

  const startQuiz = useCallback(() => {
    let filtered = filterMode === 'scenario'
      ? questions.filter(q => selectedScenarios.includes(q.scenario))
      : questions.filter(q => selectedDomains.includes(q.domainId))
    filtered = filtered.filter(q => matchesCourse(q, selectedCourseKey, includeDocsOnly))
    if (onlyUnanswered) {
      filtered = filtered.filter(q => !answeredIds.has(q.id))
    }
    const shuffled = shuffleArray(filtered)
    const count = Math.min(questionCount, shuffled.length)
    const selected = prepareQuestionsForQuiz(shuffled.slice(0, count))
    setQuizQuestions(selected)
    setCurrentIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setExamStatus('in_progress')
    finishExamRef.current = false
    setRemainingSeconds(timeLimit > 0 ? timeLimit * 60 : null)
    setPhase('quiz')
  }, [filterMode, selectedDomains, selectedScenarios, questionCount, timeLimit, questions, onlyUnanswered, answeredIds, selectedCourseKey, includeDocsOnly])

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

  const submitExamResults = useCallback(async (status = 'completed') => {
    if (!user) return
    const answersList = quizQuestions.map(q => {
      const ans = answers[q.id]
      return {
        question_id: q.id,
        domain_id: q.domainId,
        selected_answer: ans?.selected || '',
        correct_answer: q.correctAnswer,
        is_correct: ans?.confirmed && ans?.selected === q.correctAnswer,
      }
    })
    const correct = answersList.filter(a => a.is_correct).length
    const pct = Math.round((correct / quizQuestions.length) * 100)
    const score = Math.round(100 + (pct / 100) * 900)

    try {
      await api.submitExam({
        total_questions: quizQuestions.length,
        correct_count: correct,
        score,
        passed: score >= 720,
        domains_selected: selectedDomains,
        time_limit_minutes: timeLimit > 0 ? timeLimit : null,
        status,
        answers: answersList,
      })
    } catch (err) {
      console.error('Failed to save exam results:', err)
    }
  }, [user, quizQuestions, answers, selectedDomains, timeLimit])

  const finishExam = useCallback((status) => {
    clearInterval(timerRef.current)
    submitExamResults(status)
    setPhase('results')
  }, [submitExamResults])

  // Keep ref in sync for use in effects
  finishExamFnRef.current = finishExam

  // Auto-finish when status changes to timed_out or abandoned
  useEffect(() => {
    if ((examStatus === 'timed_out' || examStatus === 'abandoned') && phase === 'quiz' && !finishExamRef.current) {
      finishExamRef.current = true
      finishExamFnRef.current(examStatus)
    }
  }, [examStatus, phase])

  const nextQuestion = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      finishExam('completed')
    }
  }, [currentIndex, quizQuestions.length, finishExam])

  const handleLeaveConfirm = useCallback(() => {
    setShowLeaveDialog(false)
    setExamStatus('abandoned')
  }, [])

  const handleLeaveCancel = useCallback(() => {
    setShowLeaveDialog(false)
  }, [])

  const restart = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('start')
    setAnswers({})
    setCurrentIndex(0)
    setShowExplanation(false)
    setRemainingSeconds(null)
    setExamStatus('completed')
    finishExamRef.current = false
  }, [])

  const courseKeysSelected = selectedCourseKey
    ? (includeDocsOnly && selectedCourseKey !== DOCS_ONLY_KEY ? [selectedCourseKey, DOCS_ONLY_KEY] : [selectedCourseKey])
    : null

  const handleShareExam = useCallback(async (title) => {
    await api.createSharedExam({
      title,
      question_ids: quizQuestions.map(q => q.id),
      time_limit_minutes: timeLimit > 0 ? timeLimit : null,
      domains_selected: selectedDomains,
      course_keys_selected: courseKeysSelected,
    })
  }, [quizQuestions, timeLimit, selectedDomains, courseKeysSelected])

  const handleShareExamFromStart = useCallback(async (title) => {
    let pool
    if (filterMode === 'scenario') {
      pool = questions.filter(q => selectedScenarios.includes(q.scenario))
    } else {
      pool = questions.filter(q => selectedDomains.includes(q.domainId))
    }
    pool = pool.filter(q => matchesCourse(q, selectedCourseKey, includeDocsOnly))
    if (onlyUnanswered) {
      pool = pool.filter(q => !answeredIds.has(q.id))
    }
    const picked = shuffleArray(pool).slice(0, Math.min(questionCount, pool.length))
    if (picked.length === 0) {
      throw new Error('No questions available with the current filters')
    }
    await api.createSharedExam({
      title,
      question_ids: picked.map(q => q.id),
      time_limit_minutes: timeLimit > 0 ? timeLimit : null,
      domains_selected: selectedDomains,
      course_keys_selected: courseKeysSelected,
    })
  }, [questions, filterMode, selectedDomains, selectedScenarios, onlyUnanswered, answeredIds, questionCount, timeLimit, selectedCourseKey, includeDocsOnly, courseKeysSelected])

  const retryWrongQuestions = useCallback((wrongItems) => {
    const reshuffled = prepareQuestionsForQuiz(wrongItems)
    setQuizQuestions(reshuffled)
    setCurrentIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setExamStatus('in_progress')
    finishExamRef.current = false
    setRemainingSeconds(timeLimit > 0 ? timeLimit * 60 : null)
    setPhase('quiz')
  }, [timeLimit])

  const answeredCount = Object.values(answers).filter(a => a.confirmed).length

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  useEffect(() => {
    if (phase === 'quiz') {
      const timerText = remainingSeconds !== null ? ` | ${formatTime(remainingSeconds)}` : ''
      onProgressChange?.(`${answeredCount} / ${quizQuestions.length} answered${timerText}`)
    } else {
      onProgressChange?.(null)
    }
    return () => onProgressChange?.(null)
  }, [phase, answeredCount, quizQuestions.length, remainingSeconds, onProgressChange])

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <div className="loading-spinner" />
        <span style={{ marginLeft: 12, color: '#94a3b8' }}>Loading questions...</span>
      </div>
    )
  }

  return (
    <div className="main-content">
      {phase === 'start' && (
        <StartScreen
          domains={domains}
          selectedDomains={selectedDomains}
          setSelectedDomains={setSelectedDomains}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          scenarios={CCA_SCENARIOS}
          selectedScenarios={selectedScenarios}
          setSelectedScenarios={setSelectedScenarios}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
          availableCount={availableCount}
          onStart={startQuiz}
          onlyUnanswered={onlyUnanswered}
          setOnlyUnanswered={user ? setOnlyUnanswered : undefined}
          unansweredCount={user ? unansweredCount : undefined}
          onShareExam={user ? handleShareExamFromStart : null}
          selectedCourseKey={selectedCourseKey}
          setSelectedCourseKey={setSelectedCourseKey}
          includeDocsOnly={includeDocsOnly}
          setIncludeDocsOnly={setIncludeDocsOnly}
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
          remainingSeconds={remainingSeconds}
          formatTime={formatTime}
        />
      )}
      {phase === 'results' && (
        <ResultsScreen
          questions={quizQuestions}
          answers={answers}
          domains={domains}
          examStatus={examStatus}
          onRestart={restart}
          onRetryWrong={retryWrongQuestions}
          onShareExam={user ? handleShareExam : null}
        />
      )}

      {showLeaveDialog && (
        <div className="leave-dialog-overlay">
          <div className="leave-dialog">
            <div className="leave-dialog-title">Exam in Progress</div>
            <p className="leave-dialog-text">
              You have an exam in progress. Leaving will end the exam and unanswered questions will be scored as incorrect. Are you sure?
            </p>
            <div className="leave-dialog-actions">
              <button className="btn-leave-cancel" onClick={handleLeaveCancel}>
                Continue Exam
              </button>
              <button className="btn-leave-confirm" onClick={handleLeaveConfirm}>
                Leave &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
