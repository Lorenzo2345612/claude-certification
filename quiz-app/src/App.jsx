import { useState, useCallback, useRef } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import LearnScreen from './components/LearnScreen'
import RoadmapScreen from './components/RoadmapScreen'
import PracticeScreen from './components/PracticeScreen'
import PerformanceScreen from './components/PerformanceScreen'
import FlashcardsScreen from './components/FlashcardsScreen'
import ExamsScreen from './components/ExamsScreen'
import AuthModal from './components/AuthModal'
import { useAuth } from './AuthContext'

const DOMAINS = [
  { id: 1, name: "Agentic Architecture & Orchestration", short: "D1", weight: "27%" },
  { id: 2, name: "Tool Design & MCP Integration", short: "D2", weight: "18%" },
  { id: 3, name: "Claude Code Configuration & Workflows", short: "D3", weight: "20%" },
  { id: 4, name: "Prompt Engineering & Structured Output", short: "D4", weight: "20%" },
  { id: 5, name: "Context Management & Reliability", short: "D5", weight: "15%" },
]

function App() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [quizProgress, setQuizProgress] = useState(null)
  const [quizActive, setQuizActive] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const pendingNavRef = useRef(null)
  const leaveCallbackRef = useRef(null)

  const handleNavClick = useCallback((e, to) => {
    if (quizActive) {
      e.preventDefault()
      pendingNavRef.current = to
      setShowLeaveDialog(true)
    }
  }, [quizActive])

  const handleLeaveConfirm = useCallback(() => {
    setShowLeaveDialog(false)
    leaveCallbackRef.current?.()
    if (pendingNavRef.current) {
      navigate(pendingNavRef.current)
      pendingNavRef.current = null
    }
  }, [navigate])

  const handleLeaveCancel = useCallback(() => {
    setShowLeaveDialog(false)
    pendingNavRef.current = null
  }, [])

  const navTabs = [
    { to: '/learn', label: 'Learn' },
    { to: '/roadmap', label: 'Roadmap' },
    { to: '/practice', label: 'Practice' },
    { to: '/flashcards', label: 'Flashcards' },
    { to: '/exams', label: 'Exams' },
    { to: '/performance', label: 'Performance' },
  ]

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="app-logo">Claude Architect</div>
        </div>
        <nav className="header-nav">
          {navTabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}
              onClick={(e) => handleNavClick(e, tab.to)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          {quizProgress && (
            <span className="header-quiz-progress">{quizProgress}</span>
          )}
          {user ? (
            <div className="header-user">
              <span className="header-username">{user.username}</span>
              <button className="header-auth-btn header-auth-btn--logout" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="header-auth-btn" onClick={() => setShowAuth(true)}>Sign In</button>
          )}
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <Routes>
        <Route path="/learn" element={<LearnScreen domains={DOMAINS} />} />
        <Route path="/learn/:topicId" element={<LearnScreen domains={DOMAINS} />} />
        <Route path="/roadmap" element={<RoadmapScreen />} />
        <Route path="/practice/*" element={<PracticeScreen domains={DOMAINS} onProgressChange={setQuizProgress} onQuizActiveChange={setQuizActive} onLeaveCallbackRef={leaveCallbackRef} />} />
        <Route path="/flashcards" element={<FlashcardsScreen />} />
        <Route path="/exams" element={<ExamsScreen domains={DOMAINS} onProgressChange={setQuizProgress} onQuizActiveChange={setQuizActive} onLeaveCallbackRef={leaveCallbackRef} />} />
        <Route path="/performance" element={<PerformanceScreen />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>

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

export default App
