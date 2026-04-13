import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';

/* Max characters shown before biography text is truncated */
const BIO_LIMIT = 150;

/**
 * TableRow — Renders a single book row in the BookTable.
 *
 * Features:
 *   - Sequence number:  Reflects current visible position (index + 1)
 *   - Cover image:      Linked to extract page; shows "No cover" fallback on load error
 *   - Author:           Plain text display
 *   - Biography:        HTML-stripped text with "See more/less" toggle (150 char limit)
 *   - Title:            Linked to extract page via ISBN-based URL
 *   - Reading time:     Numeric display in minutes
 *   - Publication date: Formatted as MM/DD/YY using Moment via dateUtils
 *
 * Extract link format:
 *   https://extracts.panmacmillan.com/extract?isbn={isbn}
 *
 * Security:
 *   - External links use rel="noopener noreferrer" to prevent opener attacks
 *   - Biography HTML tags are stripped before rendering (not injected as innerHTML)
 */
function TableRow({ book, index }) {
  const link = `https://extracts.panmacmillan.com/extract?isbn=${book.isbn}`;
  const [bioExpanded, setBioExpanded] = useState(false);

  const rawBio = book.authorBiography
    ? book.authorBiography.replace(/<[^>]+>/g, ' ').trim()
    : '';
  const needsTruncation = rawBio.length > BIO_LIMIT;
  const displayBio = !bioExpanded && needsTruncation
    ? rawBio.slice(0, BIO_LIMIT) + '…'
    : rawBio;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <a href={link} target="_blank" rel="noopener noreferrer" className="cover-link">
          {book.jacketUrl ? (
            <img
              src={book.jacketUrl}
              alt={`${book.title} cover`}
              onError={(event) => {
                event.target.style.display = 'none';
                event.target.nextSibling.style.display = 'inline-block';
              }}
            />
          ) : null}
          <span
            className="cover-fallback"
            style={{ display: book.jacketUrl ? 'none' : 'inline-block' }}
          >
            No cover
          </span>
        </a>
      </td>
      <td>{book.author || '-'}</td>
      <td className="bio-cell">
        {rawBio ? (
          <>
            <span>{displayBio}</span>
            {needsTruncation && (
              <button
                className="see-more-btn"
                onClick={() => setBioExpanded(!bioExpanded)}
              >
                {bioExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </>
        ) : '-'}
      </td>
      <td className="title-cell">
        <a href={link} target="_blank" rel="noopener noreferrer" className="title-link">
          {book.title}
        </a>
      </td>
      <td>{book.estimatedReadingTimeMinutes ?? '-'}</td>
      <td>{formatDate(book.publicationDate)}</td>
    </tr>
  );
}

export default TableRow;
