import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { learnTopics } from '../data/learnTopics'
import { learnSummaries } from '../data/learnSummaries'

const DOMAINS = [
  { id: 1, name: "Agentic Architecture & Orchestration", short: "D1", color: "#f97316" },
  { id: 2, name: "Tool Design & MCP Integration", short: "D2", color: "#06b6d4" },
  { id: 3, name: "Claude Code Configuration & Workflows", short: "D3", color: "#8b5cf6" },
  { id: 4, name: "Prompt Engineering & Structured Output", short: "D4", color: "#10b981" },
  { id: 5, name: "Context Management & Reliability", short: "D5", color: "#ec4899" },
]

const DOMAIN_MAP = Object.fromEntries(DOMAINS.map(d => [d.id, d]))
const TOPIC_MAP = Object.fromEntries(learnTopics.map(t => [t.id, t]))

export default function LearnScreen() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const defaultTopic = learnTopics.length > 0 ? learnTopics[0].id : null
  const [activeTopic, setActiveTopic] = useState(topicId || defaultTopic)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedDomains, setExpandedDomains] = useState(() => new Set(DOMAINS.map(d => d.id)))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const contentRef = useRef(null)

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return learnTopics
    const q = searchQuery.toLowerCase()
    return learnTopics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.domain && t.domain.toLowerCase().includes(q)) ||
      (t.content && t.content.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const topicsByDomain = useMemo(() => {
    const grouped = {}
    DOMAINS.forEach(d => {
      const topics = filteredTopics.filter(t => t.domainId === d.id)
      if (topics.length > 0) {
        grouped[d.id] = topics
      }
    })
    return grouped
  }, [filteredTopics])

  const currentTopic = TOPIC_MAP[activeTopic] || null
  const currentDomain = currentTopic ? DOMAIN_MAP[currentTopic.domainId] : null

  // Sync URL param to active topic
  useEffect(() => {
    if (topicId && TOPIC_MAP[topicId]) {
      setActiveTopic(topicId)
    }
  }, [topicId])

  const selectTopic = useCallback((id) => {
    setActiveTopic(id)
    setSidebarOpen(false)
    navigate(`/learn/${id}`, { replace: true })
  }, [navigate])

  // Scroll content to top when topic changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [activeTopic])

  const toggleDomain = useCallback((domainId) => {
    setExpandedDomains(prev => {
      const next = new Set(prev)
      if (next.has(domainId)) {
        next.delete(domainId)
      } else {
        next.add(domainId)
      }
      return next
    })
  }, [])

  // If active topic is not in filtered results, select the first filtered topic
  useEffect(() => {
    if (filteredTopics.length > 0 && !filteredTopics.find(t => t.id === activeTopic)) {
      setActiveTopic(filteredTopics[0].id)
    }
  }, [filteredTopics, activeTopic])

  return (
    <div className="learn-layout">
      {/* Mobile hamburger toggle */}
      <button
        className="learn-sidebar-toggle"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="learn-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`learn-sidebar ${sidebarOpen ? 'learn-sidebar--open' : ''}`}>
        <div className="learn-sidebar-search">
          <svg className="learn-sidebar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="learn-sidebar-search-input"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="learn-sidebar-search-clear" onClick={() => setSearchQuery('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <nav className="learn-sidebar-nav">
          {filteredTopics.length === 0 && (
            <div className="learn-sidebar-empty">
              No topics match your search.
            </div>
          )}

          {DOMAINS.filter(d => topicsByDomain[d.id]).map(d => {
            const isExpanded = expandedDomains.has(d.id)
            const topics = topicsByDomain[d.id]

            return (
              <div key={d.id} className="learn-sidebar-group">
                <button
                  className="learn-sidebar-domain"
                  style={{ borderLeftColor: d.color }}
                  onClick={() => toggleDomain(d.id)}
                >
                  <svg
                    className={`learn-sidebar-chevron ${isExpanded ? 'learn-sidebar-chevron--open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="learn-sidebar-domain-label" style={{ color: d.color }}>
                    {d.short}: {d.name}
                  </span>
                </button>

                {isExpanded && (
                  <div className="learn-sidebar-topics">
                    {topics.map(topic => (
                      <button
                        key={topic.id}
                        className={`learn-sidebar-topic ${activeTopic === topic.id ? 'learn-sidebar-topic--active' : ''}`}
                        style={activeTopic === topic.id ? { borderLeftColor: d.color } : undefined}
                        onClick={() => selectTopic(topic.id)}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Content panel */}
      <main className="learn-content" ref={contentRef}>
        {currentTopic && currentDomain ? (
          <>
            <div className="learn-content-header">
              <div className="learn-content-header-top">
                <span
                  className="learn-content-badge"
                  style={{ backgroundColor: currentDomain.color }}
                >
                  {currentDomain.short}: {currentDomain.name}
                </span>
                {currentTopic.docUrl && (
                  <a
                    href={currentTopic.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learn-content-doc-link"
                  >
                    {currentTopic.docLabel || 'Read Documentation'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                )}
              </div>
              <h1 className="learn-content-title">
                {currentTopic.title}
              </h1>
            </div>

            {/* Summary Box */}
            {learnSummaries[currentTopic.id] && (
              <div className="learn-summary-box">
                <div className="learn-summary-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Quick Summary
                </div>
                <div className="learn-summary-text">
                  {learnSummaries[currentTopic.id].summary}
                </div>
                {learnSummaries[currentTopic.id].keyConcepts && (
                  <div className="learn-summary-concepts">
                    <div className="learn-summary-concepts-label">Key Concepts</div>
                    {learnSummaries[currentTopic.id].keyConcepts.map((concept, i) => (
                      <span key={i} className="learn-concept-tag" data-tooltip={concept.definition || ''}>
                        {concept.term || concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div
              className="learn-content-body"
              dangerouslySetInnerHTML={{ __html: currentTopic.content }}
            />

            {currentTopic.relatedTopics && currentTopic.relatedTopics.length > 0 && (
              <div className="learn-content-related">
                <h3 className="learn-content-related-title">Related Topics</h3>
                <div className="learn-content-related-list">
                  {currentTopic.relatedTopics.map(relId => {
                    const rel = TOPIC_MAP[relId]
                    if (!rel) return null
                    const relDomain = DOMAIN_MAP[rel.domainId]
                    return (
                      <button
                        key={relId}
                        className="learn-content-related-item"
                        style={{ borderLeftColor: relDomain?.color || '#888' }}
                        onClick={() => selectTopic(relId)}
                      >
                        <div className="learn-content-related-info">
                          <span className="learn-content-related-name">{rel.title}</span>
                          <span className="learn-content-related-domain" style={{ color: relDomain?.color || '#888' }}>
                            {relDomain?.short}: {relDomain?.name}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="learn-content-empty">
            <p>Select a topic from the sidebar to begin reading.</p>
          </div>
        )}
      </main>
    </div>
  )
}
