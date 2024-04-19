import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

describe('<Navbar />', () => {
  test('renders a nav item and header', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByText('Grow Therapy SDET Take Home')).toBeTruthy();
  });
});
