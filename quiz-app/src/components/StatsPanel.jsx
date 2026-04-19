import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../api'

const DOMAIN_COLORS = {
  1: '#f97316', 2: '#06b6d4', 3: '#8b5cf6', 4: '#10b981', 5: '#ec4899',
}
const DOMAIN_NAMES = {
  1: 'Agentic Architecture', 2: 'Tool Design & MCP', 3: 'Claude Code Config',
  4: 'Prompt Engineering', 5: 'Context Management',
}

export default function StatsPanel() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([api.getExamStats(), api.getExamHistory()])
      .then(([s, h]) => { setStats(s); setHistory(h) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user || loading) return null
  if (!stats || stats.total_exams === 0) return null

  return (
    <div className="stats-panel">
      <h3 className="stats-title">Your Performance</h3>

      {/* Summary row */}
      <div className="stats-summary">
        <div className="stats-card">
          <div className="stats-card-value">{stats.total_exams}</div>
          <div className="stats-card-label">Exams</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{Math.round(stats.avg_score)}</div>
          <div className="stats-card-label">Avg Score</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{stats.best_score}</div>
          <div className="stats-card-label">Best</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-value">{stats.pass_rate}%</div>
          <div className="stats-card-label">Pass Rate</div>
        </div>
      </div>

      {/* Score trend — simple bar chart of last 10 scores */}
      {stats.recent_scores?.length > 1 && (
        <div className="stats-trend">
          <div className="stats-trend-label">Recent Scores</div>
          <div className="stats-trend-bars">
            {stats.recent_scores.slice().reverse().map((score, i) => (
              <div key={i} className="stats-trend-bar-wrap">
                <div
                  className="stats-trend-bar"
                  style={{
                    height: `${((score - 100) / 900) * 100}%`,
                    background: score >= 720 ? '#22c55e' : '#ef4444',
                  }}
                  title={`Score: ${score}`}
                />
                <div className="stats-trend-bar-label">{score}</div>
              </div>
            ))}
          </div>
          <div className="stats-trend-pass-line" style={{ bottom: `${((720 - 100) / 900) * 100}%` }}>
            <span>720</span>
          </div>
        </div>
      )}

      {/* Domain performance */}
      {stats.domain_stats?.length > 0 && (
        <div className="stats-domains">
          <div className="stats-domains-label">Domain Performance</div>
          {stats.domain_stats.map(d => (
            <div key={d.domain_id} className="stats-domain-row">
              <span className="stats-domain-name" style={{ color: DOMAIN_COLORS[d.domain_id] }}>
                D{d.domain_id}
              </span>
              <div className="stats-domain-bar">
                <div
                  className="stats-domain-bar-fill"
                  style={{
                    width: `${d.percentage}%`,
                    background: DOMAIN_COLORS[d.domain_id],
                  }}
                />
              </div>
              <span className="stats-domain-pct">{d.percentage}%</span>
            </div>
          ))}
        </div>
      )}

      {/* History list */}
      {history.length > 0 && (
        <div className="stats-history">
          <div className="stats-history-label">Exam History</div>
          {history.slice(0, 5).map(exam => (
            <div key={exam.id} className="stats-history-row">
              <span className={`stats-history-score ${exam.passed ? 'pass' : 'fail'}`}>
                {exam.score}
              </span>
              <span className="stats-history-detail">
                {exam.correct_count}/{exam.total_questions} correct
              </span>
              <span className="stats-history-date">
                {new Date(exam.completed_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
