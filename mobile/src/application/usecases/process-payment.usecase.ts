import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CreatePaymentPayload, Transaction } from '../../domain/models';
import type { Gateways } from '../../domain/ports';

const POLL_ATTEMPTS = 10;
const POLL_DELAY_MS = 1500;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

/**
 * Use case: process a card payment.
 * Creates the transaction on the backend and polls its status until it
 * reaches a final state (APPROVED / DECLINED / ERROR) or the attempts run out.
 * Gateways are injected via the thunk extraArgument (hexagonal).
 */
export const processPayment = createAsyncThunk<
  Transaction,
  CreatePaymentPayload,
  { extra: Gateways; rejectValue: string }
>('checkout/processPayment', async (payload, { extra, rejectWithValue }) => {
  try {
    let transaction = await extra.paymentGateway.createPayment(payload);

    for (
      let attempt = 0;
      attempt < POLL_ATTEMPTS && transaction.status === 'PENDING';
      attempt += 1
    ) {
      await delay(POLL_DELAY_MS);
      transaction = await extra.paymentGateway.getTransactionStatus(
        transaction.id,
      );
    }

    return transaction;
  } catch {
    return rejectWithValue(
      'The payment could not be processed. Please try again.',
    );
  }
});
