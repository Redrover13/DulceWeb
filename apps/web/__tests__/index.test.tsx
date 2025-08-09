import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home', () => {
  it('renders headline', () => {
    render(<Home />);
    expect(screen.getByText('Dulce-Web Next.js Monorepo')).toBeInTheDocument();
  });
});
