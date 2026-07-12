import { ListProductsUseCase } from '../../domain/usecase/products/list-products.usecase';
import { ListProductsHandler } from './list-products.handler';

describe('ListProductsHandler', () => {
  const useCase = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<ListProductsUseCase>;

  const handler = new ListProductsHandler(useCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps the products in a standard HTTP response', async () => {
    const products = [
      {
        id: 'product-1',
        name: 'Headphones',
        description: 'Wireless headphones',
        price: 35990000,
        imageUrl: 'https://images.test/1.jpg',
        stock: 10,
      },
    ];
    useCase.execute.mockResolvedValue(products);

    const response = await handler.execute();

    expect(response.code).toBe('PRODUCTS_LISTED');
    expect(response.message).toBe('Products retrieved successfully');
    expect(response.data).toEqual(products);
  });
});
