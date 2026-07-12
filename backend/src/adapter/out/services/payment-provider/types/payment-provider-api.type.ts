export type TokenizeCardApiResponse = {
  data: {
    id: string;
    brand: string;
    last_four: string;
  };
};

export type TransactionApiResponse = {
  data: {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
    reference: string;
  };
};

export type MerchantApiResponse = {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
    };
  };
};
