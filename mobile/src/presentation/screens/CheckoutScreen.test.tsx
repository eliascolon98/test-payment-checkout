import { fireEvent, screen } from '@testing-library/react-native';
import type { Product } from '../../domain/models';
import { CheckoutScreen } from './CheckoutScreen';
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
  cart: { item: { product, quantity: 2 } },
};

describe('CheckoutScreen', () => {
  it('shows an empty state when there is no item', () => {
    const store = makeTestStore({}, { cart: { item: null } });
    renderWithStore(
      <CheckoutScreen navigation={mockNavigation()} route={{} as never} />,
      store,
    );
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
  });

  it('enables payment only with a valid email and opens the card backdrop', () => {
    const store = makeTestStore({}, preloaded);
    renderWithStore(
      <CheckoutScreen navigation={mockNavigation()} route={{} as never} />,
      store,
    );

    // Backdrop closed initially
    expect(screen.queryByTestId('backdrop')).toBeNull();

    fireEvent.changeText(screen.getByTestId('input-email'), 'buyer@test.com');
    fireEvent.press(screen.getByTestId('pay-with-card'));

    expect(screen.getByTestId('backdrop')).toBeTruthy();
  });

  it('runs the full flow: card -> summary -> pay -> navigate to Result', () => {
    const gateways = {
      paymentGateway: {
        createPayment: jest
          .fn()
          .mockResolvedValue({ id: 't1', status: 'APPROVED' }),
        getTransactionStatus: jest.fn(),
      },
    };
    const store = makeTestStore(gateways, preloaded);
    const navigation = mockNavigation();

    renderWithStore(
      <CheckoutScreen navigation={navigation} route={{} as never} />,
      store,
    );

    fireEvent.changeText(screen.getByTestId('input-email'), 'buyer@test.com');
    fireEvent.press(screen.getByTestId('pay-with-card'));

    // Fill the card form
    fireEvent.changeText(
      screen.getByTestId('input-card-number'),
      '4242424242424242',
    );
    fireEvent.press(screen.getByTestId('select-exp-month'));
    fireEvent.press(screen.getByTestId('option-08'));
    fireEvent.changeText(screen.getByTestId('input-exp-year'), '30');
    fireEvent.changeText(screen.getByTestId('input-cvc'), '123');
    fireEvent.changeText(screen.getByTestId('input-card-holder'), 'JOHN DOE');
    fireEvent.press(screen.getByTestId('submit-card'));

    // Payment summary is shown, confirm payment
    fireEvent.press(screen.getByTestId('confirm-payment'));

    expect(gateways.paymentGateway.createPayment).toHaveBeenCalled();
    expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith(
      'Result',
    );
  });
});
