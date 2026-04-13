/**
 * Response Handler — Standardized response builders for Azure Functions.
 *
 * All responses include CORS headers to allow the frontend (localhost:3000)
 * to communicate with the backend (localhost:7071) across origins.
 *
 * Response envelope structure:
 *   Success: { success: true,  message: string, data: Array }
 *   Error:   { success: false, message: string, errorCode: string }
 */

// CORS headers attached to every response.
// Using wildcard origin (*) since this runs locally only — not suitable for production.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Build a success response with CORS headers.
 * @param {Array} data - Books array to return.
 * @param {string} message - Human-readable message.
 * @returns {object} Azure Function response object.
 */
function successResponse(data, message) {
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify({ success: true, message, data }),
  };
}

/**
 * Build an error response with CORS headers.
 * @param {string} message - Human-readable error description.
 * @param {string} errorCode - Machine-readable error code.
 * @param {number} status - HTTP status code (default 500).
 * @returns {object} Azure Function response object.
 */
function errorResponse(message, errorCode, status = 500) {
  return {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify({ success: false, message, errorCode }),
  };
}

/**
 * Build a CORS preflight response.
 * @returns {object} Azure Function response object.
 */
function corsPreflightResponse() {
  return { status: 200, headers: corsHeaders };
}

module.exports = { successResponse, errorResponse, corsPreflightResponse, corsHeaders };
