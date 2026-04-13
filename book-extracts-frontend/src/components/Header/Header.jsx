import React from 'react';
import './Header.scss';

/**
 * Header — Page header displaying the application title.
 * Renders the "Book Extracts from Pan Macmillan" heading.
 * Styled via Header.scss with gradient background and centered text.
 */
function Header() {
  return (
    <header className="page-header">
      <h1>Book Extracts from Pan Macmillan</h1>
    </header>
  );
}

export default Header;
