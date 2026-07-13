import type { Gateways } from '../../domain/ports';
import type { CreatePaymentPayload, Transaction } from '../../domain/models';
import { processPayment } from './process-payment.usecase';

const payload = {
  productId: 'p1',
  quantity: 1,
  customerEmail: 'a@b.com',
  installments: 1,
  card: {
    number: '4242424242424242',
    cvc: '123',
    expMonth: '08',
    expYear: '28',
    cardHolder: 'JOHN DOE',
  },
} as CreatePaymentPayload;

const tx = (status: Transaction['status']): Transaction =>
  ({ id: 't1', status }) as Transaction;

const run = (extra: Gateways) =>
  processPayment(payload)(jest.fn(), jest.fn(), extra);

describe('processPayment use case', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the transaction when approved immediately', async () => {
    const extra = {
      paymentGateway: {
        createPayment: jest.fn().mockResolvedValue(tx('APPROVED')),
        getTransactionStatus: jest.fn(),
      },
      productGateway: {},
    } as unknown as Gateways;

    const result = await run(extra);

    expect(result.payload).toEqual(tx('APPROVED'));
    expect(extra.paymentGateway.getTransactionStatus).not.toHaveBeenCalled();
  });

  it('polls the status while PENDING and returns the final state', async () => {
    const extra = {
      paymentGateway: {
        createPayment: jest.fn().mockResolvedValue(tx('PENDING')),
        getTransactionStatus: jest
          .fn()
          .mockResolvedValueOnce(tx('PENDING'))
          .mockResolvedValueOnce(tx('APPROVED')),
      },
      productGateway: {},
    } as unknown as Gateways;

    const result = await run(extra);

    expect(extra.paymentGateway.getTransactionStatus).toHaveBeenCalledTimes(2);
    expect((result.payload as Transaction).status).toBe('APPROVED');
  });

  it('rejects with a message when the gateway throws', async () => {
    const extra = {
      paymentGateway: {
        createPayment: jest.fn().mockRejectedValue(new Error('502')),
        getTransactionStatus: jest.fn(),
      },
      productGateway: {},
    } as unknown as Gateways;

    const result = await run(extra);

    expect(result.type).toContain('rejected');
    expect(result.payload).toBe(
      'The payment could not be processed. Please try again.',
    );
  });
});
