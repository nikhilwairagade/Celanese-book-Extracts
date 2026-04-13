import moment from 'moment';

/**
 * Date Utilities — Moment-based date formatting for display.
 *
 * formatDate():
 *   Converts a date string (ISO or other parseable format) to MM/DD/YY.
 *   Returns '-' for invalid or missing dates.
 *   Uses Moment.js as required by project specification.
 *
 * @param {string} dateString - Raw date string from the dataset.
 * @returns {string} Formatted date as MM/DD/YY or '-' if invalid.
 */
export function formatDate(dateString) {
  const parsed = moment(dateString);

  return parsed.isValid() ? parsed.format('MM/DD/YY') : '-';
}
