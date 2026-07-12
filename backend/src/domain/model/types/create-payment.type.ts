export type CreatePaymentRequest = {
  reference: string;
  amountInCents: number;
  currency: string;
  cardToken: string;
  installments: number;
  customerEmail: string;
};
