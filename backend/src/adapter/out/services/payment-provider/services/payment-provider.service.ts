import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { type IPaymentGateway } from '../../../../../domain/interface/services/payment-gateway.service.interface';
import { TransactionStatus } from '../../../../../domain/model/enum/transaction-status.enum';
import { CreatePaymentRequest } from '../../../../../domain/model/types/create-payment.type';
import { PaymentStatusResponse } from '../../../../../domain/model/types/payment-status.type';
import {
  TokenizeCardRequest,
  TokenizeCardResponse,
} from '../../../../../domain/model/types/tokenize-card.type';
import type {
  MerchantApiResponse,
  TokenizeCardApiResponse,
  TransactionApiResponse,
} from '../types/payment-provider-api.type';

@Injectable()
export class PaymentProviderService implements IPaymentGateway {
  private readonly apiUrl: string;
  private readonly publicKey: string;
  private readonly integritySecret: string;

  constructor(
    private readonly config: ConfigService<Record<string, string>, true>,
  ) {
    this.apiUrl = this.config.getOrThrow<string>('PAYMENT_API_URL');
    this.publicKey = this.config.getOrThrow<string>('PAYMENT_PUBLIC_KEY');
    this.integritySecret = this.config.getOrThrow<string>(
      'PAYMENT_INTEGRITY_SECRET',
    );
  }

  async tokenizeCard(
    request: TokenizeCardRequest,
  ): Promise<TokenizeCardResponse> {
    try {
      const { data } = await axios.post<TokenizeCardApiResponse>(
        `${this.apiUrl}/tokens/cards`,
        {
          number: request.number,
          exp_month: request.expMonth,
          exp_year: request.expYear,
          cvc: request.cvc,
          card_holder: request.cardHolder,
        },
        { headers: { Authorization: `Bearer ${this.publicKey}` } },
      );

      return {
        tokenId: data.data.id,
        brand: data.data.brand,
        lastFour: data.data.last_four,
      };
    } catch (error) {
      throw this.toGatewayError(error, 'tokenize card');
    }
  }

  async createPayment(
    request: CreatePaymentRequest,
  ): Promise<PaymentStatusResponse> {
    const acceptanceToken = await this.getAcceptanceToken();
    const signature = this.generateSignature(
      request.reference,
      request.amountInCents,
      request.currency,
    );

    try {
      const { data } = await axios.post<TransactionApiResponse>(
        `${this.apiUrl}/transactions`,
        {
          amount_in_cents: request.amountInCents,
          currency: request.currency,
          customer_email: request.customerEmail,
          reference: request.reference,
          payment_method: {
            type: 'CARD',
            token: request.cardToken,
            installments: request.installments,
          },
          acceptance_token: acceptanceToken,
          signature,
        },
        { headers: { Authorization: `Bearer ${this.publicKey}` } },
      );

      return this.mapPaymentStatus(data);
    } catch (error) {
      throw this.toGatewayError(error, 'create payment');
    }
  }

  async getPaymentStatus(externalId: string): Promise<PaymentStatusResponse> {
    try {
      const { data } = await axios.get<TransactionApiResponse>(
        `${this.apiUrl}/transactions/${externalId}`,
        { headers: { Authorization: `Bearer ${this.publicKey}` } },
      );

      return this.mapPaymentStatus(data);
    } catch (error) {
      throw this.toGatewayError(error, 'get payment status');
    }
  }

  private mapPaymentStatus(
    response: TransactionApiResponse,
  ): PaymentStatusResponse {
    return {
      externalId: response.data.id,
      status: TransactionStatus[response.data.status],
      reference: response.data.reference,
    };
  }

  private async getAcceptanceToken(): Promise<string> {
    const { data } = await axios.get<MerchantApiResponse>(
      `${this.apiUrl}/merchants/${this.publicKey}`,
    );
    return data.data.presigned_acceptance.acceptance_token;
  }

  private generateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const raw = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private toGatewayError(error: unknown, operation: string): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 'no-response';
      const detail = JSON.stringify(error.response?.data ?? error.message);
      return new Error(
        `Payment provider failed to ${operation} (${status}): ${detail}`,
      );
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
