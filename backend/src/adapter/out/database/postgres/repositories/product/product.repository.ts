import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type IProductRepository } from '../../../../../../domain/interface/services/product.repository.interface';
import { Product } from '../../../../../../domain/model/types/product.type';
import { ProductEntity } from '../../entities/product.entity';
import { ProductMapper } from '../../mappers/product.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ProductMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async updateStock(id: string, stock: number): Promise<void> {
    await this.repository.update({ id }, { stock });
  }
}
