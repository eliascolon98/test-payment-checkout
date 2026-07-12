import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../../../domain/models';

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

type CheckoutState = {
  status: CheckoutStatus;
  transaction: Transaction | null;
  errorMessage: string | null;
};

const initialState: CheckoutState = {
  status: 'idle',
  transaction: null,
  errorMessage: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    paymentStarted: (state) => {
      state.status = 'processing';
      state.errorMessage = null;
    },
    paymentSucceeded: (state, action: PayloadAction<Transaction>) => {
      state.status = 'success';
      state.transaction = action.payload;
      state.errorMessage = null;
    },
    paymentFailed: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.errorMessage = action.payload;
    },
    resetCheckout: (state) => {
      state.status = 'idle';
      state.transaction = null;
      state.errorMessage = null;
    },
  },
});

export const {
  paymentStarted,
  paymentSucceeded,
  paymentFailed,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
