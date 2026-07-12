import { TokenizeCardRequest } from './tokenize-card.type';

export type CreateTransactionInput = {
  productId: string;
  quantity: number;
  customerEmail: string;
  installments: number;
  card: TokenizeCardRequest;
};
