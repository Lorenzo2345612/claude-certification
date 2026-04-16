export default function QuizScreen({
  question,
  currentIndex,
  total,
  answer,
  showExplanation,
  onSelect,
  onConfirm,
  onNext,
  isLast,
}) {
  const isConfirmed = answer?.confirmed
  const selectedId = answer?.selected
  const isCorrect = selectedId === question.correctAnswer

  const getOptionClass = (opt) => {
    if (!isConfirmed) {
      return selectedId === opt.id ? 'selected' : ''
    }
    let cls = 'locked '
    if (opt.correct) cls += 'correct'
    else if (selectedId === opt.id) cls += 'incorrect'
    else if (opt.correct) cls += 'was-correct'
    return cls
  }

  const getIcon = (opt) => {
    if (!isConfirmed) return null
    if (opt.correct) return '\u2713'
    if (selectedId === opt.id && !opt.correct) return '\u2717'
    return null
  }

  return (
    <div>
      {/* Progress */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-question">
            Question {currentIndex + 1} of {total}
          </span>
          <span className={`progress-domain d${question.domainId}`}>
            D{question.domainId}: {question.domain}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill d${question.domainId}`}
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="question-card">
        <div className="scenario-badge">{question.scenario}</div>
        <div className="question-text">{question.question}</div>

        <div className="options-list">
          {question.options.map(opt => (
            <button
              key={opt.id}
              className={`option-btn ${getOptionClass(opt)}`}
              onClick={() => !isConfirmed && onSelect(question.id, opt.id)}
            >
              <span className="option-letter">{opt.id}</span>
              <span className="option-text">{opt.text}</span>
              {getIcon(opt) && <span className="option-icon">{getIcon(opt)}</span>}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="question-actions">
          {!isConfirmed ? (
            <button
              className="btn-confirm"
              disabled={!selectedId}
              onClick={() => onConfirm(question.id)}
            >
              Confirm Answer
            </button>
          ) : (
            <button className="btn-next" onClick={onNext}>
              {isLast ? 'View Results' : 'Next Question \u2192'}
            </button>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && isConfirmed && (
          <div className={`explanation ${isCorrect ? 'correct-exp' : 'incorrect-exp'}`}>
            <div className="explanation-header">
              <span className="explanation-header-icon">
                {isCorrect ? '\u2713' : '\u2717'}
              </span>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <div className="explanation-body">
              <strong>Correct answer ({question.correctAnswer.toUpperCase()}):</strong>{' '}
              {question.explanation}
            </div>

            {question.whyOthersWrong && (
              <div className="why-wrong">
                <div className="why-wrong-title">Why other options are wrong</div>
                {Object.entries(question.whyOthersWrong)
                  .filter(([key]) => key !== question.correctAnswer)
                  .map(([key, text]) => (
                    <div key={key} className="wrong-item">
                      <span className="wrong-item-letter">{key.toUpperCase()})</span>
                      <span>{text}</span>
                    </div>
                  ))}
              </div>
            )}

            {question.docReference && (
              <div className="doc-reference">
                <div className="doc-reference-header">
                  <div className="doc-reference-header-left">
                    <span className="doc-reference-label">Documentation reference</span>
                    {question.docStatus && (
                      <span className={`doc-status-badge status-${question.docStatus.toLowerCase()}`}>
                        {question.docStatus === 'STRONG' ? 'Documented' :
                         question.docStatus === 'PARTIAL' ? 'Partial doc' :
                         question.docStatus === 'EXAM_GUIDE' ? 'Exam guide' :
                         question.docStatus}
                      </span>
                    )}
                  </div>
                  <span className="doc-reference-source">{question.docReference.source}</span>
                </div>
                <blockquote className="doc-reference-quote">
                  {question.docReference.quote}
                </blockquote>
              </div>
            )}

            {question.docUrl && (
              <a
                className="doc-link"
                href={question.docUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the official Anthropic documentation &rarr;
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
