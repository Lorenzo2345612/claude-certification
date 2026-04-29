import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { mapQuestionKeys, prepareQuestionsForQuiz } from '../utils'
import QuizScreen from './QuizScreen'
import ResultsScreen from './ResultsScreen'

export default function ExamsScreen({ domains, onProgressChange, onQuizActiveChange, onLeaveCallbackRef }) {
  const { user } = useAuth()
  const [phase, setPhase] = useState('list')
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [activeExam, setActiveExam] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [examStatus, setExamStatus] = useState('completed')
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [loadingExam, setLoadingExam] = useState(false)
  const timerRef = useRef(null)
  const finishExamRef = useRef(false)
  const finishExamFnRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    api.getSharedExams(page, 10)
      .then(data => {
        setExams(data.items || [])
        setTotalPages(data.total_pages || 0)
        setTotal(data.total || 0)
      })
      .catch(err => console.error('Failed to load shared exams:', err))
      .finally(() => setLoading(false))
  }, [page])

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

  const timerActive = phase === 'quiz' && remainingSeconds !== null && remainingSeconds > 0
  useEffect(() => {
    if (!timerActive) return
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  useEffect(() => {
    if (remainingSeconds === 0 && phase === 'quiz') setExamStatus('timed_out')
  }, [remainingSeconds, phase])

  useEffect(() => {
    if ((examStatus === 'timed_out' || examStatus === 'abandoned') && phase === 'quiz' && !finishExamRef.current) {
      finishExamRef.current = true
      finishExamFnRef.current?.(examStatus)
    }
  }, [examStatus, phase])

  const answeredCount = Object.values(answers).filter(a => a.confirmed).length
  const formatTime = (secs) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`

  useEffect(() => {
    if (phase === 'quiz') {
      const timerText = remainingSeconds !== null ? ` | ${formatTime(remainingSeconds)}` : ''
      onProgressChange?.(`${answeredCount} / ${quizQuestions.length} answered${timerText}`)
    } else {
      onProgressChange?.(null)
    }
    return () => onProgressChange?.(null)
  }, [phase, answeredCount, quizQuestions.length, remainingSeconds, onProgressChange])

  const startExam = useCallback(async (exam) => {
    setLoadingExam(true)
    try {
      const detail = await api.getSharedExam(exam.id)
      const mapped = detail.questions.map(q => mapQuestionKeys(q))
      const prepared = prepareQuestionsForQuiz(mapped)
      setActiveExam(detail)
      setQuizQuestions(prepared)
      setCurrentIndex(0)
      setAnswers({})
      setShowExplanation(false)
      setExamStatus('in_progress')
      finishExamRef.current = false
      setRemainingSeconds(detail.time_limit_minutes ? detail.time_limit_minutes * 60 : null)
      setPhase('quiz')
    } catch (err) {
      console.error('Failed to load exam:', err)
    } finally {
      setLoadingExam(false)
    }
  }, [])

  const submitExamResults = useCallback(async (status = 'completed') => {
    if (!user || !activeExam) return
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
        domains_selected: activeExam.domains_selected,
        time_limit_minutes: activeExam.time_limit_minutes || null,
        status,
        answers: answersList,
        shared_exam_id: activeExam.id,
      })
    } catch (err) {
      console.error('Failed to save exam results:', err)
    }
  }, [user, activeExam, quizQuestions, answers])

  const finishExam = useCallback((status) => {
    clearInterval(timerRef.current)
    submitExamResults(status)
    setPhase('results')
  }, [submitExamResults])

  finishExamFnRef.current = finishExam

  const selectAnswer = useCallback((questionId, optionId) => {
    if (answers[questionId]?.confirmed) return
    setAnswers(prev => ({ ...prev, [questionId]: { selected: optionId, confirmed: false } }))
  }, [answers])

  const confirmAnswer = useCallback((questionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], confirmed: true } }))
    setShowExplanation(true)
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      finishExam('completed')
    }
  }, [currentIndex, quizQuestions.length, finishExam])

  const backToList = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('list')
    setActiveExam(null)
    setQuizQuestions([])
    setAnswers({})
    setCurrentIndex(0)
    setRemainingSeconds(null)
    setExamStatus('completed')
    finishExamRef.current = false
  }, [])

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <div className="loading-spinner" />
        <span style={{ marginLeft: 12, color: '#94a3b8' }}>Loading exams...</span>
      </div>
    )
  }

  return (
    <div className="main-content">
      {phase === 'list' && (
        <div className="exams-screen">
          <h2 className="exams-title">Shared Exams</h2>
          <p className="exams-subtitle">Community-created exams. Take any exam to practice with the exact same questions.</p>
          {total === 0 ? (
            <div className="exams-empty">
              No shared exams yet. Complete a practice session and click &ldquo;Share Exam&rdquo; to create one!
            </div>
          ) : (
            <>
              <div className="exams-list">
                {exams.map(exam => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-card-body">
                      <div className="exam-card-title">{exam.title}</div>
                      <div className="exam-card-meta">
                        <span className="exam-card-creator">by {exam.creator_username}</span>
                        <span className="exam-card-sep">·</span>
                        <span>{exam.question_count} questions</span>
                        {exam.time_limit_minutes && (
                          <>
                            <span className="exam-card-sep">·</span>
                            <span>{exam.time_limit_minutes} min</span>
                          </>
                        )}
                        <span className="exam-card-sep">·</span>
                        <span>{new Date(exam.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      className="btn-take-exam"
                      onClick={() => user ? startExam(exam) : alert('Please sign in to take an exam.')}
                      disabled={loadingExam}
                    >
                      {loadingExam ? 'Loading...' : 'Take Exam'}
                    </button>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="exams-pagination">
                  <button
                    className="btn-pagination"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                  >
                    ← Prev
                  </button>
                  <span className="exams-page-indicator">Page {page} of {totalPages}</span>
                  <button
                    className="btn-pagination"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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
          onRestart={backToList}
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
              <button className="btn-leave-cancel" onClick={() => setShowLeaveDialog(false)}>Continue Exam</button>
              <button className="btn-leave-confirm" onClick={() => { setShowLeaveDialog(false); setExamStatus('abandoned') }}>Leave &amp; Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
