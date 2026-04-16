import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../api'

export default function NotesPanel({ topicId }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const saveTimer = useRef(null)
  const prevTopicId = useRef(topicId)

  // Load note when topic changes
  useEffect(() => {
    if (!user || !topicId) return
    prevTopicId.current = topicId
    setLoading(true)
    setSaved(true)
    api.getNote(topicId)
      .then(note => {
        if (prevTopicId.current === topicId) {
          setContent(note.content)
        }
      })
      .catch(() => {
        if (prevTopicId.current === topicId) {
          setContent('')
        }
      })
      .finally(() => {
        if (prevTopicId.current === topicId) {
          setLoading(false)
        }
      })
  }, [user, topicId])

  // Auto-save with debounce
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
        // silent fail — user can retry
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

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  if (!user) {
    return (
      <div className="notes-panel">
        <div className="notes-panel-header">
          <h3 className="notes-panel-title">Notes</h3>
        </div>
        <div className="notes-panel-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
          <p>Sign in to take notes on each topic</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notes-panel">
      <div className="notes-panel-header">
        <h3 className="notes-panel-title">Notes</h3>
        <span className={`notes-panel-status ${saved ? 'notes-panel-status--saved' : ''}`}>
          {saving ? 'Saving...' : saved ? 'Saved' : 'Unsaved'}
        </span>
      </div>
      {loading ? (
        <div className="notes-panel-loading">Loading...</div>
      ) : (
        <textarea
          className="notes-panel-editor"
          value={content}
          onChange={handleChange}
          placeholder="Write your notes here... (auto-saves)"
          spellCheck={false}
        />
      )}
    </div>
  )
}
