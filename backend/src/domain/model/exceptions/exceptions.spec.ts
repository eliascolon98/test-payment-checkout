import { DomainException } from './domain.exception';
import { InsufficientStockException } from './insufficient-stock.exception';
import { InvalidTransactionStateException } from './invalid-transaction-state.exception';
import { ProductNotFoundException } from './product-not-found.exception';
import { TransactionNotFoundException } from './transaction-not-found.exception';

describe('Domain exceptions', () => {
  it('InsufficientStockException exposes code and message', () => {
    const exception = new InsufficientStockException('product-1', 2, 5);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.code).toBe('INSUFFICIENT_STOCK');
    expect(exception.message).toContain('product-1');
    expect(exception.message).toContain('2');
    expect(exception.message).toContain('5');
  });

  it('ProductNotFoundException exposes code and message', () => {
    const exception = new ProductNotFoundException('product-1');

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.code).toBe('PRODUCT_NOT_FOUND');
    expect(exception.message).toContain('product-1');
  });

  it('TransactionNotFoundException exposes code and message', () => {
    const exception = new TransactionNotFoundException('tx-1');

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.code).toBe('TRANSACTION_NOT_FOUND');
    expect(exception.message).toContain('tx-1');
  });

  it('InvalidTransactionStateException exposes code and message', () => {
    const exception = new InvalidTransactionStateException(
      'APPROVED',
      'PENDING',
    );

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.code).toBe('INVALID_TRANSACTION_STATE');
    expect(exception.message).toContain('APPROVED');
    expect(exception.message).toContain('PENDING');
  });
});
