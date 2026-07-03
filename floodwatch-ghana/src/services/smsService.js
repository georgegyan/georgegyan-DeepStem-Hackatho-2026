/**
 * @fileoverview SMS Alert Simulation Service for FloodWatch Ghana.
 *
 * Provides a hardcoded list of demo SMS users and utility functions for
 * generating and dispatching simulated flood alert messages.  This module
 * is fully client-side — no real SMS gateway is contacted.
 *
 * Production extension point: replace `getAlertsForRisk` with a real call
 * to the Hubtel or Africa's Talking SMS API (SRS §8, NFR-07).
 *
 * @module smsService
 */

// ---------------------------------------------------------------------------
// Demo User Registry (FR-09)
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SmsUser
 * @property {number} id     - Unique user identifier.
 * @property {string} name   - Full name of the registered user.
 * @property {string} phone  - Ghanaian mobile number (10 digits, starting with 0).
 * @property {string} area   - Geographic area / region the user is registered under.
 */

/**
 * Hardcoded list of demo SMS users that simulate a real registration database.
 * In production this would be fetched from a backend data store (SRS §8).
 *
 * @type {SmsUser[]}
 */
export const SMS_USERS = [
  { id: 1, name: "Kofi Mensah",    phone: "0244123890", area: "Accra"   },
  { id: 2, name: "Ama Owusu",      phone: "0551987432", area: "Kumasi"  },
  { id: 3, name: "Kwame Asante",   phone: "0203456781", area: "Takoradi"},
  { id: 4, name: "Abena Frimpong", phone: "0244765002", area: "Tamale"  },
  { id: 5, name: "Yaw Boateng",    phone: "0277391045", area: "Cape Coast"},
  { id: 6, name: "Efua Darko",     phone: "0504812367", area: "Accra"   },
  { id: 7, name: "Nana Adjei",     phone: "0243608419", area: "Kumasi"  },
];

// ---------------------------------------------------------------------------
// Risk-Level Colour Map (must stay in sync with riskEngine.js — SRS FR-06)
// ---------------------------------------------------------------------------

/**
 * Maps each risk-level label to its canonical hex colour.
 * Kept here so SmsPanel can apply correct colours without importing riskEngine.
 *
 * @readonly
 * @enum {string}
 */
export const RISK_COLORS = Object.freeze({
  Critical: "#DC2626",
  High:     "#EA580C",
  Medium:   "#CA8A04",
  Low:      "#16A34A",
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Masks the middle digits of a Ghanaian 10-digit phone number.
 *
 * The first three digits (network prefix) and the last three digits are kept
 * visible; digits 4–7 are replaced with `***`.
 *
 * Example: `"0244123890"` → `"024***890"`
 *
 * @param {string} phone - Raw 10-digit phone number string.
 * @returns {string} Masked phone number (e.g. `"024***890"`).
 */
function maskPhone(phone) {
  // Keep first 3 chars + *** + last 3 chars  (FR-10)
  return `${phone.slice(0, 3)}***${phone.slice(-3)}`;
}

// ---------------------------------------------------------------------------
// Exported Functions
// ---------------------------------------------------------------------------

/**
 * Generates a formatted SMS alert object for a single user.
 *
 * The returned object contains everything needed to render an alert card in
 * `SmsPanel`: masked contact info, the full message text, risk metadata, and a
 * human-readable timestamp.
 *
 * @param {SmsUser}    user          - The registered user to alert.
 * @param {Object}     riskData      - Current risk classification from `riskEngine.calculateRisk`.
 * @param {'Critical'|'High'|'Medium'|'Low'} riskData.level  - Risk level label.
 * @param {string}     riskData.color - Hex colour string for the risk level.
 * @param {number}     rainfall      - Current rainfall in mm/hr (included in the SMS body).
 * @returns {{
 *   recipient:   string,
 *   maskedPhone: string,
 *   area:        string,
 *   riskLevel:   string,
 *   color:       string,
 *   timestamp:   string,
 *   message:     string,
 * }} A fully-formed alert object ready for display.
 *
 * @example
 * const user     = SMS_USERS[0];
 * const riskData = { level: 'High', color: '#EA580C', shouldAlert: true };
 * const alert    = generateAlert(user, riskData, 18);
 * // alert.maskedPhone → "024***890"
 * // alert.message    → "FLOODWATCH ALERT [High]: Flood risk is High in Accra…"
 */
export function generateAlert(user, riskData, rainfall) {
  const { level, color } = riskData;
  const { name, phone, area } = user;

  const message =
    `FLOODWATCH ALERT [${level}]: Flood risk is ${level} in ${area}. ` +
    `Rainfall: ${rainfall}mm/hr. ` +
    `Please move to higher ground or avoid travel. Stay safe. — FloodWatch Ghana`;

  return {
    recipient:   name,
    maskedPhone: maskPhone(phone),
    area,
    riskLevel:   level,
    color,
    timestamp:   new Date().toLocaleTimeString(),
    message,
  };
}

/**
 * Filters the registered SMS users whose area matches the currently-affected
 * area and returns generated alert objects — but **only** when the risk level
 * is `High` or `Critical` (FR-10).
 *
 * For `Medium` and `Low` risk levels this function returns an empty array,
 * meaning no simulated SMS messages are dispatched.
 *
 * @param {Object}  riskData         - Current risk classification from `riskEngine.calculateRisk`.
 * @param {'Critical'|'High'|'Medium'|'Low'} riskData.level  - Risk level label.
 * @param {string}  riskData.color   - Hex colour for the risk level.
 * @param {boolean} riskData.shouldAlert - Pre-computed flag; must be `true` to dispatch.
 * @param {number}  rainfall         - Current rainfall in mm/hr, forwarded to `generateAlert`.
 * @param {string}  [affectedArea]   - Optional area name to filter users by.
 *                                     When omitted, alerts are generated for **all** users.
 * @returns {Array<ReturnType<generateAlert>>} Array of alert objects, newest-first.
 *
 * @example
 * const riskData = calculateRisk(32);   // → { level: 'Critical', shouldAlert: true }
 * const alerts   = getAlertsForRisk(riskData, 32, 'Accra');
 * // Returns alerts only for users registered in 'Accra'
 */
export function getAlertsForRisk(riskData, rainfall, affectedArea) {
  // Only dispatch for High or Critical — FR-10
  if (!riskData.shouldAlert) return [];

  const targets = affectedArea
    ? SMS_USERS.filter(
        (u) => u.area.toLowerCase() === affectedArea.toLowerCase()
      )
    : SMS_USERS;

  // Generate and return newest-first (reverse order matches render expectation)
  return targets
    .map((user) => generateAlert(user, riskData, rainfall))
    .reverse();
}
