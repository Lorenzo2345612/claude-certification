import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'
import LearnScreen from './components/LearnScreen'
import PracticeScreen from './components/PracticeScreen'

const DOMAINS = [
  { id: 1, name: "Agentic Architecture & Orchestration", short: "D1", weight: "27%" },
  { id: 2, name: "Tool Design & MCP Integration", short: "D2", weight: "18%" },
  { id: 3, name: "Claude Code Configuration & Workflows", short: "D3", weight: "20%" },
  { id: 4, name: "Prompt Engineering & Structured Output", short: "D4", weight: "20%" },
  { id: 5, name: "Context Management & Reliability", short: "D5", weight: "15%" },
]

function App() {
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
          <NavLink to="/practice" className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}>
            Practice
          </NavLink>
        </nav>
        <div className="header-right" id="header-right-slot" />
      </header>

      <Routes>
        <Route path="/learn" element={<LearnScreen domains={DOMAINS} />} />
        <Route path="/learn/:topicId" element={<LearnScreen domains={DOMAINS} />} />
        <Route path="/practice/*" element={<PracticeScreen domains={DOMAINS} />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </div>
  )
}

export default App
