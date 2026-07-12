import { Repository } from 'typeorm';
import { TransactionStatus } from '../../../../../../domain/model/enum/transaction-status.enum';
import { Transaction } from '../../../../../../domain/model/types/transaction.type';
import { TransactionEntity } from '../../entities/transaction.entity';
import { TransactionMapper } from '../../mappers/transaction.mapper';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  const ormRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const repository = new TransactionRepository(
    ormRepository as unknown as Repository<TransactionEntity>,
  );

  const transaction: Transaction = {
    id: 'tx-1',
    reference: 'TX-ref',
    productId: 'product-1',
    quantity: 2,
    amountInCents: 200000,
    currency: 'COP',
    cardLastFour: '4242',
    cardBrand: 'VISA',
    status: TransactionStatus.PENDING,
    externalId: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('save converts the domain transaction to an entity', async () => {
    await repository.save(transaction);

    expect(ormRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'tx-1',
        amountInCents: '200000',
        status: TransactionStatus.PENDING,
      }),
    );
  });

  it('findById returns the mapped transaction when it exists', async () => {
    ormRepository.findOne.mockResolvedValue(
      TransactionMapper.toEntity(transaction),
    );

    const result = await repository.findById('tx-1');

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'tx-1' },
    });
    expect(result).toEqual(transaction);
  });

  it('findById returns null when the transaction does not exist', async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.findById('missing');

    expect(result).toBeNull();
  });

  it('findByReference queries by reference', async () => {
    ormRepository.findOne.mockResolvedValue(
      TransactionMapper.toEntity(transaction),
    );

    const result = await repository.findByReference('TX-ref');

    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { reference: 'TX-ref' },
    });
    expect(result?.reference).toBe('TX-ref');
  });

  it('findByReference returns null when not found', async () => {
    ormRepository.findOne.mockResolvedValue(null);

    const result = await repository.findByReference('missing');

    expect(result).toBeNull();
  });
});
