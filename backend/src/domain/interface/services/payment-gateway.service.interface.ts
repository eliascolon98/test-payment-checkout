import { CreatePaymentRequest } from '../../model/types/create-payment.type';
import { PaymentStatusResponse } from '../../model/types/payment-status.type';
import {
  TokenizeCardRequest,
  TokenizeCardResponse,
} from '../../model/types/tokenize-card.type';

export interface IPaymentGateway {
  tokenizeCard(request: TokenizeCardRequest): Promise<TokenizeCardResponse>;
  createPayment(request: CreatePaymentRequest): Promise<PaymentStatusResponse>;
  getPaymentStatus(externalId: string): Promise<PaymentStatusResponse>;
}
