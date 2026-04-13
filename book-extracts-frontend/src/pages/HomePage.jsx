import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
import AuthorFilter from '../components/Filters/AuthorFilter';
import ReadingTimeFilter from '../components/Filters/ReadingTimeFilter';
import BookTable from '../components/BookTable/BookTable';
import { useSort } from '../hooks/useSort';
import { useBooks } from '../hooks/useBooks';

/**
 * HomePage — Main page container that assembles the full application layout.
 *
 * Structure:
 *   - Header:    Application title
 *   - Toolbar:   SearchBar + Filters (author, reading time, publication date)
 *   - Content:   BookTable or loading/error/empty state messages
 *   - Footer:    Developer attribution with external link
 *
 * Data flow:
 *   useBooks hook manages API calls, filtering, and sorting logic.
 *   useSort hook manages sort state (column key + direction).
 *   Both hooks are wired together here — sort resets on new search.
 *
 * Filter behavior:
 *   All filters use AND logic — a book must pass every active filter.
 *   Filters are applied on the frontend after backend search results arrive.
 */
function HomePage() {
  const { sortConfig, onSort, sortLabel, resetSort } = useSort();
  const {
    displayedBooks,
    uniqueAuthors,
    filters,
    status,
    fetchBooks,
    onFilterChange,
    onResetFilters,
  } = useBooks(sortConfig, resetSort);

  return (
    <div className="page-shell">
      <Header />

      <main className="page-content">
        {/* Search and filters toolbar */}
        <section className="toolbar" aria-label="Search and filter controls">
          <SearchBar onSearch={fetchBooks} />

          <div className="filter-grid">
            <AuthorFilter
              authors={uniqueAuthors}
              value={filters.author}
              onChange={onFilterChange}
            />

            <ReadingTimeFilter
              minValue={filters.minReadingTime}
              maxValue={filters.maxReadingTime}
              onChange={onFilterChange}
            />

            <label>
              Publication date (exact)
              <input
                type="date"
                name="publicationDateExact"
                value={filters.publicationDateExact}
                onChange={onFilterChange}
              />
            </label>

            <label>
              Publication date from
              <input
                type="date"
                name="publicationDateFrom"
                value={filters.publicationDateFrom}
                onChange={onFilterChange}
              />
            </label>

            <label>
              Publication date to
              <input
                type="date"
                name="publicationDateTo"
                value={filters.publicationDateTo}
                onChange={onFilterChange}
              />
            </label>
          </div>

          <button className="reset-button" type="button" onClick={onResetFilters}>
            Reset filters
          </button>
        </section>

        {/* State messages */}
        {status.loading && <p className="state-message">Loading books...</p>}
        {!status.loading && status.error && (
          <p className="state-message error">{status.error}</p>
        )}

        {/* Book table or empty state */}
        {!status.loading && !status.error && (
          displayedBooks.length === 0 ? (
            <p className="state-message">No books found for the selected criteria.</p>
          ) : (
            <BookTable books={displayedBooks} onSort={onSort} sortLabel={sortLabel} />
          )
        )}
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
