import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductSeedService } from './product-seed.service';

describe('ProductSeedService', () => {
  const ormRepository = {
    count: jest.fn(),
    save: jest.fn(),
  };

  const service = new ProductSeedService(
    ormRepository as unknown as Repository<ProductEntity>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing when products already exist', async () => {
    ormRepository.count.mockResolvedValue(6);

    await service.onApplicationBootstrap();

    expect(ormRepository.save).not.toHaveBeenCalled();
  });

  it('seeds the default products when the table is empty', async () => {
    ormRepository.count.mockResolvedValue(0);

    await service.onApplicationBootstrap();

    expect(ormRepository.save).toHaveBeenCalledTimes(1);
    const seeded = (
      ormRepository.save.mock.calls[0] as [Partial<ProductEntity>[]]
    )[0];
    expect(seeded.length).toBeGreaterThan(0);
    expect(seeded[0].name).toBeDefined();
    expect(seeded[0].stock).toBeGreaterThan(0);
  });
});
