import { useState } from 'react'

export default function ShareExamModal({ open, onShare, onClose }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  const handleConfirm = async () => {
    if (!title.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onShare(title.trim())
      setTitle('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to share exam')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (loading) return
    setTitle('')
    setError(null)
    onClose()
  }

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <div className="share-modal-title">Share This Exam</div>
        <p className="share-modal-desc">Give your exam a name so others can find it.</p>
        <input
          className="share-modal-input"
          type="text"
          placeholder="Exam title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          maxLength={255}
          autoFocus
        />
        {error && <div className="share-modal-error">{error}</div>}
        <div className="share-modal-actions">
          <button className="btn-share-cancel" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-share-confirm"
            onClick={handleConfirm}
            disabled={!title.trim() || loading}
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
