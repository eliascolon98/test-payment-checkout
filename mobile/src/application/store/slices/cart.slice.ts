import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../../domain/models';
import { clampQuantity } from '../../../domain/rules/stock';

type CartState = {
  item: CartItem | null;
};

const initialState: CartState = {
  item: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    selectItem: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload;
      state.item = {
        product,
        quantity: clampQuantity(quantity, product.stock),
      };
    },
    clearCart: (state) => {
      state.item = null;
    },
  },
});

export const { selectItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
