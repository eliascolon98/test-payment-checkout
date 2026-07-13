import { fireEvent, screen } from '@testing-library/react-native';
import type { Transaction } from '../../domain/models';
import { ResultScreen } from './ResultScreen';
import {
  makeTestStore,
  mockNavigation,
  renderWithStore,
} from '../../test/test-utils';

const approved = {
  id: 't1',
  reference: 'TX-1',
  amountInCents: 100000,
  cardBrand: 'VISA',
  cardLastFour: '4242',
  status: 'APPROVED',
  quantity: 1,
} as Transaction;

const renderResult = (checkout: object, gateways = {}) => {
  const store = makeTestStore(gateways, { checkout } as never);
  const navigation = mockNavigation();
  renderWithStore(
    <ResultScreen navigation={navigation} route={{} as never} />,
    store,
  );
  return { store, navigation };
};

describe('ResultScreen', () => {
  it('shows a processing state', () => {
    renderResult({ status: 'processing', transaction: null, errorMessage: null });
    expect(screen.getByText('Processing payment…')).toBeTruthy();
  });

  it('shows an approved transaction and returns to products', () => {
    const gateways = {
      productGateway: { fetchProducts: jest.fn().mockResolvedValue([]) },
    };
    const { navigation } = renderResult(
      { status: 'success', transaction: approved, errorMessage: null },
      gateways,
    );

    expect(screen.getByText('Payment approved')).toBeTruthy();
    expect(screen.getByText('TX-1')).toBeTruthy();

    fireEvent.press(screen.getByText('Back to products'));
    expect((navigation as { reset: jest.Mock }).reset).toHaveBeenCalled();
  });

  it('shows the error state', () => {
    renderResult({
      status: 'error',
      transaction: null,
      errorMessage: 'Payment failed',
    });
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Payment failed')).toBeTruthy();
  });

  it('shows a declined transaction', () => {
    renderResult({
      status: 'success',
      transaction: { ...approved, status: 'DECLINED' },
      errorMessage: null,
    });
    expect(screen.getByText('Payment declined')).toBeTruthy();
  });
});
