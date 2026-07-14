import { fireEvent, screen } from '@testing-library/react-native';
import type { Product } from '../../domain/models';
import { ProductDetailScreen } from './ProductDetailScreen';
import {
  makeTestStore,
  mockNavigation,
  renderWithStore,
} from '../../test/test-utils';

const product: Product = {
  id: 'p1',
  name: 'Headphones',
  description: 'Wireless',
  price: 100000,
  imageUrl: 'https://img/1.jpg',
  stock: 5,
};

const preloaded = {
  products: { items: [product], status: 'succeeded' as const, errorMessage: null },
};

describe('ProductDetailScreen', () => {
  it('selects quantity and continues to checkout', () => {
    const store = makeTestStore({}, preloaded);
    const navigation = mockNavigation();

    renderWithStore(
      <ProductDetailScreen
        navigation={navigation}
        route={{ params: { productId: 'p1' }, key: 'k', name: 'ProductDetail' }}
      />,
      store,
    );

    fireEvent.press(screen.getByTestId('quantity-increase'));
    fireEvent.press(screen.getByTestId('continue-checkout'));

    expect(store.getState().cart.item?.quantity).toBe(2);
    expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith(
      'Checkout',
    );
  });

  it('shows a not-found message for an unknown product', () => {
    const store = makeTestStore({}, preloaded);

    renderWithStore(
      <ProductDetailScreen
        navigation={mockNavigation()}
        route={{ params: { productId: 'x' }, key: 'k', name: 'ProductDetail' }}
      />,
      store,
    );

    expect(screen.getByText('Product not found')).toBeTruthy();
  });
});
