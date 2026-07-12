import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { ProductRepository } from './repositories/product/product.repository';
import { TransactionRepository } from './repositories/transaction/transaction.repository';
import { ProductSeedService } from './seeds/product-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, TransactionEntity])],
  providers: [ProductRepository, TransactionRepository, ProductSeedService],
  exports: [ProductRepository, TransactionRepository],
})
export class PostgresModule {}
