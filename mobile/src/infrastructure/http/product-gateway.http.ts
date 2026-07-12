import type { IProductGateway } from '../../domain/ports/product-gateway.port';
import type { ApiResponse, Product } from '../../domain/models';
import { api } from './client';

export class HttpProductGateway implements IProductGateway {
  async fetchProducts(): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<Product[]>>('/products');
    return data.data;
  }
}
