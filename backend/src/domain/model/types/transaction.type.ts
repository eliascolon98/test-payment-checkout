import { TransactionStatus } from '../enum/transaction-status.enum';
import { DeliveryStatus } from '../enum/delivery-status.enum';

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
  customerEmail: string;
  deliveryStatus: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
};
