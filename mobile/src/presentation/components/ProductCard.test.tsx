import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Product } from '../../domain/models';
import { ProductCard } from './ProductCard';

const product: Product = {
  id: 'p1',
  name: 'Headphones',
  description: 'Wireless',
  price: 35990000,
  imageUrl: 'https://img/1.jpg',
  stock: 5,
};

describe('ProductCard', () => {
  it('shows the product info and handles press', () => {
    const onPress = jest.fn();
    render(<ProductCard product={product} onPress={onPress} />);

    expect(screen.getByText('Headphones')).toBeTruthy();
    expect(screen.getByText('$ 359.900')).toBeTruthy();
    expect(screen.getByText('5 in stock')).toBeTruthy();

    fireEvent.press(screen.getByTestId('product-card-p1'));
    expect(onPress).toHaveBeenCalledWith(product);
  });

  it('disables the card when out of stock', () => {
    const onPress = jest.fn();
    render(<ProductCard product={{ ...product, stock: 0 }} onPress={onPress} />);

    expect(screen.getByText('Out of stock')).toBeTruthy();
    fireEvent.press(screen.getByTestId('product-card-p1'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
