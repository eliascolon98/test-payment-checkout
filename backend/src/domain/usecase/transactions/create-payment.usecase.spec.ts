import { type IPaymentGateway } from '../../interface/services/payment-gateway.service.interface';
import { type IProductRepository } from '../../interface/services/product.repository.interface';
import { type ITransactionRepository } from '../../interface/services/transaction.repository.interface';
import { DeliveryStatus } from '../../model/enum/delivery-status.enum';
import { TransactionStatus } from '../../model/enum/transaction-status.enum';
import { InsufficientStockException } from '../../model/exceptions/insufficient-stock.exception';
import { PaymentGatewayException } from '../../model/exceptions/payment-gateway.exception';
import { ProductNotFoundException } from '../../model/exceptions/product-not-found.exception';
import { CreateTransactionInput } from '../../model/types/create-transaction.type';
import { Product } from '../../model/types/product.type';
import { Transaction } from '../../model/types/transaction.type';
import { CreatePaymentUseCase } from './create-payment.usecase';

describe('CreatePaymentUseCase', () => {
  const productRepository: jest.Mocked<IProductRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStock: jest.fn(),
  };
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

  const logger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const useCase = new CreatePaymentUseCase(
    productRepository,
    transactionRepository,
    paymentGateway,
    logger,
  );

  const product: Product = {
    id: 'product-1',
    name: 'Headphones',
    description: 'Wireless headphones',
    price: 100000,
    imageUrl: 'https://images.test/1.jpg',
    stock: 5,
  };

  const input: CreateTransactionInput = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws ProductNotFoundException when the product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      ProductNotFoundException,
    );
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });

  it('throws InsufficientStockException when stock is not enough', async () => {
    productRepository.findById.mockResolvedValue({ ...product, stock: 1 });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InsufficientStockException,
    );
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });

  it('creates a PENDING transaction and approves it when the gateway approves', async () => {
    productRepository.findById.mockResolvedValue(product);
    paymentGateway.tokenizeCard.mockResolvedValue({
      tokenId: 'tok_1',
      brand: 'VISA',
      lastFour: '4242',
    });
    paymentGateway.createPayment.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.APPROVED,
      reference: 'TX-ref',
    });

    const result = await useCase.execute(input);

    const firstSave: Transaction = transactionRepository.save.mock.calls[0][0];
    expect(firstSave.status).toBe(TransactionStatus.PENDING);
    expect(firstSave.amountInCents).toBe(200000);
    expect(firstSave.cardLastFour).toBe('4242');
    expect(firstSave.cardBrand).toBe('VISA');
    expect(firstSave.customerEmail).toBe('customer@test.com');
    expect(firstSave.deliveryStatus).toBe(DeliveryStatus.NOT_ASSIGNED);

    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(result.externalId).toBe('ext-1');
    expect(result.deliveryStatus).toBe(DeliveryStatus.ASSIGNED);
    expect(transactionRepository.save).toHaveBeenCalledTimes(2);
    expect(productRepository.updateStock).toHaveBeenCalledWith('product-1', 3);
  });

  it('keeps the transaction PENDING when the gateway is still processing', async () => {
    productRepository.findById.mockResolvedValue(product);
    paymentGateway.tokenizeCard.mockResolvedValue({
      tokenId: 'tok_1',
      brand: 'VISA',
      lastFour: '4242',
    });
    paymentGateway.createPayment.mockResolvedValue({
      externalId: 'ext-1',
      status: TransactionStatus.PENDING,
      reference: 'TX-ref',
    });

    const result = await useCase.execute(input);

    expect(result.status).toBe(TransactionStatus.PENDING);
    expect(result.externalId).toBe('ext-1');
    expect(result.deliveryStatus).toBe(DeliveryStatus.NOT_ASSIGNED);
    expect(productRepository.updateStock).not.toHaveBeenCalled();
  });

  it('rolls back the transaction and throws when the gateway fails', async () => {
    productRepository.findById.mockResolvedValue(product);
    paymentGateway.tokenizeCard.mockRejectedValue(new Error('network error'));

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      PaymentGatewayException,
    );

    expect(transactionRepository.save).toHaveBeenCalledTimes(1);
    const pendingSave = transactionRepository.save.mock.calls[0][0];
    expect(transactionRepository.delete).toHaveBeenCalledWith(pendingSave.id);
    expect(productRepository.updateStock).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it('wraps non-Error failures before logging and rolling back', async () => {
    productRepository.findById.mockResolvedValue(product);
    paymentGateway.tokenizeCard.mockRejectedValue('unexpected failure');

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      PaymentGatewayException,
    );

    expect(transactionRepository.delete).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
