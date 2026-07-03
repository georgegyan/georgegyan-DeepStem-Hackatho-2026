import { classifyRisk } from '../utils/riskEngine'
import './WeatherPanel.css'

function formatHour(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: 'numeric' })
  } catch {
    return '—'
  }
}

/**
 * WeatherPanel — sidebar/bottom weather card (FR-07):
 * current rainfall, risk badge, temperature, wind speed, and a 6-hour rainfall forecast bar chart.
 *
 * @param {{
 *   status: 'loading'|'ready'|'error',
 *   data: { rainfall: number, temperature: number, windSpeed: number, forecast: Array<{time:string, rainfall:number}> } | null,
 *   isStale?: boolean
 * }} props
 */
export default function WeatherPanel({ status, data, isStale = false }) {
  if (status === 'error') {
    return (
      <section className="weather-panel weather-panel--error" aria-live="polite">
        <p className="weather-panel__error-title">Couldn't reach Open-Meteo</p>
        <p className="weather-panel__error-body">
          No connection and no last-known reading is available yet. Check your network and try again.
        </p>
      </section>
    )
  }

  if (status === 'loading' && !data) {
    return (
      <section className="weather-panel weather-panel--loading" aria-busy="true">
        <div className="weather-panel__skel-line" style={{ width: '55%' }} />
        <div className="weather-panel__skel-line" style={{ width: '80%' }} />
        <div className="weather-panel__skel-chart" />
      </section>
    )
  }

  const risk = classifyRisk(data.rainfall)
  const maxRain = Math.max(1, ...data.forecast.map((f) => f.rainfall))

  return (
    <section className="weather-panel" aria-label="Current weather and 6-hour forecast">
      {isStale && (
        <div className="weather-panel__stale-banner">
          Showing last known data — live update failed
        </div>
      )}

      <div className="weather-panel__head">
        <span className="weather-panel__eyebrow">Right now</span>
        <span
          className="weather-panel__risk-chip"
          style={{ background: risk.color, color: risk.textOn }}
        >
          {risk.icon} {risk.label}
        </span>
      </div>

      <div className="weather-panel__rain">
        <span className="weather-panel__rain-value">{data.rainfall.toFixed(1)}</span>
        <span className="weather-panel__rain-unit">mm/hr</span>
      </div>

      <div className="weather-panel__stats">
        <div className="weather-panel__stat">
          <span className="weather-panel__stat-icon" aria-hidden="true">🌡️</span>
          <div>
            <p className="weather-panel__stat-value">
              {data.temperature !== null ? `${Math.round(data.temperature)}°C` : '—'}
            </p>
            <p className="weather-panel__stat-label">Temperature</p>
          </div>
        </div>
        <div className="weather-panel__stat">
          <span className="weather-panel__stat-icon" aria-hidden="true">💨</span>
          <div>
            <p className="weather-panel__stat-value">
              {data.windSpeed !== null ? `${Math.round(data.windSpeed)} km/h` : '—'}
            </p>
            <p className="weather-panel__stat-label">Wind speed</p>
          </div>
        </div>
      </div>

      <div className="weather-panel__forecast">
        <p className="weather-panel__forecast-title">6-hour rainfall forecast</p>
        <div className="weather-panel__bars">
          {data.forecast.map((point, i) => {
            const r = classifyRisk(point.rainfall)
            const heightPct = Math.max(6, (point.rainfall / maxRain) * 100)
            return (
              <div className="weather-panel__bar-col" key={point.time || i}>
                <span className="weather-panel__bar-value">{point.rainfall.toFixed(0)}</span>
                <div className="weather-panel__bar-track">
                  <div
                    className="weather-panel__bar-fill"
                    style={{ height: `${heightPct}%`, background: r.color }}
                  />
                </div>
                <span className="weather-panel__bar-label">
                  {i === 0 ? 'Now' : formatHour(point.time)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
