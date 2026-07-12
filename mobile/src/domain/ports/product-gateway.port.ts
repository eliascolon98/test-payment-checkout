import type { Product } from '../models';

export interface IProductGateway {
  fetchProducts(): Promise<Product[]>;
}
