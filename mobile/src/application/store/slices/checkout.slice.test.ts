import type { Transaction } from '../../../domain/models';
import { processPayment } from '../../usecases/process-payment.usecase';
import reducer, { resetCheckout } from './checkout.slice';

const transaction = { id: 't1', status: 'APPROVED' } as Transaction;

describe('checkout slice', () => {
  it('sets processing on pending', () => {
    const state = reducer(undefined, { type: processPayment.pending.type });
    expect(state.status).toBe('processing');
  });

  it('stores the transaction on fulfilled', () => {
    const state = reducer(undefined, {
      type: processPayment.fulfilled.type,
      payload: transaction,
    });
    expect(state.status).toBe('success');
    expect(state.transaction?.id).toBe('t1');
  });

  it('stores the error on rejected', () => {
    const state = reducer(undefined, {
      type: processPayment.rejected.type,
      payload: 'failed',
    });
    expect(state.status).toBe('error');
    expect(state.errorMessage).toBe('failed');
  });

  it('resets the checkout', () => {
    const withTx = reducer(undefined, {
      type: processPayment.fulfilled.type,
      payload: transaction,
    });
    const reset = reducer(withTx, resetCheckout());
    expect(reset.status).toBe('idle');
    expect(reset.transaction).toBeNull();
  });
});
