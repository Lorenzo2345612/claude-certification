const TIME_LIMIT_OPTIONS = [
  { value: 0, label: 'No limit' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '120 min' },
]

export default function StartScreen({
  domains,
  selectedDomains,
  setSelectedDomains,
  questionCount,
  setQuestionCount,
  timeLimit,
  setTimeLimit,
  availableCount,
  onStart,
}) {
  const toggleDomain = (id) => {
    setSelectedDomains(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter(d => d !== id)
      }
      return [...prev, id]
    })
  }

  const maxQuestions = Math.min(availableCount, 304)
  const effectiveCount = Math.min(questionCount, availableCount)

  return (
    <div className="start-screen">
      <div className="start-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1>Claude Certified Architect &mdash; Foundations</h1>
      <p className="start-subtitle">
        Practice exam with {availableCount} scenario-based questions from all 5 domains
      </p>

      <div className="start-config">
        <div className="config-label">Domains</div>
        <div className="domain-filter">
          {domains.map(d => (
            <button
              key={d.id}
              className={`domain-chip d${d.id} ${selectedDomains.includes(d.id) ? 'active' : ''}`}
              onClick={() => toggleDomain(d.id)}
            >
              <span className="domain-chip-indicator" />
              <span>{d.short}: {d.name}</span>
              <span className="domain-chip-weight">{d.weight}</span>
            </button>
          ))}
        </div>

        <div className="question-count-section">
          <div className="config-label">
            Questions per session ({availableCount} available)
          </div>
          <div className="question-count-config">
            <input
              type="range"
              className="count-slider"
              min={1}
              max={maxQuestions}
              value={effectiveCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
            />
            <div className="count-value">{effectiveCount}</div>
          </div>
        </div>

        <div className="time-limit-section">
          <div className="config-label">Time Limit</div>
          <div className="time-limit-options">
            {TIME_LIMIT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`time-limit-chip ${timeLimit === opt.value ? 'active' : ''}`}
                onClick={() => setTimeLimit(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-start"
          onClick={onStart}
          disabled={selectedDomains.length === 0}
        >
          Start Exam ({effectiveCount} questions{timeLimit > 0 ? ` \u00b7 ${timeLimit} min` : ''})
        </button>
      </div>

    </div>
  )
}
