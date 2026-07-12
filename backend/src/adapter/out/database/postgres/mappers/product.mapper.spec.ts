import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from './product.mapper';

describe('ProductMapper', () => {
  it('maps an entity to a domain product', () => {
    const entity = new ProductEntity();
    entity.id = 'product-1';
    entity.name = 'Headphones';
    entity.description = 'Wireless headphones';
    entity.price = 35990000;
    entity.imageUrl = 'https://images.test/1.jpg';
    entity.stock = 10;

    const product = ProductMapper.toDomain(entity);

    expect(product).toEqual({
      id: 'product-1',
      name: 'Headphones',
      description: 'Wireless headphones',
      price: 35990000,
      imageUrl: 'https://images.test/1.jpg',
      stock: 10,
    });
  });
});
