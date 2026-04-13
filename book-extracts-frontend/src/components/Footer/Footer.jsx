import React from 'react';
import './Footer.scss';

/**
 * Footer — Page footer with developer attribution link.
 * Displays the developer's name linked to their public GitHub profile.
 * Link opens in a new tab with rel="noopener noreferrer" for security.
 */
function Footer() {
  return (
    <footer className="page-footer">
      <a
        href="https://github.com/nikhilwairagade"
        target="_blank"
        rel="noopener noreferrer"
      >
        Git - nikhilwairagade
      </a>
    </footer>
  );
}

export default Footer;
