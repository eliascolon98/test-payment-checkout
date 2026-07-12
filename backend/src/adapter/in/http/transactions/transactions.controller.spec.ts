import { DeliveryStatus } from '../../../../domain/model/enum/delivery-status.enum';
import { TransactionStatus } from '../../../../domain/model/enum/transaction-status.enum';
import { Transaction } from '../../../../domain/model/types/transaction.type';
import { CreatePaymentHandler } from '../../../../handler/transactions/create-payment.handler';
import { GetTransactionStatusHandler } from '../../../../handler/transactions/get-transaction-status.handler';
import { CreatePaymentDto } from '../../../../model/dto/http/create-payment.dto';
import { HTTPResponse } from '../../../../model/http-response.model';
import { TransactionsController } from './transactions.controller';

describe('TransactionsController', () => {
  const createPaymentHandler = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreatePaymentHandler>;
  const getTransactionStatusHandler = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<GetTransactionStatusHandler>;

  const controller = new TransactionsController(
    createPaymentHandler,
    getTransactionStatusHandler,
  );

  const transaction: Transaction = {
    id: 'tx-1',
    reference: 'TX-ref',
    productId: 'product-1',
    quantity: 1,
    amountInCents: 100000,
    currency: 'COP',
    cardLastFour: '4242',
    cardBrand: 'VISA',
    customerEmail: 'customer@test.com',
    deliveryStatus: DeliveryStatus.NOT_ASSIGNED,
    status: TransactionStatus.PENDING,
    externalId: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createPayment delegates to its handler with the dto', async () => {
    const dto: CreatePaymentDto = {
      productId: 'product-1',
      quantity: 1,
      customerEmail: 'customer@test.com',
      card: {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '08',
        expYear: '28',
        cardHolder: 'Test User',
      },
    };
    const response = new HTTPResponse('TRANSACTION_CREATED', 'ok', transaction);
    createPaymentHandler.execute.mockResolvedValue(response);

    const result = await controller.createPayment(dto);

    expect(createPaymentHandler.execute).toHaveBeenCalledWith(dto);
    expect(result).toBe(response);
  });

  it('getTransactionStatus delegates to its handler with the id', async () => {
    const response = new HTTPResponse('TRANSACTION_FOUND', 'ok', transaction);
    getTransactionStatusHandler.execute.mockResolvedValue(response);

    const result = await controller.getTransactionStatus('tx-1');

    expect(getTransactionStatusHandler.execute).toHaveBeenCalledWith('tx-1');
    expect(result).toBe(response);
  });
});
