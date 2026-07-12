import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

const DEFAULT_PRODUCTS: Partial<ProductEntity>[] = [
  {
    name: 'Wireless Headphones',
    description:
      'Noise-cancelling over-ear headphones with 30 hours of battery life',
    price: 35990000,
    imageUrl: 'https://picsum.photos/id/367/400/400',
    stock: 15,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor and GPS',
    price: 52990000,
    imageUrl: 'https://picsum.photos/id/175/400/400',
    stock: 10,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with hot-swappable switches',
    price: 28990000,
    imageUrl: 'https://picsum.photos/id/60/400/400',
    stock: 20,
  },
  {
    name: 'Portable Speaker',
    description: 'Waterproof bluetooth speaker with 360-degree sound',
    price: 18990000,
    imageUrl: 'https://picsum.photos/id/145/400/400',
    stock: 25,
  },
  {
    name: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with 16000 DPI optical sensor',
    price: 12990000,
    imageUrl: 'https://picsum.photos/id/96/400/400',
    stock: 30,
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, SD card reader and fast charging',
    price: 9990000,
    imageUrl: 'https://picsum.photos/id/2/400/400',
    stock: 40,
  },
];

@Injectable()
export class ProductSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductSeedService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const count = await this.repository.count();

    if (count > 0) {
      return;
    }

    await this.repository.save(DEFAULT_PRODUCTS);
    this.logger.log(`Seeded ${DEFAULT_PRODUCTS.length} products`);
  }
}
