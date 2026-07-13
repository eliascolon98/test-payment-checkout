import { createSlice } from '@reduxjs/toolkit';
import type { Transaction } from '../../../domain/models';
import { processPayment } from '../../usecases/process-payment.usecase';

type HistoryState = {
  items: Transaction[];
};

const initialState: HistoryState = {
  items: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(processPayment.fulfilled, (state, action) => {
      const transaction = action.payload;
      const exists = state.items.some((t) => t.id === transaction.id);
      if (!exists) {
        state.items.unshift(transaction);
      }
    });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
