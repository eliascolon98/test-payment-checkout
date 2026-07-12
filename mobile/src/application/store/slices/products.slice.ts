import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../../domain/models';
import { loadProducts } from '../../usecases/load-products.usecase';

type ProductsState = {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorMessage: string | null;
};

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  errorMessage: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage =
          action.error.message ?? 'Could not load the products';
      });
  },
});

export default productsSlice.reducer;
