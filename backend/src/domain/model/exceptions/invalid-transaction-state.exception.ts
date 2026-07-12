import { DomainException } from './domain.exception';

export class InvalidTransactionStateException extends DomainException {
  readonly code = 'INVALID_TRANSACTION_STATE';

  constructor(current: string, expected: string) {
    super(`Transaction is ${current}, expected ${expected}`);
    this.name = InvalidTransactionStateException.name;
  }
}
