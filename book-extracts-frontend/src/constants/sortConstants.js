/**
 * Sort Constants — Enumeration of sort direction states.
 *
 * SORT_ORDER:
 *   ASC     — Ascending order (A→Z, lowest→highest, oldest→newest)
 *   DESC    — Descending order (Z→A, highest→lowest, newest→oldest)
 *   DEFAULT — No active sort; original dataset order is preserved
 *
 * The sort cycle follows: DEFAULT → ASC → DESC → DEFAULT
 */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
  DEFAULT: 'default',
};
