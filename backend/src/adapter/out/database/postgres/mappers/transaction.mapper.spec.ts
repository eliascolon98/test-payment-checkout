import { TransactionStatus } from '../../../../../domain/model/enum/transaction-status.enum';
import { Transaction } from '../../../../../domain/model/types/transaction.type';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
  const domain: Transaction = {
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

  it('converts amountInCents to string when mapping to entity (bigint column)', () => {
    const entity = TransactionMapper.toEntity(domain);

    expect(entity.amountInCents).toBe('200000');
    expect(entity.id).toBe('tx-1');
    expect(entity.status).toBe(TransactionStatus.PENDING);
    expect(entity.externalId).toBeNull();
  });

  it('converts amountInCents back to number when mapping to domain', () => {
    const entity = TransactionMapper.toEntity(domain);

    const result = TransactionMapper.toDomain(entity);

    expect(result).toEqual(domain);
    expect(typeof result.amountInCents).toBe('number');
  });
});
