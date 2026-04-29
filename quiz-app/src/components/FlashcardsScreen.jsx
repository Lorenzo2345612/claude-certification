import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import CoursePicker from './CoursePicker'

const STORAGE_KEY = 'flashcard_states'
const INITIAL_KNOWN_INTERVAL = 5 * 60 * 1000   // 5 minutes
const REVIEW_INTERVAL = 60 * 1000               // 1 minute
const SYNC_DEBOUNCE_MS = 2000

function loadCardStates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveCardStates(states) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

function makeCardKey(topicId, term) {
  return `${topicId}::${term}`
}

function getCardState(states, key) {
  return states[key] || { status: 'new', lastSeen: 0, interval: 0 }
}

function isDue(cardState) {
  if (cardState.status === 'new') return true
  return Date.now() > cardState.lastSeen + cardState.interval
}

function sortCards(cards, states) {
  return [...cards].sort((a, b) => {
    const sa = getCardState(states, a.key)
    const sb = getCardState(states, b.key)
    const aDue = isDue(sa)
    const bDue = isDue(sb)

    // Priority: overdue review > overdue known > new > not-yet-due
    const priority = (s, due) => {
      if (s.status === 'review' && due) return 0
      if (s.status === 'known' && due) return 1
      if (s.status === 'new') return 2
      return 3
    }

    const pa = priority(sa, aDue)
    const pb = priority(sb, bDue)
    if (pa !== pb) return pa - pb

    // Within same priority, sort by oldest lastSeen first
    return sa.lastSeen - sb.lastSeen
  })
}

function mapTopicKeys(t) {
  return {
    ...t,
    domainId: t.domain_id ?? t.domainId,
    keyConcepts: t.key_concepts ?? t.keyConcepts,
    courseKey: t.course_key ?? t.courseKey ?? null,
    optionalIn: t.optional_in ?? t.optionalIn ?? [],
  }
}

function topicMatchesCourse(topic, courseKey) {
  if (!courseKey) return true
  if (topic.courseKey === courseKey) return true
  if (Array.isArray(topic.optionalIn) && topic.optionalIn.includes(courseKey)) return true
  return false
}

const DOMAINS = [
  { id: 1, name: "Agentic Architecture & Orchestration", short: "D1" },
  { id: 2, name: "Tool Design & MCP Integration", short: "D2" },
  { id: 3, name: "Claude Code Configuration & Workflows", short: "D3" },
  { id: 4, name: "Prompt Engineering & Structured Output", short: "D4" },
  { id: 5, name: "Context Management & Reliability", short: "D5" },
]

function getDomainShort(domainId) {
  const d = DOMAINS.find(d => d.id === domainId)
  return d ? d.short : `D${domainId}`
}

function getDomainName(domainId) {
  const d = DOMAINS.find(d => d.id === domainId)
  return d ? d.name : `Domain ${domainId}`
}

