import { createHash } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TransactionStatus } from '../../../../../domain/model/enum/transaction-status.enum';
import { PaymentProviderService } from './payment-provider.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentProviderService', () => {
  const env: Record<string, string> = {
    PAYMENT_API_URL: 'https://api.payments.test/v1',
    PAYMENT_PUBLIC_KEY: 'pub_test_key',
    PAYMENT_INTEGRITY_SECRET: 'integrity_secret',
  };
  const config = {
    getOrThrow: jest.fn((key: string) => env[key]),
  } as unknown as ConfigService<Record<string, string>, true>;

  const service = new PaymentProviderService(config);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('tokenizeCard', () => {
    it('sends the card data in the provider format and maps the response', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { data: { id: 'tok_123', brand: 'VISA', last_four: '4242' } },
      });

      const result = await service.tokenizeCard({
        number: '4242424242424242',
        expMonth: '08',
        expYear: '28',
        cvc: '123',
        cardHolder: 'Test User',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.payments.test/v1/tokens/cards',
        {
          number: '4242424242424242',
          exp_month: '08',
          exp_year: '28',
          cvc: '123',
          card_holder: 'Test User',
        },
        { headers: { Authorization: 'Bearer pub_test_key' } },
      );
      expect(result).toEqual({
        tokenId: 'tok_123',
        brand: 'VISA',
        lastFour: '4242',
      });
    });
  });

  describe('createPayment', () => {
    it('fetches a fresh acceptance token, signs the payment and maps the response', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: 'acceptance_123' },
          },
        },
      });
      mockedAxios.post.mockResolvedValue({
        data: {
          data: { id: 'ext-1', status: 'PENDING', reference: 'TX-ref' },
        },
      });

      const result = await service.createPayment({
        reference: 'TX-ref',
        amountInCents: 200000,
        currency: 'COP',
        cardToken: 'tok_123',
        installments: 1,
        customerEmail: 'customer@test.com',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.payments.test/v1/merchants/pub_test_key',
      );

      const expectedSignature = createHash('sha256')
        .update('TX-ref200000COPintegrity_secret')
        .digest('hex');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.payments.test/v1/transactions',
        {
          amount_in_cents: 200000,
          currency: 'COP',
          customer_email: 'customer@test.com',
          reference: 'TX-ref',
          payment_method: {
            type: 'CARD',
            token: 'tok_123',
            installments: 1,
          },
          acceptance_token: 'acceptance_123',
          signature: expectedSignature,
        },
        { headers: { Authorization: 'Bearer pub_test_key' } },
      );
      expect(result).toEqual({
        externalId: 'ext-1',
        status: TransactionStatus.PENDING,
        reference: 'TX-ref',
      });
    });
  });

  describe('getPaymentStatus', () => {
    it('queries the transaction by external id and maps the status to the enum', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: { id: 'ext-1', status: 'APPROVED', reference: 'TX-ref' },
        },
      });

      const result = await service.getPaymentStatus('ext-1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.payments.test/v1/transactions/ext-1',
        { headers: { Authorization: 'Bearer pub_test_key' } },
      );
      expect(result).toEqual({
        externalId: 'ext-1',
        status: TransactionStatus.APPROVED,
        reference: 'TX-ref',
      });
    });

    it('maps DECLINED payments', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          data: { id: 'ext-1', status: 'DECLINED', reference: 'TX-ref' },
        },
      });

      const result = await service.getPaymentStatus('ext-1');

      expect(result.status).toBe(TransactionStatus.DECLINED);
    });
  });

  describe('error translation', () => {
    it('includes the provider response detail on API errors', async () => {
      (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 422,
          data: { error: { type: 'INPUT_VALIDATION_ERROR' } },
        },
        message: 'Request failed with status code 422',
      });

      await expect(
        service.tokenizeCard({
          number: '4242424242424242',
          expMonth: '08',
          expYear: '28',
          cvc: '123',
          cardHolder: 'Test User',
        }),
      ).rejects.toThrow(
        'Payment provider failed to tokenize card (422): {"error":{"type":"INPUT_VALIDATION_ERROR"}}',
      );
    });

    it('rethrows non-axios errors unchanged', async () => {
      (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);
      mockedAxios.get.mockRejectedValue(new Error('boom'));

      await expect(service.getPaymentStatus('ext-1')).rejects.toThrow('boom');
    });

    it('handles network errors without response when creating a payment', async () => {
      (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            presigned_acceptance: { acceptance_token: 'acceptance_123' },
          },
        },
      });
      mockedAxios.post.mockRejectedValue({ message: 'socket hang up' });

      await expect(
        service.createPayment({
          reference: 'TX-ref',
          amountInCents: 200000,
          currency: 'COP',
          cardToken: 'tok_123',
          installments: 1,
          customerEmail: 'customer@test.com',
        }),
      ).rejects.toThrow(
        'Payment provider failed to create payment (no-response): "socket hang up"',
      );
    });

    it('wraps non-Error thrown values into an Error', async () => {
      (mockedAxios.isAxiosError as unknown as jest.Mock).mockReturnValue(false);
      mockedAxios.get.mockRejectedValue('weird failure');

      await expect(service.getPaymentStatus('ext-1')).rejects.toThrow(
        'weird failure',
      );
    });
  });
});
