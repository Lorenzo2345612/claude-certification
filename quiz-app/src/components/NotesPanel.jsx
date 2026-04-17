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
  const [editing, setEditing] = useState(false)
  const saveTimer = useRef(null)
  const prevTopicId = useRef(topicId)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!user || !topicId) return
    prevTopicId.current = topicId
    setLoading(true)
    setSaved(true)
    setEditing(false)
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

  const saveNow = useCallback(async (text) => {
    if (!topicId) return
    setSaving(true)
    try {
      await api.upsertNote(topicId, text)
      setSaved(true)
    } catch {
    } finally {
      setSaving(false)
    }
  }, [topicId])

  const scheduleAutosave = useCallback((text) => {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      if (!topicId) return
      setSaving(true)
      try {
        await api.upsertNote(topicId, text)
        setSaved(true)
        setEditing(false)
      } catch {
      } finally {
        setSaving(false)
      }
    }, 1500)
  }, [topicId])

  const handleChange = (e) => {
    const val = e.target.value
    setContent(val)
    scheduleAutosave(val)
  }

  const startEditing = () => {
    setEditing(true)
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const len = textareaRef.current.value.length
        textareaRef.current.selectionStart = len
        textareaRef.current.selectionEnd = len
      }
    })
  }

  const finishEditing = () => {
    setEditing(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveNow(content)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      finishEditing()
    }
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
            {editing ? (
              <button className="notes-mode-btn notes-mode-btn--save" onClick={finishEditing} title="Save & preview (Esc)">
                Save
              </button>
            ) : (
              <button className="notes-mode-btn" onClick={startEditing} title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
            )}
            <button className="notes-panel-close" onClick={onToggle} aria-label="Close notes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="notes-panel-loading">Loading...</div>
        ) : editing ? (
          <textarea
            ref={textareaRef}
            className="notes-panel-editor"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Write in Markdown... (press Esc or Save to preview)"
            spellCheck={false}
          />
        ) : (
          <div className="notes-preview" onClick={startEditing}>
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => <img {...props} loading="lazy" />,
                  a: ({ node, ...props }) => {
                    const stop = (e) => e.stopPropagation()
                    return <a {...props} target="_blank" rel="noopener noreferrer" onClick={stop} />
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="notes-preview-placeholder">Click to start writing notes...</p>
            )}
          </div>
        )}
      </div>

      {isOpen && <div className="notes-overlay" onClick={onToggle} />}
      {floatingButton}
    </>
  )
}
