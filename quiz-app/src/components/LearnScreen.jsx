import { useState, useMemo } from 'react'
import { learnTopics } from '../data/learnTopics'

const DOMAINS = [
  { id: 1, name: "Agentic Architecture & Orchestration", short: "D1", weight: "27%" },
  { id: 2, name: "Tool Design & MCP Integration", short: "D2", weight: "18%" },
  { id: 3, name: "Claude Code Configuration & Workflows", short: "D3", weight: "20%" },
  { id: 4, name: "Prompt Engineering & Structured Output", short: "D4", weight: "20%" },
  { id: 5, name: "Context Management & Reliability", short: "D5", weight: "15%" },
]

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomains, setSelectedDomains] = useState([1, 2, 3, 4, 5])
  const [expandedDomains, setExpandedDomains] = useState([])

  const toggleDomain = (id) => {
    setSelectedDomains(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter(d => d !== id)
      }
      return [...prev, id]
    })
  }

  const toggleExpand = (domainId) => {
    setExpandedDomains(prev =>
      prev.includes(domainId)
        ? prev.filter(d => d !== domainId)
        : [...prev, domainId]
    )
  }

  const expandAll = () => {
    setExpandedDomains(DOMAINS.map(d => d.id))
  }

  const collapseAll = () => {
    setExpandedDomains([])
  }

  const filteredTopics = useMemo(() => {
    let topics = learnTopics.filter(t => selectedDomains.includes(t.domainId))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      topics = topics.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.keyConceptsList.some(c => c.toLowerCase().includes(q))
      )
    }
    return topics
  }, [searchQuery, selectedDomains])

  const topicsByDomain = useMemo(() => {
    const grouped = {}
    DOMAINS.forEach(d => {
      const domainTopics = filteredTopics.filter(t => t.domainId === d.id)
      if (domainTopics.length > 0) {
        grouped[d.id] = domainTopics
      }
    })
    return grouped
  }, [filteredTopics])

  return (
    <div className="learn-screen">
      <div className="learn-header">
        <div className="learn-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h1 className="learn-title">Study Guide</h1>
        <p className="learn-subtitle">
          Review key concepts across all 5 domains with links to official documentation
        </p>
      </div>

      <div className="learn-controls">
        <div className="learn-search-wrapper">
          <svg className="learn-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="learn-search"
            placeholder="Search topics, concepts, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="learn-search-clear" onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="learn-domain-filter">
          {DOMAINS.map(d => (
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

        <div className="learn-expand-controls">
          <button className="learn-expand-btn" onClick={expandAll}>Expand All</button>
          <button className="learn-expand-btn" onClick={collapseAll}>Collapse All</button>
          <span className="learn-topic-count">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} shown
          </span>
        </div>
      </div>

      {filteredTopics.length === 0 && (
        <div className="learn-empty">
          <p>No topics match your search. Try different keywords or select more domains.</p>
        </div>
      )}

      <div className="learn-domains">
        {DOMAINS.filter(d => topicsByDomain[d.id]).map(d => {
          const isExpanded = expandedDomains.includes(d.id)
          const topics = topicsByDomain[d.id]

          return (
            <div key={d.id} className="learn-domain-section">
              <button
                className={`learn-domain-header d${d.id}`}
                onClick={() => toggleExpand(d.id)}
              >
                <div className="learn-domain-header-left">
                  <svg
                    className={`learn-chevron ${isExpanded ? 'learn-chevron-open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="learn-domain-name">
                    {d.short}: {d.name}
                  </span>
                </div>
                <div className="learn-domain-header-right">
                  <span className="learn-domain-weight">{d.weight}</span>
                  <span className="learn-domain-topic-count">
                    {topics.length} topic{topics.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="learn-topic-grid">
                  {topics.map(topic => (
                    <div key={topic.id} className="learn-topic-card">
                      <h3 className="learn-topic-title">{topic.title}</h3>
                      <p className="learn-topic-summary">{topic.summary}</p>

                      <div className="learn-topic-concepts">
                        <h4 className="learn-concepts-heading">Key Concepts</h4>
                        <ul className="learn-concepts-list">
                          {topic.keyConceptsList.map((concept, i) => (
                            <li key={i} className="learn-concept-item">{concept}</li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={topic.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="learn-doc-link"
                      >
                        <span>Read Documentation</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
