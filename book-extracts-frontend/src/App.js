import HomePage from './pages/HomePage';
import './styles/global.scss';
import './App.scss';

/**
 * App — Root component of the Book Extracts application.
 *
 * Architecture:
 *   App renders HomePage which composes all UI sections.
 *   Logic is decomposed into custom hooks (useBooks, useSort),
 *   reusable components (Header, Footer, BookTable, SearchBar, Filters),
 *   and utility modules (sortUtils, filterUtils, dateUtils).
 *
 * Styles:
 *   Global SCSS (variables, mixins, base styles) imported here.
 *   Component-specific SCSS imported within each component file.
 */
function App() {
  return <HomePage />;
}

export default App;


