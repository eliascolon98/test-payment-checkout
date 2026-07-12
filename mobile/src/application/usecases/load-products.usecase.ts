import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '../../domain/models';
import type { Gateways } from '../../domain/ports';

/**
 * Use case: load the product catalog.
 * The gateway is injected through the thunk extraArgument, so this use case
 * depends on the IProductGateway port and not on any HTTP implementation.
 */
export const loadProducts = createAsyncThunk<
  Product[],
  void,
  { extra: Gateways }
>('products/load', async (_, { extra }) => {
  return extra.productGateway.fetchProducts();
});
