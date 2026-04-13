import { SORT_ORDER } from '../constants/sortConstants';

/**
 * Sort Utilities — Sort state transition logic.
 *
 * nextSortState():
 *   Advances the sort cycle: DEFAULT → ASC → DESC → DEFAULT
 *   Used by the useSort hook when the user clicks a column header.
 *
 * @param {string} currentState - The current sort order from SORT_ORDER enum.
 * @returns {string} The next sort order in the cycle.
 */
export function nextSortState(currentState) {
  if (currentState === SORT_ORDER.DEFAULT) {
    return SORT_ORDER.ASC;
  }

  if (currentState === SORT_ORDER.ASC) {
    return SORT_ORDER.DESC;
  }

  return SORT_ORDER.DEFAULT;
}
