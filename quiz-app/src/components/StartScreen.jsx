export default function StartScreen({
  domains,
  selectedDomains,
  setSelectedDomains,
  filterMode,
  setFilterMode,
  scenarios,
  selectedScenarios,
  setSelectedScenarios,
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

  const toggleScenario = (name) => {
    setSelectedScenarios(prev => {
      if (prev.includes(name)) {
        if (prev.length === 1) return prev
        return prev.filter(s => s !== name)
      }
      return [...prev, name]
    })
  }

  const maxQuestions = availableCount
  const effectiveCount = Math.min(questionCount, availableCount)

  const hasSelection = filterMode === 'domain'
    ? selectedDomains.length > 0
    : selectedScenarios.length > 0

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
        <div className="filter-mode-toggle">
          <button
            className={`filter-mode-btn ${filterMode === 'domain' ? 'active' : ''}`}
            onClick={() => setFilterMode('domain')}
          >
            By Domain
          </button>
          <button
            className={`filter-mode-btn ${filterMode === 'scenario' ? 'active' : ''}`}
            onClick={() => setFilterMode('scenario')}
          >
            By Scenario
          </button>
        </div>

        {filterMode === 'domain' ? (
          <>
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
          </>
        ) : (
          <>
            <div className="config-label">
              Scenarios
              <span className="config-label-hint"> &mdash; real exam uses 4 of 6</span>
            </div>
            <div className="domain-filter">
              {scenarios.map(s => (
                <button
                  key={s.id}
                  className={`scenario-chip ${selectedScenarios.includes(s.name) ? 'active' : ''}`}
                  onClick={() => toggleScenario(s.name)}
                >
                  <span className="scenario-chip-indicator" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

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
            <input
              type="number"
              className="count-input"
              min={1}
              max={maxQuestions}
              value={effectiveCount}
              onChange={e => setQuestionCount(Number(e.target.value) || 1)}
              onBlur={e => {
                const v = Math.max(1, Math.min(maxQuestions, Number(e.target.value) || 1))
                setQuestionCount(v)
              }}
            />
          </div>
        </div>

        <div className="time-limit-section">
          <div className="config-label">Time Limit</div>
          <div className="time-limit-config">
            <button
              className={`time-limit-chip ${timeLimit === 0 ? 'active' : ''}`}
              onClick={() => setTimeLimit(0)}
            >
              No limit
            </button>
            <button
              className={`time-limit-chip ${timeLimit > 0 ? 'active' : ''}`}
              onClick={() => setTimeLimit(prev => prev === 0 ? 120 : prev)}
            >
              Timed
            </button>
          </div>
          {timeLimit > 0 && (
            <div className="question-count-config">
              <input
                type="range"
                className="count-slider"
                min={1}
                max={120}
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))}
              />
              <input
                type="number"
                className="count-input"
                min={1}
                max={120}
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value) || 1)}
                onBlur={e => {
                  const v = Math.max(1, Math.min(120, Number(e.target.value) || 1))
                  setTimeLimit(v)
                }}
              />
              <span className="count-unit">min</span>
            </div>
          )}
        </div>

        <button
          className="btn-start"
          onClick={onStart}
          disabled={!hasSelection}
        >
          Start Exam ({effectiveCount} questions{timeLimit > 0 ? ` \u00b7 ${timeLimit} min` : ''})
        </button>
      </div>

    </div>
  )
}
