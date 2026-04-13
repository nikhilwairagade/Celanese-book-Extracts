import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main page title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Book Extracts from Pan Macmillan/i);
  expect(titleElement).toBeInTheDocument();
});
