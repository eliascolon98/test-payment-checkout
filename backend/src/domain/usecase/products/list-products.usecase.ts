import { IProductRepository } from '../../interface/services/product.repository.interface';
import { Product } from '../../model/types/product.type';

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
