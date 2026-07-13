import { render, screen } from '@testing-library/react-native';
import { CardBrandLogo } from './CardBrandLogo';

describe('CardBrandLogo', () => {
  it('renders the VISA logo', () => {
    render(<CardBrandLogo brand="VISA" />);
    expect(screen.getByTestId('brand-visa')).toBeTruthy();
  });

  it('renders the MasterCard logo', () => {
    render(<CardBrandLogo brand="MASTERCARD" />);
    expect(screen.getByTestId('brand-mc')).toBeTruthy();
  });

  it('renders nothing for an unknown brand', () => {
    render(<CardBrandLogo brand="UNKNOWN" />);
    expect(screen.toJSON()).toBeNull();
  });
});
