import { DomainException } from './domain.exception';

export class ProductNotFoundException extends DomainException {
  readonly code = 'PRODUCT_NOT_FOUND';

  constructor(productId: string) {
    super(`Product ${productId} not found`);
    this.name = ProductNotFoundException.name;
  }
}
