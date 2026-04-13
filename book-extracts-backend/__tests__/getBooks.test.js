/**
 * Integration tests for GetBooks/index.js Azure Function handler.
 *
 * Tests cover:
 *   - OPTIONS request: CORS preflight response
 *   - POST request: all books, filtered books, empty results, validation
 *   - Invalid methods: GET, PUT, DELETE → 405
 *   - Invalid query type: non-string query → 400
 *
 * These tests invoke the handler directly with mock context and request objects,
 * simulating the Azure Functions runtime without needing func start.
 */

const handler = require('../GetBooks/index');

/**
 * Helper: Create a mock Azure Functions context object.
 * The handler sets context.res — we read it after invocation.
 */
function createContext() {
  return {
    res: null,
    log: {
      error: jest.fn(), // Suppress error logging during tests
      info: jest.fn(),
      warn: jest.fn(),
    },
  };
}

/**
 * Helper: Create a mock HTTP request object.
 * @param {string} method - HTTP method (GET, POST, OPTIONS, etc.)
 * @param {object} body - Request body (for POST requests)
 */
function createRequest(method, body = null) {
  return { method, body };
}

// ─── OPTIONS (CORS Preflight) ────────────────────────────────────────

describe('OPTIONS /api/books', () => {
  test('returns 200 with CORS headers', async () => {
    const context = createContext();
    const req = createRequest('OPTIONS');

    await handler(context, req);

    expect(context.res.status).toBe(200);
    expect(context.res.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(context.res.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
  });
});

// ─── Invalid Methods (405) ───────────────────────────────────────────

describe('Invalid HTTP methods', () => {
  const invalidMethods = ['GET', 'PUT', 'PATCH', 'DELETE'];

  invalidMethods.forEach((method) => {
    test(`${method} returns 405 Method Not Allowed`, async () => {
      const context = createContext();
      const req = createRequest(method);

      await handler(context, req);

      expect(context.res.status).toBe(405);
      const body = JSON.parse(context.res.body);
      expect(body.success).toBe(false);
      expect(body.errorCode).toBe('METHOD_NOT_ALLOWED');
    });
  });
});

// ─── POST (Valid Requests) ───────────────────────────────────────────

describe('POST /api/books', () => {
  test('empty body returns all books', async () => {
    const context = createContext();
    const req = createRequest('POST', {});

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('All books fetched successfully.');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('null body returns all books', async () => {
    const context = createContext();
    const req = createRequest('POST', null);

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('empty query string returns all books', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: '' });

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('All books fetched successfully.');
  });

  test('query with matching title returns filtered results', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: 'war' });

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Filtered books fetched successfully.');
    expect(body.data.length).toBeGreaterThan(0);

    // Verify every result actually matches the query
    body.data.forEach((book) => {
      const titleMatch = book.title.toLowerCase().startsWith('war');
      const authorMatch = book.author.toLowerCase().startsWith('war');
      const bioMatch = (book.authorBiography || '').toLowerCase().includes('war');
      expect(titleMatch || authorMatch || bioMatch).toBe(true);
    });
  });

  test('non-matching query returns empty data array', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: 'zzzznowaythismatches' });

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  test('query is case-insensitive', async () => {
    const context = createContext();

    // Fetch with uppercase
    const reqUpper = createRequest('POST', { query: 'WAR' });
    await handler(context, reqUpper);
    const upperResult = JSON.parse(context.res.body);

    // Fetch with lowercase
    const reqLower = createRequest('POST', { query: 'war' });
    await handler(context, reqLower);
    const lowerResult = JSON.parse(context.res.body);

    expect(upperResult.data.length).toBe(lowerResult.data.length);
  });

  test('query with whitespace is trimmed', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: '  war  ' });

    await handler(context, req);

    expect(context.res.status).toBe(200);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });
});

// ─── POST (Validation Errors) ────────────────────────────────────────

describe('POST /api/books — validation', () => {
  test('numeric query returns 400 INVALID_QUERY_TYPE', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: 123 });

    await handler(context, req);

    expect(context.res.status).toBe(400);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe('INVALID_QUERY_TYPE');
    expect(body.message).toBe('Query must be a string.');
  });

  test('boolean query returns 400 INVALID_QUERY_TYPE', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: true });

    await handler(context, req);

    expect(context.res.status).toBe(400);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe('INVALID_QUERY_TYPE');
  });

  test('array query returns 400 INVALID_QUERY_TYPE', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: ['war', 'gate'] });

    await handler(context, req);

    expect(context.res.status).toBe(400);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe('INVALID_QUERY_TYPE');
  });

  test('object query returns 400 INVALID_QUERY_TYPE', async () => {
    const context = createContext();
    const req = createRequest('POST', { query: { text: 'war' } });

    await handler(context, req);

    expect(context.res.status).toBe(400);
    const body = JSON.parse(context.res.body);
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe('INVALID_QUERY_TYPE');
  });
});

// ─── Response Structure ──────────────────────────────────────────────

describe('Response structure', () => {
  test('success response includes all required envelope fields', async () => {
    const context = createContext();
    const req = createRequest('POST', {});

    await handler(context, req);

    const body = JSON.parse(context.res.body);
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('data');
    expect(typeof body.success).toBe('boolean');
    expect(typeof body.message).toBe('string');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('error response includes all required envelope fields', async () => {
    const context = createContext();
    const req = createRequest('GET');

    await handler(context, req);

    const body = JSON.parse(context.res.body);
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('errorCode');
    expect(body.success).toBe(false);
    expect(typeof body.message).toBe('string');
    expect(typeof body.errorCode).toBe('string');
  });

  test('all responses include CORS headers', async () => {
    const context = createContext();

    // Test POST response
    await handler(context, createRequest('POST', {}));
    expect(context.res.headers['Access-Control-Allow-Origin']).toBe('*');

    // Test error response
    await handler(context, createRequest('GET'));
    expect(context.res.headers['Access-Control-Allow-Origin']).toBe('*');

    // Test preflight response
    await handler(context, createRequest('OPTIONS'));
    expect(context.res.headers['Access-Control-Allow-Origin']).toBe('*');
  });
});
