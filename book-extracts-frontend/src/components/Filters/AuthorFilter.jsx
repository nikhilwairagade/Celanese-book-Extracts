import React from 'react';

/**
 * AuthorFilter — Single-select dropdown populated with unique author values.
 * Selecting an author applies a case-insensitive exact match filter.
 * "All authors" option clears the filter (value = empty string).
 *
 * Props:
 *   @param {Array}    authors  - Unique sorted author names derived from current dataset
 *   @param {string}   value    - Currently selected author (empty = no filter)
 *   @param {Function} onChange - Callback to update filter state in parent hook
 */
function AuthorFilter({ authors, value, onChange }) {
  return (
    <label>
      Author
      <select name="author" value={value} onChange={onChange}>
        <option value="">All authors</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </label>
  );
}

export default AuthorFilter;
