import { render, screen } from '@testing-library/react';
import Error from '../../components/Error';

describe('<Error />', () => {
  test('renders an error message', () => {
    render(<Error />);
    expect(screen.getByText('Sorry, no results found!')).toBeTruthy();
  });
});
