import { Inject, Injectable } from '@nestjs/common';
import { ListProductsUseCase } from '../../domain/usecase/products/list-products.usecase';
import { Product } from '../../domain/model/types/product.type';
import { HTTPResponse } from '../../model/http-response.model';

@Injectable()
export class ListProductsHandler {
  constructor(
    @Inject('ListProductsUseCase')
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  async execute(): Promise<HTTPResponse<Product[]>> {
    const products = await this.listProductsUseCase.execute();
    return new HTTPResponse(
      'PRODUCTS_LISTED',
      'Products retrieved successfully',
      products,
    );
  }
}
