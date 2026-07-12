import { Product } from '../../../../../domain/model/types/product.type';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      imageUrl: entity.imageUrl,
      stock: entity.stock,
    };
  }
}
