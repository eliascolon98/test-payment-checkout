import { TransactionStatus } from '../../domain/model/enum/transaction-status.enum';
import { Transaction } from '../../domain/model/types/transaction.type';
import { CreatePaymentUseCase } from '../../domain/usecase/transactions/create-payment.usecase';
import { CreatePaymentDto } from '../../model/dto/http/create-payment.dto';
import { CreatePaymentHandler } from './create-payment.handler';

describe('CreatePaymentHandler', () => {
  const useCase = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreatePaymentUseCase>;

  const handler = new CreatePaymentHandler(useCase);

  const transaction: Transaction = {
    id: 'tx-1',
    reference: 'TX-ref',
    productId: 'product-1',
    quantity: 2,
    amountInCents: 200000,
    currency: 'COP',
    cardLastFour: '4242',
    cardBrand: 'VISA',
    status: TransactionStatus.PENDING,
    externalId: 'ext-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const dto: CreatePaymentDto = {
    productId: 'product-1',
    quantity: 2,
    customerEmail: 'customer@test.com',
    card: {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'Test User',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps the dto to the use case input and wraps the result', async () => {
    useCase.execute.mockResolvedValue(transaction);

    const response = await handler.execute(dto);

    expect(useCase.execute).toHaveBeenCalledWith({
      productId: 'product-1',
      quantity: 2,
      customerEmail: 'customer@test.com',
      installments: 1,
      card: {
        number: '4242424242424242',
        cvc: '123',
        expMonth: '08',
        expYear: '28',
        cardHolder: 'Test User',
      },
    });
    expect(response.code).toBe('TRANSACTION_CREATED');
    expect(response.data).toEqual(transaction);
  });

  it('respects the installments sent in the dto', async () => {
    useCase.execute.mockResolvedValue(transaction);

    await handler.execute({ ...dto, installments: 12 });

    expect(useCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ installments: 12 }),
    );
  });
});
