import { DomainException } from './domain.exception';

export class InsufficientStockException extends DomainException {
  readonly code = 'INSUFFICIENT_STOCK';

  constructor(productId: string, available: number, requested: number) {
    super(
      `Product ${productId} has ${available} units, but ${requested} were requested`,
    );
    this.name = InsufficientStockException.name;
  }
}
