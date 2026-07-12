import type { CreatePaymentPayload, Transaction } from '../models';

export interface IPaymentGateway {
  createPayment(payload: CreatePaymentPayload): Promise<Transaction>;
  getTransactionStatus(id: string): Promise<Transaction>;
}
