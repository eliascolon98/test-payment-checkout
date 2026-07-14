import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import type { Product } from '../../domain/models';
import { HomeScreen } from './HomeScreen';
import {
  makeTestStore,
  mockNavigation,
  renderWithStore,
} from '../../test/test-utils';

const products: Product[] = [
  {
    id: 'p1',
    name: 'Headphones',
    description: 'Wireless',
    price: 35990000,
    imageUrl: 'https://img/1.jpg',
    stock: 5,
  },
];

describe('HomeScreen', () => {
  it('loads and renders products, navigating on press', async () => {
    const gateways = {
      productGateway: { fetchProducts: jest.fn().mockResolvedValue(products) },
    };
    const store = makeTestStore(gateways);
    const navigation = mockNavigation();

    renderWithStore(
      <HomeScreen navigation={navigation} route={{} as never} />,
      store,
    );

    await waitFor(() => expect(screen.getByText('Headphones')).toBeTruthy());

    fireEvent.press(screen.getByTestId('product-card-p1'));
    expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith(
      'ProductDetail',
      { productId: 'p1' },
    );
  });

  it('shows an error state with retry when loading fails', async () => {
    const gateways = {
      productGateway: {
        fetchProducts: jest.fn().mockRejectedValue(new Error('network')),
      },
    };
    const store = makeTestStore(gateways);

    renderWithStore(
      <HomeScreen navigation={mockNavigation()} route={{} as never} />,
      store,
    );

    await waitFor(() =>
      expect(screen.getByText('Something went wrong')).toBeTruthy(),
    );
    expect(screen.getByText('Try again')).toBeTruthy();
  });
});
