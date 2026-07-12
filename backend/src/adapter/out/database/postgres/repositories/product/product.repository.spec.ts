import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductRepository } from './product.repository';

describe('ProductRepository', () => {
  const ormRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const repository = new ProductRepository(
    ormRepository as unknown as Repository<ProductEntity>,
  );

  const entity = Object.assign(new ProductEntity(), {
    id: 'product-1',
    name: 'Headphones',
    description: 'Wireless headphones',
    price: 35990000,
    imageUrl: 'https://images.test/1.jpg',
    stock: 10,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll maps every entity to a domain product', async () => {
    ormRepository.find.mockResolvedValue([entity]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('product-1');
    expect(result[0].stock).toBe(10);
  });

  it('findById returns the mapped product when it exists', async () => {
    ormRepository.findOne.mockResolvedValue(entity);

    const result = await repository.findById('product-1');

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'product-1' },
    });
    expect(result?.name).toBe('Headphones');
  });

  it('findById returns null when the product does not exist', async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.findById('missing');

    expect(result).toBeNull();
  });

  it('updateStock updates only the stock column', async () => {
    await repository.updateStock('product-1', 7);

    expect(ormRepository.update).toHaveBeenCalledWith(
      { id: 'product-1' },
      { stock: 7 },
    );
  });
});
