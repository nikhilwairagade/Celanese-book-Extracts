/**
 * GetBooks Azure Function — Entry point for POST /api/books
 *
 * Purpose:
 *   Accepts an optional search query in the request body and returns
 *   matching book extracts from the local books.json dataset.
 *
 * Supported methods:
 *   - OPTIONS: Returns CORS preflight headers for cross-origin requests
 *   - POST:    Accepts { query: string } and returns filtered/all books
 *   - Others:  Returns 405 Method Not Allowed
 *
 * Response format:
 *   Success: { success: true, message: string, data: Array }
 *   Error:   { success: false, message: string, errorCode: string }
 */

// Import shared utilities for reading/searching books and building responses
const { readBooks, searchBooks } = require('../shared/filterUtils');
const { successResponse, errorResponse, corsPreflightResponse } = require('../shared/responseHandler');

module.exports = async function (context, req) {
  // Handle CORS preflight — browsers send OPTIONS before cross-origin POST requests
  if (req.method === 'OPTIONS') {
    context.res = corsPreflightResponse();
    return;
  }

  // Reject any HTTP method other than POST (GET, PUT, PATCH, DELETE)
  if (req.method !== 'POST') {
    context.res = errorResponse('Method not allowed. Use POST.', 'METHOD_NOT_ALLOWED', 405);
    return;
  }

  try {
    // Parse the request body, defaulting to empty object if missing
    const body = req.body || {};

    // Validate that 'query' field, if provided, is a string type
    if (body.query !== undefined && typeof body.query !== 'string') {
      context.res = errorResponse('Query must be a string.', 'INVALID_QUERY_TYPE', 400);
      return;
    }

    // Normalize the search query — trim whitespace and convert to lowercase
    const query = typeof body.query === 'string' ? body.query.trim().toLowerCase() : '';

    // Read all books from the local JSON file
    const books = readBooks();

    // Apply search filter — returns all books if query is empty
    const filtered = searchBooks(books, query);

    // Return filtered results with appropriate success message
    context.res = successResponse(
      filtered,
      query ? 'Filtered books fetched successfully.' : 'All books fetched successfully.'
    );
  } catch (error) {
    // Catch any unexpected errors (file read failure, JSON parse error, etc.)
    context.log.error('GetBooks error:', error.message);
    context.res = errorResponse('Failed to fetch books.', 'BOOKS_FETCH_FAILED');
  }
};
