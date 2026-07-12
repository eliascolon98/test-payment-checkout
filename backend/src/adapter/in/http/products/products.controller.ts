import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from '../../../../domain/model/types/product.type';
import { ListProductsHandler } from '../../../../handler/products/list-products.handler';
import { HTTPResponse } from '../../../../model/http-response.model';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly listProductsHandler: ListProductsHandler) {}

  @Get()
  @ApiOperation({ summary: 'List the product catalog with current stock' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  async listProducts(): Promise<HTTPResponse<Product[]>> {
    return this.listProductsHandler.execute();
  }
}
