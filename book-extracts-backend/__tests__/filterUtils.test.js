/**
 * Unit tests for shared/filterUtils.js
 *
 * Tests cover:
 *   - stripHtml: HTML tag removal, edge cases, non-string input
 *   - readBooks: Dataset loading and structure validation
 *   - searchBooks: Prefix matching (title/author), contains matching (biography)
 */

const { stripHtml, readBooks, searchBooks } = require('../shared/filterUtils');

// ─── stripHtml Tests ─────────────────────────────────────────────────

describe('stripHtml', () => {
  test('removes simple HTML tags', () => {
    expect(stripHtml('<p>hello</p>')).toBe('hello');
  });

  test('removes nested HTML tags', () => {
    expect(stripHtml('<b><i>styled text</i></b>')).toBe('styled text');
  });

  test('replaces tags with spaces and trims', () => {
    expect(stripHtml('<p>first</p><p>second</p>')).toBe('first  second');
  });

  test('returns empty string for null input', () => {
    expect(stripHtml(null)).toBe('');
  });

  test('returns empty string for undefined input', () => {
    expect(stripHtml(undefined)).toBe('');
  });

  test('returns empty string for numeric input', () => {
    expect(stripHtml(123)).toBe('');
  });

  test('returns plain text unchanged', () => {
    expect(stripHtml('no tags here')).toBe('no tags here');
  });
});

// ─── readBooks Tests ─────────────────────────────────────────────────

describe('readBooks', () => {
  test('returns a non-empty array', () => {
    const books = readBooks();
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  test('each book has required fields', () => {
    const books = readBooks();
    const requiredFields = [
      'isbn',
      'title',
      'author',
      'jacketUrl',
      'publicationDate',
      'estimatedReadingTimeMinutes',
      'authorBiography',
    ];

    books.forEach((book) => {
      requiredFields.forEach((field) => {
        expect(book).toHaveProperty(field);
      });
    });
  });

  test('isbn values are unique', () => {
    const books = readBooks();
    const isbns = books.map((b) => b.isbn);
    const uniqueIsbns = new Set(isbns);
    expect(uniqueIsbns.size).toBe(isbns.length);
  });
});

// ─── searchBooks Tests ───────────────────────────────────────────────

describe('searchBooks', () => {
  let allBooks;

  beforeAll(() => {
    allBooks = readBooks();
  });

  test('empty query returns all books', () => {
    const result = searchBooks(allBooks, '');
    expect(result.length).toBe(allBooks.length);
  });

  test('null/undefined query returns all books', () => {
    expect(searchBooks(allBooks, null).length).toBe(allBooks.length);
    expect(searchBooks(allBooks, undefined).length).toBe(allBooks.length);
  });

  test('title prefix match works (case-insensitive)', () => {
    // Get first book's title and use its first 3 chars as query
    const firstTitle = allBooks[0].title.toLowerCase().substring(0, 3);
    const result = searchBooks(allBooks, firstTitle);

    expect(result.length).toBeGreaterThan(0);
    result.forEach((book) => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      const bio = stripHtml(String(book.authorBiography || '')).toLowerCase();
      const matches =
        title.startsWith(firstTitle) ||
        author.startsWith(firstTitle) ||
        bio.includes(firstTitle);
      expect(matches).toBe(true);
    });
  });

  test('author prefix match works (case-insensitive)', () => {
    const firstAuthor = allBooks[0].author.toLowerCase().substring(0, 4);
    const result = searchBooks(allBooks, firstAuthor);

    expect(result.length).toBeGreaterThan(0);
    result.forEach((book) => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      const bio = stripHtml(String(book.authorBiography || '')).toLowerCase();
      const matches =
        title.startsWith(firstAuthor) ||
        author.startsWith(firstAuthor) ||
        bio.includes(firstAuthor);
      expect(matches).toBe(true);
    });
  });

  test('biography contains match works', () => {
    // Find a word that appears inside (not at start of) a biography
    const sampleBio = stripHtml(String(allBooks[0].authorBiography || '')).toLowerCase();
    const words = sampleBio.split(/\s+/).filter((w) => w.length > 5);
    const searchWord = words.length > 2 ? words[2] : words[0]; // Pick a middle word

    const result = searchBooks(allBooks, searchWord);
    expect(result.length).toBeGreaterThan(0);
  });

  test('non-matching query returns empty array', () => {
    const result = searchBooks(allBooks, 'zzzzxxyynomatch');
    expect(result).toEqual([]);
  });

  test('search is case-insensitive (query must be pre-lowercased)', () => {
    // searchBooks expects a pre-lowercased query (handler normalizes before calling)
    const title = allBooks[0].title.toLowerCase().substring(0, 3);
    const result = searchBooks(allBooks, title);
    expect(result.length).toBeGreaterThan(0);

    // Verify field matching is case-insensitive on the data side
    result.forEach((book) => {
      const titleMatch = book.title.toLowerCase().startsWith(title);
      const authorMatch = book.author.toLowerCase().startsWith(title);
      const bioMatch = (book.authorBiography || '').toLowerCase().includes(title);
      expect(titleMatch || authorMatch || bioMatch).toBe(true);
    });
  });
});
