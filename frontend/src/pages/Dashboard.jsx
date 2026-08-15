import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import Header from '../components/Header'
import ApplicationCard from '../components/ApplicationCard'
import AddApplicationModal from '../components/AddApplicationModal'
import StatCard from '../components/StatCard'
import { useToast } from '../context/useToast'
import {
  ActivityIcon,
  BriefcaseIcon,
  CalendarIcon,
  LayersIcon,
  PlusIcon,
} from '../components/icons'

const COLUMNS = [
  { key: 'Applied', label: 'Applied', dot: 'dot-applied' },
  { key: 'Interviewing', label: 'Interviewing', dot: 'dot-interviewing' },
  { key: 'Rejected', label: 'Rejected', dot: 'dot-rejected' },
]

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loadError, setLoadError] = useState('')
  const { showToast } = useToast()

  const fetchApplications = async () => {
    try {
      const { data } = await client.get('/applications/')
      setApplications(data)
    } catch {
      setLoadError('We couldn\u2019t load your applications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return applications
    return applications.filter(
      (app) =>
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q),
    )
  }, [applications, query])

  const stats = useMemo(() => {
    const total = applications.length
    const interviewing = applications.filter(
      (a) => a.status === 'Interviewing',
    ).length
    const active = applications.filter((a) => a.status !== 'Rejected').length
    const rejected = applications.filter((a) => a.status === 'Rejected').length
    const rate = total ? Math.round((rejected / total) * 100) : 0
    return { total, interviewing, active, rejected, rate }
  }, [applications])

  const handleAdd = async (form) => {
    try {
      const { data } = await client.post('/applications/', form)
      setApplications((prev) => [data, ...prev])
      showToast(`Added ${data.company} \u2014 ${data.role}`)
    } catch (err) {
      const detail = err.response?.data
      const message =
        detail?.company?.[0] ||
        detail?.role?.[0] ||
        'Something went wrong. Please try again.'
      throw new Error(message)
    }
  }

  const handleChangeStatus = async (id, status) => {
    const previous = applications
    const target = applications.find((a) => a.id === id)
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app)),
    )
    try {
      await client.patch(`/applications/${id}/`, { status })
      showToast(`${target?.company} moved to ${status}`)
    } catch {
      setApplications(previous)
      showToast('Could not update status.', 'error')
    }
  }

  const handleDelete = async (id) => {
    const target = applications.find((a) => a.id === id)
    try {
      await client.delete(`/applications/${id}/`)
      setApplications((prev) => prev.filter((app) => app.id !== id))
      showToast(`Removed ${target?.company}`)
    } catch {
      showToast('Could not delete the application.', 'error')
    }
  }

  return (
    <div className="app-shell">
      <Header onSearch={setQuery} />

      <main className="container">
        <div className="dashboard-head">
          <div>
            <h1 className="page-title">Job applications</h1>
            <p className="page-subtitle">
              Track your pipeline and keep your search organised.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-with-icon"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon width={16} height={16} />
            Add application
          </button>
        </div>

        {loadError && <p className="banner-error">{loadError}</p>}

        <section className="stats-grid">
          <StatCard
            label="Total applied"
            value={stats.total}
            icon={<BriefcaseIcon width={18} height={18} />}
            tone="indigo"
          />
          <StatCard
            label="Active pipeline"
            value={stats.active}
            sub="not rejected"
            icon={<ActivityIcon width={18} height={18} />}
            tone="sky"
          />
          <StatCard
            label="Interviewing"
            value={stats.interviewing}
            icon={<CalendarIcon width={18} height={18} />}
            tone="amber"
          />
          <StatCard
            label="Rejection rate"
            value={`${stats.rate}%`}
            icon={<LayersIcon width={18} height={18} />}
            tone="rose"
          />
        </section>

        {loading ? (
          <div className="board-skeleton">
            {[0, 1, 2].map((i) => (
              <div className="skeleton-column" key={i}>
                <div className="skeleton-line short" />
                {[0, 1, 2].map((j) => (
                  <div className="skeleton-card" key={j} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="board">
            {COLUMNS.map((column) => {
              const items = filtered.filter((a) => a.status === column.key)
              const totalInColumn = applications.filter(
                (a) => a.status === column.key,
              ).length
              return (
                <section className="board-column" key={column.key}>
                  <div className="board-column-header">
                    <div className="board-column-title">
                      <span className={`column-dot ${column.dot}`} />
                      <span>{column.label}</span>
                      <span className="count">{totalInColumn}</span>
                    </div>
                  </div>
                  <div className="board-column-body">
                    {items.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onChangeStatus={handleChangeStatus}
                        onDelete={handleDelete}
                      />
                    ))}
                    {items.length === 0 && (
                      <div className="empty-column">
                        {query ? (
                          <p>{`No matches for \u201c${query}\u201d`}</p>
                        ) : (
                          <>
                            <p>No applications here yet.</p>
                            <p className="empty-hint">
                              Move a card here or add a new application.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>

      <AddApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}