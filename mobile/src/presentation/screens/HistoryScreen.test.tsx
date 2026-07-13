import { screen } from '@testing-library/react-native';
import type { Transaction } from '../../domain/models';
import { HistoryScreen } from './HistoryScreen';
import { makeTestStore, renderWithStore } from '../../test/test-utils';

const tx: Transaction = {
  id: 't1',
  reference: 'TX-1',
  productId: 'p1',
  quantity: 1,
  amountInCents: 100000,
  currency: 'COP',
  cardLastFour: '4242',
  cardBrand: 'VISA',
  customerEmail: 'a@b.com',
  deliveryStatus: 'ASSIGNED',
  status: 'APPROVED',
  externalId: 'ext-1',
  createdAt: '2026-07-13T10:00:00',
  updatedAt: '2026-07-13T10:00:00',
};

describe('HistoryScreen', () => {
  it('shows an empty state when there are no purchases', () => {
    const store = makeTestStore({}, { history: { items: [] } });
    renderWithStore(<HistoryScreen />, store);
    expect(screen.getByText('No purchases yet')).toBeTruthy();
  });

  it('renders the transactions', () => {
    const store = makeTestStore({}, { history: { items: [tx] } });
    renderWithStore(<HistoryScreen />, store);
    expect(screen.getByText('$ 1.000')).toBeTruthy();
    expect(screen.getByText('APPROVED')).toBeTruthy();
    expect(screen.getByText('TX-1')).toBeTruthy();
  });
});
