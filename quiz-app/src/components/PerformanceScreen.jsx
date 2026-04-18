import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'

const DOMAINS = {
  1: { name: "Agentic Architecture", short: "D1", color: "#f97316" },
  2: { name: "Tool Design & MCP", short: "D2", color: "#06b6d4" },
  3: { name: "Claude Code Config", short: "D3", color: "#8b5cf6" },
  4: { name: "Prompt Engineering", short: "D4", color: "#10b981" },
  5: { name: "Context Management", short: "D5", color: "#ec4899" },
}

const PASS_THRESHOLD = 720

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function ExamIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function GaugeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 1012 0V2z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="perf-spinner" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="#1e293b" strokeWidth="4"/>
      <path d="M36 20a16 16 0 00-16-16" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  )
}

// ── Score Trend Chart ──────────────────────────────────────────────────────────

function ScoreTrendChart({ scores }) {
  if (!scores || scores.length === 0) return null

  const W = 600, H = 260
  const PAD = { top: 30, right: 30, bottom: 40, left: 50 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const minY = 100, maxY = 1000

  const points = scores.map((s, i) => ({
    x: PAD.left + (scores.length === 1 ? chartW / 2 : (i / (scores.length - 1)) * chartW),
    y: PAD.top + chartH - ((s - minY) / (maxY - minY)) * chartH,
    score: s,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = linePath + ` L${points[points.length - 1].x},${PAD.top + chartH} L${points[0].x},${PAD.top + chartH} Z`

  const passY = PAD.top + chartH - ((PASS_THRESHOLD - minY) / (maxY - minY)) * chartH

  const yTicks = [200, 400, 600, 720, 800, 1000]

  return (
    <div className="perf-chart-container">
      <h3 className="perf-section-title">Score Trend</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="perf-chart-svg">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map(tick => {
          const y = PAD.top + chartH - ((tick - minY) / (maxY - minY)) * chartH
          return (
            <g key={tick}>
              <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
                stroke="#1e293b" strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end"
                fill="#64748b" fontSize="11" fontFamily="inherit">{tick}</text>
            </g>
          )
        })}

        {/* Pass threshold */}
        <line x1={PAD.left} y1={passY} x2={PAD.left + chartW} y2={passY}
          className="threshold-line" opacity="0.7"/>
        <text x={PAD.left + chartW + 4} y={passY + 4}
          className="threshold-label" fontFamily="inherit">720 Pass</text>

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#06060f" stroke="#f97316" strokeWidth="2.5"/>
            <text x={p.x} y={p.y - 12} textAnchor="middle"
              fill="#f1f5f9" fontSize="11" fontWeight="600" fontFamily="inherit">{p.score}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={PAD.top + chartH + 24} textAnchor="middle"
            fill="#64748b" fontSize="11" fontFamily="inherit">#{i + 1}</text>
        ))}
      </svg>
    </div>
  )
}

// ── Domain Strength Bars ───────────────────────────────────────────────────────

