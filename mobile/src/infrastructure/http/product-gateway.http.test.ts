import { api } from './client';
import { HttpProductGateway } from './product-gateway.http';

jest.mock('./client', () => ({ api: { get: jest.fn() } }));

const mockedApi = api as unknown as { get: jest.Mock };

describe('HttpProductGateway', () => {
  const gateway = new HttpProductGateway();

  it('fetchProducts gets /products and unwraps data', async () => {
    mockedApi.get.mockResolvedValue({ data: { data: [{ id: 'p1' }] } });

    const result = await gateway.fetchProducts();

    expect(mockedApi.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual([{ id: 'p1' }]);
  });
});
