import { useEffect, useRef, useState } from 'react'
import { PlusIcon, XIcon } from './icons'

const STATUSES = ['Applied', 'Interviewing', 'Rejected']
const INITIAL = { company: '', role: '', status: 'Applied' }

export default function AddApplicationModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const backdropRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(INITIAL)
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onAdd(form)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add application.')
    } finally {
      setSaving(false)
    }
  }

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
    >
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-icon">
            <PlusIcon width={18} height={18} />
          </div>
          <div>
            <h2 id="add-modal-title">Add application</h2>
            <p>Log a new role you've applied for</p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              type="text"
              placeholder="Senior Frontend Engineer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}