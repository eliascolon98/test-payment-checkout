import { api } from './client';
import { HttpPaymentGateway } from './payment-gateway.http';

jest.mock('./client', () => ({
  api: { post: jest.fn(), get: jest.fn() },
}));

const mockedApi = api as unknown as {
  post: jest.Mock;
  get: jest.Mock;
};

describe('HttpPaymentGateway', () => {
  const gateway = new HttpPaymentGateway();

  beforeEach(() => jest.clearAllMocks());

  it('createPayment posts to /transactions and unwraps data', async () => {
    mockedApi.post.mockResolvedValue({ data: { data: { id: 't1' } } });

    const result = await gateway.createPayment({
      productId: 'p1',
      quantity: 1,
      customerEmail: 'a@b.com',
      card: {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '08',
        expYear: '28',
        cardHolder: 'JOHN DOE',
      },
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/transactions',
      expect.any(Object),
    );
    expect(result).toEqual({ id: 't1' });
  });

  it('getTransactionStatus gets /transactions/:id', async () => {
    mockedApi.get.mockResolvedValue({ data: { data: { id: 't1' } } });

    const result = await gateway.getTransactionStatus('t1');

    expect(mockedApi.get).toHaveBeenCalledWith('/transactions/t1');
    expect(result).toEqual({ id: 't1' });
  });
});
