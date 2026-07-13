import type { Product } from '../../../domain/models';
import reducer, { clearCart, selectItem } from './cart.slice';

const product: Product = {
  id: 'p1',
  name: 'Headphones',
  description: 'Wireless',
  price: 100000,
  imageUrl: 'https://img/1.jpg',
  stock: 5,
};

describe('cart slice', () => {
  it('selects an item clamping the quantity to stock', () => {
    const state = reducer(undefined, selectItem({ product, quantity: 10 }));
    expect(state.item?.product.id).toBe('p1');
    expect(state.item?.quantity).toBe(5);
  });

  it('clears the cart', () => {
    const withItem = reducer(undefined, selectItem({ product, quantity: 2 }));
    const cleared = reducer(withItem, clearCart());
    expect(cleared.item).toBeNull();
  });
});
