import { useState, useCallback } from 'react';
import { SORT_ORDER } from '../constants/sortConstants';
import { nextSortState } from '../utils/sortUtils';

/**
 * useSort — Custom hook encapsulating column sort state and transitions.
 *
 * Sort cycle per column: DEFAULT → ASC → DESC → DEFAULT
 *   - Clicking a new column starts at ASC
 *   - Clicking the same column advances the cycle
 *   - DEFAULT means no active sort (original dataset order)
 *
 * Returns:
 *   @returns {Object}   sortConfig - Current { key, order } state
 *   @returns {Function} onSort     - Cycle sort for a given column key
 *   @returns {Function} sortLabel  - Get visual indicator (↕ ↑ ↓) for a column
 *   @returns {Function} resetSort  - Reset to default order (used after new search)
 */
export function useSort() {
  const [sortConfig, setSortConfig] = useState({
    key: '',
    order: SORT_ORDER.DEFAULT,
  });

  /** Cycle sort state for the given column key. */
  const onSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, order: SORT_ORDER.ASC };
      }

      return { key, order: nextSortState(prev.order) };
    });
  }, []);

  /** Return a visual indicator for a column's current sort direction. */
  const sortLabel = useCallback(
    (key) => {
      if (sortConfig.key !== key || sortConfig.order === SORT_ORDER.DEFAULT) {
        return '↕';
      }

      return sortConfig.order === SORT_ORDER.ASC ? '↑' : '↓';
    },
    [sortConfig]
  );

  /** Reset sort to default (original dataset order). */
  const resetSort = useCallback(() => {
    setSortConfig({ key: '', order: SORT_ORDER.DEFAULT });
  }, []);

  return { sortConfig, onSort, sortLabel, resetSort };
}
