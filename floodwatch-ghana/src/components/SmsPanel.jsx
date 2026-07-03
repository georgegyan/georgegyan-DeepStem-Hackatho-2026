/**
 * @fileoverview SmsPanel — SMS Alert Simulation UI component for FloodWatch Ghana.
 *
 * Renders a styled panel that shows which simulated SMS alerts would be
 * dispatched to registered users when flood risk reaches High or Critical.
 * This is a display-only component — no real SMS gateway is contacted (SRS §2.5).
 *
 * @module SmsPanel
 */

import React from "react";
import "./SmsPanel.css";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Renders a single alert card.
 *
 * @param {Object}  props
 * @param {Object}  props.alert - Alert object produced by `generateAlert`.
 * @returns {JSX.Element}
 */
function AlertCard({ alert }) {
  const { recipient, maskedPhone, riskLevel, color, message, timestamp } = alert;

  return (
    <article className="sms-card" aria-label={`Alert for ${recipient}`}>
      {/* ── Card header ─────────────────────────────────────────── */}
      <header className="sms-card__header">
        <div className="sms-card__recipient">
          <span className="sms-card__icon" aria-hidden="true">👤</span>
          <div>
            <p className="sms-card__name">{recipient}</p>
            <p className="sms-card__phone">{maskedPhone}</p>
          </div>
        </div>

        {/* Risk badge — text label always accompanies colour (NFR-05) */}
        <span
          className="sms-card__badge"
          style={{ backgroundColor: color }}
          aria-label={`Risk level: ${riskLevel}`}
        >
          {riskLevel}
        </span>
      </header>

      {/* ── Message preview ─────────────────────────────────────── */}
      <div className="sms-card__message-wrap">
        <p className="sms-card__message">{message}</p>
      </div>

      {/* ── Timestamp ───────────────────────────────────────────── */}
      <footer className="sms-card__footer">
        <span className="sms-card__timestamp" aria-label={`Sent at ${timestamp}`}>
          🕐 {timestamp}
        </span>
      </footer>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Renders the SMS Alert Simulation panel.
 *
 * When `alerts` is empty the panel shows a "all areas safe" message instead of
 * alert cards.  Cards are expected to be pre-sorted newest-first by the caller
 * (e.g. via `getAlertsForRisk`).
 *
 * @param {Object}   props
 * @param {Array}    props.alerts    - Array of alert objects from `getAlertsForRisk`.
 * @param {string}   props.riskLevel - Current risk level label, used for the panel subtitle.
 * @returns {JSX.Element}
 */
export default function SmsPanel({ alerts = [], riskLevel = "Low" }) {
  const hasAlerts = alerts.length > 0;

  return (
    <section className="sms-panel" aria-label="SMS Alert Simulation Panel">
      {/* ── Panel header ──────────────────────────────────────────── */}
      <div className="sms-panel__header">
        <h2 className="sms-panel__title">📱 SMS Alert Simulation</h2>
        <p className="sms-panel__subtitle">
          {hasAlerts
            ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""} dispatched · Risk: ${riskLevel}`
            : `Current risk: ${riskLevel}`}
        </p>
      </div>

      {/* ── Alert list or empty state ─────────────────────────────── */}
      <div className="sms-panel__body">
        {hasAlerts ? (
          <ul className="sms-panel__list" aria-live="polite" aria-label="Active SMS alerts">
            {alerts.map((alert, idx) => (
              <li key={`${alert.recipient}-${alert.timestamp}-${idx}`}>
                <AlertCard alert={alert} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="sms-panel__empty" role="status" aria-live="polite">
            <span className="sms-panel__empty-icon" aria-hidden="true">✅</span>
            <p className="sms-panel__empty-text">No alerts — all areas safe</p>
          </div>
        )}
      </div>

      {/* ── Simulation disclaimer ─────────────────────────────────── */}
      <footer className="sms-panel__footer">
        <p className="sms-panel__disclaimer">
          ⚠️ Simulation only — real SMS via{" "}
          <a
            href="https://hubtel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sms-panel__link"
          >
            Hubtel
          </a>{" "}
          /{" "}
          <a
            href="https://africastalking.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sms-panel__link"
          >
            Africa's Talking
          </a>{" "}
          in production
        </p>
      </footer>
    </section>
  );
}
