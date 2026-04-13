/**
 * Unit tests for shared/responseHandler.js
 *
 * Tests cover:
 *   - successResponse: status, body envelope, CORS headers
 *   - errorResponse: default/custom status, error envelope, CORS headers
 *   - corsPreflightResponse: status, CORS headers, no body
 */

const {
  successResponse,
  errorResponse,
  corsPreflightResponse,
  corsHeaders,
} = require('../shared/responseHandler');

// ─── successResponse Tests ───────────────────────────────────────────

describe('successResponse', () => {
  const data = [{ isbn: '123', title: 'Test Book' }];
  const message = 'Books fetched successfully.';
  let response;

  beforeAll(() => {
    response = successResponse(data, message);
  });

  test('returns status 200', () => {
    expect(response.status).toBe(200);
  });

  test('body contains success: true', () => {
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
  });

  test('body contains correct message', () => {
    const body = JSON.parse(response.body);
    expect(body.message).toBe(message);
  });

  test('body contains data array', () => {
    const body = JSON.parse(response.body);
    expect(body.data).toEqual(data);
  });

  test('includes CORS headers', () => {
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
  });

  test('includes Content-Type header', () => {
    expect(response.headers['Content-Type']).toBe('application/json');
  });
});

// ─── errorResponse Tests ─────────────────────────────────────────────

describe('errorResponse', () => {
  test('default status is 500', () => {
    const response = errorResponse('Server error', 'INTERNAL_ERROR');
    expect(response.status).toBe(500);
  });

  test('custom status works', () => {
    const response = errorResponse('Bad request', 'BAD_REQUEST', 400);
    expect(response.status).toBe(400);
  });

  test('body contains success: false', () => {
    const response = errorResponse('Error msg', 'ERR_CODE');
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
  });

  test('body contains correct message and errorCode', () => {
    const response = errorResponse('Not found', 'NOT_FOUND', 404);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('Not found');
    expect(body.errorCode).toBe('NOT_FOUND');
  });

  test('includes CORS headers', () => {
    const response = errorResponse('Error', 'ERR');
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
  });

  test('includes Content-Type header', () => {
    const response = errorResponse('Error', 'ERR');
    expect(response.headers['Content-Type']).toBe('application/json');
  });
});

// ─── corsPreflightResponse Tests ─────────────────────────────────────

describe('corsPreflightResponse', () => {
  let response;

  beforeAll(() => {
    response = corsPreflightResponse();
  });

  test('returns status 200', () => {
    expect(response.status).toBe(200);
  });

  test('includes CORS headers', () => {
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(response.headers['Access-Control-Allow-Headers']).toBe('Content-Type');
  });

  test('has no body', () => {
    expect(response.body).toBeUndefined();
  });
});
