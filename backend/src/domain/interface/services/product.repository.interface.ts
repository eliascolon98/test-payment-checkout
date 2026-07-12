import { Product } from '../../model/types/product.type';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  updateStock(id: string, stock: number): Promise<void>;
}
