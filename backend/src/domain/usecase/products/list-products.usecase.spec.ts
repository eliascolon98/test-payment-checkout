import { type IProductRepository } from '../../interface/services/product.repository.interface';
import { Product } from '../../model/types/product.type';
import { ListProductsUseCase } from './list-products.usecase';

describe('ListProductsUseCase', () => {
  const productRepository: jest.Mocked<IProductRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    updateStock: jest.fn(),
  };

  const useCase = new ListProductsUseCase(productRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the products from the repository', async () => {
    const products: Product[] = [
      {
        id: 'product-1',
        name: 'Headphones',
        description: 'Wireless headphones',
        price: 35990000,
        imageUrl: 'https://images.test/1.jpg',
        stock: 10,
      },
    ];
    productRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result).toEqual(products);
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list when there are no products', async () => {
    productRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
