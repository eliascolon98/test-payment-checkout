import { Controller, Get } from '@nestjs/common';
import { Product } from '../../../../domain/model/types/product.type';
import { ListProductsHandler } from '../../../../handler/products/list-products.handler';
import { HTTPResponse } from '../../../../model/http-response.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly listProductsHandler: ListProductsHandler) {}

  @Get()
  async listProducts(): Promise<HTTPResponse<Product[]>> {
    return this.listProductsHandler.execute();
  }
}
