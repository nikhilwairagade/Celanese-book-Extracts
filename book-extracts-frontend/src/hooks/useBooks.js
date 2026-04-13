import { useEffect, useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import { fetchBooksFromApi } from '../services/bookService';
import { applyFilters } from '../utils/filterUtils';
import { SORT_ORDER } from '../constants/sortConstants';

/**
 * useBooks — Custom hook managing book data lifecycle.
 *
 * Responsibilities:
 *   - Fetches books from the backend API via bookService
 *   - Manages filter state (author, reading time range, publication date)
 *   - Computes displayedBooks by applying filters + sorting to raw data
 *   - Derives unique author list for the dropdown filter
 *   - Tracks loading/error status for UI state rendering
 *
 * Data flow:
 *   1. On mount:    Fetches all books (empty query)
 *   2. On search:   Fetches filtered books from backend, resets sort
 *   3. On filter:   Applies frontend-only filters to current dataset
 *   4. On sort:     Re-sorts displayedBooks using sortConfig from useSort
 *
 * Sort behavior:
 *   - Default order restores original dataset sequence (_originalIndex)
 *   - Date sorting uses Moment valueOf() for accurate chronological order
 *   - Reading time sorting uses numeric comparison
 *   - Title/Author sorting uses locale-aware string comparison
 */
export function useBooks(sortConfig, resetSort) {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    author: '',
    minReadingTime: '',
    maxReadingTime: '',
    publicationDateFrom: '',
    publicationDateTo: '',
    publicationDateExact: '',
  });
  const [status, setStatus] = useState({ loading: true, error: '' });

  /** Fetch books from the API, optionally with a search query. */
  const fetchBooks = useCallback(
    async (searchQuery = '') => {
      try {
        setStatus({ loading: true, error: '' });
        const normalized = await fetchBooksFromApi(searchQuery);
        setBooks(normalized);
        resetSort();
        setStatus({ loading: false, error: '' });
      } catch (error) {
        setBooks([]);
        setStatus({ loading: false, error: error.message || 'Request failed.' });
      }
    },
    [resetSort]
  );

  // Initial data load
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  /** Unique sorted author list derived from current dataset. */
  const uniqueAuthors = useMemo(() => {
    const authors = books
      .map((book) => book.author)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return [...new Set(authors)];
  }, [books]);

  /** Books after filtering and sorting, ready for display. */
  const displayedBooks = useMemo(() => {
    const filtered = applyFilters(books, filters);

    // Default sort: restore original dataset order
    if (sortConfig.order === SORT_ORDER.DEFAULT || !sortConfig.key) {
      return [...filtered].sort((a, b) => a._originalIndex - b._originalIndex);
    }

    const direction = sortConfig.order === SORT_ORDER.ASC ? 1 : -1;

    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'publicationDate') {
        aValue = moment(aValue).valueOf();
        bValue = moment(bValue).valueOf();
      }

      if (sortConfig.key === 'estimatedReadingTimeMinutes') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      if (aValue > bValue) return 1 * direction;
      if (aValue < bValue) return -1 * direction;
      return 0;
    });
  }, [books, filters, sortConfig]);

  /** Handle filter input changes. */
  const onFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  /** Reset all filters to defaults. */
  const onResetFilters = useCallback(() => {
    setFilters({
      author: '',
      minReadingTime: '',
      maxReadingTime: '',
      publicationDateFrom: '',
      publicationDateTo: '',
      publicationDateExact: '',
    });
  }, []);

  return {
    books,
    displayedBooks,
    uniqueAuthors,
    filters,
    status,
    fetchBooks,
    onFilterChange,
    onResetFilters,
  };
}
