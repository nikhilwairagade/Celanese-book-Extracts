import React, { useState } from 'react';

/**
 * SearchBar — Search form for querying books.
 * Contains a text input and submit button.
 * Calls onSearch(query) when the form is submitted.
 * The query is sent to the backend for prefix matching on title/author
 * and contains matching on biography.
 */
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="searchQuery">Search books</label>
      <div className="search-row">
        <input
          id="searchQuery"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Title, author, or biography"
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}

export default SearchBar;
