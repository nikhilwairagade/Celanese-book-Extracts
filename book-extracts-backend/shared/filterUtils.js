/**
 * Filter Utilities — Shared helpers for reading and searching book data.
 *
 * This module provides:
 *   - stripHtml():    Sanitize HTML tags from biography strings
 *   - readBooks():    Load and parse the local books.json dataset
 *   - searchBooks():  Filter books by search query with prefix/contains matching
 *
 * Search matching strategy:
 *   - Title & Author: prefix matching (startsWith) — user types the beginning
 *   - Biography: contains matching (includes) — user searches for any keyword
 */

const fs = require('fs');
const path = require('path');

/**
 * Strip HTML tags from a string, replacing them with spaces.
 * Biography fields may contain HTML markup from the CMS.
 * This strips tags so search matching works on plain text only.
 *
 * @param {string} value - Raw string potentially containing HTML.
 * @returns {string} Plain text string with tags removed.
 */
function stripHtml(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/<[^>]+>/g, ' ').trim();
}

/**
 * Read and parse the books.json data file.
 * Reads from the project root directory (one level up from shared/).
 * Returns the 'Extracts' array or empty array if structure is unexpected.
 *
 * @returns {Array} Array of book extract objects.
 */
function readBooks() {
  const dataPath = path.join(__dirname, '..', 'books.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.Extracts) ? parsed.Extracts : [];
}

/**
 * Filter books by search query.
 * Title and Author use prefix matching (startsWith) — user typically
 * types the beginning of a known title or name.
 * Biography uses contains matching (includes) — user searches for
 * any keyword mentioned anywhere in the biography text.
 *
 * @param {Array} books - Full books array from readBooks().
 * @param {string} query - Lowercased, trimmed search string.
 * @returns {Array} Filtered books array (all books if query is empty).
 */
function searchBooks(books, query) {
  if (!query) {
    return books;
  }

  return books.filter((book) => {
    const title = String(book.title || '').toLowerCase();
    const author = String(book.author || '').toLowerCase();
    const biography = stripHtml(String(book.authorBiography || '')).toLowerCase();

    return title.startsWith(query) || author.startsWith(query) || biography.includes(query);
  });
}

module.exports = { stripHtml, readBooks, searchBooks };
