import type { Gateways } from '../../domain/ports';
import { loadProducts } from './load-products.usecase';

describe('loadProducts use case', () => {
  const products = [{ id: 'p1' }];
  const extra = {
    productGateway: { fetchProducts: jest.fn().mockResolvedValue(products) },
    paymentGateway: {},
  } as unknown as Gateways;

  it('fetches products through the injected gateway', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    const result = await loadProducts()(dispatch, getState, extra);

    expect(extra.productGateway.fetchProducts).toHaveBeenCalledTimes(1);
    expect(result.payload).toEqual(products);
  });
});
