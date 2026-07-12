import { TransactionStatus } from '../enum/transaction-status.enum';

export type PaymentStatusResponse = {
  externalId: string;
  status: TransactionStatus;
  reference: string;
};
