import moment from 'moment';

/**
 * Filter Utilities — Frontend-side book filtering with AND logic.
 *
 * All active filters must pass for a book to be included (AND combination).
 * Filters are applied after backend search results are received.
 *
 * Supported filters:
 *   - Author:           Case-insensitive exact match against selected dropdown value
 *   - Reading time:     Numeric range (min/max) against estimatedReadingTimeMinutes
 *   - Publication date: Either exact date match OR date range (from/to) using Moment
 */

/**
 * normalizeValue — Helper for case-insensitive string comparison.
 * Trims whitespace and lowercases the input value.
 *
 * @param {string} value - Raw string to normalize.
 * @returns {string} Lowercased, trimmed string (empty string for non-string input).
 */
export function normalizeValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
}

/**
 * Apply all active filters to a list of books using AND logic.
 * Returns a new filtered array without mutating the source.
 */
export function applyFilters(books, filters) {
  return books.filter((book) => {
    // Author exact match (case-insensitive)
    if (filters.author) {
      if (normalizeValue(book.author) !== normalizeValue(filters.author)) {
        return false;
      }
    }

    // Reading time range
    const readingTime = Number(book.estimatedReadingTimeMinutes);
    const min = filters.minReadingTime === '' ? null : Number(filters.minReadingTime);
    const max = filters.maxReadingTime === '' ? null : Number(filters.maxReadingTime);

    if (min !== null && Number.isFinite(readingTime) && readingTime < min) {
      return false;
    }

    if (max !== null && Number.isFinite(readingTime) && readingTime > max) {
      return false;
    }

    // Publication date: exact or range
    const publicationMoment = moment(book.publicationDate);

    if (filters.publicationDateExact) {
      const exact = moment(filters.publicationDateExact);

      if (!publicationMoment.isValid() || !publicationMoment.isSame(exact, 'day')) {
        return false;
      }
    } else {
      if (filters.publicationDateFrom) {
        const from = moment(filters.publicationDateFrom);

        if (!publicationMoment.isValid() || publicationMoment.isBefore(from, 'day')) {
          return false;
        }
      }

      if (filters.publicationDateTo) {
        const to = moment(filters.publicationDateTo);

        if (!publicationMoment.isValid() || publicationMoment.isAfter(to, 'day')) {
          return false;
        }
      }
    }

    return true;
  });
}
