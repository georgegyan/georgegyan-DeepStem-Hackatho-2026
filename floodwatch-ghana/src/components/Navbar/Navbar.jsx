import RiskBadge from './RiskBadge'
import './Navbar.css'

/**
 * Navbar — top bar with app name, live risk badge, and manual refresh (FR-08, section 7.1).
 *
 * @param {{
 *   locationLabel: string,
 *   risk: object|null,
 *   stale?: boolean,
 *   onRefresh: () => void,
 *   refreshing?: boolean
 * }} props
 */
export default function Navbar({ locationLabel, risk, stale = false, onRefresh, refreshing = false }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 5 10.5 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 10.5 12 2 12 2Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div className="navbar__title">
          <span className="navbar__name">FloodWatch <em>Ghana</em></span>
          <span className="navbar__location">{locationLabel}</span>
        </div>
      </div>

      <div className="navbar__actions">
        <RiskBadge risk={risk} stale={stale} />
        <button
          type="button"
          className="navbar__refresh"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh now"
        >
          <svg
            className={`navbar__refresh-icon${refreshing ? ' is-spinning' : ''}`}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
          </svg>
          <span>{refreshing ? 'Refreshing…' : 'Refresh Now'}</span>
        </button>
      </div>
    </header>
  )
}
