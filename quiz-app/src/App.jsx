import { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'
import LearnScreen from './components/LearnScreen'
import RoadmapScreen from './components/RoadmapScreen'
import PracticeScreen from './components/PracticeScreen'
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
  const [showAuth, setShowAuth] = useState(false)
  const [quizProgress, setQuizProgress] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="app-logo">Claude Architect</div>
        </div>
        <nav className="header-nav">
          <NavLink to="/learn" className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}>
            Learn
          </NavLink>
          <NavLink to="/roadmap" className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}>
            Roadmap
          </NavLink>
          <NavLink to="/practice" className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}>
            Practice
          </NavLink>
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
        <Route path="/practice/*" element={<PracticeScreen domains={DOMAINS} onProgressChange={setQuizProgress} />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </div>
  )
}

export default App