function DomainStrengthBars({ domainStats }) {
  if (!domainStats || domainStats.length === 0) return null

  return (
    <div className="perf-domains-container">
      <h3 className="perf-section-title">Domain Strength</h3>
      <div className="perf-domains-list">
        {domainStats.map(ds => {
          const domain = DOMAINS[ds.domain_id]
          if (!domain) return null
          const pct = Math.round(ds.percentage)
          const strong = pct >= 70
          return (
            <div className="perf-domain-row" key={ds.domain_id}>
              <div className="perf-domain-indicator" style={{ background: domain.color }} />
              <div className="perf-domain-info">
                <div className="perf-domain-header">
                  <span className="perf-domain-name">
                    <span className="perf-domain-short" style={{ color: domain.color }}>{domain.short}</span>
                    {domain.name}
                  </span>
                  <div className="perf-domain-score-group">
                    <span className="perf-domain-score">{pct}%</span>
                    <span className={`perf-domain-badge ${strong ? 'perf-domain-badge--pass' : 'perf-domain-badge--fail'}`}>
                      {strong ? 'Strong' : 'Needs Work'}
                    </span>
                  </div>
                </div>
                <div className="perf-domain-bar-bg">
                  <div
                    className="perf-domain-bar-fill"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${domain.color}, ${domain.color}cc)` }}
                  />
                  {/* 70% marker */}
                  <div className="perf-domain-bar-marker" />
                </div>
                <div className="perf-domain-detail">
                  {ds.correct}/{ds.total} correct
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Domain Heatmap ────────────────────────────────────────────────────────────

function DomainHeatmap({ domainStats }) {
  if (!domainStats || domainStats.length === 0) return null

  return (
    <div className="perf-domains-container">
      <h3 className="perf-section-title">Domain Heatmap</h3>
      <div className="domain-heatmap">
        {domainStats.map(ds => {
          const domain = DOMAINS[ds.domain_id]
          if (!domain) return null
          const pct = Math.round(ds.percentage)
          const heatClass = pct < 50 ? 'heat-red' : pct < 70 ? 'heat-yellow' : 'heat-green'
          return (
            <div className={`heatmap-cell ${heatClass}`} key={ds.domain_id}>
              <div className="heatmap-pct">{pct}%</div>
              <div className="heatmap-name">{domain.short} — {domain.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Recommendation Card ───────────────────────────────────────────────────────

function RecommendationCard({ domainStats }) {
  if (!domainStats || domainStats.length === 0) return null

  let weakest = null
  for (const ds of domainStats) {
    const domain = DOMAINS[ds.domain_id]
    if (!domain) continue
    if (!weakest || ds.percentage < weakest.percentage) {
      weakest = { ...ds, domain }
    }
  }

  if (!weakest) return null

  const pct = Math.round(weakest.percentage)

  return (
    <div className="recommendation-card">
      <div className="recommendation-label">Recommendation</div>
      <div className="recommendation-text">
        Focus on {weakest.domain.short} {weakest.domain.name} — your weakest domain at {pct}%
      </div>
    </div>
  )
}

// ── Exam History Table ─────────────────────────────────────────────────────────

function ExamHistoryTable({ history }) {
  if (!history || history.length === 0) return null

  return (
    <div className="perf-history-container">
      <h3 className="perf-section-title">Exam History</h3>
      <div className="perf-history-scroll">
        <table className="perf-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Questions</th>
              <th>Result</th>
              <th>Domains</th>
            </tr>
          </thead>
          <tbody>
            {history.map(exam => (
              <tr key={exam.id} className="perf-history-row">
                <td className="perf-history-date">
                  <div>{formatDate(exam.completed_at)}</div>
                  <div className="perf-history-time">{formatTime(exam.completed_at)}</div>
                </td>
                <td>
                  <span className={`perf-history-score ${exam.passed ? 'perf-history-score--pass' : 'perf-history-score--fail'}`}>
                    {exam.score}
                  </span>
                </td>
                <td className="perf-history-questions">
                  {exam.correct_count}/{exam.total_questions}
                </td>
                <td>
                  <span className={`perf-badge ${exam.passed ? 'perf-badge--pass' : 'perf-badge--fail'}`}>
                    {exam.passed ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td className="perf-history-domains">
                  {(exam.domains_selected || []).map(id => {
                    const d = DOMAINS[id]
                    return d ? (
                      <span key={id} className="perf-history-domain-tag" style={{ borderColor: d.color, color: d.color }}>
                        {d.short}
                      </span>
                    ) : null
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Weakest Questions Table ───────────────────────────────────────────────────

function WeakestQuestionsTable({ weakQuestions }) {
  if (!weakQuestions || weakQuestions.length === 0) return null

  return (
    <div className="weak-questions-section">
      <h3 className="perf-section-title">Weakest Questions</h3>
      <p className="weak-questions-subtitle">
        Questions you get wrong most often — focus your review here.
      </p>
      <div className="perf-history-scroll">
        <table className="weak-questions-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Scenario</th>
              <th>Domain</th>
              <th>Wrong / Total</th>
              <th>Error Rate</th>
            </tr>
          </thead>
          <tbody>
            {weakQuestions.slice(0, 10).map(wq => (
              <tr key={wq.question_id} className="weak-questions-row">
                <td className="weak-questions-text" title={wq.question_text}>
                  {wq.question_text.length > 80 ? wq.question_text.slice(0, 80) + '...' : wq.question_text}
                </td>
                <td className="weak-questions-scenario" title={wq.scenario}>
                  {wq.scenario.length > 50 ? wq.scenario.slice(0, 50) + '...' : wq.scenario}
                </td>
                <td className="weak-questions-domain">{wq.domain}</td>
                <td className="weak-questions-count">
                  {wq.incorrect_count} / {wq.total_attempts}
                </td>
                <td>
                  <span className={`weak-questions-rate ${wq.error_rate >= 75 ? 'rate-high' : wq.error_rate >= 50 ? 'rate-medium' : 'rate-low'}`}>
                    {wq.error_rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function PerformanceScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState(null)
  const [weakQuestions, setWeakQuestions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const [statsData, historyData, weakData] = await Promise.all([
          api.getExamStats(),
          api.getExamHistory(),
          api.getWeakQuestions(),
        ])
        if (!cancelled) {
          setStats(statsData)
          setHistory(historyData)
          setWeakQuestions(weakData)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [user])

  // ── Not logged in ──
  if (!user) {
    return (
      <div className="perf-screen">
        <div className="perf-empty">
          <div className="perf-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="perf-empty-title">Sign in to track your performance</h2>
          <p className="perf-empty-text">Create an account or sign in to save your exam results and view detailed analytics.</p>
        </div>
      </div>
    )
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="perf-screen">
        <div className="perf-loading">
          <SpinnerIcon />
          <p>Loading your performance data...</p>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="perf-screen">
        <div className="perf-empty">
          <h2 className="perf-empty-title">Something went wrong</h2>
          <p className="perf-empty-text">{error}</p>
        </div>
      </div>
    )
  }

  // ── No exams yet ──
  if (!stats || stats.total_exams === 0) {
    return (
      <div className="perf-screen">
        <div className="performance-empty">
          <div className="perf-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-4"/>
            </svg>
          </div>
          <h2>Your performance journey starts here</h2>
          <p>Complete a practice exam to unlock detailed analytics, domain breakdowns, score trends, and personalized recommendations.</p>
          <button className="btn-go-practice" onClick={() => navigate('/practice')}>
            Take Your First Exam
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  const statCards = [
    { label: 'Total Exams', value: stats.total_exams, icon: <ExamIcon />, color: '#f97316' },
    { label: 'Avg Score', value: stats.avg_score, icon: <GaugeIcon />, color: '#06b6d4' },
    { label: 'Best Score', value: stats.best_score, icon: <TrophyIcon />, color: '#8b5cf6' },
    { label: 'Pass Rate', value: `${Math.round(stats.pass_rate)}%`, icon: <CheckIcon />, color: '#10b981' },
  ]

  return (
    <div className="perf-screen">
      <div className="perf-header">
        <h2 className="perf-title">Performance Dashboard</h2>
        <p className="perf-subtitle">Track your certification journey</p>
      </div>

      {/* Hero Stats Row */}
      <div className="perf-stats-row">
        {statCards.map((card, i) => (
          <div className="perf-stat-card" key={i}>
            <div className="perf-stat-icon" style={{ color: card.color, background: `${card.color}15` }}>
              {card.icon}
            </div>
            <div className="perf-stat-value" style={{ color: card.color }}>{card.value}</div>
            <div className="perf-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Score Trend Chart */}
      {stats.recent_scores && stats.recent_scores.length > 1 && (
        <ScoreTrendChart scores={stats.recent_scores} />
      )}

      {/* Domain Strength Bars */}
      {stats.domain_stats && stats.domain_stats.length > 0 && (
        <DomainStrengthBars domainStats={stats.domain_stats} />
      )}

      {/* Domain Heatmap */}
      {stats.domain_stats && stats.domain_stats.length > 0 && (
        <DomainHeatmap domainStats={stats.domain_stats} />
      )}

      {/* Recommendation */}
      {stats.domain_stats && stats.domain_stats.length > 0 && (
        <RecommendationCard domainStats={stats.domain_stats} />
      )}

      {/* Weakest Questions */}
      {weakQuestions && weakQuestions.length > 0 && (
        <WeakestQuestionsTable weakQuestions={weakQuestions} />
      )}

      {/* Exam History Table */}
      {history && history.length > 0 && (
        <ExamHistoryTable history={history} />
      )}
    </div>
  )
}
