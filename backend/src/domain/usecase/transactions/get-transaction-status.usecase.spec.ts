import { type IPaymentGateway } from '../../interface/services/payment-gateway.service.interface';
import { type IProductRepository } from '../../interface/services/product.repository.interface';
import { type ITransactionRepository } from '../../interface/services/transaction.repository.interface';
import { DeliveryStatus } from '../../model/enum/delivery-status.enum';
import { TransactionStatus } from '../../model/enum/transaction-status.enum';
import { TransactionNotFoundException } from '../../model/exceptions/transaction-not-found.exception';
import { Transaction } from '../../model/types/transaction.type';
import { GetTransactionStatusUseCase } from './get-transaction-status.usecase';

describe('GetTransactionStatusUseCase', () => {
  const transactionRepository: jest.Mocked<ITransactionRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByReference: jest.fn(),
    delete: jest.fn(),
  };
  const paymentGateway: jest.Mocked<IPaymentGateway> = {
    tokenizeCard: jest.fn(),
    createPayment: jest.fn(),
    getPaymentStatus: jest.fn(),
  };
  const productRepository: jest.Mocked<IProductRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStock: jest.fn(),
  };

  const useCase = new GetTransactionStatusUseCase(
    transactionRepository,
    paymentGateway,
    productRepository,
  );

  const buildTransaction = (overrides: Partial<Transaction>): Transaction => ({
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
    status: TransactionStatus.PENDING,
    externalId: 'ext-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws TransactionNotFoundException when the transaction does not exist', async () => {
    transactionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      TransactionNotFoundException,
    );
  });

  it('returns the transaction as-is when it already has a final status', async () => {
    const transaction = buildTransaction({
      status: TransactionStatus.APPROVED,
    });
    transactionRepository.findById.mockResolvedValue(transaction);

    const result = await useCase.execute('tx-1');

    expect(result).toEqual(transaction);
    expect(paymentGateway.getPaymentStatus).not.toHaveBeenCalled();
  });

  it('returns the transaction as-is when it has no external id', async () => {
    const transaction = buildTransaction({ externalId: null });
    transactionRepository.findById.mockResolvedValue(transaction);

    const result = await useCase.execute('tx-1');

    expect(result).toEqual(transaction);
    expect(paymentGateway.getPaymentStatus).not.toHaveBeenCalled();
  });

  it('returns the transaction unchanged when the gateway is still PENDING', async () => {
    const transaction = buildTransaction({});
    transactionRepository.findById.mockResolvedValue(transaction);
    paymentGateway.getPaymentStatus.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.PENDING,
      reference: 'TX-ref',
    });

    const result = await useCase.execute('tx-1');

    expect(result).toEqual(transaction);
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });

  it('updates the transaction and decreases stock when the gateway approves', async () => {
    const transaction = buildTransaction({});
    transactionRepository.findById.mockResolvedValue(transaction);
    paymentGateway.getPaymentStatus.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.APPROVED,
      reference: 'TX-ref',
    });
    productRepository.findById.mockResolvedValue({
      id: 'product-1',
      name: 'Headphones',
      description: 'Wireless headphones',
      price: 100000,
      imageUrl: 'https://images.test/1.jpg',
      stock: 5,
    });

    const result = await useCase.execute('tx-1');

    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(result.deliveryStatus).toBe(DeliveryStatus.ASSIGNED);
    expect(transactionRepository.save).toHaveBeenCalledTimes(1);
    expect(productRepository.updateStock).toHaveBeenCalledWith('product-1', 3);
  });

  it('updates the transaction without touching stock when the gateway declines', async () => {
    const transaction = buildTransaction({});
    transactionRepository.findById.mockResolvedValue(transaction);
    paymentGateway.getPaymentStatus.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.DECLINED,
      reference: 'TX-ref',
    });

    const result = await useCase.execute('tx-1');

    expect(result.status).toBe(TransactionStatus.DECLINED);
    expect(result.deliveryStatus).toBe(DeliveryStatus.NOT_ASSIGNED);
    expect(productRepository.updateStock).not.toHaveBeenCalled();
  });

  it('does not fail when the product no longer exists on delivery', async () => {
    const transaction = buildTransaction({});
    transactionRepository.findById.mockResolvedValue(transaction);
    paymentGateway.getPaymentStatus.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.APPROVED,
      reference: 'TX-ref',
    });
    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1');

    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(productRepository.updateStock).not.toHaveBeenCalled();
  });
});
