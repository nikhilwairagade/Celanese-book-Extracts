# Book Extracts Backend (Azure Functions)

Local Azure Functions API that serves book extract data from `books.json`.

## Overview

This backend provides one endpoint for fetching all books or filtered books.

- Runtime: Azure Functions Core Tools (local)
- Data source: local `books.json`
- Cloud deployment: not required
- Azure account: not required

## Endpoint

- URL: `http://localhost:7071/api/books`
- Functional method: `POST`
- Also handles: `OPTIONS` (CORS preflight)
- Invalid methods (`GET`, `PUT`, `PATCH`, `DELETE`) return `405`

## Request Format

```json
{
  "query": "optional search text"
}
```

Validation:

- `query` is optional
- if present, `query` must be a string
- invalid type returns `400` with error code `INVALID_QUERY_TYPE`

## Search Behavior

- Empty or missing `query`: returns all books
- Non-empty `query`:
  - Title: case-insensitive prefix match
  - Author: case-insensitive prefix match
  - Biography: case-insensitive contains match

## Response Envelope

Success:

```json
{
  "success": true,
  "message": "All books fetched successfully.",
  "data": []
}
```

Error:

```json
{
  "success": false,
  "message": "Method not allowed. Use POST.",
  "errorCode": "METHOD_NOT_ALLOWED"
}
```

## Project Structure

```text
book-extracts-backend/
|- books.json
|- GetBooks/
|  |- index.js
|  |- function.json
|- shared/
|  |- filterUtils.js
|  |- responseHandler.js
|- __tests__/
|  |- filterUtils.test.js
|  |- responseHandler.test.js
|  |- getBooks.test.js
|- host.json
|- local.settings.json
|- package.json
```

## Prerequisites

- Node.js (LTS recommended)
- npm

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start backend:

```bash
npm start
```

3. API base URL:

`http://localhost:7071/api`

## Run Tests

```bash
npm test
```

Current backend test suite validates:

- Utility functions (`stripHtml`, dataset read, search logic)
- Standard response builders
- Function handler behavior (success, validation, invalid method handling)

## Troubleshooting

- Port `7071` already in use:
  - stop process using that port, then restart backend
- Frontend cannot reach backend:
  - confirm backend is running at `http://localhost:7071`
- Empty search results:
  - check matching rules (prefix for title/author, contains for biography)
