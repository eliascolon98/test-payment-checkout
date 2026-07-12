import { TransactionStatus } from '../enum/transaction-status.enum';

export type Transaction = {
  id: string;
  reference: string;
  productId: string;
  quantity: number;
  amountInCents: number;
  currency: string;
  cardLastFour: string;
  cardBrand: string;
  status: TransactionStatus;
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
