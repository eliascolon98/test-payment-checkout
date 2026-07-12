import { Transaction } from '../../model/types/transaction.type';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByReference(reference: string): Promise<Transaction | null>;
  delete(id: string): Promise<void>;
}
