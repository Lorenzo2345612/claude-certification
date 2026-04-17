import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../AuthContext'
import { api } from '../api'

const TOOLBAR_ACTIONS = [
  { label: 'B', title: 'Bold', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { label: 'I', title: 'Italic', prefix: '*', suffix: '*', placeholder: 'italic text', style: { fontStyle: 'italic' } },
  { label: '<>', title: 'Inline code', prefix: '`', suffix: '`', placeholder: 'code' },
  { label: '{ }', title: 'Code block', prefix: '```\n', suffix: '\n```', placeholder: 'code', block: true },
  { label: 'H', title: 'Heading', prefix: '## ', suffix: '', placeholder: 'heading', line: true },
  { label: '[-]', title: 'List item', prefix: '- ', suffix: '', placeholder: 'item', line: true },
  { label: '>', title: 'Blockquote', prefix: '> ', suffix: '', placeholder: 'quote', line: true },
  { label: 'Lnk', title: 'Link', prefix: '[', suffix: '](url)', placeholder: 'link text' },
  { label: 'Img', title: 'Image', isImage: true },
]

function insertMarkdown(textarea, action, content, setContent, scheduleAutosave) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = content.substring(start, end)
  const before = content.substring(0, start)
  const after = content.substring(end)

  let insertText
  if (selected) {
    insertText = action.prefix + selected + action.suffix
  } else {
    insertText = action.prefix + action.placeholder + action.suffix
  }

  // For line-level actions, ensure we're at the start of a line
  if (action.line && start > 0 && content[start - 1] !== '\n') {
    insertText = '\n' + insertText
  }

  const newContent = before + insertText + after
  setContent(newContent)
  scheduleAutosave(newContent)

  // Set cursor position after React re-renders
  requestAnimationFrame(() => {
    if (!selected) {
      const lineOffset = (action.line && start > 0 && content[start - 1] !== '\n') ? 1 : 0
      const cursorPos = before.length + lineOffset + action.prefix.length
      textarea.selectionStart = cursorPos
      textarea.selectionEnd = cursorPos + action.placeholder.length
    } else {
      const cursorPos = before.length + insertText.length
      textarea.selectionStart = cursorPos
      textarea.selectionEnd = cursorPos
    }
    textarea.focus()
  })
}

function MarkdownPreview({ content }) {
  return (
    <div className="notes-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => (
            <img {...props} loading="lazy" />
          ),
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content || '_No notes yet. Start writing in the editor._'}
      </ReactMarkdown>
    </div>
  )
}

export default function NotesPanel({ topicId, isOpen, onToggle }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('split')
  const saveTimer = useRef(null)
  const prevTopicId = useRef(topicId)
  const textareaRef = useRef(null)

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

  const handleToolbarClick = (action) => {
    if (action.isImage) {
      const url = prompt('Enter image URL:')
      if (!url) return
      const alt = prompt('Enter alt text (optional):') || 'image'
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const before = content.substring(0, start)
      const after = content.substring(start)
      const insertText = `![${alt}](${url})`
      const newContent = before + insertText + after
      setContent(newContent)
      scheduleAutosave(newContent)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = before.length + insertText.length
        textarea.focus()
      })
      return
    }
    const textarea = textareaRef.current
    if (!textarea) return
    insertMarkdown(textarea, action, content, setContent, scheduleAutosave)
  }

  // Keyboard shortcuts in textarea
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault()
        handleToolbarClick(TOOLBAR_ACTIONS[0])
      } else if (e.key === 'i') {
        e.preventDefault()
        handleToolbarClick(TOOLBAR_ACTIONS[1])
      }
    }
  }

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  // Floating toggle button for mobile
  const floatingButton = user && (
    <button
      className="notes-fab"
      onClick={onToggle}
      title="Toggle notes"
      aria-label="Toggle notes panel"
    >
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="notes-panel-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <p>Sign in to take notes on each topic</p>
          </div>
        </div>
        {floatingButton}
      </>
    )
  }

  const showEditor = viewMode === 'write' || viewMode === 'split'
  const showPreview = viewMode === 'preview' || viewMode === 'split'

  return (
    <>
      <div className={`notes-panel ${isOpen ? 'notes-panel--mobile-open' : ''}`}>
        {/* Mobile drag handle */}
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="notes-view-tabs">
          {['write', 'split', 'preview'].map(mode => (
            <button
              key={mode}
              className={`notes-view-tab ${viewMode === mode ? 'notes-view-tab--active' : ''}`}
              onClick={() => setViewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Markdown toolbar — only shown when editor is visible */}
        {showEditor && (
          <div className="notes-toolbar">
            {TOOLBAR_ACTIONS.map((action) => (
              <button
                key={action.title}
                className="notes-toolbar-btn"
                title={action.title}
                onClick={() => handleToolbarClick(action)}
                style={action.style}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="notes-panel-loading">Loading...</div>
        ) : (
          <div className={`notes-body notes-body--${viewMode}`}>
            {showEditor && (
              <textarea
                ref={textareaRef}
                className="notes-panel-editor"
                value={content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Write your notes in Markdown... (auto-saves)"
                spellCheck={false}
              />
            )}
            {showPreview && (
              <MarkdownPreview content={content} />
            )}
          </div>
        )}
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && <div className="notes-overlay" onClick={onToggle} />}

      {/* Mobile floating action button */}
      {floatingButton}
    </>
  )
}
