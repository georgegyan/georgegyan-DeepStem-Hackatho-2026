/**
 * @fileoverview Flood risk classification engine for FloodWatch Ghana.
 * A pure, side-effect-free module — safe to import and test in isolation.
 */

/**
 * @typedef {Object} RiskResult
 * @property {'Critical'|'High'|'Medium'|'Low'} level - Human-readable risk level.
 * @property {'#DC2626'|'#EA580C'|'#CA8A04'|'#16A34A'} color  - Hex colour for UI indicators.
 * @property {boolean} shouldAlert - `true` when the risk warrants an active alert (High or Critical).
 */

/**
 * Risk thresholds (mm/hr) as defined in the FloodWatch Ghana SRS.
 * @readonly
 * @enum {number}
 */
const THRESHOLDS = Object.freeze({
  CRITICAL: 30,
  HIGH: 15,
  MEDIUM: 5,
});

/**
 * Classifies flood risk based on current rainfall intensity.
 *
 * The classification follows the four-tier scheme defined in the SRS:
 *  - **Critical** (≥ 30 mm/hr) — immediate danger, alert required.
 *  - **High**     (15–29 mm/hr) — significant risk, alert required.
 *  - **Medium**   (5–14 mm/hr)  — elevated risk, monitor closely.
 *  - **Low**      (< 5 mm/hr)   — normal conditions.
 *
 * @pure
 * @param {number} rainfall - Current rainfall in millimetres per hour (mm/hr).
 * @returns {RiskResult} An object describing the risk level, display colour, and alert status.
 *
 * @example
 * calculateRisk(35);  // → { level: 'Critical', color: '#DC2626', shouldAlert: true }
 * calculateRisk(20);  // → { level: 'High',     color: '#EA580C', shouldAlert: true }
 * calculateRisk(10);  // → { level: 'Medium',   color: '#CA8A04', shouldAlert: false }
 * calculateRisk(2);   // → { level: 'Low',      color: '#16A34A', shouldAlert: false }
 */
export function calculateRisk(rainfall) {
  if (rainfall >= THRESHOLDS.CRITICAL) {
    return { level: "Critical", color: "#DC2626", shouldAlert: true };
  }

  if (rainfall >= THRESHOLDS.HIGH) {
    return { level: "High", color: "#EA580C", shouldAlert: true };
  }

  if (rainfall >= THRESHOLDS.MEDIUM) {
    return { level: "Medium", color: "#CA8A04", shouldAlert: false };
  }

  return { level: "Low", color: "#16A34A", shouldAlert: false };
}
