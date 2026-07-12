export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'ERROR'
  | 'VOIDED';

export type DeliveryStatus = 'NOT_ASSIGNED' | 'ASSIGNED';

export type Transaction = {
  id: string;
  reference: string;
  productId: string;
  quantity: number;
  amountInCents: number;
  currency: string;
  cardLastFour: string;
  cardBrand: string;
  customerEmail: string;
  deliveryStatus: DeliveryStatus;
  status: TransactionStatus;
  externalId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CardData = {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
};

export type CreatePaymentPayload = {
  productId: string;
  quantity: number;
  customerEmail: string;
  installments?: number;
  card: CardData;
};

export type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};
