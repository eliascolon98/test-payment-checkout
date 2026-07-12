import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type ITransactionRepository } from '../../../../../../domain/interface/services/transaction.repository.interface';
import { Transaction } from '../../../../../../domain/model/types/transaction.type';
import { TransactionEntity } from '../../entities/transaction.entity';
import { TransactionMapper } from '../../mappers/transaction.mapper';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async save(transaction: Transaction): Promise<void> {
    const entity = TransactionMapper.toEntity(transaction);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { reference } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }
}
