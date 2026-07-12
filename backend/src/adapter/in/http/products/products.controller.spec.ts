import { ListProductsHandler } from '../../../../handler/products/list-products.handler';
import { HTTPResponse } from '../../../../model/http-response.model';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  const handler = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<ListProductsHandler>;

  const controller = new ProductsController(handler);

  it('delegates to the list products handler', async () => {
    const response = new HTTPResponse('PRODUCTS_LISTED', 'ok', []);
    handler.execute.mockResolvedValue(response);

    const result = await controller.listProducts();

    expect(result).toBe(response);
    expect(handler.execute).toHaveBeenCalledTimes(1);
  });
});
