import './RiskBadge.css'

/**
 * RiskBadge — always-visible, color + text risk indicator (FR-06, NFR-05, section 7.2).
 * Text label always accompanies color so risk is never conveyed by color alone.
 *
 * @param {{ risk: object|null, stale?: boolean }} props
 */
export default function RiskBadge({ risk, stale = false }) {
  if (!risk) {
    return (
      <div className="risk-badge risk-badge--pending" role="status" aria-live="polite">
        <span className="risk-badge__dot" />
        <span className="risk-badge__label">Checking risk…</span>
      </div>
    )
  }

  const isUrgent = risk.key === 'CRITICAL' || risk.key === 'HIGH'

  return (
    <div
      className={`risk-badge${isUrgent ? ' risk-badge--pulsing' : ''}`}
      style={{ '--risk-color': risk.color, '--risk-text': risk.textOn }}
      role="status"
      aria-live="polite"
      title={risk.action}
    >
      {isUrgent && <span className="risk-badge__ping" aria-hidden="true" />}
      <span className="risk-badge__icon" aria-hidden="true">{risk.icon}</span>
      <span className="risk-badge__label">{risk.label.toUpperCase()}</span>
      {stale && <span className="risk-badge__stale">STALE DATA</span>}
    </div>
  )
}