export default function FlashcardsScreen() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [cardStates, setCardStates] = useState(loadCardStates)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [domainFilter, setDomainFilter] = useState(null)
  const [courseFilter, setCourseFilterState] = useState(() => {
    try { return localStorage.getItem('course_filter:flashcards') || null } catch { return null }
  })
  const setCourseFilter = useCallback((v) => {
    setCourseFilterState(v)
    try {
      if (v) localStorage.setItem('course_filter:flashcards', v)
      else localStorage.removeItem('course_filter:flashcards')
    } catch {}
  }, [])
  const syncTimerRef = useRef(null)
  const pendingSyncRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getTopics()
        setTopics(data.map(mapTopicKeys))

        if (user) {
          try {
            const serverStates = await api.getFlashcardStates()
            const merged = { ...loadCardStates() }
            for (const s of serverStates) {
              const local = merged[s.card_key]
              if (!local || s.last_seen > (local.lastSeen || 0)) {
                merged[s.card_key] = {
                  status: s.status,
                  lastSeen: s.last_seen,
                  interval: s.interval_ms,
                }
              }
            }
            setCardStates(merged)
            saveCardStates(merged)
          } catch {}
        }
      } catch {}
      setLoading(false)
    }
    loadData()
  }, [user])

  // Extract all flashcards from topics
  const allCards = useMemo(() => {
    const cards = []
    for (const topic of topics) {
      const concepts = topic.keyConcepts
      if (!Array.isArray(concepts)) continue
      for (const c of concepts) {
        if (!c.term || !c.definition) continue
        cards.push({
          key: makeCardKey(topic.id, c.term),
          term: c.term,
          definition: c.definition,
          domainId: topic.domainId,
          topicTitle: topic.title,
          courseKey: topic.courseKey,
          optionalIn: topic.optionalIn,
        })
      }
    }
    return cards
  }, [topics])

  // Filter by domain + course
  const filteredCards = useMemo(() => {
    let cards = allCards
    if (domainFilter) cards = cards.filter(c => c.domainId === domainFilter)
    if (courseFilter) cards = cards.filter(c => topicMatchesCourse(c, courseFilter))
    return cards
  }, [allCards, domainFilter, courseFilter])

  // Sort cards by spaced repetition priority
  const sortedCards = useMemo(
    () => sortCards(filteredCards, cardStates),
    [filteredCards, cardStates]
  )

  // Stats
  const stats = useMemo(() => {
    let known = 0, review = 0, newCount = 0, due = 0
    for (const card of filteredCards) {
      const s = getCardState(cardStates, card.key)
      if (s.status === 'known') { known++; if (isDue(s)) due++ }
      else if (s.status === 'review') { review++; if (isDue(s)) due++ }
      else newCount++
    }
    return { known, review, new: newCount, total: filteredCards.length, due: due + newCount }
  }, [filteredCards, cardStates])

  const persistStates = useCallback((newStates) => {
    setCardStates(newStates)
    saveCardStates(newStates)

    if (user) {
      pendingSyncRef.current = newStates
      clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        const toSync = pendingSyncRef.current
        if (!toSync) return
        const items = Object.entries(toSync).map(([key, s]) => ({
          card_key: key,
          status: s.status || 'new',
          last_seen: s.lastSeen || 0,
          interval_ms: s.interval || 0,
        }))
        api.syncFlashcardStates(items).catch(() => {})
        pendingSyncRef.current = null
      }, SYNC_DEBOUNCE_MS)
    }
  }, [user])

  const markKnown = useCallback(() => {
    if (!sortedCards.length) return
    const card = sortedCards[currentIndex]
    const prev = getCardState(cardStates, card.key)
    const newInterval = prev.status === 'known'
      ? Math.min((prev.interval || INITIAL_KNOWN_INTERVAL) * 2, 7 * 24 * 60 * 60 * 1000)
      : INITIAL_KNOWN_INTERVAL
    const newStates = {
      ...cardStates,
      [card.key]: { status: 'known', lastSeen: Date.now(), interval: newInterval },
    }
    persistStates(newStates)
    setFlipped(false)
    // Move to next card (or wrap)
    if (currentIndex >= sortedCards.length - 1) setCurrentIndex(0)
  }, [sortedCards, currentIndex, cardStates, persistStates])

  const markReview = useCallback(() => {
    if (!sortedCards.length) return
    const card = sortedCards[currentIndex]
    const newStates = {
      ...cardStates,
      [card.key]: { status: 'review', lastSeen: Date.now(), interval: REVIEW_INTERVAL },
    }
    persistStates(newStates)
    setFlipped(false)
    if (currentIndex >= sortedCards.length - 1) setCurrentIndex(0)
  }, [sortedCards, currentIndex, cardStates, persistStates])

  const goNext = useCallback(() => {
    setFlipped(false)
    setCurrentIndex(i => (i + 1) % sortedCards.length)
  }, [sortedCards.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setCurrentIndex(i => (i - 1 + sortedCards.length) % sortedCards.length)
  }, [sortedCards.length])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(f => !f) }
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'k' || e.key === 'K') markKnown()
      else if (e.key === 'r' || e.key === 'R') markReview()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, markKnown, markReview])

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0)
    setFlipped(false)
  }, [domainFilter, courseFilter])

  if (loading) {
    return (
      <div className="flashcards-screen">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading flashcards...
        </div>
      </div>
    )
  }

  if (!allCards.length) {
    return (
      <div className="flashcards-screen">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No flashcards available. Topics need key concepts defined.
        </div>
      </div>
    )
  }

  const currentCard = sortedCards[currentIndex]
  const currentState = currentCard ? getCardState(cardStates, currentCard.key) : null

  return (
    <div className="flashcards-screen">
      <h2 className="flashcards-title">Flashcards</h2>

      {/* Course filter */}
      <CoursePicker value={courseFilter} onChange={setCourseFilter} />

      {/* Domain filter */}
      <div className="flashcard-domain-filter">
        <button
          className={`flashcard-filter-btn${!domainFilter ? ' flashcard-filter-btn--active' : ''}`}
          onClick={() => setDomainFilter(null)}
        >
          All
        </button>
        {DOMAINS.map(d => (
          <button
            key={d.id}
            className={`flashcard-filter-btn${domainFilter === d.id ? ' flashcard-filter-btn--active' : ''}`}
            onClick={() => setDomainFilter(d.id)}
          >
            {d.short}
          </button>
        ))}
      </div>

      {/* Progress stats */}
      <div className="flashcard-progress">
        <div className="flashcard-stat">
          <div className="flashcard-stat-value" style={{ color: '#34d399' }}>{stats.known}</div>
          <div className="flashcard-stat-label">Known</div>
        </div>
        <div className="flashcard-stat">
          <div className="flashcard-stat-value" style={{ color: '#f87171' }}>{stats.review}</div>
          <div className="flashcard-stat-label">Review</div>
        </div>
        <div className="flashcard-stat">
          <div className="flashcard-stat-value" style={{ color: '#60a5fa' }}>{stats.new}</div>
          <div className="flashcard-stat-label">New</div>
        </div>
        <div className="flashcard-stat">
          <div className="flashcard-stat-value" style={{ color: '#fbbf24' }}>{stats.due}</div>
          <div className="flashcard-stat-label">Due</div>
        </div>
      </div>

      {sortedCards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No cards in this domain.
        </div>
      ) : (
        <>
          {/* Flashcard */}
          <div className="flashcard-container" onClick={() => setFlipped(f => !f)}>
            <div className={`flashcard${flipped ? ' flipped' : ''}`}>
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-domain">
                  {getDomainShort(currentCard.domainId)} &middot; {currentCard.topicTitle}
                </div>
                <div className="flashcard-term">{currentCard.term}</div>
                {currentState && currentState.status !== 'new' && (
                  <div className={`flashcard-status-badge flashcard-status-badge--${currentState.status}`}>
                    {currentState.status}
                  </div>
                )}
                <div className="flashcard-hint">Click or press Space to flip</div>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-domain">
                  {getDomainShort(currentCard.domainId)} &middot; {currentCard.topicTitle}
                </div>
                <div className="flashcard-definition">{currentCard.definition}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flashcard-nav">
            <button className="flashcard-nav-btn" onClick={(e) => { e.stopPropagation(); goPrev() }}>
              &larr;
            </button>
            <span className="flashcard-counter">
              {currentIndex + 1} / {sortedCards.length}
            </span>
            <button className="flashcard-nav-btn" onClick={(e) => { e.stopPropagation(); goNext() }}>
              &rarr;
            </button>
          </div>

          {/* Actions */}
          <div className="flashcard-actions">
            <button className="btn-review" onClick={markReview}>
              Review Again (R)
            </button>
            <button className="btn-known" onClick={markKnown}>
              Known (K)
            </button>
          </div>

          <div className="flashcard-shortcuts">
            <span>Space/Enter: Flip</span>
            <span>Arrows: Navigate</span>
            <span>K: Known</span>
            <span>R: Review</span>
          </div>
        </>
      )}
    </div>
  )
}
