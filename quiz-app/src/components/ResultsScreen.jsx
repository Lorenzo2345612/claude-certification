import { useMemo, useState, useRef, useEffect } from 'react'

const DOMAIN_COLORS = {
  1: '#f97316',
  2: '#06b6d4',
  3: '#8b5cf6',
  4: '#10b981',
  5: '#ec4899',
}

export default function ResultsScreen({ questions, answers, domains, examStatus, onRestart }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [filterDomain, setFilterDomain] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null) // 'correct' | 'incorrect' | null
  const sliderRef = useRef(null)

  const stats = useMemo(() => {
    let correct = 0
    let total = questions.length

    const domainStats = {}
    domains.forEach(d => {
      domainStats[d.id] = { correct: 0, total: 0, name: d.name, short: d.short }
    })

    questions.forEach(q => {
      const answer = answers[q.id]
      const isCorrect = answer?.selected === q.correctAnswer
      if (isCorrect) correct++

      if (domainStats[q.domainId]) {
        domainStats[q.domainId].total++
        if (isCorrect) domainStats[q.domainId].correct++
      }
    })

    const percentage = Math.round((correct / total) * 100)
    const scaledScore = Math.round(100 + (percentage / 100) * 900)
    const passed = scaledScore >= 720

    return { correct, total, percentage, scaledScore, passed, domainStats }
  }, [questions, answers, domains])

  const reviewItems = useMemo(() => {
    return questions.map((q, idx) => {
      const answer = answers[q.id]
      const isCorrect = answer?.selected === q.correctAnswer
      const selectedOption = q.options.find(o => o.id === answer?.selected)
      const correctOption = q.options.find(o => o.correct)
      return { ...q, isCorrect, selectedOption, correctOption, answer, index: idx }
    })
  }, [questions, answers])

  const filteredReview = useMemo(() => {
    return reviewItems.filter(item => {
      if (filterDomain && item.domainId !== filterDomain) return false
      if (filterStatus === 'correct' && !item.isCorrect) return false
      if (filterStatus === 'incorrect' && item.isCorrect) return false
      return true
    })
  }, [reviewItems, filterDomain, filterStatus])

  useEffect(() => {
    setActiveSlide(0)
  }, [filterDomain, filterStatus])

  useEffect(() => {
    if (sliderRef.current) {
      const card = sliderRef.current.children[activeSlide]
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeSlide])

  const goToSlide = (dir) => {
    setActiveSlide(prev => {
      const next = prev + dir
      if (next < 0) return filteredReview.length - 1
      if (next >= filteredReview.length) return 0
      return next
    })
  }

  const currentItem = filteredReview[activeSlide]

  return (
    <div className="results-screen">
      <div className="results-title">Exam Results</div>
      <div className="results-subtitle-text">
        Claude Certified Architect &mdash; Foundations Practice Exam
      </div>

      {(examStatus === 'timed_out' || examStatus === 'abandoned') && (
        <div className={`exam-status-badge status-${examStatus}`}>
          {examStatus === 'timed_out' ? 'TIME EXPIRED' : 'EXAM ABANDONED'}
        </div>
      )}

      <div className={`score-circle ${stats.passed ? 'pass' : 'fail'}`}>
        <div className="score-value">{stats.scaledScore}</div>
        <div className="score-label">/ 1000</div>
        <div className="score-threshold">720 to pass</div>
      </div>

      <div className={`score-status ${stats.passed ? 'pass' : 'fail'}`}>
        {stats.passed ? 'PASSED' : 'NOT PASSED'}
      </div>
      <div className="score-detail">
        {stats.correct} / {stats.total} correct ({stats.percentage}%)
      </div>

      {/* Domain Breakdown Table */}
      <div className="domain-breakdown">
        <h3>Domain Breakdown</h3>
        <div className="domain-breakdown-table">
          {domains.map(d => {
            const ds = stats.domainStats[d.id]
            if (!ds || ds.total === 0) return null
            const pct = Math.round((ds.correct / ds.total) * 100)
            const domainPassed = pct >= 69
            return (
              <div key={d.id} className="domain-row" onClick={() => setFilterDomain(filterDomain === d.id ? null : d.id)} style={{ cursor: 'pointer' }}>
                <div
                  className="domain-row-indicator"
                  style={{ background: DOMAIN_COLORS[d.id] }}
                />
                <span className="domain-name" style={{ color: DOMAIN_COLORS[d.id] }}>
                  {d.short}: {d.name}
                </span>
                <div className="domain-bar-container">
                  <div className="domain-bar">
                    <div
                      className="domain-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${DOMAIN_COLORS[d.id]}cc, ${DOMAIN_COLORS[d.id]})`
                      }}
                    />
                  </div>
                </div>
                <span className="domain-score">
                  {ds.correct}/{ds.total} ({pct}%)
                </span>
                <span className={`domain-pass-indicator ${domainPassed ? 'pass-ind' : 'fail-ind'}`}>
                  {domainPassed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Question Review Slider */}
      <div className="review-slider-section">
        <h3>Question Review</h3>

        {/* Filters */}
        <div className="review-filters">
          <button
            className={`review-filter-btn ${filterStatus === null && filterDomain === null ? 'active' : ''}`}
            onClick={() => { setFilterStatus(null); setFilterDomain(null) }}
          >
            All ({reviewItems.length})
          </button>
          <button
            className={`review-filter-btn filter-correct ${filterStatus === 'correct' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'correct' ? null : 'correct')}
          >
            Correct ({reviewItems.filter(i => i.isCorrect).length})
          </button>
          <button
            className={`review-filter-btn filter-incorrect ${filterStatus === 'incorrect' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'incorrect' ? null : 'incorrect')}
          >
            Incorrect ({reviewItems.filter(i => !i.isCorrect).length})
          </button>
          {filterDomain && (
            <button
              className="review-filter-btn filter-domain-active"
              onClick={() => setFilterDomain(null)}
              style={{ borderColor: DOMAIN_COLORS[filterDomain], color: DOMAIN_COLORS[filterDomain] }}
            >
              D{filterDomain} &times;
            </button>
          )}
        </div>

        {filteredReview.length > 0 ? (
          <>
            {/* Navigation */}
            <div className="slider-nav">
              <button className="slider-arrow" onClick={() => goToSlide(-1)}>&larr;</button>
              <span className="slider-counter">
                {activeSlide + 1} / {filteredReview.length}
              </span>
              <button className="slider-arrow" onClick={() => goToSlide(1)}>&rarr;</button>
            </div>

            {/* Dot indicators */}
            <div className="slider-dots">
              {filteredReview.map((item, i) => (
                <button
                  key={item.id}
                  className={`slider-dot ${i === activeSlide ? 'active' : ''} ${item.isCorrect ? 'dot-correct' : 'dot-incorrect'}`}
                  onClick={() => setActiveSlide(i)}
                  title={`Q${item.index + 1}`}
                />
              ))}
            </div>

            {/* Card */}
            {currentItem && (
              <div className={`review-slide ${currentItem.isCorrect ? 'slide-correct' : 'slide-incorrect'}`}>
                <div className="slide-header">
                  <div className="slide-meta">
                    <span className="slide-number">#{currentItem.index + 1}</span>
                    <span className={`slide-domain d${currentItem.domainId}`}>
                      D{currentItem.domainId}: {currentItem.domain}
                    </span>
                  </div>
                  <span className={`slide-status ${currentItem.isCorrect ? 'correct-status' : 'incorrect-status'}`}>
                    {currentItem.isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <div className="slide-scenario">{currentItem.scenario}</div>
                <div className="slide-question">{currentItem.question}</div>

                <div className="slide-answers">
                  {!currentItem.isCorrect && currentItem.selectedOption && (
                    <div className="slide-answer-row incorrect-row">
                      <span className="slide-answer-badge incorrect-badge">
                        Your answer ({currentItem.answer?.selected?.toUpperCase()})
                      </span>
                      <span>{currentItem.selectedOption.text}</span>
                    </div>
                  )}
                  <div className="slide-answer-row correct-row">
                    <span className="slide-answer-badge correct-badge">
                      Correct answer ({currentItem.correctAnswer.toUpperCase()})
                    </span>
                    <span>{currentItem.correctOption?.text}</span>
                  </div>
                </div>

                <div className="slide-explanation">
                  <strong>Explanation:</strong> {currentItem.explanation}
                </div>

                {!currentItem.isCorrect && currentItem.whyOthersWrong && currentItem.whyOthersWrong[currentItem.answer?.selected] && (
                  <div className="slide-why-wrong">
                    <strong>Why {currentItem.answer?.selected?.toUpperCase()} is wrong:</strong>{' '}
                    {currentItem.whyOthersWrong[currentItem.answer?.selected]}
                  </div>
                )}

                {currentItem.docReference && (
                  <div className="doc-reference">
                    <div className="doc-reference-header">
                      <div className="doc-reference-header-left">
                        <span className="doc-reference-label">Documentation reference</span>
                        {currentItem.docStatus && (
                          <span className={`doc-status-badge status-${currentItem.docStatus.toLowerCase()}`}>
                            {currentItem.docStatus === 'STRONG' ? 'Documented' :
                             currentItem.docStatus === 'PARTIAL' ? 'Partial doc' :
                             currentItem.docStatus === 'EXAM_GUIDE' ? 'Exam guide' :
                             currentItem.docStatus}
                          </span>
                        )}
                      </div>
                      <span className="doc-reference-source">{currentItem.docReference.source}</span>
                    </div>
                    <blockquote className="doc-reference-quote">
                      {currentItem.docReference.quote}
                    </blockquote>
                  </div>
                )}

                {currentItem.docUrl && (
                  <a
                    className="slide-doc-link"
                    href={currentItem.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the official Anthropic documentation &rarr;
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No questions match the selected filters.
          </div>
        )}
      </div>

      <button className="btn-restart" onClick={onRestart}>
        Restart Exam
      </button>
    </div>
  )
}
