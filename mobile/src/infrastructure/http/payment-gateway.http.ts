import type { IPaymentGateway } from '../../domain/ports/payment-gateway.port';
import type {
  ApiResponse,
  CreatePaymentPayload,
  Transaction,
} from '../../domain/models';
import { api } from './client';

export class HttpPaymentGateway implements IPaymentGateway {
  async createPayment(payload: CreatePaymentPayload): Promise<Transaction> {
    const { data } = await api.post<ApiResponse<Transaction>>(
      '/transactions',
      payload,
    );
    return data.data;
  }

  async getTransactionStatus(id: string): Promise<Transaction> {
    const { data } = await api.get<ApiResponse<Transaction>>(
      `/transactions/${id}`,
    );
    return data.data;
  }
}
