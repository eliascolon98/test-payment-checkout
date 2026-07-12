import { DeliveryStatus } from '../../domain/model/enum/delivery-status.enum';
import { TransactionStatus } from '../../domain/model/enum/transaction-status.enum';
import { Transaction } from '../../domain/model/types/transaction.type';
import { GetTransactionStatusUseCase } from '../../domain/usecase/transactions/get-transaction-status.usecase';
import { GetTransactionStatusHandler } from './get-transaction-status.handler';

describe('GetTransactionStatusHandler', () => {
  const useCase = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<GetTransactionStatusUseCase>;

  const handler = new GetTransactionStatusHandler(useCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps the transaction in a standard HTTP response', async () => {
    const transaction: Transaction = {
      id: 'tx-1',
      reference: 'TX-ref',
      productId: 'product-1',
      quantity: 2,
      amountInCents: 200000,
      currency: 'COP',
      cardLastFour: '4242',
      cardBrand: 'VISA',
      customerEmail: 'customer@test.com',
      deliveryStatus: DeliveryStatus.NOT_ASSIGNED,
      status: TransactionStatus.APPROVED,
      externalId: 'ext-1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    };
    useCase.execute.mockResolvedValue(transaction);

    const response = await handler.execute('tx-1');

    expect(useCase.execute).toHaveBeenCalledWith('tx-1');
    expect(response.code).toBe('TRANSACTION_FOUND');
    expect(response.data).toEqual(transaction);
  });
});
