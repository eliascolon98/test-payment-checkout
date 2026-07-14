import type { Product } from '../../../domain/models';
import { loadProducts } from '../../usecases/load-products.usecase';
import reducer from './products.slice';

const products: Product[] = [
  {
    id: 'p1',
    name: 'Headphones',
    description: 'Wireless',
    price: 100000,
    imageUrl: 'https://img/1.jpg',
    stock: 5,
  },
];

describe('products slice', () => {
  it('sets loading on pending', () => {
    const state = reducer(undefined, { type: loadProducts.pending.type });
    expect(state.status).toBe('loading');
  });

  it('stores items on fulfilled', () => {
    const state = reducer(undefined, {
      type: loadProducts.fulfilled.type,
      payload: products,
    });
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(1);
  });

  it('sets error message on rejected', () => {
    const state = reducer(undefined, {
      type: loadProducts.rejected.type,
      error: { message: 'boom' },
    });
    expect(state.status).toBe('failed');
    expect(state.errorMessage).toBe('boom');
  });
});
