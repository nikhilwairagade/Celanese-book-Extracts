// Backend API endpoint — runs locally via Azure Functions Core Tools
const API_URL = 'http://localhost:7071/api/books';

/**
 * Book Service — API communication layer for the book extracts backend.
 *
 * Endpoint: POST http://localhost:7071/api/books
 *   Request body:  { query: string } — optional search text
 *   Response body: { success: boolean, message: string, data: Array }
 *
 * This service:
 *   1. Sends POST request with optional search query
 *   2. Parses the standardized response envelope
 *   3. Validates success flag and throws on failure
 *   4. Attaches _originalIndex to each book for default sort restoration
 *
 * Error handling:
 *   Throws an Error with the server's message on non-200 or success:false responses.
 *   The calling hook (useBooks) catches this and updates the UI error state.
 */
export async function fetchBooksFromApi(searchQuery = '') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: searchQuery }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Unable to load books.');
  }

  const list = Array.isArray(payload.data) ? payload.data : [];

  // Attach original index so default sort can restore source order
  return list.map((book, index) => ({ ...book, _originalIndex: index }));
}
