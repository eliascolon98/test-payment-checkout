import { DomainException } from './domain.exception';

export class TransactionNotFoundException extends DomainException {
  readonly code = 'TRANSACTION_NOT_FOUND';

  constructor(transactionId: string) {
    super(`Transaction ${transactionId} not found`);
    this.name = TransactionNotFoundException.name;
  }
}
