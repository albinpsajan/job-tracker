import { CalendarIcon, TrashIcon } from './icons'

const STATUS_META = {
  Applied: { label: 'Applied', className: 'status-applied' },
  Interviewing: { label: 'Interviewing', className: 'status-interviewing' },
  Rejected: { label: 'Rejected', className: 'status-rejected' },
}

const AVATAR_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
]

const colorFor = (company) => {
  let hash = 0
  for (const ch of company) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

const initialsFor = (company) =>
  company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export default function ApplicationCard({
  application,
  onChangeStatus,
  onDelete,
}) {
  const meta = STATUS_META[application.status] || STATUS_META.Applied
  const initials = initialsFor(application.company) || '?'
  const color = colorFor(application.company)

  return (
    <div className={`app-card app-card-${application.status.toLowerCase()}`}>
      <div className="app-card-top">
        <div className="app-company">
          <span className="company-avatar" style={{ background: color }}>
            {initials}
          </span>
          <span className="company-name">{application.company}</span>
        </div>
        <button
          type="button"
          className="icon-btn icon-btn-danger"
          onClick={() => onDelete(application.id)}
          title="Delete application"
          aria-label={`Delete ${application.company} application`}
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>

      <h3 className="app-role">{application.role}</h3>

      <div className="app-card-bottom">
        <span className="app-date">
          <CalendarIcon width={14} height={14} />
          {application.date_applied}
        </span>
        <select
          className={`status-select ${meta.className}`}
          value={application.status}
          onChange={(e) => onChangeStatus(application.id, e.target.value)}
          aria-label={`Status for ${application.company} ${application.role}`}
        >
          {Object.entries(STATUS_META).map(([value, s]) => (
            <option key={value} value={value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}