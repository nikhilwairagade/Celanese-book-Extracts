import { useEffect, useState } from 'react';

/**
 * useDebounce — Custom hook to debounce a rapidly changing value.
 * Returns the debounced value after the specified delay (ms).
 * Useful for delaying API calls while the user is still typing.
 *
 * @param {*} value - The value to debounce (e.g., search input text).
 * @param {number} delay - Delay in milliseconds before updating (default: 350ms).
 * @returns {*} The debounced value, updated only after the delay expires.
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
