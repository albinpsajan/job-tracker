import { BriefcaseIcon, CheckIcon, LayersIcon } from './icons'

const FEATURES = [
  'Track every application in one place',
  'Move candidates through a visual pipeline',
  'Stay on top of interviews with live status',
]

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-panel-brand">
            <div className="brand-mark brand-mark-light">
              <span>JT</span>
            </div>
            <span className="brand-name">JobTrack</span>
          </div>

          <div className="auth-panel-copy">
            <h1>Own your job hunt, one application at a time.</h1>
            <p>
              A simple CRM built for candidates — organise where you applied,
              what stage you're at, and what's next.
            </p>

            <ul className="auth-features">
              {FEATURES.map((feature) => (
                <li key={feature}>
                  <span className="auth-feature-check">
                    <CheckIcon width={14} height={14} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-panel-stats">
            <div className="auth-stat">
              <BriefcaseIcon width={18} height={18} />
              <div>
                <strong>3</strong>
                <span>Pipeline stages</span>
              </div>
            </div>
            <div className="auth-stat">
              <LayersIcon width={18} height={18} />
              <div>
                <strong>∞</strong>
                <span>Applications</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-form-side">{children}</main>
    </div>
  )
}