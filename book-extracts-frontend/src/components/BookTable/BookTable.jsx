import React from 'react';
import TableRow from '../TableRow/TableRow';
import './BookTable.scss';

/**
 * BookTable — Renders the book extracts data in a sortable HTML table.
 *
 * Props:
 *   @param {Array}    books     - Filtered and sorted book objects to display
 *   @param {Function} onSort    - Callback to cycle sort state for a column
 *   @param {Function} sortLabel - Returns sort direction indicator (↑ ↓ ↕) for a column
 *
 * Sortable columns: Author, Title, Reading time, Publication date
 *   Clicking a sort button cycles: ascending → descending → default
 *   Non-sortable columns: #, Cover, Biography
 *
 * Each row is rendered by the TableRow component with a unique key
 * combining isbn and index for stable React reconciliation.
 */
function BookTable({ books, onSort, sortLabel }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Cover</th>
            <th>
              <span className="th-sortable">
                Author
                <button type="button" className="sort-button" onClick={() => onSort('author')}>
                  {sortLabel('author')}
                </button>
              </span>
            </th>
            <th>Biography</th>
            <th>
              <span className="th-sortable">
                Title
                <button type="button" className="sort-button" onClick={() => onSort('title')}>
                  {sortLabel('title')}
                </button>
              </span>
            </th>
            <th>
              <span className="th-sortable">
                Reading time (minutes)
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => onSort('estimatedReadingTimeMinutes')}
                >
                  {sortLabel('estimatedReadingTimeMinutes')}
                </button>
              </span>
            </th>
            <th>
              <span className="th-sortable">
                Publication date
                <button
                  type="button"
                  className="sort-button"
                  onClick={() => onSort('publicationDate')}
                >
                  {sortLabel('publicationDate')}
                </button>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {books.map((book, index) => (
            <TableRow key={`${book.isbn}-${index}`} book={book} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
