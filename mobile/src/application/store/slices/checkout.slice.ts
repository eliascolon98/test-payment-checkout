import { createSlice } from '@reduxjs/toolkit';
import type { Transaction } from '../../../domain/models';
import { processPayment } from '../../usecases/process-payment.usecase';

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
    resetCheckout: (state) => {
      state.status = 'idle';
      state.transaction = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.status = 'processing';
        state.errorMessage = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.status = 'success';
        state.transaction = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage =
          action.payload ?? 'The payment could not be processed';
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
