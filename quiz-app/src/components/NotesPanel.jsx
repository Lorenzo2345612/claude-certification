import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../AuthContext'
import { api } from '../api'

export default function NotesPanel({ topicId, isOpen, onToggle }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const saveTimer = useRef(null)
  const prevTopicId = useRef(topicId)

  useEffect(() => {
    if (!user || !topicId) return
    prevTopicId.current = topicId
    setLoading(true)
    setSaved(true)
    api.getNote(topicId)
      .then(note => {
        if (prevTopicId.current === topicId) setContent(note.content)
      })
      .catch(() => {
        if (prevTopicId.current === topicId) setContent('')
      })
      .finally(() => {
        if (prevTopicId.current === topicId) setLoading(false)
      })
  }, [user, topicId])

  const scheduleAutosave = useCallback((newContent) => {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      if (!topicId) return
      setSaving(true)
      try {
        await api.upsertNote(topicId, newContent)
        setSaved(true)
      } catch {
      } finally {
        setSaving(false)
      }
    }, 1000)
  }, [topicId])

  const handleChange = (e) => {
    const val = e.target.value
    setContent(val)
    scheduleAutosave(val)
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const floatingButton = user && (
    <button className="notes-fab" onClick={onToggle} aria-label="Toggle notes panel">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    </button>
  )

  if (!user) {
    return (
      <>
        <div className={`notes-panel ${isOpen ? 'notes-panel--mobile-open' : ''}`}>
          <div className="notes-panel-header">
            <h3 className="notes-panel-title">Notes</h3>
            <button className="notes-panel-close" onClick={onToggle} aria-label="Close notes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="notes-panel-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <p>Sign in to take notes on each topic</p>
          </div>
        </div>
        {floatingButton}
      </>
    )
  }

  return (
    <>
      <div className={`notes-panel ${isOpen ? 'notes-panel--mobile-open' : ''}`}>
        <div className="notes-panel-drag-handle" onClick={onToggle}>
          <div className="notes-panel-drag-bar" />
        </div>

        <div className="notes-panel-header">
          <h3 className="notes-panel-title">Notes</h3>
          <div className="notes-panel-header-right">
            <span className={`notes-panel-status ${saved ? 'notes-panel-status--saved' : ''}`}>
              {saving ? 'Saving...' : saved ? 'Saved' : 'Unsaved'}
            </span>
            <button className="notes-panel-close" onClick={onToggle} aria-label="Close notes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="notes-panel-loading">Loading...</div>
        ) : (
          <div className="notes-live">
            <textarea
              className="notes-panel-editor"
              value={content}
              onChange={handleChange}
              placeholder="Write in Markdown... (auto-saves)"
              spellCheck={false}
            />
            <div className="notes-live-divider">
              <span className="notes-live-divider-label">Preview</span>
            </div>
            <div className="notes-preview">
              {content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }) => <img {...props} loading="lazy" />,
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="notes-preview-placeholder">
                  The rendered preview will appear here as you type...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && <div className="notes-overlay" onClick={onToggle} />}
      {floatingButton}
    </>
  )
}
