import type { Transaction } from '../../../domain/models';
import { processPayment } from '../../usecases/process-payment.usecase';
import reducer, { clearHistory } from './history.slice';

const tx = (id: string) => ({ id, status: 'APPROVED' }) as Transaction;

describe('history slice', () => {
  it('prepends a transaction on payment fulfilled', () => {
    const s1 = reducer(undefined, {
      type: processPayment.fulfilled.type,
      payload: tx('a'),
    });
    const s2 = reducer(s1, {
      type: processPayment.fulfilled.type,
      payload: tx('b'),
    });
    expect(s2.items.map((t) => t.id)).toEqual(['b', 'a']);
  });

  it('does not duplicate the same transaction id', () => {
    const s1 = reducer(undefined, {
      type: processPayment.fulfilled.type,
      payload: tx('a'),
    });
    const s2 = reducer(s1, {
      type: processPayment.fulfilled.type,
      payload: tx('a'),
    });
    expect(s2.items).toHaveLength(1);
  });

  it('clears the history', () => {
    const s1 = reducer(undefined, {
      type: processPayment.fulfilled.type,
      payload: tx('a'),
    });
    expect(reducer(s1, clearHistory()).items).toHaveLength(0);
  });
});
